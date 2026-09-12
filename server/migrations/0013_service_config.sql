-- 免部署的服务开关。
--
-- 此前所有限额都是按账户的，缺一个账户之上的东西：出事时（成本失控、被刷、
-- 上游故障）唯一的止血手段是改代码重新部署，那至少要几分钟，而且需要有人能
-- 跑得动部署。这张表让「关掉某项云端能力」变成一条 SQL。
--
-- 只放开关，不放密钥：secret 仍然走 wrangler secret。
CREATE TABLE service_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 缺行按「开启」处理：这张表出问题时不应该把整个云端连带关掉。
-- 要关的时候显式写 '0'：
--   UPDATE service_config SET value='0', updated_at=unixepoch()*1000 WHERE key='cloud_sync_enabled';
INSERT INTO service_config (key, value, updated_at) VALUES
  ('cloud_sync_enabled', '1', unixepoch() * 1000),
  ('cloud_run_enabled', '1', unixepoch() * 1000);
