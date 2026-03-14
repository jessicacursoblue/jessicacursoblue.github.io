import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { subscriptions, organizations } from '@/lib/db/schema'
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

export async function POST(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
    }

    const { organizationId, priceId } = await request.json()

    if (!organizationId || !priceId) {
      return NextResponse.json(
        { message: 'organizationId e priceId são obrigatórios' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, organizationId))

    let stripeCustomerId = subscription?.stripeCustomerId

    if (!stripeCustomerId) {
      // Create new customer
      const customer = await stripe.customers.create({
        metadata: {
          organizationId,
          userId: user.id,
        },
      })
      stripeCustomerId = customer.id
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error) {
    console.error('[v0] Checkout error:', error)
    return NextResponse.json(
      { message: 'Erro ao criar sessão de checkout' },
      { status: 500 }
    )
  }
}
