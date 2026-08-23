# Security Policy

## Supported branch

Security fixes are applied to `main` and active release branches. Production must use a currently supported, security-patched Next.js and Node.js release line.

## Dependency policy

- Dependabot checks npm dependencies weekly and GitHub Actions monthly.
- Critical/high framework advisories are reviewed promptly; do not wait for the normal weekly batch when a reachable production vulnerability is announced.
- Runtime dependencies must not remain on end-of-life release lines.
- Generate and commit `package-lock.json` from the supported Node/npm toolchain before production deployment, then use `npm ci` in CI/deployment for reproducible installs.
- Never commit `.env.local`, tokens, service credentials, analytics secrets or ad-platform credentials.

## Application controls

- Preview and development deployments remain non-indexable.
- Security headers are applied in `next.config.mjs`; HSTS is production-only.
- Public calculator inputs remain client-side and are validated before domain functions are invoked.
- No raw calculator measurements are sent through the analytics abstraction.
- If the consent UI is enabled, optional analytics events are suppressed until acceptance.
- Future server APIs must validate input and add rate limits appropriate to abuse risk.

## Reporting a vulnerability

Do not publish credentials, private user data or exploit details in a public issue. Contact the repository owner privately through the contact method published on the YardageLab site and provide reproduction steps, affected route/version and impact.
