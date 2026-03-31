import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Github, Mail, Lock, ArrowLeft, Eye, EyeOff, Loader2, User, Apple } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MeshBackground from "@/components/MeshBackground";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  // Saçma sapan döngüyü bitiren ana rota ayarı
  const nextUrl = searchParams.get("next") || "/dashboard";

  useEffect(() => {
    // 1. Session varsa bekletme, uçur
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate(nextUrl, { replace: true });
    };
    checkSession();

    // 2. Auth durumu değiştiği an (Login basıldığı an) devreye gir
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        navigate(nextUrl, { replace: true });
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate, nextUrl]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("E-posta ve şifre zorunludur.");
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Eğer hesap yoksa otomatik oluştur (senin mantığın)
        if (error.message.includes("Invalid login credentials")) {
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } }
          });
          if (signUpError) throw signUpError;
          toast.success("Hesabınız oluşturuldu! Giriş yapılıyor...");
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "github" | "google" | "apple") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // Döngüyü kıran direkt yönlendirme
        redirectTo: window.location.origin + nextUrl,
      },
    });
    if (error) toast.error(error.message);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center p-6 relative bg-black">
      <MeshBackground />
      
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Geri Dön
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-md p-8 glass rounded-2xl relative z-10 border border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <img src="/mascot.png" alt="must-b" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h2 className="text-3xl font-bold tracking-tight text-white">Sisteme Giriş</h2>
          <p className="text-gray-400 text-sm mt-2">Yerel AI İşletim Sistemine Hoş Geldiniz</p>
        </div>

        <div className="space-y-6">
          {/* OAuth Grid - Apple eklendi */}
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => handleOAuth("github")} className="flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <Github className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => handleOAuth("google")} className="flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            </button>
            <button onClick={() => handleOAuth("apple")} className="flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <Apple className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div><div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-gray-500"><span className="bg-[#0f1115] px-3 font-sans">Veya E-posta</span></div></div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleAuth}>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-all" placeholder="adiniz@sirket.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white outline-none focus:border-blue-500 transition-all" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all mt-6 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sistemi Başlat"}
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;