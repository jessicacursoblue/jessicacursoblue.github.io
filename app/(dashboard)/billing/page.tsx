'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, ArrowLeft } from 'lucide-react'
import useSWR from 'swr'

interface Subscription {
  tier: 'free' | 'pro' | 'enterprise'
  status: string
  currentPeriodEnd?: string
}

const PLANS = [
  {
    name: 'Gratuito',
    tier: 'free',
    price: 'R$ 0',
    period: 'para sempre',
    description: 'Perfeito para começar',
    features: [
      'Até 5 atletas',
      'Dieta básica com IA',
      'Relatórios simples',
      'Suporte por email',
    ],
    button: 'Plano Atual',
    highlighted: false,
  },
  {
    name: 'Pro',
    tier: 'pro',
    price: 'R$ 99',
    period: 'por mês',
    description: 'Para coaches profissionais',
    features: [
      'Atletas ilimitados',
      'Dieta avançada com IA',
      'Relatórios detalhados',
      'Analytics avançada',
      'Suporte prioritário',
      'API access',
    ],
    button: 'Upgrade para Pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    tier: 'enterprise',
    price: 'Customizado',
    period: 'entre em contato',
    description: 'Para organizações grandes',
    features: [
      'Tudo do Pro',
      'API customizada',
      'Integração dedicada',
      'Suporte 24/7',
      'SLA garantido',
      'Dados on-premise',
    ],
    button: 'Falar com vendas',
    highlighted: false,
  },
]

export default function BillingPage() {
  const [organizationId, setOrganizationId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const id = sessionStorage.getItem('organizationId') || 'default-org'
    setOrganizationId(id)
  }, [])

  const { data: subscription } = useSWR(
    organizationId ? `/api/billing/subscription?organizationId=${organizationId}` : null,
    (url) => fetch(url).then((res) => res.json())
  )

  async function handleUpgrade(tier: string) {
    if (tier === 'free') return

    setIsLoading(true)
    try {
      // Map tier to Stripe price ID
      const priceMap: Record<string, string> = {
        pro: 'price_pro_monthly',
        enterprise: 'price_enterprise_monthly',
      }

      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          priceId: priceMap[tier],
        }),
      })

      if (!response.ok) throw new Error('Erro ao processar pagamento')

      const { url } = await response.json()
      if (url) window.location.href = url
    } catch (error) {
      alert('Erro ao processar upgrade')
    } finally {
      setIsLoading(false)
    }
  }

  const currentPlan = subscription?.tier || 'free'

  return (
    <div className="space-y-8">
      <Link href="/dashboard" className="flex items-center gap-2 text-accent hover:underline">
        <ArrowLeft className="w-5 h-5" /> Voltar para Dashboard
      </Link>

      <div>
        <h1 className="text-4xl font-bold mb-2">Planos e Faturamento</h1>
        <p className="text-muted-foreground">
          Escolha o plano perfeito para suas necessidades
        </p>
      </div>

      {/* Current Plan Info */}
      {subscription && subscription.tier !== 'free' && (
        <div className="glass-effect p-6 rounded-2xl border-2 border-primary">
          <p className="text-sm text-muted-foreground mb-2">Plano Atual</p>
          <h2 className="text-2xl font-bold mb-1 capitalize">{subscription.tier}</h2>
          {subscription.currentPeriodEnd && (
            <p className="text-sm text-muted-foreground">
              Renova em{' '}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {PLANS.map((plan) => {
          const isCurrent = plan.tier === currentPlan
          const isHighlighted = plan.highlighted

          return (
            <div
              key={plan.tier}
              className={`glass-effect p-8 rounded-2xl flex flex-col ${
                isHighlighted ? 'border-2 border-accent scale-105' : ''
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              <div className="mb-6">
                <div className="text-4xl font-bold text-accent">{plan.price}</div>
                <div className="text-sm text-muted-foreground">{plan.period}</div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.tier)}
                disabled={isCurrent || isLoading}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  isCurrent
                    ? 'btn-secondary opacity-50 cursor-not-allowed'
                    : isHighlighted
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {isCurrent ? 'Plano Atual' : isLoading ? 'Processando...' : plan.button}
              </button>
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <div className="glass-effect p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>

        <div className="space-y-6">
          {[
            {
              q: 'Posso mudar de plano a qualquer momento?',
              a: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças serão refletidas no próximo ciclo de cobrança.',
            },
            {
              q: 'Qual é a política de cancelamento?',
              a: 'Você pode cancelar sua assinatura a qualquer momento. Não há taxa de cancelamento e você terá acesso até o fim do período pago.',
            },
            {
              q: 'Vocês oferecem reembolsos?',
              a: 'Oferecemos reembolso dentro de 30 dias após a compra. Após esse período, nenhum reembolso será oferecido.',
            },
            {
              q: 'Como funciona o suporte?',
              a: 'Planos Pro e Enterprise incluem suporte prioritário via email e chat. Planos Gratuitos têm acesso a documentação e comunidade.',
            },
          ].map((faq, i) => (
            <div key={i}>
              <h3 className="font-semibold mb-2 text-accent">{faq.q}</h3>
              <p className="text-muted-foreground text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice History (Coming Soon) */}
      <div className="glass-effect p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Histórico de Faturas</h2>
        <p className="text-muted-foreground">
          Seu histórico de faturas e recibos aparecerá aqui em breve.
        </p>
      </div>
    </div>
  )
}
