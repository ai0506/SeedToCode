import { describe, expect, it } from "vitest";
import { compareOutputs } from "../src/compare.js";

/**
 * 输出对不上时，要能说清是哪一类对不上。
 * 「输出不符」这四个字对学生没有任何指导意义。
 */
describe("输出比对的差异分类", () => {
  const inputs = ["Ada", "Lagos"];

  it("完全一致时通过", () => {
    const result = compareOutputs(["Ada lives in Lagos"], ["Ada lives in Lagos"], {}, inputs);
    expect(result.matches).toBe(true);
    expect(result.diffKind).toBeNull();
  });

  it("数据摆对了、引号里的文字写错 → literal", () => {
    const result = compareOutputs(["Ada lives in Lagos"], ["Ada live in Lagos"], {}, inputs);
    expect(result.matches).toBe(false);
    expect(result.diffKind).toBe("literal");
    expect(result.firstDiffLine).toBe(1);
  });

  it("文字对、两项数据顺序反了 → data", () => {
    const result = compareOutputs(["Ada lives in Lagos"], ["Lagos lives in Ada"], {}, inputs);
    expect(result.diffKind).toBe("data");
  });

  it("行数不对 → line-count", () => {
    const result = compareOutputs(["Ada lives in Lagos"], ["Ada lives in Lagos", "done"], {}, inputs);
    expect(result.diffKind).toBe("line-count");
    expect(result.firstDiffLine).toBe(2);
  });

  it("漏了一部分内容 → mixed", () => {
    const result = compareOutputs(["Ada lives in Lagos"], ["Ada"], {}, inputs);
    expect(result.diffKind).toBe("mixed");
  });

  it("不给输入时仍然能比对，只是分不出文字与数据", () => {
    const result = compareOutputs(["a"], ["b"]);
    expect(result.matches).toBe(false);
    expect(result.diffKind).toBe("literal");
  });

  it("尾部空白与末尾空行不算差异", () => {
    expect(compareOutputs(["x  ", "y"], ["x", "y", ""]).matches).toBe(true);
  });
});

describe("行数不对时优先说行数", () => {
  it("少写一行会让后面整体错位，这时不该说「文字不符」", () => {
    // 学生漏掉了提示语，于是第 1 行就开始对不上——但根子是少了一行
    const result = compareOutputs(
      ["Enter the seconds", "1 min 35 s"],
      ["1 min 35 s"],
      {},
      ["95"]
    );
    expect(result.matches).toBe(false);
    expect(result.diffKind).toBe("line-count");
    expect(result.firstDiffLine).toBe(1);
  });

  it("行数相同才去分文字错还是数据错", () => {
    expect(compareOutputs(["Ada lives in Lagos"], ["Ada live in Lagos"], {}, ["Ada", "Lagos"]).diffKind)
      .toBe("literal");
  });
});

describe("算出来的数字不对时，方向要指向数据而不是文字", () => {
  it("文字一样、只有数字不同 → data", () => {
    // 「每进一个班要清零」写漏了会得到这种输出：文字一个字没错，数字全串了
    const result = compareOutputs(
      ["Class 2: count 0 total 0"],
      ["Class 2: count 2 total 150"],
      {},
      ["80", "70", "-1", "-1", "90", "-1"]
    );
    expect(result.matches).toBe(false);
    expect(result.diffKind).toBe("data");
  });

  it("数字一样、文字不同仍然是 literal", () => {
    const result = compareOutputs(["Total: 360"], ["Total:360"], {}, ["120", "3"]);
    expect(result.diffKind).toBe("literal");
  });

  it("纯文字的差别不受影响", () => {
    const result = compareOutputs(["Even"], ["Odd"], {}, ["12"]);
    expect(result.diffKind).toBe("literal");
  });
});

describe("负数与「数字恰好等于某个输入」", () => {
  it("最大值算错成 0，而正确答案是负数 → data", () => {
    // 求最大值时把起点写成 0，整周都在零度以下就会露馅
    const result = compareOutputs(
      ["Highest: -1"],
      ["Highest: 0"],
      {},
      ["-5", "-3", "-8", "-1", "-6", "-2", "-4"]
    );
    expect(result.diffKind).toBe("data");
  });

  it("文字错了仍然是 literal，不受负号影响", () => {
    const result = compareOutputs(["Highest: -1"], ["Lowest: -1"], {}, ["-1"]);
    expect(result.diffKind).toBe("literal");
  });
});
