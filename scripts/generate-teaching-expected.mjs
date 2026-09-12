/**
 * 生成教学内容里两类「必须由引擎产出、不能手写」的数据：
 *
 *   1. 题目的期望输出——由参考解实跑得出；
 *   2. 示例代码的运行实录——输出与输入按真实发生顺序交错，
 *      这样页面上显示的就是学生真正会看到的样子，而不是「先列输入再列输出」。
 *
 * 期望输出一律由**参考解实跑**得出，绝不手写：这样题目和答案不可能不一致，
 * 而且引擎行为一旦变化，CI 会立刻发现差异，不会悄悄改变判题结果。
 * 规则见 teaching/03-EXERCISE_SPEC.md 4.1。
 *
 *   node scripts/generate-teaching-expected.mjs          # 写入快照
 *   node scripts/generate-teaching-expected.mjs --check   # 只比对，不写入
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { runWithInputs } from "../packages/exercise/dist/index.js";
import { allChapters, allTasks, executionProfileOf } from "../packages/teaching-content/dist/index.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = resolve(root, "packages/teaching-content/src/expected-outputs.ts");
const checkOnly = process.argv.includes("--check");

const snapshot = {};
let failures = 0;

for (const { chapter, task } of allTasks()) {
  // 执行档按章定：A Level 的枚举、集合、指针与类在 core-2027 下会被预检拒绝。
  const execute = { profile: executionProfileOf(chapter) };
  for (const test of task.tests) {
    const key = `${task.id}/${test.id}`;
    const run = await runWithInputs(task.referenceSolution, test.inputs, execute);
    if (run.status !== "completed" || run.exhausted) {
      console.error(`✗ ${key}: 参考解未正常结束（status=${run.status}, exhausted=${run.exhausted}）`);
      failures += 1;
      continue;
    }
    snapshot[key] = run.outputs;
  }
}

// 示例代码的运行实录
const transcripts = {};
for (const chapter of allChapters) {
  for (const section of chapter.sections) {
    for (const block of section.blocks) {
      if (block.kind !== "example" || !block.sampleRun) continue;
      const key = `${section.id}/${block.fileName}`;
      const run = await runWithInputs(block.code, block.sampleRun.inputs, { profile: executionProfileOf(chapter) });
      if (run.status !== "completed" || run.exhausted) {
        console.error(`✗ ${key}: 示例未正常结束（status=${run.status}）`);
        failures += 1;
        continue;
      }
      const outputs = run.transcript.filter((entry) => entry.kind === "output").map((entry) => entry.text);
      if (JSON.stringify(outputs) !== JSON.stringify(block.sampleRun.outputs)) {
        console.error(`✗ ${key}: sampleRun.outputs 与实际运行不一致`);
        failures += 1;
        continue;
      }
      transcripts[key] = run.transcript;
    }
  }
}

if (failures > 0) process.exit(1);

const serialized = [
  "// 由 scripts/generate-teaching-expected.mjs 生成，请勿手改。",
  "// 每条期望输出都是参考解在该组输入下的实际运行结果。",
  "import type { ExpectedOutputs, SampleTranscripts } from \"./types.js\";",
  "",
  `export const expectedOutputs: ExpectedOutputs = ${JSON.stringify(snapshot, null, 2)};`,
  "",
  `export const sampleTranscripts: SampleTranscripts = ${JSON.stringify(transcripts, null, 2)};`,
  ""
].join("\n");

if (checkOnly) {
  const current = readFileSync(target, "utf8");
  if (current !== serialized) {
    console.error("✗ 期望输出快照与参考解的实际输出不一致，请重新生成。");
    process.exit(1);
  }
  console.log(`✓ 快照与参考解、示例运行一致（${Object.keys(snapshot).length} 组用例 / ${Object.keys(transcripts).length} 份实录）`);
} else {
  writeFileSync(target, serialized, "utf8");
  console.log(`✓ 已写入 ${Object.keys(snapshot).length} 组期望输出、${Object.keys(transcripts).length} 份运行实录 → ${target}`);
}
