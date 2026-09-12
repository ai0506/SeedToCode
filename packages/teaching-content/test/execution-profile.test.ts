import { describe, expect, it } from "vitest";
import { grade, runWithInputs } from "@caie-pseudocode/exercise";
import { allChapters } from "../src/course.js";
import { executionProfileOf } from "../src/types.js";

/*
 * 执行档是「这一章的代码能用哪些特性跑」的闸门（teaching/07-HANDOFF.md 3.16）。
 * 它有一个很坏的失败形态：档位没传下去时，A Level 的写法在预检就被拒，
 * 学生看到的是「跑不起来」而不是「答错了」——而所有测试照样是绿的，
 * 因为现在还没有 A Level 章节会走到那条路。
 *
 * 所以这里不等 Chapter 17 上线，先用一段最小的 A Level 代码把整条链路钉住。
 */

/** Paper 3 里最常见的那一类：一段只有类型声明的伪代码。 */
const ADVANCED_SOURCE = [
  "TYPE Season = (Spring, Summer, Autumn, Winter)",
  "DECLARE ThisSeason : Season",
  "ThisSeason ← Spring",
  "IF ThisSeason = Spring THEN",
  '   OUTPUT "spring"',
  "ENDIF"
].join("\n");

describe("执行档", () => {
  it("省略时解析为 core-2027", () => {
    expect(executionProfileOf({})).toBe("core-2027");
    expect(executionProfileOf({ executionProfile: undefined })).toBe("core-2027");
  });

  it("显式声明时按声明的来", () => {
    expect(executionProfileOf({ executionProfile: "advanced-2027" })).toBe("advanced-2027");
  });

  it("core-2027 会在预检拒绝 A Level 写法，advanced-2027 放行", async () => {
    const core = await runWithInputs(ADVANCED_SOURCE, [], { profile: "core-2027" });
    expect(core.status, "core 档本应拒绝枚举").toBe("preflight-error");
    expect(core.error?.code).toBe("RT1106");

    const advanced = await runWithInputs(ADVANCED_SOURCE, [], { profile: "advanced-2027" });
    expect(advanced.status).toBe("completed");
    expect(advanced.outputs).toEqual(["spring"]);
  });

  it("判题带上 advanced-2027 时，A Level 参考解才判得过", async () => {
    const tests = [{ id: "t1", kind: "normal" as const, inputs: [], expected: ["spring"], caseHint: "只有一种走法。" }];

    const withoutProfile = await grade({ source: ADVANCED_SOURCE, tests });
    expect(withoutProfile.failedLayer, "不带档位时应当因为跑不起来而失败在 L2").toBe("L2");

    const withProfile = await grade({ source: ADVANCED_SOURCE, tests, execute: { profile: "advanced-2027" } });
    expect(withProfile.failedLayer, "带上 advanced-2027 后应当通过").toBeNull();
  });

  it("现有十六章都是 AS，因此都留在 core-2027", () => {
    for (const chapter of allChapters) {
      expect(executionProfileOf(chapter), `Chapter ${chapter.id}`).toBe("core-2027");
      expect(chapter.level, `Chapter ${chapter.id}`).toBe("AS");
    }
  });
});
