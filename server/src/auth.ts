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
  pending_password_hash?: string | null;
  pending_password_salt?: string | null;
  registration_ip_hash?: string | null;
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
/* 非学生账号必须先付出邮件成本，不能只按邮箱限流。来源 IP 只是短期风险
   信号，不是身份：学生班级码流程不走这里，教室共用出口不会受影响。 */
const EMAIL_REGISTER_IP_MAX_ATTEMPTS = 3;
const EMAIL_VERIFIED_IP_MAX_ACCOUNTS = 3;
const EMAIL_VERIFIED_IP_WINDOW_MS = 24 * 60 * 60 * 1000;
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
  if (env.ENVIRONMENT !== "development") attributes.push("Secure");
  return attributes.join("; ");
}

export function expiredCookieHeader(env: Env): string {
  return cookieHeader("", env, 0);
}

/*
 * 邮箱注册。密码在这里**不写进 users**，只挂在一次性 token 那一行上。
 *
 * 以前是当场写：新密码进 users、状态降成 pending_email，然后才发信。于是任何人
 * 拿一个已知邮箱发一次请求，就能把那个账号的密码换掉并把它踢出 active——主人立刻
 * 登不进去、会话当场失效，而且他要是点了那封看起来很正常的验证邮件，激活的是别人
 * 设的密码。现在没点链接之前 users 完全不动，最坏情况只是收到一封没头没尾的信。
 */
export async function startEmailRegistration(
  db: D1Database,
  env: Env,
  input: unknown,
  clientIp: string
): Promise<{ developmentToken?: string }> {
  const body = objectBody(input);
  const email = normaliseEmail(body.email);
  const role = emailRole(body.role);
  const password = passwordInput(body.password);
  const now = Date.now();
  /* 超限时要说出来。以前这里直接 return {}，前端照样显示「验证邮件已经发出」，
     人就对着收件箱一直等一封不会来的信。 */
  const gate = await allowAttempt(db, "email_register", email, EMAIL_START_MAX_ATTEMPTS, now);
  if (!gate.allowed) throw throttled(gate.retryAfterSeconds);
  const ipGate = await allowAttempt(db, "email_register_ip", clientIp, EMAIL_REGISTER_IP_MAX_ATTEMPTS, now);
  if (!ipGate.allowed) throw throttled(ipGate.retryAfterSeconds);
  const existing = await db.prepare(
    "SELECT id, role, email, username, status, password_hash, password_salt FROM users WHERE email = ?1"
  ).bind(email).first<UserRow>();

  let userId: string;
  if (!existing) {
    userId = crypto.randomUUID();
    const aliasKey = emailAliasKey(email);
    const alias = await db.prepare("SELECT user_id FROM email_aliases WHERE alias_key = ?1")
      .bind(aliasKey).first<{ user_id: string }>();
    if (alias) throw accountExists();
    try {
      // D1 batch 会将两条写入作为同一个事务回滚；唯一键同时挡住并发请求。
      await db.batch([
        db.prepare(
          "INSERT INTO users (id, email, role, status, created_at, updated_at) VALUES (?1, ?2, ?3, 'pending_email', ?4, ?4)"
        ).bind(userId, email, role, now),
        db.prepare("INSERT INTO email_aliases (alias_key, user_id, created_at) VALUES (?1, ?2, ?3)")
          .bind(aliasKey, userId, now)
      ]);
    } catch (caught) {
      const winner = await db.prepare("SELECT user_id FROM email_aliases WHERE alias_key = ?1")
        .bind(aliasKey).first<{ user_id: string }>();
      if (winner && winner.user_id !== userId) throw accountExists();
      throw caught;
    }
  } else {
    if (existing.role === "student" || existing.role !== role || (existing.status !== "active" && existing.status !== "pending_email")) {
      throw new AuthError("ACCOUNT_EXISTS", 409, "这个邮箱已经注册过，请直接登录。", { alreadyRegistered: true });
    }
    // 已经能用的账号不走注册，改密码是另一回事。
    if (existing.status === "active" && existing.password_hash && existing.password_salt) {
      throw new AuthError("ACCOUNT_EXISTS", 409, "这个邮箱已经注册过，请直接登录。", { alreadyRegistered: true });
    }
    /* 剩下两种都允许，而且都只发信、不改库：
       - pending_email：同一个人再点一次注册，等于重发链接、改用新密码；
       - active 但没有密码：旧 magic-link 账号，借这条路补一个密码，
         但必须点他自己邮箱里的链接才算数。 */
    userId = existing.id;
  }

  const token = randomToken();
  const tokenHash = await digest(token);
  const passwordSalt = randomToken();
  const passwordHash = encodePasswordHash(await passwordDigest(password, passwordSalt));
  await db.batch([
    db.prepare("DELETE FROM auth_tokens WHERE user_id = ?1 AND purpose = 'email_login' AND consumed_at IS NULL").bind(userId),
    db.prepare(
      "INSERT INTO auth_tokens (id, user_id, purpose, token_hash, expires_at, created_at, pending_password_hash, pending_password_salt, registration_ip_hash) VALUES (?1, ?2, 'email_login', ?3, ?4, ?5, ?6, ?7, ?8)"
    ).bind(
      crypto.randomUUID(), userId, tokenHash, now + EMAIL_TOKEN_TTL_MS, now, passwordHash, passwordSalt,
      await digest("email_registration_source\u0000" + clientIp)
    )
  ]);

  if (env.ENVIRONMENT === "development") return { developmentToken: token };
  await sendVerificationLink(env, email, token);
  return {};
}

