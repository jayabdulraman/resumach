import { redis } from "./redis";

interface RateLimitConfig {
  maxRequests: number; // Maximum number of requests allowed
  windowInHours: number; // Time window in hours
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

export async function checkRateLimit(
  userId: string,
  action: string,
): Promise<{ remaining: number; resetAt: Date, error: string }> {
  const key = `rate-limit:${action}:${userId}`;
  const now = Date.now();
  const maxRequests = process.env.NEXT_PUBLIC_RATE_LIMIT! as unknown as number
  const windowInHours = process.env.NEXT_PUBLIC_RATE_LIMIT_EXPIRY_HOURS! as unknown as number
  const windowMs = windowInHours * 60 * 60 * 1000;

  // Get current requests within the window
  const requestTimes = (await redis.zrange(
    key,
    now - windowMs,
    now
  )) as string[];

  // Add new request timestamp
  await redis.zadd(key, { score: now, member: now.toString() });
  // Set expiry on the key
  await redis.expire(key, Math.ceil(windowMs / 1000));

  return {
    remaining: maxRequests - requestTimes.length - 1,
    resetAt: new Date(now + windowMs),
    error: '',
  };
}

export async function getUserRateLimit(
    userId: string,
    action: string
  ): Promise<{ remaining: number; resetAt: Date, error: string }> {
    const key = `rate-limit:${action}:${userId ? userId: 0}`;
    const now = Date.now();
    const maxRequests = Number(process.env.NEXT_PUBLIC_RATE_LIMIT!)
    const windowInHours = Number(process.env.NEXT_PUBLIC_RATE_LIMIT_EXPIRY_HOURS!)
    const windowMs = windowInHours * 60 * 60 * 1000;
    // set window time-period
    const windowStart = now - windowMs;

    // Get current requests within the window (24 hours)
    const requestTimes = (await redis.zrange(key, windowStart, now, {
        byScore: true
      })) as string[];

    // Get expiry time of key - expiry time of rate limit
    const expirySeconds = await redis.ttl(key)
    const resetAt =  new Date((expirySeconds * 1000) + now)

    if (requestTimes.length >= maxRequests) {
      return {
          error: `Rate limit exceeded. Try again after ${resetAt.toISOString()}`, 
          remaining: maxRequests - requestTimes.length - 1, 
          resetAt: resetAt
      }
    }

    return {
      remaining: maxRequests - requestTimes.length,
      resetAt: resetAt,
      error: ''
    };
  }