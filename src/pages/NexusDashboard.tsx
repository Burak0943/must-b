/**
 * NexusDashboard.tsx — Must-b Nexus Topluluk Terminali
 *
 * Layout  : 3 kolon (sidebar | main terminal | node listesi)
 * Tema    : Ultra-Karanlık (#050505) + Neon Yeşil (#00ff00)
 * Font    : Space Mono
 * Estetik : Terminal satırları, glassmorphism paneller, E2EE rozeti
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Hash, Lock, Plus, Send, Ghost,
  Shield, Wifi, LogOut, ChevronRight,
  Terminal, Radio, AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────
// Sabit veri
// ─────────────────────────────────────────────────────────

const CHANNELS = [
  { id: "nexus-terminal", label: "nexus-terminal", unread: 0 },
  { id: "showcase",       label: "showcase",       unread: 3 },
  { id: "bug-bounty",    label: "bug-bounty",      unread: 1 },
];

const DEMO_MESSAGES: Message[] = [
  { id: 1,  ts: "21:37", user: "Root_Node",    text: "Nexus terminali online. Şifreli kanal kuruldu.",         system: false },
  { id: 2,  ts: "21:38", user: "SYSTEM",        text: "E2EE handshake tamamlandı. Oturum anahtarı üretildi.",  system: true  },
  { id: 3,  ts: "21:39", user: "Elite_0x9A",   text: "v3.1.4 güncellemesindeki swarm koordinasyonu mükemmel.", system: false },
  { id: 4,  ts: "21:40", user: "Anon_7f3c",    text: "Bug-bounty kanalında yeni bir keşif paylaştım.",         system: false },
  { id: 5,  ts: "21:41", user: "Root_Node",    text: "Göreceğim. AI agent tetiklendi mi?",                    system: false },
  { id: 6,  ts: "21:42", user: "Elite_0x9A",   text: "Evet, must-b proxy üzerinden otomatik yanıt döndü.",    system: false },
  { id: 7,  ts: "21:43", user: "SYSTEM",        text: "Yeni node bağlandı: Shadow_Relay",                      system: true  },
  { id: 8,  ts: "21:44", user: "Shadow_Relay",  text: "Selam Nexus. Local sovereign kurulum tamam.",           system: false },
  { id: 9,  ts: "21:45", user: "Anon_7f3c",    text: "Hangi model? Ollama mı yoksa BYOK mi?",                  system: false },
  { id: 10, ts: "21:46", user: "Shadow_Relay",  text: "BYOK + air-gapped. Sıfır telemetri. 🛡️",              system: false },
];

const ACTIVE_NODES = [
  { id: "root",    name: "Root_Node",   role: "ADMIN",   color: "#00ff00" },
  { id: "elite",   name: "Elite_0x9A", role: "ELITE",   color: "#06b6d4" },
  { id: "anon",    name: "Anon_7f3c",  role: "CORE",    color: "#a3e635" },
  { id: "shadow",  name: "Shadow_Relay", role: "LOCAL", color: "#c084fc" },
  { id: "ghost1",  name: "Node_??",    role: "???",     color: "#555" },
];

interface Message {
  id: number;
  ts: string;
  user: string;
  text: string;
  system: boolean;
}

// ─────────────────────────────────────────────────────────
// E2EE Rozeti
// ─────────────────────────────────────────────────────────

function E2EEBadge() {
  return (
    <motion.div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-['Space_Mono'] font-bold tracking-widest select-none"
      style={{
        background: "rgba(0,255,0,0.06)",
        border: "1px solid rgba(0,255,0,0.2)",
        color: "#00ff00",
      }}
      animate={{
        boxShadow: [
          "0 0 0px rgba(0,255,0,0)",
          "0 0 10px rgba(0,255,0,0.25)",
          "0 0 0px rgba(0,255,0,0)",
        ],
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-[#00ff00]"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <Shield className="w-3 h-3" />
      E2EE SECURED
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// Mesaj satırı
// ─────────────────────────────────────────────────────────

function MessageRow({ msg, isOwn }: { msg: Message; isOwn: boolean }) {
  if (msg.system) {
    return (
      <div className="flex items-center gap-3 py-1">
        <span className="text-[10px] font-['Space_Mono'] text-[#00ff00]/20 w-12 shrink-0 text-right">
          {msg.ts}
        </span>
        <div
          className="flex-1 text-[11px] font-['Space_Mono'] px-3 py-1 rounded"
          style={{
            background: "rgba(0,255,0,0.04)",
            border: "1px solid rgba(0,255,0,0.08)",
            color: "rgba(0,255,0,0.5)",
          }}
        >
          ⚡ {msg.text}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex items-start gap-3 py-0.5 group hover:bg-white/[0.015] rounded px-1 -mx-1 transition-colors`}
    >
      {/* Zaman damgası */}
      <span className="text-[10px] font-['Space_Mono'] text-white/15 w-12 shrink-0 text-right pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {msg.ts}
      </span>

      {/* İçerik */}
      <div className="flex-1 min-w-0">
        <span
          className="text-xs font-['Space_Mono'] font-bold mr-2"
          style={{ color: isOwn ? "#00ff00" : "rgba(255,255,255,0.6)" }}
        >
          {msg.user}
          {isOwn && <span className="text-[#00ff00]/40 font-normal ml-1">(sen)</span>}
        </span>
        <span className="text-sm text-white/70 font-['Space_Mono'] break-words leading-relaxed">
          {msg.text}
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// Ghost Protocol Input (hayalet oda girişi)
// ─────────────────────────────────────────────────────────

