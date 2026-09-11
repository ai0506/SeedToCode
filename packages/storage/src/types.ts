export const STORAGE_SCHEMA_VERSION = 1;
export const STORAGE_DB_NAME = "caie9618.local";

export type StorageEntity = { schemaVersion: number; updatedAt: number };

export type Project = StorageEntity & {
  id: string;
  name: string;
  activeFileId?: string;
};

export type ProjectFile = StorageEntity & {
  id: string;
  projectId: string;
  kind: "source" | "runtime";
  name: string;
  content: unknown;
  revision: number;
  deleted?: boolean;
};

export type UserPreferences = StorageEntity & {
  id: "default";
  value: Record<string, unknown>;
};

export type TeachingPosition = StorageEntity & {
  id: "default";
  chapterId: number;
  sectionId: string;
};

export type TeachingProgress = StorageEntity & {
  id: string;
  chapterId: number;
  sectionId: string;
  completed: boolean;
};

export type PracticeDraft = StorageEntity & {
  id: string;
  chapterId: number;
  taskId: string;
  source: string;
};

export type SyncOperation = StorageEntity & {
  id: string;
  operationId: string;
  entity: string;
  payload: unknown;
  attempts: number;
};

export type LegacyEditorState = {
  docs?: Array<Record<string, unknown>>;
  activeId?: string;
  runtimeFiles?: Array<Record<string, unknown>>;
  settings?: Record<string, unknown>;
};

export type LegacyTeachingState = {
  gates?: Record<string, boolean>;
  position?: { chapterId: number; sectionId: string; scrollTop?: number } | null;
  answers?: Record<string, string>;
};

export type LocalSnapshot = {
  projects: Project[];
  files: ProjectFile[];
  preferences: UserPreferences;
  teachingPosition?: TeachingPosition;
  teachingProgress: TeachingProgress[];
  practiceDrafts: PracticeDraft[];
};
