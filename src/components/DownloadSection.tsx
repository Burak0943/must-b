import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import {
  Download, ChevronRight, Monitor, Apple, Terminal,
  Cloud, Zap, Check, Copy, CheckCheck, ExternalLink,
} from "lucide-react";

// ── Step data ──────────────────────────────────────────────────────────────

const steps = [
  {
    step: "01",
    title: "Install via npm",
    desc: "One command. No binaries to hunt down. npm installs the must-b CLI globally — works on macOS, Windows 11, and Linux.",
    icon: Terminal,
    detail: "npm install -g @must-b/must-b@latest",
  },
  {
    step: "02",
    title: "Sync Identity",
    desc: "Run `must-b gateway` then connect your cloud profile from the browser. Your Ed25519 keys are generated locally — nothing leaves your machine.",
    icon: Cloud,
    detail: "Zero-knowledge authentication protocol.",
  },
  {
    step: "03",
    title: "Execute",
    desc: "Your agent is live. It runs locally, syncs globally via CloudAuth, and scales infinitely across the Must-b Worlds network.",
    icon: Zap,
    detail: "Sub-millisecond latency. Always on.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

// ── Platform tabs ──────────────────────────────────────────────────────────

type Platform = "npm" | "windows" | "unix";

interface TermLine {
  prompt: string;
  cmd: string;
  comment?: string;
}

const PLATFORM_CONTENT: Record<Platform, { shellLabel: string; lines: TermLine[] }> = {
  npm: {
    shellLabel: "bash / zsh / PowerShell",
    lines: [
      { prompt: "$", cmd: "npm install -g @must-b/must-b@latest" },
      { prompt: "$", cmd: "must-b gateway", comment: "# wake the Fox" },
    ],
  },
  windows: {
    shellLabel: "PowerShell",
    lines: [
      {
        prompt: "PS>",
        cmd: "irm https://must-b.com/install.ps1 | iex",
        comment: "# one-line installer",
      },
      { prompt: "PS>", cmd: "must-b gateway", comment: "# wake the Fox" },
    ],
  },
  unix: {
    shellLabel: "bash / zsh",
    lines: [
      {
        prompt: "$",
        cmd: "curl -fsSL https://raw.githubusercontent.com/aytac43-0/must-b/main/install.sh | bash",
      },
      { prompt: "$", cmd: "must-b gateway", comment: "# wake the Fox" },
    ],
  },
};

const TABS: { id: Platform; label: string; Icon: React.ElementType }[] = [
  { id: "npm",     label: "npm",          Icon: Terminal },
  { id: "windows", label: "Windows",      Icon: Monitor  },
  { id: "unix",    label: "Linux / macOS", Icon: Apple   },
];

// ── Copy button ────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <motion.button
      onClick={handle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      title="Copy to clipboard"
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono
                 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors
                 text-muted-foreground hover:text-foreground"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="ok"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1 text-emerald-400"
          >
            <CheckCheck className="w-3 h-3" /> Copied
          </motion.span>
        ) : (
          <motion.span
            key="cp"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1"
          >
            <Copy className="w-3 h-3" /> Copy
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ── Terminal block ─────────────────────────────────────────────────────────

function TerminalBlock({ platform }: { platform: Platform }) {
  const { shellLabel, lines } = PLATFORM_CONTENT[platform];
  const allCmds = lines.map((l) => l.cmd).join("\n");

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/[0.07] bg-[#0b0d11]">
      {/* Chrome bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/50 tracking-widest uppercase">
          {shellLabel}
        </span>
        <CopyButton text={allCmds} />
      </div>

      {/* Command lines */}
      <div className="px-5 py-4 space-y-2.5">
        {lines.map((line, i) => (
          <div key={i} className="flex items-start gap-2 font-mono text-sm leading-relaxed">
            <span className="text-primary/50 shrink-0 select-none">{line.prompt}</span>
            <span className="text-[#c9d1d9] break-all">
              {line.cmd}
              {line.comment && (
                <span className="text-muted-foreground/35 ml-2">{line.comment}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Post-install next step */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-2 pt-3 border-t border-white/[0.05]">
          <Zap className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="text-[11px] font-mono text-muted-foreground/55">
            After install, run{" "}
            <span className="text-amber-400/80 font-semibold">must-b gateway</span>
            {" "}to wake the Fox.
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────────────────

const DownloadSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeStep, setActiveStep] = useState(0);
  const [activePlatform, setActivePlatform] = useState<Platform>("npm");

  return (
    <section id="download" className="py-24 md:py-32 relative">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div ref={ref} className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-mono text-primary uppercase tracking-[0.2em] mb-4">
            Get Started
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Deploy in seconds.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Three steps. No configuration headaches. Just pure execution.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">

          {/* Left — interactive steps */}
          <div className="space-y-4">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                animate={isInView ? "show" : "hidden"}
                onClick={() => setActiveStep(i)}
                className={`relative flex gap-5 p-5 rounded-2xl cursor-pointer transition-all duration-500 ${
                  activeStep === i ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                }`}
              >
                {/* Active left bar */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-primary"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: activeStep === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ originY: 0 }}
                />

                {/* Step number / check */}
                <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                  activeStep === i
                    ? "bg-primary/20"
                    : activeStep > i
                    ? "bg-emerald-500/10"
                    : "bg-white/[0.03]"
                }`}>
                  <AnimatePresence mode="wait">
                    {activeStep > i ? (
                      <motion.div key="check" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Check className="w-5 h-5 text-emerald-500" />
                      </motion.div>
                    ) : (
                      <motion.span key="number" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className={`font-mono text-sm font-bold ${activeStep === i ? "text-primary" : "text-muted-foreground"}`}>
                        {item.step}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 transition-colors duration-300 ${
                    activeStep === i ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {item.title}
                  </h4>
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                    activeStep === i ? "text-muted-foreground" : "text-muted-foreground/60"
                  }`}>
                    {item.desc}
                  </p>

                  <AnimatePresence>
                    {activeStep === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-[11px] font-mono text-primary bg-primary/10">
                          <item.icon className="w-3 h-3" />
                          {item.detail}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}

            {/* Progress dots */}
            <div className="hidden md:flex justify-center pt-2">
              <div className="flex gap-2">
                {steps.map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-1 rounded-full cursor-pointer"
                    animate={{
                      width: activeStep === i ? 32 : 8,
                      backgroundColor: activeStep >= i
                        ? "hsl(239 84% 67%)"
                        : "hsl(217 33% 20%)",
                    }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setActiveStep(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right — terminal install card */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="glow-border sticky top-24"
          >
            <div className="glass p-7 md:p-8 rounded-outer flex flex-col relative z-10">

              {/* Card header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-xl font-bold text-foreground">must-b CLI</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">macOS · Windows · Linux</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {/* Stable badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono
                                   bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    v1.2.2 — Latest Stable
                  </span>
                  {/* npm registry link */}
                  <a
                    href="https://www.npmjs.com/package/@must-b/must-b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground
                               hover:text-primary transition-colors"
                  >
                    npmjs.com/package/@must-b/must-b
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Platform tabs */}
              <div className="flex gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-4">
                {TABS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActivePlatform(id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md
                                text-xs font-mono font-medium transition-all duration-200 ${
                      activePlatform === id
                        ? "bg-primary/20 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Animated terminal swap */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePlatform}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <TerminalBlock platform={activePlatform} />
                </motion.div>
              </AnimatePresence>

              {/* Footer — direct installers + npm CTA */}
              <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-3">
                {/* Direct raw-file download links (verified 200) */}
                <div className="flex items-center gap-3">
                  <a
                    href="https://raw.githubusercontent.com/aytac43-0/must-b/main/install.sh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/10
                               text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                  >
                    <Download className="w-3 h-3" /> install.sh
                  </a>
                  <a
                    href="https://raw.githubusercontent.com/aytac43-0/must-b/main/install.ps1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/10
                               text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                  >
                    <Download className="w-3 h-3" /> install.ps1
                  </a>
                  <a
                    href="https://raw.githubusercontent.com/aytac43-0/must-b/main/install.cmd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/10
                               text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                  >
                    <Download className="w-3 h-3" /> install.cmd
                  </a>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-muted-foreground/50 font-mono">Node 18+ required</p>
                  <motion.a
                    href="https://www.npmjs.com/package/@must-b/must-b"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03, boxShadow: "0 0 28px hsl(239 84% 67% / 0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary-glow flex items-center gap-2 text-sm px-5 py-2.5"
                  >
                    <Download className="w-4 h-4" />
                    View on npm
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </motion.a>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