function GhostInput() {
  const [val, setVal]       = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div
      className="px-3 py-2 rounded-lg transition-all duration-500"
      style={{
        opacity: focused || val ? 0.85 : 0.15,
        background: focused ? "rgba(0,255,0,0.04)" : "transparent",
        border: `1px solid ${focused ? "rgba(0,255,0,0.2)" : "rgba(255,255,255,0.04)"}`,
      }}
    >
      <div className="flex items-center gap-2">
        <Ghost className="w-3 h-3 text-[#00ff00]/50 shrink-0" />
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Enter Node Code..."
          className="flex-1 bg-transparent text-[11px] font-['Space_Mono'] text-[#00ff00]/70 placeholder:text-white/20 outline-none w-full"
        />
        {val && (
          <button
            className="text-[#00ff00]/40 hover:text-[#00ff00] transition-colors"
            onClick={() => setVal("")}
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Ana Bileşen
// ─────────────────────────────────────────────────────────

export default function NexusDashboard() {
  const navigate = useNavigate();

  const [activeChannel, setActiveChannel]   = useState(CHANNELS[0].id);
  const [messages, setMessages]             = useState<Message[]>(DEMO_MESSAGES);
  const [inputVal, setInputVal]             = useState("");
  const [nodeName]                          = useState("Root_Node");
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [rightOpen, setRightOpen]           = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom
  const scrollBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollBottom(); }, [messages, scrollBottom]);

  // Oturum kontrolü
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // TODO: Supabase oturumu yoksa yetkilendirme gerekir
      // Şimdilik demo modunda — session check devre dışı
      // if (!session) navigate("/auth", { replace: true });
    });
  }, [navigate]);

  // Mesaj gönder
  const sendMessage = useCallback(() => {
    const text = inputVal.trim();
    if (!text) return;
    const now = new Date();
    const ts  = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), ts, user: nodeName, text, system: false },
    ]);
    setInputVal("");
    setTimeout(scrollBottom, 50);
  }, [inputVal, nodeName, scrollBottom]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const activeLabel = CHANNELS.find((c) => c.id === activeChannel)?.label ?? activeChannel;

  // ─────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

        /* Custom scrollbar */
        .nexus-scroll::-webkit-scrollbar { width: 4px; }
        .nexus-scroll::-webkit-scrollbar-track { background: transparent; }
        .nexus-scroll::-webkit-scrollbar-thumb { background: rgba(0,255,0,0.15); border-radius: 2px; }
        .nexus-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,255,0,0.3); }

        @keyframes node-blink {
          0%,100% { opacity:1; } 50% { opacity:0.3; }
        }
        .node-dot { animation: node-blink 2.5s ease-in-out infinite; }

        @keyframes e2ee-scan {
          0%   { background-position: -200% center; }
          100% { background-position: 300% center; }
        }
      `}</style>

      {/* ── Tam ekran kapsayıcı ── */}
      <div
        className="h-screen w-screen overflow-hidden flex flex-col"
        style={{ background: "#050505", fontFamily: "'Space Mono', monospace" }}
      >

        {/* ════════════════════ TOP BAR ════════════════════ */}
        <div
          className="flex items-center justify-between px-4 py-2.5 shrink-0 z-30"
          style={{
            background: "rgba(5,8,5,0.95)",
            borderBottom: "1px solid rgba(0,255,0,0.08)",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: "rgba(0,255,0,0.1)", border: "1px solid rgba(0,255,0,0.2)" }}
            >
              <Terminal className="w-3.5 h-3.5 text-[#00ff00]" />
            </div>
            <span className="text-sm font-bold text-[#00ff00] tracking-widest">MUST-B NEXUS</span>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-bold tracking-widest"
              style={{ background: "rgba(0,255,0,0.08)", color: "rgba(0,255,0,0.5)", border: "1px solid rgba(0,255,0,0.12)" }}
            >
              v3.1.4
            </span>
          </div>

          {/* Orta — kanal adı */}
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <Hash className="w-3.5 h-3.5" />
            <span className="font-['Space_Mono']">{activeLabel}</span>
          </div>

          {/* Sağ — node adı + çıkış */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-[#00ff00]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span className="text-xs text-[#00ff00]/70 font-['Space_Mono']">{nodeName}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-[10px] text-white/30 hover:text-red-400 transition-colors font-['Space_Mono']"
            >
              <LogOut className="w-3.5 h-3.5" />
              ÇIKIŞ
            </button>
          </div>
        </div>

        {/* ════════════════════ 3 KOLON ════════════════════ */}
        <div className="flex flex-1 min-h-0">

          {/* ── SOL SIDEBAR ── */}
          <div
            className="w-64 shrink-0 flex flex-col overflow-hidden"
            style={{
              background: "rgba(3,6,3,0.98)",
              borderRight: "1px solid rgba(0,255,0,0.07)",
            }}
          >
            {/* Kullanıcı kartı */}
            <div
              className="px-4 py-3 shrink-0"
              style={{ borderBottom: "1px solid rgba(0,255,0,0.06)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,255,0,0.15), rgba(0,255,0,0.05))",
                    border: "1px solid rgba(0,255,0,0.2)",
                    color: "#00ff00",
                  }}
                >
                  {nodeName[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#00ff00] truncate">{nodeName}</p>
                  <p className="text-[9px] text-white/25 tracking-widest">ADMIN NODE</p>
                </div>
              </div>
            </div>

            {/* Açık ağlar */}
            <div className="flex-1 overflow-y-auto nexus-scroll px-3 py-3">
              <p className="text-[9px] text-white/20 tracking-[0.25em] uppercase mb-2 px-1">
                Açık Ağlar
              </p>

              <div className="space-y-0.5">
                {CHANNELS.map((ch) => {
                  const isActive = ch.id === activeChannel;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChannel(ch.id)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-200 group relative"
                      style={{
                        background: isActive ? "rgba(0,255,0,0.07)" : "transparent",
                        border: isActive ? "1px solid rgba(0,255,0,0.15)" : "1px solid transparent",
                        boxShadow: isActive ? "0 0 12px rgba(0,255,0,0.08)" : "none",
                      }}
                    >
                      <Hash
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: isActive ? "#00ff00" : "rgba(255,255,255,0.25)" }}
                      />
                      <span
                        className="text-xs flex-1 truncate font-['Space_Mono']"
                        style={{ color: isActive ? "#00ff00" : "rgba(255,255,255,0.45)" }}
                      >
                        {ch.label}
                      </span>
                      {ch.unread > 0 && !isActive && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                          style={{ background: "rgba(0,255,0,0.15)", color: "#00ff00" }}
                        >
                          {ch.unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Ayırıcı */}
              <div className="my-4 h-px" style={{ background: "rgba(0,255,0,0.05)" }} />

              {/* Bilgi */}
              <div className="flex items-center gap-1.5 px-1 mb-3">
                <Radio className="w-3 h-3 text-[#00ff00]/20" />
                <p className="text-[9px] text-white/15 tracking-[0.25em] uppercase">
                  Ghost Protocol
                </p>
              </div>
              {/* Hayalet oda giriş — görünmez, hover'da belirir */}
              <GhostInput />
            </div>

            {/* Alt bilgi */}
            <div
              className="px-4 py-3 shrink-0"
              style={{ borderTop: "1px solid rgba(0,255,0,0.05)" }}
            >
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-[#00ff00]/30" />
                <span className="text-[9px] text-white/20 font-['Space_Mono'] tracking-widest">
                  E2EE • AES-256-GCM
                </span>
              </div>
            </div>
          </div>

          {/* ── ORTA — ANA TERMİNAL ── */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">

            {/* Kanal header */}
            <div
              className="flex items-center justify-between px-5 py-3 shrink-0"
              style={{
                background: "rgba(4,7,4,0.98)",
                borderBottom: "1px solid rgba(0,255,0,0.07)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <Hash className="w-4 h-4 text-[#00ff00]/60" />
                <span className="text-sm font-bold text-white/80 font-['Space_Mono']">
                  {activeLabel}
                </span>
                <span className="text-[10px] text-white/20 font-['Space_Mono']">
                  — uçtan uca şifreli kanal
                </span>
              </div>
              <E2EEBadge />
            </div>

            {/* Mesaj akışı */}
            <div className="flex-1 overflow-y-auto nexus-scroll px-5 py-4 space-y-1">
              {/* Kanal açılış notu */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: "rgba(0,255,0,0.06)" }} />
                <span className="text-[9px] font-['Space_Mono'] text-white/15 tracking-widest">
                  KANAL BAŞLANGICI — {activeLabel}
                </span>
                <div className="flex-1 h-px" style={{ background: "rgba(0,255,0,0.06)" }} />
              </div>

              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <MessageRow
                    key={msg.id}
                    msg={msg}
                    isOwn={msg.user === nodeName}
                  />
                ))}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ── Mesaj yazma alanı ── */}
            <div
              className="px-4 pb-4 pt-3 shrink-0"
              style={{ borderTop: "1px solid rgba(0,255,0,0.06)" }}
            >
              <div
                className="flex items-end gap-2 rounded-xl px-3 py-2.5 transition-all duration-200"
                style={{
                  background: "rgba(0,255,0,0.03)",
                  border: "1px solid rgba(0,255,0,0.12)",
                }}
                onFocus={() => {}}
              >
                {/* Dosya/kod yükle */}
                <button
                  className="text-white/20 hover:text-[#00ff00]/60 transition-colors p-1 shrink-0 self-end mb-0.5"
                  title="Dosya / Kod Yükle"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Textarea */}
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    // Auto-resize
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={`#${activeLabel} kanalına mesaj yaz...`}
                  className="flex-1 bg-transparent text-sm font-['Space_Mono'] text-white/80 placeholder:text-white/15 outline-none resize-none min-h-[24px] max-h-[120px] leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                />

                {/* Gönder */}
                <motion.button
                  onClick={sendMessage}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={!inputVal.trim()}
                  className="p-1.5 rounded-lg shrink-0 self-end mb-0.5 transition-all duration-200"
                  style={{
                    background: inputVal.trim() ? "rgba(0,255,0,0.15)" : "transparent",
                    border: `1px solid ${inputVal.trim() ? "rgba(0,255,0,0.3)" : "rgba(255,255,255,0.05)"}`,
                    color: inputVal.trim() ? "#00ff00" : "rgba(255,255,255,0.15)",
                    boxShadow: inputVal.trim() ? "0 0 10px rgba(0,255,0,0.15)" : "none",
                  }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Alt hint */}
              <p className="text-[9px] text-white/10 font-['Space_Mono'] mt-1.5 px-1">
                Enter → gönder &nbsp;·&nbsp; Shift+Enter → yeni satır &nbsp;·&nbsp; Mesajlar E2EE ile şifrelenir
              </p>
            </div>
          </div>

          {/* ── SAĞ — AKTİF NODE'LAR ── */}
          <div
            className="w-56 shrink-0 flex flex-col overflow-hidden"
            style={{
              background: "rgba(3,6,3,0.98)",
              borderLeft: "1px solid rgba(0,255,0,0.07)",
            }}
          >
            <div
              className="px-4 py-3 shrink-0"
              style={{ borderBottom: "1px solid rgba(0,255,0,0.06)" }}
            >
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-[#00ff00]/40" />
                <span className="text-[10px] text-white/30 tracking-[0.2em] uppercase font-['Space_Mono']">
                  Aktif Nodlar
                </span>
                <span
                  className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(0,255,0,0.1)", color: "#00ff00" }}
                >
                  {ACTIVE_NODES.length}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto nexus-scroll px-3 py-3 space-y-1">
              {ACTIVE_NODES.map((node, idx) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/[0.02] transition-colors group cursor-default"
                >
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{
                      background: `${node.color}15`,
                      border: `1px solid ${node.color}30`,
                      color: node.color,
                    }}
                  >
                    {node.name[0]}
                  </div>

                  {/* İsim + rol */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[11px] font-['Space_Mono'] font-bold truncate"
                      style={{ color: node.color === "#555" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.75)" }}
                    >
                      {node.name}
                    </p>
                    <p
                      className="text-[9px] font-['Space_Mono'] tracking-widest"
                      style={{ color: node.color === "#555" ? "rgba(255,255,255,0.1)" : `${node.color}80` }}
                    >
                      {node.role}
                    </p>
                  </div>

                  {/* Online dot */}
                  <div
                    className="node-dot w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      background: node.color,
                      boxShadow: node.color !== "#555" ? `0 0 6px ${node.color}` : "none",
                      animationDelay: `${idx * 0.4}s`,
                    }}
                  />
                </motion.div>
              ))}

              {/* Ayırıcı */}
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,255,0,0.05)" }}>
                <div className="flex items-center gap-1.5 px-2 opacity-30">
                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                  <span className="text-[9px] font-['Space_Mono'] text-white/30">
                    Kimlikler şifreli
                  </span>
                </div>
              </div>
            </div>

            {/* Alt — bağlantı istatistiği */}
            <div
              className="px-4 py-3 shrink-0 space-y-1.5"
              style={{ borderTop: "1px solid rgba(0,255,0,0.05)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-['Space_Mono'] text-white/20">Gecikme</span>
                <span className="text-[9px] font-['Space_Mono'] text-[#00ff00]/50">12ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-['Space_Mono'] text-white/20">Şifreleme</span>
                <span className="text-[9px] font-['Space_Mono'] text-[#00ff00]/50">AES-256</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-['Space_Mono'] text-white/20">Kanal</span>
                <span className="text-[9px] font-['Space_Mono'] text-[#00ff00]/50">OPEN</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
