/**
 * NexusAuth.tsx  —  Must-b Nexus Kapısı
 *
 * Tasarım : Ultra-Dark (#050505) + Neon Yeşil (#00ff00)
 * Estetik : Terminal / Hacker + Glassmorphism panel
 * Font    : Space Mono (Google Fonts)
 * Form    : React Hook Form  |  Supabase TODO alanları hazır
 *
 * GEÇİŞ MEKANİZMASI:
 *   AnimatePresence KULLANILMIYOR (deadlock riski).
 *   Boot + Form her zaman DOM'da; CSS opacity/pointerEvents ile gösterilip gizleniyor.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
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
  nodeId: string;
  password: string;
}

interface RegisterFields {
  nodeId: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

// ─────────────────────────────────────────────────────────
// Boot satırları
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
// MatrixRain — z-0, pointer-events-none
// ─────────────────────────────────────────────────────────

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
      /* z-0 — formun ALTINDA kalır */
      className="absolute inset-0 w-full h-full opacity-30 pointer-events-none z-0"
    />
  );
}

// ─────────────────────────────────────────────────────────
// BootSequence — AnimatePresence bağımlılığı YOK
// Kendi içinde opacity manipülasyonu YOK (CSS transition yönetiyor)
// ─────────────────────────────────────────────────────────

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
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
        setTimeout(() => onCompleteRef.current(), 400);
      }
    }, 160);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="font-['Space_Mono'] text-xs leading-relaxed space-y-1 p-1">
      {lines.map((line, idx) => (
        <motion.p
          key={idx}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.12 }}
          className={
            line.startsWith("NEXUS") || line.startsWith("MUST")
              ? "text-[#00ff00] font-bold"
              : "text-[#00cc00]/80"
          }
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

// ─────────────────────────────────────────────────────────
// GlitchTitle
// ─────────────────────────────────────────────────────────

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
          >{text}</span>
          <span
            className="absolute inset-0 font-['Space_Mono'] font-bold text-lg sm:text-xl tracking-wider text-[#00ffff] opacity-70"
            style={{ clipPath: "inset(60% 0 10% 0)", transform: "translateX(-3px)" }}
          >{text}</span>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// NeonInput
// ─────────────────────────────────────────────────────────

function NeonInput({
  id, type = "text", placeholder, icon: Icon, rightSlot, error, ...rest
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
// NexusCTAButton
// ─────────────────────────────────────────────────────────

function NexusCTAButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={!loading ? { scale: 1.015 } : {}}
      whileTap={!loading ? { scale: 0.985 } : {}}
      className="w-full mt-2 py-3 rounded-lg font-['Space_Mono'] font-bold text-sm tracking-widest relative overflow-hidden flex items-center justify-center gap-2 transition-all duration-300"
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
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────
// Ana Sayfa
// ─────────────────────────────────────────────────────────

export default function NexusAuth() {
  const navigate = useNavigate();
  const [booting, setBooting]           = useState(true);
  const [mode, setMode]                 = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [statusMsg, setStatusMsg]       = useState<string | null>(null);

  const loginForm    = useForm<LoginFields>({ mode: "onBlur" });
  const registerForm = useForm<RegisterFields>({ mode: "onBlur" });

  // Boot tamamlandı → booting=false
  const handleBootComplete = useCallback(() => {
    console.log("[NexusAuth] 🔓 Boot tamamlandı, form gösteriliyor");
    setBooting(false);
  }, []);

  // Oturum varsa ana sayfaya
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/", { replace: true });
    });
  }, [navigate]);

  // Giriş
  const handleLogin = async (data: LoginFields) => {
    setLoading(true);
    setStatusMsg("▸ Authenticating node...");
    try {
      // TODO: Supabase Auth
      // const { error } = await supabase.auth.signInWithPassword({ email: data.nodeId, password: data.password });
      // if (error) throw error;
      await new Promise((r) => setTimeout(r, 1200));
      setStatusMsg("✓ NODE AUTHENTICATED — redirecting...");
      setTimeout(() => navigate("/"), 800);
    } catch (err: any) {
      setStatusMsg(`⚠ AUTH FAILED: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Kayıt
  const handleRegister = async (data: RegisterFields) => {
    if (data.password !== data.confirmPassword) {
      registerForm.setError("confirmPassword", { message: "Parolalar eşleşmiyor" });
      return;
    }
    setLoading(true);
    setStatusMsg("▸ Registering new node...");
    try {
      // TODO: Supabase Auth
      // const { error } = await supabase.auth.signUp({ email: data.nodeId, password: data.password, options: { data: { display_name: data.displayName } } });
      // if (error) throw error;
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

  // ── Render ──────────────────────────────────────────────
  return (
    <>
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
          96%  { opacity: 0.7; }
          97%  { opacity: 1; }
          98%  { opacity: 0.4; }
          99%  { opacity: 1; }
        }
        .nexus-panel        { animation: nexus-flicker 8s infinite; }
        .nexus-scan-line    { animation: nexus-scan 6s linear infinite; }
        .nexus-border-pulse { animation: nexus-pulse-border 2.5s ease-in-out infinite; }
      `}</style>

      {/* ── Sayfa kapsayıcı ── */}
      <div
        className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
        style={{ background: "#050505" }}
      >
        {/* Arka plan katmanları — z-0 */}
        <MatrixRain />

        <div
          className="nexus-scan-line absolute left-0 right-0 h-px pointer-events-none z-0"
          style={{ background: "linear-gradient(to right, transparent, rgba(0,255,0,0.15), transparent)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,255,0,0.04) 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(rgba(0,255,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Üst sol: geri */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-[#00ff00]/40 hover:text-[#00ff00] transition-colors text-xs font-['Space_Mono'] z-50"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>← MAIN TERMINAL</span>
        </Link>

        {/* Üst sağ: durum */}
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

        {/* ── Ana panel — z-20 (canvas ve dekoratif katmanların üzerinde) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full max-w-md mx-4 z-20"
        >
          {/* Dış glow halkası */}
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
              background: "rgba(5,10,5,0.92)",
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

            {/* Terminal başlık çubuğu */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(0,255,0,0.08)" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
                  ))}
                </div>
                <span className="text-[10px] font-['Space_Mono'] text-[#00ff00]/40 tracking-widest">
                  nexus://auth.must-b.com
                </span>
              </div>
              <Shield className="w-3.5 h-3.5 text-[#00ff00]/30" />
            </div>

            {/* ── İçerik alanı ── */}
            <div className="p-6 sm:p-8 relative">

              {/*
               * GEÇİŞ MANTIĞI:
               * AnimatePresence KULLANILMIYOR — deadlock riski sıfır.
               * Boot ve Form her zaman DOM'da.
               * CSS opacity + pointerEvents ile gösterilip gizleniyor.
               */}

              {/* BOOT EKRANI */}
              <div
                aria-hidden={!booting}
                style={{
                  opacity: booting ? 1 : 0,
                  pointerEvents: booting ? "auto" : "none",
                  transition: "opacity 0.35s ease",
                  /* boot bittikten sonra yüksekliği sıfıra düşürüyoruz ki form doğru konumlansin */
                  maxHeight: booting ? "400px" : "0px",
                  overflow: "hidden",
                }}
              >
                <BootSequence onComplete={handleBootComplete} />
              </div>

              {/* AUTH FORM — boot biter bitmez fade-in */}
              <div
                aria-hidden={booting}
                style={{
                  opacity: booting ? 0 : 1,
                  pointerEvents: booting ? "none" : "auto",
                  transition: "opacity 0.5s ease 0.15s",
                }}
              >
                {/* DEV — konsolda form render'ı doğrula */}
                {!booting && console.log("[NexusAuth] ✅ Auth Form Render Edildi")}

                {/* Başlık */}
                <div className="mb-6 space-y-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "rgba(0,255,0,0.08)", border: "1px solid rgba(0,255,0,0.2)" }}
                    >
                      <img
                        src="/mascot.png"
                        alt="must-b"
                        className="w-5 h-5 object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                    <GlitchTitle text={mode === "login" ? "NODE_AUTH.SYS" : "NEW_NODE.SYS"} />
                  </div>
                  <p className="text-xs font-['Space_Mono'] text-[#00ff00]/40 leading-relaxed">
                    {mode === "login"
                      ? "> Nexus ağına bağlanmak için kimliğini doğrula."
                      : "> Dağıtık zeka ağına yeni düğüm kaydı başlatılıyor."}
                  </p>
                </div>

                {/* Login / Register toggle */}
                <div
                  className="flex mb-6 rounded-lg overflow-hidden"
                  style={{ border: "1px solid rgba(0,255,0,0.12)", background: "rgba(0,0,0,0.3)" }}
                >
                  {(["login", "register"] as AuthMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => switchMode(m)}
                      className="flex-1 py-2.5 text-xs font-['Space_Mono'] font-bold tracking-widest transition-all duration-300"
                      style={{
                        color: mode === m ? "#050505" : "rgba(0,255,0,0.4)",
                        background: mode === m ? "#00ff00" : "transparent",
                      }}
                    >
                      {m === "login" ? "[ GİRİŞ_YAP ]" : "[ AĞA_KATIL ]"}
                    </button>
                  ))}
                </div>

                {/* GİRİŞ FORMU */}
                {mode === "login" && (
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
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
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="text-[#00ff00]/30 hover:text-[#00ff00]/70 transition-colors">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                      {...loginForm.register("password", {
                        required: "Parola zorunlu",
                        minLength: { value: 6, message: "En az 6 karakter" },
                      })}
                    />
                    <NexusCTAButton loading={loading} label="BAĞLANTIYI KUR" />
                  </form>
                )}

                {/* KAYIT FORMU */}
                {mode === "register" && (
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
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
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="text-[#00ff00]/30 hover:text-[#00ff00]/70 transition-colors">
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
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                          className="text-[#00ff00]/30 hover:text-[#00ff00]/70 transition-colors">
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                      {...registerForm.register("confirmPassword", { required: "Onay parolası zorunlu" })}
                    />
                    <NexusCTAButton loading={loading} label="AĞA KATIL" />
                  </form>
                )}

                {/* Durum mesajı */}
                {statusMsg && (
                  <div
                    className="mt-4 px-3 py-2 rounded-lg text-xs font-['Space_Mono'] leading-relaxed"
                    style={{
                      background: "rgba(0,255,0,0.05)",
                      border: "1px solid rgba(0,255,0,0.15)",
                      color: statusMsg.startsWith("⚠") ? "#ff4444" : "#00ff00",
                    }}
                  >
                    {statusMsg}
                  </div>
                )}

                {/* Alt bilgi */}
                <p className="mt-5 text-center text-[10px] font-['Space_Mono'] text-[#00ff00]/20 leading-relaxed">
                  Bağlanarak{" "}
                  <Link to="/terms" className="text-[#00ff00]/40 hover:text-[#00ff00] transition-colors underline underline-offset-2">
                    NEXUS_PROTOCOL
                  </Link>{" "}
                  şartlarını kabul ediyorsun.
                </p>
              </div>
              {/* /AUTH FORM */}

            </div>{/* /İçerik */}

            {/* Alt ışık şeridi */}
            <div
              className="absolute bottom-0 inset-x-0 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(0,255,0,0.3), transparent)" }}
            />
          </div>
        </motion.div>

        {/* Alt copyright */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-10">
          <span className="text-[10px] font-['Space_Mono'] text-[#00ff00]/15 tracking-widest">
            MUST-B NEXUS — ENCRYPTED CHANNEL — {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </>
  );
}
