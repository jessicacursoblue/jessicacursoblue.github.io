import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('auth-token')

    return NextResponse.json(
      { message: 'Logout realizado com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Logout error:', error)
    return NextResponse.json(
      { message: 'Erro ao fazer logout' },
      { status: 500 }
    )
  }
}
