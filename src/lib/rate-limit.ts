type RateLimitRecord = {
  count: number
  lastReset: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

const WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours
const MAX_REQUESTS = 100

export function rateLimit(ip: string) {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastReset: now })
    return { success: true }
  }

  if (now - record.lastReset > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now })
    return { success: true }
  }

  if (record.count >= MAX_REQUESTS) {
    return { success: false }
  }

  record.count += 1
  return { success: true }
}
