-- The first local scaffold used table-level UNIQUE constraints. Tombstones need
-- uniqueness only among active entities, otherwise an offline device cannot
-- recreate a project or file name after a prior deletion has synced.
CREATE TABLE projects_next (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  deleted_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

INSERT INTO projects_next (id, owner_id, name, revision, deleted_at, created_at, updated_at)
SELECT id, owner_id, name, revision, NULL, created_at, updated_at FROM projects;

CREATE TABLE project_files_next (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects_next(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('source', 'runtime')),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  content_hash TEXT NOT NULL,
  updated_by_device TEXT NOT NULL,
  deleted_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

INSERT INTO project_files_next (id, project_id, kind, name, content, revision, content_hash, updated_by_device, deleted_at, created_at, updated_at)
SELECT id, project_id, kind, name, content, revision, content_hash, updated_by_device, deleted_at, created_at, updated_at FROM project_files;

DROP TABLE project_files;
DROP TABLE projects;
ALTER TABLE projects_next RENAME TO projects;
ALTER TABLE project_files_next RENAME TO project_files;

CREATE UNIQUE INDEX idx_projects_owner_active_name ON projects(owner_id, name) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_project_files_project_active_name ON project_files(project_id, name) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_owner_revision ON projects(owner_id, revision);
CREATE INDEX idx_project_files_project_revision ON project_files(project_id, revision);
