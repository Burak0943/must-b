import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import MeshBackground from "@/components/MeshBackground";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import { SiteFooter } from "@/components/SiteFooter";
import InstallPanel from "@/components/InstallPanel";
import OnboardingTerminal from "@/components/OnboardingTerminal";
import { Workflow, Network, Building2, Rocket } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

// ── Scroll-reveal wrapper ─────────────────────────────────────────────────

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
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────

const Index = () => {
  const { t } = useTranslation();

  const roadmapSteps = [
    {
      icon: Workflow,
      phase: t('roadmap.steps.1.phase'),
      text: t('roadmap.steps.1.text'),
    },
    {
      icon: Network,
      phase: t('roadmap.steps.2.phase'),
      text: t('roadmap.steps.2.text'),
    },
    {
      icon: Building2,
      phase: t('roadmap.steps.3.phase'),
      text: t('roadmap.steps.3.text'),
    },
    {
      icon: Rocket,
      phase: t('roadmap.steps.4.phase'),
      text: t('roadmap.steps.4.text'),
    }
  ];

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

      {/* ── Hero — avatar + headline only, no CTAs ─────────────────── */}
      <section className="pt-12 md:pt-16 pb-16 md:pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">

          {/* Fox avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150 animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl scale-200" />
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-white/10
                              bg-[#0f1115] flex items-center justify-center shadow-2xl shadow-primary/20">
                <img
                  src="/mascot.png"
                  alt="must-b fox agent"
                  className="w-[85%] h-[85%] object-contain pointer-events-none"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full text-xs font-mono text-muted-foreground mb-6">
              <span className="pulse-dot" />
              <span>{t('hero.version')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-5 text-gradient-hero leading-[1.08] whitespace-pre-line">
              {t('hero.title')}
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 1. Download / CLI Panel ────────────────────────────────── */}
      <section className="pb-20 md:pb-24 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="max-w-3xl mx-auto">
          <ScrollReveal className="text-center mb-8">
            <span className="inline-block text-xs font-mono text-primary uppercase tracking-[0.2em] mb-3">
              {t('nav.getStarted')}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('getStarted.title')}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <InstallPanel />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 1.5 Roadmap / Process ────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 relative border-t border-white/[0.04]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="text-center mb-24">
            <span className="inline-block text-xs font-mono text-cyan-400 uppercase tracking-[0.2em] mb-4">
              {t('roadmap.title')}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {t('roadmap.subtitle')}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('roadmap.desc')}
            </p>
          </ScrollReveal>
          
          <div className="relative max-w-4xl mx-auto py-8">
            {/* The Central Line */}
            <motion.div 
              className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-0.5 bg-cyan-600/50 md:-translate-x-1/2 origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              viewport={{ once: true }}
            />
            
            <div className="space-y-16 md:space-y-32 relative z-10">
              {roadmapSteps.map((step, i) => {
                const isLeft = i % 2 === 0;
                
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`w-full flex flex-col md:flex-row ${isLeft ? 'md:justify-start' : 'md:justify-end'} relative`}
                  >
                    {/* Visual Node */}
                    <div className="absolute left-[39px] md:left-1/2 w-4 h-4 rounded-full bg-cyan-400 border-[3px] border-[#060709] shadow-[0_0_20px_rgba(34,211,238,0.8)] transform -translate-x-1/2 top-0 md:top-2 z-20" />

                    {/* Card Content */}
                    <div className={`w-full md:w-1/2 pl-[80px] md:pl-0 ${isLeft ? 'md:pr-16 lg:pr-24' : 'md:pl-16 lg:pl-24'}`}>
                      <div className="flex flex-col items-start text-left">
                        <span className="text-xs font-mono text-cyan-400 mb-4 tracking-[0.2em] uppercase font-semibold">
                          Step {i + 1}
                        </span>
                        
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                          <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl border border-white/10 bg-[#0a0c10] flex items-center justify-center shadow-lg shadow-cyan-900/20 relative overflow-hidden group">
                             <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                             <step.icon className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 relative z-10" />
                          </div>
                          <div className="pt-1 md:pt-3">
                            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
                              {step.phase}
                            </h3>
                            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                              {step.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Onboarding Terminal ─────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <span className="inline-block text-xs font-mono text-primary uppercase tracking-[0.2em] mb-4">
              {t('demo.title')}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {t('demo.subtitle')}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t('demo.desc')}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <OnboardingTerminal />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 3. Features ────────────────────────────────────────────── */}
      <FeaturesSection />

      {/* ── 4. Pricing ────────────────────────────────────────────── */}
      <PricingSection />

      {/* ── 5. FAQ ────────────────────────────────────────────────── */}
      <FAQSection />

      {/* ── Footer ────────────────────────────────────────────────── */}
      <ScrollReveal>
        <SiteFooter />
      </ScrollReveal>
    </motion.main>
  );
};

export default Index;
