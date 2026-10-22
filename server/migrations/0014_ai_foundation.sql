-- 学习助理的服务端底座：额度账本、同意记录、班级开关、总开关。
-- 这一步不接任何 AI 提供方，也没有调用模型的接口；设计见 docs/plans/AI_ASSISTANT_PLAN.md §2、§7。

-- 老师的「本班启用学习助理」开关。NULL＝关闭，默认关闭：面向未成年人的功能，
-- 要由学校这一层的人明确打开，而不是等出了事再关。
ALTER TABLE classes ADD COLUMN ai_enabled_at INTEGER;

-- 用量账本：每次调用一行。**不存任何正文**——问题、代码、回答都不在这里，
-- 聊天记录以后另建表，两者分开删、分开保留。
--
-- 金额是整数微元（1e-6 元）。state：
--   reserved  调用前按最坏情况预留，计入用量；超过 2 分钟没结算的不再计入（Worker 中途死掉时不会永远卡住额度）
--   settled   拿到 usage 后按实际成本结算，actual_units 计入用量
--   released  提供方失败或超时，全额归还，不计入
-- request_id 全局唯一：同一个请求重放只会扣一次。
CREATE TABLE ai_usage_ledger (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- 学生才有：所属老师的班级池。老师和个人学习者为 NULL。
  pool_teacher_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  window_key TEXT NOT NULL,
  day_key TEXT NOT NULL,
  month_key TEXT NOT NULL,
  mode TEXT NOT NULL,
  model TEXT NOT NULL,
  price_version TEXT NOT NULL,
  peak INTEGER NOT NULL CHECK (peak IN (0, 1)),
  state TEXT NOT NULL CHECK (state IN ('reserved', 'settled', 'released')),
  reserved_units INTEGER NOT NULL CHECK (reserved_units > 0),
  actual_units INTEGER NOT NULL DEFAULT 0 CHECK (actual_units >= 0),
  prompt_cache_hit_tokens INTEGER NOT NULL DEFAULT 0,
  prompt_cache_miss_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  settled_at INTEGER
);
CREATE INDEX ai_usage_ledger_user_window ON ai_usage_ledger(user_id, window_key);
CREATE INDEX ai_usage_ledger_pool_window ON ai_usage_ledger(pool_teacher_id, window_key);
CREATE INDEX ai_usage_ledger_day ON ai_usage_ledger(day_key);
CREATE INDEX ai_usage_ledger_month ON ai_usage_ledger(month_key);

-- 同意记录：在哪个隐私政策版本下作了哪项声明。
-- statement 目前只有一种：「我已成年，或我的监护人已同意」。这是自我声明，不是核验，
-- 所以只记声明本身，不记、也不收集年龄。政策版本一变，旧记录不再算数，要重新同意。
CREATE TABLE ai_consents (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  policy_version INTEGER NOT NULL,
  statement TEXT NOT NULL CHECK (statement IN ('adult_or_guardian')),
  consented_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, policy_version)
);

-- AI 总开关，显式写 '0'。
-- **与 cloud_sync_enabled 等开关的默认方向相反**：那些「缺行按开启」，因为配置表出问题
-- 不该把同步整个关掉；AI 花的是钱，server/src/ai.ts 里缺行、读失败都按**关闭**处理。
--
-- 额度一律不在这里写默认值，缺行即不可用（单位都是微元，1 元 = 1000000）：
--   ai_model                          用哪张价目表（packages/ai-quota 的 PRICE_TABLES）
--   ai_budget_global_daily            全站每个上海日历日
--   ai_budget_global_monthly          全站每个上海日历月
--   ai_budget_learner_window          个人学习者每个窗口
--   ai_budget_teacher_window          老师本人每个窗口（与班级池分开）
--   ai_budget_pool_per_student_window 班级池按活跃学生每人每窗口
--   ai_budget_student_window_max      学生单人每窗口的绝对上限
-- 要开的时候：
--   INSERT INTO service_config (key, value, updated_at) VALUES ('ai_budget_global_daily', '20000000', unixepoch()*1000)
--     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;
INSERT INTO service_config (key, value, updated_at) VALUES ('ai_enabled', '0', unixepoch() * 1000);
