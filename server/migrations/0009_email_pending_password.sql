-- 邮箱注册的待定密码。
--
-- 原来注册时就把新密码和 pending_email 状态直接写进 users，验证只是把状态改回
-- active。这让任何人只要知道一个邮箱，就能把对应账号的密码覆盖掉、并把它踢出
-- active——账号主人当场被锁在门外，而且如果他点了那封「验证你的账号」的邮件，
-- 设进去的是别人的密码。
--
-- 现在密码先挂在一次性 token 这一行上，只有验证成功才落到 users。没点链接之前
-- users 一个字节都不动。
ALTER TABLE auth_tokens ADD COLUMN pending_password_hash TEXT;
ALTER TABLE auth_tokens ADD COLUMN pending_password_salt TEXT;
