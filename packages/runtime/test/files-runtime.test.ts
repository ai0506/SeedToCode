import { describe, expect, it } from "vitest";
import { executeSource, type ExecutionController, type ExecutionEvent, type RuntimeVirtualFile } from "../src/index.js";

const textFiles: RuntimeVirtualFile[] = [
  { id: "input", name: "Input.txt", kind: "text", lines: ["Ada", "", "Lin"] },
  { id: "output", name: "Output.txt", kind: "text", lines: ["old"] }
];

describe("stage 4 virtual files", () => {
  it("copies text with EOF and commits WRITE output only after success", async () => {
    const events: ExecutionEvent[] = [];
    const result = await executeSource(`DECLARE LineOfText : STRING
OPENFILE "input.TXT" FOR READ
OPENFILE "Output.txt" FOR WRITE
WHILE NOT EOF("INPUT.txt")
   READFILE "Input.txt", LineOfText
   IF LineOfText = "" THEN
      WRITEFILE "output.TXT", "---"
   ELSE
      WRITEFILE "Output.txt", LineOfText
   ENDIF
ENDWHILE
CLOSEFILE "Input.txt"
CLOSEFILE "Output.txt"`, { virtualFiles: textFiles, onEvent: (event) => events.push(event) }).result;

    expect(result.status).toBe("completed");
    expect(result.fileChangesCommitted).toBe(true);
    expect(result.virtualFiles.find(({ id }) => id === "output")?.lines).toEqual(["Ada", "---", "Lin"]);
    expect(events.map(({ type }) => type)).toContain("file-written");
    expect(events.at(-2)?.type).toBe("file-closed");
  });

  it("supports APPEND and positions it after the final line", async () => {
    const result = await executeSource(`OPENFILE "Output.txt" FOR APPEND
WRITEFILE "output.txt", "next"
CLOSEFILE "OUTPUT.TXT"`, { virtualFiles: textFiles }).result;

    expect(result.status).toBe("completed");
    expect(result.virtualFiles.find(({ id }) => id === "output")?.lines).toEqual(["old", "next"]);
  });

  it("rolls back a cleared and written file after a later runtime error", async () => {
    const result = await executeSource(`OPENFILE "Output.txt" FOR WRITE
WRITEFILE "Output.txt", "new"
OUTPUT 1 / 0`, { virtualFiles: textFiles }).result;

    expect(result.status).toBe("error");
    expect(result.fileChangesCommitted).toBe(false);
    expect(result.virtualFiles.find(({ id }) => id === "output")?.lines).toEqual(["old"]);
  });

  it("rolls back file changes when the user stops at INPUT", async () => {
    let controller: ExecutionController;
    controller = executeSource(`DECLARE Name : STRING
OPENFILE "Output.txt" FOR WRITE
WRITEFILE "Output.txt", "temporary"
INPUT Name`, {
      virtualFiles: textFiles,
      onEvent(event) { if (event.type === "input-requested") controller.stop(); }
    });

    const result = await controller.result;
    expect(result.status).toBe("stopped");
    expect(result.virtualFiles.find(({ id }) => id === "output")?.lines).toEqual(["old"]);
  });

  it("rejects unsafe file names", async () => {
    for (const name of ["../secret.txt", "folder/data.txt", "https:data.txt"]) {
      const result = await executeSource(`OPENFILE "${name}" FOR WRITE`).result;
      expect(result.status).toBe("error");
      expect(result.error).toMatchObject({ code: "RT2009", messageKey: "runtime.file.invalidName" });
    }
  });

  it("uses 1-based RANDOM addresses and GETRECORD/PUTRECORD do not advance", async () => {
    const files: RuntimeVirtualFile[] = [{
      id: "staff",
      name: "Staff.dat",
      kind: "records",
      recordType: "Employee",
      records: [{ StaffID: 1, FullName: "Ada" }, { StaffID: 2, FullName: "Lin" }]
    }];
    const result = await executeSource(`TYPE Employee
   DECLARE StaffID : INTEGER
   DECLARE FullName : STRING
ENDTYPE
DECLARE Rec : Employee
OPENFILE "staff.DAT" FOR RANDOM
SEEK "Staff.dat", 2
GETRECORD "Staff.dat", Rec
OUTPUT Rec.StaffID, ":", Rec.FullName
Rec.FullName ← "Updated"
PUTRECORD "Staff.dat", Rec
GETRECORD "Staff.dat", Rec
OUTPUT Rec.FullName
SEEK "Staff.dat", 3
Rec.StaffID ← 3
Rec.FullName ← "New"
PUTRECORD "Staff.dat", Rec
CLOSEFILE "Staff.dat"`, { virtualFiles: files }).result;

    expect(result.status).toBe("completed");
    expect(result.outputs).toEqual(["2:Lin", "Updated"]);
    expect(result.virtualFiles[0]?.records).toEqual([
      { StaffID: 1, FullName: "Ada" },
      { StaffID: 2, FullName: "Updated" },
      { StaffID: 3, FullName: "New" }
    ]);
  });

  it("prevents RANDOM holes and rolls back the attempted write", async () => {
    const files: RuntimeVirtualFile[] = [{ id: "staff", name: "Staff.dat", kind: "records", records: [] }];
    const result = await executeSource(`TYPE Employee
   DECLARE StaffID : INTEGER
ENDTYPE
DECLARE Rec : Employee
Rec.StaffID ← 5
OPENFILE "Staff.dat" FOR RANDOM
SEEK "Staff.dat", 2
PUTRECORD "Staff.dat", Rec`, { virtualFiles: files }).result;

    expect(result.status).toBe("error");
    expect(result.error).toMatchObject({ code: "RT2106", messageKey: "runtime.random.cannotCreateHole" });
    expect(result.virtualFiles[0]?.records).toEqual([]);
  });

  it("enforces per-file limits transactionally", async () => {
    const result = await executeSource(`OPENFILE "New.txt" FOR WRITE
WRITEFILE "New.txt", "12345"`, { maxFileBytes: 4 }).result;

    expect(result.status).toBe("error");
    expect(result.error).toMatchObject({ code: "RT2201", messageKey: "runtime.file.limit.fileBytes" });
    expect(result.virtualFiles).toEqual([]);
  });
});
