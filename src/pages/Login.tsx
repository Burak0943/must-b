import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Github, Facebook, Twitter, User } from 'lucide-react';
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
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
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
  const [isSignUp, setIsSignUp] = useState(false);
  const [isVerifyStep, setIsVerifyStep] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  
  // Form Verileri
  const [name, setName] = useState(""); // YENİ: Ad Soyad state'i
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(['', '', '', '', '', '']); 
  
  const [loading, setLoading] = useState(false);

  const nextUrl = searchParams.get("next") ?? "/dashboard";

  // YÖNLENDİRME BEYNİ
  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && mounted) navigate(nextUrl, { replace: true });
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

  // Auth Logiği (Giriş ve Kayıt)
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields.");
    if (isSignUp && !name) return toast.error("Please enter your full name.");
    
    setLoading(true);
    try {
      if (isSignUp) {
        // KAYIT OL (İsim verisi ile)
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: name, // İsmi Supabase'e gönderiyoruz
            }
          }
        });
        if (error) throw error;
        
        toast.success("Verification code sent to your email!");
        setIsVerifyStep(true);
      } else {
        // GİRİŞ YAP
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // OTP Doğrulama Logiği
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return toast.error("Please enter the complete 6-digit code.");

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'signup'
      });
      if (error) throw error;
      
      toast.success("Account verified! Initializing session...");
    } catch (error: any) {
      toast.error("Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // OTP Input Yönetimi
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return; 
    if (value.length > 1) value = value.slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    if (pasteData.length === 0) return;
    
    const newOtp = [...otp];
    pasteData.forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    
    const nextIndex = Math.min(pasteData.length, 5);
    document.getElementById(`otp-${nextIndex}`)?.focus();
  };

  const handleOAuth = async (provider: "github" | "google" | "facebook" | "apple" | "twitter") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + nextUrl },
    });
    if (error) toast.error(error.message);
  };

  // 3D Kart Efekti
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-purple-700/50 to-black" />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }}
      />
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-purple-400/20 blur-[80px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10 p-4" style={{ perspective: 1500 }}
      >
        <motion.div className="relative" style={{ rotateX, rotateY }} onMouseMove={handleMouseMove} onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }} whileHover={{ z: 10 }}>
          <div className="relative group">
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden">
              
              <div className="text-center space-y-1 mb-5">
                <motion.div className="mx-auto w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden mb-3 bg-white/5">
                  <img src="/mascot.png" alt="logo" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.h1
                    key={isVerifyStep ? "verify-title" : isSignUp ? "signup-title" : "signin-title"}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                    className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
                  >
                    {isVerifyStep ? "Check your Email" : isSignUp ? "Create an Account" : "Welcome Back"}
                  </motion.h1>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={isVerifyStep ? "verify-desc" : isSignUp ? "signup-desc" : "signin-desc"}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                    className="text-white/60 text-xs"
                  >
                    {isVerifyStep 
                      ? `We sent a 6-digit code to ${email}`
                      : isSignUp 
                        ? "Enter your details to get started." 
                        : "Access your global command center."
                    }
                  </motion.p>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                {isVerifyStep ? (
                  <motion.form key="otp-form" onSubmit={handleVerifyOtp} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="flex justify-between gap-2 mt-4">
                      {otp.map((digit, index) => (
                        <input key={index} id={`otp-${index}`} type="text" inputMode="numeric" autoComplete="one-time-code" value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(index, e)} onPaste={handleOtpPaste} className="w-10 h-12 text-center text-lg font-bold bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all" />
                      ))}
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full relative group/button bg-white text-black font-medium h-10 rounded-lg flex items-center justify-center">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : "Verify Code"}
                    </motion.button>
                    <p className="text-center text-xs text-white/40">
                      Didn't receive it? <span onClick={() => setIsVerifyStep(false)} className="text-white hover:underline cursor-pointer">Go back</span>
                    </p>
                  </motion.form>
                ) : (
                  <motion.form key="auth-form" onSubmit={handleAuth} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                    
                    <div className="space-y-3">
                      {/* Animasyonlu İsim Alanı (Sadece Sign Up modunda görünür) */}
                      <AnimatePresence>
                        {isSignUp && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                            animate={{ opacity: 1, height: "auto", marginTop: 12 }} 
                            exit={{ opacity: 0, height: 0, marginTop: 0 }} 
                            className="relative flex items-center overflow-hidden rounded-lg"
                          >
                            <User className="absolute left-3 w-4 h-4 text-white/40" />
                            <Input type="text" required={isSignUp} placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 focus:border-white/20 text-white placeholder:text-white/30 h-10 pl-10 pr-3" />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="relative flex items-center overflow-hidden rounded-lg">
                        <Mail className="absolute left-3 w-4 h-4 text-white/40" />
                        <Input ref={emailInputRef} type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 focus:border-white/20 text-white placeholder:text-white/30 h-10 pl-10 pr-3" />
                      </div>

                      <div className="relative flex items-center overflow-hidden rounded-lg">
                        <Lock className="absolute left-3 w-4 h-4 text-white/40" />
                        <Input type={showPassword ? "text" : "password"} required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 focus:border-white/20 text-white placeholder:text-white/30 h-10 pl-10 pr-10" />
                        <div onClick={() => setShowPassword(!showPassword)} className="absolute right-3 cursor-pointer">
                          {showPassword ? <EyeOff className="w-4 h-4 text-white/40 hover:text-white" /> : <Eye className="w-4 h-4 text-white/40 hover:text-white" />}
                        </div>
                      </div>
                    </div>

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full relative group/button mt-5 bg-white text-black font-medium h-10 rounded-lg flex items-center justify-center overflow-hidden">
                      {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : (
                        <span className="flex items-center justify-center gap-1 text-sm font-bold">
                          {isSignUp ? "Sign Up" : "Sign In"}
                          <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </motion.button>

                    <div className="relative mt-2 mb-4 flex items-center">
                      <div className="flex-grow border-t border-white/5"></div>
                      <span className="mx-3 text-[10px] uppercase tracking-widest text-white/40 font-bold">Or continue with</span>
                      <div className="flex-grow border-t border-white/5"></div>
                    </div>

                    {/* YENİLENEN, SADE VE TEK RENK SOSYAL MEDYA İKONLARI */}
                    <div className="flex justify-between gap-2">
                      {[
                        { id: 'google', icon: <svg className="w-[18px] h-[18px] text-white/80 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg> },
                        { id: 'github', icon: <Github className="w-[18px] h-[18px] text-white/80 group-hover:text-white transition-colors" /> },
                        { id: 'apple', icon: <svg className="w-[18px] h-[18px] text-white/80 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04C10.5 2.04 9.06 3 8.34 4.38c-.78 1.5-.66 3.12.3 4.44C9.54 10.02 11.04 11 12.6 11c1.5 0 2.88-.9 3.66-2.28.78-1.5.66-3.12-.3-4.44C15.06 2.94 13.56 2.04 12 2.04zm-3.66 9.6c-2.4 0-4.56 1.68-5.34 3.96-.84 2.52-.3 5.4 1.38 7.56 1.14 1.44 2.7 2.4 4.38 2.4 1.8 0 3.36-1.14 4.86-1.14 1.5 0 3.06 1.14 4.86 1.14 1.68 0 3.24-.96 4.38-2.4 1.68-2.16 2.22-5.04 1.38-7.56-.78-2.28-2.94-3.96-5.34-3.96-1.62 0-3.18.96-4.26.96-1.08 0-2.64-.96-4.26-.96z"/></svg> },
                        { id: 'facebook', icon: <Facebook className="w-[18px] h-[18px] text-white/80 group-hover:text-white transition-colors" fill="currentColor" stroke="none" /> },
                        { id: 'twitter', icon: <Twitter className="w-[18px] h-[18px] text-white/80 group-hover:text-white transition-colors" fill="currentColor" stroke="none" /> }
                      ].map((provider) => (
                        <motion.button key={provider.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleOAuth(provider.id as any)} type="button" className="group flex-1 bg-white/5 h-10 rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all flex items-center justify-center">
                          {provider.icon}
                        </motion.button>
                      ))}
                    </div>

                    <motion.p className="text-center text-xs text-white/60 mt-4 pt-2">
                      {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                      <button type="button" onClick={() => { setIsSignUp(!isSignUp); setPassword(""); }} className="relative inline-block group/signup text-white hover:text-white/70 transition-colors duration-300 font-medium cursor-pointer">
                        <span className="relative z-10">{isSignUp ? "Sign in" : "Sign up"}</span>
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover/signup:w-full transition-all duration-300" />
                      </button>
                    </motion.p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}