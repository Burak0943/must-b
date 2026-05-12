import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Terminal, Monitor, Apple, Download,
  Copy, CheckCheck, Zap, ExternalLink, ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
        cmd: "curl -fsSL https://must-b.com/install.sh | bash",
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();
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
      title={t('install.copyTitle') || 'Copy to clipboard'}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono
                 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors
                 text-muted-foreground hover:text-foreground"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="ok" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1 text-emerald-400">
            <CheckCheck className="w-3 h-3" /> {t('install.copied') || 'Copied'}
          </motion.span>
        ) : (
          <motion.span key="cp" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1">
            <Copy className="w-3 h-3" /> {t('install.copy') || 'Copy'}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function TerminalBlock({ platform }: { platform: Platform }) {
  const { t } = useTranslation();
  const { shellLabel, lines } = PLATFORM_CONTENT[platform];
  const allCmds = lines.map((l) => l.cmd).join("\n");

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/[0.07] bg-[#0b0d11]">
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
      <div className="px-5 pb-4">
        <div className="flex items-center gap-2 pt-3 border-t border-white/[0.05]">
          <Zap className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="text-[11px] font-mono text-muted-foreground/55">
            {t('install.afterInstall') || 'After install, run'}{" "}
            <span className="text-amber-400/80 font-semibold">must-b gateway</span>
            {" "}{t('install.toWake') || 'to wake the Fox.'}
          </span>
        </div>
      </div>
    </div>
  );
}

const InstallPanel = () => {
  const { t } = useTranslation();
  const [activePlatform, setActivePlatform] = useState<Platform>("npm");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      className="glow-border w-full"
    >
      <div className="glass p-6 md:p-7 rounded-outer flex flex-col relative z-10">

        {/* Card header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-foreground">must-b CLI</h3>
            <p className="text-muted-foreground text-xs mt-0.5">macOS · Windows · Linux</p>
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
              npmjs.com/@must-b/must-b
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

        {/* Footer — direct download links */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-3">
          <div className="flex items-center gap-3">
            <a
              href="https://must-b.com/install.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/10
                         text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            >
              <Download className="w-3 h-3" /> install.sh
            </a>
            <a
              href="https://must-b.com/install.ps1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/10
                         text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
            >
              <Download className="w-3 h-3" /> install.ps1
            </a>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground/50 font-mono">{t('install.nodeRequired') || 'Node 18+ required'}</p>
            <motion.a
              href="https://www.npmjs.com/package/@must-b/must-b"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, boxShadow: "0 0 28px hsl(239 84% 67% / 0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary-glow flex items-center gap-2 text-sm px-5 py-2.5"
            >
              <Download className="w-4 h-4" />
              {t('install.viewNpm') || 'View on npm'}
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.a>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default InstallPanel;
