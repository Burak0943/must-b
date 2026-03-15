import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, Sparkles, Brain, Shield, ChevronRight } from "lucide-react";

const LocalSetup = () => {
  const [step, setStep] = useState<'sleeping' | 'awaking' | 'config'>('sleeping');

  const handleWakeUp = () => {
    setStep('awaking');
    setTimeout(() => setStep('config'), 2000); // 2 saniye uyanış animasyonu
  };

  return (
    <div className="h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden font-sans selection:bg-primary/30">
      <AnimatePresence mode="wait">
        
        {/* 1. UYUYAN TİLKİ EKRANI */}
        {step === 'sleeping' && (
          <motion.div 
            key="sleep"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-72 h-72 mb-12"
            >
              <img src="/mascot.png" alt="must-b" className="w-full h-full object-contain grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </motion.div>
            
            <button 
              onClick={handleWakeUp}
              className="group px-12 py-5 bg-white/5 border border-white/10 rounded-full hover:bg-primary hover:border-primary transition-all duration-500"
            >
              <span className="flex items-center gap-3 text-lg font-medium tracking-tight group-hover:text-black">
                <Power className="w-5 h-5" /> Initiate System Wake-up
              </span>
            </button>
          </motion.div>
        )}

        {/* 2. UYANIŞ ANİMASYONU */}
        {step === 'awaking' && (
          <motion.div 
            key="awake"
            initial={{ scale: 1, filter: "brightness(1) blur(0px)" }}
            animate={{ scale: 1.5, filter: "brightness(2) blur(10px)", opacity: 0 }}
            transition={{ duration: 2 }}
            className="flex flex-col items-center"
          >
            <img src="/mascot.png" alt="must-b" className="w-72 h-72 object-contain" />
          </motion.div>
        )}

        {/* 3. KURULUM FORMU (Kullanıcı Dostu) */}
        {step === 'config' && (
          <motion.div 
            key="config"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl p-10 glass rounded-[2.5rem] border border-white/10 relative"
          >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24">
               <img src="/mascot.png" alt="must-b" className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
            </div>

            <div className="mt-8 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Hello, I'm must-b.</h2>
              <p className="text-muted-foreground">Your local neural architecture is ready to be shaped.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary ml-1">Agent Specialty</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'dev', label: 'Developer', icon: Brain },
                    { id: 'legal', label: 'Legal Advisor', icon: Shield }
                  ].map(opt => (
                    <button key={opt.id} className="p-4 glass rounded-2xl border border-white/5 hover:border-primary/50 flex flex-col items-center gap-2 transition-all">
                      <opt.icon className="w-6 h-6 text-muted-foreground" />
                      <span className="font-bold text-sm">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <button className="text-sm text-muted-foreground hover:text-white transition-colors underline underline-offset-4">
                  Skip for now
                </button>
                <button className="px-8 py-3 bg-white text-black rounded-xl font-bold flex items-center gap-2 hover:bg-primary transition-all">
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocalSetup;