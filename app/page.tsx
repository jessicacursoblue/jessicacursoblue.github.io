'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Bot, TrendingUp, Users, CreditCard } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect-dark border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-accent">NutriAthlete AI</div>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-foreground hover:text-accent transition">
              Funcionalidades
            </a>
            <a href="#pricing" className="text-foreground hover:text-accent transition">
              Planos
            </a>
            <a href="#contact" className="text-foreground hover:text-accent transition">
              Contato
            </a>
            <Link href="/auth/login" className="btn-secondary">
              Entrar
            </Link>
          </div>
          <div className="md:hidden">
            <Link href="/auth/login" className="btn-secondary text-sm">
              Entrar
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="glass-effect-dark p-8 sm:p-12 rounded-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
              Nutrição Esportiva com <span className="text-accent">Inteligência Artificial</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              Plataforma completa para gestão de atletas com dietas personalizadas geradas por IA, acompanhamento de evolução e otimização de performance esportiva.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="btn-primary flex items-center justify-center gap-2">
                Começar Agora <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-secondary">
                Ver Demo
              </button>
            </div>
          </div>

          <div className="relative w-full max-w-md mx-auto h-64 sm:h-80">
            <Image 
              src="/logo.png" 
              alt="NutriAthlete AI Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance mb-4">
              Funcionalidades Poderosas
            </h2>
            <p className="text-lg text-muted-foreground">
              Tudo que você precisa para gerenciar atletas e otimizar sua performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Bot,
                title: 'Dieta com IA',
                description: 'Geração automática de planos alimentares com base em peso, altura e objetivo do atleta.',
              },
              {
                icon: TrendingUp,
                title: 'Relatórios de Evolução',
                description: 'Acompanhe gráficos de peso, IMC e desempenho ao longo do tempo com análises detalhadas.',
              },
              {
                icon: Users,
                title: 'Gestão de Atletas',
                description: 'Cadastro completo com histórico alimentar e acompanhamento individual por coach.',
              },
              {
                icon: CreditCard,
                title: 'Gestão Financeira',
                description: 'Controle de assinaturas, planos e pagamentos integrado com Stripe.',
              },
            ].map((feature, i) => (
              <div key={i} className="glass-effect p-6 rounded-2xl hover:bg-white/[0.1] transition-all">
                <feature.icon className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-accent">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance mb-4">
              Planos Simples e Transparentes
            </h2>
            <p className="text-lg text-muted-foreground">
              Escolha o plano perfeito para suas necessidades
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Gratuito',
                price: 'R$ 0',
                period: 'para sempre',
                features: ['Até 5 atletas', 'Dieta básica com IA', 'Relatórios simples', 'Suporte por email'],
                cta: 'Começar',
                highlighted: false,
              },
              {
                name: 'Pro',
                price: 'R$ 99',
                period: 'por mês',
                features: ['Atletas ilimitados', 'Dieta avançada com IA', 'Relatórios detalhados', 'Analytics avançada', 'Suporte prioritário'],
                cta: 'Upgradear',
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: 'Customizado',
                period: 'entre em contato',
                features: ['Tudo do Pro', 'API customizada', 'Integração dedicada', 'Suporte 24/7', 'SLA garantido'],
                cta: 'Falar com vendas',
                highlighted: false,
              },
            ].map((plan, i) => (
              <div 
                key={i}
                className={`glass-effect p-8 rounded-2xl flex flex-col ${plan.highlighted ? 'border-2 border-accent scale-105' : ''}`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-accent">{plan.price}</div>
                  <div className="text-sm text-muted-foreground">{plan.period}</div>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={plan.highlighted ? 'btn-primary w-full' : 'btn-secondary w-full'}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center glass-effect-dark p-8 sm:p-16 rounded-3xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance mb-6">
            Pronto para transformar sua performance?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Comece gratuitamente e experimente o poder da IA para nutrição esportiva.
          </p>
          <Link href="/auth/register" className="btn-primary inline-flex items-center gap-2">
            Criar conta gratuitamente <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 NutriAthlete AI | Desenvolvido por Jessica Pereira
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-accent transition">
                Privacidade
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-accent transition">
                Termos
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-accent transition">
                Contato
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
