# Operations Runbook

## Deployment Checklist

- Run type-check and production build.
- Run dependency vulnerability scan.
- Verify environment variables and secrets.
- Confirm cache headers and security headers are active.
- Smoke test: login, routing, OCR, public tracker.

## Incident Response

1. Detect
- Monitor alerts for latency, error spikes, and 429/5xx increases.

2. Triage
- Identify scope (single endpoint, OCR service, entire app).
- Determine severity and notify stakeholders.

3. Mitigate
- Enable stricter rate limits for abusive traffic.
- Activate WAF challenge mode under DDoS pressure.
- Disable non-critical heavy features if necessary.

4. Recover
- Validate service stability and data integrity.
- Backfill any missed audit or notification jobs.

5. Postmortem
- Document timeline, root cause, corrective actions.
- Convert actions into tracked engineering tasks.

## Backup and Recovery

- Keep regular snapshots/exports of critical data.
- Test restore process monthly.
- Maintain RPO/RTO targets aligned with agency policy.
