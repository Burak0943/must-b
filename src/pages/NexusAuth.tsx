/**
 * NexusAuth.tsx  —  Must-b Nexus Kapısı
 *
 * Tasarım: Ultra-Dark (#050505) + Neon Yeşili (#00ff00)
 * Estetik: Terminal / Hacker + Glassmorphism panel
 * Font: Space Mono (Google Fonts embed)
 * Animasyon: Terminal data-stream intro + glitch header
 * Form: React Hook Form (Supabase bağlantısı için TODO alanları hazır)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  Terminal, Lock, Eye, EyeOff, ArrowRight,
  Shield, User, AtSign, Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────
// Tipler
// ─────────────────────────────────────────────────────────

type AuthMode = "login" | "register";

interface LoginFields {
  nodeId: string;   // email (giriş)
  password: string;
}

interface RegisterFields {
  nodeId: string;   // email (kayıt)
  displayName: string;
  password: string;
  confirmPassword: string;
}

// ─────────────────────────────────────────────────────────
// Terminal veri akışı satırları
// ─────────────────────────────────────────────────────────

const BOOT_LINES = [
  "MUST-B NEXUS v3.1.4 — INITIALIZING...",
  "▸ Loading cognitive mesh protocol...",
  "▸ Establishing encrypted tunnel...",
  "▸ Verifying node certificates...",
  "▸ Connecting to distributed swarm...",
  "▸ Auth gateway ONLINE ✓",
  "────────────────────────────────────────",
  "NEXUS ACCESS PORTAL — READY",
];

// ─────────────────────────────────────────────────────────
// Yardımcı bileşenler
// ─────────────────────────────────────────────────────────

/** Arka planda akan rastgele binary/hex karakterler */
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "01アイウエオカキクケコ∑∆Ωπ∞≠≈◈◇▲▶".split("");
    const fontSize = 12;
    const cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(cols).fill(1);

    let raf: number;
    const draw = () => {
      ctx.fillStyle = "rgba(5,5,5,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0,255,0,0.15)";
      ctx.font = `${fontSize}px 'Space Mono', monospace`;

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
    />
  );
}

/** Terminal önyükleme animasyonu */
function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  // onComplete'i ref'e alıyoruz — interval callback'i yeniden oluşturmasın
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(iv);
        // Kısa bekleme → AnimatePresence exit'i devralır, form mount edilir
        setTimeout(() => onCompleteRef.current(), 350);
      }
    }, 160);
    return () => clearInterval(iv);
  // Sadece mount'ta çalışsın
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // ⚠ Kendi opacity animasyonu YOK — AnimatePresence exit prop'u bunu yönetir
    <div className="font-['Space_Mono'] text-[#00ff00] text-xs leading-relaxed space-y-1 p-1 min-h-[280px]">
      {lines.map((line, idx) => (
        <motion.p
          key={idx}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.12 }}
          className={line.startsWith("NEXUS") || line.startsWith("MUST") ? "text-[#00ff00] font-bold" : "text-[#00cc00]/80"}
        >
          {line}
        </motion.p>
      ))}
      <motion.span
        className="inline-block w-2 h-3 bg-[#00ff00] ml-1 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
      />
    </div>
  );
}

/** Glitch efektli başlık */
function GlitchTitle({ text }: { text: string }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const trigger = () => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    };
    const iv = setInterval(trigger, 3500 + Math.random() * 2000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative select-none">
      <span
        className="font-['Space_Mono'] font-bold text-[#00ff00] text-lg sm:text-xl tracking-wider"
        style={{
          textShadow: glitch
            ? "2px 0 #ff0040, -2px 0 #00ffff"
            : "0 0 20px rgba(0,255,0,0.6)",
          transition: "text-shadow 0.05s",
        }}
      >
        {text}
      </span>
      {glitch && (
        <>
          <span
            className="absolute inset-0 font-['Space_Mono'] font-bold text-lg sm:text-xl tracking-wider text-[#ff0040] opacity-70"
            style={{ clipPath: "inset(30% 0 50% 0)", transform: "translateX(3px)" }}
          >
            {text}
          </span>
          <span
            className="absolute inset-0 font-['Space_Mono'] font-bold text-lg sm:text-xl tracking-wider text-[#00ffff] opacity-70"
            style={{ clipPath: "inset(60% 0 10% 0)", transform: "translateX(-3px)" }}
          >
            {text}
          </span>
        </>
      )}
    </div>
  );
}

