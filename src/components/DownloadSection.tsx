import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Download, ChevronRight, Monitor, Apple, Terminal, Cloud, Zap, Check } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Download Agent",
    desc: "Native binaries for macOS (Apple Silicon), Windows 11, and Linux. Optimized for your specific hardware.",
    icon: Download,
    detail: "Single binary. No dependencies. No Docker.",
  },
  {
    step: "02",
    title: "Sync Identity",
    desc: "Connect your cloud profile via secure OAuth. Your encryption keys are generated locally.",
    icon: Cloud,
    detail: "Zero-knowledge authentication protocol.",
  },
  {
    step: "03",
    title: "Execute",
    desc: "Your agent is ready. It runs locally, syncs globally, and scales infinitely.",
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

        {/* Steps - Apple-style interactive */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Step selector */}
          <div className="space-y-4">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                animate={isInView ? "show" : "hidden"}
                onClick={() => setActiveStep(i)}
                className={`relative flex gap-5 p-5 rounded-2xl cursor-pointer transition-all duration-500 group ${
                  activeStep === i
                    ? "bg-white/[0.04]"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                {/* Active indicator line */}
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

                  {/* Detail pill - only on active */}
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

            {/* Progress connector */}
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

          {/* Download card with glow */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="glow-border sticky top-24"
          >
            <div className="glass p-8 md:p-12 rounded-outer flex flex-col items-center justify-center text-center relative z-10">
              {/* Animated icon */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotateY: [0, 180, 360],
                }}
                transition={{
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                }}
                className="mb-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Download className="w-8 h-8 text-primary" />
                </div>
              </motion.div>

              <h3 className="text-2xl font-bold text-foreground mb-2">Get must-b v1.0</h3>
              <p className="text-muted-foreground mb-2">Available for macOS (Apple Silicon) & Windows 11</p>

              {/* Stats row */}
              <div className="flex items-center gap-6 mb-8 text-xs font-mono text-muted-foreground">
                <span>42MB</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>No dependencies</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>v1.0.0</span>
              </div>

              <div className="w-full space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 40px hsl(239 84% 67% / 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary-glow w-full flex items-center justify-center gap-2 group"
                >
                  <Apple className="w-5 h-5" />
                  Download for Mac
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 card-neon-glow rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-foreground"
                >
                  <Monitor className="w-5 h-5" />
                  Download for Windows
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
