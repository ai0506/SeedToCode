import {
  STORAGE_SCHEMA_VERSION,
  type LegacyEditorState,
  type LegacyTeachingState,
  type LocalSnapshot,
  type PracticeDraft,
  type Project,
  type ProjectFile,
  type TeachingProgress,
  type TeachingPosition,
  type UserPreferences
} from "./types.js";

const now = () => Date.now();
const id = (prefix: string, index: number) => `${prefix}-${index + 1}`;

export function migrateLegacyState(editor: LegacyEditorState, teaching: LegacyTeachingState = {}): LocalSnapshot {
  const timestamp = now();
  const docs = Array.isArray(editor.docs) ? editor.docs : [];
  const projectId = "project-default";
  const files: ProjectFile[] = docs.map((doc, index) => ({
    schemaVersion: STORAGE_SCHEMA_VERSION,
    updatedAt: Number(doc.updatedAt) || timestamp,
    id: typeof doc.id === "string" && doc.id ? doc.id : id("file", index),
    projectId,
    kind: "source",
    name: typeof doc.name === "string" ? doc.name : `Main-${index + 1}.pseudocode`,
    content: typeof doc.source === "string" ? doc.source : "",
    revision: 1,
    ...(doc.archived ? { deleted: true } : {})
  }));

  const runtimeFiles = Array.isArray(editor.runtimeFiles) ? editor.runtimeFiles : [];
  runtimeFiles.forEach((file, index) => files.push({
    schemaVersion: STORAGE_SCHEMA_VERSION,
    updatedAt: timestamp,
    id: typeof file.id === "string" && file.id ? file.id : id("runtime", index),
    projectId,
    kind: "runtime",
    name: typeof file.name === "string" ? file.name : `Data-${index + 1}.txt`,
    content: file,
    revision: 1
  }));

  const firstFile = files.find((file) => file.id === editor.activeId) ?? files[0];
  const project: Project = { schemaVersion: STORAGE_SCHEMA_VERSION, updatedAt: timestamp, id: projectId, name: "我的项目", ...(firstFile ? { activeFileId: firstFile.id } : {}) };
  const preferences: UserPreferences = { schemaVersion: STORAGE_SCHEMA_VERSION, updatedAt: timestamp, id: "default", value: { ...(editor.settings ?? {}) } };

  const teachingProgress: TeachingProgress[] = Object.entries(teaching.gates ?? {})
    .filter(([, complete]) => complete === true)
    .map(([key]) => {
      const [chapter, ...section] = key.split("/");
      return { schemaVersion: STORAGE_SCHEMA_VERSION, updatedAt: timestamp, id: key, chapterId: Number(chapter), sectionId: section.join("/"), completed: true };
    });
  const position: TeachingPosition | undefined = teaching.position && typeof teaching.position.sectionId === "string"
    ? { schemaVersion: STORAGE_SCHEMA_VERSION, updatedAt: timestamp, id: "default", chapterId: Number(teaching.position.chapterId), sectionId: teaching.position.sectionId }
    : undefined;
  const practiceDrafts: PracticeDraft[] = Object.entries(teaching.answers ?? {}).map(([key, source]) => {
    const [chapter, ...task] = key.split("/");
    return { schemaVersion: STORAGE_SCHEMA_VERSION, updatedAt: timestamp, id: key, chapterId: Number(chapter), taskId: task.join("/"), source };
  });

  return { projects: [project], files, preferences, ...(position ? { teachingPosition: position } : {}), teachingProgress, practiceDrafts };
}
