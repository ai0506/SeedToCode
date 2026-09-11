import { describe, expect, it } from "vitest";
import { analyzeSource } from "../src/index.js";

describe("keyword typo hints", () => {
  it("suggests a one-letter keyword correction only when simulation removes an error", () => {
    const result = analyzeSource('OUTPU "Hello"');
    expect(result.diagnostics).toContainEqual(expect.objectContaining({
      code: "PC5004", ruleId: "TYPO-001", severity: "error", args: { actual: "OUTPU", suggested: "OUTPUT" }, fix: expect.objectContaining({ newText: "OUTPUT" })
    }));
    expect(result.diagnostics.some(({ code }) => code === "PC2101")).toBe(false);
  });

  it("does not mistake a declared variable for a keyword typo", () => {
    const result = analyzeSource("DECLARE Outpu : INTEGER\nOutpu ← 1\nOUTPUT Outpu");
    expect(result.diagnostics.some(({ ruleId }) => ruleId === "TYPO-001")).toBe(false);
  });

  it("keeps suggesting independent keyword typos when other errors remain", () => {
    const result = analyzeSource(`DECLARE Name : STRING
Declarr cit: string
outpu "Enter the name"
inputt cit`);
    expect(result.diagnostics.filter(({ ruleId }) => ruleId === "TYPO-001").map(({ args }) => args?.suggested))
      .toEqual(["DECLARE", "OUTPUT", "INPUT"]);
  });
});
