# Error Handling and Resilience Process

## Coding Standard: Try/Catch

Use guarded async actions for network, OCR, and file operations.

```ts
export async function safeRouteDocument(action: () => Promise<void>) {
  try {
    await action()
  } catch (error) {
    console.error('Route operation failed', error)
    throw new Error('Unable to route document. Please try again.')
  }
}
```

Rules:

- Catch at service boundary, not everywhere.
- Convert technical errors into user-friendly messages.
- Preserve original error for logs/telemetry.

## UI Error Strategy

- Show toast for transient failures.
- Show inline error messages for form validation.
- Use error boundaries for page-level crashes.
- Provide retry button for recoverable operations.

## API Error Contract (if backend enabled)

Standard payload:

```json
{
  "code": "RATE_LIMITED",
  "message": "Too many requests. Try again later.",
  "requestId": "req_123",
  "retryAfter": 60
}
```

## Resilience Patterns

- Timeout long-running calls (OCR, exports).
- Retry idempotent requests with exponential backoff.
- Use circuit breaker for unstable upstream services.
- Queue heavy jobs (OCR/report generation) instead of blocking requests.

## Logging and Observability

- Include `requestId`, `userId`, `officeId`, and route in logs.
- Log error severity (`warn`, `error`, `critical`).
- Alert on repeated failures in routing and acknowledgment flows.