/*
 * 邮箱登录。
 *
 * 这里**不再按身份过滤**。以前 role 参与判断，于是一个老师在登录页把身份点成
 * 「个人学习者」，输对密码也只会得到「邮箱或密码不正确」；他改去注册，又被告知
 * 「这个邮箱已经注册过，请直接登录」——两句话互相指向对方，没有任何线索说是身份
 * 选错了。账号本来就自带 role，登录时不需要用户再报一遍，返回真实 role 即可。
 */
export async function loginEmail(db: D1Database, env: Env, input: unknown) {
  const body = objectBody(input);
  const email = normaliseEmail(body.email);
  const password = passwordInput(body.password, false);
  const now = Date.now();
  const gate = await allowAttempt(db, "email_login", email, STUDENT_AUTH_MAX_ATTEMPTS, now);
  if (!gate.allowed) throw throttled(gate.retryAfterSeconds);
  const user = await db.prepare(
    "SELECT id, role, email, username, status, password_hash, password_salt FROM users WHERE email = ?1"
  ).bind(email).first<UserRow>();
  if (!user || user.role === "student") throw invalidEmailCredentials();
  /* 密码是对的却说「密码不正确」，人只会反复重打同一串字。这两种卡住的状态
     各自有明确的下一步，就直说是哪一种——注册接口本来就会暴露邮箱存不存在，
     这里不比它多说什么。 */
  if (user.status === "pending_email") {
    throw new AuthError("EMAIL_NOT_VERIFIED", 403, "这个邮箱还没有完成验证。请打开注册时收到的邮件点一下链接；找不到那封信就重新注册一次，会重新发给你。");
  }
  if (user.status !== "active") throw invalidEmailCredentials();
  if (!user.password_hash || !user.password_salt) {
    throw new AuthError("NEEDS_PASSWORD_SETUP", 403, "这个邮箱还没有设置过密码。请改用「注册」给它设一个密码，我们会发一封验证邮件确认是你本人。");
  }
  const stored = decodePasswordHash(user.password_hash);
  let candidateHash: string;
  try {
    candidateHash = await passwordDigest(password, user.password_salt, stored.iterations, stored.rounds);
  } catch {
    throw invalidEmailCredentials();
  }
  if (!constantTimeEqual(candidateHash, stored.hex)) throw invalidEmailCredentials();
  await clearAttempts(db, "email_login", email);
  const session = await createSession(db, user.id);
  return { user: publicUser(user), setCookie: cookieHeader(session.token, env, session.expiresAt) };
}

function invalidEmailCredentials(): AuthError {
  return new AuthError("INVALID_CREDENTIALS", 401, "邮箱或密码不正确。若还没有账号，请先注册。");
}

function accountExists(): AuthError {
  return new AuthError("ACCOUNT_EXISTS", 409, "这个邮箱已经注册过，请直接登录。", { alreadyRegistered: true });
}

/*
 * 点验证链接。密码就是在这一刻才第一次写进 users——在此之前那串哈希只存在于
 * 这条 token 记录上，谁都改不动已有账号。
 */
