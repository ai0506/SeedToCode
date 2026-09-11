import type { Project, ProjectFile, TeachingPosition, TeachingProgress, PracticeDraft, UserPreferences, SyncOperation } from "./types.js";

export interface ProjectStore {
  listProjects(): Promise<Project[]>;
  readFiles(projectId: string): Promise<ProjectFile[]>;
  writeFile(file: ProjectFile, expectedRevision: number): Promise<ProjectFile>;
  deleteFile(projectId: string, fileId: string, expectedRevision: number): Promise<ProjectFile>;
}

export interface TeachingStore {
  readPosition(): Promise<TeachingPosition | undefined>;
  writePosition(position: TeachingPosition): Promise<void>;
  listProgress(): Promise<TeachingProgress[]>;
  writeProgress(progress: TeachingProgress): Promise<void>;
  listPracticeDrafts(): Promise<PracticeDraft[]>;
  writePracticeDraft(draft: PracticeDraft): Promise<void>;
}

export interface PreferencesStore {
  read(): Promise<UserPreferences | undefined>;
  write(preferences: UserPreferences): Promise<void>;
}

export interface SyncQueue {
  enqueue(operation: SyncOperation): Promise<void>;
  listPending(limit?: number): Promise<SyncOperation[]>;
  markAttempted(operationId: string): Promise<void>;
  remove(operationId: string): Promise<void>;
}

export interface SyncEngine {
  push(): Promise<void>;
  pull(): Promise<void>;
}
