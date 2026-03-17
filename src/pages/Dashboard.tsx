import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Cpu, Zap, Settings, LogOut, 
  Terminal, Globe, Shield, Brain, Layers, 
  ChevronRight, Gauge, Radio, Box
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [agent, setAgent] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Overview");

  // Canlı efekt için sahte "nabız" state'i
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const init = async () => {
      const { data: latest } = await supabase.from('mustb_agents').select('*').order('created_at', { ascending: false }).limit(1).single();
      if (latest) setAgent(latest);

      const { data: initialLogs } = await supabase.from('swarm_logs').select('*').order('created_at', { ascending: false }).limit(6);
      if (initialLogs) setLogs(initialLogs);
    };
    init();

    // Nabız efekti: Değerler sabit kalsa bile barların ucu hafif oynasın
    const interval = setInterval(() => setPulse(Math.random() * 2 - 1), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full bg-[#020202] text-[#e0e0e0] flex overflow-hidden font-sans selection:bg-orange-500/30">
      
      {/* 🌑 ULTRA-MINIMAL SIDEBAR */}
      <aside className="w-20 hover:w-64 transition-all duration-500 border-r border-white/[0.03] bg-black/40 backdrop-blur-3xl flex flex-col items-center py-8 group z-50">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl mb-12 flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.3)]">
          <span className="font-black text-black text-xl italic">b</span>
        </div>
        
        <nav className="flex-1 space-y-4 w-full px-4">
          {[
            { id: 'Overview', icon: Gauge },
            { id: 'Agents', icon: Brain },
            { id: 'Global', icon: Globe },
            { id: 'Secure', icon: Shield },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-center py-4 rounded-xl transition-all ${activeTab === item.id ? 'bg-orange-500/10 text-orange-500' : 'text-gray-600 hover:text-gray-300'}`}
            >
              <item.icon size={20} strokeWidth={1.5} />
            </button>
          ))}
        </nav>

        <button onClick={() => navigate('/')} className="text-gray-700 hover:text-red-500 transition-colors p-4">
          <LogOut size={20} />
        </button>
      </aside>

      {/* 🚀 MAIN COMMAND INTERFACE */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        
        {/* Arka Plan Izgarası (Grid) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* TOP BAR */}
        <header className="h-20 border-b border-white/[0.03] flex items-center justify-between px-10 relative z-10 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Radio className="text-orange-500 animate-pulse" size={16} />
            <h1 className="font-mono text-[10px] uppercase tracking-[0.5em] text-gray-500">
              System Status: <span className="text-orange-500">Operational</span> // Node: 0x8472
            </h1>
          </div>
          <div className="flex items-center gap-6 font-mono text-[10px] text-gray-500">
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-green-500 rounded-full" /> LATENCY: 12ms</span>
            <span className="bg-white/5 px-3 py-1 rounded-md border border-white/10 uppercase tracking-widest text-orange-500">
              {agent?.agent_name || "MUST-B"}
            </span>
          </div>
        </header>

        {/* CONTENT GRID */}
        <div className="flex-1 p-10 grid grid-cols-12 gap-6 relative z-10">
          
          {/* BIG METRIC CARD: CPU */}
          <div className="col-span-12 lg:col-span-4 group">
            <div className="h-full bg-white/[0.01] border border-white/[0.05] rounded-[2rem] p-8 hover:bg-white/[0.03] transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Cpu size={80} />
              </div>
              <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest mb-2">Neural Processing Unit</p>
              <h2 className="text-6xl font-black tracking-tighter tabular-nums mb-8 italic">
                {agent?.score || 0}<span className="text-orange-500 text-2xl not-italic ml-1">%</span>
              </h2>
              <div className="w-full h-[2px] bg-white/5 relative overflow-hidden">
                <motion.div 
                  animate={{ width: `${(agent?.score || 0) + pulse}%` }}
                  className="absolute h-full bg-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.8)]" 
                />
              </div>
            </div>
          </div>

          {/* BIG METRIC CARD: RAM */}
          <div className="col-span-12 lg:col-span-4 group">
            <div className="h-full bg-white/[0.01] border border-white/[0.05] rounded-[2rem] p-8 hover:bg-white/[0.03] transition-all duration-500">
              <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest mb-2">Cognitive Memory Buffer</p>
              <h2 className="text-6xl font-black tracking-tighter tabular-nums mb-8 italic text-emerald-500">
                {agent?.specs?.ram || 0}<span className="text-gray-500 text-2xl not-italic ml-2">GB</span>
              </h2>
              <div className="flex gap-1">
                {Array.from({length: 12}).map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i < 8 ? 'bg-emerald-500/50' : 'bg-white/5'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* SYSTEM UPTIME / STATUS */}
          <div className="col-span-12 lg:col-span-4 bg-orange-600/[0.02] border border-orange-500/10 rounded-[2rem] p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <Box className="text-orange-500" />
               <span className="text-[10px] font-mono text-orange-500/50 uppercase tracking-widest">Active Tier: {agent?.tier || "PRO"}</span>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight mb-1 italic uppercase">Online</p>
              <p className="text-[10px] font-mono text-gray-600">Established via Encrypted Tunnel 1.2</p>
            </div>
          </div>

          {/* ACTIVITY LOG: EN PRO HALI */}
          <div className="col-span-12 lg:col-span-8 bg-black/40 border border-white/[0.03] rounded-[2.5rem] p-10 backdrop-blur-2xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-mono text-xs uppercase tracking-[0.3em] flex items-center gap-3 text-gray-400">
                <Terminal size={14} className="text-orange-500" /> Swarm Event Stream
              </h3>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
              </div>
            </div>
            
            <div className="space-y-4">
              {logs.map((log, i) => (
                <div key={i} className="group flex items-center justify-between py-4 px-6 bg-white/[0.01] hover:bg-white/[0.03] border border-transparent hover:border-white/5 rounded-2xl transition-all">
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-[10px] text-gray-700">{new Date(log.created_at).toLocaleTimeString()}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${log.action_type === 'Warning' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 'text-orange-500 border-orange-500/20 bg-orange-500/5'}`}>
                      {log.action_type}
                    </span>
                    <p className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">{log.action_title}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-800 group-hover:text-orange-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL: NEURAL VISUALIZER */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="flex-1 bg-white/[0.01] border border-white/[0.05] rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative group overflow-hidden">
               <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl rounded-full" />
               <motion.img 
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                src="/fox-awake.png" 
                className="w-32 h-32 object-contain filter drop-shadow-[0_0_20px_rgba(234,88,12,0.2)] grayscale group-hover:grayscale-0 transition-all duration-700" 
               />
               <p className="mt-8 font-mono text-[10px] text-gray-600 uppercase tracking-[0.4em]">Kernel Pulse Monitoring</p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default Dashboard;