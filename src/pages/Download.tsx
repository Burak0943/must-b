import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import MeshBackground from "@/components/MeshBackground";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Monitor,
  Apple,
  Terminal,
  Download,
  ArrowRight,
  Zap,
  Shield,
  Cpu,
  CheckCircle2,
} from "lucide-react";

// ── Animation variants ──────────────────────────────────────────────────────

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ── Types ───────────────────────────────────────────────────────────────────

interface DownloadCardProps {
  icon: React.ComponentType<{ className?: string }>;
  os: string;
  version: string;
  arch: string;
  size: string;
  badge?: string;
  badgeColor?: string;
  downloadHref: string;
  delay?: number;
}

// ── Subcomponents ───────────────────────────────────────────────────────────

const DownloadCard = ({
  icon: Icon,
  os,
  version,
  arch,
  size,
  badge,
  badgeColor = "emerald",
  downloadHref,
  delay = 0,
}: DownloadCardProps) => {
  const isEmerald = badgeColor === "emerald";
  const isCyan = badgeColor === "cyan";

  return (
    <motion.div
      variants={cardVariants}
      transition={{ delay }}
      className="group relative"
      whileHover={{ y: -4 }}
    >
      {/* Animated glow border on hover */}
      <div
        className="absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isEmerald
            ? "linear-gradient(135deg, rgba(16,185,129,0.4) 0%, rgba(6,182,212,0.2) 50%, rgba(16,185,129,0.4) 100%)"
            : isCyan
            ? "linear-gradient(135deg, rgba(6,182,212,0.4) 0%, rgba(16,185,129,0.2) 50%, rgba(6,182,212,0.4) 100%)"
            : "linear-gradient(135deg, rgba(139,92,246,0.4) 0%, rgba(6,182,212,0.2) 50%, rgba(139,92,246,0.4) 100%)",
        }}
      />

      <div
        className="relative h-full rounded-3xl p-8 flex flex-col gap-6 backdrop-blur-xl transition-all duration-500"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset",
        }}
      >
        {/* Icon + OS name */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: isEmerald
                  ? "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.08))"
                  : isCyan
                  ? "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(16,185,129,0.08))"
                  : "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.08))",
                border: isEmerald
                  ? "1px solid rgba(16,185,129,0.2)"
                  : isCyan
                  ? "1px solid rgba(6,182,212,0.2)"
                  : "1px solid rgba(139,92,246,0.2)",
              }}
            >
              <Icon
                className="w-7 h-7"
                style={{
                  color: isEmerald ? "#10b981" : isCyan ? "#06b6d4" : "#a78bfa",
                }}
              />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">{os}</h3>
              <p className="text-sm text-white/40 font-mono mt-0.5">{arch}</p>
            </div>
          </div>

          {badge && (
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
              style={{
                background: isEmerald
                  ? "rgba(16,185,129,0.1)"
                  : isCyan
                  ? "rgba(6,182,212,0.1)"
                  : "rgba(139,92,246,0.1)",
                border: isEmerald
                  ? "1px solid rgba(16,185,129,0.25)"
                  : isCyan
                  ? "1px solid rgba(6,182,212,0.25)"
                  : "1px solid rgba(139,92,246,0.25)",
                color: isEmerald ? "#34d399" : isCyan ? "#22d3ee" : "#c4b5fd",
              }}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-6 text-xs text-white/35 font-mono">
          <span>v{version}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>{size}</span>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full"
          style={{
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)",
          }}
        />

        {/* Download button */}
        <a
          id={`download-${os.toLowerCase().replace(/\s+/g, "-")}`}
          href={downloadHref}
          className="group/btn relative flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300"
          style={{
            background: isEmerald
              ? "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.06))"
              : isCyan
              ? "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(16,185,129,0.06))"
              : "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.06))",
            border: isEmerald
              ? "1px solid rgba(16,185,129,0.2)"
              : isCyan
              ? "1px solid rgba(6,182,212,0.2)"
              : "1px solid rgba(139,92,246,0.2)",
            color: isEmerald ? "#34d399" : isCyan ? "#22d3ee" : "#c4b5fd",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = isEmerald
              ? "linear-gradient(135deg, rgba(16,185,129,0.22), rgba(6,182,212,0.12))"
              : isCyan
              ? "linear-gradient(135deg, rgba(6,182,212,0.22), rgba(16,185,129,0.12))"
              : "linear-gradient(135deg, rgba(139,92,246,0.22), rgba(6,182,212,0.12))";
            el.style.boxShadow = isEmerald
              ? "0 0 24px rgba(16,185,129,0.25), 0 0 8px rgba(16,185,129,0.15)"
              : isCyan
              ? "0 0 24px rgba(6,182,212,0.25), 0 0 8px rgba(6,182,212,0.15)"
              : "0 0 24px rgba(139,92,246,0.25), 0 0 8px rgba(139,92,246,0.15)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = isEmerald
              ? "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.06))"
              : isCyan
              ? "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(16,185,129,0.06))"
              : "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(6,182,212,0.06))";
            el.style.boxShadow = "none";
          }}
        >
          <Download className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5" />
          <span>İndir</span>
          <ArrowRight className="w-4 h-4 ml-auto opacity-40 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-300" />
        </a>
      </div>
    </motion.div>
  );
};

