import { motion } from "framer-motion";
import { Activity, Database, Cable, Settings, Plus, Server, Cpu, DatabaseZap, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const navItems = [
  { icon: Activity, label: "Overview" },
  { icon: Database, label: "Vector Vault" },
  { icon: Cable, label: "The Bridge" },
  { icon: Settings, label: "Settings" },
];

const liveTasks = [
  { id: 1, name: "Stripe Billing", status: "Syncing Customers", time: "2 min ago", state: "active" },
  { id: 2, name: "WhatsApp Bridge", status: "Listening", time: "Just now", state: "listening" },
  { id: 3, name: "Vector Indexer", status: "Optimizing Embeddings", time: "5 min ago", state: "processing" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { 
        navigate("/login", { replace: true }); 
        return; 
      }
      setLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-[#06b6d4] w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-[#1f2937] p-6 flex flex-col gap-8 bg-[#050505]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#06b6d4]/10 border border-[#06b6d4]/30 rounded-lg flex items-center justify-center text-[#06b6d4] font-black tracking-tighter shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            MB
          </div> 
          <span className="font-bold text-lg tracking-tight">Must-b</span>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button 
              key={item.label} 
              onClick={() => setActiveTab(item.label)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === item.label 
                  ? "bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                  : "text-gray-400 hover:text-[#06b6d4] hover:bg-[#06b6d4]/5 hover:border-[#06b6d4]/10 border border-transparent"
              }`}
            >
              <item.icon className="w-4 h-4" /> 
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* COMMAND CENTER */}
      <main className="flex-1 overflow-y-auto bg-[#050505]">
        <div className="p-8 md:p-12 max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-12">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold tracking-tight text-white mb-2"
              >
                Command Center
              </motion.h1>
              <p className="text-gray-400 text-sm">Welcome to your omni-context operational hub.</p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(6,182,212,0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-[#06b6d4] hover:bg-[#0891b2] text-black px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] border border-[#06b6d4]/30"
            >
              <Plus className="w-4 h-4" />
              Initialize New Agent
            </motion.button>
          </header>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            {/* STAT CARD 1: System Health */}
            <div className="bg-[#0a0a0a] border border-[#1f2937] p-6 rounded-2xl relative overflow-hidden group hover:border-[#06b6d4]/40 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Server className="w-16 h-16 text-[#06b6d4]" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-[#06b6d4]" />
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">System Health</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <span className="text-3xl font-bold text-white tracking-tight">Online</span>
              </div>
            </div>

            {/* STAT CARD 2: Active Agents */}
            <div className="bg-[#0a0a0a] border border-[#1f2937] p-6 rounded-2xl relative overflow-hidden group hover:border-[#06b6d4]/40 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Cpu className="w-16 h-16 text-[#06b6d4]" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-5 h-5 text-[#06b6d4]" />
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Active Agents</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">3</span>
                <span className="text-gray-500 mb-1 font-medium">Deployed</span>
              </div>
            </div>

            {/* STAT CARD 3: Memory Vault */}
            <div className="bg-[#0a0a0a] border border-[#1f2937] p-6 rounded-2xl relative overflow-hidden group hover:border-[#06b6d4]/40 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DatabaseZap className="w-16 h-16 text-[#06b6d4]" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <DatabaseZap className="w-5 h-5 text-[#06b6d4]" />
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Memory Vault</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">1.2</span>
                <span className="text-gray-500 mb-1 font-medium">GB Indexed</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-[#0a0a0a] border border-[#1f2937] rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-8 border-b border-[#1f2937] pb-4">
              <h2 className="text-xl font-bold text-white tracking-tight">Live Task Delegation</h2>
              <span className="text-xs font-mono text-[#06b6d4]/70 uppercase tracking-widest px-4 py-1.5 bg-[#06b6d4]/10 rounded-full border border-[#06b6d4]/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                Realtime Feed
              </span>
            </div>

            <div className="space-y-4">
              {liveTasks.map((task, i) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="flex items-center justify-between p-5 rounded-xl border border-[#1f2937] bg-black/40 hover:bg-[#1f2937]/30 hover:border-[#06b6d4]/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-lg bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center text-[#06b6d4] shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1 group-hover:text-[#06b6d4] transition-colors">{task.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${task.state === 'active' ? 'bg-[#06b6d4]' : 'bg-amber-400'}`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${task.state === 'active' ? 'bg-[#06b6d4]' : 'bg-amber-500'}`}></span>
                        </span>
                        <span className="text-xs text-gray-400">{task.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-gray-500">
                    {task.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;