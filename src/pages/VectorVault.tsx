import { motion } from "framer-motion";
import { Activity, Database, Cable, Settings, UploadCloud, FileText, CheckCircle, Loader2, HardDrive } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const navItems = [
  { icon: Activity, label: "Overview", href: "/dashboard" },
  { icon: Database, label: "Vector Vault", href: "/vector-vault" },
  { icon: Cable, label: "The Bridge", href: "#" },
  { icon: Settings, label: "Settings", href: "#" },
];

const VectorVault = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

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

  const simulateUpload = (fileName: string) => {
    const newFile = { id: Date.now(), name: fileName, status: "Processing", progress: 10 };
    setUploadedFiles(prev => [newFile, ...prev]);

    setTimeout(() => {
      setUploadedFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: "Chunking", progress: 40 } : f));
    }, 1500);

    setTimeout(() => {
      setUploadedFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: "Encrypting", progress: 75 } : f));
    }, 3000);

    setTimeout(() => {
      setUploadedFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: "Indexed", progress: 100 } : f));
    }, 4500);
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

      {/* VAULT CONTENT */}
      <main className="flex-1 overflow-y-auto bg-[#050505]">
        <div className="p-8 md:p-12 max-w-5xl mx-auto">
          <header className="mb-10">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold tracking-tight text-white mb-2"
            >
              Vector Vault
            </motion.h1>
            <p className="text-gray-400 text-sm">Secure, local memory storage for your autonomous agents.</p>
          </header>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* DRAG & DROP ZONE */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
              onDragLeave={() => setIsHovering(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsHovering(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  simulateUpload(e.dataTransfer.files[0].name);
                }
              }}
              className={`relative flex flex-col items-center justify-center py-24 mb-12 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ${
                isHovering ? "border-[#06b6d4] bg-[#06b6d4]/5 shadow-[0_0_30px_rgba(6,182,212,0.1)]" : "border-[#1f2937] bg-[#0a0a0a] hover:border-[#06b6d4]/50 hover:bg-[#06b6d4]/5"
              }`}
            >
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_70%)]" />
              </div>
              <UploadCloud className={`w-16 h-16 mb-6 transition-colors duration-300 ${isHovering ? "text-[#06b6d4]" : "text-gray-500"}`} />
              <h2 className="text-xl font-bold text-white mb-3 tracking-tight">Upload Knowledge (PDF, CSV, TXT)</h2>
              <p className="text-gray-400 text-sm max-w-md text-center mb-6">
                Files will be semantically chunked and encrypted in your local vault.
              </p>
              <button 
                onClick={() => simulateUpload(`dataset_${Math.floor(Math.random() * 1000)}.pdf`)}
                className="bg-[#1f2937] hover:bg-[#06b6d4]/20 border border-[#1f2937] hover:border-[#06b6d4]/50 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              >
                Browse Files
              </button>
            </div>

            {/* INDEXED MEMORY LIST */}
            <div className="bg-[#0a0a0a] border border-[#1f2937] rounded-3xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3 mb-8 border-b border-[#1f2937] pb-4">
                <HardDrive className="w-5 h-5 text-[#06b6d4]" />
                <h2 className="text-xl font-bold text-white tracking-tight">Indexed Memory</h2>
              </div>
              
              {uploadedFiles.length === 0 ? (
                <div className="text-center py-10 opacity-60">
                  <FileText className="w-10 h-10 mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400 text-sm">Your vault is currently empty.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <motion.div 
                      key={file.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border border-[#1f2937] bg-black/40 rounded-xl p-5 relative overflow-hidden group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
                            file.status === "Indexed" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-[#06b6d4]/10 border-[#06b6d4]/30 text-[#06b6d4]"
                          }`}>
                            {file.status === "Indexed" ? <CheckCircle className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                          </div>
                          <div>
                            <h3 className="text-white font-medium text-sm">{file.name}</h3>
                            <div className="text-xs text-gray-400 font-mono mt-1">{file.status}</div>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-gray-500">{file.progress}%</span>
                      </div>
                      <div className="w-full bg-[#1f2937] h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${file.status === "Indexed" ? "bg-green-500" : "bg-[#06b6d4]"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

    </div>
  );
};

export default VectorVault;
