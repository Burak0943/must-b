import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Cpu, Zap, Settings, LogOut, 
  Terminal, Globe, Shield, Brain, Layers, 
  ChevronRight, Gauge, Radio, Box, Database, HardDrive
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [agent, setAgent] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Overview");
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const syncData = async () => {
      // 1. En son aktif ajanı bul (Terminalden en son veri gönderen)
      const { data: latest } = await supabase
        .from('mustb_agents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (latest) {
        setAgent(latest);
        
        // 🧬 REALTIME: Bu ajanı canlı takip et
        supabase.channel(`agent_${latest.id}`)
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'mustb_agents', filter: `id=eq.${latest.id}` }, 
            (payload) => setAgent(payload.new)
          ).subscribe();
      }

      // 📜 LOGLARI ÇEK VE DİNLE
      const { data: logData } = await supabase.from('swarm_logs').select('*').order('created_at', { ascending: false }).limit(8);
      setLogs(logData || []);

      supabase.channel('logs')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'swarm_logs' }, 
          (payload) => setLogs(prev => [payload.new, ...prev].slice(0, 8))
        ).subscribe();
    };

    syncData();

    // Nabız efekti: Değerler sabit kalsa bile barların ucu hafif titreşim yapar (Yaşayan Veri)
    const interval = setInterval(() => setPulse(Math.random() * 1.5 - 0.75), 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full bg-[#020202] text-[#e0e0e0] flex overflow-hidden font-sans selection:bg-orange-500/30">
      
      {/* 🌑 ULTRA-SLIM SIDEBAR (Profesyonel Siyah) */}
      <aside className="w-16 hover:w-64 transition-all duration-700 border-r border-white/[0.03] bg-black/40 backdrop-blur-3xl flex flex-col items-center py-8 group z-50">
        <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center mb-12 shadow-[0_0_20px_rgba(234,88,12,0.2)]">
          <span className="font-black text-black italic">b</span>
        </div>
        
        <nav className="flex-1 space-y-6 w-full px-4">
          {[
            { id: 'Overview', icon: Gauge },
            { id: 'Agents', icon: Database },
            { id: 'Global', icon: Globe },
            { id: 'Secure', icon: Shield },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-center py-3 rounded-lg transition-all ${activeTab === item.id ? 'text-orange-500 bg-orange-500/5' : 'text-gray-700 hover:text-gray-400'}`}
            >
              <item.icon size={18} strokeWidth={1.5} />
            </button>
          ))}
        </nav>

        <button onClick={() => navigate('/')} className="text-gray-800 hover:text-red-500 transition-colors p-4">
          <LogOut size={18} />
        </button>
      </aside>

      {/* 🚀 COMMAND CENTER */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-[0.98]">
        
        {/* TOP HUD (Gösterge Paneli Üstü) */}
        <header className="h-16 border-b border-white/[0.03] flex items-center justify-between px-10 relative z-10 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-gray-500">System: Active</span>
            </div>
            <span className="font-mono text-[9px] text-gray-700 tracking-[0.2em] border-l border-white/5 pl-6">NODE_ID: 0x943_MUST_B</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-orange-500/5 border border-orange-500/20 px-4 py-1.5 rounded text-[10px] font-mono text-orange-500 uppercase tracking-widest">
               {agent?.agent_name || "OFFLINE"}
             </div>
          </div>
        </header>

        {/* 📊 GRID LAYOUT */}
        <div className="flex-1 p-8 grid grid-cols-12 gap-6 relative z-10">
          
          {/* NPU (CPU) - Minimalist Data */}
          <div className="col-span-12 lg:col-span-4 group">
            <div className="h-full bg-white/[0.01] border border-white/[0.04] rounded-2xl p-8 hover:bg-white/[0.02] transition-all duration-500">
              <div className="flex justify-between items-start mb-10">
                <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">Processing Load (NPU)</span>
                <Cpu size={14} className="text-gray-700 group-hover:text-orange-500 transition-colors" />
              </div>
              <div className="text-7xl font-black tracking-tighter tabular-nums mb-6 italic opacity-90">
                {agent?.score || 0}<span className="text-orange-500 text-xl not-italic ml-1">%</span>
              </div>
              <div className="w-full h-[1px] bg-white/5 relative">
                <motion.div 
                  animate={{ width: `${(agent?.score || 0) + pulse}%` }}
                  className="absolute h-full bg-orange-500" 
                />
              </div>
            </div>
          </div>

          {/* MEMORY - No Gradients, Just Tech */}
          <div className="col-span-12 lg:col-span-4 group">
            <div className="h-full bg-white/[0.01] border border-white/[0.04] rounded-2xl p-8 hover:bg-white/[0.02] transition-all duration-500">
              <div className="flex justify-between items-start mb-10">
                <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">Neural Buffer (RAM)</span>
                <HardDrive size={14} className="text-gray-700 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div className="text-7xl font-black tracking-tighter tabular-nums mb-6 italic opacity-90 text-emerald-500/80">
                {agent?.specs?.ram || 0}<span className="text-gray-600 text-xl not-italic ml-1">GB</span>
              </div>
              <div className="flex gap-1.5">
                {Array.from({length: 20}).map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-sm ${i < (agent?.specs?.ram || 0) ? 'bg-emerald-500/40' : 'bg-white/5'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* STATUS - Dark & Sharp */}
          <div className="col-span-12 lg:col-span-4 bg-orange-600/[0.01] border border-orange-500/10 rounded-2xl p-8 flex flex-col justify-between group">
            <div className="flex justify-between items-center">
              <Radio size={16} className="text-orange-500" />
              <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em]">Tier: {agent?.tier || "CORE"}</span>
            </div>
            <div>
              <p className="text-4xl font-bold tracking-tighter uppercase italic text-white/90">Online</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1 h-1 bg-orange-500 rounded-full" />
                <p className="text-[9px] font-mono text-gray-700 uppercase tracking-widest leading-none">Established Connection 12.0</p>
              </div>
            </div>
          </div>

          {/* EVENT STREAM (LOGS) - Clear & Clean */}
          <div className="col-span-12 lg:col-span-12 bg-black/20 border border-white/[0.02] rounded-3xl p-10">
            <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.5em] text-gray-500 flex items-center gap-3">
                <Terminal size={14} className="text-orange-500" /> Neural Event Stream
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-[9px] font-mono text-gray-700 uppercase">Live Update Sync</div>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {logs.map((log, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.02] group">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[9px] text-gray-700">{new Date(log.created_at).toLocaleTimeString()}</span>
                    <p className="text-[11px] font-medium text-gray-500 group-hover:text-gray-300 transition-colors">{log.action_title}</p>
                  </div>
                  <span className={`text-[8px] font-mono px-2 py-0.5 rounded ${log.action_type === 'Warning' ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-gray-600'}`}>
                    {log.action_type}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default Dashboard;