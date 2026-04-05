import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IndustrialSwitchProps {
  initialState?: boolean;    // true = DARK (default)
  onToggle?: (isDark: boolean) => void;
}

export function IndustrialSwitch({ initialState = true, onToggle }: IndustrialSwitchProps) {
  const [isDark, setIsDark] = useState(initialState);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    onToggle?.(next);
  };

  return (
    <div className="relative z-10 flex flex-col items-center gap-2 select-none">
      {/* Housing */}
      <div
        className="relative w-[90px] h-[44px] rounded-[10px] cursor-pointer
                   bg-neutral-900 border border-white/10
                   shadow-[inset_0_2px_6px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.05)]
                   flex items-center justify-between px-2"
        onClick={toggle}
        role="switch"
        aria-checked={isDark}
        tabIndex={0}
        onKeyDown={(e) => (e.key === " " || e.key === "Enter") && toggle()}
      >
        {/* LED — left side (LIGHT) */}
        <motion.div
          animate={{
            backgroundColor: !isDark ? "#facc15" : "#1a1a1a",
            boxShadow: !isDark
              ? "0 0 6px 2px rgba(250,204,21,0.7), 0 0 14px 4px rgba(250,204,21,0.3)"
              : "inset 0 1px 3px rgba(0,0,0,0.8)",
          }}
          transition={{ duration: 0.3 }}
          className="w-3 h-3 rounded-full border border-white/10"
        />

        {/* Thumb */}
        <motion.div
          animate={{ x: isDark ? 18 : -18 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="absolute left-1/2 -translate-x-1/2 w-[30px] h-[30px] rounded-[6px]
                     bg-gradient-to-b from-neutral-600 to-neutral-800
                     border border-white/10
                     shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]
                     flex flex-col items-center justify-center gap-[3px] cursor-pointer"
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-[14px] h-[1.5px] rounded-full bg-white/20" />
          ))}
        </motion.div>

        {/* LED — right side (DARK) */}
        <motion.div
          animate={{
            backgroundColor: isDark ? "#06b6d4" : "#1a1a1a",
            boxShadow: isDark
              ? "0 0 6px 2px rgba(6,182,212,0.7), 0 0 14px 4px rgba(6,182,212,0.3)"
              : "inset 0 1px 3px rgba(0,0,0,0.8)",
          }}
          transition={{ duration: 0.3 }}
          className="w-3 h-3 rounded-full border border-white/10"
        />
      </div>

      {/* Labels */}
      <div className="flex w-full justify-between px-1">
        <AnimatePresence mode="wait">
          <motion.span
            key={isDark ? "dark-label" : "light-label"}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className={`text-[9px] font-bold tracking-[0.2em] uppercase ${
              !isDark ? "text-yellow-400" : "text-white/20"
            }`}
          >
            LIGHT
          </motion.span>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.span
            key={isDark ? "dark-active" : "light-active"}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className={`text-[9px] font-bold tracking-[0.2em] uppercase ${
              isDark ? "text-cyan-400" : "text-white/20"
            }`}
          >
            DARK
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
