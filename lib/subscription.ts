import { db } from './db'
import { organizations, athletes } from './db/schema'
import { eq } from 'drizzle-orm'
import { SUBSCRIPTION_LIMITS, SubscriptionTier } from './validations'

export async function checkAthleteLimit(organizationId: string): Promise<{
  canCreate: boolean
  current: number
  limit: number
  tier: SubscriptionTier
}> {
  try {
    // Get organization subscription tier
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, organizationId))
      .limit(1)

    if (!org || org.length === 0) {
      return {
        canCreate: false,
        current: 0,
        limit: 0,
        tier: 'free',
      }
    }

    const subscriptionTier = (org[0].subscriptionTier as SubscriptionTier) || 'free'
    const limits = SUBSCRIPTION_LIMITS[subscriptionTier]

    // Count current athletes
    const athleteList = await db
      .select()
      .from(athletes)
      .where(eq(athletes.organizationId, organizationId))

    const currentCount = athleteList.length
    const canCreate = currentCount < limits.athletes

    return {
      canCreate,
      current: currentCount,
      limit: limits.athletes,
      tier: subscriptionTier,
    }
  } catch (error) {
    console.error('[v0] Error checking athlete limit:', error)
    return {
      canCreate: false,
      current: 0,
      limit: 0,
      tier: 'free',
    }
  }
}

export function getSubscriptionFeatures(tier: SubscriptionTier): string[] {
  return SUBSCRIPTION_LIMITS[tier].features
}

export function hasFeature(tier: SubscriptionTier, feature: string): boolean {
  return SUBSCRIPTION_LIMITS[tier].features.includes(feature)
}

export function getSubscriptionPrice(tier: SubscriptionTier): number {
  const prices: Record<SubscriptionTier, number> = {
    free: 0,
    pro: 2900, // $29.00 in cents
    enterprise: 0, // Custom pricing
  }
  return prices[tier]
}

export function formatSubscriptionPrice(tier: SubscriptionTier): string {
  const price = getSubscriptionPrice(tier)
  if (price === 0) return 'Grátis'
  return `$${(price / 100).toFixed(2)}/mês`
}

export const SUBSCRIPTION_TIERS_INFO = {
  free: {
    name: 'Gratuito',
    description: 'Perfeito para começar',
    price: 'Grátis',
    features: [
      'Até 5 atletas',
      'Dietas básicas',
      'Acompanhamento de peso',
      'Suporte por email',
    ],
  },
  pro: {
    name: 'Pro',
    description: 'Para profissionais sérios',
    price: '$29/mês',
    features: [
      'Até 50 atletas',
      'Dietas com IA',
      'Análise completa de progresso',
      'Exportação de relatórios',
      'Suporte prioritário',
      'Analytics avançadas',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    description: 'Solução customizada',
    price: 'Contato para preço',
    features: [
      'Atletas ilimitados',
      'Todas as features Pro',
      'API access',
      'Gestão de equipes',
      'Branding customizado',
      'Suporte dedicado',
    ],
  },
}
