# Content gaps and test changes

The candidate retains all sixteen authored AS chapters, their section numbers, navigation, quiz positions, exercise IDs and chapter-task IDs. Reference solutions are retained for the remaining original exercises. No unusable empty exercise is presented to learners.

## Temporary gap

Chapter **15.5**, first explanation block: one callout formerly reproducing official wording is now a plain **Content under development** note. It is not labeled as a Cambridge rule. The chapter's original explanations, executable examples and quiz remain available. Some external quotations in planning/review Markdown and historical technical notes also have this placeholder; those documents are not additional student lessons.

The final closure also removes two concrete external-answer quotations from the Chapter 17 planning note and the historical input-prompt changelog entry. Their document positions use Content under development; no additional student lesson, quiz or task is removed.

Official PDFs and full transcriptions remain excluded. Official links and the independent-project statement remain in `EXTERNAL_REFERENCES.md` and the README. Chapters 17–23 were already unfinished before this cleanup.

## Concrete fixtures replaced

| Location / stable ID | Short project-written replacement | Retained verification / changed scope |
| --- | --- | --- |
| `ROUTINE-003` | Adjust two integers with a zero branch | Parameters, return paths and function calls; no longer the external maximum example. A new test independently checks both branches. |
| `RECORD-001` and records tests | Packet with character/integer fields | Record parsing, symbols, member typing and assignment; the former string field is now a character field. Other record tests retain strings and nested records. |
| Language OOP tests and runtime inheritance test | Meter/DoubleMeter integer calculation and Vault access errors | Constructors, SUPER, inheritance, method calls, private access and invalid arguments; former named pet/string narrative is absent. |
| Set parser/runtime tests | Two sign characters | Element-type rejection, duplicate elimination, assignment/copy display and nonprimitive OUTPUT error remain; the former five-element fixture is absent. |
| Enum-pointer runtime test | Three project-defined phases | Pointer dereference plus ordinal increment remains; former four-season example identity/boundary is absent. Other generic enum syntax tests remain. |
| `V07_records_and_types.pseudo` | Two parcel records | Record array copies, integer/date/character/string fields, enum and integer pointer; loop extent is two instead of thirty. New execution test checks computed output 23. |
| `V10_oop_class.pseudo` | Gauge/ScaledGauge calculation | Two/three constructor arguments, inherited update method, private field and derived getter; new execution test checks 7:21. Former string naming/breed scenario is absent. |
| `TEST_CORPUS.md` | Matching short fixtures | IDs retained and provenance/output labels updated; historical versions are also filtered. |

No test case was deleted or disabled. Five additional tests check the pre-cleanup course structure, absence of empty tasks, new function/record results and actual V07/V10 files. This preserves the listed properties, not every former literal, data size, branch combination or scenario. Passing these tests is not exhaustive regression or legal proof.

Raw removed material, recovery bundles, hashes and the detailed old/new history mapping are kept only in the maintainer's protected local audit directory, outside this repository. They must not be copied into a public issue, commit, release archive or repository.
