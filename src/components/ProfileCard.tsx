/**
 * ProfileCard.tsx — Modüler Profil Kartı (Popover/Modal)
 *
 * Plan hiyerarşisi görselliği:
 *   Free  → Gri rozet + kilitli Kozmetikler bölümü + Upgrade butonu
 *   Core  → Yeşil rozet + yeşil glow
 *   Elite / Root → Animated neon mor/mavi border (pulse)
 *
 * v2: onEditClick ve onUpgradeClick prop'ları eklendi.
 */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Edit3, Cpu, Zap, ArrowUpRight } from "lucide-react";

// ─── Types ───────────────────────────────────────────────

export interface ProfileCardUser {
  userId: string;
  username: string;
  avatarUrl?: string | null;
  planLevel?: string | null;
  cognitiveCredits?: number;
}

interface ProfileCardProps {
  targetUser: ProfileCardUser | null;
  currentUserId: string | null;
  anchorRect: DOMRect | null;
  onClose: () => void;
  /** Kendi profiline bakarken "Profili Düzenle" butonuna basılınca */
  onEditClick?: () => void;
  /** "Upgrade" veya kilitli kozmetikler butonuna basılınca */
  onUpgradeClick?: () => void;
}

// ─── Plan helpers ─────────────────────────────────────────

export function normalizePlan(raw?: string | null): "Free" | "Core" | "Elite" | "Root" | "Pro" {
  const p = (raw ?? "Free").toLowerCase();
  if (p === "root")  return "Root";
  if (p === "elite") return "Elite";
  if (p === "core")  return "Core";
  if (p === "pro")   return "Pro";
  return "Free";
}

export const PLAN_META = {
  Free:  { label: "Free Node",  badge: "#6b7280", glow: null },
  Core:  { label: "Core Node",  badge: "#22c55e", glow: "0 0 15px rgba(34,197,94,0.3)" },
  Pro:   { label: "Pro Node",   badge: "#38bdf8", glow: "0 0 15px rgba(56,189,248,0.3)" },
  Elite: { label: "Elite Node", badge: "#a855f7", glow: null /* animated */ },
  Root:  { label: "Root Node",  badge: "#a855f7", glow: null /* animated */ },
} as const;

// ─── Avatar ───────────────────────────────────────────────

function Avatar({ user, size = 64 }: { user: ProfileCardUser; size?: number }) {
  const plan  = normalizePlan(user.planLevel);
  const meta  = PLAN_META[plan];
  const color = meta.badge;

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.username}
        className="rounded-full object-cover shrink-0"
        style={{
          width:  size,
          height: size,
          border: `2px solid ${color}60`,
          boxShadow: meta.glow ?? undefined,
        }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold shrink-0 select-none"
      style={{
        width:      size,
        height:     size,
        background: `${color}18`,
        border:     `2px solid ${color}50`,
        color,
        fontSize:   size * 0.38,
        fontFamily: "'Space Mono', monospace",
        boxShadow:  meta.glow ?? undefined,
      }}
    >
      {user.username[0]?.toUpperCase()}
    </div>
  );
}

// ─── Plan Badge ───────────────────────────────────────────

function PlanBadge({ plan }: { plan: ReturnType<typeof normalizePlan> }) {
  const meta = PLAN_META[plan];
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase select-none"
      style={{
        background: `${meta.badge}18`,
        border:     `1px solid ${meta.badge}45`,
        color:       meta.badge,
        fontFamily: "'Space Mono', monospace",
      }}
    >
      <Cpu className="w-3 h-3" />
      {meta.label}
    </span>
  );
}

// ─── Cognitive Credits ────────────────────────────────────

function CognitiveCreditsRow({ credits }: { credits: number }) {
  return (
    <div
      className="flex items-center justify-between rounded-lg px-3 py-2.5 mt-3"
      style={{
        background: "rgba(56,189,248,0.05)",
        border: "1px solid rgba(56,189,248,0.15)",
      }}
    >
      <div className="flex items-center gap-2">
        <Zap className="w-3.5 h-3.5" style={{ color: "#38bdf8" }} />
        <span
          className="text-xs font-semibold tracking-wide"
          style={{ color: "rgba(255,255,255,0.55)", fontFamily: "Inter, sans-serif" }}
        >
          Cognitive Credits
        </span>
      </div>
      <span
        className="text-sm font-bold tabular-nums"
        style={{ fontFamily: "'Space Mono', monospace", color: "#38bdf8" }}
      >
        {credits.toLocaleString()}
      </span>
    </div>
  );
}

