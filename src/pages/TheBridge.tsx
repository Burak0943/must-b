import { motion, AnimatePresence } from "framer-motion";
import { Activity, Database, Cable, Settings, MessageCircle, MessageSquare, Send, X, Loader2, QrCode, ShieldAlert } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

const navItems = [
  { icon: Activity, label: "Overview", href: "/dashboard" },
  { icon: Database, label: "Vector Vault", href: "/vector-vault" },
  { icon: Cable, label: "The Bridge", href: "/the-bridge" },
  { icon: Settings, label: "Settings", href: "#" },
];

const TheBridge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrGenerating, setQrGenerating] = useState(false);

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

    const authSub = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/login", { replace: true });
    });

    return () => authSub.data.subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-[#06b6d4] w-8 h-8" />
      </div>
    );
  }

  const handleWhatsAppConnect = () => {
    setShowQRModal(true);
    setQrGenerating(true);
    setTimeout(() => {
      setQrGenerating(false);
    }, 2000);
  };

  const handleOtherConnect = () => {
    toast("Endpoint connection initiated. Please wait for validation.");
  };

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
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <button 
                key={item.label} 
                onClick={() => { if (item.href !== "#") navigate(item.href); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? "bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                    : "text-gray-400 hover:text-[#06b6d4] hover:bg-[#06b6d4]/5 hover:border-[#06b6d4]/10 border border-transparent"
                }`}
              >
                <item.icon className="w-4 h-4" /> 
                {item.label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* COMMAND CENTER / BRIDGE CONTENT */}
      <main className="flex-1 overflow-y-auto bg-[#050505] relative">
        <div className="p-8 md:p-12 max-w-6xl mx-auto">
          <header className="mb-12">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold tracking-tight text-white mb-3"
            >
              The Bridge: Asynchronous Event Loop
            </motion.h1>
            <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
              Connect your external channels. The system will handle fragmentation natively with zero-cold start.
            </p>
          </header>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Cable className="w-5 h-5 text-[#06b6d4]" />
              <h2 className="text-xl font-bold text-white tracking-tight">Communication Channels</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* WhatsApp Card */}
              <div className="bg-[#0a0a0a] border border-[#1f2937] rounded-3xl p-6 relative group hover:border-[#06b6d4]/50 transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <MessageCircle className="w-24 h-24 text-green-500" />
                </div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold">WhatsApp</h3>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500">Offline</span>
                  </div>
                </div>
                <button 
                  onClick={handleWhatsAppConnect}
                  className="w-full bg-[#1f2937] hover:bg-green-500 hover:text-black hover:border-green-400 border border-[#1f2937] text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" /> Connect via QR
                </button>
              </div>

              {/* Discord Card */}
              <div className="bg-[#0a0a0a] border border-[#1f2937] rounded-3xl p-6 relative group hover:border-[#06b6d4]/50 transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <MessageSquare className="w-24 h-24 text-indigo-400" />
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold">Discord</h3>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">Offline</span>
                  </div>
                </div>
                <div className="space-y-3 relative z-10">
                  <input 
                    type="password" 
                    placeholder="Enter Bot Token" 
                    className="w-full bg-black/50 border border-[#1f2937] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/50 transition-colors text-white placeholder-gray-600"
                  />
                  <button 
                    onClick={handleOtherConnect}
                    className="w-full bg-[#1f2937] hover:bg-indigo-500 hover:text-white hover:border-indigo-400 border border-[#1f2937] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                  >
                    Authenticate
                  </button>
                </div>
              </div>

              {/* Telegram Card */}
              <div className="bg-[#0a0a0a] border border-[#1f2937] rounded-3xl p-6 relative group hover:border-[#06b6d4]/50 transition-colors shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Send className="w-24 h-24 text-sky-400" />
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
                      <Send className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold">Telegram</h3>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">Offline</span>
                  </div>
                </div>
                <div className="space-y-3 relative z-10">
                  <input 
                    type="password" 
                    placeholder="Enter API Key" 
                    className="w-full bg-black/50 border border-[#1f2937] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500/50 transition-colors text-white placeholder-gray-600"
                  />
                  <button 
                    onClick={handleOtherConnect}
                    className="w-full bg-[#1f2937] hover:bg-sky-500 hover:text-white hover:border-sky-400 border border-[#1f2937] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                  >
                    Authenticate
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </main>

      {/* WHATSAPP QR MODAL */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#050505] border border-[#1f2937] rounded-3xl p-8 max-w-sm w-full relative shadow-[0_0_50px_rgba(6,182,212,0.15)]"
            >
              <button 
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">WhatsApp Bridge</h3>
                <p className="text-xs text-gray-400">Link your device to the agent swarm</p>
              </div>

              <div className="bg-white p-4 rounded-2xl flex items-center justify-center aspect-square mb-6 relative overflow-hidden">
                {qrGenerating ? (
                  <div className="flex flex-col items-center justify-center text-[#050505]">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <span className="text-xs font-semibold">Generating secure QR code...</span>
                  </div>
                ) : (
                  <div className="w-full h-full border-[12px] border-black border-dashed opacity-80" />
                )}
              </div>

              <div className="flex flex-col gap-3 p-3 mb-4 rounded-xl bg-[#1f2937]/50 border border-[#1f2937]">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Webhook URL</span>
                <span className="text-xs font-mono text-cyan-400 select-all">https://must-b.com/api/webhook/whatsapp</span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-500 leading-tight">
                  End-to-end encryption is managed locally. Your messages are never stored in the global vault.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TheBridge;
