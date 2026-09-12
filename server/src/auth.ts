import type { Role } from "./index";

export type AuthenticatedUser = {
  id: string;
  role: Role;
  email: string | null;
  username: string | null;
};

type UserRow = AuthenticatedUser & {
  status: string;
  password_hash: string | null;
  password_salt: string | null;
};

type TokenRow = {
  id: string;
  user_id: string;
  expires_at: number;
  consumed_at: number | null;
  role: Role;
  email: string | null;
  username: string | null;
  status: string;
};

const textEncoder = new TextEncoder();
const EMAIL_TOKEN_TTL_MS = 15 * 60 * 1000;
const STUDENT_ACTIVATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
/*
 * Cloudflare Workers 把单次 PBKDF2 的迭代次数硬性限制在 100000，超过直接抛
 * NotSupportedError（本地 Miniflare 不强制，所以这个问题只在真实环境暴露）。
 * 单次 10 万低于现在的通行建议，所以把同一次派生串联多轮：每轮把上一轮的输出
 * 当作下一轮的输入，有效工作量是各轮之和，而每一轮都不触碰平台上限。
 */
const PASSWORD_ITERATIONS = 100_000;
const PASSWORD_ROUNDS = 3;
/* 早于串联方案的哈希是单轮 210000。它们在 Workers 上根本算不出来，
   但格式要认得——否则将来再改参数又会把已有密码全部作废。 */
const LEGACY_PASSWORD_ITERATIONS = 210_000;
const LEGACY_PASSWORD_ROUNDS = 1;
const EMAIL_START_MAX_ATTEMPTS = 5;
/*
 * 学生激活和登录的尝试上限。
 *
 * 原来是 5 次。太紧了：老师念错一位、学生抄串一行就能耗掉，然后被挡 15 分钟，
 * 而提示只说「稍后再试」，不说等多久，看起来就像系统坏了。
 * 激活码是 32^6 ≈ 10.7 亿，10 次/15 分钟 ≈ 每天 960 次，平均仍需上千年才可能撞出来；
 * 密码由学生自己设且至少 10 位，真正的防线是长度而不是这几次的差别。
 */
const STUDENT_AUTH_MAX_ATTEMPTS = 10;
const AUTH_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

export class AuthError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message: string,
    public readonly extra: Record<string, unknown> = {}
  ) {
    super(message);
  }
}

export function publicUser(user: AuthenticatedUser) {
  return { id: user.id, role: user.role, email: user.email, username: user.username };
}

export function cookieHeader(token: string, env: Env, expiresAt: number): string {
  const attributes = [
    `seedtocode_session=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))}`
  ];
  if (env.ENVIRONMENT === "production") attributes.push("Secure");
  return attributes.join("; ");
}

export function expiredCookieHeader(env: Env): string {
  return cookieHeader("", env, 0);
}

export async function startEmailLogin(
  db: D1Database,
  env: Env,
  input: unknown
): Promise<{ developmentToken?: string }> {
  const body = objectBody(input);
  const email = normaliseEmail(body.email);
  const role = emailRole(body.role);
  const now = Date.now();
  if (!(await allowAttempt(db, "email_start", email, EMAIL_START_MAX_ATTEMPTS, now)).allowed) return {};
  const existing = await db.prepare(
    "SELECT id, role, email, username, status, password_hash, password_salt FROM users WHERE email = ?1"
  ).bind(email).first<UserRow>();

  let userId: string;
  if (!existing) {
    userId = crypto.randomUUID();
    await db.prepare(
      "INSERT INTO users (id, email, role, status, created_at, updated_at) VALUES (?1, ?2, ?3, 'active', ?4, ?4)"
    ).bind(userId, email, role, now).run();
  } else {
    // Do not let this route reveal whether an address belongs to a student or another role.
    if (existing.role === "student" || existing.role !== role || existing.status !== "active") return {};
    userId = existing.id;
  }

  const token = randomToken();
  const tokenHash = await digest(token);
  await db.batch([
    db.prepare("DELETE FROM auth_tokens WHERE user_id = ?1 AND purpose = 'email_login' AND consumed_at IS NULL").bind(userId),
    db.prepare(
      "INSERT INTO auth_tokens (id, user_id, purpose, token_hash, expires_at, created_at) VALUES (?1, ?2, 'email_login', ?3, ?4, ?5)"
    ).bind(crypto.randomUUID(), userId, tokenHash, now + EMAIL_TOKEN_TTL_MS, now)
  ]);

  if (env.ENVIRONMENT === "development") return { developmentToken: token };
  await sendMagicLink(env, email, token);
  return {};
}

