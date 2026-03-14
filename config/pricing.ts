// Stripe price IDs and plan configuration
// Update these with your actual Stripe price IDs from your dashboard

export const PRICING_CONFIG = {
  plans: [
    {
      id: 'free',
      name: 'Gratuito',
      description: 'Perfeito para começar',
      price: {
        amount: 0,
        currency: 'BRL',
      },
      features: [
        'Até 5 atletas',
        'Dieta básica com IA',
        'Relatórios simples',
        'Suporte por email',
      ],
      limits: {
        athletes: 5,
        apiCalls: 100,
        storageGB: 1,
      },
      stripe: {
        priceId: null,
        productId: null,
      },
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Para coaches profissionais',
      price: {
        amount: 9900, // R$ 99.00 in cents
        currency: 'BRL',
      },
      features: [
        'Atletas ilimitados',
        'Dieta avançada com IA',
        'Relatórios detalhados',
        'Analytics avançada',
        'Suporte prioritário',
        'API access',
      ],
      limits: {
        athletes: 999,
        apiCalls: 10000,
        storageGB: 100,
      },
      stripe: {
        priceId: 'price_pro_monthly', // Update with your Stripe price ID
        productId: 'prod_pro',
      },
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Para organizações grandes',
      price: {
        amount: null,
        currency: 'BRL',
      },
      features: [
        'Tudo do Pro',
        'API customizada',
        'Integração dedicada',
        'Suporte 24/7',
        'SLA garantido',
        'Dados on-premise',
      ],
      limits: {
        athletes: 999999,
        apiCalls: 999999,
        storageGB: 999999,
      },
      stripe: {
        priceId: 'price_enterprise_monthly', // Update with your Stripe price ID
        productId: 'prod_enterprise',
      },
    },
  ],

  // Feature comparisons
  features: [
    {
      category: 'Atletas',
      items: [
        { name: 'Número de atletas', free: '5', pro: 'Ilimitado', enterprise: 'Ilimitado' },
        { name: 'Gestão de perfil', free: 'Sim', pro: 'Sim', enterprise: 'Sim' },
      ],
    },
    {
      category: 'Dietas',
      items: [
        { name: 'Geração com IA', free: 'Sim', pro: 'Sim', enterprise: 'Sim' },
        { name: 'Modelos customizados', free: 'Não', pro: 'Sim', enterprise: 'Sim' },
        { name: 'Histórico ilimitado', free: 'Não', pro: 'Sim', enterprise: 'Sim' },
      ],
    },
    {
      category: 'Relatórios',
      items: [
        { name: 'Gráficos básicos', free: 'Sim', pro: 'Sim', enterprise: 'Sim' },
        { name: 'Análise avançada', free: 'Não', pro: 'Sim', enterprise: 'Sim' },
        { name: 'Exportar relatórios', free: 'Não', pro: 'Sim', enterprise: 'Sim' },
      ],
    },
    {
      category: 'Suporte',
      items: [
        { name: 'Email', free: 'Sim', pro: 'Sim', enterprise: 'Sim' },
        { name: 'Prioridade', free: 'Não', pro: 'Sim', enterprise: 'Sim' },
        { name: 'Suporte 24/7', free: 'Não', pro: 'Não', enterprise: 'Sim' },
        { name: 'Dedicated account', free: 'Não', pro: 'Não', enterprise: 'Sim' },
      ],
    },
    {
      category: 'API',
      items: [
        { name: 'Acesso a API', free: 'Não', pro: 'Sim', enterprise: 'Sim' },
        { name: 'Chamadas por mês', free: '-', pro: '10,000', enterprise: 'Ilimitado' },
        { name: 'Webhooks', free: 'Não', pro: 'Sim', enterprise: 'Sim' },
      ],
    },
  ],
}

// Determine features available for a given tier
export function getFeaturesByTier(tier: 'free' | 'pro' | 'enterprise') {
  const plan = PRICING_CONFIG.plans.find((p) => p.id === tier)
  return plan?.features || []
}

// Get plan limits
export function getLimitsByTier(tier: 'free' | 'pro' | 'enterprise') {
  const plan = PRICING_CONFIG.plans.find((p) => p.id === tier)
  return plan?.limits || {}
}

// Check if user can perform action based on subscription tier
export function canPerformAction(
  tier: 'free' | 'pro' | 'enterprise',
  action: 'add_athlete' | 'generate_diet' | 'export_report' | 'api_access',
): boolean {
  const permissions: Record<string, Record<string, boolean>> = {
    free: {
      add_athlete: true,
      generate_diet: true,
      export_report: false,
      api_access: false,
    },
    pro: {
      add_athlete: true,
      generate_diet: true,
      export_report: true,
      api_access: true,
    },
    enterprise: {
      add_athlete: true,
      generate_diet: true,
      export_report: true,
      api_access: true,
    },
  }

  return permissions[tier]?.[action] ?? false
}
