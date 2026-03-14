import { motion } from "framer-motion";
import { Activity, Cpu, HardDrive, Zap, Settings, User, LogOut, ChevronRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { icon: Activity, label: "Overview", active: true },
  { icon: Zap, label: "Automations", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const activities = [
  { title: "Refactored `auth.ts` in Project-X", time: "2 minutes ago", status: "Success" },
  { title: "Generated unit tests for `api/routes`", time: "8 minutes ago", status: "Success" },
  { title: "Code review on PR #247", time: "23 minutes ago", status: "Success" },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-screen bg-background text-foreground overflow-hidden"
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static z-50 h-full w-64 border-r border-white/5 p-6 flex flex-col gap-8 bg-background
        transition-transform duration-300 md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between">
          <Link to="/" className="font-bold text-xl tracking-tighter text-foreground flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-xs font-black">B</div>
            must-b
          </Link>
          <button className="md:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </motion.button>
          ))}
        </nav>

        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {/* Mobile header */}
        <div className="flex items-center gap-4 mb-6 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-foreground">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-foreground">Command Center</span>
        </div>

        <header className="flex flex-col md:flex-row justify-between md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="pulse-dot" />
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest ml-2">
                Agent: MacBook-Pro-Local (Connected)
              </span>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-full glass flex items-center justify-center border border-white/10 cursor-pointer self-start"
          >
            <User className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CPU */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass glass-hover p-6 rounded-outer"
          >
            <div className="flex items-center justify-between mb-4">
              <Cpu className="w-5 h-5 text-primary" />
              <span className="text-xs font-mono text-muted-foreground">CPU Usage</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-4 tabular-nums">14.2%</div>
            <div className="stat-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "14.2%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-primary h-full rounded-full"
              />
            </div>
          </motion.div>

          {/* VRAM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass glass-hover p-6 rounded-outer"
          >
            <div className="flex items-center justify-between mb-4">
              <HardDrive className="w-5 h-5 text-emerald-500" />
              <span className="text-xs font-mono text-muted-foreground">Memory (VRAM)</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-4 tabular-nums">8.4 GB</div>
            <div className="stat-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1, delay: 0.6 }}
                className="bg-emerald-500 h-full rounded-full"
              />
            </div>
          </motion.div>

          {/* Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass glass-hover p-6 rounded-outer"
          >
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-mono text-muted-foreground">Tasks Today</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-4 tabular-nums">47</div>
            <div className="stat-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "82%" }}
                transition={{ duration: 1, delay: 0.7 }}
                className="bg-amber-500 h-full rounded-full"
              />
            </div>
          </motion.div>

          {/* Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass glass-hover p-6 rounded-outer md:col-span-3"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-foreground">Recent Local Activity</h3>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="text-xs text-primary flex items-center gap-1 hover:text-primary/80 transition-colors"
              >
                View All <ChevronRight className="w-3 h-3" />
              </motion.button>
            </div>
            <div className="space-y-1">
              {activities.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] rounded-lg px-2 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.time} • Local Execution</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                    {item.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

export default Dashboard;
