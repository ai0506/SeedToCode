/**
 * 输出比对。显示格式一律沿用 packages/runtime 的既有约定，这里只负责比对策略，
 * 不重新格式化任何值——否则学生在编辑器里看到的输出会和判题结果对不上。
 * 规则见 teaching/03-EXERCISE_SPEC.md 4.4。
 */

export type ComparisonOptions = {
  /** 忽略大小写。默认 false。 */
  ignoreCase?: boolean;
  /** 去掉每行首尾空白。默认只去尾部空白。 */
  trimEachLine?: boolean;
  /** 数字容差；只对整行可解析为数字的行生效。默认不启用。 */
  numericTolerance?: number | null;
};

/**
 * 输出对不上时，到底是哪一类对不上。
 * 「输出不符」这四个字对学生没有任何帮助——他需要知道该去改引号里的文字，
 * 还是该去检查显示的是不是该显示的那个东西。
 */
export type DiffKind =
  /** 行数就不对 */
  | "line-count"
  /** 数据摆对了位置，但引号里的文字和期望不一样 */
  | "literal"
  /** 引号里的文字没问题，但显示出来的数据不对（用错变量、顺序反了、漏了一项） */
  | "data"
  /** 两样都对不上，或者判断不出来 */
  | "mixed";

export type ComparisonResult = {
  matches: boolean;
  /** 第一处不同的行号（1-based）；完全相同时为 null。 */
  firstDiffLine: number | null;
  /** 只有在不匹配时才有意义。 */
  diffKind: DiffKind | null;
};

function normalize(lines: string[], options: ComparisonOptions): string[] {
  const trimmed = lines.map((line) => (options.trimEachLine ? line.trim() : line.replace(/\s+$/u, "")));
  while (trimmed.length > 0 && trimmed[trimmed.length - 1] === "") trimmed.pop();
  return options.ignoreCase ? trimmed.map((line) => line.toLowerCase()) : trimmed;
}

function sameLine(expected: string, actual: string, tolerance: number | null | undefined): boolean {
  if (expected === actual) return true;
  if (tolerance == null) return false;
  const a = Number(expected);
  const b = Number(actual);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  return Math.abs(a - b) <= tolerance;
}

/**
 * 把一行里「来自输入的数据」抠掉，剩下的就是代码里写死的文字骨架。
 * 骨架相同 = 文字写对了；骨架不同 = 引号里的文字有出入。
 */
function skeleton(line: string, inputs: string[]): { text: string; slots: number } {
  let slots = 0;
  let text = line;
  for (const value of [...inputs].sort((a, b) => b.length - a.length)) {
    if (!value) continue;
    const parts = text.split(value);
    slots += parts.length - 1;
    text = parts.join("\u0000");
  }
  return { text, slots };
}

function classify(expectedLine: string, actualLine: string, inputs: string[]): DiffKind {
  const e = skeleton(expectedLine, inputs);
  const a = skeleton(actualLine, inputs);
  if (e.text === a.text) return "data";
  if (e.slots === a.slots) return "literal";
  return "mixed";
}

export function compareOutputs(
  expected: string[],
  actual: string[],
  options: ComparisonOptions = {},
  inputs: string[] = []
): ComparisonResult {
  const left = normalize(expected, options);
  const right = normalize(actual, options);
  const length = Math.max(left.length, right.length);

  let firstDiff: number | null = null;
  for (let index = 0; index < length; index += 1) {
    const a = left[index];
    const b = right[index];
    if (a === undefined || b === undefined || !sameLine(a, b, options.numericTolerance)) {
      firstDiff = index + 1;
      break;
    }
  }
  if (firstDiff === null) return { matches: true, firstDiffLine: null, diffKind: null };

  // 行数对不上时，先说行数——哪怕第一处不同出现在更早的位置。
  // 少写一行提示语会让后面每一行都错位，这时说「文字不符」是在指着错位后的行说话。
  if (left.length !== right.length) {
    return { matches: false, firstDiffLine: firstDiff, diffKind: "line-count" };
  }
  return {
    matches: false,
    firstDiffLine: firstDiff,
    diffKind: classify(left[firstDiff - 1], right[firstDiff - 1], inputs)
  };
}
