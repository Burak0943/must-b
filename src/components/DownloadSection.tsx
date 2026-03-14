import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Download, ChevronRight, Monitor, Apple } from "lucide-react";

const steps = [
  { step: "01", title: "Download Agent", desc: "Native binaries for macOS (Apple Silicon), Windows 11, and Linux." },
  { step: "02", title: "Sync Identity", desc: "Connect your cloud profile via secure OAuth in seconds." },
  { step: "03", title: "Execute", desc: "Your agent is now ready to automate your local environment." },
];

const DownloadSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="download" className="py-24 md:py-32 border-y border-white/5" style={{ background: "hsl(var(--background) / 0.5)" }}>
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Deploy in seconds.</h2>

            {/* Horizontal scroll on mobile, vertical on desktop */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory">
              {steps.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
                  className="flex gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors min-w-[280px] md:min-w-0 snap-start"
                >
                  <span className="font-mono text-primary font-bold text-lg">{item.step}</span>
                  <div>
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Download card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="glow-border"
          >
            <div className="glass p-8 md:p-12 rounded-outer flex flex-col items-center justify-center text-center relative z-10">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Download className="w-12 h-12 mb-6 text-primary" />
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Get must-b v1.0</h3>
              <p className="text-muted-foreground mb-8">Available for macOS (Apple Silicon) & Windows 11</p>

              <div className="w-full space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
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
                  className="w-full py-4 glass rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-foreground hover:bg-white/[0.06]"
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
