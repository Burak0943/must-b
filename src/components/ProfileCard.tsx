/**
 * ProfileCard.tsx — Modüler Profil Kartı (Popover/Modal)
 *
 * Plan hiyerarşisi görselliği:
 *   Free  → No badge icon
 *   Core  → BadgeCheck icon (verified style)
 *   Elite / Root / Pro → BadgeCheck icon (verified style)
 *
 * v2: onEditClick ve onUpgradeClick prop'ları eklendi.
 */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Edit3, Zap, ArrowUpRight, BadgeCheck,
  Twitter, Github, MessageSquare, Instagram, Music, Link
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────

export interface ProfileCardUser {
  userId: string;
  username: string;
  avatarUrl?: string | null;
  planLevel?: string | null;
  cognitiveCredits?: number;
  bio?: string | null;
  social_links?: Record<string, string> | null;
  preferences?: { sound?: boolean; desktop_notifications?: boolean; stealth_mode?: boolean } | null;
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

import { PLAN_META, normalizePlan } from "@/data/planConstants";

// ─── Avatar ───────────────────────────────────────────────

function Avatar({ user, size = 64 }: { user: ProfileCardUser; size?: number }) {
  const plan  = normalizePlan(user.planLevel);
  const meta  = PLAN_META[plan];
  const color = meta.ring;

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
        fontFamily: "Inter, system-ui, sans-serif",
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
      className="inline-flex items-center gap-1.5 text-[12px] font-medium select-none"
      style={{
        color: "#8B949E",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
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
        background: "rgba(59,130,246,0.06)",
        border: "1px solid #30363D",
      }}
    >
      <div className="flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 text-blue-500" />
        <span
          className="text-xs font-semibold tracking-wide"
          style={{ color: "#8B949E", fontFamily: "Inter, system-ui, sans-serif" }}
        >
          Cognitive Credits
        </span>
      </div>
      <span
        className="text-sm font-bold tabular-nums"
        style={{ fontFamily: "'Space Mono', monospace", color: "#3B82F6" }}
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
        background: "rgba(255,255,255,0.02)",
        border: "1px dashed #30363D",
      }}
    >
      <div className="flex items-center gap-2 select-none">
        <Lock className="w-3.5 h-3.5" style={{ color: "#484F58" }} />
        <span
          className="text-xs font-semibold tracking-wide"
          style={{ color: "#484F58", fontFamily: "Inter, system-ui, sans-serif" }}
        >
          Kozmetikler
        </span>
      </div>
      <p
        className="text-[10px] leading-relaxed select-none"
        style={{ color: "#484F58", fontFamily: "Inter, system-ui, sans-serif" }}
      >
        🔒 Elite Plan ile açılır — özel avatar çerçeveleri, neon efektler ve daha fazlası.
      </p>
      {onUpgrade && (
        <button
          onClick={onUpgrade}
          className="flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-1.5 text-[11px] font-semibold transition-colors duration-150 active:scale-95"
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          <ArrowUpRight className="w-3 h-3" />
          Upgrade to Elite
        </button>
      )}
    </div>
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
            className="fixed z-[9999] w-72 rounded-2xl overflow-hidden bg-[#161B22]/95 backdrop-blur-xl border border-[#30363D] shadow-2xl"
            style={{
              ...getPosition(),
            }}
          >
            {/* Content */}
            <div className="px-5 pb-5 pt-5">
              {/* Avatar + isim */}
              <div className="flex flex-col items-center gap-3 text-center">
                <Avatar user={targetUser} size={72} />
                <div>
                  <p
                    className="text-base font-bold leading-none mb-2 flex items-center justify-center gap-1"
                    style={{
                      color: "#E6EDF3",
                      fontFamily: "Inter, system-ui, sans-serif",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {targetUser.username}
                    {(plan === "Core" || plan === "Elite" || plan === "Root" || plan === "Pro") && (
                      <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                  </p>
                  <PlanBadge plan={plan} />
                </div>
              </div>

              {/* Bio */}
              {targetUser?.bio && (
                <p className="text-xs text-[#8B949E] text-center mt-3 border-t border-[#30363D] pt-3 leading-relaxed whitespace-pre-wrap">
                  {targetUser.bio}
                </p>
              )}

              {/* Social Links */}
              {targetUser?.social_links && Object.keys(targetUser.social_links || {}).length > 0 && (
                <div className="flex justify-center gap-2 mt-3 border-t border-[#30363D] pt-3">
                  {Object.entries(targetUser.social_links || {}).map(([platform, link]) => {
                    if (!link) return null;
                    let Icon = Link;
                    const p = platform.toLowerCase();
                    if (p.includes("twitter") || p.includes("x")) Icon = Twitter;
                    else if (p.includes("github")) Icon = Github;
                    else if (p.includes("discord")) Icon = MessageSquare;
                    else if (p.includes("instagram")) Icon = Instagram;
                    else if (p.includes("spotify")) Icon = Music;

                    return (
                      <a
                        key={platform}
                        href={link.startsWith("http") ? link : `https://${link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-[#161B22] border border-[#30363D] flex items-center justify-center text-[#8B949E] hover:text-[#E6EDF3] hover:border-[#8B949E] transition-all"
                        title={`${platform}: ${link}`}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              )}

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
                  className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-[11px] font-medium transition-colors duration-150 active:scale-95 bg-blue-600 hover:bg-blue-700 text-white"
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
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
                  className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors duration-150 active:scale-95"
                  style={{
                    background: "#161B22",
                    border:     "1px solid #30363D",
                    color:      "#E6EDF3",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1C2128";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#161B22";
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
