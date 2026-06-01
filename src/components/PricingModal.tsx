/**
 * PricingModal.tsx — Premium Yükseltme Paneli
 *
 * 3 plan kartı: Free / Core ($9/mo) / Elite ($29/mo)
 * - Mevcut plan "Current Plan" (disabled buton) olarak işaretlenir.
 * - Upgrade butonuna basınca 1.5s spinner → Stripe TODO toast.
 * - Dışarı tıklama ve Esc ile kapanır; açıkken body scroll kilitlenir.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Zap, Shield, Ghost, Check, Loader2, ChevronRight, Lock, Sparkles,
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────

export interface PricingModalProps {
  isOpen: boolean;
  currentPlanLevel: string | null;
  onClose: () => void;
}

// ─── Plan definitions ─────────────────────────────────────

const PLANS = [
  {
    id:          "Free",
    name:        "Free Node",
    price:       null,
    priceLabel:  "Free forever",
    color:       "#6b7280",
    glow:        null as string | null,
    animated:    false,
    icon:        Ghost,
    description: "Get started with the Nexus.",
    features: [
      "Community access",
      "3 channels",
      "50K token/month",
      "Basic node identity",
    ],
    locked: [
      "Cosmetics & frames",
      "Ghost Protocol",
      "Cognitive Credits",
    ],
  },
  {
    id:          "Core",
    name:        "Core Node",
    price:       9,
    priceLabel:  "$9 / month",
    color:       "#22c55e",
    glow:        "0 0 15px rgba(34,197,94,0.30), 0 0 40px rgba(34,197,94,0.10)",
    animated:    false,
    icon:        Shield,
    description: "For power users building with Must-b.",
    features: [
      "Everything in Free",
      "500K token/month",
      "Priority queue",
      "Custom avatar frame",
      "Green node glow",
    ],
    locked: [
      "Ghost Protocol rooms",
    ],
  },
  {
    id:          "Elite",
    name:        "Elite Node",
    price:       29,
    priceLabel:  "$29 / month",
    color:       "#a855f7",
    glow:        null,
    animated:    true,
    icon:        Sparkles,
    description: "Maximum access. Zero limits.",
    features: [
      "Everything in Core",
      "10M token/month",
      "Ghost Protocol rooms",
      "1,000 Cognitive Credits",
      "Animated neon border",
      "Elite badge",
      "Priority support",
    ],
    locked: [],
  },
] as const;

type PlanId = (typeof PLANS)[number]["id"];

// ─── Animated neon border for Elite ──────────────────────

function EliteCardGlow() {
  return (
    <>
      <style>{`
        @keyframes pm-elite-pulse {
          /* compositor-only: opacity + transform — box-shadow kald\u0131r\u0131ld\u0131 */
          0%,100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.002); }
        }
        .pm-elite-glow {
          animation: pm-elite-pulse 2.4s ease-in-out infinite;
          will-change: opacity, transform;
        }
      `}</style>
      <div
        className="pm-elite-glow absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          border: "1.5px solid rgba(168,85,247,0.65)",
          borderRadius: "inherit",
          /* Sabit glow \u2014 animate edilmiyor */
          boxShadow: "0 0 20px 2px rgba(168,85,247,0.20), inset 0 0 10px rgba(168,85,247,0.05)",
        }}
      />
    </>
  );
}

// ─── Single Plan Card ─────────────────────────────────────

function PlanCard({
  plan,
  isCurrent,
  onUpgrade,
}: {
  plan: (typeof PLANS)[number];
  isCurrent: boolean;
  onUpgrade: (planId: PlanId) => void;
}) {
  const [loading, setLoading] = useState(false);
  const PlanIcon = plan.icon;

  const handleUpgrade = async () => {
    if (isCurrent || loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    toast("Redirecting to Stripe Checkout…", {
      description: `TODO: Stripe integration for ${plan.name} plan.`,
      icon: <Zap className="w-4 h-4 text-yellow-400" />,
    });
    onUpgrade(plan.id as PlanId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative flex flex-col rounded-2xl overflow-hidden flex-1 min-w-0"
      style={{
        background: plan.animated
          ? "rgba(168,85,247,0.04)"
          : isCurrent
          ? `${plan.color}08`
          : "rgba(255,255,255,0.025)",
        border: plan.animated
          ? "1px solid rgba(168,85,247,0.40)"
          : isCurrent
          ? `1px solid ${plan.color}50`
          : `1px solid ${plan.color}22`,
        boxShadow: plan.glow ?? undefined,
      }}
    >
      {/* Elite animated border */}
      {plan.animated && <EliteCardGlow />}

      {/* Top color accent */}
      <div
        className="h-1 w-full"
        style={{
          background: plan.animated
            ? "linear-gradient(90deg,#a855f7,#6366f1,#a855f7)"
            : plan.id === "Core"
            ? "linear-gradient(90deg,#22c55e,#4ade80)"
            : "linear-gradient(90deg,rgba(107,114,128,0.5),rgba(107,114,128,0.8))",
        }}
      />

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Plan header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: `${plan.color}15`,
                border: `1px solid ${plan.color}35`,
              }}
            >
              <PlanIcon className="w-4 h-4" style={{ color: plan.color }} />
            </div>

            {isCurrent && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{
                  background: `${plan.color}15`,
                  border: `1px solid ${plan.color}35`,
                  color: plan.color,
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                Current
              </span>
            )}
          </div>

          <div>
            <h3
              className="text-sm font-bold"
              style={{ color: plan.color, fontFamily: "Inter, sans-serif" }}
            >
              {plan.name}
            </h3>
            <p
              className="text-[11px] mt-0.5"
              style={{ color: "rgba(255,255,255,0.40)", fontFamily: "Inter, sans-serif" }}
            >
              {plan.description}
            </p>
          </div>

          {/* Price */}
          <div className="mt-1">
            {plan.price ? (
              <div className="flex items-baseline gap-1">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "rgba(255,255,255,0.90)", fontFamily: "Inter, sans-serif" }}
                >
                  ${plan.price}
                </span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>/mo</span>
              </div>
            ) : (
              <span
                className="text-lg font-bold"
                style={{ color: "rgba(255,255,255,0.40)", fontFamily: "Inter, sans-serif" }}
              >
                Free
              </span>
            )}
          </div>
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-1.5 flex-1">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check
                className="w-3.5 h-3.5 mt-0.5 shrink-0"
                style={{ color: plan.color }}
              />
              <span
                className="text-xs leading-relaxed"
                style={{ color: "rgba(255,255,255,0.65)", fontFamily: "Inter, sans-serif" }}
              >
                {f}
              </span>
            </li>
          ))}
          {plan.locked.map((f) => (
            <li key={f} className="flex items-start gap-2 opacity-35">
              <Lock className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
              <span
                className="text-xs leading-relaxed line-through"
                style={{ color: "rgba(255,255,255,0.40)", fontFamily: "Inter, sans-serif" }}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          onClick={handleUpgrade}
          disabled={isCurrent || loading}
          className="mt-auto w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:cursor-not-allowed"
          style={{
            background: isCurrent
              ? `${plan.color}10`
              : plan.animated
              ? "rgba(168,85,247,0.18)"
              : plan.id === "Core"
              ? "rgba(34,197,94,0.18)"
              : "rgba(107,114,128,0.12)",
            border: isCurrent
              ? `1px solid ${plan.color}20`
              : `1px solid ${plan.color}40`,
            color: isCurrent ? `${plan.color}60` : plan.color,
            fontFamily: "Inter, sans-serif",
            boxShadow: isCurrent ? "none" : `0 0 12px ${plan.color}18`,
            opacity: isCurrent ? 0.6 : 1,
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting…
            </>
          ) : isCurrent ? (
            <>
              <Check className="w-4 h-4" />
              Current Plan
            </>
          ) : plan.id === "Free" ? (
            "Downgrade"
          ) : (
            <>
              Upgrade
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Modal ───────────────────────────────────────────

export function PricingModal({ isOpen, currentPlanLevel, onClose }: PricingModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  const normalizeCurrent = (raw: string | null): PlanId => {
    const p = (raw ?? "Free").toLowerCase();
    if (p === "elite" || p === "root") return "Elite";
    if (p === "core" || p === "pro")   return "Core";
    return "Free";
  };

  const currentId = normalizeCurrent(currentPlanLevel);

  // Body scroll kilitle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Esc
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  // Backdrop tıklama
  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  }, [onClose]);

  const handleUpgrade = useCallback((_planId: PlanId) => {
    // Stripe entegrasyonu hazır olana kadar modal kapatılmaz,
    // toast zaten gösterildi; isteğe göre onClose() eklenebilir.
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={backdropRef}
          key="pm-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(8px)" }}
          onClick={handleBackdropClick}
        >
          <motion.div
            key="pm-card"
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
            style={{
              background: "rgba(15,15,15,0.97)",
              backdropFilter: "blur(28px) saturate(200%)",
              WebkitBackdropFilter: "blur(28px) saturate(200%)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.80)",
            }}
          >
            {/* Rainbow header strip */}
            <div
              className="h-1 w-full"
              style={{ background: "linear-gradient(90deg, #22c55e, #38bdf8, #a855f7, #6366f1, #a855f7, #38bdf8, #22c55e)" }}
            />

            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div>
                <h2
                  className="text-lg font-bold"
                  style={{ color: "rgba(255,255,255,0.92)", fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}
                >
                  Upgrade Your Node
                </h2>
                <p
                  className="text-xs mt-1"
                  style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Inter, sans-serif" }}
                >
                  Choose a plan that matches your agentic ambitions.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.80)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Plan Cards */}
            <div className="flex gap-4 p-6">
              {PLANS.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isCurrent={plan.id === currentId}
                  onUpgrade={handleUpgrade}
                />
              ))}
            </div>

            {/* Footer note */}
            <div
              className="px-6 pb-5 text-center"
            >
              <p
                className="text-[11px]"
                style={{ color: "rgba(255,255,255,0.20)", fontFamily: "'Space Mono', monospace" }}
              >
                All plans include E2EE · AES-256-GCM · Ed25519 identity · Cancel anytime
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
