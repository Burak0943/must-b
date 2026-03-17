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

const navItems = [
  { icon: Activity, label: "Overview" },
  { icon: Bot, label: "AI Agents" },
  { icon: SettingsIcon, label: "Settings" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const agentId = searchParams.get("agentId"); // URL'den gelen agent ID'si

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [loadingAuth, setLoadingAuth] = useState(true);

  // --- MUST-B REALTIME STATE'LERİ ---
  const [currentAgent, setCurrentAgent] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [agents, setAgents] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // 1. AUTH VE İLK VERİ ÇEKİMİ
  useEffect(() => {
    const initDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);

      // Ajan detaylarını çek (Eğer agentId varsa)
      if (agentId) {
        const { data: agentData } = await supabase
          .from('mustb_agents')
          .select('*')
          .eq('id', agentId)
          .single();
        if (agentData) setCurrentAgent(agentData);
      }

      // Diğer veriler
      const { data: profileData } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).single();
      if (profileData) setFullName(profileData.full_name);

      const { data: logsData } = await supabase.from('swarm_logs').select('*').order('created_at', { ascending: false }).limit(5);
      if (logsData) setLogs(logsData);

      setLoadingAuth(false);
    };
    initDashboard();
  }, [navigate, agentId]);

  // 2. GERÇEK ZAMANLI VERİ TAKİBİ (Realtime)
  useEffect(() => {
    if (!agentId) return;

    // Terminalden (CLI) gelen güncellemeleri anlık yakala
    const channel = supabase
      .channel(`agent_sync_${agentId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'mustb_agents', 
        filter: `id=eq.${agentId}` 
      }, (payload) => {
        setCurrentAgent(payload.new);
        // İsteğe bağlı: Veri her güncellendiğinde küçük bir log atılabilir
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [agentId]);

  // LOG EKLEME FONKSİYONU
  const addLog = async (title: string, type: string = "Success") => {
    if (!user) return;
    const { data, error } = await supabase.from('swarm_logs').insert([{ 
      user_id: user.id, 
      action_title: title, 
      action_type: type 
    }]).select().single();
    if (data) setLogs(prev => [data, ...prev].slice(0, 5));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Disconnected from neural net.");
    navigate("/");
  };

  if (loadingAuth) return (
    <div className="h-screen flex flex-col items-center justify-center bg-black gap-4 font-mono text-orange-500">
      <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <span className="tracking-widest uppercase text-xs">Syncing Neural Core...</span>
    </div>
  );

  const displayAgentName = fullName || user?.email?.split('@')[0] || 'Commander';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-screen bg-background text-foreground overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed md:static z-50 h-full w-64 border-r border-white/5 p-6 flex flex-col gap-8 bg-black/40 backdrop-blur-xl transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-xl tracking-tighter flex items-center gap-2 italic">
            <div className="w-7 h-7 bg-orange-600 rounded-lg flex items-center justify-center text-white text-xs font-black">B</div> must-b
          </Link>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <button key={item.label} onClick={() => { setActiveTab(item.label); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${activeTab === item.label ? "bg-orange-600/10 text-orange-500 border border-orange-500/20 shadow-[0_0_20px_rgba(234,88,12,0.1)]" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}>
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all">
          <LogOut className="w-4 h-4" /> Disconnect
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative custom-scrollbar">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{activeTab}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em]">Neural Link: Stable // Cmd: {displayAgentName}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-orange-600/30 p-1 flex items-center justify-center bg-orange-600/5">
             <span className="font-black text-orange-500">{displayAgentName.charAt(0)}</span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "Overview" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              
              {/* METRIKLER (REALTIME) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                  <Cpu className="w-6 h-6 text-orange-500 mb-6" />
                  <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Local CPU Load</div>
                  <div className="text-4xl font-black tabular-nums">{currentAgent?.score || 0}%</div>
                  <div className="mt-6 bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <motion.div animate={{ width: `${currentAgent?.score || 0}%` }} className="bg-orange-500 h-full" />
                  </div>
                </div>

                <div className="glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
                  <BrainCircuit className="w-6 h-6 text-emerald-500 mb-6" />
                  <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">System Memory</div>
                  <div className="text-4xl font-black tabular-nums">{currentAgent?.specs?.ram || 0} GB</div>
                  <div className="mt-6 text-[10px] text-emerald-500 font-mono italic tracking-tight opacity-50 uppercase">Detected HW Architecture</div>
                </div>

                <div className="glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
                  <Zap className="w-6 h-6 text-amber-500 mb-6" />
                  <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Agent Tier</div>
                  <div className="text-4xl font-black uppercase tracking-tighter text-amber-500">{currentAgent?.tier || "Unknown"}</div>
                  <div className="mt-6 flex gap-1">
                    {[1,2,3,4,5].map(i => <div key={i} className={`w-3 h-1 rounded-full ${i <= (currentAgent?.score > 50 ? 5 : 2) ? 'bg-amber-500' : 'bg-white/10'}`} />)}
                  </div>
                </div>
              </div>

              {/* TİLKİ VE LOGLAR */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 glass p-8 rounded-[2.5rem] border border-white/5">
                  <h3 className="font-bold text-lg mb-8 flex items-center gap-2"><Activity size={18} className="text-orange-500" /> Swarm Intelligence Logs</h3>
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${log.action_type === 'Warning' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          <div>
                            <p className="text-sm font-medium">{log.action_title}</p>
                            <p className="text-[10px] text-muted-foreground">{new Date(log.created_at).toLocaleTimeString()}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-3 py-1 bg-white/5 rounded-lg opacity-50 uppercase tracking-widest">{log.action_type}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-orange-600/5 border border-orange-500/10 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                  <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 4, repeat: Infinity }} className="relative mb-6">
                    <img src="/fox-awake.png" className="w-32 h-32 object-contain drop-shadow-[0_0_30px_rgba(234,88,12,0.3)]" />
                  </motion.div>
                  <p className="text-[10px] font-mono text-orange-500/50 uppercase tracking-[0.4em]">Neural Heartbeat</p>
                  <p className="text-xs text-muted-foreground mt-4 leading-relaxed">Agent "{currentAgent?.agent_name}" is currently monitoring your hardware nodes.</p>
                </div>
              </div>

            </motion.div>
          )}
          {/* AI Agents ve Settings sekmeleri senin kodundaki gibi devam edebilir... */}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default Dashboard;