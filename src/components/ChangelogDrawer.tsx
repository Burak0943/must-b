import { motion } from "framer-motion";
import { Sparkles, X, ExternalLink, Tag, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

// ── Changelog data ─────────────────────────────────────────────────────────

export interface ChangelogEntry {
  version: string;
  date: string;
  dateTr: string;
  title: string;
  titleTr: string;
  description: string;
  descriptionTr: string;
  type: "feature" | "fix" | "improvement";
}

export const changelogData: ChangelogEntry[] = [
  {
    version: "v1.2.2",
    date: "May 24, 2026",
    dateTr: "24 Mayıs 2026",
    title: "OpenRouter API Bridge",
    titleTr: "OpenRouter API Köprüsü",
    description:
      "Added Vercel Edge Load Balancer for secure LLM communication between the desktop app and cloud.",
    descriptionTr:
      "Masaüstü uygulaması ile güvenli LLM iletişimi için Vercel Edge Load Balancer eklendi.",
    type: "feature",
  },
  {
    version: "v1.2.1",
    date: "May 22, 2026",
    dateTr: "22 Mayıs 2026",
    title: "Safe Mode",
    titleTr: "Safe Mode (Güvenli Mod)",
    description:
      "Added byok and upgrade options for api_unauthorized state in the must-b core.",
    descriptionTr:
      "Must-b çekirdeği için api_unauthorized durumunda byok ve upgrade seçenekleri eklendi.",
    type: "improvement",
  },
  {
    version: "v1.2.0",
    date: "May 20, 2026",
    dateTr: "20 Mayıs 2026",
    title: "CLI Login & Infinite Loop Fix",
    titleTr: "CLI Login & Infinite Loop Düzeltmesi",
    description:
      "CLI login screen fully redesigned and routing loop issues resolved with zero regressions.",
    descriptionTr:
      "CLI oturum açma ekranı tamamen yenilendi ve routing döngüleri sıfır hatayla çözüldü.",
    type: "fix",
  },
  {
    version: "v1.1.9",
    date: "May 17, 2026",
    dateTr: "17 Mayıs 2026",
    title: "Ghost Mode Improvements",
    titleTr: "Ghost Mode İyileştirmeleri",
    description:
      "Enhanced physical control reliability — mouse & keyboard automation latency reduced by 40%.",
    descriptionTr:
      "Fiziksel kontrol güvenilirliği artırıldı — fare ve klavye otomasyon gecikmesi %40 azaltıldı.",
    type: "improvement",
  },
  {
    version: "v1.1.8",
    date: "May 14, 2026",
    dateTr: "14 Mayıs 2026",
    title: "World-Mode Cloud Sync",
    titleTr: "World-Mode Bulut Senkronizasyonu",
    description:
      "Ed25519 identity now syncs globally in under 200ms. Zero-knowledge architecture preserved.",
    descriptionTr:
      "Ed25519 kimliği artık 200ms'nin altında küresel olarak senkronize ediliyor.",
    type: "feature",
  },
];

// ── Type badge ─────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  feature: {
    label: "New",
    labelTr: "Yeni",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  fix: {
    label: "Fix",
    labelTr: "Düzeltme",
    className: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    dot: "bg-rose-400",
  },
  improvement: {
    label: "Improved",
    labelTr: "İyileştirme",
    className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    dot: "bg-indigo-400",
  },
};

// ── Timeline entry ─────────────────────────────────────────────────────────

function TimelineEntry({
  entry,
  index,
  isLast,
  lang,
}: {
  entry: ChangelogEntry;
  index: number;
  isLast: boolean;
  lang: string;
}) {
  const isTr = lang === "tr";
  const cfg = TYPE_CONFIG[entry.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex gap-4"
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center shrink-0">
        {/* Glowing dot */}
        <div className="relative mt-0.5">
          <span
            className={`absolute -inset-1 rounded-full blur-sm opacity-60 ${cfg.dot}`}
          />
          <span
            className={`relative w-3 h-3 rounded-full border-2 border-[#0d0f14] ${cfg.dot} flex-shrink-0`}
          />
        </div>
        {/* Vertical line */}
        {!isLast && (
          <div className="flex-1 w-px mt-2 bg-gradient-to-b from-white/10 to-transparent min-h-[32px]" />
        )}
      </div>

      {/* Content */}
      <div className="pb-7 flex-1 min-w-0">
        {/* Header row */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${cfg.className}`}
          >
            {isTr ? cfg.labelTr : cfg.label}
          </span>
          <span className="font-mono text-xs font-bold text-primary/80">
            {entry.version}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground/50 ml-auto">
            <Clock className="w-3 h-3" />
            {isTr ? entry.dateTr : entry.date}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-sm font-semibold text-foreground mb-1 leading-snug">
          {isTr ? entry.titleTr : entry.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-muted-foreground/70 leading-relaxed">
          {isTr ? entry.descriptionTr : entry.description}
        </p>
      </div>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

interface ChangelogDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ChangelogDrawer = ({ open, onClose }: ChangelogDrawerProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.split("-")[0] ?? "en";

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md border-l border-white/[0.08]
                   bg-[#09090d]/95 backdrop-blur-2xl p-0 flex flex-col overflow-hidden"
      >
        {/* Custom close button — override default */}
        <SheetClose asChild>
          <button
            className="absolute right-4 top-4 z-10 w-8 h-8 flex items-center justify-center
                       rounded-full bg-white/5 hover:bg-white/10 border border-white/10
                       text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </button>
        </SheetClose>

        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-5 border-b border-white/[0.07] shrink-0">
          <div className="flex items-center gap-3">
            {/* Glow icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400/30 blur-lg rounded-full" />
              <div className="relative w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20
                              flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            <div>
              <SheetTitle className="text-base font-bold text-foreground">
                {t("changelog.title")}
              </SheetTitle>
              <p className="text-xs text-muted-foreground/60 font-mono mt-0.5">
                {t("changelog.subtitle")}
              </p>
            </div>
          </div>

          {/* Live badge */}
          <div className="flex items-center gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono
                             bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t("changelog.latestStable")} — v1.2.2
            </span>
            <a
              href="https://www.npmjs.com/package/@must-b/must-b"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground/50
                         hover:text-primary transition-colors ml-auto"
            >
              npm
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </SheetHeader>

        {/* Timeline scroll area */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 scrollbar-thin
                        scrollbar-track-transparent scrollbar-thumb-white/10">
          {/* Section label */}
          <div className="flex items-center gap-2 mb-5">
            <Tag className="w-3 h-3 text-muted-foreground/40" />
            <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em]">
              {t("changelog.recentUpdates")}
            </span>
          </div>

          {/* Entries */}
          {changelogData.map((entry, i) => (
            <TimelineEntry
              key={entry.version}
              entry={entry}
              index={i}
              isLast={i === changelogData.length - 1}
              lang={lang}
            />
          ))}

          {/* Bottom gradient fade */}
          <div className="h-8" />
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-white/[0.07]
                        bg-gradient-to-t from-black/40 to-transparent">
          <p className="text-[11px] font-mono text-muted-foreground/40 text-center">
            {t("changelog.footer")}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChangelogDrawer;
