import { motion, AnimatePresence } from "framer-motion";
import { Activity, Cpu, HardDrive, Zap, Settings as SettingsIcon, User, LogOut, ChevronRight, Menu, X, Shield, Key, Save, Loader2, Plus, Trash2, Power, Bot, BrainCircuit } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [loadingAuth, setLoadingAuth] = useState(true);

  // PROFIL STATE'LERİ
  const [fullName, setFullName] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // CANLI SİMÜLASYON STATE'LERİ
  const [cpuUsage, setCpuUsage] = useState(14.2);
  const [memoryUsage, setMemoryUsage] = useState(8.4);
  const [tasksCompleted, setTasksCompleted] = useState(47);

  // AI AJANLARI STATE'LERİ
  const [agents, setAgents] = useState<any[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentRole, setNewAgentRole] = useState("");
  const [newAgentModel, setNewAgentModel] = useState("gpt-4o");
  const [newAgentPrompt, setNewAgentPrompt] = useState("");

  // YENİ: LOG STATE'İ
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Unauthorized access.");
        navigate("/login");
        return;
      }
      setUser(session.user);
      
      // Profili çek
      const { data: profileData } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).single();
      if (profileData?.full_name) setFullName(profileData.full_name);

      // Logları çek (En son 5 hareket)
      const { data: logsData } = await supabase.from('swarm_logs').select('*').order('created_at', { ascending: false }).limit(5);
      if (logsData) setLogs(logsData);

      setLoadingAuth(false);
    };
    checkAuthAndFetchData();
  }, [navigate]);

  useEffect(() => {
    if (activeTab !== "Overview") return;
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const change = (Math.random() * 6) - 3;
        const next = prev + change;
        return next > 40 ? 40 : next < 5 ? 5 : Number(next.toFixed(1));
      });
      setMemoryUsage(prev => {
        const change = (Math.random() * 0.4) - 0.2;
        const next = prev + change;
        return next > 10 ? 10 : next < 6 ? 6 : Number(next.toFixed(1));
      });
      if (Math.random() > 0.7) setTasksCompleted(prev => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "AI Agents" && user) {
      fetchAgents();
    }
  }, [activeTab, user]);

  const fetchAgents = async () => {
    setLoadingAgents(true);
    const { data, error } = await supabase.from('ai_agents').select('*').order('created_at', { ascending: false });
    if (error) toast.error("Failed to load neural agents.");
    else setAgents(data || []);
    setLoadingAgents(false);
  };

  // YENİ: LOG EKLEME FONKSİYONU
  const addLog = async (title: string, type: string = "Success") => {
    if (!user) return;
    const { data } = await supabase.from('swarm_logs').insert([{ user_id: user.id, action_title: title, action_type: type }]).select().single();
    if (data) setLogs(prev => [data, ...prev].slice(0, 5)); // Sadece son 5 logu tut
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName || !newAgentPrompt) return toast.error("Name and System Prompt are required.");
    setIsAddingAgent(true);

    const { data, error } = await supabase.from('ai_agents').insert([{ 
        user_id: user.id, name: newAgentName, role: newAgentRole, model: newAgentModel, system_prompt: newAgentPrompt 
    }]).select().single();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("New AI Agent synthesized and deployed.");
      setAgents([data, ...agents]);
      setNewAgentName(""); setNewAgentRole(""); setNewAgentPrompt(""); setNewAgentModel("gpt-4o");
      
      // LOG KAYDI AT
      await addLog(`Synthesized agent: ${data.name}`);
    }
    setIsAddingAgent(false);
  };

  const toggleAgentStatus = async (id: string, currentStatus: boolean, agentName: string) => {
    const { error } = await supabase.from('ai_agents').update({ is_active: !currentStatus }).eq('id', id);

    if (error) {
      toast.error("Neural link update failed.");
    } else {
      setAgents(agents.map(a => a.id === id ? { ...a, is_active: !currentStatus } : a));
      toast.success(currentStatus ? "Agent put to sleep." : "Agent awakened.");
      
      // LOG KAYDI AT
      await addLog(`Status changed for ${agentName} (${!currentStatus ? 'ONLINE' : 'OFFLINE'})`, "System");
    }
  };

  const deleteAgent = async (id: string, agentName: string) => {
    const { error } = await supabase.from('ai_agents').delete().eq('id', id);

    if (error) {
      toast.error("Failed to terminate agent.");
    } else {
      setAgents(agents.filter(a => a.id !== id));
      toast.info("Agent permanently terminated.");
      
      // LOG KAYDI AT
      await addLog(`Terminated agent: ${agentName}`, "Warning");
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsUpdatingProfile(true);
    try {
      const { error } = await supabase.from('profiles').upsert({ id: user.id, full_name: fullName, updated_at: new Date().toISOString() });
      if (error) throw error;
      toast.success("Commander profile synced.");
      
      // LOG KAYDI AT
      await addLog("Commander identity signature updated");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast.success("Disconnected.");
      navigate("/");
    }
  };

  if (loadingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <span className="pulse-dot w-4 h-4 bg-primary rounded-full animate-pulse" />
      </div>
    );
  }

  const displayAgentName = fullName || (user?.email ? user.email.split('@')[0] : 'Commander');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-screen bg-background text-foreground overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed md:static z-50 h-full w-64 border-r border-white/5 p-6 flex flex-col gap-8 bg-background transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-xl tracking-tighter text-foreground flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-xs font-black">B</div> must-b
          </Link>
          <button className="md:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <motion.button key={item.label} onClick={() => { setActiveTab(item.label); setSidebarOpen(false); }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${activeTab === item.label ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}>
              <item.icon className="w-4 h-4" /> {item.label}
            </motion.button>
          ))}
        </nav>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20">
          <LogOut className="w-4 h-4" /> Disconnect
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
        <header className="flex flex-col md:flex-row justify-between md:items-center mb-12 gap-4">
          <div>
            <div className="flex items-center gap-4 mb-2 md:hidden">
              <button onClick={() => setSidebarOpen(true)} className="text-foreground"><Menu className="w-6 h-6" /></button>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{activeTab === "Overview" ? "Command Center" : activeTab}</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="pulse-dot" />
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest ml-2">Commander: {displayAgentName}</span>
            </div>
          </div>
          {user?.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="Profil" className="w-10 h-10 rounded-full border border-primary/30 object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center border border-primary/30 text-primary font-bold uppercase">{displayAgentName.charAt(0)}</div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "Overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass glass-hover p-6 rounded-outer">
                <div className="flex items-center justify-between mb-4"><Cpu className="w-5 h-5 text-primary" /><span className="text-xs font-mono text-muted-foreground">Global CPU Load</span></div>
                <div className="text-3xl font-bold mb-4 tabular-nums">{cpuUsage.toFixed(1)}%</div>
                <div className="stat-bar bg-white/5 rounded-full h-2"><motion.div animate={{ width: `${cpuUsage}%` }} className="bg-primary h-full rounded-full" /></div>
              </div>
              <div className="glass glass-hover p-6 rounded-outer">
                <div className="flex items-center justify-between mb-4"><BrainCircuit className="w-5 h-5 text-emerald-500" /><span className="text-xs font-mono text-muted-foreground">Neural Memory</span></div>
                <div className="text-3xl font-bold mb-4 tabular-nums">{memoryUsage.toFixed(1)} GB</div>
                <div className="stat-bar bg-white/5 rounded-full h-2"><motion.div animate={{ width: `${(memoryUsage / 16) * 100}%` }} className="bg-emerald-500 h-full rounded-full" /></div>
              </div>
              <div className="glass glass-hover p-6 rounded-outer">
                <div className="flex items-center justify-between mb-4"><Zap className="w-5 h-5 text-amber-500" /><span className="text-xs font-mono text-muted-foreground">API Requests</span></div>
                <div className="text-3xl font-bold mb-4 tabular-nums">{tasksCompleted}</div>
                <div className="stat-bar bg-white/5 rounded-full h-2"><motion.div animate={{ width: `${Math.min((tasksCompleted / 100) * 100, 100)}%` }} className="bg-amber-500 h-full rounded-full" /></div>
              </div>
              
              {/* CANLI LOGLAR BURADA EKRANA BASILIYOR */}
              <div className="glass glass-hover p-6 rounded-outer md:col-span-3 mt-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-foreground">Recent Swarm Activity</h3>
                  <button className="text-xs text-primary flex items-center gap-1 hover:text-primary/80 transition-colors">View All <ChevronRight className="w-3 h-3" /></button>
                </div>
                <div className="space-y-1">
                  {logs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent activity logged in the neural net.</p>
                  ) : (
                    logs.map((item, i) => (
                      <div key={item.id} className="flex items-center justify-between py-3 border-b border-white/5 hover:bg-white/[0.02] rounded-lg px-2">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${item.action_type === 'Warning' ? 'text-red-500' : item.action_type === 'System' ? 'text-primary' : 'text-emerald-500'}`}>
                            {item.action_type === 'Warning' ? <Trash2 className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.action_title}</p>
                            <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleTimeString()} • Verified Sync</p>
                          </div>
                        </div>
                        <span className={`text-xs font-mono px-2.5 py-1 rounded-md ${item.action_type === 'Warning' ? 'text-red-500 bg-red-500/10' : item.action_type === 'System' ? 'text-primary bg-primary/10' : 'text-emerald-500 bg-emerald-500/10'}`}>
                          {item.action_type}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "AI Agents" && (
            <motion.div key="agents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <form onSubmit={handleCreateAgent} className="glass p-8 rounded-outer border border-primary/20 flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4"><BrainCircuit className="w-6 h-6 text-primary" /><h2 className="text-lg font-bold">Synthesize New AI Agent</h2></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2"><label className="text-xs font-mono text-muted-foreground ml-1">Agent Designation</label><input type="text" required value={newAgentName} onChange={(e) => setNewAgentName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-primary/50 text-sm" /></div>
                  <div className="space-y-2"><label className="text-xs font-mono text-muted-foreground ml-1">Primary Role</label><input type="text" value={newAgentRole} onChange={(e) => setNewAgentRole(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-primary/50 text-sm" /></div>
                  <div className="space-y-2"><label className="text-xs font-mono text-muted-foreground ml-1">Core Model (LLM)</label><select value={newAgentModel} onChange={(e) => setNewAgentModel(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-primary/50 text-sm appearance-none text-foreground"><option value="gpt-4o">GPT-4o (OpenAI)</option><option value="claude-3-opus">Claude 3.5 Sonnet</option><option value="llama-3-local">LLaMA 3 (Local Core)</option></select></div>
                </div>
                <div className="space-y-2"><label className="text-xs font-mono text-muted-foreground ml-1">System Directives</label><textarea required value={newAgentPrompt} onChange={(e) => setNewAgentPrompt(e.target.value)} rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-primary/50 text-sm resize-none font-mono" /></div>
                <div className="flex justify-end"><button type="submit" disabled={isAddingAgent} className="btn-primary-glow w-full md:w-auto flex items-center justify-center gap-2 py-3 px-8 rounded-xl bg-primary text-primary-foreground font-bold text-sm">{isAddingAgent ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus className="w-4 h-4" />} Initialize Agent</button></div>
              </form>

              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2"><Bot className="w-5 h-5 text-primary" /> Active Swarm Members</h3>
                {loadingAgents ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin w-6 h-6 text-primary" /></div>
                ) : agents.length === 0 ? (
                  <div className="glass border border-dashed border-white/10 rounded-outer p-12 flex flex-col items-center justify-center text-center"><Bot className="w-10 h-10 text-muted-foreground mb-4 opacity-20" /><p className="text-muted-foreground">Your neural core is empty.</p></div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {agents.map((agent) => (
                      <div key={agent.id} className={`glass p-6 rounded-xl border transition-all ${agent.is_active ? 'border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]' : 'border-white/5 opacity-70'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${agent.is_active ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}><Bot className="w-5 h-5" /></div>
                            <div>
                              <h4 className="font-bold text-foreground flex items-center gap-2">{agent.name}{agent.is_active && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">{agent.role}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => toggleAgentStatus(agent.id, agent.is_active, agent.name)} className={`p-2 rounded-lg ${agent.is_active ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'}`}><Power className="w-4 h-4" /></button>
                            <button onClick={() => deleteAgent(agent.id, agent.name)} className="p-2 rounded-lg bg-red-500/10 text-red-500"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <div className="bg-black/30 p-3 rounded-lg border border-white/5 mb-4"><p className="text-xs font-mono text-muted-foreground line-clamp-2">{agent.system_prompt}</p></div>
                        <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase border-t border-white/5 pt-3"><span className="flex items-center gap-1.5"><Cpu className="w-3 h-3" /> Core: {agent.model}</span><span>Status: {agent.is_active ? 'ONLINE' : 'OFFLINE'}</span></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "Settings" && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-outer border border-white/10 md:col-span-2">
                <div className="flex items-center justify-between mb-6"><div className="flex items-center gap-3"><User className="w-6 h-6 text-primary" /><h2 className="text-xl font-bold">Commander Profile</h2></div></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Update your master display name.</p>
                    <div className="space-y-2"><label className="text-xs font-mono text-muted-foreground ml-1">Full Name / Callsign</label><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-primary/50 text-sm" /></div>
                    <button onClick={handleUpdateProfile} disabled={isUpdatingProfile} className="btn-primary-glow flex justify-center gap-2 w-full md:w-auto py-3 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm">{isUpdatingProfile ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} Update Profile</button>
                  </div>
                  <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10" />
                    <div className="flex items-center gap-2 mb-2 relative z-10"><Shield className="w-4 h-4 text-primary" /><span className="text-sm font-bold">Identity Checksum</span></div>
                    <div className="bg-black/50 p-3 rounded-lg flex justify-between relative z-10"><code className="text-sm text-emerald-400 font-mono">{user?.id ? user.id.split('-')[0] : 'MB-8472910'}-3</code><Key className="w-4 h-4 text-muted-foreground" /></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default Dashboard;