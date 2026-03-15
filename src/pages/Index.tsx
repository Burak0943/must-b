import { motion, useInView, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import MeshBackground from "@/components/MeshBackground";
import HeroTerminal from "@/components/HeroTerminal";
import FeaturesSection from "@/components/FeaturesSection";
import DownloadSection from "@/components/DownloadSection";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.5, 
        delay, 
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      style={{ willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden min-h-screen"
    >
      <MeshBackground />
      <Navbar />

      <section className="pt-16 md:pt-24 pb-24 md:pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-xs font-mono text-muted-foreground mb-8"
            >
              <span className="pulse-dot" />
              <span className="ml-2">v1.0 — Now Available</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-gradient-hero leading-[1.1]"
            >
              Cloud Brain, <br /> Local Muscle.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              The first AI agent that lives on your hardware but learns from the swarm.
              Zero latency, total privacy, infinite scale.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button 
                  onClick={() => navigate("/login")} 
                  className="btn-primary-glow inline-flex items-center gap-2 group border-none cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a href="#features" className="btn-glass inline-flex items-center gap-2 px-8 py-4 text-foreground">
                  Learn More
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="mt-16 md:mt-20">
            <HeroTerminal />
          </div>
        </div>
      </section>

      <FeaturesSection />
      <DownloadSection />

      <footer className="py-12 px-6 border-t border-white/5 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <ScrollReveal>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 font-bold text-foreground tracking-tighter">
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden border border-white/10 bg-[#0f1115]"
              >
                {/* YENİ MASCOT GÜNCELLEMESİ */}
                <img 
                  src="/mascot.png" 
                  alt="must-b mascot" 
                  className="w-full h-full object-contain scale-110 pointer-events-none"
                />
              </motion.div>
              must-b
            </div>
            <p className="text-xs text-muted-foreground">© 2026 must-b. All rights reserved.</p>
          </div>
        </ScrollReveal>
      </footer>
    </motion.main>
  );
};

export default Index;