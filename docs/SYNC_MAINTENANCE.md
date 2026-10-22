# Maintaining the public mirror

The private development repository remains the source of truth during this transition. Only audited committed `main` content is exported. Public history uses a deterministic filtering policy; do not merge or fetch raw private history into a public checkout.

The maintainer receives an offline `release-toolkit` outside the public tree. It rebuilds a sanitized upstream stream in a new clone, rejects new historical paths and scanner findings, checks metadata/all reachable objects, and installs a deny-all pre-push hook. Its private redaction inputs must never be published. Every output still requires manual copyright and security review.

Keep the public preparation changes as normal commits on the public main line. After reviewing a newly filtered upstream stream, verify the previous filtered tip is an ancestor and merge it into a fresh local copy of public main. Resolve conflicts in documentation, examples and candidate-only security fixes deliberately; run the full checks again. The previous public main must remain an ancestor before an ordinary authorized push. Do not force-push a regenerated upstream tip over public maintenance commits.

Changed filtering rules may rewrite already-public ancestors and require a separate migration/security decision. No publishing automation is provided. A future single public product repository plus separate private operations/reference repositories would reduce the cost and risk of maintaining two development lines.
