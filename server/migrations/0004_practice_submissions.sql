-- 个人练习提交：章末大题的每一次「提交」都是一条不可变记录。
--
-- 分数和通过状态一律由服务端用已发布的题目重新判定，绝不读取客户端上传的
-- score / passed；客户端算出来的结果只用于即时展示。
-- 同一道题反复提交会留下多行，按提交时间倒序就是这个学生的作答过程。
--
-- `client_submission_id` 由客户端生成，用来做重试幂等：同一次提交重发多少遍
-- 都只会留下一行。它按用户唯一，因此拿别人的 id 也不会撞上别人的记录。

CREATE TABLE practice_submissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_submission_id TEXT NOT NULL,
  chapter_id INTEGER NOT NULL,
  task_id TEXT NOT NULL,
  answer_content TEXT NOT NULL,
  client_version TEXT,
  server_score INTEGER NOT NULL,
  server_passed INTEGER NOT NULL,
  failed_layer TEXT,
  submitted_by_device TEXT NOT NULL,
  submitted_at INTEGER NOT NULL,
  UNIQUE(user_id, client_submission_id)
);

CREATE INDEX idx_practice_submissions_owner
  ON practice_submissions(user_id, chapter_id, task_id, submitted_at DESC);

CREATE INDEX idx_practice_submissions_task
  ON practice_submissions(task_id, submitted_at DESC);
