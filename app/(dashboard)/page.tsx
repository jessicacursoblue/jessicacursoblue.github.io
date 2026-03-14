'use client'

import Link from 'next/link'
import { ArrowRight, Plus, TrendingUp, Users } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo de volta! Aqui está um resumo da sua atividade.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Total de Atletas', value: '12', icon: Users },
          { label: 'Dietas Ativas', value: '8', icon: TrendingUp },
          { label: 'Evolução Média', value: '+2.3kg', icon: ArrowRight },
          { label: 'Taxa de Retenção', value: '92%', icon: Users },
        ].map((stat, i) => (
          <div key={i} className="glass-effect p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className="w-10 h-10 text-accent opacity-50" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-effect p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">Ações Rápidas</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/dashboard/athletes/new" className="glass-effect p-4 rounded-lg hover:bg-white/[0.1] transition flex items-center gap-3">
            <Plus className="w-6 h-6 text-accent" />
            <span>Adicionar Atleta</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="/dashboard/diets/new" className="glass-effect p-4 rounded-lg hover:bg-white/[0.1] transition flex items-center gap-3">
            <Plus className="w-6 h-6 text-accent" />
            <span>Gerar Nova Dieta</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="/dashboard/settings" className="glass-effect p-4 rounded-lg hover:bg-white/[0.1] transition flex items-center gap-3">
            <Plus className="w-6 h-6 text-accent" />
            <span>Configurações da Conta</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-effect p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">Atividade Recente</h2>
        <div className="space-y-4">
          {[
            { action: 'Nova dieta gerada para João Silva', time: '2 horas atrás' },
            { action: 'Atleta Maria Santos atingiu meta de peso', time: '5 horas atrás' },
            { action: 'Novo relatório disponível para análise', time: '1 dia atrás' },
          ].map((activity, i) => (
            <div key={i} className="flex justify-between items-center pb-4 border-b border-border last:border-0">
              <p className="text-foreground">{activity.action}</p>
              <p className="text-sm text-muted-foreground">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
