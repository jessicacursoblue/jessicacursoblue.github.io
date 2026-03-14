import { z } from 'zod'

// Subscription tier limits
export const SUBSCRIPTION_LIMITS = {
  free: {
    athletes: 5,
    apiCallsPerDay: 100,
    storageGB: 1,
    features: ['basic_diet', 'weight_tracking'],
  },
  pro: {
    athletes: 50,
    apiCallsPerDay: 1000,
    storageGB: 10,
    features: ['basic_diet', 'ai_diet', 'weight_tracking', 'analytics', 'export'],
  },
  enterprise: {
    athletes: Infinity,
    apiCallsPerDay: Infinity,
    storageGB: 1000,
    features: [
      'basic_diet',
      'ai_diet',
      'weight_tracking',
      'analytics',
      'export',
      'api_access',
      'team_management',
      'custom_branding',
    ],
  },
}

export type SubscriptionTier = keyof typeof SUBSCRIPTION_LIMITS

// Validation schemas
export const createAthleteSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  weight: z.number().positive('Peso deve ser positivo'),
  height: z.number().positive('Altura deve ser positiva'),
  age: z.number().int().positive('Idade deve ser positiva'),
  goal: z.enum(['maintenance', 'cutting', 'bulking', 'recomposition']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
})

export const generateDietSchema = z.object({
  athleteId: z.string().uuid('ID do atleta inválido'),
  dietType: z.enum(['maintenance', 'cutting', 'bulking', 'recomposition']),
  allergies: z.string().optional(),
  preferences: z.string().optional(),
})

export const progressRecordSchema = z.object({
  athleteId: z.string().uuid('ID do atleta inválido'),
  weight: z.number().positive('Peso deve ser positivo'),
  bodyFatPercentage: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
})

export type CreateAthlete = z.infer<typeof createAthleteSchema>
export type GenerateDiet = z.infer<typeof generateDietSchema>
export type ProgressRecord = z.infer<typeof progressRecordSchema>
