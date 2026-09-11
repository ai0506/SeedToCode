import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { runWithInputs } from "@caie-pseudocode/exercise";
import { chapter10 } from "../src/chapter-10.js";
import { chapter09 } from "../src/chapter-09.js";
import { course } from "../src/course.js";
import { expectedOutputs, sampleTranscripts } from "../src/expected-outputs.js";
import { verifyChapter } from "./shared.js";

verifyChapter({ chapter: chapter10, course: course.chapters, expectedOutputs, sampleTranscripts });

describe("Chapter 10 — 大纲落点", () => {
  it("五节，全章不引入任何新写法", () => {
    expect(chapter10.prerequisites).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(chapter10.sections.map((section) => section.id)).toEqual(["10.1", "10.2", "10.3", "10.4", "10.5"]);
    const afterChapter9 = [...chapter09.sections.at(-1)!.taughtFeatures].sort();
    for (const section of chapter10.sections) {
      expect([...section.taughtFeatures].sort(), `${section.id} 引入了新特征`).toEqual(afterChapter9);
    }
  });
});

describe("Chapter 10 — 讲的规则和引擎的行为一致", () => {
  const SEED = [
    "DECLARE Values : ARRAY[1:5] OF INTEGER",
    "DECLARE I : INTEGER",
    "DECLARE J : INTEGER",
    "DECLARE Temp : INTEGER",
    "Values[1] ← 3",
    "Values[2] ← 9",
    "Values[3] ← 1",
    "Values[4] ← 7",
    "Values[5] ← 5"
  ];

  it("不借临时变量的交换会把一个值弄丢——10.3 的反例靠这条", async () => {
    const source = [
      "DECLARE A : INTEGER",
      "DECLARE B : INTEGER",
      "A ← 3",
      "B ← 9",
      "A ← B",
      "B ← A",
      "OUTPUT A, \" \", B"
    ].join("\n");
    expect(analyzeSource(source).diagnostics).toHaveLength(0);
    expect((await runWithInputs(source, [])).outputs).toEqual(["9 9"]);
  });

  it("内层终点忘了减趟数会在运行时越界——10.4 的关卡靠这条", async () => {
    const source = [
      ...SEED,
      "FOR I ← 1 TO 4",
      "   FOR J ← 1 TO 5",
      "      IF Values[J] > Values[J + 1] THEN",
      "         Temp ← Values[J]",
      "         Values[J] ← Values[J + 1]",
      "         Values[J + 1] ← Temp",
      "      ENDIF",
      "   NEXT J",
      "NEXT I"
    ].join("\n");
    // 运行前看不出来：下标是算出来的 J + 1
    expect(analyzeSource(source).diagnostics.filter((d) => d.severity === "error")).toHaveLength(0);
    const run = await runWithInputs(source, []);
    expect(run.status).toBe("error");
    expect(run.error?.messageKey).toBe("runtime.index.outOfBounds");
  });

  it("标志加一步就会把命中的位置报大一格——10.2 的关卡靠这条", async () => {
    const search = (incrementAlways: boolean) =>
      [
        "DECLARE Values : ARRAY[1:5] OF INTEGER",
        "DECLARE Position : INTEGER",
        "DECLARE Found : BOOLEAN",
        "Values[1] ← 30",
        "Values[2] ← 80",
        "Values[3] ← 45",
        "Values[4] ← 80",
        "Values[5] ← 12",
        "Found ← FALSE",
        "Position ← 1",
        "WHILE Found = FALSE AND Position <= 5",
        "   IF Values[Position] = 45 THEN",
        "      Found ← TRUE",
        ...(incrementAlways ? ["   ENDIF", "   Position ← Position + 1"] : ["   ELSE", "      Position ← Position + 1", "   ENDIF"]),
        "ENDWHILE",
        "OUTPUT Position"
      ].join("\n");
    expect((await runWithInputs(search(false), [])).outputs).toEqual(["3"]);
    expect((await runWithInputs(search(true), [])).outputs).toEqual(["4"]);
  });

  it("带标志的冒泡排序在本来就有序时只走一趟——10.5 的关卡靠这条", async () => {
    const sortWithFlag = (values: number[]) =>
      [
        "DECLARE Values : ARRAY[1:5] OF INTEGER",
        "DECLARE J : INTEGER",
        "DECLARE Temp : INTEGER",
        "DECLARE Swapped : BOOLEAN",
        "DECLARE Passes : INTEGER",
        ...values.map((value, index) => `Values[${index + 1}] ← ${value}`),
        "Passes ← 0",
        "REPEAT",
        "   Swapped ← FALSE",
        "   Passes ← Passes + 1",
        "   FOR J ← 1 TO 4",
        "      IF Values[J] > Values[J + 1] THEN",
        "         Temp ← Values[J]",
        "         Values[J] ← Values[J + 1]",
        "         Values[J + 1] ← Temp",
        "         Swapped ← TRUE",
        "      ENDIF",
        "   NEXT J",
        "UNTIL Swapped = FALSE",
        "OUTPUT Passes"
      ].join("\n");
    expect((await runWithInputs(sortWithFlag([1, 3, 5, 7, 9]), [])).outputs).toEqual(["1"]);
    expect((await runWithInputs(sortWithFlag([3, 9, 1, 7, 5]), [])).outputs).toEqual(["3"]);
  });

  it("10.T1 的参考解先排序再在排好的数组里报位置", async () => {
    const run = await runWithInputs(chapter10.chapterTasks[0].referenceSolution, ["5", "1", "9", "1", "3", "7", "3"]);
    expect(run.outputs.slice(-8)).toEqual(["1", "1", "3", "5", "7", "9", "Enter the number to find", "Found at 3"]);
  });
});
