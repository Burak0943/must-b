import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { X, Sparkles, Tag, Clock, ExternalLink, Zap, Wrench, ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";

// ── Changelog data ─────────────────────────────────────────────────────────

interface ChangelogEntry {
  version: string;
  date: string;
  dateTr: string;
  title: string;
  titleTr: string;
  description: string;
  descriptionTr: string;
  type: "feature" | "fix" | "improvement";
  tags: string[];
}

const changelogData: ChangelogEntry[] = [
  {
    version: "v1.2.2",
    date: "May 24, 2026",
    dateTr: "24 Mayıs 2026",
    title: "OpenRouter API Bridge",
    titleTr: "OpenRouter API Köprüsü",
    description: "Vercel Edge Load Balancer added for secure LLM communication between the desktop app and cloud.",
    descriptionTr: "Masaüstü uygulaması ile güvenli LLM iletişimi için Vercel Edge Load Balancer eklendi.",
    type: "feature",
    tags: ["Edge", "LLM", "Security"],
  },
  {
    version: "v1.2.1",
    date: "May 22, 2026",
    dateTr: "22 Mayıs 2026",
    title: "Safe Mode",
    titleTr: "Safe Mode (Güvenli Mod)",
    description: "byok and upgrade options for api_unauthorized state in the must-b core now seamlessly integrated.",
    descriptionTr: "Must-b çekirdeği için api_unauthorized durumunda byok ve upgrade seçenekleri eklendi.",
    type: "improvement",
    tags: ["BYOK", "Auth", "Core"],
  },
  {
    version: "v1.2.0",
    date: "May 20, 2026",
    dateTr: "20 Mayıs 2026",
    title: "CLI Login & Loop Fix",
    titleTr: "CLI Login & Infinite Loop Düzeltmesi",
    description: "CLI login screen completely redesigned. Routing loop resolved with zero regressions.",
    descriptionTr: "CLI oturum açma ekranı tamamen yenilendi ve routing döngüleri sıfır hatayla çözüldü.",
    type: "fix",
    tags: ["CLI", "Router", "UX"],
  },
  {
    version: "v1.1.9",
    date: "May 17, 2026",
    dateTr: "17 Mayıs 2026",
    title: "Ghost Mode Boost",
    titleTr: "Ghost Mode İyileştirmeleri",
    description: "Mouse & keyboard automation latency reduced by 40%. Physical control now silky smooth.",
    descriptionTr: "Fare ve klavye otomasyon gecikmesi %40 azaltıldı. Fiziksel kontrol artık çok daha akıcı.",
    type: "improvement",
    tags: ["Ghost", "Latency", "Control"],
  },
  {
    version: "v1.1.8",
    date: "May 14, 2026",
    dateTr: "14 Mayıs 2026",
    title: "World-Mode Cloud Sync",
    titleTr: "World-Mode Bulut Senkronizasyonu",
    description: "Ed25519 identity syncs globally in under 200ms. Zero-knowledge architecture preserved.",
    descriptionTr: "Ed25519 kimliği 200ms'nin altında küresel senkronize ediliyor. Sıfır bilgi korunuyor.",
    type: "feature",
    tags: ["Sync", "Ed25519", "Cloud"],
  },
];

// ── Type config ────────────────────────────────────────────────────────────

const TYPE_CFG = {
  feature: {
    label: "New",    labelTr: "Yeni",
    pill: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    glow: "rgba(52,211,153,0.12)",
    glowHover: "rgba(52,211,153,0.25)",
    border: "rgba(52,211,153,0.18)",
    borderHover: "rgba(52,211,153,0.4)",
    dot: "bg-emerald-400",
    icon: Sparkles,
    iconColor: "text-emerald-400",
    accentBar: "from-emerald-500/50 to-teal-500/50",
  },
  fix: {
    label: "Fix",    labelTr: "Düzeltme",
    pill: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    glow: "rgba(251,113,133,0.10)",
    glowHover: "rgba(251,113,133,0.22)",
    border: "rgba(251,113,133,0.18)",
    borderHover: "rgba(251,113,133,0.38)",
    dot: "bg-rose-400",
    icon: Wrench,
    iconColor: "text-rose-400",
    accentBar: "from-rose-500/50 to-orange-500/50",
  },
  improvement: {
    label: "Improved", labelTr: "İyileştirme",
    pill: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    glow: "rgba(139,92,246,0.10)",
    glowHover: "rgba(139,92,246,0.22)",
    border: "rgba(139,92,246,0.18)",
    borderHover: "rgba(139,92,246,0.38)",
    dot: "bg-violet-400",
    icon: ArrowUp,
    iconColor: "text-violet-400",
    accentBar: "from-violet-500/50 to-indigo-500/50",
  },
};

// ── Float seeds (stable per card) ─────────────────────────────────────────

const FLOAT_SEEDS = [
  { x: [0, 6, -4, 2, 0],   y: [0, -8, 5, -3, 0],  rot: [0, 0.6, -0.4, 0.2, 0],  dur: 7 },
  { x: [0, -5, 8, -2, 0],  y: [0, 6, -9, 4, 0],   rot: [0, -0.5, 0.7, -0.2, 0], dur: 8.5 },
  { x: [0, 8, -6, 3, 0],   y: [0, -5, 7, -4, 0],  rot: [0, 0.4, -0.6, 0.3, 0],  dur: 9.2 },
  { x: [0, -7, 4, -5, 0],  y: [0, 8, -6, 2, 0],   rot: [0, -0.4, 0.5, -0.1, 0], dur: 7.8 },
  { x: [0, 5, -3, 7, 0],   y: [0, -7, 4, -6, 0],  rot: [0, 0.3, -0.5, 0.4, 0],  dur: 10 },
];

// Entry slide directions
const SLIDE_FROM = [
  { x: -60, y: -30, rotate: -4 },
  { x:  60, y: -20, rotate:  3 },
  { x: -40, y:  0,  rotate: -2 },
  { x:  50, y: -10, rotate:  4 },
  { x: -30, y: -40, rotate: -3 },
];

// ── 3-D Tilt card ──────────────────────────────────────────────────────────

function FloatingCard({
  entry,
  index,
  lang,
  isVisible,
}: {
  entry: ChangelogEntry;
  index: number;
  lang: string;
  isVisible: boolean;
}) {
  const cfg = TYPE_CFG[entry.type];
  const isTr = lang === "tr";
  const seed = FLOAT_SEEDS[index % FLOAT_SEEDS.length];
  const from = SLIDE_FROM[index % SLIDE_FROM.length];
  const TypeIcon = cfg.icon;

  // 3D tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 180, damping: 28 });
  const springY = useSpring(rawY, { stiffness: 180, damping: 28 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);
  const glowX   = useTransform(springX, [-0.5, 0.5], [0, 100]);
  const glowY   = useTransform(springY, [-0.5, 0.5], [0, 100]);
  const [hovered, setHovered] = useState(false);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top)  / rect.height - 0.5);
  }, [rawX, rawY]);

  const onMouseLeave = useCallback(() => {
    rawX.set(0); rawY.set(0); setHovered(false);
  }, [rawX, rawY]);

  return (
    <motion.div
      /* Glide-in entrance */
      initial={{ opacity: 0, x: from.x, y: from.y, rotate: from.rotate, scale: 0.88 }}
      animate={isVisible
        ? {
            opacity: 1,
            x: seed.x,
            y: seed.y,
            rotate: seed.rot,
            scale: 1,
            transition: {
              opacity: { duration: 0.5, delay: index * 0.11 },
              x: { delay: index * 0.11, ease: [0.22, 1, 0.36, 1],
                   repeat: Infinity, repeatType: "mirror" as const,
                   repeatDelay: 0, duration: seed.dur },
              y: { delay: index * 0.11, ease: [0.22, 1, 0.36, 1],
                   repeat: Infinity, repeatType: "mirror" as const,
                   repeatDelay: 0, duration: seed.dur * 1.1 },
              rotate: { delay: index * 0.11, ease: [0.22, 1, 0.36, 1],
                        repeat: Infinity, repeatType: "mirror" as const,
                        repeatDelay: 0, duration: seed.dur * 0.9 },
              scale: { duration: 0.55, delay: index * 0.11, ease: [0.22, 1, 0.36, 1] },
            },
          }
        : {}}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.3 } }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", willChange: "transform" }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      ref={cardRef}
    >
      {/* Card shell */}
      <motion.div
        animate={{
          boxShadow: hovered
            ? `0 0 0 1px ${cfg.borderHover}, 0 0 32px -4px ${cfg.glowHover}, 0 20px 50px rgba(0,0,0,0.55)`
            : `0 0 0 1px ${cfg.border}, 0 0 20px -8px ${cfg.glow}, 0 12px 32px rgba(0,0,0,0.4)`,
        }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl overflow-hidden cursor-default select-none"
        style={{ background: "rgba(10,11,16,0.82)", backdropFilter: "blur(20px)" }}
      >
        {/* Accent top bar */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cfg.accentBar}`} />

        {/* Dynamic spotlight on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
          style={{
            background: hovered
              ? `radial-gradient(circle at ${glowX.get()}% ${glowY.get()}%, ${cfg.glowHover} 0%, transparent 65%)`
              : "none",
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-5">
          {/* Top row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              {/* Icon blob */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center
                               ${cfg.pill} border`} style={{ borderColor: cfg.border }}>
                <TypeIcon className={`w-3.5 h-3.5 ${cfg.iconColor}`} />
              </div>

              {/* Version */}
              <div>
                <div className="font-mono text-[11px] text-muted-foreground/50 leading-none mb-0.5">
                  {entry.version}
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full
                                 text-[10px] font-mono font-bold border ${cfg.pill}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {isTr ? cfg.labelTr : cfg.label}
                </div>
              </div>
            </div>

            {/* Date */}
            <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground/40">
              <Clock className="w-2.5 h-2.5" />
              {isTr ? entry.dateTr : entry.date}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-sm font-bold text-foreground/90 mb-1.5 leading-snug">
            {isTr ? entry.titleTr : entry.title}
          </h4>

          {/* Description */}
          <p className="text-xs text-muted-foreground/60 leading-relaxed mb-3">
            {isTr ? entry.descriptionTr : entry.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-mono
                           bg-white/[0.04] border border-white/[0.08] text-muted-foreground/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────

interface FloatingChangelogModalProps {
  open: boolean;
  onClose: () => void;
}

const FloatingChangelogModal = ({ open, onClose }: FloatingChangelogModalProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.split("-")[0] ?? "en";
  const [cardsVisible, setCardsVisible] = useState(false);

  // Stagger cards appearance slightly after overlay opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setCardsVisible(true), 80);
      return () => clearTimeout(t);
    } else {
      setCardsVisible(false);
    }
  }, [open]);

  // ESC key close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0 z-[90]"
            style={{
              background: "radial-gradient(ellipse at 50% 40%, rgba(16,185,129,0.06) 0%, rgba(0,0,0,0.88) 70%)",
              backdropFilter: "blur(12px)",
            }}
          />

          {/* Modal shell */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[91] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-3xl max-h-[90vh] pointer-events-auto
                         rounded-3xl overflow-hidden"
              style={{
                background: "rgba(6,7,10,0.92)",
                backdropFilter: "blur(32px)",
                boxShadow: "0 0 0 1px rgba(52,211,153,0.12), 0 0 80px -20px rgba(52,211,153,0.15), 0 40px 100px rgba(0,0,0,0.7)",
              }}
            >
              {/* Animated conic border glow */}
              <div
                className="absolute -inset-[1px] rounded-3xl -z-10 opacity-60"
                style={{
                  background: "conic-gradient(from 180deg at 50% 50%, #10b981 0deg, #06b6d4 90deg, transparent 180deg, #8b5cf6 270deg, #10b981 360deg)",
                  filter: "blur(2px)",
                }}
              />

              {/* Header */}
              <div
                className="relative flex items-center justify-between px-7 py-5 border-b"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                {/* Left: icon + title */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full" />
                    <div
                      className="relative w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
                    >
                      <Sparkles className="w-4.5 h-4.5 text-emerald-400 w-[18px] h-[18px]" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-foreground">{t("changelog.title")}</h2>
                    <p className="text-[11px] font-mono text-muted-foreground/50 mt-0.5">
                      {t("changelog.subtitle")}
                    </p>
                  </div>

                  {/* Live badge */}
                  <div
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full
                               text-[11px] font-mono text-emerald-400 ml-2"
                    style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.20)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-3.5" />
                    {t("changelog.latestStable")} — v1.2.2
                  </div>
                </div>

                {/* Right: npm link + close */}
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.npmjs.com/package/@must-b/must-b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono
                               text-muted-foreground/40 hover:text-emerald-400 transition-colors"
                  >
                    npm <ExternalLink className="w-2.5 h-2.5" />
                  </a>

                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center
                               text-muted-foreground/50 hover:text-foreground transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Cards grid — scrollable */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]"
                   style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6"
                  style={{ perspective: "1200px" }}
                >
                  <AnimatePresence>
                    {changelogData.map((entry, i) => (
                      <FloatingCard
                        key={entry.version}
                        entry={entry}
                        index={i}
                        lang={lang}
                        isVisible={cardsVisible}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div
                  className="px-6 pb-5 flex items-center justify-between"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-emerald-400/60" />
                    <span className="text-[11px] font-mono text-muted-foreground/40">
                      {t("changelog.footer")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {[
                      { dot: "bg-emerald-400", label: "New" },
                      { dot: "bg-violet-400",  label: "Improved" },
                      { dot: "bg-rose-400",    label: "Fix" },
                    ].map(({ dot, label }) => (
                      <span key={label} className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground/35">
                        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default FloatingChangelogModal;
export type { ChangelogEntry };
