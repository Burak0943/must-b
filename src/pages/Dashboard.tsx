import { motion, AnimatePresence } from "framer-motion";
import { Activity, Cpu, Zap, Settings as SettingsIcon, LogOut, Menu, X, ChevronRight, Bot, BrainCircuit, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useGatewaySync } from "@/hooks/useGatewaySync";
import { toast } from "sonner";

const navItems = [
  { icon: Activity, label: "Overview" },
  { icon: Bot, label: "AI Agents" },
  { icon: SettingsIcon, label: "Settings" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const agentId = searchParams.get("agentId");

  // Keep local Gateway in sync with cloud auth state via Supabase Realtime
  useGatewaySync();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);

  // --- CANLI VERİ STATE'LERİ ---
  const [currentAgent, setCurrentAgent] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const initDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      setUser(session.user);

      // Profil Çek
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).single();
      if (profile) setFullName(profile.full_name);

      // Ajanı Bul (URL'deki ID veya en son aktif olan)
      let targetId = agentId;
      if (!targetId) {
        const { data: latest } = await supabase.from('mustb_agents').select('id').order('created_at', { ascending: false }).limit(1).single();
        targetId = latest?.id;
      }

      if (targetId) {
        const { data: agentData } = await supabase.from('mustb_agents').select('*').eq('id', targetId).single();
        setCurrentAgent(agentData);

        // REALTIME: Ajan Güncellemelerini Dinle
        supabase.channel(`sync_${targetId}`).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'mustb_agents', filter: `id=eq.${targetId}` }, 
          (payload) => setCurrentAgent(payload.new)
        ).subscribe();
      }

      // Logları Çek
      const { data: logsData } = await supabase.from('swarm_logs').select('*').order('created_at', { ascending: false }).limit(5);
      setLogs(logsData || []);

      setLoading(false);
    };
    initDashboard();
  }, [navigate, agentId]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0a0a0a]"><Loader2 className="animate-spin text-primary" /></div>;

  const displayAgentName = fullName || user?.email?.split('@')[0] || 'Commander';

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      
      {/* SIDEBAR (Senin Orijinal Yapın) */}
      <aside className={`fixed md:static z-50 h-full w-64 border-r border-white/5 p-6 flex flex-col gap-8 bg-background transition-transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-xs font-black">B</div> must-b
          </Link>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X /></button>
        </div>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <button key={item.label} onClick={() => setActiveTab(item.label)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${activeTab === item.label ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5"}`}>
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={() => supabase.auth.signOut().then(() => navigate('/'))} className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-red-500">
          <LogOut className="w-4 h-4" /> Disconnect
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-bold">{activeTab === "Overview" ? "Command Center" : activeTab}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Commander: {displayAgentName}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary font-bold bg-primary/5">
            {displayAgentName.charAt(0)}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "Overview" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* CPU CARD */}
              <div className="glass p-6 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-4"><Cpu className="w-5 h-5 text-primary" /><span className="text-xs font-mono text-muted-foreground uppercase">Global CPU Load</span></div>
                <div className="text-3xl font-bold mb-4 tabular-nums">{currentAgent?.score || 0}%</div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${currentAgent?.score || 0}%` }} className="bg-primary h-full" />
                </div>
              </div>

              {/* RAM CARD */}
              <div className="glass p-6 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-4"><BrainCircuit className="w-5 h-5 text-emerald-500" /><span className="text-xs font-mono text-muted-foreground uppercase">Neural Memory</span></div>
                <div className="text-3xl font-bold mb-4 tabular-nums">{currentAgent?.specs?.ram || 0} GB</div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${(currentAgent?.specs?.ram / 32) * 100}%` }} className="bg-emerald-500 h-full" />
                </div>
              </div>

              {/* STATUS CARD */}
              <div className="glass p-6 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-4"><Zap className="w-5 h-5 text-amber-500" /><span className="text-xs font-mono text-muted-foreground uppercase">Agent Status</span></div>
                <div className="text-3xl font-bold mb-4 uppercase tracking-tighter italic">{currentAgent ? "Online" : "Scanning..."}</div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${currentAgent ? 'bg-amber-500 w-full' : 'w-0'}`} />
                </div>
              </div>

              {/* LOGS */}
              <div className="md:col-span-3 glass p-8 rounded-3xl border border-white/5 mt-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold">Recent Swarm Activity</h3>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  {logs.map((log, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${log.action_type === 'Warning' ? 'bg-red-500' : 'bg-primary'}`} />
                        <span className="text-sm text-gray-400">{log.action_title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-600 uppercase">{new Date(log.created_at).toLocaleTimeString()}</span>
                    </div>
                  ))}
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