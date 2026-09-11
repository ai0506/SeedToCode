import { describe, expect, it } from "vitest";
import { parseSource } from "@caie-pseudocode/language";
import { extractFeatures } from "../src/features.js";

describe("Chapter 2 基本类型与字面量特征", () => {
  it("分别识别六种声明类型和六种字面量", () => {
    const source = [
      "DECLARE Whole : INTEGER",
      "DECLARE Fraction : REAL",
      "DECLARE Letter : CHAR",
      "DECLARE Text : STRING",
      "DECLARE Ready : BOOLEAN",
      "DECLARE Today : DATE",
      "Whole ← 7",
      "Fraction ← 0.5",
      "Letter ← 'A'",
      'Text ← "Hi"',
      "Ready ← TRUE",
      "Today ← 10/09/2026"
    ].join("\n");
    const features = extractFeatures(parseSource(source).program);
    expect([...features]).toEqual(
      expect.arrayContaining([
        "type.integer", "type.real", "type.char", "type.string", "type.boolean", "type.date",
        "literal.integer", "literal.real", "literal.char", "literal.string", "literal.boolean", "literal.date",
        "assign.simple"
      ])
    );
  });

  it("声明类型不会凭空算作一个字面量", () => {
    const features = extractFeatures(parseSource("DECLARE Count : INTEGER").program);
    expect(features).toContain("type.integer");
    expect(features).not.toContain("literal.integer");
  });
});
