import { migrateLegacyState } from "./migration.js";
import { getDeviceId, openStorageDatabase } from "./indexeddb.js";
import type { LegacyEditorState, LegacyTeachingState } from "./types.js";

declare global {
  interface Window { CAIEStorage: typeof BrowserStorage; }
}

const LEGACY_KEYS = {
  editor: "caie9618.editor.v1",
  progress: "caie.teaching.progress.v1",
  gates: "caie.teaching.gates.v1",
  position: "caie.teaching.position.v1",
  answers: "caie.teaching.answers.v1"
} as const;

function read<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}

function mirrorEditor(editor: LegacyEditorState, teaching: LegacyTeachingState): void {
  void openStorageDatabase().then(async (database) => {
    await getDeviceId(database);
    const snapshot = migrateLegacyState(editor, teaching);
    const transaction = database.transaction(["projects", "files", "preferences", "teachingPosition", "teachingProgress", "practiceDrafts"], "readwrite");
    for (const project of snapshot.projects) transaction.objectStore("projects").put(project);
    for (const file of snapshot.files) transaction.objectStore("files").put(file);
    transaction.objectStore("preferences").put(snapshot.preferences);
    if (snapshot.teachingPosition) transaction.objectStore("teachingPosition").put(snapshot.teachingPosition);
    for (const progress of snapshot.teachingProgress) transaction.objectStore("teachingProgress").put(progress);
    for (const draft of snapshot.practiceDrafts) transaction.objectStore("practiceDrafts").put(draft);
  }).catch(() => { /* localStorage remains the recoverable fallback */ });
}

export const BrowserStorage = {
  key: LEGACY_KEYS,
  get<T>(key: string, fallback: T): T { return read(key, fallback); },
  set(key: string, value: unknown): void {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { return; }
    if (key === LEGACY_KEYS.editor || key === LEGACY_KEYS.progress || key === LEGACY_KEYS.gates || key === LEGACY_KEYS.position || key === LEGACY_KEYS.answers) {
      mirrorEditor(read<LegacyEditorState>(LEGACY_KEYS.editor, {}), {
        gates: read(LEGACY_KEYS.gates, {}),
        position: read(LEGACY_KEYS.position, null),
        answers: read(LEGACY_KEYS.answers, {})
      });
    }
  },
  remove(key: string): void { try { localStorage.removeItem(key); } catch { /* unavailable storage */ } }
};

if (typeof window !== "undefined") window.CAIEStorage = BrowserStorage;
