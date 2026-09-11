import { describe, expect, it } from "vitest";
import { grade, runWithInputs } from "../src/index.js";

/**
 * 程序跑到一半停了的时候，判题结果要带着「停在哪一行、为什么」一起回来。
 * 少了这一条，界面只能说「程序中途出错了」，而学生翻遍页面也找不到那个错在哪。
 */
const DIVIDES_BY_COUNT = [
  "DECLARE Score : INTEGER",
  "DECLARE Total : INTEGER",
  "DECLARE Count : INTEGER",
  "Total ← 0",
  "Count ← 0",
  'OUTPUT "Enter a score"',
  "INPUT Score",
  "WHILE Score <> -1",
  "   Total ← Total + Score",
  "   Count ← Count + 1",
  '   OUTPUT "Enter a score"',
  "   INPUT Score",
  "ENDWHILE",
  'OUTPUT "Average: ", Total DIV Count'
].join("\n");

describe("判题结果里的运行时错误", () => {
  it("runWithInputs 把停下来的原因和行号带回来", async () => {
    const run = await runWithInputs(DIVIDES_BY_COUNT, ["-1"]);
    expect(run.status).toBe("error");
    expect(run.error?.messageKey).toBe("runtime.math.divisionByZero");
    expect(run.error?.line).toBe(14);
  });

  it("跑得完的程序不带错误", async () => {
    const run = await runWithInputs(DIVIDES_BY_COUNT, ["8", "-1"]);
    expect(run.status).toBe("completed");
    expect(run.error).toBeNull();
  });

  it("grade 把它放进那一组用例的结果里", async () => {
    const result = await grade({
      source: DIVIDES_BY_COUNT,
      tests: [
        { id: "t1", kind: "normal", inputs: ["8", "-1"], caseHint: "读到一个分数。", expected: ["Enter a score", "Enter a score", "Average: 8"] },
        { id: "t2", kind: "boundary", inputs: ["-1"], caseHint: "一个分数都没有。", expected: ["Enter a score", "No scores"] }
      ]
    });
    expect(result.passed).toBe(false);
    const failed = result.testResults.find((item) => !item.passed);
    expect(failed?.id).toBe("t2");
    expect(failed?.status).toBe("error");
    expect(failed?.runtimeError?.line).toBe(14);
    // 通过的那一组不该挂着别人的错误
    expect(result.testResults.find((item) => item.passed)?.runtimeError).toBeNull();
  });
});
