/*
 * 学习助理评测样本（evals/ai-assistant/samples.json）的自检。
 *
 * 这里不调用任何模型：它保证的是「样本本身说的是真话」。诊断类样本声称引擎会报
 * PC2102，那就真拿 analyzeSource 跑一遍；运行错误类声称会停在 RT1301，那就真跑。
 * 否则引擎的诊断代码一改，样本还在测一个早已不存在的报错，而评测照样「通过」。
 */
import { describe, expect, it } from "vitest";
import { analyzeSource } from "@caie-pseudocode/language";
import { executeSource } from "@caie-pseudocode/runtime";
import {
  ADVERSARIAL,
  ASSIGNMENT_PAGES,
  CATEGORIES,
  MODES,
  PAGES,
  ROLES,
  VIOLATIONS,
  loadSamples,
  readRawSamples
} from "../evals/ai-assistant/resolve";

const raw = readRawSamples();
const samples = loadSamples();

describe("学习助理评测样本 · 结构", () => {
  it("计划 §8 的门槛：固定样本不少于 100 条，且 id 唯一", () => {
    expect(samples.length).toBeGreaterThanOrEqual(100);
    expect(new Set(samples.map((s) => s.id)).size).toBe(samples.length);
  });

  it("每一类都有足够的样本，对抗类不少于 8 条", () => {
    for (const category of CATEGORIES) {
      const count = samples.filter((s) => s.category === category).length;
      expect(count, category).toBeGreaterThanOrEqual(ADVERSARIAL.includes(category) ? 8 : 5);
    }
  });

  it("字段取值都在固定词表里", () => {
    for (const s of samples) {
      expect(CATEGORIES, s.id).toContain(s.category);
      expect(PAGES, s.id).toContain(s.page);
      expect(ROLES, s.id).toContain(s.role);
      expect(MODES, s.id).toContain(s.mode);
      expect(["explain", "decline"], s.id).toContain(s.expect);
      for (const v of s.mustNot) expect(Object.keys(VIOLATIONS), s.id).toContain(v);
    }
  });

  it("用户问题不超过计划 §7 的 200 字输入上限", () => {
    for (const s of samples) {
      expect(s.question.length, s.id).toBeGreaterThan(0);
      expect([...s.question].length, s.id).toBeLessThanOrEqual(200);
    }
  });

  it("对抗样本都写明了回答里不能出现什么", () => {
    for (const s of samples.filter((x) => ADVERSARIAL.includes(x.category))) {
      expect(s.mustNot.length, s.id).toBeGreaterThan(0);
    }
  });

  it("注入类样本确实带着注入材料", () => {
    for (const s of samples.filter((x) => x.category === "selection-injection")) {
      expect(s.mode, s.id).toBe("selection");
      expect(s.context.selected, s.id).toBeTruthy();
      expect(s.mustNot, s.id).toContain("follow-injected-instruction");
    }
    for (const s of samples.filter((x) => x.category === "comment-injection")) {
      expect(s.context.code, s.id).toBeTruthy();
      expect(s.mustNot, s.id).toContain("follow-injected-instruction");
    }
  });
});

describe("学习助理评测样本 · 页面、角色与模式组合合法", () => {
  it("老师面板只有老师；老师草稿模式只在老师面板", () => {
    for (const s of samples) {
      if (s.page === "classes") expect(s.role, s.id).toBe("teacher");
      if (s.mode === "teacher-draft") expect([s.page, s.role], s.id).toEqual(["classes", "teacher"]);
    }
  });

  it("作业安全模式的页面上，学生没有一条预期是「照做」的代写类请求", () => {
    for (const s of samples.filter((x) => ASSIGNMENT_PAGES.includes(x.page) && x.category === "assignment-bypass")) {
      expect(s.expect, s.id).toBe("decline");
    }
  });

  it("课程题页面都指向一道真实的题；自出题页都带老师题面", () => {
    for (const s of samples) {
      if (s.page === "task") expect(s.context.task, s.id).toBeTruthy();
      if (s.page === "custom-task") expect(s.context.customTask?.statement, s.id).toBeTruthy();
    }
  });

  it("选区模式都带选区；诊断与运行错误模式都写明了引擎事实", () => {
    for (const s of samples) {
      if (s.mode === "selection") expect(s.context.selected, s.id).toBeTruthy();
      if (s.mode === "diagnostic") expect(s.context.diagnostics?.length, s.id).toBeGreaterThan(0);
      if (s.mode === "runtime-error") expect(s.context.runtimeError, s.id).toBeTruthy();
    }
  });
});

describe("学习助理评测样本 · 引用都解析得到真实内容", () => {
  it("taskRef / sectionRef / sampleRef / selectedFromTask 都能解析（loadSamples 没抛错即成立）", () => {
    const refs = raw.filter((s) => s.context && (s.context.taskRef || s.context.sectionRef || s.context.sampleRef || s.context.selectedFromTask));
    expect(refs.length).toBeGreaterThan(20);
  });

  it("引用自带样例的那条拿到的是 samples.js 里的真 BubbleSort", () => {
    const s = samples.find((x) => raw.find((r) => r.id === x.id)?.context?.sampleRef === "BubbleSort.pseudocode");
    expect(s?.context.code).toContain("CALL BubbleSort(Numbers)");
    expect(analyzeSource(s!.context.code!).diagnostics.filter((d) => d.severity === "error")).toEqual([]);
  });

  it("搬题到实验室的那条，选区就是课程题面原文", () => {
    const s = samples.find((x) => raw.find((r) => r.id === x.id)?.context?.selectedFromTask);
    expect(s?.page).toBe("lab");
    expect(s?.context.selected?.length).toBeGreaterThan(20);
  });
});

describe("学习助理评测样本 · 声称的引擎事实与真实引擎一致", () => {
  for (const s of samples.filter((x) => x.context.diagnostics)) {
    it(`${s.id}：analyzeSource 确实报 ${s.context.diagnostics!.join("、")}`, () => {
      expect(s.context.code, s.id).toBeTruthy();
      const codes = analyzeSource(s.context.code!).diagnostics.map((d) => d.code);
      for (const code of s.context.diagnostics!) expect(codes, s.id).toContain(code);
    });
  }

  for (const s of samples.filter((x) => x.context.runtimeError)) {
    it(`${s.id}：运行确实停在 ${s.context.runtimeError}`, async () => {
      expect(analyzeSource(s.context.code!).diagnostics.filter((d) => d.severity === "error"), s.id).toEqual([]);
      const inputs = [...(s.context.inputs ?? [])];
      const controller = executeSource(s.context.code!, {
        maxSteps: 20000,
        onEvent: (event) => {
          if (event.type !== "input-requested") return;
          const next = inputs.shift();
          if (next === undefined) throw new Error(`${s.id}: 输入不够`);
          queueMicrotask(() => controller.provideInput(next));
        }
      });
      const result = await controller.result;
      expect(result.status, s.id).toBe("error");
      expect(result.error?.code, s.id).toBe(s.context.runtimeError);
    });
  }
});
