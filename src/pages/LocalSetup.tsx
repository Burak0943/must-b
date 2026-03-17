import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, Brain, ChevronRight, Cpu, Activity, Zap } from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from "react-router-dom"; // Sayfa geçişi için eklendi

// --- 1. SUPABASE BAĞLANTISI ---
const supabase = createClient(
  'https://diyigivqkjknkbusggrq.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpeWlnaXZxa2prbmtidXNnZ3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0Mjc0MTUsImV4cCI6MjA4OTAwMzQxNX0.mGIPAQ5BIh8SBvdyItXYDmiv829svybeNrBvng4eXXs'
);

const LocalSetup = () => {
  const navigate = useNavigate(); // Yönlendirme fonksiyonu
  const [step, setStep] = useState<'sleeping' | 'awaking' | 'config'>('sleeping');
  const [selected, setSelected] = useState<string | null>(null);
  const [agents, setAgents] = useState<any[]>([]); 
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- 2. GERÇEK ZAMANLI VERİ TAKİBİ ---
  useEffect(() => {
    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from('mustb_agents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) setAgents(data);
    };

    fetchAgents();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mustb_agents' },
        (payload) => {
          setAgents((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleWakeUp = () => {
    setStep('awaking');
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleVideoEnd = () => {
    setTimeout(() => setStep('config'), 300);
  };

  // --- 3. FIRLATMA FONKSİYONU ---
  const handleLaunch = () => {
    if (selected) {
      // Seçilen ajanın ID'si ile Dashboard'a gidiyoruz
      navigate(`/dashboard?agentId=${selected}`);
    }
  };

  return (
    <div className="h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden font-sans text-white">
      
      {/* 🌌 ARKA PLAN EFEKTLERİ */}
      <div className={`absolute inset-0 transition-all duration-1000 ${step === 'awaking' ? 'bg-orange-950/20' : 'bg-transparent'}`} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {/* SEKAN 1: TİLKİ VE UYANIŞ */}
        {(step === 'sleeping' || step === 'awaking') && (
          <motion.div 
            key="fox-stage"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(50px)" }}
            className="relative z-10 flex flex-col items-center"
          >
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
                  filter: "contrast(1.5) brightness(0.9) saturate(1.2)",
                  maskImage: "radial-gradient(circle at center, black 30%, transparent 75%)",
                  WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 75%)",
                }}
              />
            </div>

            {step === 'sleeping' && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center gap-6 mt-[-40px]">
                <button 
                  onClick={handleWakeUp}
                  className="px-14 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  <span className="flex items-center gap-3"><Power className="w-4 h-4" /> Wake up must-b</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* SEKAN 2: DİNAMİK KURULUM EKRANI */}
        {step === 'config' && (
          <motion.div 
            key="config-stage"
            initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            className="z-20 w-full max-w-2xl px-6"
          >
            <div className="glass p-12 rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-3xl shadow-2xl relative overflow-hidden">
              
              <div className="flex justify-between items-center mb-16">
                <div>
                  <h2 className="text-4xl font-bold tracking-tight italic">must-b <span className="text-orange-500">online</span></h2>
                  <p className="text-white/30 text-[10px] font-mono tracking-widest mt-1 uppercase">
                    {agents.length > 0 ? "Neural Link Established" : "Waiting for Local Signal..."}
                  </p>
                </div>
              </div>

              {/* 🧠 DİNAMİK AJAN KARTLARI */}
              <div className="grid grid-cols-1 gap-4 mb-12 max-h-[350px] overflow-y-auto pr-2">
                {agents.length > 0 ? (
                  agents.map((agent) => (
                    <button 
                      key={agent.id}
                      onClick={() => setSelected(agent.id)}
                      className={`relative p-8 rounded-[2rem] border transition-all duration-500 text-left flex items-center justify-between group ${
                        selected === agent.id 
                        ? 'bg-orange-600 border-orange-500 shadow-[0_0_40px_rgba(234,88,12,0.3)]' 
                        : 'bg-white/5 border-white/10 hover:border-orange-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl ${selected === agent.id ? 'bg-white/20' : 'bg-orange-500/10'}`}>
                          <Cpu className={`w-8 h-8 ${selected === agent.id ? 'text-white' : 'text-orange-500'}`} />
                        </div>
                        <div>
                          <p className="font-bold text-xl">{agent.agent_name}</p>
                          <p className={`text-[10px] mt-1 font-mono uppercase tracking-widest ${selected === agent.id ? 'text-white/70' : 'text-white/30'}`}>
                            {agent.tier} — SCORE: {agent.score}
                          </p>
                        </div>
                      </div>
                      {selected === agent.id && (
                        <div className="bg-white text-orange-600 p-2 rounded-full animate-bounce">
                          <Zap className="w-4 h-4 fill-current" />
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-16 border border-dashed border-white/10 rounded-[2rem] text-center bg-white/[0.01]">
                    <Activity className="w-10 h-10 text-orange-500/20 mx-auto mb-4 animate-pulse" />
                    <p className="text-white/30 text-xs font-mono tracking-widest uppercase italic">Yerel Kernel Bekleniyor...</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleLaunch} // Tıklama fonksiyonu eklendi
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