import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// ── Demo sequences ────────────────────────────────────────────────────────

const commandSets = [
  [
    { text: "$ must-b gateway --model llama3:8b", color: "text-[#c9d1d9]" },
    { text: "  ↳ Initializing local weights…", color: "text-muted-foreground" },
    { text: "  ↳ VRAM: 8.4 GB / 12.0 GB allocated", color: "text-muted-foreground" },
    { text: "  ↳ Cloud sync: connected (World-Mode ON)", color: "text-emerald-400" },
    { text: "  ✓ Agent online. UID: MB-482910384-7", color: "text-emerald-400" },
  ],
  [
    { text: "$ must-b run 'refactor src/auth.ts for clarity'", color: "text-[#c9d1d9]" },
    { text: "  ↳ Planning with claude-3-5-sonnet…", color: "text-muted-foreground" },
    { text: "  ↳ Spawning 2 sub-agents (Mini tier)…", color: "text-indigo-400" },
    { text: "  ↳ Applied: dead-code removal, typed returns", color: "text-indigo-400" },
    { text: "  ✓ Done. Bundle −34%. 0 errors.", color: "text-emerald-400" },
  ],
  [
    { text: "$ must-b run 'find all TODO comments, open issues'", color: "text-[#c9d1d9]" },
    { text: "  ↳ Scanning 1,204 files with ripgrep…", color: "text-muted-foreground" },
    { text: "  ↳ Found 23 TODOs across 11 files", color: "text-amber-400" },
    { text: "  ↳ Drafting issues…", color: "text-indigo-400" },
    { text: "  ✓ 23 issues created. Assigned to @you.", color: "text-emerald-400" },
  ],
  [
    { text: "$ must-b run 'deploy to Vercel, tag v1.2.2'", color: "text-[#c9d1d9]" },
    { text: "  ↳ Running: npm run build…", color: "text-muted-foreground" },
    { text: "  ↳ Running: git tag v1.2.2 && git push…", color: "text-muted-foreground" },
    { text: "  ↳ Running: vercel --prod…", color: "text-indigo-400" },
    { text: "  ✓ Live: https://must-b.com  [2.4s]", color: "text-emerald-400" },
  ],
];

const TYPING_MS = 24;
const LINE_MS   = 360;
const SET_MS    = 3000;

// ── Display state (the only React state — everything else lives in closure) ─

interface DisplayState {
  lines: { text: string; color: string }[];
  activeText: string;
  activeColor: string;
  fading: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────

const HeroTerminal = () => {
  const [display, setDisplay] = useState<DisplayState>({
    lines: [],
    activeText: "",
    activeColor: "",
    fading: false,
  });

  useEffect(() => {
    // All mutable animation state lives as closure variables — zero extra re-renders
    let setIdx  = 0;
    let lineIdx = 0;
    let charIdx = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let alive = true;

    function schedule(fn: () => void, ms: number) {
      timer = setTimeout(() => { if (alive) fn(); }, ms);
    }

    function typeChar() {
      const cmds     = commandSets[setIdx];
      const fullText = cmds[lineIdx].text;

      charIdx++;
      setDisplay(d => ({
        ...d,
        activeText:  fullText.slice(0, charIdx),
        activeColor: cmds[lineIdx].color,
      }));

      if (charIdx < fullText.length) {
        schedule(typeChar, TYPING_MS);
      } else {
        // Line complete — commit it then move on
        schedule(() => {
          const done = commandSets[setIdx][lineIdx];
          lineIdx++;
          charIdx = 0;
          setDisplay(d => ({
            ...d,
            lines:      [...d.lines, done],
            activeText: "",
          }));
          if (lineIdx < commandSets[setIdx].length) {
            schedule(typeChar, TYPING_MS);
          } else {
            // All lines in this set done — pause then fade out
            schedule(fadeOut, SET_MS);
          }
        }, LINE_MS);
      }
    }

    function fadeOut() {
      setDisplay(d => ({ ...d, fading: true }));
      schedule(() => {
        setIdx  = (setIdx + 1) % commandSets.length;
        lineIdx = 0;
        charIdx = 0;
        setDisplay({ lines: [], activeText: "", activeColor: "", fading: false });
        schedule(typeChar, 120);
      }, 480);
    }

    // Kick off
    schedule(typeChar, 400);

    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, []); // runs once — no dependency churn

  const cmds = commandSets.find((_, i) => {
    // We can't know setIdx from outside the closure; derive active color from display
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative w-full"
    >
      {/* Outer glow */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-sm -z-10" />

      <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#080a0e]">

        {/* Chrome bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-amber-400/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="ml-4 text-xs font-mono text-muted-foreground/60">must-b — local agent</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">v1.2.2</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider">Live</span>
            </div>
          </div>
        </div>

        {/* Animated output */}
        <div
          className="px-5 py-5 font-mono text-sm space-y-1.5 min-h-[160px]"
          style={{ opacity: display.fading ? 0 : 1, transition: "opacity 0.45s ease" }}
        >
          {display.lines.map((line, i) => (
            <p key={i} className={`${line.color} leading-relaxed`}>{line.text}</p>
          ))}
          {display.activeText && (
            <p className={`${display.activeColor} leading-relaxed`}>
              {display.activeText}
              <span className="inline-block w-[7px] h-[14px] bg-primary/80 animate-cursor-blink ml-0.5 align-middle rounded-[1px]" />
            </p>
          )}
          {!display.activeText && !display.fading && (
            <p>
              <span className="inline-block w-[7px] h-[14px] bg-primary/80 animate-cursor-blink rounded-[1px]" />
            </p>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default HeroTerminal;
