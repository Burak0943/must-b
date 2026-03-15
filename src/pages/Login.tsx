import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Github, Mail, Lock, ArrowLeft, Eye, EyeOff, Loader2, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MeshBackground from "@/components/MeshBackground";
import { supabase } from "../lib/supabase"; 
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard", { replace: true });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate("/dashboard", { replace: true });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields.");
    setLoading(true);
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email, password, options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } }
          });
          if (signUpError) throw signUpError;
          if (signUpData.user && !signUpData.session) toast.success("Account created! Verify your email.");
        } else throw signInError;
      }
    } catch (error: any) {
      toast.error(error.message || "Error occurred.");
    } finally { setLoading(false); }
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + "/dashboard" }
    });
    if (error) toast.error(error.message);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center p-6 relative">
      <MeshBackground />
      <div className="absolute top-6 left-6 z-10">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-md p-8 glass rounded-outer relative z-10">
        <div className="text-center mb-10">
          {/* LOGO GÜNCELLEMESİ */}
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center overflow-hidden">
            <img 
              src="/mascot.png" 
              alt="must-b logo" 
              className="w-full h-full object-contain pointer-events-none" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                console.error("Login logosu bulunamadı!");
              }}
            />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground text-sm mt-2">Access your global command center.</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* GITHUB */}
            <div className="relative group">
              <motion.div
                animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-0.5 bg-primary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOAuth('github')}
                className="relative w-full py-3 px-4 glass rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-medium text-foreground text-sm border border-white/5 overflow-hidden"
              >
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                />
                <Github className="w-4 h-4 relative z-10" />
                <span className="relative z-10">GitHub</span>
              </motion.button>
            </div>

            {/* GOOGLE */}
            <div className="relative group">
              <motion.div
                animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.05, 1] }}
                transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
                className="absolute -inset-0.5 bg-primary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOAuth('google')}
                className="relative w-full py-3 px-4 glass rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-medium text-foreground text-sm border border-white/5 overflow-hidden"
              >
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                />
                <svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="relative z-10">Google</span>
              </motion.button>
            </div>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
              <span className="bg-[#0f1115] px-3">Or access with email</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleAuth}>
            <div className="space-y-2">
              <label className={`text-[10px] uppercase font-bold tracking-widest ml-1 transition-colors duration-200 ${focused === "name" ? "text-primary" : "text-muted-foreground"}`}>Full Name</label>
              <div className={`relative transition-all duration-200 rounded-xl ${focused === "name" ? "ring-2 ring-primary/50" : ""}`}>
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === "name" ? "text-primary" : "text-muted-foreground"}`} />
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-foreground text-sm" placeholder="John Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-[10px] uppercase font-bold tracking-widest ml-1 transition-colors duration-200 ${focused === "email" ? "text-primary" : "text-muted-foreground"}`}>Email Address</label>
              <div className={`relative transition-all duration-200 rounded-xl ${focused === "email" ? "ring-2 ring-primary/50" : ""}`}>
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === "email" ? "text-primary" : "text-muted-foreground"}`} />
                <input ref={emailInputRef} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 transition-all text-foreground text-sm" placeholder="name@company.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-[10px] uppercase font-bold tracking-widest ml-1 transition-colors duration-200 ${focused === "password" ? "text-primary" : "text-muted-foreground"}`}>Password</label>
              <div className={`relative transition-all duration-200 rounded-xl ${focused === "password" ? "ring-2 ring-primary/50" : ""}`}>
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === "password" ? "text-primary" : "text-muted-foreground"}`} />
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-12 outline-none focus:border-primary/50 transition-all text-foreground text-sm" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full flex justify-center items-center py-4 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50 shadow-lg shadow-primary/20 transition-all mt-6">
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Initiate System Access"}
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8 font-medium">New agent? <button type="button" onClick={() => emailInputRef.current?.focus()} className="text-primary hover:text-primary/80 transition-colors font-bold underline-offset-4 hover:underline">Sign up automatically</button></p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;