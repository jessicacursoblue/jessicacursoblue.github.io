import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Map Stripe price IDs to subscription tiers
const priceToTier: Record<string, 'free' | 'pro' | 'enterprise'> = {
  // Configure these with your actual Stripe price IDs
  'price_pro_monthly': 'pro',
  'price_enterprise_monthly': 'enterprise',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ message: 'Missing signature' }, { status: 400 })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('[v0] Webhook signature verification failed:', err)
      return NextResponse.json({ message: 'Signature verification failed' }, { status: 400 })
    }

    console.log('[v0] Processing webhook event:', event.type)

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const stripeSubscription = event.data.object as Stripe.Subscription
        const organizationId = stripeSubscription.metadata?.organizationId

        if (!organizationId) {
          console.error('[v0] No organizationId in subscription metadata')
          break
        }

        const priceId = stripeSubscription.items.data[0]?.price.id
        const tier = priceToTier[priceId] || 'free'

        await db
          .update(subscriptions)
          .set({
            stripeCustomerId: stripeSubscription.customer as string,
            stripeSubscriptionId: stripeSubscription.id,
            tier: tier as any,
            status: (stripeSubscription.status as any) || 'active',
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.organizationId, organizationId))

        break
      }

      case 'customer.subscription.deleted': {
        const stripeSubscription = event.data.object as Stripe.Subscription
        const organizationId = stripeSubscription.metadata?.organizationId

        if (!organizationId) break

        await db
          .update(subscriptions)
          .set({
            status: 'canceled' as any,
            canceledAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.organizationId, organizationId))

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const organizationId = invoice.subscription && 
          typeof invoice.subscription === 'object' 
          ? invoice.subscription.metadata?.organizationId 
          : undefined

        if (!organizationId) break

        await db
          .update(subscriptions)
          .set({
            status: 'past_due' as any,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.organizationId, organizationId))

        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const organizationId = invoice.subscription && 
          typeof invoice.subscription === 'object' 
          ? invoice.subscription.metadata?.organizationId 
          : undefined

        if (!organizationId) break

        await db
          .update(subscriptions)
          .set({
            status: 'active' as any,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.organizationId, organizationId))

        break
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[v0] Webhook error:', error)
    return NextResponse.json(
      { message: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
