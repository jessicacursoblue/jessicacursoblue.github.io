import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { athletes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET!

function extractUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null

  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string }
  } catch {
    return null
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = extractUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    const [athlete] = await db
      .select()
      .from(athletes)
      .where(eq(athletes.id, id))

    if (!athlete) {
      return NextResponse.json(
        { message: 'Atleta não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(athlete, { status: 200 })
  } catch (error) {
    console.error('[v0] Error fetching athlete:', error)
    return NextResponse.json(
      { message: 'Erro ao buscar atleta' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = extractUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const updates = await request.json()

    const [updated] = await db
      .update(athletes)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(athletes.id, id))
      .returning()

    if (!updated) {
      return NextResponse.json(
        { message: 'Atleta não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error('[v0] Error updating athlete:', error)
    return NextResponse.json(
      { message: 'Erro ao atualizar atleta' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = extractUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params

    // Soft delete
    const [deleted] = await db
      .update(athletes)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(athletes.id, id))
      .returning()

    if (!deleted) {
      return NextResponse.json(
        { message: 'Atleta não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Atleta deletado com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error deleting athlete:', error)
    return NextResponse.json(
      { message: 'Erro ao deletar atleta' },
      { status: 500 }
    )
  }
}
