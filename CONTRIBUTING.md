# Contributing

Start with `AGENTS.md`, `PROJECT_STATE.md` and the architecture documents. Read all of `FRONTEND_RULES.md` before changing `web/`. Keep source changes scoped and preserve unrelated work.

## Development

Install root and server dependencies with `npm ci` and `npm --prefix server ci`, then run `npm test`. Node.js 22.13+ (22.x) or 24+ is required by SQLite-based tests. Use `.claude/launch.json` for local previews. The default local Worker uses an isolated SQLite/D1 state; never use the original maintainer's Cloudflare account or database.

TypeScript packages are the source of the browser engine bundles. Change package source, run `npm run build`, and include changed generated bundles in the same review. Never hand-edit a generated bundle. If a shared browser asset changes, inspect and increment its current query version consistently in every referencing HTML page.

## Language and teaching

Official reference links are in `EXTERNAL_REFERENCES.md`. Distinguish CAIE rules from project runtime conventions. Do not add nonstandard syntax for convenience. Run the real analyzer and runtime for new examples. Update teaching outputs with `npm run teaching:expected`, then verify them. Source reference solutions are visible to repository readers; they are omitted only from published browser data.

Do not contribute official PDFs, transcripts, examination questions/mark schemes, student answers, personal data, tokens, local database files or deployment credentials. Contributions must be original or have a documented compatible redistribution license.

## Validation

See `docs/TESTING.md`. Reproduce a bug with a meaningful regression before fixing it. Browser interactions need real desktop and narrow-screen geometry checks; static text checks alone do not cover layout. Explain any unverified layers in the pull request.

Append one UTF-8 line to root `updates.md`: `[CodeX][YYMMDDHHmm]` followed by concrete technical changes, affected scope and verification. Other contributors may use their own agent/name prefix. Do not put secrets in changelogs. Use existing `lessons.md` if present; do not create it solely for an agent record.

## Review and provenance

Describe the problem, resulting behavior and verification. Do not include private logs or audit inputs. New dependencies need a license review; new assets need provenance. A proposed contribution grants only rights the contributor actually controls. This candidate has no enabled automatic publication workflow.
