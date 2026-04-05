import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Download, CheckCircle2, ChevronRight, Cpu, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import hubData from "@/data/mustb-hub-data.json";

// ── Types ─────────────────────────────────────────────────────────────────

type Tab = "skills" | "plugins" | "hakkinda";
type Item = (typeof hubData.skills)[0] | (typeof hubData.plugins)[0];

// ── Must-b Certified Badge ────────────────────────────────────────────────

function CertifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                     bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0 whitespace-nowrap">
      <CheckCircle2 className="w-3 h-3" />
      Must-b Certified
    </span>
  );
}

// ── List Row ──────────────────────────────────────────────────────────────

function ListRow({ item, type, index }: { item: Item; type: "skills" | "plugins"; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        to={`/ecosystem/${type}/${item.id}`}
        className="group flex items-center gap-4 md:gap-6 px-5 md:px-7 py-4 md:py-5
                   border-b border-white/[0.05] last:border-0
                   hover:bg-white/[0.03] transition-all duration-200 cursor-pointer"
      >
        {/* Icon */}
        <div className="shrink-0 w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/15
                        flex items-center justify-center text-cyan-400
                        group-hover:bg-cyan-500/20 group-hover:border-cyan-500/25 transition-all">
          <Package className="w-4 h-4" />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-0.5 flex-wrap">
            <span className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
              {item.name}
            </span>
            {item.is_certified && <CertifiedBadge />}
            <span className="text-[11px] text-white/30 font-mono shrink-0">{item.version}</span>
          </div>
          <p className="text-xs text-white/50 line-clamp-1 leading-relaxed">
            {item.summary}
          </p>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          {/* Stars */}
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <Star className="w-3.5 h-3.5 text-amber-400/70" />
            <span>{item.stars}</span>
          </div>
          {/* Downloads */}
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <Download className="w-3.5 h-3.5" />
            <span>{item.downloads}</span>
          </div>
          {/* OS Chips */}
          <div className="flex gap-1">
            {item.os.slice(0, 3).map((os) => (
              <span key={os} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] text-white/30 border border-white/[0.06]">
                {os}
              </span>
            ))}
          </div>
        </div>

        {/* Chevron */}
        <ChevronRight className="w-4 h-4 text-white/20 shrink-0 group-hover:text-cyan-400
                                  group-hover:translate-x-0.5 transition-all duration-200" />
      </Link>
    </motion.div>
  );
}

// ── Hakkında Tab ──────────────────────────────────────────────────────────

function AboutTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-16 px-6 text-center space-y-6"
    >
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20
                      flex items-center justify-center mx-auto">
        <Cpu className="w-7 h-7 text-cyan-400" />
      </div>
      <h2 className="text-2xl font-bold text-white">Must-b Hub Nedir?</h2>
      <p className="text-white/50 leading-relaxed text-sm">
        Must-b Hub, otonom yapay zeka ajanlarını gerçek dünya servisleriyle buluşturan
        açık bir ekosistem pazar yeridir. Stripe'tan AWS'ye, OpenAI'dan Datadog'a kadar
        yüzlerce profesyonel entegrasyon, tek bir merkezden yönetilir.
      </p>
      <div className="grid grid-cols-3 gap-4 pt-4">
        {[
          { label: "Skill", value: hubData.counts.skills },
          { label: "Plugin", value: hubData.counts.plugins },
          { label: "Yazar", value: "1,200+" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
            <div className="text-2xl font-bold text-cyan-400">{value}</div>
            <div className="text-xs text-white/40 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function MustbHub() {
  const [activeTab, setActiveTab] = useState<Tab>("skills");

  const items = activeTab === "skills"
    ? hubData.skills
    : activeTab === "plugins"
    ? hubData.plugins
    : [];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* ── Page Header ── */}
      <section className="pt-8 pb-10 px-6 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-[11px] font-semibold text-cyan-400 uppercase tracking-[0.2em] mb-3">
              Must-b Hub
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Ekosistem
            </h1>
            <p className="text-white/50 text-sm max-w-lg">
              Stripe, AWS, OpenAI ve daha fazlası için hazır Must-b entegrasyonları.
              Tek tıkla indir, konfigüre et, çalıştır.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-6 mt-6 text-xs text-white/40"
          >
            <span><span className="text-white/70 font-semibold">{hubData.counts.skills}</span> skill</span>
            <span className="w-px h-4 bg-white/10" />
            <span><span className="text-white/70 font-semibold">{hubData.counts.plugins}</span> plugin</span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Canlı
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Tab Bar ── */}
      <div className="sticky top-0 z-30 bg-[#050505]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-1 py-2">
          {(["skills", "plugins", "hakkinda"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
                activeTab === tab
                  ? "text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="hub-tab-pill"
                  className="absolute inset-0 bg-white/[0.07] rounded-lg border border-white/[0.10]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {tab === "skills" ? "Skills" : tab === "plugins" ? "Plugins" : "Hakkında"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── List / About Content ── */}
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "hakkinda" ? (
            <AboutTab key="about" />
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border border-white/[0.06] rounded-2xl mx-6 mt-6 mb-12 overflow-hidden"
            >
              {/* List header */}
              <div className="flex items-center gap-4 px-5 md:px-7 py-3 border-b border-white/[0.06]
                              bg-white/[0.02] text-[10px] uppercase tracking-widest text-white/30">
                <span className="w-10 shrink-0" />
                <span className="flex-1">İSİM</span>
                <div className="hidden md:flex items-center gap-5 shrink-0 pr-8">
                  <span className="w-12 text-right">YILDIZ</span>
                  <span className="w-16 text-right">İNDİRME</span>
                  <span className="w-24 text-center">PLATFORM</span>
                </div>
              </div>

              {/* Rows */}
              {items.map((item, i) => (
                <ListRow key={item.id} item={item} type={activeTab as "skills" | "plugins"} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}