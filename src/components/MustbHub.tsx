import { useState, memo } from "react";
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

const ListRow = memo(function ListRow({ item, type, index }: { item: Item; type: "skills" | "plugins"; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index, 15) * 0.02, ease: [0.25, 0.1, 0.25, 1] }}
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
});

// ── Hakkında Tab ──────────────────────────────────────────────────────────

function AboutTab() {
  const pillars = [
    {
      icon: "⚡",
      title: "Yerel Yürütme",
      desc: "Model ağırlıkları doğrudan senin donanımında çalışır. Hiçbir veri, işlem sonucu veya komut buluta gitmez. Sıfır gecikme, tam gizlilik.",
    },
    {
      icon: "🧠",
      title: "Swarm Zekası",
      desc: "Bir üst seviye ajan, görevi alt ajanlara parçalar. Her alt ajan bağımsız uzmanlık alanında çalışır; sonuçlar birleştirilir ve tek bir tutarlı çıktı üretilir.",
    },
    {
      icon: "🔐",
      title: "Ed25519 Kimlik Katmanı",
      desc: "Kurulum sırasında yerel olarak oluşturulan anahtar çifti, ajanın dünya kimliğini tanımlar. Bulut senkronizasyonu opt-in'dir ve uçtan uca imzalıdır.",
    },
    {
      icon: "🔌",
      title: "Modüler Ekosistem",
      desc: "Must-b Hub üzerindeki her Skill ve Plugin, sisteme plug-and-play olarak eklenir. API anahtarı — config — çalıştır; bu kadar.",
    },
    {
      icon: "📡",
      title: "CloudAuth & World Sync",
      desc: "Birden fazla yerel ajan, CloudAuth protokolü aracılığıyla tek bir bulut kimliğine bağlanır. World modu sayesinde ajanlar birbirinden öğrenir.",
    },
    {
      icon: "🏗️",
      title: "Araç Zinciri (Tool Chain)",
      desc: "Must-b, bir görevi tamamlamak için sıralı araç çağrıları zinciri kurar: web arama → dosya yazma → git commit → PR açma — hepsi tek komutla.",
    },
  ];

  const timeline = [
    { year: "2023 Q4", label: "Proje başlatıldı", desc: "Must-b'nin ilk prototipi, Ed25519 kimlik katmanıyla birlikte hayata geçirildi." },
    { year: "2024 Q2", label: "İlk public beta", desc: "Terminal Executor ve VS Code Bridge plugin'leri yayınlandı. 10.000+ ilk kullanıcı." },
    { year: "2024 Q4", label: "Swarm motoru", desc: "Çok katmanlı ajan swarm mimarisi tamamlandı. Paralel görev dağıtımı aktif." },
    { year: "2025 Q1", label: "Must-b Hub açıldı", desc: "Ekosistem pazar yeri: 500+ entegrasyon, topluluk katkıları ve sertifika programı." },
    { year: "2025 Q3", label: "World Sync v2", desc: "Ajanlar arası öğrenme ve hafıza transferi protokolü yayınlandı." },
    { year: "2026", label: "Must-b Core 3.0", desc: "Şu an buradayız. 1.422 skill, 948 plugin, küresel swarm ağı." },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12 px-6 space-y-16"
    >
      {/* Hero */}
      <div className="text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20
                        flex items-center justify-center mx-auto text-2xl">
          🦊
        </div>
        <h2 className="text-3xl font-bold text-white">What is Must-b Core?</h2>
        <p className="text-white/50 leading-relaxed text-sm max-w-xl mx-auto">
          Must-b is a <strong className="text-white/80">next-generation AI agent framework</strong> that
          runs on your local hardware, syncs via the cloud, and distributes tasks across autonomous agent swarms.
          Write a command — Must-b plans, splits, executes, and delivers.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { value: "1,422", label: "Skills" },
          { value: "948",   label: "Plugins" },
          { value: "3.5M+", label: "Downloads" },
          { value: "50K+",  label: "Active Agents" },
        ].map(({ value, label }) => (
          <div key={label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 text-center">
            <div className="text-xl font-bold text-cyan-400">{value}</div>
            <div className="text-xs text-white/40 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-white/[0.07] pb-3">
          How Does the Autonomous Agent Ecosystem Work?
        </h3>
        <div className="space-y-4 text-sm text-white/55 leading-relaxed">
          <p>
            Traditional software tools require human intervention to complete a task.
            Must-b does the opposite: it takes a <strong className="text-white/75">natural-language command</strong>,
            draws a task graph with an internal LLM (GPT-4o or Claude), and assigns
            a specialised sub-agent to each node.
          </p>
          <p>
            Every Must-b agent can be extended with a <strong className="text-white/75">Skill</strong> or
            a <strong className="text-white/75">Plugin</strong>.
            Skills are adapter layers that talk to a specific external service — listening to Stripe events,
            deploying to AWS, opening GitHub PRs. Plugins enhance the agent's core capabilities:
            terminal access, browser automation, long-term memory.
          </p>
          <p>
            Results are merged by a top-level coordinator agent and delivered to the user as a single
            coherent output. Throughout the entire process, no data leaves your local machine —
            the model, tool calls, and file system remain fully local.
          </p>
        </div>
      </div>

      {/* Core pillars */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-white/[0.07] pb-3">
          Core Architecture Pillars
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {pillars.map(({ icon, title, desc }) => (
            <div key={title}
              className="bg-white/[0.025] border border-white/[0.07] rounded-2xl p-5 space-y-2
                         hover:border-cyan-500/20 hover:bg-white/[0.04] transition-all duration-200">
              <div className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-semibold text-white">{title}</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-white/[0.07] pb-3">
          Roadmap &amp; History
        </h3>
        <div className="relative space-y-6 ml-4">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-white/[0.08]" />
          {timeline.map(({ year, label, desc }, i) => (
            <div key={i} className="relative flex gap-5">
              <div className="absolute -left-[17px] w-3 h-3 rounded-full bg-cyan-500/30 border border-cyan-500/50 mt-0.5" />
              <div className="pl-4 space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-cyan-400/70">{year}</span>
                  <span className="text-sm font-semibold text-white">{label}</span>
                </div>
                <p className="text-xs text-white/45 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-cyan-500/[0.07] border border-cyan-500/20 rounded-2xl p-6 text-center space-y-4">
        <p className="text-sm text-white/60 leading-relaxed max-w-md mx-auto">
          Running Must-b on your local machine takes a single line.
          Setup &lt; 90 seconds, zero configuration.
        </p>
        <a href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                     bg-cyan-500 text-black font-semibold text-sm
                     hover:bg-cyan-400 transition-all
                     shadow-[0_0_24px_hsl(192_91%_43%/0.35)]">
          Go to Home →
        </a>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────

const PAGE_SIZE = 30;

export default function MustbHub() {
  const [activeTab, setActiveTab] = useState<Tab>("skills");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const allItems = activeTab === "skills"
    ? hubData.skills
    : activeTab === "plugins"
    ? hubData.plugins
    : [];

  const items = allItems.slice(0, visibleCount);
  const hasMore = visibleCount < allItems.length;

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
              Ecosystem
            </h1>
            <p className="text-white/50 text-sm max-w-lg">
              Ready-made Must-b integrations for Stripe, AWS, OpenAI, and more.
              Download in one click, configure, and run.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-6 mt-6 text-xs text-white/40"
          >
            <span><span className="text-white/70 font-semibold">{hubData.counts.skills}</span> skills</span>
            <span className="w-px h-4 bg-white/10" />
            <span><span className="text-white/70 font-semibold">{hubData.counts.plugins}</span> plugins</span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
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
              onClick={() => { setActiveTab(tab); setVisibleCount(PAGE_SIZE); }}
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
                {tab === "skills" ? "Skills" : tab === "plugins" ? "Plugins" : "About"}
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
                <span className="flex-1">NAME</span>
                <div className="hidden md:flex items-center gap-5 shrink-0 pr-8">
                  <span className="w-12 text-right">STARS</span>
                  <span className="w-16 text-right">DOWNLOADS</span>
                  <span className="w-24 text-center">PLATFORM</span>
                </div>
              </div>

              {/* Rows */}
              {items.map((item, i) => (
                <ListRow key={item.id} item={item} type={activeTab as "skills" | "plugins"} index={i} />
              ))}

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center py-6">
                  <button
                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest
                               border border-white/10 text-white/50 hover:text-white hover:border-cyan-500/40
                               hover:bg-cyan-500/5 transition-all duration-200"
                  >
                    Load More ({allItems.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}