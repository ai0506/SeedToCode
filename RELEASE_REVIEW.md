# Release review — unpublished candidate

This directory is a local release candidate. There is no Git remote, no GitHub publication, no deployment and no application submission. Only the audited `main` history is included. The private source remains the source of truth; uncommitted private changes are not included.

The owner confirms that the five PNG assets, lessons, questions and reference answers were generated with ChatGPT. Their origin is recorded as an owner declaration; identified external-reference matches are assessed separately.

## Blocking decisions

- Resolve the short Cambridge-like excerpts/code identified in `THIRD_PARTY_NOTICES.md` and the Chinese audit. Their provenance/quotation rights are not established. Complete PDFs, transcripts and identified exam-answer excerpts have been removed, but that alone is not full rights clearance.
- Complete real browser checks at desktop and narrow widths, including the default and bundled samples. The current tool environment blocked local-file browser access, and no authorized preview-launch tool was available. This is **Not Verified**.
- Before hosting account services, supply the operator's own infrastructure, working privacy contact and independently validated authentication/authorization/API workflows. The checked-in contact is an explicit template.

The detailed Chinese audit, source-state proof, before/after history mapping, redacted scans, actual test logs and offline synchronization toolkit are delivered outside this repository. Do not publish that parent review directory or its private audit inputs.

MIT is prepared as a proposal for original material only. This candidate is **not approved for public release** while the blockers above remain. Automatic publication is disabled and a local pre-push hook rejects every push by default. A file inside a release candidate cannot substitute for maintainer approval.
