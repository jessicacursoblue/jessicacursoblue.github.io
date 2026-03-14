'use client'

import Link from 'next/link'
import { Plus, Eye, Trash2 } from 'lucide-react'
import useSWR from 'swr'
import { useEffect, useState } from 'react'

interface Diet {
  id: string
  name: string
  type: string
  dailyCalories: number
  athlete?: { name: string }
  generatedAt: string
}

export default function DietsPage() {
  const [organizationId, setOrganizationId] = useState<string>('')

  useEffect(() => {
    const id = sessionStorage.getItem('organizationId') || 'default-org'
    setOrganizationId(id)
  }, [])

  const { data: diets = [], isLoading, error } = useSWR(
    organizationId ? `/api/diets?organizationId=${organizationId}` : null,
    (url) => fetch(url).then((res) => res.json())
  )

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dietas Geradas</h1>
          <p className="text-muted-foreground">Planos nutricionais criados com IA para seus atletas</p>
        </div>
        <Link href="/dashboard/diets/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Gerar Nova Dieta
        </Link>
      </div>

      {isLoading ? (
        <div className="glass-effect p-8 rounded-2xl text-center">
          <p className="text-muted-foreground">Carregando dietas...</p>
        </div>
      ) : error ? (
        <div className="glass-effect p-8 rounded-2xl text-center">
          <p className="text-destructive">Erro ao carregar dietas</p>
        </div>
      ) : diets.length === 0 ? (
        <div className="glass-effect p-12 rounded-2xl text-center">
          <p className="text-muted-foreground mb-4">Nenhuma dieta gerada ainda</p>
          <Link href="/dashboard/diets/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" /> Gerar Primeira Dieta
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diets.map((diet: Diet) => (
            <div key={diet.id} className="glass-effect p-6 rounded-2xl">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-1">{diet.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Tipo: <span className="text-accent">{diet.type}</span>
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg mb-4 space-y-2">
                <p className="text-sm">
                  Calorias Diárias: <span className="font-semibold text-primary">{diet.dailyCalories}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Gerada em {new Date(diet.generatedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/dashboard/diets/${diet.id}`}
                  className="flex-1 btn-secondary text-sm flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" /> Ver
                </Link>
                <button className="p-2 hover:bg-destructive/20 rounded transition text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
