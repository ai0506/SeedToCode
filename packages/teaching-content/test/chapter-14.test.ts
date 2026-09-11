import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { runWithInputs } from "@caie-pseudocode/exercise";
import { chapter14 } from "../src/chapter-14.js";
import { course } from "../src/course.js";
import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({ chapter: chapter14, course: course.chapters, expectedOutputs, sampleTranscripts });

describe("Chapter 14 — 大纲落点", () => {
  it("六节，写在 14.1、读在 14.3、APPEND 在 14.4、EOF 在 14.5", () => {
    expect(chapter14.prerequisites).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    expect(chapter14.sections.map((section) => section.id)).toEqual(["14.1", "14.2", "14.3", "14.4", "14.5", "14.6"]);
    const taught = (id: string) => chapter14.sections.find((section) => section.id === id)!.taughtFeatures;
    expect(taught("14.2")).toEqual(expect.arrayContaining(["file.open-write", "file.write", "file.close"]));
    expect(taught("14.2")).not.toContain("file.read");
    expect(taught("14.3")).toContain("file.read");
    expect(taught("14.3")).not.toContain("file.open-append");
    expect(taught("14.4")).toContain("file.open-append");
    expect(taught("14.4")).not.toContain("builtin.eof");
    expect(taught("14.5")).toContain("builtin.eof");
  });
});

describe("Chapter 14 — 讲的规则和引擎的行为一致", () => {
  const run = (source: string) => analyzeSource(source).diagnostics;

  it("每次运行都是从空的文件系统开始，所以示例必须自己先写再读", async () => {
    const source = [
      'OPENFILE "Fresh.txt" FOR WRITE',
      'WRITEFILE "Fresh.txt", "Zed"',
      'CLOSEFILE "Fresh.txt"',
      "DECLARE Line : STRING",
      'OPENFILE "Fresh.txt" FOR READ',
      'READFILE "Fresh.txt", Line',
      "OUTPUT Line",
      'CLOSEFILE "Fresh.txt"'
    ].join("\n");
    // 连跑两次结果完全一样——上一次留下的内容不会漏进下一次
    expect((await runWithInputs(source, [])).outputs).toEqual(["Zed"]);
    expect((await runWithInputs(source, [])).outputs).toEqual(["Zed"]);
  });

  it("读进非 STRING 变量、没打开就写、只读模式下写，都在运行前被拦下", () => {
    const intTarget = [
      "DECLARE N : INTEGER",
      'OPENFILE "Nums.txt" FOR WRITE',
      'WRITEFILE "Nums.txt", 5',
      'CLOSEFILE "Nums.txt"',
      'OPENFILE "Nums.txt" FOR READ',
      'READFILE "Nums.txt", N',
      'CLOSEFILE "Nums.txt"'
    ].join("\n");
    expect(run(intTarget).some((d) => d.ruleId === "FILE-002" && d.range.start.line === 6)).toBe(true);
    expect(run('WRITEFILE "X.txt", "a"').some((d) => d.ruleId === "FILE-003" && d.range.start.line === 1)).toBe(true);
    const writeInRead = [
      'OPENFILE "L.txt" FOR WRITE',
      'CLOSEFILE "L.txt"',
      'OPENFILE "L.txt" FOR READ',
      'WRITEFILE "L.txt", "x"',
      'CLOSEFILE "L.txt"'
    ].join("\n");
    expect(run(writeInRead).some((d) => d.ruleId === "FILE-003" && d.range.start.line === 4)).toBe(true);
  });

  it("FOR WRITE 一打开就清空，FOR APPEND 保留——14.4 的关卡靠这条", async () => {
    const reopen = (mode: string) =>
      [
        "DECLARE Line : STRING",
        'OPENFILE "L.txt" FOR WRITE',
        'WRITEFILE "L.txt", "first"',
        'CLOSEFILE "L.txt"',
        `OPENFILE "L.txt" FOR ${mode}`,
        'CLOSEFILE "L.txt"',
        'OPENFILE "L.txt" FOR READ',
        'IF EOF("L.txt") THEN',
        '   OUTPUT "empty"',
        "ELSE",
        '   READFILE "L.txt", Line',
        "   OUTPUT Line",
        "ENDIF",
        'CLOSEFILE "L.txt"'
      ].join("\n");
    // 什么都没写，只是重新打开了一次
    expect((await runWithInputs(reopen("WRITE"), [])).outputs).toEqual(["empty"]);
    expect((await runWithInputs(reopen("APPEND"), [])).outputs).toEqual(["first"]);
  });

  it("空文件一打开 EOF 就是 TRUE——14.5 的关卡靠这条", async () => {
    const source = [
      'OPENFILE "E.txt" FOR WRITE',
      'CLOSEFILE "E.txt"',
      'OPENFILE "E.txt" FOR READ',
      'IF EOF("E.txt") THEN',
      '   OUTPUT "empty"',
      "ENDIF",
      'CLOSEFILE "E.txt"'
    ].join("\n");
    expect((await runWithInputs(source, [])).outputs).toEqual(["empty"]);
  });

  it("读过末尾要到运行时才停，而且前面的输出已经出来了——14.5 的反例靠这条", async () => {
    const source = [
      "DECLARE Line : STRING",
      'OPENFILE "One.txt" FOR WRITE',
      'WRITEFILE "One.txt", "only"',
      'CLOSEFILE "One.txt"',
      'OPENFILE "One.txt" FOR READ',
      'READFILE "One.txt", Line',
      "OUTPUT Line",
      'READFILE "One.txt", Line',
      "OUTPUT Line",
      'CLOSEFILE "One.txt"'
    ].join("\n");
    expect(run(source).filter((d) => d.severity === "error")).toHaveLength(0);
    const result = await runWithInputs(source, []);
    expect(result.status).toBe("error");
    expect(result.outputs).toEqual(["only"]);
    expect(result.error?.code).toBe("RT2002");
  });

  it("14.T1 的参考解一个都挑不中时只剩计数那一行", async () => {
    const none = await runWithInputs(chapter14.chapterTasks[0].referenceSolution, ["Ann", "Bob", "Cy", "Dee", "Eli"]);
    expect(none.outputs.slice(-1)).toEqual(["Count: 0"]);
    const some = await runWithInputs(chapter14.chapterTasks[0].referenceSolution, ["Alice", "Bo", "Charlie", "Di", "Edward"]);
    expect(some.outputs.slice(-4)).toEqual(["Alice", "Charlie", "Edward", "Count: 3"]);
  });
});
