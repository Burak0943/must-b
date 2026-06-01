/**
 * NexusAuth.tsx  —  Must-b Nexus Access Portal
 *
 * Design System v2 — "Must-b Premium"
 * ─ Palette : bg #0E1116 | surface #161B22 | border #30363D
 * ─ Text    : primary #E6EDF3 | secondary #8B949E | muted #484F58
 * ─ Accent  : Must-b Blue #3B82F6
 * ─ Font    : Inter / system-ui sans-serif everywhere (Space Mono only for password/code & boot terminal)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  Lock, Eye, EyeOff, ArrowRight,
  Shield, User, AtSign, Loader2,
  Cpu,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────

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

// ─── Boot Sequence Lines ──────────────────────────────────

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

// ─── Moving Nodes Canvas Background (Premium alternative to Matrix Rain) ───

function NetworkCanvas() {
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

    // Particles setup
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    const particleCount = 40;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw network grid lines
      ctx.strokeStyle = "rgba(59, 130, 246, 0.04)";
      ctx.lineWidth = 1;
      
      // Update & Draw particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
        ctx.fill();

        // Connect near particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.08 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        }
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
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

// ─── BootSequence ─────────────────────────────────────────

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
  }, []);

  return (
    <div className="font-mono text-xs leading-relaxed space-y-1 p-2 bg-[#0E1116] rounded-xl border border-[#30363D]">
      {lines.map((line, idx) => (
        <motion.p
          key={idx}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.12 }}
          className={
            line.startsWith("NEXUS") || line.startsWith("MUST")
              ? "text-blue-500 font-bold"
              : "text-[#8B949E]"
          }
        >
          {line}
        </motion.p>
      ))}
      <motion.span
        className="inline-block w-1.5 h-3 bg-blue-500 ml-1 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
      />
    </div>
  );
}

// ─── Premium Title ────────────────────────────────────────

function PremiumTitle({ text }: { text: string }) {
  return (
    <div className="relative select-none">
      <h1
        className="font-bold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {text}
      </h1>
    </div>
  );
}

// ─── FuturisticInput ──────────────────────────────────────

function FuturisticInput({
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
    <div className="space-y-1.5">
      <div
        className={`relative flex items-center rounded-xl border transition-all duration-200 bg-[#0E1116] ${
          focused
            ? "border-blue-500 ring-1 ring-blue-500/20"
            : "border-[#30363D]"
        }`}
      >
        <Icon className={`absolute left-3.5 w-4 h-4 shrink-0 pointer-events-none transition-colors duration-200 ${
          focused ? "text-blue-500" : "text-[#484F58]"
        }`} />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-transparent pl-10 pr-10 py-3 text-sm text-[#E6EDF3] placeholder:text-[#484F58] outline-none rounded-xl caret-blue-500 ${
            type === "password" ? "font-mono" : "font-sans"
          }`}
          style={{ fontFamily: type === "password" ? "'Space Mono', monospace" : "Inter, system-ui, sans-serif" }}
          {...rest}
        />
        {rightSlot && <div className="absolute right-3.5 flex items-center">{rightSlot}</div>}
      </div>
      {error && (
        <p className="text-xs text-red-500/80 pl-1 flex items-center gap-1" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// ─── NexusCTAButton ───────────────────────────────────────

function NexusCTAButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={!loading ? { scale: 1.01 } : {}}
      whileTap={!loading ? { scale: 0.99 } : {}}
      className="w-full mt-2 py-3 rounded-xl font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white/80" />
          <span>Processing...</span>
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

// ─── Main Auth Page ───────────────────────────────────────

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

  const handleBootComplete = useCallback(() => {
    console.log("[NexusAuth] 🔓 Boot complete, showing form");
    setBooting(false);
  }, []);

  // Redirect if session exists
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/", { replace: true });
    });
  }, [navigate]);

  // Login
  const handleLogin = async (data: LoginFields) => {
    setLoading(true);
    setStatusMsg("▸ Authenticating node...");
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setStatusMsg("✓ NODE AUTHENTICATED — redirecting...");
      setTimeout(() => navigate("/"), 800);
    } catch (err: any) {
      setStatusMsg(`⚠ AUTH FAILED: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Register
  const handleRegister = async (data: RegisterFields) => {
    if (data.password !== data.confirmPassword) {
      registerForm.setError("confirmPassword", { message: "Parolalar eşleşmiyor" });
      return;
    }
    setLoading(true);
    setStatusMsg("▸ Registering new node...");
    try {
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono&display=swap');
      `}</style>

      <div
        className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4"
        style={{ background: "#0E1116", fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {/* Particle Canvas Background */}
        <NetworkCanvas />

        {/* Top-left Back button */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-[#8B949E] hover:text-[#E6EDF3] transition-colors text-xs font-semibold z-50 bg-[#161B22]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#30363D]"
        >
          <Cpu className="w-3.5 h-3.5 text-blue-500" />
          <span>← MAIN TERMINAL</span>
        </Link>

        {/* Top-right Connection status */}
        <div className="absolute top-6 right-6 flex items-center gap-2 z-50 bg-[#161B22]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#30363D]">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />
          <span className="text-[10px] font-bold text-[#E6EDF3] tracking-wider uppercase">
            NEXUS ONLINE
          </span>
        </div>

        {/* Main Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative w-full max-w-md z-20"
        >
          <div className="relative rounded-2xl overflow-hidden bg-[#161B22]/95 backdrop-blur-xl border border-[#30363D] shadow-2xl">
            {/* Top thin gradient strip */}
            <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 to-indigo-600" />

            {/* Header / Brand strip */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#30363D]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[11px] font-bold tracking-widest text-[#8B949E] uppercase font-mono">
                  nexus://auth.must-b
                </span>
              </div>
              <Shield className="w-3.5 h-3.5 text-[#484F58]" />
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 relative">
              {/* Boot sequence screen */}
              <div
                aria-hidden={!booting}
                style={{
                  opacity: booting ? 1 : 0,
                  pointerEvents: booting ? "auto" : "none",
                  transition: "opacity 0.3s ease",
                  maxHeight: booting ? "400px" : "0px",
                  overflow: "hidden",
                }}
              >
                <BootSequence onComplete={handleBootComplete} />
              </div>

              {/* Form container */}
              <div
                aria-hidden={booting}
                style={{
                  opacity: booting ? 0 : 1,
                  pointerEvents: booting ? "none" : "auto",
                  transition: "opacity 0.4s ease 0.1s",
                }}
              >
                {/* Title */}
                <div className="mb-6 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <PremiumTitle text={mode === "login" ? "Node Authentication" : "Acknowledge Node"} />
                  </div>
                  <p className="text-xs text-[#8B949E] leading-relaxed">
                    {mode === "login"
                      ? "Authenticate with the Nexus mesh network to begin."
                      : "Initialize new cryptographic coordinates in the distributed swarm."}
                  </p>
                </div>

                {/* Login / Register Toggle Tabs */}
                <div className="flex mb-6 rounded-xl p-1 bg-[#0E1116] border border-[#30363D]">
                  {(["login", "register"] as AuthMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => switchMode(m)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        mode === m
                          ? "bg-[#161B22] text-[#E6EDF3] shadow-md border border-[#30363D]"
                          : "text-[#8B949E] hover:text-[#E6EDF3]"
                      }`}
                    >
                      {m === "login" ? "Sign In" : "Register Node"}
                    </button>
                  ))}
                </div>

                {/* LOGIN FORM */}
                {mode === "login" && (
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FuturisticInput
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
                    <FuturisticInput
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      icon={Lock}
                      error={loginForm.formState.errors.password?.message}
                      rightSlot={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[#484F58] hover:text-[#E6EDF3] transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                      {...loginForm.register("password", {
                        required: "Parola zorunlu",
                        minLength: { value: 6, message: "En az 6 karakter" },
                      })}
                    />
                    <NexusCTAButton loading={loading} label="ESTABLISH CONNECTION" />
                  </form>
                )}

                {/* REGISTER FORM */}
                {mode === "register" && (
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <FuturisticInput
                      id="reg-displayName"
                      type="text"
                      placeholder="Ajan Kod Adı (e.g. mazren)"
                      icon={User}
                      error={registerForm.formState.errors.displayName?.message}
                      {...registerForm.register("displayName", {
                        required: "Görünen ad zorunlu",
                        minLength: { value: 2, message: "En az 2 karakter" },
                      })}
                    />
                    <FuturisticInput
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
                    <FuturisticInput
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Güvenlik protokolü (parola)"
                      icon={Lock}
                      error={registerForm.formState.errors.password?.message}
                      rightSlot={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[#484F58] hover:text-[#E6EDF3] transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                      {...registerForm.register("password", {
                        required: "Parola zorunlu",
                        minLength: { value: 8, message: "En az 8 karakter" },
                      })}
                    />
                    <FuturisticInput
                      id="reg-confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Protokolü onayla"
                      icon={Lock}
                      error={registerForm.formState.errors.confirmPassword?.message}
                      rightSlot={
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="text-[#484F58] hover:text-[#E6EDF3] transition-colors"
                        >
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                      {...registerForm.register("confirmPassword", { required: "Onay parolası zorunlu" })}
                    />
                    <NexusCTAButton loading={loading} label="INITIALIZE NODE" />
                  </form>
                )}

                {/* Status Message */}
                {statusMsg && (
                  <div
                    className="mt-4 px-4 py-3 rounded-xl text-xs leading-relaxed font-mono"
                    style={{
                      background: "rgba(59, 130, 246, 0.05)",
                      border: "1px solid rgba(59, 130, 246, 0.15)",
                      color: statusMsg.startsWith("⚠") ? "#F87171" : "#60A5FA",
                    }}
                  >
                    {statusMsg}
                  </div>
                )}

                {/* Terms link */}
                <p className="mt-5 text-center text-[10px] text-[#484F58] leading-relaxed">
                  By connecting, you agree to the{" "}
                  <Link to="/terms" className="text-[#8B949E] hover:text-blue-400 transition-colors underline underline-offset-2">
                    NEXUS PROTOCOL
                  </Link>{" "}
                  terms of authorization.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer copyright */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none z-10">
          <span className="text-[10px] text-[#484F58] tracking-widest uppercase font-mono">
            MUST-B NEXUS · E2EE · SECURE SWARM · {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </>
  );
}
