'use client'

import { useState } from 'react'
import { Lock, User, Bell, Trash2 } from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState({
    name: 'João Silva',
    email: 'joao@example.com',
  })

  const [organization, setOrganization] = useState({
    name: 'Minha Academia',
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Account Settings */}
        <div className="glass-effect p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold">Perfil</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground opacity-50 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">Email não pode ser alterado</p>
            </div>

            <button className="btn-primary w-full">Salvar Alterações</button>
          </div>
        </div>

        {/* Organization Settings */}
        <div className="glass-effect p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold">Organização</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome da Organização</label>
              <input
                type="text"
                value={organization.name}
                onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button className="btn-primary w-full">Salvar Organização</button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-effect p-6 rounded-2xl border-2 border-destructive/30">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="w-6 h-6 text-destructive" />
          <h2 className="text-2xl font-bold text-destructive">Zona de Risco</h2>
        </div>

        <p className="text-muted-foreground mb-4">
          Estas ações são irreversíveis. Proceda com cautela.
        </p>

        <button className="bg-destructive text-destructive-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-80 transition">
          Deletar Conta
        </button>
      </div>

      {/* Coming Soon */}
      <div className="glass-effect p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">Em Breve</h2>
        <div className="space-y-2 text-muted-foreground">
          <p>🚧 Gerenciamento de membros da equipe</p>
          <p>🚧 Integração com redes sociais</p>
          <p>🚧 Notificações e preferências</p>
          <p>🚧 Autenticação de dois fatores (2FA)</p>
        </div>
      </div>
    </div>
  )
}
