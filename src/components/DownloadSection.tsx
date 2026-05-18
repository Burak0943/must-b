import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import {
  Download, ChevronRight, Terminal,
  Cpu, Zap, Check, Copy, CheckCheck, ExternalLink,
} from "lucide-react";

// ── Step data ──────────────────────────────────────────────────────────────

const steps = [
  {
    step: "01",
    title: "Install Node.js (If not installed)",
    desc: "Bilgisayarınızda Node.js kurulu değilse, önce aşağıdaki komutu normal bir CMD ekranında çalıştırın. Kurulum bittikten sonra o CMD ekranını kapatıp YENİ bir terminal açmayı unutmayın.",
    icon: Cpu,
    detail: "winget install OpenJS.NodeJS.LTS --silent",
    cmd: "winget install OpenJS.NodeJS.LTS --silent",
    prompt: ">",
    shellLabel: "CMD (Run as normal user)",
  },
  {
    step: "02",
    title: "Install must-b CLI",
    desc: "Node.js kuruluysa, yeni bir terminal açarak must-b CLI'ı global olarak yükleyin. macOS, Windows ve Linux üzerinde çalışır.",
    icon: Terminal,
    detail: "npm install -g @must-b/must-b@latest",
    cmd: "npm install -g @must-b/must-b@latest",
    prompt: "$",
    shellLabel: "bash / zsh / PowerShell",
  },
  {
    step: "03",
    title: "Run onboard",
    desc: "Kurulum tamamlandıktan sonra onboard komutunu çalıştırın. Kimlik doğrulama ve ortam yapılandırması otomatik tamamlanır.",
    icon: Zap,
    detail: "must-b onboard",
    cmd: "must-b onboard",
    prompt: "$",
    shellLabel: "bash / zsh / PowerShell",
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

// ── Single-command terminal block ──────────────────────────────────────────

function StepTerminal({
  cmd,
  prompt,
  shellLabel,
}: {
  cmd: string;
  prompt: string;
  shellLabel: string;
}) {
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
        <CopyButton text={cmd} />
      </div>

      {/* Command line */}
      <div className="px-5 py-4">
        <div className="flex items-start gap-2 font-mono text-sm leading-relaxed">
          <span className="text-primary/50 shrink-0 select-none">{prompt}</span>
          <span className="text-[#c9d1d9] break-all">{cmd}</span>
        </div>
      </div>
    </div>
  );
}

// ── Right-panel: all 3 steps stacked ──────────────────────────────────────

function InstallStepsPanel({ activeStep }: { activeStep: number }) {
  return (
    <div className="flex flex-col gap-5">
      {steps.map((s, i) => (
        <motion.div
          key={s.step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className={`rounded-2xl border transition-all duration-300 ${
            activeStep === i
              ? "border-primary/30 bg-primary/5"
              : "border-white/[0.06] bg-white/[0.02]"
          }`}
        >
          {/* Step header */}
          <div className="flex items-center gap-3 px-5 pt-4 pb-3">
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-bold transition-colors duration-300 ${
                activeStep > i
                  ? "bg-emerald-500/15 text-emerald-400"
                  : activeStep === i
                  ? "bg-primary/20 text-primary"
                  : "bg-white/[0.04] text-muted-foreground"
              }`}
            >
              {activeStep > i ? <Check className="w-3.5 h-3.5" /> : s.step}
            </span>
            <span
              className={`text-sm font-semibold transition-colors duration-300 ${
                activeStep === i ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {s.title}
            </span>
          </div>

          {/* Terminal */}
          <div className="px-4 pb-4">
            <StepTerminal
              cmd={s.cmd}
              prompt={s.prompt}
              shellLabel={s.shellLabel}
            />
          </div>
        </motion.div>
      ))}

      {/* Node.js note */}
      <p className="text-xs text-muted-foreground/50 font-mono text-center pt-1">
        Node 18+ required &nbsp;·&nbsp;{" "}
        <a
          href="https://nodejs.org/en/download"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          nodejs.org
          <ExternalLink className="inline w-2.5 h-2.5 ml-0.5 -mt-0.5" />
        </a>
      </p>
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────────────────

const DownloadSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeStep, setActiveStep] = useState(0);

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
                <div
                  className={`relative w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                    activeStep === i
                      ? "bg-primary/20"
                      : activeStep > i
                      ? "bg-emerald-500/10"
                      : "bg-white/[0.03]"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {activeStep > i ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Check className="w-5 h-5 text-emerald-500" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="number"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className={`font-mono text-sm font-bold ${
                          activeStep === i ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {item.step}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1">
                  <h4
                    className={`font-semibold mb-1 transition-colors duration-300 ${
                      activeStep === i ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p
                    className={`text-sm leading-relaxed transition-colors duration-300 ${
                      activeStep === i
                        ? "text-muted-foreground"
                        : "text-muted-foreground/60"
                    }`}
                  >
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
                      backgroundColor:
                        activeStep >= i
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

          {/* Right — stacked install steps card */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="glow-border sticky top-24"
          >
            <div className="glass p-7 md:p-8 rounded-outer flex flex-col relative z-10">

              {/* Card header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Install must-b</h3>
                  <p className="text-muted-foreground text-sm mt-0.5">macOS · Windows · Linux</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono
                                   bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    v1.2.2 — Latest Stable
                  </span>
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

              {/* Stacked step terminals */}
              <InstallStepsPanel activeStep={activeStep} />

              {/* Footer CTA */}
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-end">
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
                  <ChevronRight className="w-3.5 h-3.5" />
                </motion.a>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
