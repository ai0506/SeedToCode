export { FEATURE_IDS, extractFeatures } from "./features.js";
export type { FeatureId } from "./features.js";
export { compareOutputs } from "./compare.js";
export { findCodeNotes, findUnpromptedInputs } from "./notes.js";
export type { CodeNote } from "./notes.js";
export type { ComparisonOptions, ComparisonResult } from "./compare.js";
export { grade, runWithInputs } from "./grade.js";
export type {
  Constraint,
  Constraints,
  ConstraintResult,
  GradeInput,
  GradeResult,
  TestCase,
  TestResult
} from "./grade.js";
