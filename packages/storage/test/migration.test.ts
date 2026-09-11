import { describe, expect, it } from "vitest";
import { migrateLegacyState } from "../src/migration.js";

describe("legacy local storage migration", () => {
  it("splits the editor blob into a default project and typed files", () => {
    const snapshot = migrateLegacyState({
      docs: [{ id: "doc-1", name: "Main.pseudocode", source: "OUTPUT 1", updatedAt: 10 }],
      activeId: "doc-1",
      runtimeFiles: [{ id: "data-1", name: "Data.txt", kind: "text", lines: ["a"] }],
      settings: { theme: "dark" }
    });

    expect(snapshot.projects).toHaveLength(1);
    expect(snapshot.projects[0].activeFileId).toBe("doc-1");
    expect(snapshot.files.map((file) => [file.id, file.kind])).toEqual([
      ["doc-1", "source"],
      ["data-1", "runtime"]
    ]);
    expect(snapshot.preferences.value).toEqual({ theme: "dark" });
  });

  it("keeps gates, position without scrollTop, and personal drafts separate", () => {
    const snapshot = migrateLegacyState({}, {
      gates: { "2/2.1": true, "2/2.2": false },
      position: { chapterId: 2, sectionId: "2.1", scrollTop: 900 },
      answers: { "2/2.1.1": "OUTPUT 2" }
    });

    expect(snapshot.teachingProgress.map((item) => item.id)).toEqual(["2/2.1"]);
    expect(snapshot.teachingPosition).toMatchObject({ chapterId: 2, sectionId: "2.1" });
    expect(snapshot.teachingPosition).not.toHaveProperty("scrollTop");
    expect(snapshot.practiceDrafts[0]).toMatchObject({ chapterId: 2, taskId: "2.1.1", source: "OUTPUT 2" });
  });
});