// ── Feature pill ─────────────────────────────────────────────────────────────

const FeaturePill = ({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) => (
  <div
    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <Icon className="w-4 h-4 text-emerald-400/70" />
    {text}
  </div>
);

// ── Main Page ────────────────────────────────────────────────────────────────

export default function Download() {
  const platforms: DownloadCardProps[] = [
    {
      icon: Monitor,
      os: "Windows",
      version: "0.1.0",
      arch: "x64 · ARM64",
      size: "Yakında",
      badge: "Stable",
      badgeColor: "emerald",
      downloadHref: "#",
    },
    {
      icon: Apple,
      os: "macOS",
      version: "0.1.0",
      arch: "Intel · Apple Silicon",
      size: "Yakında",
      badge: "Stable",
      badgeColor: "cyan",
      downloadHref: "#",
    },
    {
      icon: Terminal,
      os: "Linux",
      version: "0.1.0",
      arch: "x86_64 · ARM64",
      size: "Yakında",
      badge: "Stable",
      badgeColor: "purple",
      downloadHref: "#",
    },
  ];

  const features = [
    { icon: Zap, text: "Anında Kurulum" },
    { icon: Shield, text: "Güvenli & İmzalı" },
    { icon: Cpu, text: "Native Performans" },
    { icon: CheckCircle2, text: "Otomatik Güncelleme" },
  ];

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="relative overflow-hidden min-h-screen"
    >
      <MeshBackground />
      <Navbar />

      {/* ── Ambient glow behind hero ──────────────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
      >
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[160px] opacity-[0.06]"
          style={{
            background:
              "radial-gradient(ellipse, #10b981 0%, #06b6d4 50%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-24 md:pt-36 pb-8 px-6 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-5">
          <span
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.3em] px-4 py-2 rounded-full"
            style={{
              background: "rgba(16,185,129,0.07)",
              border: "1px solid rgba(16,185,129,0.18)",
              color: "#34d399",
            }}
          >
            <span className="pulse-dot" />
            Çekirdek İstasyonu
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight"
          style={{
            background: "linear-gradient(to bottom, #ffffff 30%, rgba(255,255,255,0.38))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Must-b Çekirdek{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #10b981 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "hero-gradient-shift 4s ease infinite",
            }}
          >
            İstasyonuna
          </span>
          <br />
          Hoş Geldiniz
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Otonom ajan altyapınızı yerel makinenizde çalıştırın. Platformunuzu seçin,
          indirin ve saniyeler içinde must-b evreninize bağlanın.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {features.map((f) => (
            <FeaturePill key={f.text} icon={f.icon} text={f.text} />
          ))}
        </motion.div>
      </section>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6">
        <div
          className="h-px w-full my-10"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(16,185,129,0.2), rgba(6,182,212,0.2), transparent)",
          }}
        />
      </div>

      {/* ── Platform cards ───────────────────────────────────────────────── */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {platforms.map((p, i) => (
              <DownloadCard key={p.os} {...p} delay={i * 0.1} />
            ))}
          </div>

          {/* CLI alternative */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div
                className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.15)",
                }}
              >
                <Terminal className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white/80">CLI üzerinden kurulum</p>
                <code
                  className="text-xs font-mono text-emerald-400/70 break-all"
                >
                  npm install -g @must-b/core
                </code>
              </div>
            </div>
            <span
              className="text-xs font-mono text-white/25 shrink-0"
            >
              npm · bun · pnpm desteklenir
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Changelog teaser ─────────────────────────────────────────────── */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 70%), rgba(255,255,255,0.02)",
              border: "1px solid rgba(16,185,129,0.1)",
            }}
          >
            {/* Decorative top line */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(16,185,129,0.5), transparent)",
              }}
            />

            <div
              className="inline-block text-xs font-mono font-bold uppercase tracking-[0.3em] px-3 py-1.5 rounded-full mb-4"
              style={{
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.15)",
                color: "#34d399",
              }}
            >
              v0.1.0 — İlk Sürüm
            </div>

            <h2
              className="text-3xl md:text-4xl font-black mb-3 tracking-tight"
              style={{
                background:
                  "linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.45))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Altyapı Hazır, Yayın Yakında
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
              İndirme paketlerimiz son test aşamasında. Erken erişim için bültenimize
              kayıt olun ve ilk indiren olun.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                id="notify-cta"
                href="#"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 text-black"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981, #06b6d4)",
                  boxShadow: "0 0 30px rgba(16,185,129,0.3), 0 0 8px rgba(6,182,212,0.2)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 0 50px rgba(16,185,129,0.5), 0 0 20px rgba(6,182,212,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 0 30px rgba(16,185,129,0.3), 0 0 8px rgba(6,182,212,0.2)";
                }}
              >
                <Zap className="w-4 h-4" />
                Erken Erişim Bildirimini Al
              </a>
              <a
                id="docs-cta"
                href="/docs"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 text-white/60 hover:text-white/90"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Dokümanlara Göz At
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />

      {/* ── Keyframes ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes hero-gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
      `}</style>
    </motion.main>
  );
}
