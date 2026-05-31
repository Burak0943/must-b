/**
 * supabase.ts  –  Database type definitions
 *
 * Bu dosya, Supabase şemasının (001_initial_schema.sql) birebir
 * TypeScript karşılığıdır. Supabase JS istemcisini generic olarak
 * kullanmak için `Database` tipini import edin:
 *
 *   import { createClient } from '@supabase/supabase-js'
 *   import type { Database } from '@/types/supabase'
 *
 *   const supabase = createClient<Database>(url, key)
 */

// ─────────────────────────────────────────────
// Enum
// ─────────────────────────────────────────────

/** PostgreSQL: public.plan_type */
export type PlanType = 'Free' | 'Core' | 'Pro' | 'Elite' | 'Local'

// ─────────────────────────────────────────────
// Table row shapes
// ─────────────────────────────────────────────

/** public.profiles – tek bir satırın tam hali */
export interface Profile {
  /** UUID — auth.users.id ile birebir eşleşir (PK) */
  id: string
  email: string
  full_name: string | null
  active_plan: PlanType
  /** ISO-8601 timestamp; Free planda null */
  plan_expires_at: string | null
  lemon_squeezy_customer_id: string | null
  created_at: string
  updated_at: string
  node_name?: string | null
  avatar_url?: string | null
  plan_level?: string | null
}

/** public.user_usage – tek bir satırın tam hali */
export interface UserUsage {
  /** UUID — profiles.id'ye foreign key (PK) */
  user_id: string
  monthly_token_quota: number
  used_token_count: number
  /** ISO-8601 timestamp; kotanın hangi tarihte sıfırlandığı */
  reset_date: string
  created_at: string
  updated_at: string
}

// ─────────────────────────────────────────────
// Insert / Update payload types
// (otomatik doldurulan alanlar opsiyonel)
// ─────────────────────────────────────────────

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'> & {
  active_plan?: PlanType
  plan_expires_at?: string | null
  lemon_squeezy_customer_id?: string | null
}

export type ProfileUpdate = Partial<
  Pick<
    Profile,
    | 'email'
    | 'full_name'
    | 'active_plan'
    | 'plan_expires_at'
    | 'lemon_squeezy_customer_id'
  >
>

export type UserUsageInsert = {
  user_id: string
  reset_date: string
  monthly_token_quota?: number
  used_token_count?: number
}

export type UserUsageUpdate = Partial<
  Pick<UserUsage, 'monthly_token_quota' | 'used_token_count' | 'reset_date'>
>

// ─────────────────────────────────────────────
// Supabase Database generic type
// createClient<Database>(...) için kullanılır
// ─────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      user_usage: {
        Row: UserUsage
        Insert: UserUsageInsert
        Update: UserUsageUpdate
      }
    }
    Enums: {
      plan_type: PlanType
    }
    Functions: Record<string, never>
  }
}

// ─────────────────────────────────────────────
// Convenience helpers
// ─────────────────────────────────────────────

/** Plan türüne göre aylık token kotası (iş mantığı sabitleri) */
export const PLAN_QUOTA: Record<PlanType, number> = {
  Free:  50_000,
  Core:  500_000,
  Pro:   2_000_000,
  Elite: 10_000_000,
  Local: 0,            // Sınırsız / yerel model; 0 = kota uygulanmaz
} as const

/** Kullanıcının kotasının tükenip tükenmediğini kontrol eder */
export function isQuotaExceeded(usage: UserUsage): boolean {
  const quota = usage.monthly_token_quota
  if (quota === 0) return false           // Local plan: sınırsız
  return usage.used_token_count >= quota
}

/** Kalan token sayısını döner (Local plan için null) */
export function remainingTokens(usage: UserUsage): number | null {
  if (usage.monthly_token_quota === 0) return null
  return Math.max(0, usage.monthly_token_quota - usage.used_token_count)
}
