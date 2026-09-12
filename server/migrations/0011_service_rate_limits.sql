-- 写入速率与内容/人数配额是两回事：前者限制短时间内的服务端工作量，后者限制
-- 持久占用。计数器按 (scope, user) 原地滚动，避免每个时间窗留下无限 ledger。
CREATE TABLE service_rate_limits (
  scope TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  window_started_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY(scope, subject_id)
);

-- 同步操作以 15 分钟为固定窗口。600 次覆盖正常的本地合并写入，同时把一个账号
-- 的持续写放大限制在每分钟 40 次；触发器与实际写入在同一事务中，失败会一起回滚。
CREATE TRIGGER projects_sync_write_rate_insert
BEFORE INSERT ON projects
BEGIN
  SELECT RAISE(ABORT, 'SYNC_WRITE_THROTTLED') WHERE COALESCE((
    SELECT attempts FROM service_rate_limits
     WHERE scope = 'sync_write' AND subject_id = NEW.owner_id
       AND window_started_at = (unixepoch() / 900) * 900
  ), 0) >= 600;
  INSERT INTO service_rate_limits (scope, subject_id, window_started_at, attempts, updated_at)
  VALUES ('sync_write', NEW.owner_id, (unixepoch() / 900) * 900, 1, unixepoch() * 1000)
  ON CONFLICT(scope, subject_id) DO UPDATE SET
    attempts = CASE WHEN service_rate_limits.window_started_at = excluded.window_started_at
      THEN service_rate_limits.attempts + 1 ELSE 1 END,
    window_started_at = excluded.window_started_at,
    updated_at = excluded.updated_at;
END;

CREATE TRIGGER projects_sync_write_rate_update
BEFORE UPDATE OF name, deleted_at ON projects
BEGIN
  SELECT RAISE(ABORT, 'SYNC_WRITE_THROTTLED') WHERE COALESCE((
    SELECT attempts FROM service_rate_limits
     WHERE scope = 'sync_write' AND subject_id = NEW.owner_id
       AND window_started_at = (unixepoch() / 900) * 900
  ), 0) >= 600;
  INSERT INTO service_rate_limits (scope, subject_id, window_started_at, attempts, updated_at)
  VALUES ('sync_write', NEW.owner_id, (unixepoch() / 900) * 900, 1, unixepoch() * 1000)
  ON CONFLICT(scope, subject_id) DO UPDATE SET
    attempts = CASE WHEN service_rate_limits.window_started_at = excluded.window_started_at
      THEN service_rate_limits.attempts + 1 ELSE 1 END,
    window_started_at = excluded.window_started_at,
    updated_at = excluded.updated_at;
END;

CREATE TRIGGER project_files_sync_write_rate_insert
BEFORE INSERT ON project_files
BEGIN
  SELECT RAISE(ABORT, 'SYNC_WRITE_THROTTLED') WHERE COALESCE((
    SELECT attempts FROM service_rate_limits
     WHERE scope = 'sync_write' AND subject_id = (SELECT owner_id FROM projects WHERE id = NEW.project_id)
       AND window_started_at = (unixepoch() / 900) * 900
  ), 0) >= 600;
  INSERT INTO service_rate_limits (scope, subject_id, window_started_at, attempts, updated_at)
  VALUES ('sync_write', (SELECT owner_id FROM projects WHERE id = NEW.project_id), (unixepoch() / 900) * 900, 1, unixepoch() * 1000)
  ON CONFLICT(scope, subject_id) DO UPDATE SET
    attempts = CASE WHEN service_rate_limits.window_started_at = excluded.window_started_at
      THEN service_rate_limits.attempts + 1 ELSE 1 END,
    window_started_at = excluded.window_started_at,
    updated_at = excluded.updated_at;
END;

CREATE TRIGGER project_files_sync_write_rate_update
BEFORE UPDATE OF name, content, deleted_at ON project_files
BEGIN
  SELECT RAISE(ABORT, 'SYNC_WRITE_THROTTLED') WHERE COALESCE((
    SELECT attempts FROM service_rate_limits
     WHERE scope = 'sync_write' AND subject_id = (SELECT owner_id FROM projects WHERE id = NEW.project_id)
       AND window_started_at = (unixepoch() / 900) * 900
  ), 0) >= 600;
  INSERT INTO service_rate_limits (scope, subject_id, window_started_at, attempts, updated_at)
  VALUES ('sync_write', (SELECT owner_id FROM projects WHERE id = NEW.project_id), (unixepoch() / 900) * 900, 1, unixepoch() * 1000)
  ON CONFLICT(scope, subject_id) DO UPDATE SET
    attempts = CASE WHEN service_rate_limits.window_started_at = excluded.window_started_at
      THEN service_rate_limits.attempts + 1 ELSE 1 END,
    window_started_at = excluded.window_started_at,
    updated_at = excluded.updated_at;
END;

-- 作业提交会触发服务端判题。先以应用层预检省掉不必要的判题，再由触发器保证
-- 并发提交也不会越过窗口。班级作业较少，章末练习保留既有的较宽上限。
CREATE TRIGGER assignment_submissions_rate_limit_insert
BEFORE INSERT ON assignment_submissions
BEGIN
  SELECT RAISE(ABORT, 'ASSIGNMENT_SUBMISSION_THROTTLED') WHERE COALESCE((
    SELECT attempts FROM service_rate_limits
     WHERE scope = 'assignment_submission' AND subject_id = NEW.student_id
       AND window_started_at = (unixepoch() / 3600) * 3600
  ), 0) >= 30;
  INSERT INTO service_rate_limits (scope, subject_id, window_started_at, attempts, updated_at)
  VALUES ('assignment_submission', NEW.student_id, (unixepoch() / 3600) * 3600, 1, unixepoch() * 1000)
  ON CONFLICT(scope, subject_id) DO UPDATE SET
    attempts = CASE WHEN service_rate_limits.window_started_at = excluded.window_started_at
      THEN service_rate_limits.attempts + 1 ELSE 1 END,
    window_started_at = excluded.window_started_at,
    updated_at = excluded.updated_at;
END;

CREATE TRIGGER practice_submissions_rate_limit_insert
BEFORE INSERT ON practice_submissions
BEGIN
  SELECT RAISE(ABORT, 'PRACTICE_SUBMISSION_THROTTLED') WHERE COALESCE((
    SELECT attempts FROM service_rate_limits
     WHERE scope = 'practice_submission' AND subject_id = NEW.user_id
       AND window_started_at = (unixepoch() / 3600) * 3600
  ), 0) >= 100;
  INSERT INTO service_rate_limits (scope, subject_id, window_started_at, attempts, updated_at)
  VALUES ('practice_submission', NEW.user_id, (unixepoch() / 3600) * 3600, 1, unixepoch() * 1000)
  ON CONFLICT(scope, subject_id) DO UPDATE SET
    attempts = CASE WHEN service_rate_limits.window_started_at = excluded.window_started_at
      THEN service_rate_limits.attempts + 1 ELSE 1 END,
    window_started_at = excluded.window_started_at,
    updated_at = excluded.updated_at;
END;
