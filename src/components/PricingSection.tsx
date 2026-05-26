/**
 * PricingSection.tsx  —  Must-b Premium Fiyatlandırma Bileşeni
 *
 * Tasarım: Dark Glassmorphism + Emerald/Teal Neon
 * Özellikler:
 *   • Aylık/Yıllık toggle (neon switch)
 *   • 3'lü vitrin (Free, Core, Pro) — Pro neon glow + Most Popular etiketi
 *   • Kurumsal vitrin (Elite + Local) — yatay layout, kalkan/çip ikonu
 *   • Supabase user.id → LemonSqueezy checkout URL parametresi
 *   • Framer Motion staggered fade-in
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Zap, Rocket, Shield, Cpu,
  Check, Star, ArrowRight, Sparkles,
  ChevronRight, Lock, Crown
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

// ─────────────────────────────────────────────
// Sabitler
// ─────────────────────────────────────────────

const LS_BASE = "https://must-b.lemonsqueezy.com/checkout/buy/PLACEHOLDER";

function checkoutUrl(planId: string, user: User | null, isYearly: boolean): string {
  const base = `${LS_BASE}-${planId}${isYearly ? "-yearly" : ""}`;
  if (!user) return base;
  return `${base}?checkout[custom][user_id]=${user.id}`;
}

// ─────────────────────────────────────────────
// Plan Verileri
// ─────────────────────────────────────────────

const MAIN_PLANS = [
  {
    id: "free",
    name: "Free",
    tagline: "Keşfet",
    monthlyPrice: 0,
    yearlyPrice: 0,
    desc: "Kendi API anahtarınla sınırsız dene. Proxy kotası yok.",
    icon: Bot,
    accentColor: "rgba(255,255,255,0.35)",
    features: [
      "BYOK — Kendi OpenRouter/OpenAI key'in",
      "Yerel ajan çalıştırma",
      "Temel Vector Vault (512 MB)",
      "Topluluk desteği",
    ],
    button: "Ücretsiz Başla",
    popular: false,
  },
  {
    id: "core",
    name: "Core",
    tagline: "Profesyonel",
    monthlyPrice: 6,
    yearlyPrice: 4,
    desc: "Must-b proxy üzerinden 500K token/ay. Küçük ekipler için ideal.",
    icon: Zap,
    accentColor: "rgba(6,182,212,0.8)",
    features: [
      "500.000 proxy token / ay",
      "Hibrit ajan mimarisi",
      "Cloud Vector Vault (2 GB)",
      "Skill Store erişimi",
      "E-posta desteği",
    ],
    button: "Core'a Geç",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "En Popüler",
    monthlyPrice: 29,
    yearlyPrice: 19,
    desc: "Güç kullanıcıları için 2M token/ay ve sürü (swarm) mimarisi.",
    icon: Rocket,
    accentColor: "rgba(16,185,129,0.9)",
    features: [
      "2.000.000 proxy token / ay",
      "Swarm ajan orkestrasyonu",
      "Cloud Vector Vault (20 GB)",
      "Öncelikli Skill Store",
      "Artifact üretimi",
      "Öncelikli destek",
    ],
    button: "Pro'ya Yükselt",
    popular: true,
  },
];

const ENTERPRISE_PLANS = [
  {
    id: "elite",
    name: "Elite",
    tagline: "Kurumsal Güç",
    monthlyPrice: 99,
    yearlyPrice: 79,
    desc: "10M token/ay, özel model bağlantısı ve gelişmiş güvenlik politikaları.",
    icon: Crown,
    accentColor: "rgba(6,182,212,0.7)",
    features: [
      "10.000.000 proxy token / ay",
      "Özel model bağlantıları",
      "Gelişmiş güvenlik politikaları",
      "Öncelikli SLA desteği",
      "Özel Skill Store erişimi",
    ],
  },
  {
    id: "local",
    name: "Local Sovereign",
    tagline: "Sıfır Telemetri",
    monthlyPrice: 499,
    yearlyPrice: 399,
    desc: "Tamamen air-gapped, on-premise dağıtım. Verileriniz hiç dışarı çıkmaz.",
    icon: Shield,
    accentColor: "rgba(139,92,246,0.7)",
    features: [
      "Sınırsız yerel token (BYOK)",
      "Air-gapped / on-premise kurulum",
      "Sıfır telemetri, tam veri egemenliği",
      "Özel R&D danışmanlığı",
      "Kaynak kod lisansı",
    ],
  },
];

// ─────────────────────────────────────────────
// Alt Bileşenler
// ─────────────────────────────────────────────

// Neon Yearly/Monthly Switch
function BillingToggle({ isYearly, onToggle }: { isYearly: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-4 select-none">
      <span className={`text-sm font-semibold transition-colors ${!isYearly ? "text-white" : "text-white/40"}`}>
        Aylık
      </span>

      <button
        onClick={onToggle}
        id="billing-toggle"
        aria-label="Fatura periyodunu değiştir"
        className="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        style={{
          background: isYearly
            ? "linear-gradient(135deg, #10b981, #06b6d4)"
            : "rgba(255,255,255,0.1)",
          boxShadow: isYearly
            ? "0 0 20px rgba(16,185,129,0.5), 0 0 40px rgba(6,182,212,0.2)"
            : "none",
        }}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
          style={{ left: isYearly ? "calc(100% - 24px)" : "4px" }}
        />
      </button>

      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold transition-colors ${isYearly ? "text-white" : "text-white/40"}`}>
          Yıllık
        </span>
        <AnimatePresence>
          {isYearly && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.7, x: -8 }}
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))",
                border: "1px solid rgba(16,185,129,0.4)",
                color: "#34d399",
              }}
            >
              %35 İndirim
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Ana plan kartı
function MainPlanCard({
  plan,
  isYearly,
  user,
  index,
}: {
  plan: typeof MAIN_PLANS[number];
  isYearly: boolean;
  user: User | null;
  index: number;
}) {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const Icon = plan.icon;

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  if (plan.popular) {
    // Pro — neon akan sınır efekti
    return (
      <motion.div variants={cardVariants} className="relative" style={{ zIndex: 2 }}>
        {/* Akan neon sınır */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            padding: "1.5px",
            background: "linear-gradient(135deg, #10b981, #06b6d4, #10b981, #06b6d4)",
            backgroundSize: "300% 300%",
            animation: "pro-glow-border 3s linear infinite",
            borderRadius: "24px",
            zIndex: -1,
          }}
        />
        {/* Dış glow */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            boxShadow: "0 0 40px rgba(16,185,129,0.3), 0 0 80px rgba(6,182,212,0.15)",
            borderRadius: "24px",
            zIndex: -2,
          }}
        />

        {/* Most Popular Badge */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
          <div
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #10b981, #06b6d4)",
              color: "#fff",
              boxShadow: "0 0 20px rgba(16,185,129,0.6)",
            }}
          >
            <Star className="w-3 h-3 fill-white" />
            En Popüler
          </div>
        </div>

        <div
          className="relative rounded-3xl flex flex-col h-full overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.05) 50%, rgba(10,12,18,0.98) 100%)",
            border: "1px solid rgba(16,185,129,0.2)",
            backdropFilter: "blur(20px)",
          }}
        >
          <CardInner plan={plan} price={price} isYearly={isYearly} user={user} isPro />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={cardVariants}>
      <div
        className="relative rounded-3xl flex flex-col h-full overflow-hidden transition-all duration-300 group"
        style={{
          background: "rgba(10,12,18,0.8)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(20px)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = `${plan.accentColor.replace("0.8", "0.3").replace("0.35", "0.2")}`;
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${plan.accentColor.replace("0.8", "0.1").replace("0.35", "0.05")}`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        <CardInner plan={plan} price={price} isYearly={isYearly} user={user} />
      </div>
    </motion.div>
  );
}

function CardInner({
  plan,
  price,
  isYearly,
  user,
  isPro = false,
}: {
  plan: typeof MAIN_PLANS[number];
  price: number;
  isYearly: boolean;
  user: User | null;
  isPro?: boolean;
}) {
  const Icon = plan.icon;
  const href = plan.id === "free" ? "/login" : checkoutUrl(plan.id, user, isYearly);

  return (
    <div className="flex flex-col h-full p-7">
      {/* İkon + Plan adı */}
      <div className="mb-6">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: `${plan.accentColor.replace("0.8", "0.12").replace("0.9", "0.12").replace("0.35", "0.07")}` }}
        >
          <Icon className="w-5 h-5" style={{ color: plan.accentColor }} />
        </div>
        <h3 className="text-lg font-bold text-white mb-0.5">{plan.name}</h3>
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: plan.accentColor }}
        >
          {plan.tagline}
        </p>
        <p className="text-sm text-white/50 leading-relaxed">{plan.desc}</p>
      </div>

      {/* Fiyat */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">${price}</span>
          <span className="text-sm text-white/40 font-mono">/ ay</span>
        </div>
        {isYearly && plan.monthlyPrice > 0 && (
          <p className="text-xs text-white/30 mt-1 line-through">${plan.monthlyPrice}/ay</p>
        )}
      </div>

      {/* Özellikler */}
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-white/70">
            <Check
              className="w-4 h-4 shrink-0 mt-0.5"
              style={{ color: plan.accentColor }}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA Butonu */}
      <a
        href={href}
        id={`pricing-cta-${plan.id}`}
        className="relative flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl text-sm font-bold transition-all duration-300 group/btn overflow-hidden"
        style={
          isPro
            ? {
                background: "linear-gradient(135deg, #10b981, #06b6d4)",
                color: "#fff",
                boxShadow: "0 0 20px rgba(16,185,129,0.4)",
              }
            : {
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(255,255,255,0.1)",
              }
        }
        onMouseEnter={(e) => {
          if (!isPro) {
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.1)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isPro) {
            (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)";
          }
        }}
      >
        {isPro && (
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-xl" />
        )}
        <span className="relative z-10">{plan.button}</span>
        <ChevronRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
      </a>
    </div>
  );
}

// Kurumsal kart (yatay)
function EnterpriseCard({
  plan,
  isYearly,
  user,
  index,
}: {
  plan: typeof ENTERPRISE_PLANS[number];
  isYearly: boolean;
  user: User | null;
  index: number;
}) {
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const Icon = plan.icon;
  const href = checkoutUrl(plan.id, user, isYearly);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative rounded-2xl overflow-hidden transition-all duration-300 group"
      style={{
        background: "rgba(6,8,14,0.9)",
        border: `1px solid ${plan.accentColor.replace("0.7", "0.15")}`,
        backdropFilter: "blur(20px)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = plan.accentColor.replace("0.7", "0.35");
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 40px ${plan.accentColor.replace("0.7", "0.12")}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = plan.accentColor.replace("0.7", "0.15");
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Üst ışık çizgisi */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${plan.accentColor}, transparent)` }}
      />

      <div className="flex flex-col md:flex-row gap-6 p-7 md:p-8">
        {/* Sol: ikon + başlık */}
        <div className="flex items-start gap-5 md:w-72 shrink-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: plan.accentColor.replace("0.7", "0.1") }}
          >
            <Icon className="w-6 h-6" style={{ color: plan.accentColor }} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-0.5">{plan.name}</h3>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: plan.accentColor }}>
              {plan.tagline}
            </p>
            <p className="text-xs text-white/40 leading-relaxed">{plan.desc}</p>
          </div>
        </div>

        {/* Orta: özellikler */}
        <ul className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 content-start">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-white/60">
              <Check className="w-3.5 h-3.5 shrink-0" style={{ color: plan.accentColor }} />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* Sağ: fiyat + buton */}
        <div className="flex flex-col items-start md:items-end justify-between gap-4 md:min-w-[140px] shrink-0">
          <div className="text-right">
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-3xl font-black text-white">${price}</span>
              <span className="text-xs text-white/40 font-mono">/ ay</span>
            </div>
            {isYearly && (
              <p className="text-xs text-white/25 line-through">${plan.monthlyPrice}/ay</p>
            )}
          </div>

          <a
            href={href}
            id={`pricing-cta-${plan.id}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap group/ebtn"
            style={{
              background: plan.accentColor.replace("0.7", "0.12"),
              border: `1px solid ${plan.accentColor.replace("0.7", "0.3")}`,
              color: "#fff",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = plan.accentColor.replace("0.7", "0.2");
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = plan.accentColor.replace("0.7", "0.12");
            }}
          >
            Hemen Başla
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/ebtn:translate-x-0.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Ana Bileşen
// ─────────────────────────────────────────────

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Mevcut Supabase oturumundan kullanıcıyı çek
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <section id="pricing" className="py-24 px-6 relative overflow-hidden">
      {/* Arka plan ışımaları */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(ellipse, #10b981, transparent 70%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, #06b6d4, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Başlık & Toggle ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-mono font-bold uppercase tracking-widest"
            style={{
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "#34d399",
            }}
          >
            <Sparkles className="w-3 h-3" />
            Fiyatlandırma
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight leading-tight">
            Doğru Plan,<br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #10b981, #06b6d4)" }}
            >
              Sınırsız Potansiyel
            </span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed mb-10">
            Hobi projelerinden hava-geçirmez kurumsal mimarilere. Her ölçekte zekâ, her bütçeye uygun fiyat.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center">
            <BillingToggle isYearly={isYearly} onToggle={() => setIsYearly(!isYearly)} />
          </div>
        </motion.div>

        {/* ── 3'lü Ana Vitrin (Free / Core / Pro) ─────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16 items-stretch"
          style={{ paddingTop: "24px" }} // Most Popular badge için alan
        >
          {MAIN_PLANS.map((plan, i) => (
            <MainPlanCard key={plan.id} plan={plan} isYearly={isYearly} user={user} index={i} />
          ))}
        </motion.div>

        {/* ── Kurumsal & Güvenlik Vitrin ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08))" }} />
            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{
                background: "rgba(6,182,212,0.06)",
                border: "1px solid rgba(6,182,212,0.15)",
                color: "rgba(6,182,212,0.8)",
              }}
            >
              <Lock className="w-3 h-3" />
              Kurumsal &amp; Güvenlik Odaklı Çözümler
            </div>
            <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(255,255,255,0.08))" }} />
          </div>

          <div className="flex flex-col gap-4">
            {ENTERPRISE_PLANS.map((plan, i) => (
              <EnterpriseCard key={plan.id} plan={plan} isYearly={isYearly} user={user} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── Alt not ──────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-white/25 font-mono"
        >
          Tüm planlar iptal edilebilir · Ödeme Lemon Squeezy tarafından güvenli işlenir · Vergi dahil değildir
        </motion.p>
      </div>

      {/* CSS Keyframes — akan Pro sınırı */}
      <style>{`
        @keyframes pro-glow-border {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
      `}</style>
    </section>
  );
}