export async function verifyEmailLogin(db: D1Database, env: Env, input: unknown) {
  const body = objectBody(input);
  const token = requiredString(body.token, "登录链接无效。", "INVALID_TOKEN");
  const now = Date.now();
  const row = await db.prepare(
    `SELECT auth_tokens.id, auth_tokens.user_id, auth_tokens.expires_at, auth_tokens.consumed_at,
            auth_tokens.pending_password_hash, auth_tokens.pending_password_salt, auth_tokens.registration_ip_hash,
            users.role, users.email, users.username, users.status
       FROM auth_tokens JOIN users ON users.id = auth_tokens.user_id
      WHERE auth_tokens.token_hash = ?1 AND auth_tokens.purpose = 'email_login'`
  ).bind(await digest(token)).first<TokenRow>();

  /* 允许 active：旧 magic-link 账号是 active 但没有密码，走注册补密码时状态一直
     没动过，到这里仍然是 active。 */
  const usable = row && !row.consumed_at && row.expires_at > now && row.role !== "student"
    && (row.status === "pending_email" || row.status === "active");
  if (!usable || !row || !row.pending_password_hash || !row.pending_password_salt) {
    throw new AuthError("INVALID_TOKEN", 401, "验证链接无效或已过期。请重新注册一次，会发一封新的给你。");
  }
  if (row.status === "pending_email" && row.registration_ip_hash) {
    const verifiedGate = await allowAttempt(
      db, "email_verified_ip", row.registration_ip_hash, EMAIL_VERIFIED_IP_MAX_ACCOUNTS, now, EMAIL_VERIFIED_IP_WINDOW_MS
    );
    if (!verifiedGate.allowed) throw throttled(verifiedGate.retryAfterSeconds);
  }
  await claimOneTimeToken(db, row.id, "INVALID_TOKEN", "验证链接无效或已过期。请重新注册一次，会发一封新的给你。");
  await db.batch([
    // 密码换了，别的地方的会话就不该继续留着
    db.prepare("DELETE FROM sessions WHERE user_id = ?1").bind(row.user_id),
    db.prepare(
      "UPDATE users SET status = 'active', password_hash = ?1, password_salt = ?2, updated_at = ?3 WHERE id = ?4"
    ).bind(row.pending_password_hash, row.pending_password_salt, now, row.user_id)
  ]);
  await clearAttempts(db, "email_register", row.email || "");
  await clearAttempts(db, "email_login", row.email || "");
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
  await claimOneTimeToken(db, row.id, "INVALID_ACTIVATION_CODE", "用户名或激活码无效。");
  await db.batch([
    db.prepare(
      "UPDATE users SET password_hash = ?1, password_salt = ?2, status = 'active', updated_at = ?3 WHERE id = ?4"
    ).bind(passwordHash, passwordSalt, now, row.user_id)
  ]);
  await clearAttempts(db, "student_activate", username);
  const session = await createSession(db, row.user_id);
  return { user: publicUser(tokenUser(row)), setCookie: cookieHeader(session.token, env, session.expiresAt) };
}

type StudentMembership = { classId: string; displayName: string };

/* 读取行不等于拿到消费权。必须先用单条条件写入认领，且只有胜者能修改密码、
   撤销旧会话或建立新会话。auth_tokens 没有写入触发器，changes 对应这条 UPDATE。
   认领后若后续写入失败，令牌仍然作废（fail closed）；邮箱重新注册，学生请老师
   重发激活码。不能为了恢复便利把可能已经用过的令牌重新开放。 */
async function claimOneTimeToken(db: D1Database, id: string, code: string, message: string): Promise<void> {
  const now = Date.now();
  const result = await db.prepare(
    "UPDATE auth_tokens SET consumed_at = ?1 WHERE id = ?2 AND consumed_at IS NULL AND expires_at > ?1"
  ).bind(now, id).run();
  if (!result.success || result.meta.changes !== 1) throw new AuthError(code, 401, message);
}

export async function createPendingStudent(db: D1Database, usernameInput: unknown, membership?: StudentMembership): Promise<{ user: AuthenticatedUser; activationCode: string }> {
  const username = normaliseUsername(usernameInput);
  const existing = await db.prepare("SELECT id FROM users WHERE username = ?1").bind(username).first<{ id: string }>();
  if (existing) throw new AuthError("USERNAME_TAKEN", 409, "该用户名已被使用。");
  const now = Date.now();
  const user: AuthenticatedUser = { id: crypto.randomUUID(), role: "student", email: null, username };
  const activationCode = newActivationCode();
  const statements = [
    db.prepare(
      "INSERT INTO users (id, username, role, status, created_at, updated_at) VALUES (?1, ?2, 'student', 'pending_activation', ?3, ?3)"
    ).bind(user.id, username, now),
    db.prepare(
      "INSERT INTO auth_tokens (id, user_id, purpose, token_hash, expires_at, created_at) VALUES (?1, ?2, 'student_activation', ?3, ?4, ?5)"
      ).bind(crypto.randomUUID(), user.id, await digest(activationCode), now + STUDENT_ACTIVATION_TTL_MS, now)
  ];
  if (membership) statements.push(db.prepare(
    "INSERT INTO class_members (class_id, user_id, display_name, status, created_at) VALUES (?1, ?2, ?3, 'active', ?4)"
  ).bind(membership.classId, user.id, membership.displayName, now));
  await db.batch(statements);
  return { user, activationCode };
}

