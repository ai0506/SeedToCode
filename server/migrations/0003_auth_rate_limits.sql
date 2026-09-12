CREATE TABLE auth_rate_limits (
  key_hash TEXT PRIMARY KEY,
  scope TEXT NOT NULL,
  window_started_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_auth_rate_limits_updated_at ON auth_rate_limits(updated_at);
