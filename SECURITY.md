# Security

This is a release candidate, not an independently certified secure service. The current development line is the only supported line; there is no promised response SLA.

## Report privately

After a public GitHub repository exists and private vulnerability reporting is enabled, use that repository's **Security → Report a vulnerability**. Until then, contact the repository owner through an already established private channel. No dedicated security mailbox or active GitHub reporting endpoint has been verified for this unpublished candidate. Do not disclose exploit details, credentials or student data in public issues.

Provide affected revision, minimal synthetic reproduction, expected behavior and impact. Do not test attacks against the original maintainer's hosted service. Test only an isolated local instance or a deployment you own and are authorized to assess.

## Deployment responsibilities

Never expose `ENVIRONMENT=development`: registration then returns a one-time verification token and cookies permit local HTTP. The checked-in Worker configuration defaults to production semantics, has a zero UUID database placeholder, and cannot be treated as a deployment-ready configuration. The dev script explicitly uses local mode and development semantics. Missing/unknown environment values use Secure cookies.

Configure your own database, email provider, origin and policy contacts before serving accounts. Keep credentials in your secret store; `.dev.vars` is local only. Audit request size/cost limits, email abuse, account recovery, CSRF, logging, backup/deletion policies and jurisdictional privacy duties before a real deployment.

Sessions are HttpOnly/SameSite=Lax random tokens; only hashes are stored. Native sessions use the OS keychain. Personal projects enforce account ownership; grading uses server-side evaluation. These are design boundaries, not proof of absence of vulnerabilities. Cloud execution runs the restricted AST interpreter in the API Worker; separate execution isolation is still planned.

The candidate adds single-winner one-time credential consumption and atomic run admission, with SQLite regressions. A failure after credential consumption intentionally fails closed: re-register an email account or ask the teacher to reissue student activation. The original private and production copies are unchanged and need a separately authorized fix/release if the owner chooses.

If a real secret is ever found in history, stop publication and arrange owner-authorized revocation/rotation. Filtering history does not revoke a credential. Never force-push cleaned history to the private source repository.
