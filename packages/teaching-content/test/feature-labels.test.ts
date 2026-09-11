import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { FEATURE_IDS } from "@caie-pseudocode/exercise";

/**
 * 界面上的「必须用 / 不能用 / 建议用到」显示的是特征的名字，不是特征 ID。
 * 漏一条学生就会看到 `select.case-otherwise` 这种内部标识——这种事已经发生过两次，
 * 所以把它钉在测试里：FEATURE_IDS 里的每一项都必须有一条中文（或关键字）标签。
 */
describe("界面上的特征名", () => {
  const source = readFileSync(fileURLToPath(new URL("../../../web/js/teaching-task.js", import.meta.url)), "utf8");
  const block = source.match(/var FEATURE_LABELS = \{([\s\S]*?)\n {3}\};/);

  it("能在 teaching-task.js 里找到标签表", () => {
    expect(block, "FEATURE_LABELS 不见了，或者格式变了").not.toBeNull();
  });

  it("每个特征 ID 都有标签，且标签本身不是 ID", () => {
    const labels = new Map(
      [...block![1].matchAll(/"([a-z0-9.-]+)"\s*:\s*"([^"]+)"/gu)].map((match) => [match[1], match[2]])
    );
    const missing = FEATURE_IDS.filter((feature) => !labels.has(feature));
    expect(missing, `这些特征没有标签：${missing.join(", ")}`).toHaveLength(0);
    for (const [feature, label] of labels) {
      expect(label, `${feature} 的标签还是 ID 本身`).not.toBe(feature);
    }
  });
});
