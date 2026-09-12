-- 账户级限制不能只靠浏览器：项目和班级码注册都可以直接请求 Worker。
--
-- 邮箱的原始地址仍存 users.email、仍用它投递验证邮件；alias_key 只是账号唯一性
-- 键。它把 local-part 中第一个 + 后的部分去掉，因此 a@x 与 a+tag@x 只能
-- 对应一个非学生账号。INSERT OR IGNORE 保留已经存在的旧账号；若历史上本来就
-- 有一组别名冲突，已建映射的一条账号继续可用，之后不再允许创建新的变体。
CREATE TABLE email_aliases (
  alias_key TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL
);

INSERT OR IGNORE INTO email_aliases (alias_key, user_id, created_at)
SELECT
  CASE
    WHEN instr(substr(email, 1, instr(email, '@') - 1), '+') > 0
      THEN substr(email, 1, instr(email, '+') - 1) || substr(email, instr(email, '@'))
    ELSE email
  END,
  id,
  created_at
FROM users
WHERE email IS NOT NULL AND role IN ('teacher', 'learner');

-- 邮箱验证完成时需要按「最初申请邮件的来源」计入 24 小时新账户上限；只存
-- 哈希，不保存来源 IP 明文。
ALTER TABLE auth_tokens ADD COLUMN registration_ip_hash TEXT;

CREATE INDEX idx_auth_tokens_registration_ip ON auth_tokens(registration_ip_hash, created_at);

-- 数量和总字节的应用层预检给出友好响应；触发器保证并发请求也不能越过
-- 账户总量。student 与其他两类账户的边界在数据库里再落实一次。
CREATE TRIGGER projects_account_limit_insert
BEFORE INSERT ON projects
BEGIN
  SELECT RAISE(ABORT, 'ACCOUNT_PROJECT_LIMIT') WHERE (
    SELECT COUNT(*) FROM projects WHERE owner_id = NEW.owner_id AND deleted_at IS NULL
  ) >= COALESCE((SELECT 10 FROM users WHERE id = NEW.owner_id AND role = 'student'), 50);
END;

CREATE TRIGGER project_files_account_storage_limit_insert
BEFORE INSERT ON project_files
BEGIN
  SELECT RAISE(ABORT, 'ACCOUNT_STORAGE_LIMIT') WHERE COALESCE((
    SELECT SUM(length(CAST(project_files.content AS BLOB)))
      FROM project_files JOIN projects ON projects.id = project_files.project_id
     WHERE projects.owner_id = (SELECT owner_id FROM projects WHERE id = NEW.project_id)
       AND projects.deleted_at IS NULL AND project_files.deleted_at IS NULL
  ), 0) + length(CAST(NEW.content AS BLOB)) >
  COALESCE((SELECT 5242880 FROM users WHERE id = (SELECT owner_id FROM projects WHERE id = NEW.project_id) AND role = 'student'), 20971520);
END;

CREATE TRIGGER project_files_account_storage_limit_update
BEFORE UPDATE OF content ON project_files
BEGIN
  SELECT RAISE(ABORT, 'ACCOUNT_STORAGE_LIMIT') WHERE COALESCE((
    SELECT SUM(length(CAST(project_files.content AS BLOB)))
      FROM project_files JOIN projects ON projects.id = project_files.project_id
     WHERE projects.owner_id = (SELECT owner_id FROM projects WHERE id = NEW.project_id)
       AND projects.deleted_at IS NULL AND project_files.deleted_at IS NULL AND project_files.id <> OLD.id
  ), 0) + length(CAST(NEW.content AS BLOB)) >
  COALESCE((SELECT 5242880 FROM users WHERE id = (SELECT owner_id FROM projects WHERE id = NEW.project_id) AND role = 'student'), 20971520);
END;

-- 应用层会先给出可读提示；触发器是并发下的最终防线。一次批量创建学生时，
-- 任一插入触到上限会让 D1 回滚整批账号、激活码和成员关系，不会留下半个账号。
CREATE TRIGGER class_members_student_limit_insert
BEFORE INSERT ON class_members
WHEN NEW.status = 'active'
BEGIN
  SELECT RAISE(ABORT, 'CLASS_STUDENT_LIMIT') WHERE (
    SELECT COUNT(*)
      FROM class_members
      JOIN users ON users.id = class_members.user_id
     WHERE class_members.class_id = NEW.class_id
       AND class_members.status = 'active'
       AND users.role = 'student'
  ) >= 50;

  SELECT RAISE(ABORT, 'TEACHER_STUDENT_LIMIT') WHERE (
    SELECT COUNT(DISTINCT class_members.user_id)
      FROM class_members
      JOIN classes ON classes.id = class_members.class_id
      JOIN users ON users.id = class_members.user_id
     WHERE classes.teacher_id = (SELECT teacher_id FROM classes WHERE id = NEW.class_id)
       AND class_members.status = 'active'
       AND users.role = 'student'
  ) >= 200
  AND NOT EXISTS (
    SELECT 1
      FROM class_members
      JOIN classes ON classes.id = class_members.class_id
     WHERE classes.teacher_id = (SELECT teacher_id FROM classes WHERE id = NEW.class_id)
       AND class_members.user_id = NEW.user_id
       AND class_members.status = 'active'
  );
END;

-- 当前接口不会重新激活成员，但 status 这个模型允许时，不能留下未来接口可以
-- 绕过容量边界的缺口。
CREATE TRIGGER class_members_student_limit_activate
BEFORE UPDATE OF status ON class_members
WHEN NEW.status = 'active' AND OLD.status <> 'active'
BEGIN
  SELECT RAISE(ABORT, 'CLASS_STUDENT_LIMIT') WHERE (
    SELECT COUNT(*)
      FROM class_members
      JOIN users ON users.id = class_members.user_id
     WHERE class_members.class_id = NEW.class_id
       AND class_members.status = 'active'
       AND users.role = 'student'
  ) >= 50;

  SELECT RAISE(ABORT, 'TEACHER_STUDENT_LIMIT') WHERE (
    SELECT COUNT(DISTINCT class_members.user_id)
      FROM class_members
      JOIN classes ON classes.id = class_members.class_id
      JOIN users ON users.id = class_members.user_id
     WHERE classes.teacher_id = (SELECT teacher_id FROM classes WHERE id = NEW.class_id)
       AND class_members.status = 'active'
       AND users.role = 'student'
  ) >= 200
  AND NOT EXISTS (
    SELECT 1
      FROM class_members
      JOIN classes ON classes.id = class_members.class_id
     WHERE classes.teacher_id = (SELECT teacher_id FROM classes WHERE id = NEW.class_id)
       AND class_members.user_id = NEW.user_id
       AND class_members.status = 'active'
  );
END;
