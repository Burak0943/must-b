import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, Brain, Shield, ChevronRight, Activity, Zap } from "lucide-react";

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
    setTimeout(() => setStep('config'), 300;
  };

  return (
    <div className="h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden font-sans text-white">
      
      {/* 🌌 DİNAMİK ARKA PLAN IŞIĞI (Tilkinin arkasındaki aura) */}
      <div className={`absolute inset-0 transition-all duration-1000 ${step === 'awaking' ? 'bg-orange-950/20' : 'bg-transparent'}`} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {/* 1. SEKAN: TİLKİ VE UYANIŞ */}
        {(step === 'sleeping' || step === 'awaking') && (
          <motion.div 
            key="fox-stage"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(50px)" }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* 🦊 VİDEO KONTEYNERI (Sihir burada) */}
            <div className="relative w-[800px] aspect-video flex items-center justify-center">
              
              <video 
                ref={videoRef}
                src="/fox-awake.mp4"
                onEnded={handleVideoEnd}
                muted playsInline
                className={`w-full h-full object-contain mix-blend-screen transition-all duration-1000 ${
                  step === 'sleeping' ? 'opacity-40 grayscale scale-95' : 'opacity-100 scale-100'
                }`}
                style={{ 
                  /* 1. KUTUYU YOK ETMEK İÇİN KONTRASTI ZORLA */
                  filter: "contrast(1.5) brightness(0.9) saturate(1.2)",
                  /* 2. KENARLARI ADETA ERİTEN MASKE */
                  maskImage: "radial-gradient(circle at center, black 30%, transparent 75%)",
                  WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 75%)",
                }}
              />

              {/* TİLKİNİN ALTINDAKİ HAFİF GÖLGE / YANSIMA */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-4 bg-orange-600/20 blur-2xl rounded-full opacity-50" />
            </div>

            {step === 'sleeping' && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center gap-6 mt-[-40px]">
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
                   <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-mono tracking-[0.5em] text-white/40 uppercase">System Hibernated</span>
                </div>
                
                <button 
                  onClick={handleWakeUp}
                  className="group relative px-14 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  <span className="flex items-center gap-3">
                    <Power className="w-4 h-4" /> Wake up must-b
                  </span>
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 2. SEKAN: PREMIUM SETUP FORMU */}
        {step === 'config' && (
          <motion.div 
            key="config-stage"
            initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            className="z-20 w-full max-w-2xl px-6"
          >
            <div className="glass p-12 rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-3xl shadow-2xl relative overflow-hidden">
              
              {/* Üst Header */}
              <div className="flex justify-between items-center mb-16">
                <div>
                  <h2 className="text-4xl font-bold tracking-tight italic">must-b <span className="text-orange-500">online</span></h2>
                  <p className="text-white/30 text-[10px] font-mono tracking-widest mt-1">NEURAL LINK ESTABLISHED</p>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-bold text-orange-500/50 uppercase tracking-tighter">Local Kernel v1.0</span>
                   <div className="flex gap-1 mt-1">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-1 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: `${i*0.2}s`}} />)}
                   </div>
                </div>
              </div>

              {/* Kartlar */}
              <div className="grid grid-cols-2 gap-6 mb-12">
                {[
                  { id: 'dev', label: 'Software Dev', icon: Brain, desc: 'Full-stack & Architecture' },
                  { id: 'legal', label: 'Legal Advisor', icon: Shield, desc: 'Law, Compliance & Docs' }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => setSelected(opt.id)}
                    className={`relative p-8 rounded-[2rem] border transition-all duration-500 text-left overflow-hidden group ${
                      selected === opt.id ? 'bg-orange-600 border-orange-500' : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <opt.icon className={`w-10 h-10 mb-6 transition-colors ${selected === opt.id ? 'text-white' : 'text-orange-500'}`} />
                    <p className="font-bold text-xl">{opt.label}</p>
                    <p className={`text-[10px] mt-1 uppercase tracking-wider ${selected === opt.id ? 'text-white/60' : 'text-white/30'}`}>{opt.desc}</p>
                    
                    {selected === opt.id && (
                       <motion.div layoutId="glow" className="absolute inset-0 bg-white/10 blur-xl pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>

              {/* Alt Buton */}
              <button 
                disabled={!selected}
                className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
                  selected 
                  ? 'bg-white text-black hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-[0.98]' 
                  : 'bg-white/5 text-white/10 cursor-not-allowed opacity-50'
                }`}
              >
                Launch Intelligence <ChevronRight className="w-5 h-5" />
              </button>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default LocalSetup;