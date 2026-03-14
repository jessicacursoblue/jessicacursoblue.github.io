# Stripe Integration Guide

## Overview

This guide will help you complete the Stripe integration for NutriAthlete AI's billing system.

## Prerequisites

- Stripe account ([stripe.com](https://stripe.com))
- Production and test environments

## Step 1: Create Stripe Products and Prices

### 1.1 Login to Stripe Dashboard

Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)

### 1.2 Create Products

1. Navigate to **Products** → **Add product**
2. Create three products:

**Product 1: Pro Plan**
- Name: "NutriAthlete AI - Pro"
- Description: "Professional coaching plan with unlimited athletes"
- Click **Create product**

**Product 2: Enterprise Plan**
- Name: "NutriAthlete AI - Enterprise"
- Description: "Custom enterprise solution"
- Click **Create product**

### 1.3 Create Prices

For each product, add pricing:

**Pro Plan Price**
- Amount: 99.00 BRL
- Billing period: Monthly
- Currency: BRL (Brazilian Real)
- Copy the **Price ID** (format: `price_xxxxx`)

**Enterprise Plan Price**
- Create as custom/variable pricing for quote-based sales
- Copy the **Price ID**

## Step 2: Get Your API Keys

1. Go to **Developers** → **API Keys**
2. Copy your credentials:
   - **Publishable Key**: `pk_test_xxxxx` or `pk_live_xxxxx`
   - **Secret Key**: `sk_test_xxxxx` or `sk_live_xxxxx`

## Step 3: Setup Webhook

### 3.1 Create Webhook Endpoint

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your endpoint URL: `https://yourdomain.com/api/billing/webhook`
4. Events to subscribe to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`

5. Copy the **Signing secret** (format: `whsec_xxxxx`)

### 3.2 Local Testing with Stripe CLI

For development, use Stripe CLI to test webhooks locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# or download from https://stripe.com/docs/stripe-cli

# Authenticate
stripe login

# Listen for events locally
stripe listen --forward-to localhost:3000/api/billing/webhook

# Copy the webhook signing secret displayed
```

## Step 4: Configure Environment Variables

Update your `.env.local`:

```env
# Stripe Keys
STRIPE_PUBLIC_KEY=pk_test_xxxxx  # or pk_live_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx  # or sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# For webhook testing locally
STRIPE_WEBHOOK_SECRET_LOCAL=whsec_xxxxx  # from stripe listen
```

## Step 5: Update Price IDs

Open `config/pricing.ts` and update the Stripe price IDs:

```typescript
stripe: {
  priceId: 'price_1234567890',  // From your Pro plan
  productId: 'prod_1234567890',
}
```

## Step 6: Test the Integration

### 6.1 Test Registration and Billing Page

```bash
npm run dev
```

1. Register at `http://localhost:3000/auth/register`
2. Go to `/dashboard/billing`
3. Try upgrading to Pro plan

### 6.2 Use Test Card Numbers

Stripe provides test card numbers for different scenarios:

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Card declined |
| 4000 0025 0000 3155 | Requires 3D Secure |

Expiry: Any future date
CVC: Any 3-digit code

### 6.3 Monitor Events

With Stripe CLI listening:

```bash
stripe listen --forward-to localhost:3000/api/billing/webhook
```

You should see events in your terminal when:
- Checkout session created
- Subscription updated
- Payment processed

## Step 7: Database Sync

After the webhook processes events, check your database:

```bash
npm run db:studio
```

You should see subscription records updated with:
- `stripeCustomerId`
- `stripeSubscriptionId`
- `tier` (free → pro)
- `status` (active)

## Step 8: Production Deployment

### 8.1 Switch to Production Keys

1. In Stripe Dashboard, toggle "View test data" OFF
2. Copy production keys
3. Update environment variables in production

### 8.2 Update Webhook

1. Create production webhook endpoint
2. Subscribe to same events
3. Update webhook secret in production environment

### 8.3 Verify Configuration

```bash
# Test production webhook
curl https://yourdomain.com/api/billing/webhook \
  -H "stripe-signature: xxx"
```

## Step 9: Implement Additional Features

### 9.1 Billing Portal

Allow users to manage subscriptions:

```typescript
// app/api/billing/portal/route.ts
const session = await stripe.billingPortal.sessions.create({
  customer: stripeCustomerId,
  return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
})
```

### 9.2 Invoice Management

Add invoice tracking and download functionality.

### 9.3 Refund Handling

Implement refund logic for cancellations within 30 days.

## Troubleshooting

### Webhook Not Triggering

1. Verify endpoint URL is correct
2. Check webhook signing secret
3. Ensure events are subscribed
4. Check server logs for errors

### Payment Failed

1. Check card details
2. Verify amount and currency
3. Check customer metadata
4. Review Stripe logs

### Price ID Not Found

1. Verify price ID format
2. Ensure product is active
3. Check staging vs production confusion

## Security Best Practices

- ✅ Never commit API keys to git
- ✅ Use environment variables
- ✅ Validate webhook signatures
- ✅ Use HTTPS in production
- ✅ Rotate API keys regularly
- ✅ Monitor for suspicious activity

## Resources

- [Stripe Docs](https://stripe.com/docs)
- [Stripe CLI Docs](https://stripe.com/docs/stripe-cli)
- [Webhook Events](https://stripe.com/docs/api/events)
- [Testing](https://stripe.com/docs/testing)
- [Billing Cycles](https://stripe.com/docs/billing/subscriptions/billing-cycle)

## Support

For Stripe-specific issues:
- Email: support@stripe.com
- Chat: stripe.com/contact
- GitHub: stripe-samples/stripe-node

For NutriAthlete issues:
- Email: jessica@nutriathlete.ai
- GitHub Issues: jessicacursoblue/jessicacursoblue.github.io
