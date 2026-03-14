import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { athletes, organizations } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET!

function extractUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string }
    return decoded
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    // Get organizationId from query
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json(
        { message: 'organizationId é obrigatório' },
        { status: 400 }
      )
    }

    // Fetch athletes for this organization
    const athleteList = await db
      .select()
      .from(athletes)
      .where(
        and(
          eq(athletes.organizationId, organizationId),
          eq(athletes.deletedAt, null)
        )
      )

    return NextResponse.json(athleteList, { status: 200 })
  } catch (error) {
    console.error('[v0] Error fetching athletes:', error)
    return NextResponse.json(
      { message: 'Erro ao buscar atletas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const { name, email, age, weight, height, targetWeight, sport, notes, organizationId } =
      await request.json()

    if (!name || !organizationId) {
      return NextResponse.json(
        { message: 'Nome e organizationId são obrigatórios' },
        { status: 400 }
      )
    }

    // Verify user is part of this organization
    // (In production, verify org membership)

    const [newAthlete] = await db
      .insert(athletes)
      .values({
        organizationId,
        name,
        email,
        age,
        weight,
        height,
        targetWeight,
        sport: sport || 'jiu-jitsu',
        notes,
      })
      .returning()

    return NextResponse.json(newAthlete, { status: 201 })
  } catch (error) {
    console.error('[v0] Error creating athlete:', error)
    return NextResponse.json(
      { message: 'Erro ao criar atleta' },
      { status: 500 }
    )
  }
}
