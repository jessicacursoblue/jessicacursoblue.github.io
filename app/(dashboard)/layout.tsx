'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Menu, X } from 'lucide-react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    // In a real app, fetch user from auth session
    // For now, just show a placeholder
    setUser({ name: 'Usuário', email: 'user@example.com' })
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-effect-dark border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-accent">
            NutriAthlete AI
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-foreground hover:text-accent transition">
              Dashboard
            </Link>
            <Link href="/dashboard/athletes" className="text-foreground hover:text-accent transition">
              Atletas
            </Link>
            <Link href="/dashboard/diets" className="text-foreground hover:text-accent transition">
              Dietas
            </Link>
            <Link href="/dashboard/settings" className="text-foreground hover:text-accent transition">
              Configurações
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">{user?.name}</div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border p-4 space-y-4">
            <Link href="/dashboard" className="block text-foreground hover:text-accent transition">
              Dashboard
            </Link>
            <Link href="/dashboard/athletes" className="block text-foreground hover:text-accent transition">
              Atletas
            </Link>
            <Link href="/dashboard/diets" className="block text-foreground hover:text-accent transition">
              Dietas
            </Link>
            <Link href="/dashboard/settings" className="block text-foreground hover:text-accent transition">
              Configurações
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left text-muted-foreground hover:text-foreground transition"
            >
              Sair
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
