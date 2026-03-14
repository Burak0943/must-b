import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

const commandSets = [
  [
    { text: "> Initializing local weights...", color: "text-indigo-400" },
    { text: "> Loading model: must-b-7B-Q4_K_M.gguf", color: "text-indigo-400" },
    { text: "> VRAM allocated: 8.4GB / 12.0GB", color: "text-muted-foreground" },
    { text: "> Connection established: Cloud Sync Active", color: "text-emerald-400" },
    { text: "> Agent ready. Awaiting instructions...", color: "text-emerald-400" },
  ],
  [
    { text: "> must-b refactor src/auth.ts --optimize", color: "text-indigo-400" },
    { text: "> Analyzing 247 tokens across 3 functions...", color: "text-muted-foreground" },
    { text: "> Applying dead-code elimination...", color: "text-indigo-400" },
    { text: "> Reduced bundle size by 34.2%", color: "text-emerald-400" },
    { text: "> ✓ Refactoring complete. 0 errors.", color: "text-emerald-400" },
  ],
  [
    { text: "> must-b test --coverage --parallel", color: "text-indigo-400" },
    { text: "> Spawning 8 test workers on local cores...", color: "text-muted-foreground" },
    { text: "> Running 142 test suites...", color: "text-indigo-400" },
    { text: "> All tests passed. Coverage: 94.7%", color: "text-emerald-400" },
    { text: "> Results synced to cloud dashboard.", color: "text-emerald-400" },
  ],
  [
    { text: "> must-b deploy --preview --secure", color: "text-indigo-400" },
    { text: "> Building optimized production bundle...", color: "text-muted-foreground" },
    { text: "> Encrypting deployment artifacts (AES-256)...", color: "text-indigo-400" },
    { text: "> Preview URL: https://preview.must-b.dev/a3f2", color: "text-amber-500" },
    { text: "> ✓ Deployed in 2.4s. Zero cold starts.", color: "text-emerald-400" },
  ],
];

const TYPING_SPEED = 30;
const LINE_PAUSE = 400;
const SET_PAUSE = 3000;

const HeroTerminal = () => {
  const [currentSet, setCurrentSet] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [lines, setLines] = useState<{ text: string; color: string }[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const commands = commandSets[currentSet];

  const advanceToNextSet = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => {
      setLines([]);
      setCurrentLine(0);
      setCurrentChar(0);
      setCurrentSet((prev) => (prev + 1) % commandSets.length);
      setFadeOut(false);
      setIsTyping(true);
    }, 600);
  }, []);

  useEffect(() => {
    if (!isTyping) return;
    if (currentLine >= commands.length) {
      // All lines typed, pause then advance
      const timeout = setTimeout(advanceToNextSet, SET_PAUSE);
      return () => clearTimeout(timeout);
    }

    const fullText = commands[currentLine].text;

    if (currentChar < fullText.length) {
      const timeout = setTimeout(() => {
        setCurrentChar((c) => c + 1);
      }, TYPING_SPEED);
      return () => clearTimeout(timeout);
    } else {
      // Line complete
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev, commands[currentLine]]);
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, LINE_PAUSE);
      return () => clearTimeout(timeout);
    }
  }, [currentChar, currentLine, commands, isTyping, advanceToNextSet]);

  const activeLineText = currentLine < commands.length
    ? commands[currentLine].text.slice(0, currentChar)
    : "";
  const activeLineColor = currentLine < commands.length
    ? commands[currentLine].color
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative mx-auto max-w-3xl glass-glow rounded-outer p-4 md:p-6 animate-float"
    >
      {/* Glow aura behind terminal */}
      <div className="absolute -inset-1 rounded-outer bg-primary/5 blur-xl -z-10" />

      {/* Traffic lights */}
      <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-amber-500/60" />
        <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
        <span className="ml-4 text-xs font-mono text-muted-foreground">must-b --local-agent</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="pulse-dot" />
          <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Terminal content */}
      <div
        className={`font-mono text-left text-xs md:text-sm space-y-1.5 min-h-[140px] transition-opacity duration-500 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Completed lines */}
        {lines.map((line, i) => (
          <p key={`${currentSet}-${i}`} className={line.color}>
            {line.text}
          </p>
        ))}

        {/* Currently typing line */}
        {currentLine < commands.length && (
          <p className={activeLineColor}>
            {activeLineText}
            <span className="inline-block w-2 h-4 bg-primary animate-cursor-blink ml-0.5 align-middle" />
          </p>
        )}

        {/* Idle cursor after all lines */}
        {currentLine >= commands.length && !fadeOut && (
          <p className="text-muted-foreground">
            <span className="inline-block w-2 h-4 bg-primary animate-cursor-blink" />
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default HeroTerminal;
