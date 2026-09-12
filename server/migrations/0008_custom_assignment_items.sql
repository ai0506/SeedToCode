-- 老师自己出的题。
--
-- 课程题目之所以要预先定义，是因为服务端需要 tests / expectedOutputs / constraints
-- 才能自动判分。但成绩已经改成老师手动给了，这层耦合不再换来什么，
-- 只剩「题目只有那 40 道」的限制。自出题不需要任何判题数据：
-- 学生要的是题面、一个能写能跑的编辑器，以及可选的提示。
--
-- 复用 assignment_items 而不是另建表：task_id 当通用条目键，
-- 课程题目用真实题号，自出题用 `custom:<uuid>`，主键和排序都不用动。
ALTER TABLE assignment_items ADD COLUMN title TEXT;
ALTER TABLE assignment_items ADD COLUMN prompt TEXT;
ALTER TABLE assignment_items ADD COLUMN guidance TEXT;
