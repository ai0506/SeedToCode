# Testing

```sh
npm ci
npm --prefix server ci
npm run check
npm run build
npm test
npm --prefix server run check
git diff --check
```

`npm test` builds browser bundles, typechecks the Worker, verifies generated teaching outputs and runs Vitest. Root tests include actual SQLite migrations, AI admission/account rules, sync queue recovery, frontend policy and privacy assertions. Server `npm test` is a typecheck, not an HTTP integration test.

`tests/auth-one-time.test.ts` exercises the real auth functions against SQLite: concurrent consumption, replay, expiry, failure after claim, and provider log privacy. `tests/run-admission.test.ts` checks concurrent quota admission, duplicate requests and project ownership using the real interpreter. Those local tests do not establish D1 production behavior or an authenticated browser workflow.

After teaching changes, run `npm run teaching:expected` to regenerate actual reference-solution outputs, then `node scripts/generate-teaching-expected.mjs --check`. Do not hand-edit expected-output snapshots to hide a failure.

For browser changes, use the named launch configurations, operate the actual default `Main.pseudocode` and built-in `BubbleSort.pseudocode`/`FileCopy.pseudocode`, and test at desktop and narrow widths. Follow `FRONTEND_RULES.md`'s bounding-box snapshot method. Static tests cannot measure geometry. Record blocked/unexecuted checks as **Not Verified**, not Passed.

On a compatible macOS SDK, run `swift test --package-path native/macos`; the app packaging script also builds Swift and includes the current web resources. Unit tests do not establish a signed/notarized release or visual behavior.