/**
 * 直接建一个已激活的学生账号：自己定用户名和密码，不经过激活码。
 * 需要进班时，调用方把 membership 一并交给这里，确保凭据和班级成员关系原子写入。
 */
export async function createActiveStudent(db: D1Database, usernameInput: unknown, passwordInputValue: unknown, membership?: StudentMembership) {
  const username = normaliseUsername(usernameInput);
  const password = passwordInput(passwordInputValue);
  const existing = await db.prepare("SELECT id FROM users WHERE username = ?1").bind(username).first<{ id: string }>();
  if (existing) throw new AuthError("USERNAME_TAKEN", 409, "这个用户名已经有人用了，换一个。");
  const now = Date.now();
  const user: AuthenticatedUser = { id: crypto.randomUUID(), role: "student", email: null, username };
  const passwordSalt = randomToken();
  const passwordHash = encodePasswordHash(await passwordDigest(password, passwordSalt));
  const statements = [db.prepare(
    "INSERT INTO users (id, username, role, status, password_hash, password_salt, created_at, updated_at) VALUES (?1, ?2, 'student', 'active', ?3, ?4, ?5, ?5)"
  ).bind(user.id, username, passwordHash, passwordSalt, now)];
  if (membership) statements.push(db.prepare(
    "INSERT INTO class_members (class_id, user_id, display_name, status, created_at) VALUES (?1, ?2, ?3, 'active', ?4)"
  ).bind(membership.classId, user.id, membership.displayName, now));
  await db.batch(statements);
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

function emailAliasKey(email: string): string {
  const at = email.lastIndexOf("@");
  const plus = email.indexOf("+");
  return plus >= 0 && plus < at ? email.slice(0, plus) + email.slice(at) : email;
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

async function sendVerificationLink(env: Env, email: string, token: string): Promise<void> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.APP_ORIGIN) throw new AuthError("EMAIL_NOT_CONFIGURED", 503, "邮箱验证暂未配置，请联系管理员。");
  const origin = new URL(env.APP_ORIGIN).origin;
  // 指到 /lab，不指根路径：根路径会 301 到 /lab，让一次性 token 白白多走一跳
  const link = `${origin}/lab?authToken=${encodeURIComponent(token)}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [email],
      subject: "验证你的 SeedToCode 账号",
      html: `<p>点击下方链接完成 SeedToCode 注册并登录。链接将在 15 分钟后失效。</p><p><a href="${link}">验证邮箱并登录 SeedToCode</a></p>`
    })
  });
  if (response.ok) return;
  /*
   * 给调用方的话仍然含糊——注册接口是匿名可调的，不该把发件域、配额这些
   * 配置细节说给任何人听。但**我们自己**得知道是怎么回事：在这之前这里
   * 直接把 Resend 的回应扔掉了，线上发不出信，日志里也只有一个 503，
   * 没有任何线索可查。只记 HTTP 状态，不记提供方正文：错误内容可能回显
   * 收件人或其他请求字段，不能把它当成不含个人信息的诊断材料。
   */
  console.error("resend.send_failed", JSON.stringify({ status: response.status }));
  throw new AuthError("EMAIL_DELIVERY_FAILED", 503, "验证邮件暂时无法发送，请稍后再试。");
}

async function digest(value: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", textEncoder.encode(value));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

type AttemptResult = { allowed: boolean; retryAfterSeconds: number };

async function allowAttempt(
  db: D1Database, scope: string, identifier: string, maximum: number, now: number, windowMs = AUTH_ATTEMPT_WINDOW_MS
): Promise<AttemptResult> {
  const keyHash = await digest(scope + "\u0000" + identifier);
  // 长窗口的注册额度与普通 15 分钟登录额度共表；不能让一次短窗口调用
  // 顺手删掉仍在 24 小时窗口内的记录。
  await db.prepare("DELETE FROM auth_rate_limits WHERE updated_at <= ?1").bind(now - EMAIL_VERIFIED_IP_WINDOW_MS * 2).run();
  await db.prepare(
    "INSERT INTO auth_rate_limits (key_hash, scope, window_started_at, attempts, updated_at) VALUES (?1, ?2, ?3, 1, ?3) ON CONFLICT(key_hash) DO UPDATE SET window_started_at = CASE WHEN auth_rate_limits.window_started_at <= ?4 THEN excluded.window_started_at ELSE auth_rate_limits.window_started_at END, attempts = CASE WHEN auth_rate_limits.window_started_at <= ?4 THEN 1 ELSE auth_rate_limits.attempts + 1 END, updated_at = excluded.updated_at"
  ).bind(keyHash, scope, now, now - windowMs).run();
  const row = await db.prepare("SELECT attempts, window_started_at FROM auth_rate_limits WHERE key_hash = ?1")
    .bind(keyHash).first<{ attempts: number; window_started_at: number }>();
  const attempts = row?.attempts ?? maximum + 1;
  if (attempts <= maximum) return { allowed: true, retryAfterSeconds: 0 };
  // 告诉调用方还要等多久：不说清楚的话，被挡住的人只会一直重试
  const windowEnds = (row?.window_started_at ?? now) + windowMs;
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

/* ---------------- cookie 诊断 ---------------- */

/*
 * 「这台设备到底存不存我们的 cookie」这件事，从服务端看是唯一能取到真数的地方。
 *
 * 起因：iPad 上的 Chrome 登录成功、顶栏闪一下名字就退回「登录」，而同一台 iPad
 * 的 Safari 一切正常——同一个 WebKit 引擎、同一份响应头，差别只在 app 各自的
 * cookie 存储。iPad 上没有开发者工具，只能让接口自己把收到的东西说出来。
 *
 * 下发两个探针 cookie：一个普通的、一个 HttpOnly，其余属性和会话 cookie 完全一致。
 * 连着访问两次就能分档：两个都回来 = 这个浏览器存得下我们的 cookie，问题在别处；
 * 只有普通的回来 = 它在丢 HttpOnly；一个都不回来 = 这个 app 根本不给这个站存。
 *
 * 只回报 cookie 的**名字**，不回报值，也不需要登录——它看不到任何身份信息。
 */
const PROBE_PLAIN = "seedtocode_probe";
const PROBE_HTTPONLY = "seedtocode_probe_ho";
const PROBE_LONG = "seedtocode_probe_long";
const PROBE_XHR = "seedtocode_probe_xhr";
const PROBE_TTL_SECONDS = 600;
/* 会话 cookie 是 30 天。有效期本身也可能是被丢的原因（WebKit 会削长效 cookie），
   所以拿一个除了有效期以外和会话完全一样的探针把这个变量单独隔出来。 */
const PROBE_LONG_TTL_SECONDS = 30 * 24 * 60 * 60;

/** 请求里带了哪些 cookie 名。只要名字：值里可能有会话 token。 */
export function cookieNames(header: string | null): string[] {
  if (!header) return [];
  return header
    .split(";")
    .map((item) => item.trim().split("=")[0])
    .filter((name) => name.length > 0);
}

/** 两个探针的 Set-Cookie 头，属性和会话 cookie 对齐，只是不含任何身份信息。 */
export function probeCookieHeaders(env: Env): string[] {
  const stamp = String(Date.now());
  const attributes = (ttl: number) => {
    const list = ["Path=/", "SameSite=Lax", `Max-Age=${ttl}`];
    if (env.ENVIRONMENT !== "development") list.push("Secure");
    return list;
  };
  return [
    [`${PROBE_PLAIN}=${stamp}`, ...attributes(PROBE_TTL_SECONDS)].join("; "),
    [`${PROBE_HTTPONLY}=${stamp}`, ...attributes(PROBE_TTL_SECONDS), "HttpOnly"].join("; "),
    [`${PROBE_LONG}=${stamp}`, ...attributes(PROBE_LONG_TTL_SECONDS), "HttpOnly"].join("; ")
  ];
}

/*
 * 第三个变量：**由页面里的 fetch POST 下发**的 cookie。
 *
 * 会话 cookie 和上面那几个探针只差这一条路径——登录是 `fetch` 拿回来的，
 * 探针是顶层导航拿回来的。属性这里跟会话一字不差（HttpOnly、30 天、Secure、Lax），
 * 所以如果它回不来而 PROBE_LONG 回得来，差别就只剩「谁下发的」这一条。
 */
export function xhrProbeCookieHeader(env: Env): { header: string; stamp: string } {
  const stamp = String(Date.now());
  const list = [`${PROBE_XHR}=${stamp}`, "Path=/", "SameSite=Lax", `Max-Age=${PROBE_LONG_TTL_SECONDS}`];
  if (env.ENVIRONMENT !== "development") list.push("Secure");
  list.push("HttpOnly");
  return { header: list.join("; "), stamp };
}

/** 探针的当前可见情况，给诊断页按结构读。 */
export function probeState(request: Request) {
  const header = request.headers.get("cookie");
  const names = cookieNames(header);
  const has = (name: string) => names.indexOf(name) >= 0;
  return {
    session: has("seedtocode_session"),
    plain: has(PROBE_PLAIN),
    httpOnly: has(PROBE_HTTPONLY),
    long: has(PROBE_LONG),
    xhr: has(PROBE_XHR),
    /* 只回这一个探针的值，而且它只是个时间戳：诊断页要判断「回来的是不是我刚
       下发的那一个」，光看在不在会把上一轮留下的旧 cookie 当成这一轮成功了。 */
    xhrStamp: cookieValue(header, PROBE_XHR)
  };
}

/*
 * 给人在手机屏幕上读的一段话，不是给程序解析的。
 *
 * `round` 是这段话能不能下结论的关键：第一次访问本来就该是「一个都没有」，
 * 和「这个浏览器根本不存 cookie」在屏幕上长得完全一样。所以第一次只发链接不下
 * 结论，第二次才判——而那个带 `?round=2` 的链接只能从第一次的页面上点到，
 * 点得到就说明第一次确实在这个浏览器里发生过、cookie 也确实下发过了。
 */
export function describeCookieCheck(request: Request): string {
  const url = new URL(request.url);
  const second = url.searchParams.get("round") === "2";
  const names = cookieNames(request.headers.get("cookie"));
  const has = (name: string) => names.indexOf(name) >= 0;
  const yes = (on: boolean) => (on ? "是" : "否");
  const gotProbes = has(PROBE_PLAIN) || has(PROBE_HTTPONLY);

  const lines = [
    "SeedToCode cookie 探针",
    "",
    second ? "第 2 次访问" : "第 1 次访问",
    "",
    "这一次请求带上来的 cookie：" + (names.length ? names.join("、") : "（一个都没有）"),
    "",
    "  会话 cookie（seedtocode_session）：" + yes(has("seedtocode_session")),
    "  普通探针（seedtocode_probe）：" + yes(has(PROBE_PLAIN)),
    "  HttpOnly 探针（seedtocode_probe_ho）：" + yes(has(PROBE_HTTPONLY)),
    "  30 天 HttpOnly 探针（seedtocode_probe_long）：" + yes(has(PROBE_LONG)),
    "  fetch 下发的探针（seedtocode_probe_xhr）：" + yes(has(PROBE_XHR)),
    ""
  ];

  if (!second) {
    lines.push(
      "刚刚给你下发了一对探针 cookie，有效期 10 分钟。",
      "第 1 次是「否」很正常，不说明任何问题。",
      "",
      "请打开下面这个地址看第 2 次（在同一个浏览器里）：",
      url.origin + "/auth/cookie-check?round=2"
    );
    return lines.join("\n");
  }

  if (!gotProbes) {
    lines.push(
      "结论：这个浏览器没有把刚下发的 cookie 存下来。",
      "两个探针一个都没回来，所以登录会话也留不住——登录成功之后",
      "下一次请求就又是未登录了。这通常是这个浏览器自己的隐私设置，",
      "而不是网站的问题（同一台设备上别的浏览器能正常登录就能佐证）。"
    );
  } else if (!has(PROBE_HTTPONLY)) {
    lines.push(
      "结论：普通 cookie 存住了，HttpOnly 的没有。",
      "会话 cookie 正是 HttpOnly，所以登录留不住。"
    );
  } else if (!has(PROBE_PLAIN)) {
    lines.push("结论：HttpOnly 存住了、普通的没有。这个组合很少见，把这一页发给我。");
  } else {
    lines.push(
      "结论：这个浏览器存得下本站的 cookie（两个探针都回来了）。",
      "如果你刚登录过而上面的会话一行仍是「否」，那问题出在登录那一次响应上，",
      "不是存储本身——把这一页发给我。"
    );
  }
  return lines.join("\n");
}
