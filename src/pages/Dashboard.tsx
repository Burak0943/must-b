import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Cpu, Zap, Settings as SettingsIcon, LogOut, 
  Menu, X, Shield, Key, Save, Loader2, Plus, Trash2, 
  Power, Bot, BrainCircuit, ChevronRight 
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; 
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const agentIdFromUrl = searchParams.get("agentId");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);

  // --- MUST-B LIVE DATA ---
  const [agent, setAgent] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");

  // 📡 1. AUTH VE DATA SYNC
  useEffect(() => {
    const initDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      setUser(session.user);

      // Profili çek
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).single();
      if (profile) setFullName(profile.full_name);

      // 🎯 EN ÖNEMLİ KISIM: Ajanı Bul
      let targetAgentId = agentIdFromUrl;

      if (!targetAgentId) {
        const { data: latest } = await supabase.from('mustb_agents').select('id').order('created_at', { ascending: false }).limit(1).single();
        targetAgentId = latest?.id;
      }

      if (targetAgentId) {
        const { data: agentData } = await supabase.from('mustb_agents').select('*').eq('id', targetAgentId).single();
        setAgent(agentData);

        // 🧬 REALTIME: Bu ajanı canlı dinle
        const channel = supabase
          .channel(`live_agent_${targetAgentId}`)
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'mustb_agents', filter: `id=eq.${targetAgentId}` }, 
            (payload) => {
              setAgent(payload.new);
              console.log("Canlı Veri Senkronize Edildi 🦊");
            }
          ).subscribe();

        // 📜 LOGLARI DİNLE
        const logChannel = supabase
          .channel('swarm_logs')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'swarm_logs' }, 
            (payload) => setLogs(prev => [payload.new, ...prev].slice(0, 5))
          ).subscribe();

        // İlk logları çek
        const { data: initialLogs } = await supabase.from('swarm_logs').select('*').order('created_at', { ascending: false }).limit(5);
        if (initialLogs) setLogs(initialLogs);

        return () => {
          supabase.removeChannel(channel);
          supabase.removeChannel(logChannel);
        };
      }
      setLoading(false);
    };
    initDashboard();
  }, [navigate, agentIdFromUrl]);

  if (loading && !agent) return <div className="h-screen bg-black flex items-center justify-center font-mono text-orange-500 animate-pulse uppercase tracking-[0.5em]">Establishing Neural Link...</div>;

  const commanderName = fullName || user?.email?.split('@')[0] || 'Commander';

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className={`fixed md:static z-50 h-full w-64 border-r border-white/5 p-6 flex flex-col bg-black/80 backdrop-blur-2xl transition-all ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-black shadow-[0_0_15px_rgba(234,88,12,0.4)]">B</div>
          <span className="font-bold tracking-tighter text-xl italic">must-b</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {[
            { id: 'Overview', icon: Activity, label: "Overview" },
            { id: 'AI Agents', icon: Bot, label: "Neural Swarm" },
            { id: 'Settings', icon: SettingsIcon, label: "Kernel Config" }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === item.id ? "bg-orange-600/10 text-orange-500 border border-orange-500/20" : "text-gray-500 hover:text-white"}`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>

        <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-500 transition-colors text-sm">
          <LogOut size={18} /> Disconnect Hub
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative bg-[radial-gradient(circle_at_top_right,_rgba(234,88,12,0.05),_transparent)]">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight">{activeTab}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Neural Link: Stable // Cmd: {commanderName}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-mono text-gray-500 uppercase">Active Agent</p>
              <p className="text-sm font-bold text-orange-500">{agent?.agent_name || "Scanning..."}</p>
            </div>
            <div className="w-12 h-12 rounded-full border border-orange-500/30 flex items-center justify-center bg-orange-500/5 text-orange-500 font-bold">{commanderName.charAt(0)}</div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "Overview" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              
              {/* 📊 LIVE METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Local CPU Load", value: `${agent?.score || 0}%`, icon: Cpu, color: "text-orange-500", sub: agent?.tier || "Unknown" },
                  { label: "Neural Memory", value: `${agent?.specs?.ram || 0} GB`, icon: BrainCircuit, color: "text-emerald-500", sub: "DDR5 Architecture" },
                  { label: "Agent Status", value: agent ? "ONLINE" : "OFFLINE", icon: Zap, color: "text-amber-500", sub: "Verified Link" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md group hover:border-orange-500/30 transition-all duration-500">
                    <stat.icon className={`${stat.color} mb-6`} size={24} />
                    <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">{stat.label}</p>
                    <div className="text-4xl font-black mb-4 tabular-nums">{stat.value}</div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div animate={{ width: stat.value.includes('%') ? stat.value : '100%' }} className={`h-full bg-gradient-to-r from-transparent to-current ${stat.color}`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* 🦊 HEARTBEAT & LOGS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 p-8 rounded-[3rem]">
                  <h3 className="font-bold text-lg mb-8 flex items-center gap-2 italic"><Activity size={18} className="text-orange-500" /> Swarm Intelligence Logs</h3>
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${log.action_type === 'Warning' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          <span className="text-sm text-gray-300">{log.action_title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-600">{new Date(log.created_at).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-orange-600/[0.03] border border-orange-500/10 p-10 rounded-[3rem] flex flex-col items-center justify-center text-center">
                  <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity }} className="relative mb-8">
                    <img src="/fox-awake.png" className="w-32 h-32 object-contain drop-shadow-[0_0_40px_rgba(234,88,12,0.3)]" />
                  </motion.div>
                  <p className="text-[10px] font-mono text-orange-500/50 uppercase tracking-[0.4em] mb-4">Neural Heartbeat</p>
                  <p className="text-xs text-gray-500 leading-relaxed italic">"Must-b is currently monitoring your hardware nodes and local kernel signals."</p>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
// must-b version 1.0.1 - test deploy