# Architecture

SeedToCode separates the language model, interpreter, grading and platform state. Root npm workspaces compile with TypeScript project references; esbuild creates the browser IIFE bundles. The handwritten browser layer uses ordered script loading and global boundaries rather than a framework or ES module loader.

```text
caie-spec → language → runtime → exercise → teaching-content
storage, assignment, ai-quota → browser/Worker consumers
web → same-origin optional Worker → D1
native/macOS → bundled web + constrained native transport → own Worker
```

`analyzeSource(source)` is the public static-analysis entry; `executeSource(source, options)` runs AST code with resource limits and virtual files. Neither requires a real disk, network, DOM or production service. `compareOutputs` and grading live in `packages/exercise`. Exact output including spaces is intentional.

The browser works offline and without authentication. `CAIEStorage` maintains compatibility snapshots and IndexedDB mirrors. Sync queues and metadata are partitioned by account. Held guest/previous-account content remains locally usable but cannot upload or cloud-run until appropriately adopted. Conflicts preserve local content and create a cloud copy; deletion uses revisioned tombstones.

The Worker enforces authentication, roles and object ownership. Cloud execution uses only the immutable snapshot in the request, with `projectId` used for authorization. Assignment/lesson grades are recomputed server-side. The native prototype keeps the token in the keychain and only allows constrained API paths; it does not widen browser CORS or cookie policy.

`CLOUD_ARCHITECTURE.md` supplies the full contract and historical design context. Some deployment statements describe upstream; this unpublished candidate provides configuration templates and local-only defaults. `PROJECT_STATE.md` is the upstream feature snapshot. For release readiness, use `RELEASE_REVIEW.md`.
