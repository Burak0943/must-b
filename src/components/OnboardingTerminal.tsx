/**
 * OnboardingTerminal
 *
 * 1:1 replica of the real must-b CLI onboarding sequence.
 * Animation engine: single useEffect, closure-local mutable state,
 * one React state object — zero rapid re-renders, no dependency thrashing.
 */

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// ── Types ─────────────────────────────────────────────────────────────────

type LineType =
  | "command"    // "> cmd" — prompt + light-gray text
  | "output"     // plain light-gray
  | "info"       // ◆ intro line
  | "success"    // ✓ green tick + rest
  | "prompt_in"  // typed input line (prompt + answer)
  | "ascii"      // must-b block-letter art
  | "subtitle"   // centered dim text
  | "tagline"    // ⚡ yellow lightning
  | "url"        // line with cyan URL
  | "dim"        // dimmed output
  | "blank";     // spacer

interface Line {
  id:         number;
  text:       string;
  type:       LineType;
  promptEnd?: number; // for prompt_in: index where static prompt ends
}

interface Active {
  prompt: string;
  typed:  string;
  type:   LineType;
}

interface Display {
  lines:  Line[];
  active: Active | null;
}

// ── Script ────────────────────────────────────────────────────────────────

type Instr =
  | { op: "type";   text: string; type: LineType; speed?: number }
  | { op: "print";  text: string; type: LineType }
  | { op: "inline"; prompt: string; answer: string; speed?: number }
  | { op: "wait";   ms: number }
  | { op: "clear" };

const getScript = (t: any): Instr[] => [
  // ── npm install ──────────────────────────────────────────────────────
  { op: "type",   text: "> npm install -g @must-b/must-b@latest", type: "command", speed: 36 },
  { op: "wait",   ms: 920 },
  { op: "print",  text: "", type: "blank" },
  { op: "print",  text: t('terminal.addedPackages') || "added 268 packages in 4s", type: "dim" },
  { op: "wait",   ms: 680 },
  { op: "print",  text: "", type: "blank" },

  // ── must-b gateway ───────────────────────────────────────────────────
  { op: "type",   text: "> must-b gateway", type: "command", speed: 50 },
  { op: "wait",   ms: 820 },
  { op: "print",  text: "", type: "blank" },
  { op: "print",  text: t('terminal.welcome') || "◆  Welcome to Must-b! Let's set things up.", type: "info" },
  { op: "print",  text: "", type: "blank" },

  // ── Interactive prompts ───────────────────────────────────────────────
  { op: "inline", prompt: t('terminal.promptName') || "Your name (press Enter for 'User'):  ", answer: "aytaç", speed: 115 },
  { op: "wait",   ms: 340 },
  { op: "print",  text: t('terminal.languages') || "Language:  [1] English  [2] Türkçe  [3] Deutsch", type: "output" },
  { op: "print",  text: "", type: "blank" },
  { op: "inline", prompt: t('terminal.promptChoice') || "Your choice (1/2/3, default 1):  ", answer: "2", speed: 230 },
  { op: "wait",   ms: 460 },

  // ── Setup done ───────────────────────────────────────────────────────
  { op: "print",  text: t('terminal.setupComplete', { name: 'aytaç' }) || "✓ Setup complete. Hello, aytaç!", type: "success" },
  { op: "wait",   ms: 520 },
  { op: "print",  text: "", type: "blank" },

  // ── ASCII art (must-b) ────────────────────────────────────────────────
  { op: "print",  text: "███╗   ███╗██╗   ██╗███████╗████████╗      ██████╗ ", type: "ascii" },
  { op: "print",  text: "████╗ ████║██║   ██║██╔════╝╚══██╔══╝      ██╔══██╗", type: "ascii" },
  { op: "print",  text: "██╔████╔██║██║   ██║███████╗   ██║█████╗   ██████╔╝", type: "ascii" },
  { op: "print",  text: "██║╚██╔╝██║██║   ██║╚════██║   ██║╚════╝   ██╔══██╗", type: "ascii" },
  { op: "print",  text: "██║ ╚═╝ ██║╚██████╔╝███████║   ██║         ██████╔╝", type: "ascii" },
  { op: "print",  text: "╚═╝     ╚═╝ ╚═════╝ ╚══════╝   ╚═╝         ╚═════╝ ", type: "ascii" },
  { op: "print",  text: "", type: "blank" },

  // ── Sub-headline ─────────────────────────────────────────────────────
  { op: "print",  text: t('terminal.professionalOS') || "           Professional AI Operating System", type: "subtitle" },
  { op: "print",  text: "", type: "blank" },
  { op: "print",  text: t('terminal.tagline') || "         ⚡ Autonomous · Precise · Always On", type: "tagline" },
  { op: "print",  text: "", type: "blank" },

  // ── Active skills ────────────────────────────────────────────────────
  { op: "print",  text: t('terminal.activeSkills') || "✓ Active Skills: Browser Automation, Terminal, Memory, Filesystem", type: "success" },
  { op: "print",  text: "", type: "blank" },

  // ── Health check ─────────────────────────────────────────────────────
  { op: "print",  text: t('terminal.healthCheck') || "Running system health check...", type: "dim" },
  { op: "wait",   ms: 620 },
  { op: "print",  text: "✓ Node.js v24.14.0", type: "success" },
  { op: "wait",   ms: 240 },
  { op: "print",  text: "✓ SQLite + FTS5 active", type: "success" },
  { op: "wait",   ms: 240 },
  { op: "print",  text: "✓ Playwright browser ready", type: "success" },
  { op: "wait",   ms: 240 },
  { op: "print",  text: "✓ MUSTB_UID verified (World Mode)", type: "success" },
  { op: "print",  text: "", type: "blank" },

  // ── Ready ────────────────────────────────────────────────────────────
  { op: "print",  text: "must-b start  →  http://localhost:4309", type: "url" },

  // ── Loop ─────────────────────────────────────────────────────────────
  { op: "wait",   ms: 5000 },
  { op: "clear" },
];