export async function verifyEmailLogin(db: D1Database, env: Env, input: unknown) {
  const body = objectBody(input);
  const token = requiredString(body.token, "登录链接无效。", "INVALID_TOKEN");
  const now = Date.now();
  const row = await db.prepare(
    `SELECT auth_tokens.id, auth_tokens.user_id, auth_tokens.expires_at, auth_tokens.consumed_at,
            users.role, users.email, users.username, users.status
       FROM auth_tokens JOIN users ON users.id = auth_tokens.user_id
      WHERE auth_tokens.token_hash = ?1 AND auth_tokens.purpose = 'email_login'`
  ).bind(await digest(token)).first<TokenRow>();

  if (!row || row.consumed_at || row.expires_at <= now || row.status !== "active" || row.role === "student") {
    throw new AuthError("INVALID_TOKEN", 401, "登录链接无效或已过期。");
  }
  await db.prepare("UPDATE auth_tokens SET consumed_at = ?1 WHERE id = ?2 AND consumed_at IS NULL").bind(now, row.id).run();
  const session = await createSession(db, row.user_id);
  return { user: publicUser(tokenUser(row)), setCookie: cookieHeader(session.token, env, session.expiresAt) };
}

export async function activateStudent(db: D1Database, env: Env, input: unknown) {
  const body = objectBody(input);
  const username = normaliseUsername(body.username);
  const candidates = activationCodeCandidates(body.activationCode);
  const password = passwordInput(body.password);
  const now = Date.now();
  const gate = await allowAttempt(db, "student_activate", username, STUDENT_AUTH_MAX_ATTEMPTS, now);
  if (!gate.allowed) throw throttled(gate.retryAfterSeconds);
  let row: TokenRow | null = null;
  for (const candidate of candidates) {
    row = await db.prepare(
      `SELECT auth_tokens.id, auth_tokens.user_id, auth_tokens.expires_at, auth_tokens.consumed_at,
              users.role, users.email, users.username, users.status
         FROM auth_tokens JOIN users ON users.id = auth_tokens.user_id
        WHERE users.username = ?1 AND auth_tokens.token_hash = ?2 AND auth_tokens.purpose = 'student_activation'`
    ).bind(username, await digest(candidate)).first<TokenRow>();
    if (row) break;
  }

  if (!row || row.consumed_at || row.expires_at <= now || row.role !== "student" || row.status !== "pending_activation") {
    throw new AuthError("INVALID_ACTIVATION_CODE", 401, "用户名或激活码无效。");
  }
  const passwordSalt = randomToken();
  const passwordHash = encodePasswordHash(await passwordDigest(password, passwordSalt));
  await db.batch([
    db.prepare("UPDATE auth_tokens SET consumed_at = ?1 WHERE id = ?2 AND consumed_at IS NULL").bind(now, row.id),
    db.prepare(
      "UPDATE users SET password_hash = ?1, password_salt = ?2, status = 'active', updated_at = ?3 WHERE id = ?4"
    ).bind(passwordHash, passwordSalt, now, row.user_id)
  ]);
  await clearAttempts(db, "student_activate", username);
  const session = await createSession(db, row.user_id);
  return { user: publicUser(tokenUser(row)), setCookie: cookieHeader(session.token, env, session.expiresAt) };
}

