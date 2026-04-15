import { useState } from "react";
import { motion } from "framer-motion";

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
    <div 
      className="relative z-10 select-none cursor-pointer group"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      tabIndex={0}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && toggle()}
    >
      {/* Sleek inset capsule track */}
      <div className="relative w-14 h-7 rounded-full bg-gray-950 border border-gray-800 
                      shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.02)]
                      flex items-center px-1 transition-colors">
        
        {/* Thumb */}
        <motion.div
           animate={{ x: isDark ? 28 : 0 }}
           transition={{ type: "spring", stiffness: 400, damping: 25 }}
           className="w-5 h-5 rounded-full bg-gradient-to-b from-gray-500 to-gray-700 
                      border border-gray-400/50 shadow-[0_2px_4px_rgba(0,0,0,0.8)] 
                      flex items-center justify-center relative"
        >
            {/* LED Indicator Dot */}
            <motion.div 
               animate={{
                 backgroundColor: isDark ? "#06b6d4" : "#fef08a",
                 boxShadow: isDark 
                   ? "0 0 6px 1px rgba(6,182,212,0.8)" 
                   : "0 0 6px 1px rgba(254,240,138,0.8)"
               }}
               transition={{ duration: 0.3 }}
               className="w-1.5 h-1.5 rounded-full"
            />
            
            {/* Subtle highlight ring on thumb */}
            <div className="absolute inset-0 rounded-full border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}
