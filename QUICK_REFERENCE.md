# Quick Reference - NutriAthlete AI Developer Guide

## Essential Commands

```bash
# Development
npm run dev                 # Start development server (http://localhost:3000)
npm run build               # Build for production
npm run start               # Start production server
npm run lint                # Run ESLint

# Database
npm run db:push             # Sync schema with database
npm run db:migrate          # Run migrations
npm run db:studio           # Open visual database editor
```

## Project Structure at a Glance

```
app/                        # Next.js App Router
├── (auth)/                 # Public auth pages
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/            # Protected dashboard
│   ├── athletes/
│   ├── diets/
│   ├── billing/
│   └── settings/
├── api/                    # API endpoints
│   ├── auth/
│   ├── athletes/
│   ├── diets/
│   └── billing/
└── page.tsx               # Landing page

lib/
├── auth/                  # Authentication
├── db/                    # Database
├── env.ts                 # Environment config
└── db/schema.ts           # Drizzle schema

config/
└── pricing.ts             # Pricing tiers

public/                    # Static assets
```

## Key Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Athletes
- `GET /api/athletes?organizationId=xxx` - List
- `POST /api/athletes` - Create
- `GET /api/athletes/[id]` - Get one
- `PUT /api/athletes/[id]` - Update
- `DELETE /api/athletes/[id]` - Delete

### Diets
- `POST /api/diets/generate` - Generate with AI
- `GET /api/diets?organizationId=xxx` - List

### Billing
- `POST /api/billing/checkout` - Create checkout
- `GET /api/billing/subscription` - Get subscription
- `POST /api/billing/webhook` - Stripe webhook

## Environment Variables

```env
# Required
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=... (min 32 chars, generate with: openssl rand -base64 32)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional
AI_GATEWAY_API_KEY=...
NEXT_PUBLIC_API_URL=...
```

## Common Tasks

### Add a New API Endpoint

1. Create file: `app/api/[resource]/route.ts`
2. Import JWT verification:
```typescript
import jwt from 'jsonwebtoken'

function extractUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET!)
  } catch {
    return null
  }
}
```
3. Create handler (GET, POST, etc)
4. Return JSON responses

### Add a New Database Table

1. Add to `lib/db/schema.ts`:
```typescript
export const newTable = pgTable('new_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  // ... other fields
})
```
2. Run `npm run db:push`
3. Update API endpoints

### Add a New Page

1. Create folder: `app/(dashboard)/[feature]/`
2. Add `page.tsx` with `'use client'` at top
3. Use SWR for data fetching:
```typescript
import useSWR from 'swr'
const { data, isLoading } = useSWR('/api/endpoint', 
  url => fetch(url).then(r => r.json())
)
```

### Add Authentication Check

```typescript
// In API routes
const user = extractUserFromRequest(request)
if (!user) {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
}

// In components (client-side)
// Middleware handles redirects automatically
```

## Database Schema Quick View

| Table | Purpose |
|-------|---------|
| `users` | User accounts |
| `organizations` | Workspaces/teams |
| `organization_members` | User-org membership |
| `athletes` | Athlete profiles |
| `diets` | Generated meal plans |
| `progress_records` | Weight/metrics tracking |
| `subscriptions` | Billing info |
| `audit_logs` | Change tracking |

## Design System

### Colors (CSS Variables)
```css
--background: #0f172a (dark blue)
--foreground: #f8fafc (light gray)
--primary: #10b981 (green)
--accent: #00ffae (neon green)
--secondary: #1e3a43 (medium blue)
--destructive: #ef4444 (red)
```

### Components
```tsx
// Glass effect
<div className="glass-effect p-6 rounded-2xl">

// Primary button
<button className="btn-primary">Click me</button>

// Secondary button
<button className="btn-secondary">Click me</button>

// Form input
<input className="px-4 py-2 rounded-lg bg-input border border-border..." />
```

## Common Issues & Solutions

### "auth-token not found"
- Check middleware.ts - might be intercepting
- Verify auth/register or auth/login endpoints were called
- Check browser cookies in DevTools

### "organizationId is required"
- Set in sessionStorage before making requests
- Or pass from URL params
- Dashboard layout should set it on login

### Database migrations fail
- Check `DATABASE_URL` is correct
- Verify PostgreSQL is running
- Run `npm run db:push` instead of migrate

### Stripe webhook not firing
- Verify endpoint URL is correct in Stripe dashboard
- Check webhook signing secret matches
- Use Stripe CLI for local testing: `stripe listen`

### AI API not working
- Verify `STRIPE_SECRET_KEY` is set
- Check OpenAI has credits
- Look for rate limiting (429 errors)

## Testing Workflows

### Test Registration to Billing
1. Go to `/auth/register`
2. Create account
3. Navigate to `/dashboard`
4. Go to `/dashboard/athletes/new`
5. Create athlete
6. Go to `/dashboard/diets/new`
7. Generate diet
8. Go to `/dashboard/billing`
9. Try upgrade

### Test Stripe Locally
```bash
# Terminal 1
npm run dev

# Terminal 2
stripe login
stripe listen --forward-to localhost:3000/api/billing/webhook

# In app, try checkout
# Check terminal 2 for webhook events
```

## Performance Tips

- Use SWR for automatic revalidation
- Lazy load components with dynamic()
- Optimize images with Next.js Image
- Database indexes on organizationId
- Cache with Redis (future enhancement)

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Configure PostgreSQL/Supabase
- [ ] Setup Stripe (see STRIPE_SETUP.md)
- [ ] Configure webhook in Stripe
- [ ] Test authentication flow
- [ ] Test payment flow
- [ ] Enable HTTPS
- [ ] Setup monitoring (Sentry)
- [ ] Configure backups
- [ ] Test disaster recovery

## Useful Links

- Docs: See `*.md` files in root
- API Reference: `API.md`
- Database Schema: `DATABASE.md`
- Setup Guide: `SETUP.md`
- Stripe Integration: `STRIPE_SETUP.md`

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
# After review, merge to main
```

## Code Style Guide

- Use TypeScript for type safety
- Use 2-space indentation
- Use single quotes for strings
- Use arrow functions
- Separate concerns (API, UI, logic)
- Add error handling to all requests
- Log with `console.log('[v0] ...')`
- Use semantic HTML
- Add alt text to images

## Monitoring & Debugging

```typescript
// Log for debugging
console.log('[v0] Debug message:', variable)

// API responses
console.error('[v0] Error:', error)

// Database queries
// Enable in Drizzle: `db._.client.logger(true)`
```

Check logs in:
- Browser console (client-side)
- Terminal (server-side)
- Vercel dashboard (production)
- Sentry (error tracking)

## Version Info

- Next.js: 16.0
- React: 19.0
- TypeScript: 5.3
- Tailwind CSS: 3.4
- PostgreSQL: 14+
- Node.js: 18+ (20+ recommended)

---

**Quick Start**: `npm install` → `npm run dev` → Go to `http://localhost:3000`

**Questions?** Check `SETUP.md` or `API.md` or open an issue on GitHub