export async function createPendingStudent(db: D1Database, usernameInput: unknown): Promise<{ user: AuthenticatedUser; activationCode: string }> {
  const username = normaliseUsername(usernameInput);
  const existing = await db.prepare("SELECT id FROM users WHERE username = ?1").bind(username).first<{ id: string }>();
  if (existing) throw new AuthError("USERNAME_TAKEN", 409, "该用户名已被使用。");
  const now = Date.now();
  const user: AuthenticatedUser = { id: crypto.randomUUID(), role: "student", email: null, username };
  const activationCode = newActivationCode();
  await db.batch([
    db.prepare(
      "INSERT INTO users (id, username, role, status, created_at, updated_at) VALUES (?1, ?2, 'student', 'pending_activation', ?3, ?3)"
    ).bind(user.id, username, now),
    db.prepare(
      "INSERT INTO auth_tokens (id, user_id, purpose, token_hash, expires_at, created_at) VALUES (?1, ?2, 'student_activation', ?3, ?4, ?5)"
    ).bind(crypto.randomUUID(), user.id, await digest(activationCode), now + STUDENT_ACTIVATION_TTL_MS, now)
  ]);
  return { user, activationCode };
}

/**
 * 直接建一个已激活的学生账号：自己定用户名和密码，不经过激活码。
 * 班级归属由调用方负责——这里只管凭据。
 */
export async function createActiveStudent(db: D1Database, usernameInput: unknown, passwordInputValue: unknown) {
  const username = normaliseUsername(usernameInput);
  const password = passwordInput(passwordInputValue);
  const existing = await db.prepare("SELECT id FROM users WHERE username = ?1").bind(username).first<{ id: string }>();
  if (existing) throw new AuthError("USERNAME_TAKEN", 409, "这个用户名已经有人用了，换一个。");
  const now = Date.now();
  const user: AuthenticatedUser = { id: crypto.randomUUID(), role: "student", email: null, username };
  const passwordSalt = randomToken();
  const passwordHash = encodePasswordHash(await passwordDigest(password, passwordSalt));
  await db.prepare(
    "INSERT INTO users (id, username, role, status, password_hash, password_salt, created_at, updated_at) VALUES (?1, ?2, 'student', 'active', ?3, ?4, ?5, ?5)"
  ).bind(user.id, username, passwordHash, passwordSalt, now).run();
  return user;
}

/** 建会话并返回可直接写回浏览器的 cookie。 */
export async function startSession(db: D1Database, env: Env, userId: string) {
  const session = await createSession(db, userId);
  return cookieHeader(session.token, env, session.expiresAt);
}

/** 限流原语，给 auth 之外的注册入口复用。 */
export async function allowAuthAttempt(db: D1Database, scope: string, identifier: string, maximum: number) {
  return allowAttempt(db, scope, identifier, maximum, Date.now());
}

/** 「等多久」要说出来。只说「稍后再试」的话，被挡住的人只会继续点。 */
export function throttled(retryAfterSeconds: number): AuthError {
  const minutes = Math.ceil(retryAfterSeconds / 60);
  return new AuthError(
    "AUTH_THROTTLED", 429,
    "尝试次数过多，请 " + minutes + " 分钟后再试。",
    { retryAfterSeconds }
  );
}

export async function clearAuthAttempts(db: D1Database, scope: string, identifier: string): Promise<void> {
  return clearAttempts(db, scope, identifier);
}

