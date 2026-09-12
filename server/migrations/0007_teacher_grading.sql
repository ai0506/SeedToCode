-- 老师手动评分。
--
-- 服务端的自动判分只看跑通了几个测试用例：分布很粗（常常只有 0 或 100），
-- 也完全看不出代码逻辑和思路。它适合当参考信号，不适合当成绩。
-- 所以成绩由老师给，自动结果原样留着供老师参考，两者分开存、互不覆盖。
ALTER TABLE assignment_submissions ADD COLUMN teacher_score INTEGER;
ALTER TABLE assignment_submissions ADD COLUMN teacher_comment TEXT;
ALTER TABLE assignment_submissions ADD COLUMN graded_at INTEGER;
ALTER TABLE assignment_submissions ADD COLUMN graded_by TEXT;

CREATE INDEX idx_assignment_submissions_graded
  ON assignment_submissions(assignment_id, student_id, graded_at);
