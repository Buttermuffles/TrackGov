# Performance and Caching Process

## Performance Budget

- First load JS budget: target `< 350 KB` compressed for initial route.
- Lazy-load non-critical pages and heavy features (OCR/charts).
- Track Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1.

## Frontend Optimization

- Keep route-level code splitting enabled.
- Memoize expensive list transforms and chart data.
- Debounce search inputs and avoid excessive re-renders.
- Virtualize long tables when row count is high.

## Caching Strategy

1. Static Assets
- Cache hashed assets aggressively (`Cache-Control: public,max-age=31536000,immutable`).

2. API Responses (if backend enabled)
- Read-heavy endpoints: short TTL cache (`30-120s`).
- Use stale-while-revalidate for dashboard summaries.
- Bypass cache for sensitive and personalized data.

3. OCR and Derived Data
- Cache OCR results by file hash to avoid reprocessing.
- Expire OCR cache based on retention rules.

## Database/Query Efficiency (if backend enabled)

- Add indexes for frequent filters: status, office, dueDate, updatedAt.
- Paginate list endpoints and cap maximum page sizes.
- Precompute reporting aggregates for dashboards.

## Monitoring

- Instrument client-side performance events.
- Track slow endpoints and p95 latency.
- Alert on sudden cache miss spikes and OCR queue buildup.
