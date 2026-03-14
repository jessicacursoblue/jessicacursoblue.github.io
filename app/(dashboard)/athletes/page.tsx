'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import useSWR from 'swr'

interface Athlete {
  id: string
  name: string
  email?: string
  age?: number
  weight?: string
  height?: string
  sport?: string
  createdAt: string
}

export default function AthletesPage() {
  const [organizationId, setOrganizationId] = useState<string>('')

  useEffect(() => {
    // In a real app, get organizationId from user context
    const id = sessionStorage.getItem('organizationId') || 'default-org'
    setOrganizationId(id)
  }, [])

  const { data: athletes = [], isLoading, error } = useSWR(
    organizationId ? `/api/athletes?organizationId=${organizationId}` : null,
    (url) => fetch(url).then((res) => res.json())
  )

  async function deleteAthlete(id: string) {
    if (!confirm('Tem certeza que deseja deletar este atleta?')) return

    try {
      const response = await fetch(`/api/athletes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('[v0] Error deleting athlete:', error)
      alert('Erro ao deletar atleta')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Atletas</h1>
          <p className="text-muted-foreground">Gerencie todos os seus atletas em um só lugar</p>
        </div>
        <Link href="/dashboard/athletes/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Adicionar Atleta
        </Link>
      </div>

      {isLoading ? (
        <div className="glass-effect p-8 rounded-2xl text-center">
          <p className="text-muted-foreground">Carregando atletas...</p>
        </div>
      ) : error ? (
        <div className="glass-effect p-8 rounded-2xl text-center">
          <p className="text-destructive">Erro ao carregar atletas</p>
        </div>
      ) : athletes.length === 0 ? (
        <div className="glass-effect p-12 rounded-2xl text-center">
          <p className="text-muted-foreground mb-4">Nenhum atleta cadastrado ainda</p>
          <Link href="/dashboard/athletes/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" /> Criar primeiro atleta
          </Link>
        </div>
      ) : (
        <div className="glass-effect rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-black/20">
                <tr>
                  <th className="text-left p-4 font-semibold">Nome</th>
                  <th className="text-left p-4 font-semibold">Email</th>
                  <th className="text-left p-4 font-semibold">Peso</th>
                  <th className="text-left p-4 font-semibold">Esporte</th>
                  <th className="text-left p-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {athletes.map((athlete: Athlete, i: number) => (
                  <tr key={athlete.id} className="border-b border-border last:border-0 hover:bg-white/[0.05]">
                    <td className="p-4 font-medium">{athlete.name}</td>
                    <td className="p-4 text-muted-foreground">{athlete.email || '-'}</td>
                    <td className="p-4 text-muted-foreground">{athlete.weight ? `${athlete.weight}kg` : '-'}</td>
                    <td className="p-4 text-muted-foreground">{athlete.sport || 'Jiu-Jitsu'}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/athletes/${athlete.id}`}
                          className="p-2 hover:bg-white/[0.1] rounded transition"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/dashboard/athletes/${athlete.id}/edit`}
                          className="p-2 hover:bg-white/[0.1] rounded transition"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteAthlete(athlete.id)}
                          className="p-2 hover:bg-destructive/20 rounded transition text-destructive"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
