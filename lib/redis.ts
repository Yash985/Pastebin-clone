import { Redis } from "@upstash/redis";

if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  console.warn("Redis environment variables are missing!");
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
  retry: {
    retries: 3,
    backoff: (retryCount) => Math.exp(retryCount) * 50,
  },
});
//export const redis = Redis.fromEnv()

export interface Paste {
  id: string;
  content: string;
  max_views?: number;
  remaining_views?: number | null;
  expires_at?: string | null;
}

export function getCurrentTime(headers: Headers): number {
  const testNow = headers.get("x-test-now-ms");
  if (process.env.TEST_MODE === "1" && testNow) {
    return parseInt(testNow, 10);
  }
  return Date.now();
}