export async function resetStudentCredentials(db: D1Database, student: AuthenticatedUser): Promise<{ activationCode: string }> {
  if (student.role !== "student") throw new AuthError("INVALID_STUDENT", 400, "学生账号不正确。");
  const now = Date.now();
  const activationCode = newActivationCode();
  await db.batch([
    db.prepare("DELETE FROM sessions WHERE user_id = ?1").bind(student.id),
    db.prepare("UPDATE auth_tokens SET consumed_at = ?1 WHERE user_id = ?2 AND purpose = 'student_activation' AND consumed_at IS NULL")
      .bind(now, student.id),
    db.prepare("UPDATE users SET status = 'pending_activation', password_hash = NULL, password_salt = NULL, updated_at = ?1 WHERE id = ?2 AND role = 'student'")
      .bind(now, student.id),
    db.prepare(
      "INSERT INTO auth_tokens (id, user_id, purpose, token_hash, expires_at, created_at) VALUES (?1, ?2, 'student_activation', ?3, ?4, ?5)"
    ).bind(crypto.randomUUID(), student.id, await digest(activationCode), now + STUDENT_ACTIVATION_TTL_MS, now)
  ]);
  return { activationCode };
}

export async function loginStudent(db: D1Database, env: Env, input: unknown) {
  const body = objectBody(input);
  const username = normaliseUsername(body.username);
  const password = passwordInput(body.password, false);
  const now = Date.now();
  const gate = await allowAttempt(db, "student_login", username, STUDENT_AUTH_MAX_ATTEMPTS, now);
  if (!gate.allowed) throw throttled(gate.retryAfterSeconds);
  const user = await db.prepare(
    "SELECT id, role, email, username, status, password_hash, password_salt FROM users WHERE username = ?1"
  ).bind(username).first<UserRow>();
  if (!user || user.role !== "student" || user.status !== "active" || !user.password_hash || !user.password_salt) {
    throw new AuthError("INVALID_CREDENTIALS", 401, "用户名或密码不正确。");
  }
  const stored = decodePasswordHash(user.password_hash);
  let candidateHash: string;
  try {
    candidateHash = await passwordDigest(password, user.password_salt, stored.iterations, stored.rounds);
  } catch {
    // 存的参数这个运行时算不出来（比如早于平台上限的旧哈希）。
    // 这是凭据问题，不是服务器故障——按密码不对处理，别抛成 500。
    throw new AuthError("INVALID_CREDENTIALS", 401, "用户名或密码不正确。");
  }
  if (!constantTimeEqual(candidateHash, stored.hex)) {
    throw new AuthError("INVALID_CREDENTIALS", 401, "用户名或密码不正确。");
  }
  await clearAttempts(db, "student_login", username);
  const session = await createSession(db, user.id);
  return { user: publicUser(user), setCookie: cookieHeader(session.token, env, session.expiresAt) };
}

export async function currentUser(db: D1Database, request: Request): Promise<AuthenticatedUser | null> {
  const token = cookieValue(request.headers.get("cookie"), "seedtocode_session");
  if (!token) return null;
  const now = Date.now();
  const user = await db.prepare(
    `SELECT users.id, users.role, users.email, users.username
       FROM sessions JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = ?1 AND sessions.expires_at > ?2 AND users.status = 'active'`
  ).bind(await digest(token), now).first<AuthenticatedUser>();
  return user ?? null;
}

export async function logout(db: D1Database, request: Request): Promise<void> {
  const token = cookieValue(request.headers.get("cookie"), "seedtocode_session");
  if (token) await db.prepare("DELETE FROM sessions WHERE token_hash = ?1").bind(await digest(token)).run();
}

function objectBody(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new AuthError("INVALID_REQUEST", 400, "请求内容不正确。");
  return input as Record<string, unknown>;
}

function tokenUser(row: TokenRow): AuthenticatedUser {
  return { id: row.user_id, role: row.role, email: row.email, username: row.username };
}

function normaliseEmail(value: unknown): string {
  const email = requiredString(value, "请输入有效的邮箱地址。", "INVALID_EMAIL").trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AuthError("INVALID_EMAIL", 400, "请输入有效的邮箱地址。");
  return email;
}

