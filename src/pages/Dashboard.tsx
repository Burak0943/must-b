import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Cpu, Zap, Settings, LogOut, 
  Terminal, Globe, Shield, Brain, Gauge, Radio, HardDrive, ChevronRight
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
      const { data: latest } = await supabase.from('mustb_agents').select('*').order('created_at', { ascending: false }).limit(1).single();
      if (latest) setAgent(latest);

      const { data: logData } = await supabase.from('swarm_logs').select('*').order('created_at', { ascending: false }).limit(6);
      setLogs(logData || []);
    };
    syncData();
    const interval = setInterval(() => setPulse(Math.random() * 2 - 1), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full bg-[#050505] text-white flex overflow-hidden font-sans selection:bg-orange-500/30">
      
      {/* 🌑 SLIM SIDEBAR */}
      <aside className="w-20 border-r border-white/5 bg-black/80 flex flex-col items-center py-10 z-50">
        <div className="w-10 h-10 bg-orange-600 rounded-xl mb-12 flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.4)]">
          <span className="font-black text-black text-xl italic">b</span>
        </div>
        <nav className="flex-1 space-y-8">
          {[Gauge, Brain, Globe, Shield].map((Icon, i) => (
            <button key={i} className="text-gray-600 hover:text-orange-500 transition-colors block mx-auto">
              <Icon size={20} strokeWidth={1.5} />
            </button>
          ))}
        </nav>
        <button onClick={() => navigate('/')} className="text-gray-700 hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>
      </aside>

      {/* 🚀 MAIN CONTENT */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        
        {/* Subtle Grid Background (Göz yormayan, çok hafif bir ızgara) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* TOP HUD */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 relative z-10 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <Radio className="text-orange-500 animate-pulse" size={16} />
            <h1 className="font-mono text-[10px] uppercase tracking-[0.5em] text-gray-400">
              System Status: <span className="text-orange-500">Active</span> // Node: 0x943
            </h1>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded text-[10px] font-mono text-orange-500">
            {agent?.agent_name || "MUST-B CORE"}
          </div>
        </header>

        {/* DATA GRID */}
        <div className="flex-1 p-10 grid grid-cols-12 gap-6 relative z-10 overflow-y-auto">
          
          {/* CPU CARD */}
          <div className="col-span-12 lg:col-span-4 group">
            <div className="h-full bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:border-orange-500/30 transition-all duration-500">
              <div className="flex justify-between items-center mb-10">
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">NPU Workload</span>
                <Cpu size={16} className="text-orange-500" />
              </div>
              <div className="text-7xl font-black tracking-tighter mb-6 italic">
                {agent?.score || 0}<span className="text-orange-500 text-2xl not-italic">%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${(agent?.score || 0) + pulse}%` }} className="h-full bg-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.6)]" />
              </div>
            </div>
          </div>

          {/* RAM CARD */}
          <div className="col-span-12 lg:col-span-4 group">
            <div className="h-full bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:border-emerald-500/30 transition-all duration-500">
              <div className="flex justify-between items-center mb-10">
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Neural Memory</span>
                <HardDrive size={16} className="text-emerald-500" />
              </div>
              <div className="text-7xl font-black tracking-tighter mb-6 italic text-emerald-500">
                {agent?.specs?.ram || 0}<span className="text-gray-600 text-2xl not-italic ml-2">GB</span>
              </div>
              <div className="flex gap-1">
                {Array.from({length: 12}).map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i < 8 ? 'bg-emerald-500' : 'bg-white/5'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* ONLINE STATUS */}
          <div className="col-span-12 lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col justify-between border-l-orange-500/50">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Link Status</span>
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            </div>
            <div>
              <p className="text-5xl font-black tracking-tighter italic uppercase">Online</p>
              <p className="text-[10px] font-mono text-gray-600 mt-2 uppercase tracking-widest">Encrypted Tunnel Stable</p>
            </div>
          </div>

          {/* LOGS - Tertemiz ve Okunaklı */}
          <div className="col-span-12 lg:col-span-12 bg-black/40 border border-white/5 rounded-[2.5rem] p-10">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-gray-500 mb-8 flex items-center gap-3">
              <Terminal size={14} className="text-orange-500" /> Live Intelligence Stream
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {logs.map((log, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-white/[0.03] group hover:bg-white/[0.01] px-4 transition-all">
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-[10px] text-gray-600 italic">{new Date(log.created_at).toLocaleTimeString()}</span>
                    <p className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{log.action_title}</p>
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${log.action_type === 'Warning' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
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