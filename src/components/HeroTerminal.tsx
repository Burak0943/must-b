import { motion } from "framer-motion";

const terminalLines = [
  { text: "> Initializing local weights...", color: "text-indigo-400", delay: 0 },
  { text: "> Loading model: must-b-7B-Q4_K_M.gguf", color: "text-indigo-400", delay: 0.3 },
  { text: "> Connection established: Cloud Sync Active", color: "text-emerald-400", delay: 0.8 },
  { text: "> Monitoring system resources: 12.4GB VRAM available", color: "text-muted-foreground", delay: 1.3 },
  { text: "> Agent ready. Awaiting instructions...", color: "text-emerald-400", delay: 1.8 },
];

const HeroTerminal = () => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    className="relative mx-auto max-w-3xl glass rounded-outer p-4 md:p-6 animate-float"
  >
    {/* Traffic lights */}
    <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
      <div className="w-3 h-3 rounded-full bg-red-500/60" />
      <div className="w-3 h-3 rounded-full bg-amber-500/60" />
      <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
      <span className="ml-4 text-xs font-mono text-muted-foreground">must-b --local-agent</span>
    </div>

    {/* Terminal lines */}
    <div className="font-mono text-left text-xs md:text-sm space-y-1.5 min-h-[120px]">
      {terminalLines.map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: line.delay + 0.8, duration: 0.4 }}
          className={line.color}
        >
          {line.text}
        </motion.p>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="inline-block w-2 h-4 bg-primary animate-cursor-blink"
      />
    </div>
  </motion.div>
);

export default HeroTerminal;