// ─── Locked Cosmetics (Free plan) ─────────────────────────

function LockedCosmeticsSection({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <div
      className="mt-3 rounded-lg px-3 py-3 flex flex-col gap-2"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px dashed rgba(255,255,255,0.1)",
      }}
    >
      <div className="flex items-center gap-2 select-none">
        <Lock className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
        <span
          className="text-xs font-semibold tracking-wide"
          style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Inter, sans-serif" }}
        >
          Kozmetikler
        </span>
      </div>
      <p
        className="text-[10px] leading-relaxed select-none"
        style={{ color: "rgba(255,255,255,0.22)", fontFamily: "Inter, sans-serif" }}
      >
        🔒 Elite Plan ile açılır — özel avatar çerçeveleri, neon efektler ve daha fazlası.
      </p>
      {onUpgrade && (
        <button
          onClick={onUpgrade}
          className="flex items-center justify-center gap-1.5 w-full rounded-lg py-1.5 text-[11px] font-semibold transition-all duration-150 active:scale-95"
          style={{
            background: "rgba(168,85,247,0.10)",
            border: "1px solid rgba(168,85,247,0.30)",
            color: "#a855f7",
            fontFamily: "Inter, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(168,85,247,0.18)";
            e.currentTarget.style.boxShadow = "0 0 12px rgba(168,85,247,0.20)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(168,85,247,0.10)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <ArrowUpRight className="w-3 h-3" />
          Upgrade to Elite
        </button>
      )}
    </div>
  );
}

// ─── Animated Neon Border (Elite / Root) ──────────────────

function EliteBorderGlow() {
  return (
    <>
      <style>{`
        @keyframes pc-neon-pulse {
          0%,100% { opacity: 0.6; box-shadow: 0 0 0px 0px rgba(168,85,247,0); }
          50%      { opacity: 1;   box-shadow: 0 0 22px 4px rgba(168,85,247,0.45), 0 0 40px 8px rgba(99,102,241,0.25); }
        }
        .pc-elite-border { animation: pc-neon-pulse 2.4s ease-in-out infinite; }
      `}</style>
      <div
        className="pc-elite-border absolute inset-0 rounded-2xl pointer-events-none"
        style={{ border: "1.5px solid rgba(168,85,247,0.6)", borderRadius: "inherit" }}
      />
    </>
  );
}

// ─── Main Component ───────────────────────────────────────

