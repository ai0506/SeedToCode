import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { analyzeSource } from "../src/index.js";

const corpusRoot = fileURLToPath(new URL("../../../tests/pseudocode-samples/", import.meta.url));

const coreValidFiles = [
  "V01_declaration_and_io.pseudo",
  "V02_selection.pseudo",
  "V03_iteration.pseudo",
  "V04_arrays.pseudo",
  "V05_procedures_functions.pseudo",
  "V06_string_and_numeric_functions.pseudo",
  "V07_records_and_types.pseudo",
  "V08_text_files.pseudo",
  "V09_random_files.pseudo",
  "V10_oop_class.pseudo",
  "V11_bubble_sort.pseudo",
  "V12_comments_and_layout.pseudo"
];

const readSample = (group: "valid" | "invalid", file: string) =>
  readFileSync(`${corpusRoot}${group}/${file}`, "utf8");

const errorsFor = (source: string) =>
  analyzeSource(source, { profile: "advanced-2027", maxDiagnostics: 500 })
    .diagnostics
    .filter(({ severity }) => severity === "error");

describe("filesystem pseudocode sample corpus", () => {
  it.each(coreValidFiles)("accepts the CAIE-valid core sample %s", (file) => {
    expect(errorsFor(readSample("valid", file))).toEqual([]);
  });

  const invalidFiles = readdirSync(`${corpusRoot}invalid`)
    .filter((file) => file.endsWith(".pseudo"))
    .sort();

  it.each(invalidFiles)("rejects the intentionally invalid sample %s", (file) => {
    expect(errorsFor(readSample("invalid", file)).length).toBeGreaterThan(0);
  });
});
