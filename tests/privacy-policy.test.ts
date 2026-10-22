/*
 * 隐私政策（web/privacy.html）说的话要和代码一致。
 *
 * 政策里的每一句都是对使用者的断言。最容易悄悄变假的是两类：时长（会话几天、验证链接
 * 几分钟），和「我们存了什么」——服务端加一张表、多存一样东西，政策不会自己跟着变。
 * 所以时长直接从 server/src/auth.ts 的常量算，表名直接从 migrations 里扫。
 */
import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const policy = read("../web/privacy.html");
const auth = read("../server/src/auth.ts");

/* 只认 `const NAME = 数字 * 数字 …;` 这种纯乘法常量，别的形状直接报错，免得算错了还以为对。 */
function constantMs(name: string): number {
  const match = auth.match(new RegExp(`const ${name} = ([0-9 *]+);`));
  if (!match) throw new Error(`auth.ts 里找不到纯数字常量 ${name}`);
  return match[1].split("*").reduce((product, factor) => product * Number(factor.trim()), 1);
}

function textOf(attribute: string): string[] {
  return [...policy.matchAll(new RegExp(`<[^>]*${attribute}[^>]*>([^<]*)<`, "g"))].map((m) => m[1].trim());
}

const DAY = 24 * 60 * 60 * 1000;

describe("隐私政策 · 版本号", () => {
  it("meta 里的版本号与页面上写的「版本 N」一致", () => {
    const meta = policy.match(/<meta name="seedtocode-privacy-version" content="(\d+)">/);
    expect(meta).toBeTruthy();
    expect(textOf("data-pp-version")).toEqual([`版本 ${meta![1]}`]);
    expect(textOf("data-pp-effective")[0]).toMatch(/^生效日期 \d{4} 年 \d{1,2} 月 \d{1,2} 日$/);
  });
});

describe("隐私政策 · 时长与服务端常量一致", () => {
  it("会话有效期", () => {
    const days = constantMs("SESSION_TTL_MS") / DAY;
    const shown = textOf("data-pp-session-days");
    expect(shown.length).toBeGreaterThan(0);
    for (const value of shown) expect(Number(value)).toBe(days);
  });

  it("邮箱验证链接有效期", () => {
    expect(Number(textOf("data-pp-email-minutes")[0])).toBe(constantMs("EMAIL_TOKEN_TTL_MS") / 60000);
  });

  it("学生激活码有效期", () => {
    expect(Number(textOf("data-pp-activation-days")[0])).toBe(constantMs("STUDENT_ACTIVATION_TTL_MS") / DAY);
  });

  it("会话 cookie 的名字就是服务端读的那一个", () => {
    const name = auth.match(/cookieValue\(request\.headers\.get\("cookie"\), "([^"]+)"\)/)![1];
    expect(policy).toContain(`<code>${name}</code>`);
  });
});

describe("隐私政策 · 数据库里存的每一样东西都有交代", () => {
  /* 不含任何用户数据的表才能放这里，并写明为什么。 */
  const NO_PERSONAL_DATA: Record<string, string> = {
    service_config: "只有云端功能的开关（键和值），与任何用户无关"
  };

  const tables = new Set<string>();
  const dir = new URL("../server/migrations/", import.meta.url);
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".sql"))) {
    const sql = readFileSync(new URL(file, dir), "utf8");
    /* 按语句顺序重放：有的迁移用「建 xxx_next → 删旧表 → 改名」重建表，只扫 CREATE 会多出一张不存在的表。 */
    for (const match of sql.matchAll(/CREATE TABLE (?:IF NOT EXISTS )?([a-z_]+)|DROP TABLE (?:IF EXISTS )?([a-z_]+)|ALTER TABLE ([a-z_]+) RENAME TO ([a-z_]+)/g)) {
      if (match[1]) tables.add(match[1]);
      else if (match[2]) tables.delete(match[2]);
      else { tables.delete(match[3]); tables.add(match[4]); }
    }
  }
  const covered = new Set([...policy.matchAll(/data-pp-covers="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)));

  it("扫到了表（防止正则失效后这组测试空转）", () => {
    expect(tables.size).toBeGreaterThan(15);
  });

  it("每张表都在政策的「我们保存什么」里有一行", () => {
    const missing = [...tables].filter((name) => !covered.has(name) && !(name in NO_PERSONAL_DATA));
    expect(missing, "新加的表要在 privacy.html 第 2 节写清楚存了什么，再把表名加进那一行的 data-pp-covers").toEqual([]);
  });

  it("政策里点名的表都真实存在", () => {
    expect([...covered].filter((name) => !tables.has(name))).toEqual([]);
  });
});

describe("隐私政策 · 页面本身与入口", () => {
  it("不加载任何外部资源", () => {
    expect(policy).not.toMatch(/(src|href)="(https?:)?\/\//);
  });

  it("「联系我们」填好了：点开的地址就是显示的地址，且在运营者的域名下", () => {
    expect(policy).not.toContain("data-pp-contact-missing");
    const link = policy.match(/<a href="mailto:([^"]+)" data-pp-contact>([^<]+)<\/a>/);
    expect(link, "第 12 节要有一个 data-pp-contact 的 mailto 链接").toBeTruthy();
    expect(link![2]).toBe(link![1]);
    expect(link![1]).toMatch(/@ai0506\.com$/);
  });

  it("登录页和账户浮层都链到它", () => {
    expect(read("../web/login.html")).toContain('href="privacy.html"');
    expect(read("../web/js/account-ui.js")).toContain('href="privacy.html"');
  });
});
