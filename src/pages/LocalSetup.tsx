import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, Brain, Shield, ChevronRight, Fingerprint, Activity } from "lucide-react";

const LocalSetup = () => {
  const [step, setStep] = useState<'sleeping' | 'awaking' | 'config'>('sleeping');
  const [selected, setSelected] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleWakeUp = () => {
    setStep('awaking');
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleVideoEnd = () => {
    // Video bittiğinde ufak bir gecikme ile formu getir (Neural Sync hissi)
    setTimeout(() => setStep('config'), 500);
  };

  return (
    <div className="h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden font-sans text-white">
      {/* Arka Plan Süslemesi */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent opacity-50" />

      <AnimatePresence mode="wait">
        {/* 1. SEKAN: UYKU VE UYANIŞ (VİDEO) */}
        {(step === 'sleeping' || step === 'awaking') && (
          <motion.div 
            key="fox-stage"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, scale: 1.05, filter: "blur(40px)" }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="relative w-[700px] aspect-video flex items-center justify-center">
              {/* VİDEO MASKESİ VE FİLTRESİ */}
              <video 
                ref={videoRef}
                src="/fox-awake.mp4"
                onEnded={handleVideoEnd}
                muted
                playsInline
                className={`w-full h-full object-contain mix-blend-screen transition-all duration-1000 ${
                  step === 'sleeping' ? 'opacity-30 grayscale blur-[2px]' : 'opacity-100'
                }`}
                style={{ 
                  // KUTUYU YOK EDEN SİHİRLİ SATIRLAR:
                  filter: "contrast(1.2) brightness(1.1) saturate(1.1)",
                  WebkitMaskImage: "radial-gradient(circle, black 50%, transparent 95%)",
                  maskImage: "radial-gradient(circle, black 50%, transparent 95%)"
                }}
              />
              
              {/* Overlay Gradient (Kutuyu tamamen gömmek için) */}
              <div className="absolute inset-0 bg-[#050505]/10 pointer-events-none" />
            </div>

            {step === 'sleeping' && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="flex items-center gap-2 text-orange-500/50 font-mono text-[10px] tracking-[0.4em] uppercase">
                  <Activity className="w-3 h-3 animate-pulse" />
                  System: Standby Mode
                </div>
                
                <button 
                  onClick={handleWakeUp}
                  className="group relative px-12 py-5 bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-orange-500/50 active:scale-95"
                >
                  <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center gap-3 text-sm font-bold tracking-widest uppercase">
                    <Power className="w-4 h-4 text-orange-500" /> Wake up must-b
                  </span>
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 2. SEKAN: KURULUM VE KİMLİK (FORM) */}
        {step === 'config' && (
          <motion.div 
            key="config-stage"
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            className="z-20 w-full max-w-2xl"
          >
            <div className="glass p-12 rounded-[40px] border border-white/10 bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden">
              {/* Üst Bilgi */}
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-4xl font-bold tracking-tight mb-2 italic">Systems Online.</h2>
                  <p className="text-orange-500/80 font-mono text-xs tracking-widest flex items-center gap-2">
                    <Fingerprint className="w-4 h-4" /> AGENT ID: MB-{Math.floor(Math.random() * 9000) + 1000}-SYNC
                  </p>
                </div>
                <div className="px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-tighter">
                  Local Mode Active
                </div>
              </div>

              {/* Seçenekler */}
              <div className="space-y-8 text-left">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 ml-1">Select Specialization</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setSelected('dev')}
                      className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col gap-4 group ${
                        selected === 'dev' ? 'bg-orange-500 border-orange-500' : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <Brain className={`w-10 h-10 ${selected === 'dev' ? 'text-white' : 'text-orange-500'}`} />
                      <div className="text-left">
                        <p className="font-bold text-lg leading-none">Software Dev</p>
                        <p className={`text-[10px] mt-1 ${selected === 'dev' ? 'text-white/80' : 'text-white/40'}`}>Coding & Architecture</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => setSelected('legal')}
                      className={`p-8 rounded-3xl border transition-all duration-500 flex flex-col gap-4 group ${
                        selected === 'legal' ? 'bg-orange-500 border-orange-500' : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <Shield className={`w-10 h-10 ${selected === 'legal' ? 'text-white' : 'text-orange-500'}`} />
                      <div className="text-left">
                        <p className="font-bold text-lg leading-none">Legal Expert</p>
                        <p className={`text-[10px] mt-1 ${selected === 'legal' ? 'text-white/80' : 'text-white/40'}`}>Laws & Regulations</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Alt Aksiyon */}
                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <button className="text-xs font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest">
                    Manual Config
                  </button>
                  <button 
                    disabled={!selected}
                    className={`px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all ${
                      selected ? 'bg-white text-black hover:bg-orange-500 hover:text-white' : 'bg-white/5 text-white/20 cursor-not-allowed'
                    }`}
                  >
                    Generate Agent <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocalSetup;