/**
 * OUTSIDE — Enterprise Sliding-Window IP Rate Limiter
 * Protection against bot abuse, brute-force, scraping, and inventory lockouts.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipBuckets = new Map<string, RateLimitRecord>();

// Cleanup stale buckets periodically (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipBuckets.entries()) {
    record.timestamps = record.timestamps.filter((ts) => now - ts < 3600000);
    if (record.timestamps.length === 0) {
      ipBuckets.delete(ip);
    }
  }
}, 600000);

export interface RateLimitOptions {
  windowMs: number; // e.g. 15 * 60 * 1000 (15 min)
  maxRequests: number; // e.g. 10
}

export function checkRateLimit(
  ip: string,
  options: RateLimitOptions = { windowMs: 900000, maxRequests: 15 }
): { allowed: boolean; remaining: number; resetSeconds: number } {
  const now = Date.now();
  let record = ipBuckets.get(ip);

  if (!record) {
    record = { timestamps: [] };
    ipBuckets.set(ip, record);
  }

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < options.windowMs);

  if (record.timestamps.length >= options.maxRequests) {
    const oldestTimestamp = record.timestamps[0];
    const resetSeconds = Math.ceil((oldestTimestamp + options.windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  // Record request
  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: options.maxRequests - record.timestamps.length,
    resetSeconds: Math.ceil(options.windowMs / 1000),
  };
}
