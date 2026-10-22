import { readFileSync } from "node:fs";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

function restoreApi() {
  const context: Record<string, unknown> = { globalThis: {}, JSON };
  vm.runInNewContext(readFileSync(new URL("../web/js/runtime-file-restore.js", import.meta.url), "utf8"), context);
  return (context.globalThis as { CAIERuntimeFileRestore: any }).CAIERuntimeFileRestore;
}

describe("运行时文件单次恢复", () => {
  it("保留一次修改前内容，恢复后清除 slot", () => {
    const api = restoreApi();
    const file = { id: "f", name: "Data.txt", kind: "text", lines: ["before"] };
    const slots: Record<string, unknown> = {};

    expect(api.replace(file, { kind: "text", lines: ["after"] }, slots)).toBe(true);
    expect(file.lines).toEqual(["after"]);
    expect(api.has(slots, "f")).toBe(true);
    expect(api.restore(file, slots)).toBe(true);
    expect(file.lines).toEqual(["before"]);
    expect(api.has(slots, "f")).toBe(false);
    expect(api.restore(file, slots)).toBe(false);
  });

  it("不为无变化保存建立 slot，并支持导入后首次修改", () => {
    const api = restoreApi();
    const file = { id: "imported", name: "Imported.txt", kind: "text", lines: ["source"] };
    const slots: Record<string, unknown> = {};

    expect(api.replace(file, { kind: "text", lines: ["source"] }, slots)).toBe(false);
    expect(api.has(slots, "imported")).toBe(false);
    api.replace(file, { kind: "text", lines: ["changed"] }, slots);
    api.restore(file, slots);
    expect(file.lines).toEqual(["source"]);
  });

  it("为运行时真正改动的既有记录文件建立 slot", () => {
    const api = restoreApi();
    const before = [{ id: "records", name: "Data.dat", kind: "records", recordType: "T", records: [{ id: 1 }] }];
    const after = [{ id: "records", name: "Data.dat", kind: "records", recordType: "T", records: [{ id: 1 }, { id: 2 }] }];
    const slots: Record<string, unknown> = {};

    api.captureChanges(before, after, slots);
    expect(api.has(slots, "records")).toBe(true);
    api.restore(after[0], slots);
    expect(after[0].records).toEqual([{ id: 1 }]);
  });
});
