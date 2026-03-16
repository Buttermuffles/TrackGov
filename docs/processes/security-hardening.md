# Security Hardening Process

## 1. Access Control

- Enforce role-based permissions on every protected route and API.
- Deny by default; allow per action.
- Validate office-scoped access for non-admin roles.

## 2. Authentication and Session

- Store only minimal session data in browser storage.
- Use short-lived access tokens and rotate refresh tokens (backend).
- Invalidate session on logout and privilege change.

## 3. Input Validation

- Validate all form input with Zod on client and server.
- Sanitize user-supplied text before rendering and logging.
- Reject oversized uploads and unsupported MIME types.

## 4. DDoS Prevention

- Put app behind CDN/WAF (Cloudflare, Azure Front Door, or equivalent).
- Enable bot mitigation and request anomaly detection.
- Use upstream rate limiting by IP + user + route category.

## 5. Rate Limiting

Recommended baseline for API endpoints:

- Auth endpoints: `5 requests/min/IP` + progressive backoff.
- OCR endpoints: `10 requests/10 min/user`.
- Search endpoints: `60 requests/min/user`.
- Public tracker: `30 requests/min/IP`.

Escalation behavior:

- Soft limit: return `429` with `Retry-After`.
- Hard abuse: temporary block and security event log.

## 6. Headers and Transport

Set strict security headers at edge/proxy:

- `Strict-Transport-Security`
- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`

Always enforce HTTPS and disable mixed content.

## 7. Secrets and Configuration

- Never commit API keys, SMTP secrets, or tokens.
- Use environment variables and secret managers.
- Rotate secrets quarterly or after incidents.

## 8. Data Protection

- Encrypt sensitive data in transit and at rest.
- Mask confidential fields in public tracker and logs.
- Log access to confidential documents as audit events.

## 9. Security Testing Checklist

- Dependency scan on every CI run (`npm audit` + SCA tooling).
- Static analysis for vulnerable patterns.
- Pen-test critical flows quarterly.
- Verify IDOR, broken access control, and injection defenses.
