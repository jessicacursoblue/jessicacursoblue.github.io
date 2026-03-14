import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

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

export async function GET(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json(
        { message: 'organizationId é obrigatório' },
        { status: 400 }
      )
    }

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, organizationId))

    if (!subscription) {
      return NextResponse.json(
        {
          tier: 'free',
          status: 'trialing',
          currentPeriodEnd: null,
        },
        { status: 200 }
      )
    }

    let stripeSubscription = null
    if (subscription.stripeSubscriptionId) {
      stripeSubscription = await stripe.subscriptions.retrieve(
        subscription.stripeSubscriptionId
      )
    }

    return NextResponse.json(
      {
        ...subscription,
        stripeSubscription,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error fetching subscription:', error)
    return NextResponse.json(
      { message: 'Erro ao buscar informações de assinatura' },
      { status: 500 }
    )
  }
}