function emailRole(value: unknown): "teacher" | "learner" {
  if (value === "teacher" || value === "learner") return value;
  throw new AuthError("INVALID_ROLE", 400, "请选择老师或个人学习者身份。");
}

function normaliseUsername(value: unknown): string {
  const username = requiredString(value, "请输入用户名。", "INVALID_USERNAME").trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(username)) throw new AuthError("INVALID_USERNAME", 400, "用户名需为 3–32 位字母、数字或 . _ - 。");
  return username;
}

function passwordInput(value: unknown, enforceLength = true): string {
  const password = requiredString(value, "请输入密码。", "INVALID_PASSWORD");
  if (enforceLength && (password.length < 10 || password.length > 256)) throw new AuthError("INVALID_PASSWORD", 400, "密码需为 10–256 个字符。");
  return password;
}

function requiredString(value: unknown, message: string, code: string): string {
  if (typeof value !== "string" || value.length === 0) throw new AuthError(code, 400, message);
  return value;
}

async function createSession(db: D1Database, userId: string) {
  const token = randomToken();
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;
  await db.prepare(
    "INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at) VALUES (?1, ?2, ?3, ?4, ?5)"
  ).bind(crypto.randomUUID(), userId, await digest(token), expiresAt, now).run();
  return { token, expiresAt };
}

