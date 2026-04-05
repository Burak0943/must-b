import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Download, ArrowLeft, CheckCircle2,
  Star, Package, BookOpen, Puzzle, Globe
} from "lucide-react";
import Navbar from "@/components/Navbar";
import hubData from "@/data/mustb-hub-data.json";

// ── Helpers ───────────────────────────────────────────────────────────────

type Item = (typeof hubData.skills)[0];

function getItem(type: string, id: string): Item | null {
  const list = type === "plugins" ? hubData.plugins : hubData.skills;
  return (list as Item[]).find((x) => String(x.id) === id) ?? null;
}

// ── Markdown-ish renderer (lightweight) ──────────────────────────────────
// Lightweight line-based renderer — no external dep needed.

function MarkdownBlock({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        // H2
        if (line.startsWith("## "))
          return (
            <h2 key={i} className="text-base font-bold text-white mt-5 mb-2 first:mt-0">
              {line.slice(3)}
            </h2>
          );
        // H3
        if (line.startsWith("### "))
          return (
            <h3 key={i} className="text-sm font-semibold text-white/90 mt-4 mb-1.5">
              {line.slice(4)}
            </h3>
          );
        // Code block fence — handled as group below
        if (line.startsWith("```"))
          return null; // fences stripped; code lines render below
        // Bullet
        if (line.startsWith("- "))
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-cyan-400/60 mt-2 shrink-0" />
              <span className="text-white/60">{line.slice(2)}</span>
            </div>
          );
        // Blank line
        if (line.trim() === "")
          return <div key={i} className="h-1" />;
        // Default paragraph
        return (
          <p key={i} className="text-white/60">
            {line}
          </p>
        );
      })}
    </div>
  );
}

// Renders code blocks (```...```) as styled pre elements
function IntegrationGuideBlock({ content }: { content: string }) {
  const segments: { type: "text" | "code"; value: string }[] = [];
  const parts = content.split(/```[a-z]*\n?/);

  parts.forEach((part, i) => {
    if (i % 2 === 0) {
      segments.push({ type: "text", value: part });
    } else {
      segments.push({ type: "code", value: part.replace(/```$/, "") });
    }
  });

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {segments.map((seg, i) => {
        if (seg.type === "code") {
          return (
            <pre
              key={i}
              className="bg-black/60 border border-white/[0.08] rounded-xl px-5 py-4
                         font-mono text-xs text-cyan-300 overflow-x-auto"
            >
              {seg.value.trim()}
            </pre>
          );
        }
        return <MarkdownBlock key={i} content={seg.value} />;
      })}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function HubDetail() {
  const { type = "skills", id = "" } = useParams<{ type: string; id: string }>();
  const item = getItem(type, id);

  if (!item) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-white/40">Package not found.</p>
            <Link to="/ecosystem" className="text-cyan-400 text-sm hover:underline">
              ← Back to Ecosystem
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const downloadUrl = (item as any).download_url ?? "#";

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* ── Back link ── */}
        <Link
          to="/ecosystem"
          className="inline-flex items-center gap-1.5 text-xs text-white/40
                     hover:text-white/70 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Ecosystem
        </Link>

        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-start gap-6 mb-10"
        >
          {/* Icon */}
          <div className="shrink-0 w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20
                          flex items-center justify-center text-cyan-400">
            <Package className="w-7 h-7" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + Certified */}
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {item.name}
              </h1>
              {item.is_certified && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                                 bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Must-b Certified
                </span>
              )}
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-4 text-xs text-white/40 flex-wrap mb-3">
              <span className="font-mono">{item.version}</span>
              <span>by <span className="text-white/60">{item.author}</span></span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400/70" />
                {item.stars}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {item.downloads}
              </span>
            </div>

            {/* OS Badges */}
            <div className="flex gap-1.5 flex-wrap">
              {item.os.map((os) => (
                <span
                  key={os}
                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full
                             bg-white/[0.04] border border-white/[0.08] text-white/50"
                >
                  <Globe className="w-2.5 h-2.5" />
                  {os}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── DOWNLOAD .ZIP — Devasa CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <a
            href={downloadUrl}
            className="group relative w-full flex items-center justify-center gap-3
                       py-5 rounded-2xl font-bold text-lg
                       bg-cyan-500 text-black
                       hover:bg-cyan-400 transition-all duration-300
                       shadow-[0_0_40px_hsl(192_91%_43%/0.35)]
                       hover:shadow-[0_0_60px_hsl(192_91%_43%/0.55)]"
          >
            <motion.span
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Download className="w-6 h-6" />
            </motion.span>
            DOWNLOAD .ZIP
            <span className="text-sm font-normal opacity-70 ml-1">
              {item.version}
            </span>
          </a>
          <p className="text-center text-[11px] text-white/25 mt-3">
            Compatible with Must-b Core · License: MIT · Requires Node 18+
          </p>
        </motion.div>

        {/* ── Content Grid ── */}
        <div className="space-y-6">

          {/* README */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/[0.025] border border-white/[0.07] rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white/80">Documentation</span>
              <span className="ml-auto text-[10px] text-white/25 font-mono">README.md</span>
            </div>
            {/* Body */}
            <div className="px-6 py-6">
              {item.readme ? (
                <MarkdownBlock content={item.readme} />
              ) : (
                <p className="text-white/30 text-sm">Documentation not found.</p>
              )}
            </div>
          </motion.div>

          {/* Integration Guide */}
          {item.integration_guide && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white/[0.025] border border-cyan-500/15 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-cyan-500/[0.12] bg-cyan-500/[0.04]">
                <Puzzle className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white/80">Integration Guide</span>
                <span className="ml-auto text-[10px] text-cyan-400/50 font-mono">integration_guide.md</span>
              </div>
              {/* Body — with code block support */}
              <div className="px-6 py-6">
                <IntegrationGuideBlock content={item.integration_guide} />
              </div>
            </motion.div>
          )}

          {/* Secondary Download */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between px-6 py-4
                       bg-white/[0.02] border border-white/[0.06] rounded-2xl"
          >
            <div className="text-sm text-white/40">
              Version <span className="text-white/60 font-mono">{item.version}</span> · {item.author}
            </div>
            <a
              href={downloadUrl}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold
                         border border-cyan-500/30 text-cyan-400
                         hover:bg-cyan-500/10 transition-all duration-200"
            >
              <Download className="w-3.5 h-3.5" />
              Download .ZIP
            </a>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
