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
    color:       "#8B949E",
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
    color:       "#3B82F6",
    glow:        null as string | null,
    animated:    false,
    icon:        Shield,
    description: "For power users building with Must-b.",
    features: [
      "Everything in Free",
      "500K token/month",
      "Priority queue",
      "Custom avatar frame",
      "Blue node accent",
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
    color:       "#6366F1",
    glow:        null as string | null,
    animated:    false,
    icon:        Sparkles,
    description: "Maximum access. Zero limits.",
    features: [
      "Everything in Core",
      "10M token/month",
      "Ghost Protocol rooms",
      "1,000 Cognitive Credits",
      "Exclusive border",
      "Elite badge",
      "Priority support",
    ],
    locked: [],
  },
] as const;

type PlanId = (typeof PLANS)[number]["id"];

// ─── Helper: check-mark color per plan ────────────────────

function checkColor(planId: string): string {
  if (planId === "Elite") return "#6366F1";
  if (planId === "Core") return "#3B82F6";
  return "#8B949E";
}

// ─── Helper: card border class per plan ───────────────────

function cardBorderClass(planId: string): string {
  if (planId === "Elite") return "border border-indigo-500/30";
  if (planId === "Core") return "border border-blue-500/30";
  return "border border-[#30363D]";
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

  // Button classes
  const buttonClasses = isCurrent
    ? "bg-[#161B22] border border-[#30363D] text-[#484F58] cursor-not-allowed opacity-60"
    : plan.id === "Elite"
    ? "bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent"
    : plan.id === "Core"
    ? "bg-blue-600 hover:bg-blue-700 text-white border border-transparent"
    : "bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:bg-[#1C2128]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`relative flex flex-col rounded-2xl overflow-hidden flex-1 min-w-0 bg-[#0E1116] ${cardBorderClass(plan.id)}`}
    >
      {/* Top color accent — thin gradient line */}
      <div
        className={`h-0.5 w-full ${
          plan.id === "Elite"
            ? "bg-gradient-to-r from-indigo-600 to-purple-600"
            : plan.id === "Core"
            ? "bg-gradient-to-r from-blue-600 to-blue-400"
            : "bg-[#30363D]"
        }`}
      />

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Plan header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#161B22] border border-[#30363D]"
            >
              <PlanIcon className="w-4 h-4" style={{ color: plan.color }} />
            </div>

            {isCurrent && (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider bg-[#161B22] border border-[#30363D] text-[#8B949E]"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Current
              </span>
            )}
          </div>

          <div>
            <h3
              className="text-sm font-bold"
              style={{ color: plan.color, fontFamily: "Inter, system-ui, sans-serif" }}
            >
              {plan.name}
            </h3>
            <p
              className="text-[11px] mt-0.5 text-[#484F58]"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              {plan.description}
            </p>
          </div>

          {/* Price */}
          <div className="mt-1">
            {plan.price ? (
              <div className="flex items-baseline gap-1">
                <span
                  className="text-2xl font-bold text-[#E6EDF3]"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  ${plan.price}
                </span>
                <span className="text-xs text-[#484F58]">/mo</span>
              </div>
            ) : (
              <span
                className="text-lg font-bold text-[#484F58]"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
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
                style={{ color: checkColor(plan.id) }}
              />
              <span
                className="text-xs leading-relaxed text-[#8B949E]"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {f}
              </span>
            </li>
          ))}
          {plan.locked.map((f) => (
            <li key={f} className="flex items-start gap-2 opacity-35">
              <Lock className="w-3 h-3 mt-0.5 shrink-0 text-[#484F58]" />
              <span
                className="text-xs leading-relaxed line-through text-[#484F58]"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
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
          className={`mt-auto w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors duration-200 active:scale-95 disabled:cursor-not-allowed ${buttonClasses}`}
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
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
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            key="pm-card"
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-[#161B22] border border-[#30363D] shadow-2xl"
          >
            {/* Thin gradient header line */}
            <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 to-indigo-600" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#30363D]">
              <div>
                <h2
                  className="text-lg font-bold text-[#E6EDF3]"
                  style={{ fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "-0.01em" }}
                >
                  Upgrade Your Node
                </h2>
                <p
                  className="text-xs mt-1 text-[#484F58]"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Choose a plan that matches your agentic ambitions.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 text-[#484F58] border border-[#30363D] hover:bg-[#1C2128] hover:text-[#E6EDF3]"
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
            <div className="px-6 pb-5 text-center">
              <p
                className="text-[11px] text-[#484F58]"
                style={{ fontFamily: "'Space Mono', monospace" }}
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
