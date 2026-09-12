-- 回收已删除内容占的字节。
--
-- 0010 的账户空间统计排除了 `project_files.deleted_at IS NOT NULL` 和所属项目
-- 已删除的行，但删除本身只写 `deleted_at`，`content` 原样留着。于是那些字节
-- 仍然真实占着 D1，却不计入任何人的用量——传满、删掉、再传满可以无限重复，
-- 账户空间上限等于不存在。
--
-- 应用侧已经改成删除时一并清空（`deleteFile` 内联，`deleteProject` 在删除成功
-- 之后尽力而为）。这一支只负责把**此前**已经积下来的清掉。
--
-- 不动 `revision`、`updated_at`、`content_hash` 和 `deleted_at`：
-- 同步协议靠 revision 判断新旧，这里改了会让所有客户端以为文件又变过一次；
-- content_hash 留着还能说明「被删掉的那一版是什么」。拉取时删除的文件本来就
-- 不返回 content（见 `publicFile`），也没有任何恢复接口，所以清空是安全的。
--
-- 为什么要先摘掉两个触发器：`UPDATE ... SET content` 会**逐行**触发 0011 的写入
-- 限流和 0010 的空间统计。前者一旦某个用户的孤儿文件超过 600 行就会 ABORT，
-- 把整个迁移带崩；后者每行做一次全量 SUM，几万行会非常慢。清理完原样装回——
-- 下面两段 CREATE TRIGGER 与 0010/0011 里的定义逐字一致。

DROP TRIGGER IF EXISTS project_files_sync_write_rate_update;
DROP TRIGGER IF EXISTS project_files_account_storage_limit_update;

UPDATE project_files
   SET content = ''
 WHERE content <> ''
   AND deleted_at IS NOT NULL;

UPDATE project_files
   SET content = ''
 WHERE content <> ''
   AND project_id IN (SELECT id FROM projects WHERE deleted_at IS NOT NULL);

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
