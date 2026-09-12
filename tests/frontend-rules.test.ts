/*
 * FRONTEND_RULES.md 末尾那三条全局 grep，写成测试。
 *
 * 那两条规则（界面稳定性、不使用浏览器原生交互界面）是验收条件，不是风格偏好，
 * 但此前只能靠人记得去跑那几行 shell。规则一旦只存在于文档里，就会慢慢失效——
 * 写成测试之后，谁往 web/ 里加一个 alert() 或者 <select>，测试直接红。
 *
 * 已知豁免逐条列在下面，每条都要写清楚为什么。加豁免＝改这个文件，会出现在 diff 里，
 * 这正是想要的效果：破例必须是一个显式的、看得见的动作。
 *
 * 量不到的部分要说清楚：这里只做静态文本检查。第 1 条的「一次交互只允许改变被操作
 * 对象自身的外观」需要真实布局引擎才能量（FRONTEND_RULES 文末那套 getBoundingClientRect
 * 快照法），jsdom 没有布局，全是 0，所以那一条仍然靠手动核对。
 */
import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const WEB = new URL("../web/", import.meta.url).pathname;

function read(relative: string): string {
  return readFileSync(join(WEB, relative), "utf8");
}

function htmlFiles(): string[] {
  return readdirSync(WEB).filter((name) => name.endsWith(".html")).sort();
}

function scriptFiles(): string[] {
  return readdirSync(join(WEB, "js")).filter((name) => name.endsWith(".js")).sort();
}

/** 打包产物不算数：它们由 packages/ 生成，不是手写的页面代码。 */
const BUNDLES = new Set([
  "language-engine.js",
  "runtime-engine.js",
  "exercise-engine.js",
  "teaching-content.js",
  "storage.js",
  "assignment-core.js"
]);

function handWrittenScripts(): string[] {
  return scriptFiles().filter((name) => !BUNDLES.has(name));
}

