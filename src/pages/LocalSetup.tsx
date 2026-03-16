import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, Brain, Shield, ChevronRight } from "lucide-react";

const LocalSetup = () => {
  const [step, setStep] = useState<'sleeping' | 'awaking' | 'config'>('sleeping');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleWakeUp = () => {
    setStep('awaking');
    // Video oynatımı başladığında sesi açabiliriz veya sadece oynatabiliriz
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  // Video bittiğinde otomatik olarak konfigürasyon sayfasına geç
  const handleVideoEnd = () => {
    setStep('config');
  };

  return (
    <div className="h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        
        {/* 1. UYKU VE UYANIŞ VİDEO KATMANI */}
        {(step === 'sleeping' || step === 'awaking') && (
          <motion.div 
            key="fox-video"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            className="relative flex flex-col items-center"
          >
            {/* VİDEO BİLEŞENİ */}
            <div className="relative w-[600px] aspect-video">
              <video 
                ref={videoRef}
                src="/fox-awake.mp4" // Buraya videonun ismini yazıyoruz
                onEnded={handleVideoEnd}
                className={`w-full h-full object-contain mix-blend-screen transition-opacity duration-1000 ${step === 'sleeping' ? 'opacity-40 grayscale' : 'opacity-100'}`}
                muted
                playsInline
              />
              
              {/* Alt kısımdaki siyahlığı yumuşatmak için maske */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
            </div>

            {step === 'sleeping' && (
              <motion.button 
                onClick={handleWakeUp}
                whileHover={{ scale: 1.05 }}
                className="mt-8 px-12 py-4 bg-orange-600/10 border border-orange-500/30 text-orange-500 rounded-full font-bold tracking-widest uppercase text-xs hover:bg-orange-500 hover:text-white transition-all duration-500"
              >
                <Power className="inline-block w-4 h-4 mr-2" /> Initiate System Wake-up
              </motion.button>
            )}
          </motion.div>
        )}

        {/* 2. KURULUM FORMU (VİDEO BİTTİKTEN SONRA) */}
        {step === 'config' && (
          <motion.div 
            key="config-form"
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg p-12 glass rounded-[3rem] border border-white/10 text-center"
          >
            <h2 className="text-3xl font-bold mb-2">Systems Online.</h2>
            <p className="text-muted-foreground mb-10 text-sm italic">"I'm ready when you are, Captain."</p>

            <div className="space-y-6 text-left">
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Choose My Path</p>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-6 glass rounded-2xl border border-white/5 hover:border-orange-500/50 flex flex-col items-center gap-3 transition-all group">
                    <Brain className="w-8 h-8 text-muted-foreground group-hover:text-orange-500" />
                    <span className="font-bold text-sm">Software Dev</span>
                  </button>
                  <button className="p-6 glass rounded-2xl border border-white/5 hover:border-orange-500/50 flex flex-col items-center gap-3 transition-all group">
                    <Shield className="w-8 h-8 text-muted-foreground group-hover:text-orange-500" />
                    <span className="font-bold text-sm">Legal Expert</span>
                  </button>
                </div>
              </div>

              <button className="w-full py-5 bg-white text-black rounded-2xl font-bold text-lg hover:bg-orange-500 hover:text-white transition-all shadow-2xl shadow-orange-500/10 flex items-center justify-center gap-2">
                Continue to Dashboard <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default LocalSetup;