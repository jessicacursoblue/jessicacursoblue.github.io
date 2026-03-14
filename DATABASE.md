# Database Schema - NutriAthlete AI

## Overview

NutriAthlete AI uses PostgreSQL with a multi-tenant architecture. The database is designed for data isolation, scalability, and compliance.

## Entity Relationship Diagram

```
users (1) ──────────────────── (1) organizations
                                      │
                              (1) ────┼──── (M) organization_members
                                      │
                              (1) ────┼──── (M) athletes
                                               │
                                        (1) ───┼─── (M) diets
                                        (1) ───┼─── (M) progress_records
                              
                              (1) ────┼──── (1) subscriptions
                              (1) ────┼──── (M) audit_logs
```

## Tables

### users
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| `passwordHash` | VARCHAR(255) | NOT NULL | Bcrypted password |
| `name` | VARCHAR(255) | NOT NULL | User full name |
| `avatar` | TEXT | | URL to profile picture |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Account creation date |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes**:
- UNIQUE INDEX on `email`

---

### organizations
Represents workspaces/teams (coaches, clinics, gyms).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `name` | VARCHAR(255) | NOT NULL | Organization name |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| `description` | TEXT | | Organization description |
| `logo` | TEXT | | Logo URL |
| `createdById` | UUID | FK(users.id) | Creator user ID |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Creation date |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last update date |
| `deletedAt` | TIMESTAMP | | Soft delete timestamp |

**Indexes**:
- UNIQUE INDEX on `slug`
- Foreign Key: `createdById` → `users.id`

---

### organization_members
Maps users to organizations with roles (multi-tenant membership).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `organizationId` | UUID | FK(organizations.id) | Organization reference |
| `userId` | UUID | FK(users.id) | User reference |
| `role` | ENUM | DEFAULT 'viewer' | Member role (admin, coach, athlete, viewer) |
| `joinedAt` | TIMESTAMP | DEFAULT NOW() | Join date |

**Indexes**:
- UNIQUE INDEX on (`organizationId`, `userId`)
- Foreign Keys: `organizationId`, `userId`

---

### athletes
Stores athlete profiles managed by organizations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `organizationId` | UUID | FK(organizations.id) | Organization reference |
| `userId` | UUID | FK(users.id) | Associated user (if athlete has account) |
| `name` | VARCHAR(255) | NOT NULL | Athlete name |
| `email` | VARCHAR(255) | | Athlete email |
| `age` | INTEGER | | Athlete age |
| `weight` | DECIMAL(6,2) | | Current weight in kg |
| `height` | DECIMAL(5,2) | | Height in cm |
| `targetWeight` | DECIMAL(6,2) | | Goal weight in kg |
| `sport` | VARCHAR(100) | DEFAULT 'jiu-jitsu' | Primary sport |
| `notes` | TEXT | | Additional information |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Creation date |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last update date |
| `deletedAt` | TIMESTAMP | | Soft delete timestamp |

**Indexes**:
- INDEX on `organizationId`
- Foreign Keys: `organizationId`, `userId`

---

### diets
Stores AI-generated diet plans.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `athleteId` | UUID | FK(athletes.id) | Associated athlete |
| `organizationId` | UUID | FK(organizations.id) | Organization reference |
| `name` | VARCHAR(255) | NOT NULL | Diet plan name |
| `type` | ENUM | NOT NULL | Type (maintenance, cutting, bulking, recomposition) |
| `dailyCalories` | INTEGER | NOT NULL | Daily calorie target |
| `protein` | DECIMAL(5,2) | | Daily protein in grams |
| `carbs` | DECIMAL(5,2) | | Daily carbs in grams |
| `fat` | DECIMAL(5,2) | | Daily fat in grams |
| `meals` | JSON | DEFAULT '[]' | Meal details and suggestions |
| `notes` | TEXT | | Additional notes |
| `generatedAt` | TIMESTAMP | DEFAULT NOW() | Generation date |
| `validUntil` | TIMESTAMP | | Diet expiration date |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Creation date |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last update date |
| `deletedAt` | TIMESTAMP | | Soft delete timestamp |

**Indexes**:
- INDEX on `athleteId`
- Foreign Keys: `athleteId`, `organizationId`

