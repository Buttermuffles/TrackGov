type Bucket = {
  timestamps: number[]
}

const memoryBuckets = new Map<string, Bucket>()

export function isRateLimited(key: string, max: number, windowMs: number): { limited: boolean; retryAfterMs: number } {
  const now = Date.now()
  const bucket = memoryBuckets.get(key) ?? { timestamps: [] }
  const valid = bucket.timestamps.filter((ts) => now - ts < windowMs)

  if (valid.length >= max) {
    const oldest = valid[0]
    const retryAfterMs = Math.max(0, windowMs - (now - oldest))
    memoryBuckets.set(key, { timestamps: valid })
    return { limited: true, retryAfterMs }
  }

  valid.push(now)
  memoryBuckets.set(key, { timestamps: valid })
  return { limited: false, retryAfterMs: 0 }
}
