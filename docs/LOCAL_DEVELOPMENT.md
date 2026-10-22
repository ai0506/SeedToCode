# Local development

## Browser-only

Install root dependencies and build. Double-click `web/lab.html` or use the `web-static` launch configuration (port 8123). No login, database, mail credentials or model API is required for local editing, learning, grading and execution. Browser storage belongs to that browser/profile/origin.

## Worker + local D1

```sh
npm ci
npm --prefix server ci
npm run build
npm --prefix server run db:migrate:local
```

Start `seedtocode-dev` from `.claude/launch.json` (127.0.0.1:8787). The dev script uses `wrangler dev --local`, an isolated `server/.wrangler/state`, and an explicit development environment override. For ordinary terminal development, `npm --prefix server run dev -- --ip 127.0.0.1 --port 8787` runs the same configuration. Visit [the Worker lab](http://127.0.0.1:8787/lab). Use this origin for both pages and APIs; a static-only preview cannot prove cloud workflows.

The tracked configuration keeps `ENVIRONMENT=production` for safe deployment defaults and uses a zero UUID as a non-production D1 placeholder. Local D1 is keyed by the logical `seedtocode` binding. All migrations, including the disabled AI foundation, apply only to your local state with the command above. Never append `--remote` during this setup.

Development email registration returns a one-time token instead of sending mail. Use synthetic identities such as `learner@example.test`; verify with a local API request to `POST /auth/email/verify`. Do not expose this mode on the internet. The application UI deliberately does not display development tokens.

`server/.dev.vars.example` documents optional production-style mail settings without values. Copying it is unnecessary for token-only local tests. Real values belong only in ignored `.dev.vars` or your own deployment's secret store. Do not use credentials from the original private checkout.

## macOS prototype

On macOS 15+ with the matching Swift/Xcode SDK:

```sh
native/macos/scripts/build-app.sh
swift test --package-path native/macos
```

The candidate defaults both native API and remote comparison URLs to `http://127.0.0.1:8787`. It does not connect to the original production instance. It remains an unsigned/ad-hoc prototype without distribution notarization. See `native/macos/README.md` for its development probes; do not point probes at other people's services.

## Your own deployment

Deployment is a separate owner-authorized activity. Create your own Cloudflare resources, supply your own configuration/credentials, keep production semantics, update the entire privacy policy/contact details and perform an independent deployment review. This candidate has not been deployed and does not include a deploy script or automatic publishing workflow.