/** Neon input alanı */
function NeonInput({
  id,
  type = "text",
  placeholder,
  icon: Icon,
  rightSlot,
  error,
  ...rest
}: {
  id: string;
  type?: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  rightSlot?: React.ReactNode;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1">
      <div
        className="relative flex items-center rounded-lg transition-all duration-300"
        style={{
          background: "rgba(0,255,0,0.03)",
          border: `1px solid ${focused ? "rgba(0,255,0,0.5)" : "rgba(0,255,0,0.12)"}`,
          boxShadow: focused ? "0 0 12px rgba(0,255,0,0.15), inset 0 0 12px rgba(0,255,0,0.03)" : "none",
        }}
      >
        <Icon className="absolute left-3 w-4 h-4 text-[#00ff00]/40 shrink-0 pointer-events-none" />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent pl-10 pr-10 py-3 text-sm font-['Space_Mono'] text-[#00ff00] placeholder:text-[#00ff00]/25 outline-none"
          {...rest}
        />
        {rightSlot && <div className="absolute right-3">{rightSlot}</div>}
      </div>
      {error && (
        <p className="text-xs font-['Space_Mono'] text-red-500/80 pl-1">⚠ {error}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Ana Sayfa
// ─────────────────────────────────────────────────────────

export default function NexusAuth() {
  const navigate = useNavigate();
  const [mode, setMode]                 = useState<AuthMode>("login");
  const [booting, setBooting]           = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [statusMsg, setStatusMsg]       = useState<string | null>(null);

  // ── React Hook Form ──────────────────────────────────
  const loginForm = useForm<LoginFields>({ mode: "onBlur" });
  const registerForm = useForm<RegisterFields>({ mode: "onBlur" });

  // ── Boot tamamlandığında ─────────────────────────────
  const handleBootComplete = useCallback(() => setBooting(false), []);

  // ── Oturum kontrolü — varsa yönlendir ───────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/", { replace: true });
    });
  }, [navigate]);

  // ── Giriş Yap ───────────────────────────────────────
  const handleLogin = async (data: LoginFields) => {
    setLoading(true);
    setStatusMsg("▸ Authenticating node...");

    try {
      // TODO: Supabase Auth bağlantısı
      // const { error } = await supabase.auth.signInWithPassword({
      //   email: data.nodeId,
      //   password: data.password,
      // });
      // if (error) throw error;
      // navigate("/nexus", { replace: true });

      // Geçici simülasyon (TODO kaldırılacak)
      await new Promise((r) => setTimeout(r, 1200));
      setStatusMsg("✓ NODE AUTHENTICATED — redirecting...");
      setTimeout(() => navigate("/"), 800);
    } catch (err: any) {
      setStatusMsg(`⚠ AUTH FAILED: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ── Hesap Oluştur ───────────────────────────────────
  const handleRegister = async (data: RegisterFields) => {
    if (data.password !== data.confirmPassword) {
      registerForm.setError("confirmPassword", { message: "Parolalar eşleşmiyor" });
      return;
    }
    setLoading(true);
    setStatusMsg("▸ Registering new node...");

    try {
      // TODO: Supabase Auth bağlantısı
      // const { error } = await supabase.auth.signUp({
      //   email: data.nodeId,
      //   password: data.password,
      //   options: { data: { display_name: data.displayName } },
      // });
      // if (error) throw error;

      // Geçici simülasyon (TODO kaldırılacak)
      await new Promise((r) => setTimeout(r, 1200));
      setStatusMsg("✓ NODE REGISTERED — check your inbox to verify.");
    } catch (err: any) {
      setStatusMsg(`⚠ REGISTRATION FAILED: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setStatusMsg(null);
    loginForm.reset();
    registerForm.reset();
  };

  // ─────────────────────────────────────────────────────
  return (
    <>
      {/* Google Fonts — Space Mono */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

        @keyframes nexus-scan {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes nexus-pulse-border {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        @keyframes nexus-flicker {
          0%, 95%, 100% { opacity: 1; }
          96%           { opacity: 0.7; }
          97%           { opacity: 1; }
          98%           { opacity: 0.4; }
          99%           { opacity: 1; }
        }
        .nexus-panel {
          animation: nexus-flicker 8s infinite;
        }
        .nexus-scan-line {
          animation: nexus-scan 6s linear infinite;
        }
        .nexus-border-pulse {
          animation: nexus-pulse-border 2.5s ease-in-out infinite;
        }
      `}</style>

      <div
        className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
        style={{ background: "#050505" }}
      >
        {/* Matrix rain arka planı */}
        <MatrixRain />

        {/* Tarama çizgisi */}
        <div
          className="nexus-scan-line absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, rgba(0,255,0,0.15), transparent)" }}
        />

        {/* Merkez yeşil ışıma */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,255,0,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Köşe grid çizgileri */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,255,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* ── Geri dön linki ── */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-[#00ff00]/40 hover:text-[#00ff00] transition-colors text-xs font-['Space_Mono'] z-50"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>← MAIN TERMINAL</span>
        </Link>

        {/* ── Bağlantı durumu badge ── */}
        <div className="absolute top-6 right-6 flex items-center gap-2 z-50">
          <motion.div
            className="w-2 h-2 rounded-full bg-[#00ff00]"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />
          <span className="text-[10px] font-['Space_Mono'] text-[#00ff00]/60 tracking-widest">
            NEXUS ONLINE
          </span>
        </div>

        {/* ── Ana panel ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full max-w-md mx-4 z-10"
        >
          {/* Panel dış glow */}
          <div
            className="absolute -inset-px rounded-2xl nexus-border-pulse pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,0,0.05), rgba(0,255,0,0.3))",
              borderRadius: "16px",
              padding: "1px",
            }}
          />

          {/* Glassmorphism panel */}
          <div
            className="nexus-panel relative rounded-2xl overflow-hidden"
            style={{
              background: "rgba(5,10,5,0.85)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(0,255,0,0.2)",
              boxShadow: "0 0 60px rgba(0,255,0,0.06), 0 0 120px rgba(0,255,0,0.03), inset 0 0 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Üst ışık şeridi */}
            <div
              className="absolute top-0 inset-x-0 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(0,255,0,0.6), transparent)" }}
            />

            {/* Panel header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(0,255,0,0.08)" }}
            >
              <div className="flex items-center gap-3">
                {/* Terminal dots */}
                <div className="flex gap-1.5">
                  {["#ff5f57","#febc2e","#28c840"].map((c, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
                  ))}
                </div>
                <span className="text-[10px] font-['Space_Mono'] text-[#00ff00]/40 tracking-widest">
                  nexus://auth.must-b.com
                </span>
              </div>
              <Shield className="w-3.5 h-3.5 text-[#00ff00]/30" />
            </div>

            {/* Panel içerik */}
            <div className="p-6 sm:p-8">

              {/* Boot sekansı VEYA form */}
              <AnimatePresence mode="wait">
                {booting ? (
                  <motion.div
                    key="boot"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.25 } }}
                    className="flex items-start"
                  >
                    <BootSequence onComplete={handleBootComplete} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    {/* Başlık */}
                    <div className="mb-6 space-y-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(0,255,0,0.08)", border: "1px solid rgba(0,255,0,0.2)" }}
                        >
                          <img
                            src="/mascot.png"
                            alt="must-b"
                            className="w-5 h-5 object-contain"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                          />
                        </div>
                        <GlitchTitle
                          text={mode === "login" ? "NODE_AUTH.SYS" : "NEW_NODE.SYS"}
                        />
                      </div>
                      <p className="text-xs font-['Space_Mono'] text-[#00ff00]/40 leading-relaxed">
                        {mode === "login"
                          ? "> Nexus ağına bağlanmak için kimliğini doğrula."
                          : "> Dağıtık zeka ağına yeni düğüm kaydı başlatılıyor."}
                      </p>
                    </div>

                    {/* Mode toggle */}
                    <div
                      className="flex mb-6 rounded-lg overflow-hidden"
                      style={{ border: "1px solid rgba(0,255,0,0.12)", background: "rgba(0,0,0,0.3)" }}
                    >
                      {(["login", "register"] as AuthMode[]).map((m) => (
                        <button
                          key={m}
                          onClick={() => switchMode(m)}
                          className="flex-1 py-2.5 text-xs font-['Space_Mono'] font-bold tracking-widest transition-all duration-300 relative"
                          style={{
                            color: mode === m ? "#050505" : "rgba(0,255,0,0.4)",
                            background: mode === m ? "#00ff00" : "transparent",
                          }}
                        >
                          {m === "login" ? "[ GİRİŞ_YAP ]" : "[ AĞA_KATIL ]"}
                        </button>
                      ))}
                    </div>

                    {/* ── GİRİŞ FORMU ── */}
                    <AnimatePresence mode="wait">
                      {mode === "login" ? (
                        <motion.form
                          key="login-form"
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12 }}
                          transition={{ duration: 0.25 }}
                          onSubmit={loginForm.handleSubmit(handleLogin)}
                          className="space-y-4"
                        >
                          <NeonInput
                            id="login-nodeId"
                            type="email"
                            placeholder="node@nexus.must-b"
                            icon={AtSign}
                            error={loginForm.formState.errors.nodeId?.message}
                            {...loginForm.register("nodeId", {
                              required: "Node ID (e-posta) zorunlu",
                              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Geçerli bir e-posta gir" },
                            })}
                          />
                          <NeonInput
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••••"
                            icon={Lock}
                            error={loginForm.formState.errors.password?.message}
                            rightSlot={
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-[#00ff00]/30 hover:text-[#00ff00]/70 transition-colors"
                              >
                                {showPassword
                                  ? <EyeOff className="w-4 h-4" />
                                  : <Eye className="w-4 h-4" />
                                }
                              </button>
                            }
                            {...loginForm.register("password", {
                              required: "Parola zorunlu",
                              minLength: { value: 6, message: "En az 6 karakter" },
                            })}
                          />

                          <NexusCTAButton loading={loading} label="BAĞLANTIYI KUR" />
                        </motion.form>
                      ) : (
                        /* ── KAYIT FORMU ── */
                        <motion.form
                          key="register-form"
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -12 }}
                          transition={{ duration: 0.25 }}
                          onSubmit={registerForm.handleSubmit(handleRegister)}
                          className="space-y-4"
                        >
                          <NeonInput
                            id="reg-displayName"
                            type="text"
                            placeholder="Ajan Kod Adı"
                            icon={User}
                            error={registerForm.formState.errors.displayName?.message}
                            {...registerForm.register("displayName", {
                              required: "Görünen ad zorunlu",
                              minLength: { value: 2, message: "En az 2 karakter" },
                            })}
                          />
                          <NeonInput
                            id="reg-nodeId"
                            type="email"
                            placeholder="node@nexus.must-b"
                            icon={AtSign}
                            error={registerForm.formState.errors.nodeId?.message}
                            {...registerForm.register("nodeId", {
                              required: "E-posta zorunlu",
                              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Geçerli bir e-posta gir" },
                            })}
                          />
                          <NeonInput
                            id="reg-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Güvenlik protokolü"
                            icon={Lock}
                            error={registerForm.formState.errors.password?.message}
                            rightSlot={
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-[#00ff00]/30 hover:text-[#00ff00]/70 transition-colors"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            }
                            {...registerForm.register("password", {
                              required: "Parola zorunlu",
                              minLength: { value: 8, message: "En az 8 karakter" },
                            })}
                          />
                          <NeonInput
                            id="reg-confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Protokolü onayla"
                            icon={Lock}
                            error={registerForm.formState.errors.confirmPassword?.message}
                            rightSlot={
                              <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="text-[#00ff00]/30 hover:text-[#00ff00]/70 transition-colors"
                              >
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            }
                            {...registerForm.register("confirmPassword", {
                              required: "Onay parolası zorunlu",
                            })}
                          />

                          <NexusCTAButton loading={loading} label="AĞA KATIL" />
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {/* Durum mesajı */}
                    <AnimatePresence>
                      {statusMsg && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-4 px-3 py-2 rounded-lg text-xs font-['Space_Mono'] leading-relaxed"
                          style={{
                            background: "rgba(0,255,0,0.05)",
                            border: "1px solid rgba(0,255,0,0.15)",
                            color: statusMsg.startsWith("⚠") ? "#ff4444" : "#00ff00",
                          }}
                        >
                          {statusMsg}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Alt bilgi */}
                    <p className="mt-5 text-center text-[10px] font-['Space_Mono'] text-[#00ff00]/20 leading-relaxed">
                      Bağlanarak{" "}
                      <Link to="/terms" className="text-[#00ff00]/40 hover:text-[#00ff00] transition-colors underline underline-offset-2">
                        NEXUS_PROTOCOL
                      </Link>{" "}
                      şartlarını kabul ediyorsun.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Alt ışık şeridi */}
            <div
              className="absolute bottom-0 inset-x-0 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(0,255,0,0.3), transparent)" }}
            />
          </div>
        </motion.div>

        {/* Alt köşe dekoratif metin */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
          <span className="text-[10px] font-['Space_Mono'] text-[#00ff00]/15 tracking-widest">
            MUST-B NEXUS — ENCRYPTED CHANNEL — {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// CTA Butonu — ayrı bileşen (dışarıdan label alır)
// ─────────────────────────────────────────────────────────

function NexusCTAButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={!loading ? { scale: 1.015 } : {}}
      whileTap={!loading ? { scale: 0.985 } : {}}
      className="w-full mt-2 py-3 rounded-lg font-['Space_Mono'] font-bold text-sm tracking-widest relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2"
      style={{
        background: loading
          ? "rgba(0,255,0,0.1)"
          : "linear-gradient(135deg, rgba(0,255,0,0.9), rgba(0,220,0,0.8))",
        color: loading ? "rgba(0,255,0,0.4)" : "#050505",
        border: `1px solid ${loading ? "rgba(0,255,0,0.2)" : "transparent"}`,
        boxShadow: loading ? "none" : "0 0 20px rgba(0,255,0,0.3), 0 0 40px rgba(0,255,0,0.1)",
      }}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-[#00ff00]/60" />
          <span className="text-[#00ff00]/60">PROCESSING...</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}

      {/* Hover overlay */}
      {!loading && (
        <motion.div
          className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-200"
        />
      )}
    </motion.button>
  );
}