/** 去掉字符串、块注释和行注释——文案里出现「confirm」这个词不该算违规。 */
function stripLiterals(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1 ")
    .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
    .replace(/`(?:[^`\\]|\\.)*`/g, "``");
}

describe("FRONTEND_RULES 第 2 条 · 不使用浏览器原生交互界面", () => {
  it("没有 alert / confirm / prompt / beforeunload", () => {
    const hits: string[] = [];
    for (const name of handWrittenScripts()) {
      const code = stripLiterals(read(join("js", name)));
      code.split("\n").forEach((line, index) => {
        // 自己的 askConfirm / confirmDialog 之类不算；只抓裸的全局调用
        const bare = /(^|[^.\w])(alert|confirm|prompt)\s*\(/.exec(line);
        if (bare) hits.push(`${name}:${index + 1} ${bare[2]}()`);
        if (line.includes("beforeunload")) hits.push(`${name}:${index + 1} beforeunload`);
      });
    }
    // 第 2.3 条：离开不拦截，改成自动存草稿，让离开没有代价
    expect(hits).toEqual([]);
  });

  it("页面里没有新增原生控件", () => {
    /*
     * 已知豁免，每条都要有理由：
     * - classes.html 的 #taskFilter：章末大题按题号筛选，仍是原生 <select>，
     *   在 FRONTEND_RULES 的「当前已知未达标项」表里挂着，待修。
     * - lab.html 的 #importInput：<input type="file">，第 2.2 条写明这是唯一例外，
     *   浏览器不允许用别的方式打开文件选择器。
     */
    const EXEMPT = new Map<string, RegExp[]>([
      ["classes.html", [/<select[^>]*id="taskFilter"/]],
      ["lab.html", [/<input[^>]*type="file"[^>]*id="importInput"|<input[^>]*id="importInput"[^>]*type="file"/]]
    ]);
    const BANNED: Array<[string, RegExp]> = [
      ["title= 悬浮文字（改用 data-tip）", /\stitle="/g],
      ["<select>（改用分段控件或自定义下拉）", /<select\b/g],
      ['type="date"（改用自定义日期选择器）', /type="date"/g],
      ['type="checkbox"（改用 role="switch"）', /type="checkbox"/g],
      ['type="range"（改用自定义步进器）', /type="range"/g],
      ["<details>（改用自定义展开块）", /<details\b/g],
      ["<dialog>（改用 .dialog）", /<dialog\b/g],
      ['type="file"（只有 lab.html 的导入是例外）', /type="file"/g]
    ];

    const hits: string[] = [];
    for (const file of htmlFiles()) {
      // 注释里提到某个控件名不算违规——写规则的注释本来就要提它
      const markup = read(file).replace(/<!--[\s\S]*?-->/g, " ");
      const exemptions = EXEMPT.get(file) ?? [];
      for (const [label, pattern] of BANNED) {
        for (const match of markup.matchAll(pattern)) {
          const around = markup.slice(Math.max(0, match.index - 200), match.index + 200);
          if (exemptions.some((allowed) => allowed.test(around))) continue;
          const line = markup.slice(0, match.index).split("\n").length;
          hits.push(`${file}:${line} ${label}`);
        }
      }
    }
    expect(hits).toEqual([]);
  });

  it("HTML5 表单校验不参与判断（required / pattern / setCustomValidity）", () => {
    const hits: string[] = [];
    for (const file of htmlFiles()) {
      const markup = read(file).replace(/<!--[\s\S]*?-->/g, " ");
      for (const match of markup.matchAll(/\s(required|pattern)=/g)) {
        hits.push(`${file}:${markup.slice(0, match.index).split("\n").length} ${match[1]}`);
      }
    }
    for (const name of handWrittenScripts()) {
      if (stripLiterals(read(join("js", name))).includes("setCustomValidity")) hits.push(`js/${name} setCustomValidity`);
    }
    expect(hits).toEqual([]);
  });
});

/*
 * 存量欠债的基线。
 *
 * 第 1 条的两项静态检查是后加的，加上去时 web/ 里已经有 10 处不合规——都不是
 * 新代码带进来的。按给既有代码引入 lint 的惯例：把现状冻在这里，**新增的一律红**，
 * 存量单独列着慢慢还。清单同时登记在 FRONTEND_RULES.md 的「当前已知未达标项」。
 *
 * 修好一处就从这里删一行。删空了就把这两个数组连同这段注释一起去掉。
 */
const SCROLL_GUTTER_DEBT = [
  "css/styles.css #projectPickerList",
  "css/styles.css .file-list",
  "css/styles.css .editor-scroll",
  "css/styles.css .snippet-pop ul",
  "css/styles.css .tab-panel",
  "css/styles.css .console",
  "css/styles.css .dialog-body",
  "css/teaching.css .mini-code textarea"
];

/* 第 1.2 条点名禁止的两处：中文和英文加粗后宽度都会变，一组标签来回切就在抖。
   .tab.active 尤其明显——老师面板和结果面板的标签切换会让整排跟着动。 */
const FONT_WEIGHT_DEBT = [
  "css/styles.css .file-list li.active → font-weight",
  "css/styles.css .tab.active → font-weight"
];

describe("FRONTEND_RULES 第 1 条 · 界面稳定性（能静态检查的那部分）", () => {
  it("所有滚动容器都有 scrollbar-gutter: stable", () => {
    /*
     * 第 1.4 条：滚动条出现时不能把内容挤窄。
     * 只看纵向/双向滚动的规则块——overflow-x: auto 是给宽内容横向滚的，不适用。
     */
    const hits: string[] = [];
    const files = readdirSync(join(WEB, "css")).filter((name) => name.endsWith(".css"));
    for (const file of files) {
      const css = read(join("css", file)).replace(/\/\*[\s\S]*?\*\//g, " ");
      for (const match of css.matchAll(/\{[^{}]*\}/g)) {
        const block = match[0];
        if (!/overflow(-y)?\s*:\s*(auto|scroll)/.test(block)) continue;
        if (/scrollbar-gutter\s*:\s*stable/.test(block)) continue;
        const line = css.slice(0, match.index).split("\n").length;
        const selector = css.slice(0, match.index).split("\n").pop()?.trim() || "";
        void line;
        hits.push(`css/${file} ${selector}`);
      }
    }
    expect(hits.sort()).toEqual([...SCROLL_GUTTER_DEBT].sort());
  });

  it("选中态不用 font-weight，也不用 border 宽度", () => {
    /*
     * 第 1.2 条：中文和英文加粗后宽度都会变，一组标签来回切就在抖；
     * border 1px → 2px 会把元素撑大 2px，整行跟着挪。
     * 只看「状态选择器」上的规则：:hover / [aria-checked] / [aria-pressed] /
     * [data-active] / .active / .selected / :focus。
     */
    const STATE = /(:hover|:focus(-visible)?|\[aria-(checked|pressed|selected)="?true|\[data-active="?yes|\.active\b|\.selected\b)/;
    const hits: string[] = [];
    const files = readdirSync(join(WEB, "css")).filter((name) => name.endsWith(".css"));
    for (const file of files) {
      const css = read(join("css", file)).replace(/\/\*[\s\S]*?\*\//g, " ");
      for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        const selector = match[1].trim();
        const block = match[2];
        if (!STATE.test(selector)) continue;
        if (/font-weight\s*:/.test(block)) hits.push(`css/${file} ${selector} → font-weight`);
        // box-shadow 做内描边是允许的；border-width / border 简写会改变盒子
        if (/(^|;)\s*border(-\w+)?-width\s*:/.test(block)) hits.push(`css/${file} ${selector} → border-width`);
      }
    }
    expect(hits.sort()).toEqual([...FONT_WEIGHT_DEBT].sort());
  });
});
