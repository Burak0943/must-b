import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, Brain, Shield, ChevronRight, Sparkles } from "lucide-react";

const LocalSetup = () => {
  // Adım takibi: uyku -> uyanış -> kurulum
  const [step, setStep] = useState<'sleeping' | 'awaking' | 'config'>('sleeping');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const handleWakeUp = () => {
    setStep('awaking');
    // 2 saniye sonra kurulum formuna geç
    setTimeout(() => setStep('config'), 2000);
  };

  return (
    <div className="h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden font-sans selection:bg-orange-500/30">
      <AnimatePresence mode="wait">
        
        {/* 1. UYUYAN VE NEFES ALAN TİLKİ */}
        {step === 'sleeping' && (
          <motion.div 
            key="sleep"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <motion.div
              // CANLI NEFES ALMA VE HAFİF SALINIM
              animate={{ 
                scale: [1, 1.05, 1],
                y: [0, -8, 0],
                rotate: [-1, 1, -1]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative w-72 h-72 mb-12 group cursor-pointer"
              onClick={handleWakeUp}
            >
              <img 
                src="/mascot.png" 
                alt="must-b" 
                className="w-full h-full object-contain grayscale opacity-40 transition-all duration-1000 group-hover:opacity-70 group-hover:grayscale-0" 
              />
              {/* Etrafındaki enerji halesi */}
              <motion.div 
                animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute inset-0 bg-orange-500/20 blur-[80px] rounded-full"
              />
            </motion.div>
            
            <button 
              onClick={handleWakeUp}
              className="group relative px-10 py-4 bg-white/5 border border-white/10 rounded-full hover:border-orange-500/50 transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3 text-sm font-bold tracking-[0.2em] uppercase text-muted-foreground group-hover:text-white">
                <Power className="w-4 h-4" /> Initiate Wake-up
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </motion.div>
        )}

        {/* 2. UYANIŞ: SİLKELENME VE CANLANMA SEKANSI */}
        {step === 'awaking' && (
          <motion.div 
            key="awake"
            className="relative flex flex-col items-center"
          >
            <motion.img 
              src="/mascot.png" 
              initial={{ scale: 1, filter: "grayscale(1) brightness(0.5)" }}
              animate={{ 
                scale: [1, 1.3, 1.15],
                filter: ["grayscale(1) brightness(0.5)", "grayscale(0) brightness(1.8)", "grayscale(0) brightness(1)"],
                rotate: [0, -10, 10, -5, 5, 0] // Uykudan uyanma silkelenmesi
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-80 h-80 object-contain z-50"
            />
            {/* Enerji Patlaması Dalgası */}
            <motion.div 
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 6, opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 bg-orange-500/40 rounded-full blur-3xl"
            />
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-8 text-orange-500 font-mono animate-pulse tracking-widest"
            >
              NEURAL SYNC IN PROGRESS...
            </motion.p>
          </motion.div>
        )}

        {/* 3. KURULUM FORMU */}
        {step === 'config' && (
          <motion.div 
            key="config"
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl p-10 glass rounded-[3rem] border border-white/10 relative"
          >
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-28 h-28">
               <motion.img 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                src="/mascot.png" 
                alt="must-b" 
                className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" 
               />
            </div>

            <div className="mt-12 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Hello, I'm must-b.</h2>
              <p className="text-muted-foreground">Your local neural architecture is ready to be shaped.</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold tracking-[0.3em] text-orange-500 ml-1">Agent Specialty</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setSelectedSpecialty('dev')}
                    className={`p-6 glass rounded-2xl border transition-all flex flex-col items-center gap-3 ${selectedSpecialty === 'dev' ? 'border-orange-500 bg-orange-500/5' : 'border-white/5 hover:border-white/20'}`}
                  >
                    <Brain className={`w-8 h-8 ${selectedSpecialty === 'dev' ? 'text-orange-500' : 'text-muted-foreground'}`} />
                    <span className="font-bold">Developer</span>
                  </button>
                  <button 
                    onClick={() => setSelectedSpecialty('legal')}
                    className={`p-6 glass rounded-2xl border transition-all flex flex-col items-center gap-3 ${selectedSpecialty === 'legal' ? 'border-orange-500 bg-orange-500/5' : 'border-white/5 hover:border-white/20'}`}
                  >
                    <Shield className={`w-8 h-8 ${selectedSpecialty === 'legal' ? 'text-orange-500' : 'text-muted-foreground'}`} />
                    <span className="font-bold">Legal Advisor</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <button className="text-xs font-bold text-muted-foreground hover:text-white transition-colors uppercase tracking-widest">
                  Skip for now
                </button>
                <button className="px-10 py-4 bg-white text-black rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-white/5">
                  Continue <ChevronRight className="w-4 h-4" />
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