export function ProfileCard({
  targetUser,
  currentUserId,
  anchorRect,
  onClose,
  onEditClick,
  onUpgradeClick,
}: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Kart dışına tıklayınca kapat
  useEffect(() => {
    if (!targetUser) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [targetUser, onClose]);

  // Esc ile kapat
  useEffect(() => {
    if (!targetUser) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [targetUser, onClose]);

  // Pozisyon hesapla (viewport'a göre)
  const getPosition = (): React.CSSProperties => {
    if (!anchorRect) return { top: "50%", left: "50%", transform: "translate(-50%,-50%)" };
    const CARD_W = 288;
    const CARD_H = 380; // tahmini max
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = anchorRect.right + 10;
    let top  = anchorRect.top;

    if (left + CARD_W > vw - 16) left = anchorRect.left - CARD_W - 10;
    if (left < 8) left = 8;
    if (top + CARD_H > vh - 16) top = vh - CARD_H - 16;
    if (top < 8) top = 8;

    return { top, left, transform: "none" };
  };

  const isOpen       = !!targetUser && !!anchorRect;
  const isSelf       = !!(currentUserId && targetUser?.userId === currentUserId);
  const plan         = normalizePlan(targetUser?.planLevel);
  const isEliteOrRoot = plan === "Elite" || plan === "Root";

  // "Edit Profile" butonuna tıklama: önce kartı kapat, sonra modal aç
  const handleEditClick = () => {
    onClose();
    onEditClick?.();
  };

  // "Upgrade" butonuna tıklama: önce kartı kapat, sonra modal aç
  const handleUpgradeClick = () => {
    onClose();
    onUpgradeClick?.();
  };

  return (
    <AnimatePresence>
      {isOpen && targetUser && (
        <>
          {/* Invisible backdrop */}
          <motion.div
            key="pc-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9998]"
            style={{ pointerEvents: "none" }}
          />

          {/* Kart */}
          <motion.div
            key="pc-card"
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed z-[9999] w-72 rounded-2xl overflow-hidden"
            style={{
              ...getPosition(),
              background:     "rgba(17,17,17,0.92)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: plan === "Free"
                ? "1px solid rgba(255,255,255,0.09)"
                : isEliteOrRoot
                ? "1px solid rgba(168,85,247,0.5)"
                : `1px solid ${PLAN_META[plan].badge}45`,
              boxShadow: plan === "Core"
                ? "0 0 15px rgba(34,197,94,0.3), 0 8px 32px rgba(0,0,0,0.6)"
                : plan === "Pro"
                ? "0 0 15px rgba(56,189,248,0.3), 0 8px 32px rgba(0,0,0,0.6)"
                : "0 8px 32px rgba(0,0,0,0.7)",
            }}
          >
            {/* Elite / Root — animated neon border */}
            {isEliteOrRoot && <EliteBorderGlow />}

            {/* Header gradient strip */}
            <div
              className="h-1.5 w-full"
              style={{
                background: plan === "Core"
                  ? "linear-gradient(90deg,#22c55e,#4ade80)"
                  : plan === "Pro"
                  ? "linear-gradient(90deg,#38bdf8,#818cf8)"
                  : isEliteOrRoot
                  ? "linear-gradient(90deg,#a855f7,#6366f1,#a855f7)"
                  : "linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.12))",
              }}
            />

            {/* Content */}
            <div className="px-5 pb-5 pt-4">
              {/* Avatar + isim */}
              <div className="flex flex-col items-center gap-3 text-center">
                <Avatar user={targetUser} size={72} />
                <div>
                  <p
                    className="text-base font-bold leading-none mb-2"
                    style={{
                      color: "rgba(255,255,255,0.92)",
                      fontFamily: "Inter, -apple-system, sans-serif",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {targetUser.username}
                  </p>
                  <PlanBadge plan={plan} />
                </div>
              </div>

              {/* Cognitive Credits */}
              <CognitiveCreditsRow credits={targetUser.cognitiveCredits ?? 0} />

              {/* Free plan → Kilitli Kozmetikler + Upgrade butonu */}
              {plan === "Free" && (
                <LockedCosmeticsSection onUpgrade={handleUpgradeClick} />
              )}

              {/* Core/Pro/Elite plan → Upgrade seçeneği (küçük link) */}
              {(plan === "Core" || plan === "Pro") && onUpgradeClick && (
                <button
                  onClick={handleUpgradeClick}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-medium transition-all duration-150 active:scale-95"
                  style={{
                    background: "rgba(168,85,247,0.06)",
                    border: "1px solid rgba(168,85,247,0.18)",
                    color: "rgba(168,85,247,0.70)",
                    fontFamily: "Inter, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(168,85,247,0.12)";
                    e.currentTarget.style.color = "#a855f7";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(168,85,247,0.06)";
                    e.currentTarget.style.color = "rgba(168,85,247,0.70)";
                  }}
                >
                  <ArrowUpRight className="w-3 h-3" />
                  Upgrade to Elite
                </button>
              )}

              {/* Kendi profiline bakıyorsa → Profili Düzenle */}
              {isSelf && (
                <button
                  onClick={handleEditClick}
                  className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border:     "1px solid rgba(255,255,255,0.12)",
                    color:      "rgba(255,255,255,0.70)",
                    fontFamily: "Inter, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.color      = "rgba(255,255,255,0.90)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color      = "rgba(255,255,255,0.70)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  }}
                >
                  <Edit3 className="w-4 h-4" />
                  Profili Düzenle
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
