import { migrateLegacyState } from "./migration.js";
import { getDeviceId, openStorageDatabase } from "./indexeddb.js";
import type { LegacyEditorState, LegacyTeachingState } from "./types.js";

declare global {
  interface Window { CAIEStorage: typeof BrowserStorage; }
}

const LEGACY_KEYS = {
  editor: "caie9618.editor.v1",
  projects: "seedtocode.projects.v1",
  progress: "caie.teaching.progress.v1",
  gates: "caie.teaching.gates.v1",
  position: "caie.teaching.position.v1",
  answers: "caie.teaching.answers.v1",
  /*
   * 云端相关的本地状态也从这里走，业务层不再自己拼 localStorage key。
   * 这几项都不镜像进旧 blob 的迁移路径：它们不是课程或代码内容，
   * 而是「这台设备当前同步到哪一步」的记录。
   */
  device: "seedtocode.device.v1",
  session: "seedtocode.session.v1",
  syncQueue: "seedtocode.sync.queue.v1",
  syncMeta: "seedtocode.sync.meta.v1",
  draftConflicts: "seedtocode.draft.conflicts.v1"
} as const;

const MIRRORED_KEYS: readonly string[] = [
  LEGACY_KEYS.editor, LEGACY_KEYS.progress, LEGACY_KEYS.gates, LEGACY_KEYS.position, LEGACY_KEYS.answers
];

function read<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; } catch { return fallback; }
}

/*
 * deviceId 必须在页面同步启动的那一刻就能拿到（同步队列的第一条操作就要用），
 * 而 IndexedDB 只能异步读；所以这里以 localStorage 为准，再把同一个值补写进
 * IndexedDB 的 meta，让两边始终是同一个 id。它是浏览器安装首次生成的随机 UUID，
 * 与设备指纹无关。
 */
let cachedDeviceId: string | null = null;

function randomUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function deviceId(): string {
  if (cachedDeviceId) return cachedDeviceId;
  const stored = read<string | null>(LEGACY_KEYS.device, null);
  cachedDeviceId = typeof stored === "string" && stored ? stored : randomUuid();
  if (stored !== cachedDeviceId) {
    try { localStorage.setItem(LEGACY_KEYS.device, JSON.stringify(cachedDeviceId)); } catch { /* 无痕模式等：本次会话内仍然可用 */ }
  }
  return cachedDeviceId;
}

function mirrorEditor(editor: LegacyEditorState, teaching: LegacyTeachingState): void {
  void openStorageDatabase().then(async (database) => {
    await getDeviceId(database, deviceId());
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
  deviceId,
  get<T>(key: string, fallback: T): T { return read(key, fallback); },
  set(key: string, value: unknown): void {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { return; }
    if (MIRRORED_KEYS.indexOf(key) >= 0) {
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
