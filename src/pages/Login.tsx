import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Github } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { cn } from "../lib/utils";

// --- İç Input Bileşeni ---
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        className
      )}
      {...props}
    />
  )
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailInputRef = useRef<HTMLInputElement>(null);
  
  // State Yönetimi
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  // Yönlendirme Logiği
  const nextUrl = searchParams.get("next") ?? "/dashboard";

  // YÖNLENDİRME BEYNİ (Mevcut kodundan alındı)
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && mounted) {
        navigate(nextUrl, { replace: true });
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && mounted && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        navigate(nextUrl, { replace: true });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, nextUrl]);

  // Auth Logiği (Mevcut kodundan entegre edildi)
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields.");
    
    setLoading(true);
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          // Otomatik Kayıt Akışı
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin + nextUrl,
            },
          });
          if (signUpError) throw signUpError;
          
          if (signUpData.user && !signUpData.session) {
            toast.success("Account created! Check your email to verify, then return here.");
            setLoading(false);
          }
        } else {
          throw signInError;
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Error occurred.");
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "github" | "google") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + nextUrl,
      },
    });
    if (error) toast.error(error.message);
  };

  // 3D Kart Efekti (Yeni tasarımdan)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-purple-700/50 to-black" />
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-purple-400/20 blur-[80px]" />
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-purple-300/20 blur-[60px]"
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10 p-4"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 10 }}
        >
          <div className="relative group">
            {/* Glass card background */}
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden">
              
              {/* Logo and header */}
              <div className="text-center space-y-1 mb-5">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="mx-auto w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden mb-3 bg-white/5"
                >
                  <img
                    src="/mascot.png"
                    alt="must-b logo"
                    className="w-8 h-8 object-contain"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
                >
                  Welcome Back
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/60 text-xs"
                >
                  {nextUrl !== "/dashboard"
                    ? "Sign in to authorize your local agent."
                    : "Access your global command center."}
                </motion.p>
              </div>

              {/* Login form */}
              <form onSubmit={handleAuth} className="space-y-4">
                <motion.div className="space-y-3">
                  {/* Email input */}
                  <motion.div className={`relative ${focusedInput === "email" ? 'z-10' : ''}`} whileFocus={{ scale: 1.02 }}>
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Mail className={`absolute left-3 w-4 h-4 transition-all duration-300 ${focusedInput === "email" ? 'text-white' : 'text-white/40'}`} />
                      <Input
                        ref={emailInputRef}
                        type="email"
                        required
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-white/10"
                      />
                    </div>
                  </motion.div>

                  {/* Password input */}
                  <motion.div className={`relative ${focusedInput === "password" ? 'z-10' : ''}`} whileFocus={{ scale: 1.02 }}>
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Lock className={`absolute left-3 w-4 h-4 transition-all duration-300 ${focusedInput === "password" ? 'text-white' : 'text-white/40'}`} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-white/10"
                      />
                      <div onClick={() => setShowPassword(!showPassword)} className="absolute right-3 cursor-pointer">
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-white/40 hover:text-white transition-colors" />
                        ) : (
                          <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Sign in button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full relative group/button mt-5 bg-white text-black font-medium h-10 rounded-lg flex items-center justify-center overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                      </motion.div>
                    ) : (
                      <motion.span key="button-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-1 text-sm font-bold">
                        Initiate System Access
                        <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <div className="relative mt-2 mb-4 flex items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="mx-3 text-[10px] uppercase tracking-widest text-white/40 font-bold">Or</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* GitHub Sign In */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOAuth("github")}
                    type="button"
                    className="w-full bg-white/5 text-white font-medium h-10 rounded-lg border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Github className="w-4 h-4 text-white/80" />
                    <span className="text-xs">GitHub</span>
                  </motion.button>

                  {/* Google Sign In */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOAuth("google")}
                    type="button"
                    className="w-full bg-white/5 text-white font-medium h-10 rounded-lg border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="text-xs">Google</span>
                  </motion.button>
                </div>

              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}