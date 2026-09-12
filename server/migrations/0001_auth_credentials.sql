ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ADD COLUMN password_salt TEXT;

CREATE INDEX idx_sessions_token_lookup ON sessions(token_hash, expires_at);
