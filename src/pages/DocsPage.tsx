import { motion } from "framer-motion";
import { BookOpen, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

// ── Sidebar menu structure ────────────────────────────────────────────────

const SIDEBAR = [
  {
    group: "Overview",
    items: ["Introduction", "Quick Start", "Installation", "Architecture"],
  },
  {
    group: "Agent Architecture",
    items: ["Swarm Model", "Task Graph", "Sub-Agent System", "Memory Layer"],
  },
  {
    group: "API Reference",
    items: ["REST Endpoints", "WebSocket API", "Webhook Events", "SDK — Node.js", "SDK — Python"],
  },
  {
    group: "Developer Guide",
    items: ["Writing Skills", "Plugin Development", "Testing & Debug", "Deployment"],
  },
  {
    group: "Integrations",
    items: ["Stripe", "AWS", "OpenAI", "GitHub", "Slack"],
  },
];

// ── Sidebar component ─────────────────────────────────────────────────────

function Sidebar() {
  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-6 border-r border-white/[0.06] px-5 py-8 sticky top-0 h-screen overflow-y-auto">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 mb-2 group">
        <img src="/mascot.png" alt="must-b" className="w-6 h-6 object-contain" />
        <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">
          must-b <span className="text-white/30 font-normal">/ docs</span>
        </span>
      </Link>

      {/* Nav groups */}
      <nav className="space-y-6">
        {SIDEBAR.map(({ group, items }) => (
          <div key={group}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 mb-2.5 px-1">
              {group}
            </p>
            <ul className="space-y-0.5">
              {items.map((item) => (
                <li key={item}>
                  <span
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg
                               text-[13px] text-white/25 cursor-not-allowed select-none"
                  >
                    {item}
                    <Lock className="w-3 h-3 opacity-40 shrink-0" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Version badge */}
      <div className="mt-auto pt-6 border-t border-white/[0.06]">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-white/25">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
          v1.2.2 — docs coming soon
        </span>
      </div>
    </aside>
  );
}

// ── Coming Soon content ───────────────────────────────────────────────────

function ComingSoon() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-lg w-full text-center space-y-8"
      >
        {/* Animated icon */}
        <div className="relative flex justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.05, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-cyan-500/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.1, 0.25] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="absolute inset-0 rounded-full bg-cyan-400/15 blur-2xl"
          />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-24 h-24 rounded-3xl
                       bg-gradient-to-br from-cyan-500/20 to-cyan-600/5
                       border border-cyan-500/25
                       flex items-center justify-center
                       shadow-[0_0_60px_hsl(192_91%_43%/0.2)]"
          >
            <BookOpen className="w-10 h-10 text-cyan-400" strokeWidth={1.5} />
            <span className="absolute top-2.5 left-2.5 w-1 h-1 rounded-full bg-cyan-400/40" />
            <span className="absolute top-2.5 right-2.5 w-1 h-1 rounded-full bg-cyan-400/40" />
            <span className="absolute bottom-2.5 left-2.5 w-1 h-1 rounded-full bg-cyan-400/20" />
            <span className="absolute bottom-2.5 right-2.5 w-1 h-1 rounded-full bg-cyan-400/20" />
          </motion.div>
        </div>

        {/* Text */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                       bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold"
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            />
            In Progress
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Must-b Core<br />
            <span className="text-white/40">Documentation</span>
          </h1>

          <p className="text-sm text-white/45 leading-relaxed max-w-sm mx-auto">
            Detailed technical documentation, integration guides, and API references
            for the autonomous agent ecosystem are being prepared.
            <strong className="text-white/60"> Coming soon.</strong>
          </p>
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-[11px] text-white/30 px-1">
            <span>Content readiness</span>
            <span className="text-cyan-400/70">68%</span>
          </div>
          <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "68%" }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
            />
          </div>
        </motion.div>

        {/* Skeleton cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3 text-left"
        >
          {[
            { label: "Quick Start",       pct: "90%" },
            { label: "API Reference",     pct: "75%" },
            { label: "Skill Development", pct: "60%" },
            { label: "Plugin Guide",      pct: "45%" },
          ].map(({ label, pct }) => (
            <div
              key={label}
              className="bg-white/[0.025] border border-white/[0.06] rounded-xl p-3.5 space-y-2"
            >
              <div className="text-xs text-white/50 font-medium">{label}</div>
              <div className="w-full h-0.5 rounded-full bg-white/[0.06]">
                <div
                  className="h-full bg-cyan-500/40 rounded-full"
                  style={{ width: pct }}
                />
              </div>
              <div className="text-[10px] text-white/25">{pct} complete</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70
                       transition-colors border-b border-white/20 hover:border-white/40 pb-0.5"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <ComingSoon />
      </div>
    </div>
  );
}
