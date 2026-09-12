CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student', 'learner')),
  status TEXT NOT NULL DEFAULT 'active',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE auth_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL CHECK (purpose IN ('email_login', 'student_activation', 'password_reset')),
  token_hash TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL,
  consumed_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(owner_id, name)
);

CREATE TABLE project_files (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('source', 'runtime')),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  content_hash TEXT NOT NULL,
  updated_by_device TEXT NOT NULL,
  deleted_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(project_id, name)
);

CREATE TABLE classes (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  join_code TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE class_members (
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at INTEGER NOT NULL,
  PRIMARY KEY(class_id, user_id)
);

CREATE TABLE assignments (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE assignment_items (
  assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  PRIMARY KEY(assignment_id, task_id),
  UNIQUE(assignment_id, position)
);

CREATE TABLE assignment_submissions (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,
  student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  answer_content TEXT NOT NULL,
  client_version TEXT,
  server_score INTEGER,
  server_passed INTEGER,
  submitted_at INTEGER NOT NULL
);

CREATE TABLE practice_drafts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL,
  task_id TEXT NOT NULL,
  source TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  updated_by_device TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(user_id, chapter_id, task_id)
);

CREATE TABLE teaching_progress (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL,
  section_id TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY(user_id, chapter_id, section_id)
);

CREATE TABLE teaching_positions (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL,
  section_id TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE sync_operations (
  operation_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  processed_at INTEGER
);

CREATE TABLE run_quota_ledger (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  request_id TEXT NOT NULL UNIQUE,
  policy_window TEXT NOT NULL,
  internal_reason TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_project_files_project ON project_files(project_id, revision);
CREATE INDEX idx_class_members_user ON class_members(user_id);
CREATE INDEX idx_submissions_assignment_student ON assignment_submissions(assignment_id, student_id, submitted_at);
CREATE INDEX idx_auth_tokens_lookup ON auth_tokens(token_hash, purpose);
