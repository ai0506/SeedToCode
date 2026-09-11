/**
 * 把指定章节的内容数据平铺成一份可读的 Markdown 预览，方便审阅正文。
 * 这不是最终版式——版式见 web/teaching.html 与 teaching/06-TEMPLATE.md。
 *
 *   node scripts/preview-teaching-chapter.mjs      # Chapter 1
 *   node scripts/preview-teaching-chapter.mjs 2    # Chapter 2
 */
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { allChapters, sampleTranscripts } from "../packages/teaching-content/dist/index.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const chapterId = Number(process.argv[2] ?? "1");
const chapter = allChapters.find((item) => item.id === chapterId);
if (!chapter) throw new Error(`找不到 Chapter ${chapterId}`);

const out = [];
const p = (s = "") => out.push(s);
p(`# Chapter ${chapter.id} — ${chapter.title}  \`[${chapter.level}]\``);
p(`\n对应 ${chapter.syllabus.join("、")}｜内容预览（不是最终版式，只是把数据平铺出来读）\n`);

const task = (t, heading) => {
  p(`\n${heading} ${t.title}｜\`${t.id}\``);
  p(`\n${t.statement}\n`);
  p(`- **输入**：${t.ioSpec.input}`);
  p(`- **输出**：${t.ioSpec.output}`);
  if (t.constraints?.require?.length) for (const c of t.constraints.require) p(`- **必须用** \`${c.feature}\` — ${c.reason}`);
  if (t.constraints?.forbid?.length) for (const c of t.constraints.forbid) p(`- **不能用** \`${c.feature}\` — ${c.reason}`);
  if (t.suggestedFeatures) p(`- **建议用到**：${t.suggestedFeatures.map(f => "`" + f + "`").join("、")}`);
  p(`\n提示：`);
  t.hints.forEach((h, i) => p(`${i + 1}. ${h}`));
  p(`\n题面示例：`);
  for (const e of t.examples) p("```\n" + (e.inputs.length ? "输入：" + e.inputs.join(" / ") + "\n" : "") + "输出：\n" + e.outputs.join("\n") + "\n```");
  p(`\n<details><summary>参考解（学生看不到）</summary>\n\n\`\`\`\n${t.referenceSolution}\n\`\`\`\n\n判题用例（对学生隐藏，失败时只显示 caseHint）：\n`);
  for (const c of t.tests) p(`- \`${c.kind}\` ${c.inputs.length ? "输入 " + c.inputs.join(" / ") + " — " : ""}${c.caseHint}`);
  p(`\n</details>`);
};

for (const s of chapter.sections) {
  p(`\n---\n\n## ${s.id}　${s.title}`);
  p(`\n<sub>${s.syllabus.join("、")}｜约 ${s.estimatedMinutes} 分钟｜可用写法：${s.taughtFeatures.length ? s.taughtFeatures.map(f => "`" + f + "`").join("、") : "（无代码）"}</sub>\n`);
  for (const b of s.blocks) {
    if (b.kind === "explanation") {
      for (const para of b.paragraphs) p(`${para}\n`);
      for (const c of b.callouts ?? []) p(`> **规则**（${c.source === "CAIE" ? "CAIE 规定" : "编辑器约定"}）　${c.text}\n`);
    } else if (b.kind === "example") {
      p(`**示例：${b.title}**　\`${b.fileName}\`\n`);
      p("```\n" + b.code + "\n```");
      for (const a of b.annotations) p(`- ${a.fromLine === a.toLine ? `第 ${a.fromLine} 行` : `${a.fromLine}–${a.toLine} 行`}：${a.text}`);
      const transcript = sampleTranscripts[`${s.id}/${b.fileName}`];
      if (transcript) {
        const hasInput = transcript.some(e => e.kind === "input");
        p(`\n示例运行${hasInput ? "（\`>\` 开头的那行是输入）" : ""}：\n\n` + "```\n" +
          transcript.map(e => (e.kind === "input" ? "> " + e.text : e.text)).join("\n") + "\n```");
      } else if (b.sampleRun) {
        p(`\n示例运行：\n\n` + "```\n" + b.sampleRun.outputs.join("\n") + "\n```");
      }
      p("");
    } else if (b.kind === "counterExample") {
      p(`**反例：${b.title}**\n`);
      for (const c of b.cases) {
        if (c.title) p(`*${c.title}*`);
        p("```\n" + c.code + "\n```");
        p(`${c.note}\n`);
        for (const d of c.expectDiagnostics ?? []) p(`- ${d.severity === "error" ? "错误" : d.severity === "caie" ? "规范提示" : "建议"}（第 ${d.line} 行）：${d.text}`);
        if (c.expectRuntimeError) p(`- 运行时（第 ${c.expectRuntimeError.line} 行，${c.expectRuntimeError.code}）：${c.expectRuntimeError.text}`);
        p("");
      }
    } else if (b.kind === "comparison") {
      p(`**对照：${b.title}**\n`);
      if (b.intro) p(`${b.intro}\n`);
      for (const pane of b.panes) {
        p(`*${pane.label}*`);
        p("```" + (pane.language === "python" ? "python" : "") + "\n" + pane.code + "\n```");
        p(`> ${pane.note}\n`);
      }
    } else if (b.kind === "quiz") {
      p(`**关卡**（${b.type}）　${b.prompt}\n`);
      if (b.type === "single-choice" || b.type === "true-false") {
        if (b.code) p("```\n" + b.code + "\n```");
        for (const o of b.options) p(`- **${o.key}** ${o.label}\n  - ${o.correct ? "✓ " : "✗ "}${o.explanation}`);
      } else if (b.type === "click-line") {
        b.lines.forEach((l, i) => p(`- 第 ${i + 1} 行 \`${l.code}\`${l.answer ? "　←答案" : ""}\n  - ${l.explanation}`));
      } else {
        p("```\n" + b.template + "\n```");
        p(`答案：${b.blanks.map(x => `空 ${x.index} = \`${x.answer}\``).join("，")}`);
        for (const w of b.bank) p(`- \`${w.word}\` — ${w.explanation}`);
      }
      p("");
    } else if (b.kind === "task") {
      task(b, "### 小节题：");
    }
  }
}
p(`\n---\n`);
for (const t of chapter.chapterTasks) task(t, "## 章末大题：");

const target = resolve(root, `teaching/chapter-${String(chapter.id).padStart(2, "0")}-preview.md`);
writeFileSync(target, out.join("\n") + "\n", "utf8");
console.log(`✓ 已生成 ${target}`);