**JSON Structure Example**:
```json
[
  {
    "name": "Café da Manhã",
    "foods": ["Ovos", "Pão integral", "Café"],
    "calories": 600
  },
  {
    "name": "Almoço",
    "foods": ["Frango", "Arroz", "Brócolis"],
    "calories": 800
  }
]
```

---

### progress_records
Tracks athlete progress over time (weight, body fat, etc).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `athleteId` | UUID | FK(athletes.id) | Associated athlete |
| `organizationId` | UUID | FK(organizations.id) | Organization reference |
| `weight` | DECIMAL(6,2) | NOT NULL | Weight in kg |
| `bodyFatPercentage` | DECIMAL(5,2) | | Body fat percentage |
| `notes` | TEXT | | Additional observations |
| `recordedAt` | TIMESTAMP | DEFAULT NOW() | When measurement was taken |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Record creation date |

**Indexes**:
- INDEX on `athleteId`
- Foreign Keys: `athleteId`, `organizationId`

---

### subscriptions
Manages organization billing and subscription tiers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `organizationId` | UUID | UNIQUE, FK(organizations.id) | Organization reference |
| `tier` | ENUM | DEFAULT 'free' | Subscription tier (free, pro, enterprise) |
| `status` | ENUM | DEFAULT 'trialing' | Status (active, canceled, past_due, trialing) |
| `stripeCustomerId` | VARCHAR(255) | UNIQUE | Stripe customer ID |
| `stripeSubscriptionId` | VARCHAR(255) | UNIQUE | Stripe subscription ID |
| `currentPeriodStart` | TIMESTAMP | | Billing period start |
| `currentPeriodEnd` | TIMESTAMP | | Billing period end |
| `canceledAt` | TIMESTAMP | | Cancellation date |
| `trialEndsAt` | TIMESTAMP | | Free trial end date |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Creation date |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes**:
- Foreign Key: `organizationId`

---

### audit_logs
Records all changes for compliance and debugging.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `organizationId` | UUID | FK(organizations.id) | Organization reference |
| `userId` | UUID | FK(users.id) | User who made change |
| `action` | VARCHAR(100) | NOT NULL | Action performed (create, update, delete) |
| `entity` | VARCHAR(100) | NOT NULL | Entity type (athlete, diet, etc) |
| `entityId` | UUID | | ID of affected entity |
| `changes` | JSON | | Before/after values |
| `ipAddress` | VARCHAR(45) | | User IP address |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Timestamp |

**Indexes**:
- INDEX on `organizationId`
- Foreign Keys: `organizationId`, `userId`

---

## Enums

### user_role
```sql
ENUM ('admin', 'coach', 'athlete', 'viewer')
```

- `admin` - Full access to organization
- `coach` - Can manage athletes and diets
- `athlete` - Can view own data
- `viewer` - Read-only access

### subscription_tier
```sql
ENUM ('free', 'pro', 'enterprise')
```

- `free` - Up to 5 athletes
- `pro` - Unlimited athletes
- `enterprise` - Custom features

### subscription_status
```sql
ENUM ('active', 'canceled', 'past_due', 'trialing')
```

### diet_type
```sql
ENUM ('maintenance', 'cutting', 'bulking', 'recomposition')
```

## Constraints & Security

### Row-Level Security (RLS) Policies

All tables have RLS policies that ensure:
1. Users can only see data from their organizations
2. Athletes can only see their own data
3. Admins have full access within their organization

### Data Retention

- **Soft Deletes**: Records are soft-deleted (marked with `deletedAt`)
- **Permanent Deletion**: After 30 days in trash, records can be permanently deleted
- **Audit Trail**: All changes are logged in `audit_logs`

### Encryption

- Passwords: Bcrypted
- Sensitive fields: Can be encrypted at rest
- In Transit: TLS/HTTPS

## Migrations

Migrations are managed with Drizzle Kit:

```bash
# Create migration
npm run db:migrate

# Push schema to database
npm run db:push

# Open Drizzle Studio (visual editor)
npm run db:studio
```

## Performance Considerations

### Indexes
- Composite indexes on common filter combinations
- Separate indexes for sort operations
- Regular index maintenance

### Partitioning (Future)
- Progress records can be time-partitioned by month
- Audit logs can be partitioned by organization

### Caching
- Athlete lists cached for 5 minutes
- Diet plans cached for 1 hour
- User roles cached in session

## Backup Strategy

- Daily automated backups
- 30-day retention
- Point-in-time recovery available
- Cross-region replication for disaster recovery
