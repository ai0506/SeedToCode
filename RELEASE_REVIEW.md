# Release review — unpublished candidate

This is a local release candidate. There is no Git remote, GitHub publication, deployment or application submission. Only the audited main history is included. The private source is unchanged by this task; concurrent private changes are not included.

The owner states that the five PNG assets, lessons, questions and reference answers were generated with ChatGPT. This is a provenance declaration, not permission to redistribute external reference material.

## Copyright cleanup

The identified official publications/transcripts, external prose and answer excerpts, and doubtful concrete examples have been removed from the planned public history. The decision is conservative; text similarity is not treated as a plagiarism finding. Grammar, keywords, ordinary language facts, generic algorithms and original project content remain. All sixteen chapters and stable exercise/navigation IDs remain. Chapter 15.5 has one local “Content under development” note. See `docs/CONTENT_GAPS.md` for precise gaps and changed fixture coverage.

The identified copyright blockers have been addressed under the owner's removal policy. This does not certify every generation input, all internet sources or every jurisdiction's legal position. MIT grants only rights controlled by contributors; third-party licenses and trademarks retain their own scope.

## Validation and remaining boundaries

- TypeScript builds, Worker checks, teaching snapshots and regression tests were rerun; detailed logs and exact totals are in the external Chinese audit.
- Real browser HTTP checks cover default Main input/output, bundled BubbleSort, virtual-file FileCopy, chapter 15.5 placeholder/navigation/quiz, a real exercise submission with locked starter code, and desktop/narrow widths. A narrow course-footer overflow found during acceptance was fixed. Static checks retain the existing exception baseline.
- Direct local-file browser navigation was unavailable to the automation environment. HTTP checks do not establish a fresh file:// browser run.
- Hosted account services still require the operator's own infrastructure, real privacy contact and deployment-specific authentication/authorization/API validation. This task does not claim production or authenticated multi-account Worker/D1 browser E2E verification.

The Chinese audit, source-state proof, history mappings, recovery data, scanner/test logs and maintenance toolkit are delivered outside this repository. Do not publish the parent review directory or its private inputs.

Publication remains disabled until the owner explicitly approves it. The local pre-push hook rejects all pushes and no remote is configured. A file in a candidate cannot substitute for maintainer approval.
