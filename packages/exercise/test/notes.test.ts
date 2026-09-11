import { describe, expect, it } from "vitest";
import { parseSource } from "@caie-pseudocode/language";
import { findCodeNotes, findUnpromptedInputs } from "../src/notes.js";

const notesFor = (source: string) => findCodeNotes(parseSource(source).program);

/**
 * `OUTPUT "Name lives in City"` 语法完全合法，引擎无话可说，
 * 但写的人多半以为变量会被替换掉。判题只说「输出对不上」指不到点子上。
 */
describe("变量被写进引号里", () => {
  it("认出引号里出现的已声明变量名", () => {
    const notes = notesFor(
      ["DECLARE Name : STRING", "DECLARE City : STRING", "INPUT Name", "INPUT City", 'OUTPUT "Name lives in City"'].join("\n")
    );
    expect(notes).toHaveLength(1);
    expect(notes[0].kind).toBe("variable-in-string");
    expect(notes[0].names.sort()).toEqual(["City", "Name"]);
    expect(notes[0].line).toBe(5);
  });

  it("大小写不同、又只命中一个名字时不报——太可能是误伤", () => {
    expect(notesFor('DECLARE Name : STRING\nOUTPUT "hello name"')).toHaveLength(0);
  });

  it("大小写不同但一句里命中两个名字，仍然报", () => {
    const notes = notesFor(
      ["DECLARE Name : STRING", "DECLARE Asw : STRING", 'OUTPUT "name lives in asw"'].join("\n")
    );
    expect(notes).toHaveLength(1);
    expect(notes[0].names.sort()).toEqual(["Asw", "Name"]);
  });

  it("提示语里出现变量名不算——它后面紧跟着 INPUT", () => {
    const notes = notesFor(
      ["DECLARE Name : STRING", 'OUTPUT "Enter the Name"', "INPUT Name", 'OUTPUT "done"'].join("\n")
    );
    expect(notes).toHaveLength(0);
  });

  it("同一句里既有字符串又有变量时不报——写的人显然已经会了", () => {
    expect(notesFor('DECLARE Name : STRING\nOUTPUT "Name is ", Name')).toHaveLength(0);
  });

  it("写在引号外面的变量不算", () => {
    expect(notesFor('DECLARE Name : STRING\nOUTPUT "hello ", Name')).toHaveLength(0);
  });

  it("只匹配整词，不误伤包含变量名的长单词", () => {
    expect(notesFor('DECLARE Age : INTEGER\nOUTPUT "Message"')).toHaveLength(0);
  });

  it("整句是一个字符串、名字大小写一致时报", () => {
    const notes = notesFor('DECLARE Total : INTEGER\nTotal ← 1\nOUTPUT "Total"');
    expect(notes).toHaveLength(1);
    expect(notes[0].line).toBe(3);
  });

  it("没有声明任何变量时不报", () => {
    expect(notesFor('OUTPUT "Name lives in City"')).toHaveLength(0);
  });

  it("循环和分支里面的 OUTPUT 一样会检查", () => {
    const notes = notesFor(
      ["DECLARE Total : INTEGER", "Total ← 1", "IF Total = 1 THEN", '   OUTPUT "Total"', "ENDIF"].join("\n")
    );
    expect(notes).toHaveLength(1);
    expect(notes[0].line).toBe(4);
  });
});

describe("INPUT 前面有没有提示语", () => {
  const promptsFor = (source: string) => findUnpromptedInputs(parseSource(source).program);

  it("每个 INPUT 前面都有 OUTPUT 时，返回空", () => {
    expect(
      promptsFor(
        ["DECLARE A : STRING", 'OUTPUT "Enter A"', "INPUT A", 'OUTPUT "Enter A again"', "INPUT A"].join("\n")
      )
    ).toEqual([]);
  });

  it("光秃秃的 INPUT 会被指出行号", () => {
    expect(promptsFor("DECLARE A : STRING\nINPUT A")).toEqual([2]);
  });

  it("两个 INPUT 连着写时，第二个也算没有提示", () => {
    expect(
      promptsFor(["DECLARE A : STRING", 'OUTPUT "Enter A"', "INPUT A", "INPUT A"].join("\n"))
    ).toEqual([4]);
  });

  it("循环体里的 INPUT 一样检查", () => {
    expect(
      promptsFor(
        ["DECLARE A : STRING", "DECLARE I : INTEGER", "FOR I ← 1 TO 3", "   INPUT A", "NEXT I"].join("\n")
      )
    ).toEqual([4]);
  });
});
