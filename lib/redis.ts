import { Redis } from '@upstash/redis'

export const redis = Redis.fromEnv()

export interface Paste {
  id: string
  content: string
  max_views?: number
  remaining_views?: number | null
  expires_at?: string | null 
}

export function getCurrentTime(headers: Headers): number {
  const testNow = headers.get('x-test-now-ms')
  if (process.env.TEST_MODE === '1' && testNow) {
    return parseInt(testNow, 10)
  }
  return Date.now()
}