// ── Line renderer ─────────────────────────────────────────────────────────

function TermLine({ line }: { line: Line }) {
  const { text, type, promptEnd } = line;

  if (type === "blank") return <div style={{ height: "0.55em" }} />;

  if (type === "command") {
    return (
      <div className="leading-relaxed">
        <span className="text-primary/50 select-none">&gt;&nbsp;</span>
        <span className="text-[#c9d1d9]">{text.slice(2)}</span>
      </div>
    );
  }

  if (type === "success") {
    return (
      <div className="leading-relaxed">
        <span className="text-emerald-400 font-semibold">✓</span>
        <span className="text-[#c9d1d9]">{text.slice(1)}</span>
      </div>
    );
  }

  if (type === "prompt_in") {
    const p = promptEnd ?? 0;
    return (
      <div className="leading-relaxed">
        <span className="text-[#c9d1d9]">{text.slice(0, p)}</span>
        <span className="text-emerald-300 font-medium">{text.slice(p)}</span>
      </div>
    );
  }

  if (type === "ascii") {
    return (
      <div
        className="leading-[1.18] text-primary/80 whitespace-pre tracking-tight"
        aria-hidden="true"
      >
        {text}
      </div>
    );
  }

  if (type === "tagline") {
    const idx = text.indexOf("⚡");
    if (idx >= 0) {
      return (
        <div className="leading-relaxed">
          {idx > 0 && <span className="text-muted-foreground/70">{text.slice(0, idx)}</span>}
          <span className="text-yellow-400">⚡</span>
          <span className="text-[#c9d1d9]">{text.slice(idx + 2)}</span>
        </div>
      );
    }
  }

  if (type === "subtitle") {
    return <div className="leading-relaxed text-muted-foreground/70">{text}</div>;
  }

  if (type === "url") {
    const m = text.match(/^(.*?)(https?:\/\/\S+)(.*)$/);
    if (m) {
      return (
        <div className="leading-relaxed">
          <span className="text-[#c9d1d9] font-semibold">{m[1]}</span>
          <span className="text-cyan-400">{m[2]}</span>
          {m[3] && <span className="text-[#c9d1d9]">{m[3]}</span>}
        </div>
      );
    }
  }

  if (type === "info") {
    return (
      <div className="leading-relaxed">
        <span className="text-primary">◆</span>
        <span className="text-foreground">{text.slice(1)}</span>
      </div>
    );
  }

  if (type === "dim") {
    return <div className="leading-relaxed text-muted-foreground/60">{text}</div>;
  }

  // output / default
  return <div className="leading-relaxed text-[#c9d1d9]">{text}</div>;
}

// ── Blinking cursor ───────────────────────────────────────────────────────

const Cursor = () => (
  <span className="inline-block w-[6px] h-[13px] bg-primary/85 animate-cursor-blink ml-[2px] align-middle rounded-[1px]" />
);

// ── Component ─────────────────────────────────────────────────────────────

