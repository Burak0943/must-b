-- ============================================================
-- Migration: 001_initial_schema
-- Description: Subscription & usage quota architecture
--              Enum, profiles, user_usage tables + RLS policies
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. ENUM: plan_type
-- ─────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.plan_type AS ENUM (
    'Free',
    'Core',
    'Pro',
    'Elite',
    'Local'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL; -- Idempotent: migrasyon tekrar çalışırsa hata verme
END $$;

-- ─────────────────────────────────────────────
-- 2. TABLE: profiles
--    auth.users ile 1-1 ilişki
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  -- Supabase Auth kullanıcısıyla birebir eşleşen primary key
  id                        UUID             PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email                     TEXT             NOT NULL,
  full_name                 TEXT,                                        -- nullable
  active_plan               public.plan_type NOT NULL DEFAULT 'Free',
  plan_expires_at           TIMESTAMPTZ,                                 -- nullable (Free için NULL)
  lemon_squeezy_customer_id TEXT,                                        -- nullable
  created_at                TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 3. TABLE: user_usage
--    Token kotası ve kullanım takibi
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_usage (
  user_id             UUID        PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  monthly_token_quota BIGINT      NOT NULL DEFAULT 0,
  used_token_count    BIGINT      NOT NULL DEFAULT 0,
  reset_date          TIMESTAMPTZ NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Soft guard: negatif değer engellensin (kotayı aşma kontrolü business logic'te)
  CONSTRAINT used_lte_quota    CHECK (used_token_count    >= 0),
  CONSTRAINT quota_non_negative CHECK (monthly_token_quota >= 0)
);

-- ─────────────────────────────────────────────
-- 4. FUNCTIONS & TRIGGERS
--    Her iki tablo da mevcut olduktan sonra tanımla
-- ─────────────────────────────────────────────

-- updated_at'ı otomatik güncelleyen paylaşımlı trigger fonksiyonu
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS user_usage_updated_at ON public.user_usage;
CREATE TRIGGER user_usage_updated_at
  BEFORE UPDATE ON public.user_usage
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Yeni bir auth.users satırı oluşturulduğunda hem profili hem kotayı kur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- 1. Profili oluştur
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  )
  ON CONFLICT (id) DO NOTHING;

  -- 2. Kullanım kotası (user_usage) satırını otomatik oluştur (Varsayılan Free plan kotası ile)
  INSERT INTO public.user_usage (user_id, monthly_token_quota, used_token_count, reset_date)
  VALUES (
    NEW.id,
    0,   -- Free planda merkezi proxy kotası yok (0). BYOK (Kendi API anahtarı) geçerli.
    0,
    NOW() + INTERVAL '1 month'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

-- --- profiles ---
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Kullanıcı sadece kendi profilini görebilir
CREATE POLICY "profiles: user can select own row"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Kullanıcı sadece kendi profilini güncelleyebilir
CREATE POLICY "profiles: user can update own row"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT, trigger tarafından (SECURITY DEFINER) yapıldığı için kullanıcıya açık değil.
-- Service Role (backend / Supabase Functions) her şeye erişir — bu RLS dışı davranıştır.

-- --- user_usage ---
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- Kullanıcı sadece kendi kotasını görebilir
CREATE POLICY "user_usage: user can select own row"
  ON public.user_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Kullanıcı kendi kotasını güncelleyebilir
-- (Gerçek artırım genelde service role / edge function üzerinden yapılmalı)
CREATE POLICY "user_usage: user can update own row"
  ON public.user_usage FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 6. INDEXES (performans)
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_email        ON public.profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_active_plan  ON public.profiles (active_plan);
CREATE INDEX IF NOT EXISTS idx_user_usage_reset_date ON public.user_usage (reset_date);
