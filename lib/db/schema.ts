import { 
  pgTable, 
  pgEnum,
  text, 
  varchar, 
  integer, 
  decimal, 
  boolean,
  timestamp, 
  uuid,
  json,
  index,
  foreignKey,
  uniqueIndex,
  check,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'coach', 'athlete', 'viewer'])
export const subscriptionTierEnum = pgEnum('subscription_tier', ['free', 'pro', 'enterprise'])
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'canceled', 'past_due', 'trialing'])
export const dietTypeEnum = pgEnum('diet_type', ['maintenance', 'cutting', 'bulking', 'recomposition'])

// Users Table
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    avatar: text('avatar'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
  })
)

// Organizations Table
export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description'),
    logo: text('logo'),
    createdById: uuid('created_by_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    createdByIdFk: foreignKey({
      columns: [table.createdById],
      foreignColumns: [users.id],
    }),
    slugIdx: uniqueIndex('organizations_slug_idx').on(table.slug),
  })
)

// Organization Members Table
export const organizationMembers = pgTable(
  'organization_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull(),
    userId: uuid('user_id').notNull(),
    role: userRoleEnum('role').default('viewer').notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdFk: foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
    }),
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
    orgUserIdx: uniqueIndex('org_members_org_user_idx').on(table.organizationId, table.userId),
  })
)

// Athletes Table
export const athletes = pgTable(
  'athletes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull(),
    userId: uuid('user_id'),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }),
    age: integer('age'),
    weight: decimal('weight', { precision: 6, scale: 2 }),
    height: decimal('height', { precision: 5, scale: 2 }),
    targetWeight: decimal('target_weight', { precision: 6, scale: 2 }),
    sport: varchar('sport', { length: 100 }).default('jiu-jitsu'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    orgIdFk: foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
    }),
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
    orgAthletesIdx: index('athletes_org_id_idx').on(table.organizationId),
  })
)

// Diets Table
export const diets = pgTable(
  'diets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    athleteId: uuid('athlete_id').notNull(),
    organizationId: uuid('organization_id').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    type: dietTypeEnum('type').notNull(),
    dailyCalories: integer('daily_calories').notNull(),
    protein: decimal('protein', { precision: 5, scale: 2 }),
    carbs: decimal('carbs', { precision: 5, scale: 2 }),
    fat: decimal('fat', { precision: 5, scale: 2 }),
    meals: json('meals').default([]),
    notes: text('notes'),
    generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow().notNull(),
    validUntil: timestamp('valid_until', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    athleteIdFk: foreignKey({
      columns: [table.athleteId],
      foreignColumns: [athletes.id],
    }),
    orgIdFk: foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
    }),
    athleteDietsIdx: index('diets_athlete_id_idx').on(table.athleteId),
  })
)

// Progress Records Table
export const progressRecords = pgTable(
  'progress_records',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    athleteId: uuid('athlete_id').notNull(),
    organizationId: uuid('organization_id').notNull(),
    weight: decimal('weight', { precision: 6, scale: 2 }).notNull(),
    bodyFatPercentage: decimal('body_fat_percentage', { precision: 5, scale: 2 }),
    notes: text('notes'),
    recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    athleteIdFk: foreignKey({
      columns: [table.athleteId],
      foreignColumns: [athletes.id],
    }),
    orgIdFk: foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
    }),
    athleteProgressIdx: index('progress_records_athlete_id_idx').on(table.athleteId),
  })
)

// Subscriptions Table
export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull().unique(),
    tier: subscriptionTierEnum('tier').default('free').notNull(),
    status: subscriptionStatusEnum('status').default('trialing').notNull(),
    stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).unique(),
    stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }).unique(),
    currentPeriodStart: timestamp('current_period_start', { withTimezone: true }),
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
    canceledAt: timestamp('canceled_at', { withTimezone: true }),
    trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdFk: foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
    }),
  })
)

// Audit Logs Table
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull(),
    userId: uuid('user_id'),
    action: varchar('action', { length: 100 }).notNull(),
    entity: varchar('entity', { length: 100 }).notNull(),
    entityId: uuid('entity_id'),
    changes: json('changes'),
    ipAddress: varchar('ip_address', { length: 45 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdFk: foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
    }),
    userIdFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
    orgLogsIdx: index('audit_logs_org_id_idx').on(table.organizationId),
  })
)

// Zod Schemas
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)
export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

export const insertOrganizationSchema = createInsertSchema(organizations)
export const selectOrganizationSchema = createSelectSchema(organizations)
export type Organization = typeof organizations.$inferSelect
export type InsertOrganization = typeof organizations.$inferInsert

export const insertAthleteSchema = createInsertSchema(athletes)
export const selectAthleteSchema = createSelectSchema(athletes)
export type Athlete = typeof athletes.$inferSelect
export type InsertAthlete = typeof athletes.$inferInsert

export const insertDietSchema = createInsertSchema(diets)
export const selectDietSchema = createSelectSchema(diets)
export type Diet = typeof diets.$inferSelect
export type InsertDiet = typeof diets.$inferInsert

export const insertProgressSchema = createInsertSchema(progressRecords)
export const selectProgressSchema = createSelectSchema(progressRecords)
export type ProgressRecord = typeof progressRecords.$inferSelect
export type InsertProgress = typeof progressRecords.$inferInsert

export const insertSubscriptionSchema = createInsertSchema(subscriptions)
export const selectSubscriptionSchema = createSelectSchema(subscriptions)
export type Subscription = typeof subscriptions.$inferSelect
export type InsertSubscription = typeof subscriptions.$inferInsert
