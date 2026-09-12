-- 作业的删除是 tombstone，不是真删。
--
-- assignment_submissions 对 assignment_id 是 ON DELETE CASCADE：真删一份作业
-- 会把学生已经交上来、已经判过分的答案一起销毁，而且不可撤销。老师布错一份
-- 想撤掉是常事，不该以学生的作业为代价。打上 deleted_at 之后师生两侧都不再
-- 列出这份作业，也不能再提交，但记录都还在。
ALTER TABLE assignments ADD COLUMN deleted_at INTEGER;

CREATE INDEX idx_assignments_class_live ON assignments(class_id, deleted_at);
