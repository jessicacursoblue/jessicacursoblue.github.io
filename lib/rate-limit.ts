import { headers } from 'next/headers'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const rateLimitStore: RateLimitStore = {}

export interface RateLimitConfig {
  interval: number // milliseconds
  maxRequests: number
  keyPrefix?: string
}

export class RateLimiter {
  private store: RateLimitStore = rateLimitStore
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  private getClientIp(): string {
    const headersList = headers()
    return (
      headersList.get('x-forwarded-for')?.split(',')[0] ||
      headersList.get('x-real-ip') ||
      'unknown'
    )
  }

  private getKey(identifier?: string): string {
    const clientIp = this.getClientIp()
    const prefix = this.config.keyPrefix || 'rate-limit'
    return `${prefix}:${identifier || clientIp}`
  }

  check(identifier?: string): boolean {
    const key = this.getKey(identifier)
    const now = Date.now()

    if (!this.store[key]) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.config.interval,
      }
      return true
    }

    const record = this.store[key]

    // Reset if interval has passed
    if (now > record.resetTime) {
      record.count = 1
      record.resetTime = now + this.config.interval
      return true
    }

    // Check limit
    if (record.count < this.config.maxRequests) {
      record.count++
      return true
    }

    return false
  }

  getRemainingRequests(identifier?: string): number {
    const key = this.getKey(identifier)
    const now = Date.now()

    if (!this.store[key]) {
      return this.config.maxRequests
    }

    const record = this.store[key]

    if (now > record.resetTime) {
      return this.config.maxRequests
    }

    return Math.max(0, this.config.maxRequests - record.count)
  }

  getResetTime(identifier?: string): number {
    const key = this.getKey(identifier)
    if (!this.store[key]) {
      return 0
    }
    return this.store[key].resetTime
  }
}

// Pre-configured rate limiters
export const authLimiter = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  keyPrefix: 'auth',
})

export const apiLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  maxRequests: 30,
  keyPrefix: 'api',
})

export const aiLimiter = new RateLimiter({
  interval: 60 * 60 * 1000, // 1 hour
  maxRequests: 10,
  keyPrefix: 'ai',
})
