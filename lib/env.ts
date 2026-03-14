import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default('NutriAthlete AI'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url().optional(),
  STRIPE_PUBLIC_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  AI_GATEWAY_API_KEY: z.string().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
})

const env = envSchema.parse(process.env)

export default env
