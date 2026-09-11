import { describe, expect, it } from "vitest";
import { runWithInputs } from "../src/grade.js";

/**
 * 运行实录必须反映真实的执行顺序。
 * 「先列全部输入、再列全部输出」是错的——程序其实是先显示提问、再等输入。
 */
describe("运行实录", () => {
  it("输出与输入按真实发生顺序交错", async () => {
    const run = await runWithInputs(
      ['DECLARE Name : STRING', 'OUTPUT "What is your name?"', "INPUT Name", 'OUTPUT "Hello, ", Name'].join("\n"),
      ["Ada"]
    );
    expect(run.status).toBe("completed");
    expect(run.transcript).toEqual([
      { kind: "output", text: "What is your name?" },
      { kind: "input", text: "Ada" },
      { kind: "output", text: "Hello, Ada" }
    ]);
  });

  it("没有输入的程序，实录里只有输出", async () => {
    const run = await runWithInputs('OUTPUT "one"\nOUTPUT "two"', []);
    expect(run.transcript.every((entry) => entry.kind === "output")).toBe(true);
    expect(run.transcript.map((entry) => entry.text)).toEqual(["one", "two"]);
  });

  it("输入不够时标记为耗尽，不会静默通过", async () => {
    const run = await runWithInputs("DECLARE A : STRING\nINPUT A\nINPUT A", ["x"]);
    expect(run.exhausted).toBe(true);
  });
});