const OnboardingTerminal = () => {
  const [display, setDisplay] = useState<Display>({ lines: [], active: null });
  const bodyRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();

  // Auto-scroll to bottom as content grows
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [display]);

  // Animation engine — single effect, closure state, no dependency churn
  useEffect(() => {
    let alive    = true;
    let timer:   ReturnType<typeof setTimeout> | null = null;
    let idSeq    = 0;

    const SCRIPT = getScript(t);

    function sched(fn: () => void, ms: number) {
      timer = setTimeout(() => { if (alive) fn(); }, ms);
    }

    function run(i: number) {
      if (!alive || i >= SCRIPT.length) return;
      const instr = SCRIPT[i];

      switch (instr.op) {

        // ── Instant print ──────────────────────────────────────────────
        case "print": {
          const id = idSeq++;
          setDisplay(d => ({
            ...d,
            lines: [...d.lines, { id, text: instr.text, type: instr.type }],
          }));
          // Slightly longer pause between ASCII lines for visual rhythm
          sched(() => run(i + 1), instr.type === "ascii" ? 74 : 16);
          break;
        }

        // ── Timed pause ────────────────────────────────────────────────
        case "wait": {
          sched(() => run(i + 1), instr.ms);
          break;
        }

        // ── Clear → loop ───────────────────────────────────────────────
        case "clear": {
          setDisplay({ lines: [], active: null });
          sched(() => run(0), 280);
          break;
        }

        // ── Character-by-character typing (full line) ──────────────────
        case "type": {
          const { text, type, speed = 44 } = instr;
          setDisplay(d => ({ ...d, active: { prompt: "", typed: "", type } }));

          let ci = 0;
          const typeChar = () => {
            ci++;
            setDisplay(d => ({ ...d, active: { prompt: "", typed: text.slice(0, ci), type } }));
            if (ci < text.length) {
              sched(typeChar, speed);
            } else {
              // Commit completed line
              const id = idSeq++;
              sched(() => {
                setDisplay(d => ({
                  lines:  [...d.lines, { id, text, type }],
                  active: null,
                }));
                sched(() => run(i + 1), 40);
              }, 80);
            }
          };
          sched(typeChar, speed);
          break;
        }

        // ── Inline prompt + typed answer ───────────────────────────────
        case "inline": {
          const { prompt, answer, speed = 120 } = instr;
          // Show static prompt immediately, then type the answer
          setDisplay(d => ({ ...d, active: { prompt, typed: "", type: "prompt_in" } }));

          let ci = 0;
          const typeAnswer = () => {
            ci++;
            setDisplay(d => ({
              ...d,
              active: { prompt, typed: answer.slice(0, ci), type: "prompt_in" },
            }));
            if (ci < answer.length) {
              sched(typeAnswer, speed);
            } else {
              // Simulate Enter key pause then commit
              const id = idSeq++;
              sched(() => {
                setDisplay(d => ({
                  lines: [
                    ...d.lines,
                    { id, text: prompt + answer, type: "prompt_in", promptEnd: prompt.length },
                  ],
                  active: null,
                }));
                sched(() => run(i + 1), 40);
              }, 260);
            }
          };
          // Small pause before user "starts typing"
          sched(() => sched(typeAnswer, speed), 380);
          break;
        }
      }
    }

    sched(() => run(0), 500);

    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, []); // runs once only

  const { lines, active } = display;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative w-full"
    >
      {/* Outer glow */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/25 via-primary/5 to-transparent blur-md -z-10" />

      <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#080a0e]">

        {/* ── Chrome bar ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-amber-400/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="ml-4 text-xs font-mono text-muted-foreground/60">must-b — terminal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">v1.2.2</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider">Live</span>
            </div>
          </div>
        </div>

        {/* ── Terminal body ─────────────────────────────────────────────── */}
        <div
          ref={bodyRef}
          className="px-5 md:px-7 py-5 font-mono text-[11.5px] md:text-[13px] min-h-[340px] max-h-[510px] overflow-y-auto overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {lines.map(line => (
            <TermLine key={line.id} line={line} />
          ))}

          {/* Active (currently typing) line */}
          {active && (() => {
            if (active.type === "prompt_in") {
              return (
                <div className="leading-relaxed">
                  <span className="text-[#c9d1d9]">{active.prompt}</span>
                  <span className="text-emerald-300 font-medium">{active.typed}</span>
                  <Cursor />
                </div>
              );
            }
            if (active.type === "command") {
              const t = active.typed;
              const n = Math.min(2, t.length);
              return (
                <div className="leading-relaxed">
                  <span className="text-primary/50">{t.slice(0, n)}</span>
                  {t.length > 2 && <span className="text-[#c9d1d9]">{t.slice(2)}</span>}
                  <Cursor />
                </div>
              );
            }
            return (
              <div className="leading-relaxed text-[#c9d1d9]">
                {active.typed}<Cursor />
              </div>
            );
          })()}

          {/* Idle cursor between animations */}
          {!active && (
            <div className="leading-relaxed">
              <span className="text-primary/50 select-none">&gt;&nbsp;</span>
              <Cursor />
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default OnboardingTerminal;
