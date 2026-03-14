'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader } from 'lucide-react'
import useSWR from 'swr'

interface Athlete {
  id: string
  name: string
}

export default function NewDietPage() {
  const router = useRouter()
  const [organizationId, setOrganizationId] = useState<string>('')
  const [formData, setFormData] = useState({
    athleteId: '',
    type: 'maintenance',
    dietName: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  React.useEffect(() => {
    const id = sessionStorage.getItem('organizationId') || 'default-org'
    setOrganizationId(id)
  }, [])

  const { data: athletes = [] } = useSWR(
    organizationId ? `/api/athletes?organizationId=${organizationId}` : null,
    (url) => fetch(url).then((res) => res.json())
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/diets/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athleteId: formData.athleteId,
          organizationId,
          type: formData.type,
          dietName: formData.dietName,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erro ao gerar dieta')
      }

      router.push('/dashboard/diets')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Link href="/dashboard/diets" className="flex items-center gap-2 text-accent hover:underline">
        <ArrowLeft className="w-5 h-5" /> Voltar para Dietas
      </Link>

      <div className="glass-effect p-8 rounded-2xl max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Gerar Nova Dieta com IA</h1>
        <p className="text-muted-foreground mb-8">
          Nossa IA analisará os dados do atleta e gerará um plano nutricional personalizado.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Selecione o Atleta *</label>
            <select
              required
              value={formData.athleteId}
              onChange={(e) => setFormData({ ...formData, athleteId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Escolha um atleta --</option>
              {athletes.map((athlete: Athlete) => (
                <option key={athlete.id} value={athlete.id}>
                  {athlete.name}
                </option>
              ))}
            </select>
            {athletes.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Nenhum atleta cadastrado.{' '}
                <Link href="/dashboard/athletes/new" className="text-accent hover:underline">
                  Criar atleta
                </Link>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Dieta *</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="maintenance">Manutenção</option>
              <option value="cutting">Corte (Perda de Peso)</option>
              <option value="bulking">Ganho de Massa</option>
              <option value="recomposition">Recomposição Corporal</option>
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              Escolha o objetivo nutricional para o atleta
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nome da Dieta (Opcional)</label>
            <input
              type="text"
              value={formData.dietName}
              onChange={(e) => setFormData({ ...formData, dietName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: Dieta Pré-Competição"
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading || !formData.athleteId}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Loader className="w-5 h-5 animate-spin" />}
              {isLoading ? 'Gerando Dieta...' : 'Gerar Dieta com IA'}
            </button>
            <Link href="/dashboard/diets" className="btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>

        <div className="mt-8 p-4 bg-primary/10 border border-primary rounded-lg">
          <h3 className="font-semibold mb-2">Como Funciona?</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>✓ Analisamos os dados do atleta (peso, altura, objetivo)</li>
            <li>✓ IA gera um plano nutricional personalizado</li>
            <li>✓ Inclui macronutrientes calculados e refeições sugeridas</li>
            <li>✓ Válido por 30 dias e pode ser atualizado a qualquer momento</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