async function sendMagicLink(env: Env, email: string, token: string): Promise<void> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.APP_ORIGIN) throw new AuthError("EMAIL_NOT_CONFIGURED", 503, "邮箱登录暂未配置，请稍后再试。");
  const origin = new URL(env.APP_ORIGIN).origin;
  const link = `${origin}/?authToken=${encodeURIComponent(token)}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [email],
      subject: "登录 SeedToCode",
      html: `<p>点击下方链接登录 SeedToCode。链接将在 15 分钟后失效。</p><p><a href="${link}">登录 SeedToCode</a></p>`
    })
  });
  if (!response.ok) throw new AuthError("EMAIL_DELIVERY_FAILED", 503, "登录邮件暂时无法发送，请稍后再试。");
}

async function digest(value: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", textEncoder.encode(value));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

type AttemptResult = { allowed: boolean; retryAfterSeconds: number };

async function allowAttempt(db: D1Database, scope: string, identifier: string, maximum: number, now: number): Promise<AttemptResult> {
  const keyHash = await digest(scope + "\u0000" + identifier);
  await db.prepare("DELETE FROM auth_rate_limits WHERE updated_at <= ?1").bind(now - AUTH_ATTEMPT_WINDOW_MS * 2).run();
  await db.prepare(
    "INSERT INTO auth_rate_limits (key_hash, scope, window_started_at, attempts, updated_at) VALUES (?1, ?2, ?3, 1, ?3) ON CONFLICT(key_hash) DO UPDATE SET window_started_at = CASE WHEN auth_rate_limits.window_started_at <= ?4 THEN excluded.window_started_at ELSE auth_rate_limits.window_started_at END, attempts = CASE WHEN auth_rate_limits.window_started_at <= ?4 THEN 1 ELSE auth_rate_limits.attempts + 1 END, updated_at = excluded.updated_at"
  ).bind(keyHash, scope, now, now - AUTH_ATTEMPT_WINDOW_MS).run();
  const row = await db.prepare("SELECT attempts, window_started_at FROM auth_rate_limits WHERE key_hash = ?1")
    .bind(keyHash).first<{ attempts: number; window_started_at: number }>();
  const attempts = row?.attempts ?? maximum + 1;
  if (attempts <= maximum) return { allowed: true, retryAfterSeconds: 0 };
  // 告诉调用方还要等多久：不说清楚的话，被挡住的人只会一直重试
  const windowEnds = (row?.window_started_at ?? now) + AUTH_ATTEMPT_WINDOW_MS;
  return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((windowEnds - now) / 1000)) };
}

async function clearAttempts(db: D1Database, scope: string, identifier: string): Promise<void> {
  const keyHash = await digest(scope + "\u0000" + identifier);
  await db.prepare("DELETE FROM auth_rate_limits WHERE key_hash = ?1").bind(keyHash).run();
}

async function deriveOnce(material: BufferSource, salt: string, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", material, "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: textEncoder.encode(salt), iterations }, key, 256
  );
  return new Uint8Array(bits);
}

async function passwordDigest(password: string, salt: string, iterations = PASSWORD_ITERATIONS, rounds = PASSWORD_ROUNDS): Promise<string> {
  let material: BufferSource = textEncoder.encode(password);
  for (let round = 0; round < rounds; round += 1) material = await deriveOnce(material, salt, iterations);
  return [...new Uint8Array(material as Uint8Array)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/* 哈希连同参数一起存：`pbkdf2$<轮数>x<每轮迭代>$<十六进制>`。
   以后再调参数，旧密码仍然验得出来，不会像激活码那次一样一刀切断。 */
function encodePasswordHash(hex: string, iterations = PASSWORD_ITERATIONS, rounds = PASSWORD_ROUNDS): string {
  return `pbkdf2$${rounds}x${iterations}$${hex}`;
}

function decodePasswordHash(stored: string): { hex: string; iterations: number; rounds: number } {
  const parts = stored.split("$");
  if (parts.length === 3 && parts[0] === "pbkdf2") {
    const [rounds, iterations] = parts[1].split("x").map(Number);
    if (Number.isSafeInteger(rounds) && Number.isSafeInteger(iterations)) return { hex: parts[2], iterations, rounds };
  }
  return { hex: stored, iterations: LEGACY_PASSWORD_ITERATIONS, rounds: LEGACY_PASSWORD_ROUNDS };
}

/*
 * 激活码是老师念给学生、学生手抄进去的，所以不能用 randomToken()——那是 43 位
 * 混着大小写和 - _ 的串，抄不对。这里用 6 位无歧义字符：字母表去掉了
 * I O 0 1，念出来不会听错，也不用区分大小写。
 *
 * 强度：32^6 ≈ 10.7 亿。激活按用户名限流（15 分钟 5 次），
 * 平均需要约 5 亿次尝试，按这个速率是几千年；而且它一次性、7 天过期。
 */
const ACTIVATION_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ACTIVATION_CODE_LENGTH = 6;

function newActivationCode(): string {
  const bytes = new Uint8Array(ACTIVATION_CODE_LENGTH);
  crypto.getRandomValues(bytes);
  // 256 是 32 的整数倍，取模不会让任何字符更容易出现
  return Array.from(bytes, (byte) => ACTIVATION_ALPHABET[byte % ACTIVATION_ALPHABET.length]).join("");
}

/*
 * 学生可能抄成小写、或者带上念的时候加的空格和横线，所以要归一。
 *
 * 但归一不能是唯一的形状：更早发出去的激活码是 43 位 base64url，里面本来就含
 * `-` 和 `_`，也区分大小写——只按归一后的形状去比，那些码会在一次部署之后
 * 凭空失效，而且看起来就像「码输错了」，学生和老师都无从判断。
 * 所以两种形状都试一遍：先按归一的比，再按原样比。
 */
function activationCodeCandidates(value: unknown): string[] {
  const raw = requiredString(value, "激活码无效。", "INVALID_ACTIVATION_CODE").trim();
  const normalised = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!normalised && !raw) throw new AuthError("INVALID_ACTIVATION_CODE", 400, "激活码无效。");
  return normalised && normalised !== raw ? [normalised, raw] : [raw];
}

function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function cookieValue(header: string | null, name: string): string | null {
  if (!header) return null;
  const prefix = `${name}=`;
  for (const item of header.split(";")) {
    const trimmed = item.trim();
    if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
  }
  return null;
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}
