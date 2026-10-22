# SeedToCode

SeedToCode is a local-first pseudocode editor, AST interpreter and learning platform for the Cambridge International AS & A Level Computer Science 9618 pseudocode notation (2027–2029). It is useful to students, teachers and developers building language tools or interactive programming exercises.

This is an unpublished release candidate. The source history has been filtered for redistribution; review findings and validation boundaries are listed in `RELEASE_REVIEW.md`. No public release or hosted service is implied.

## What works

- Tokenizer, parser, AST, name binding, static diagnostics, type checking and formatter.
- Pure TypeScript interpreter with procedures, functions, recursion, virtual text/random files, records, enums, pointers, sets and OOP. Advanced features require `advanced-2027`; the default is `core-2027`.
- Browser editor with local projects, highlighting, guidance, interactive input and trace tables including array elements and routine-local variables.
- Sixteen Chinese AS learning chapters, exercises, reference solutions and automated grading. Published browser course data omits reference solutions; source access naturally makes solutions visible to repository readers.
- Optional Cloudflare Worker/D1 authentication, account-isolated sync, classes, teacher-authored assignments and grading. The browser stays usable without them.
- An experimental macOS wrapper and native editor prototype. AI work currently contains a disabled quota/consent foundation and evaluation fixtures; there is no model-calling assistant endpoint or working assistant UI.

## Run locally

Use Node.js 22.13+ (22.x) or 24+ (tests use `node:sqlite`), npm and Python 3 for the optional static preview. The candidate was checked with the versions recorded in the local audit report.

```sh
npm ci
npm --prefix server ci
npm run check
npm run build
npm test
```

Open `web/lab.html` directly after building. Course entry: `web/learn.html`. Relative `.html` links intentionally support `file://` use. When an HTTP preview is needed, launch the `web-static` configuration in `.claude/launch.json`, then visit [the local lab](http://localhost:8124/lab.html).

For a local Worker and database, see [local development](docs/LOCAL_DEVELOPMENT.md). No production identifiers, database contents or credentials are needed. Do not connect a fork to the original maintainer's infrastructure.

## Architecture and reuse

| Location | Responsibility |
| --- | --- |
| `packages/caie-spec` | Shared keywords, builtins, types and rule identifiers |
| `packages/language` | Tokenization, parsing, binding, checking, formatting; public entry `analyzeSource` |
| `packages/runtime` | DOM/network/disk-independent AST execution and virtual files; entry `executeSource` |
| `packages/exercise` | Feature constraints, output comparison and grading |
| `packages/teaching-content` | Source chapters, reference solutions, expected-output snapshots and publication |
| `packages/storage` | Local-storage compatibility, IndexedDB entities and migrations |
| `packages/assignment`, `packages/ai-quota` | Pure assignment and quota calculations |
| `web/` | Framework-free browser pages and generated engine bundles |
| `server/` | Optional same-origin Worker API and D1 migrations |
| `native/macos/` | SwiftPM macOS prototype |

Packages can be reused through their workspace exports after `npm run build`; npm registry publishing is not configured. See [architecture](docs/ARCHITECTURE.md), [testing](docs/TESTING.md) and [contributing](CONTRIBUTING.md).

## Limits and roadmap

The application UI and courses are primarily Chinese. Chapters 17–23, a model-connected learning assistant, fully entity-based IndexedDB reads, and signed/notarized macOS distribution are unfinished. Cloud execution shares the API Worker rather than a separately isolated execution service. Account recovery for teachers/learners is not implemented. Existing frontend layout exceptions are documented in `FRONTEND_RULES.md`; passing static tests does not prove layout stability.

`PROJECT_STATE.md` describes the private upstream snapshot and may mention its deployment. This candidate has no deployment. Current release-specific facts are in `RELEASE_REVIEW.md`; historical plans are context, not guarantees.

## License and external references

[MIT](LICENSE) is the proposed license for original project code and documentation controlled by the project contributors. See [third-party scope and review boundaries](THIRD_PARTY_NOTICES.md). No Cambridge materials, third-party trademarks or unverified third-party content are relicensed by this proposal. The owner states that the five PNG assets, lessons, questions and reference answers were generated with ChatGPT. Identified external prose and doubtful concrete examples have been removed from the planned public history. Chapter 15.5 retains one local “Content under development” notice; see [content gaps and test changes](docs/CONTENT_GAPS.md).

Official PDFs and full Markdown transcriptions are excluded from this repository and its filtered history. Obtain the originals from [the official reference links](EXTERNAL_REFERENCES.md); tests do not require them.

SeedToCode is an independent project. It is not affiliated with, endorsed by, or officially authorized by Cambridge International Education or Cambridge University Press & Assessment.
