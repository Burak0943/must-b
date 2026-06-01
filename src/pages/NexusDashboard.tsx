/**
 * NexusDashboard.tsx — Must-b Nexus Topluluk Terminali
 *
 * Revizyon: Premium dark mode (Discord/Linear tarzı)
 * ─ Arka plan : sidebar #161616 | orta #0f0f0f
 * ─ Metin     : Inter (sans-serif) genel | Space Mono yalnız ts/ID/system
 * ─ Neon yeşil: Sadece vurgular (aktif kanal, send btn, online dot, kendi mesajı)
 * ─ Mesajlar  : Rahat, havadar, balon değil Discord-satır stili
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
import { ProfileCard, type ProfileCardUser } from "@/components/ProfileCard";
import { ProfileSettingsModal } from "@/components/ProfileSettingsModal";
import { PricingModal } from "@/components/PricingModal";

// ─────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────
const C = {
  bg:        "#0f0f0f",   // orta alan
  sidebar:   "#161616",   // sol & sağ kolon
  topbar:    "#111111",   // üst çubuk
  border:    "rgba(255,255,255,0.06)",
  borderSub: "rgba(255,255,255,0.04)",
  accent:    "#22c55e",   // neon yeşil — daha soft (green-500)
  accentDim: "rgba(34,197,94,0.12)",
  accentBorder: "rgba(34,197,94,0.25)",
  textPrimary:   "rgba(255,255,255,0.90)",
  textSecondary: "rgba(255,255,255,0.50)",
  textMuted:     "rgba(255,255,255,0.25)",
  textGhost:     "rgba(255,255,255,0.12)",
} as const;

// ─────────────────────────────────────────────────────────
// Sabit veri
// ─────────────────────────────────────────────────────────

const CHANNELS = [
  { id: "nexus-terminal", label: "nexus-terminal", unread: 0 },
  { id: "showcase",       label: "showcase",       unread: 3 },
  { id: "bug-bounty",     label: "bug-bounty",     unread: 1 },
];

interface Message {
  id: string | number;
  ts: string;
  user: string;
  text: string;
  system: boolean;
  user_id?: string;
  avatar_url?: string | null;
}

const DEMO_MESSAGES: Message[] = [
  { id: 1,  ts: "21:37", user: "Root_Node",    text: "Nexus terminali online. Şifreli kanal kuruldu.",          system: false },
  { id: 2,  ts: "21:38", user: "SYSTEM",        text: "E2EE handshake tamamlandı. Oturum anahtarı üretildi.",   system: true  },
  { id: 3,  ts: "21:39", user: "Elite_0x9A",   text: "v3.1.4 güncellemesindeki swarm koordinasyonu mükemmel.",  system: false },
  { id: 4,  ts: "21:40", user: "Anon_7f3c",    text: "Bug-bounty kanalında yeni bir keşif paylaştım.",          system: false },
  { id: 5,  ts: "21:41", user: "Root_Node",    text: "Göreceğim. AI agent tetiklendi mi?",                     system: false },
  { id: 6,  ts: "21:42", user: "Elite_0x9A",   text: "Evet, must-b proxy üzerinden otomatik yanıt döndü.",     system: false },
  { id: 7,  ts: "21:43", user: "SYSTEM",        text: "Yeni node bağlandı: Shadow_Relay",                       system: true  },
  { id: 8,  ts: "21:44", user: "Shadow_Relay",  text: "Selam Nexus. Local sovereign kurulum tamam.",            system: false },
  { id: 9,  ts: "21:45", user: "Anon_7f3c",    text: "Hangi model? Ollama mı yoksa BYOK mi?",                   system: false },
  { id: 10, ts: "21:46", user: "Shadow_Relay",  text: "BYOK + air-gapped. Sıfır telemetri. 🛡️",               system: false },
];

const ACTIVE_NODES = [
  { id: "root",   name: "Root_Node",    role: "Admin",  color: "#22c55e",  ghost: false },
  { id: "elite",  name: "Elite_0x9A",  role: "Elite",  color: "#38bdf8",  ghost: false },
  { id: "anon",   name: "Anon_7f3c",   role: "Core",   color: "#a3e635",  ghost: false },
  { id: "shadow", name: "Shadow_Relay", role: "Local",  color: "#c084fc",  ghost: false },
  { id: "ghost1", name: "Node_??",     role: "—",      color: "#444444",  ghost: true  },
];

// Her kullanıcıya sabit renk ata
const USER_COLORS: Record<string, string> = {
  Root_Node:    "#22c55e",
  "Elite_0x9A": "#38bdf8",
  "Anon_7f3c":  "#a3e635",
  Shadow_Relay: "#c084fc",
};

const getUserColor = (username: string) => {
  if (USER_COLORS[username]) return USER_COLORS[username];
  const colors = ["#22c55e", "#38bdf8", "#a3e635", "#c084fc", "#f43f5e", "#fb923c", "#eab308"];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// ─────────────────────────────────────────────────────────
// E2EE Rozeti
// ─────────────────────────────────────────────────────────

function E2EEBadge() {
  return (
    <motion.div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md select-none"
      style={{
        background: C.accentDim,
        border: `1px solid ${C.accentBorder}`,
        color: C.accent,
        fontSize: 11,
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        letterSpacing: "0.08em",
      }}
      animate={{ boxShadow: ["0 0 0px rgba(34,197,94,0)", "0 0 8px rgba(34,197,94,0.2)", "0 0 0px rgba(34,197,94,0)"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: C.accent }}
        animate={{ opacity: [1, 0.25, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
      <Shield className="w-3 h-3" />
      E2EE
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// Mesaj satırı
// ─────────────────────────────────────────────────────────

function MessageRow({
  msg,
  isOwn,
  showAvatar,
  onAvatarClick,
}: {
  msg: Message;
  isOwn: boolean;
  showAvatar: boolean;
  onAvatarClick?: (userId: string, username: string, avatarUrl: string | null | undefined, e: React.MouseEvent) => void;
}) {
  if (msg.system) {
    return (
      <div className="flex items-center gap-3 my-2 select-none">
        <div className="flex-1 h-px" style={{ background: C.borderSub }} />
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            color: "rgba(34,197,94,0.5)",
            background: "rgba(34,197,94,0.05)",
            border: "1px solid rgba(34,197,94,0.1)",
          }}
        >
          ⚡ {msg.text}
        </span>
        <div className="flex-1 h-px" style={{ background: C.borderSub }} />
      </div>
    );
  }

  const userColor = isOwn ? C.accent : getUserColor(msg.user);
  const clickable = !!(onAvatarClick && msg.user_id);

  const handleAvatarClick = (e: React.MouseEvent) => {
    if (clickable) onAvatarClick!(msg.user_id!, msg.user, msg.avatar_url, e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="group flex items-start gap-3 px-4 py-1.5 rounded-lg hover:bg-white/[0.025] transition-colors"
    >
      {/* Avatar — sadece ilk mesajda */}
      <div className="w-8 shrink-0 mt-0.5">
        {showAvatar ? (
          msg.avatar_url ? (
            <img
              src={msg.avatar_url}
              alt={msg.user}
              className={`w-8 h-8 rounded-full object-cover shrink-0 ${clickable ? "cursor-pointer hover:ring-2 hover:ring-white/20 transition-all" : ""}`}
              style={{ border: `1px solid ${userColor}35` }}
              onClick={handleAvatarClick}
            />
          ) : (
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${clickable ? "cursor-pointer hover:ring-2 hover:ring-white/20 transition-all" : ""}`}
              style={{
                background: `${userColor}18`,
                border: `1px solid ${userColor}35`,
                color: userColor,
                fontFamily: "'Space Mono', monospace",
              }}
              onClick={handleAvatarClick}
            >
              {msg.user[0]}
            </div>
          )
        ) : (
          /* Hover'da saat göster */
          <span
            className="text-right text-[10px] leading-8 opacity-0 group-hover:opacity-100 transition-opacity block w-full"
            style={{ fontFamily: "'Space Mono', monospace", color: C.textGhost }}
          >
            {msg.ts}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {showAvatar && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span
              className={`text-sm font-semibold leading-none ${clickable ? "cursor-pointer hover:underline hover:underline-offset-2" : ""}`}
              style={{ fontFamily: "'Space Mono', monospace", color: userColor }}
              onClick={handleAvatarClick}
            >
              {msg.user}
              {isOwn && (
                <span className="font-normal ml-1.5" style={{ color: C.textGhost, fontSize: 10 }}>
                  (sen)
                </span>
              )}
            </span>
            <span
              className="text-[10px] leading-none"
              style={{ fontFamily: "'Space Mono', monospace", color: C.textGhost }}
            >
              {msg.ts}
            </span>
          </div>
        )}
        {/* Mesaj metni — Inter, okunabilir */}
        <p
          className="text-sm leading-relaxed break-words"
          style={{ color: C.textPrimary, fontFamily: "Inter, -apple-system, sans-serif" }}
        >
          {msg.text}
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// Ghost Protocol Input
// ─────────────────────────────────────────────────────────

function GhostInput({ onEnter }: { onEnter: (code: string) => void }) {
  const [val, setVal]         = useState("");
  const [focused, setFocused] = useState(false);
  const visible = focused || !!val;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const code = val.trim();
      if (code) {
        onEnter(code);
        setVal("");
      }
    }
  };

  return (
    <div
      className="rounded-lg px-3 py-2 transition-all duration-400"
      style={{
        opacity: visible ? 0.8 : 0.18,
        background: focused ? "rgba(255,255,255,0.04)" : "transparent",
        border: `1px solid ${focused ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`,
      }}
    >
      <div className="flex items-center gap-2">
        <Ghost className="w-3.5 h-3.5 shrink-0" style={{ color: C.textMuted }} />
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Enter Node Code..."
          className="flex-1 bg-transparent text-xs outline-none w-full"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: C.textSecondary,
            caretColor: C.accent,
          }}
        />
        {val && (
          <button onClick={() => { onEnter(val.trim()); setVal(""); }} style={{ color: C.textMuted }}>
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

  const [activeChannel, setActiveChannel] = useState(CHANNELS[0].id);
  const [messages, setMessages]           = useState<Message[]>([]);
  const [inputVal, setInputVal]           = useState("");
  const [darkNodes, setDarkNodes]         = useState<string[]>([]);

  // ── ProfileCard state ──────────────────────────────────
  const [pcUser,   setPcUser]   = useState<ProfileCardUser | null>(null);
  const [pcAnchor, setPcAnchor] = useState<DOMRect | null>(null);

  // ── Modal state'leri ───────────────────────────────────
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPricingOpen,  setIsPricingOpen]  = useState(false);

  const openProfileCard = useCallback((
    userId: string,
    username: string,
    avatarUrl: string | null | undefined,
    planLevel: string | null | undefined,
    e: React.MouseEvent,
  ) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPcUser({ userId, username, avatarUrl, planLevel, cognitiveCredits: 0 });
    setPcAnchor(rect);
  }, []);

  const closeProfileCard = useCallback(() => {
    setPcUser(null);
    setPcAnchor(null);
  }, []);

  /** ProfileSettingsModal kaydettiğinde profile state + cache'i anında güncelle */
  const handleProfileUpdated = useCallback((newNodeName: string, newAvatarUrl: string | null) => {
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, node_name: newNodeName, avatar_url: newAvatarUrl };
    });
    // profileCache'i de anlık güncelle (mevcut kullanıcının ID'si üzerinden)
    setCurrentUser((prev: any) => {
      if (prev?.id) {
        profileCache.current[prev.id] = {
          ...profileCache.current[prev.id],
          node_name:  newNodeName,
          avatar_url: newAvatarUrl,
        };
      }
      return prev; // currentUser kendisi değişmez
    });
    // Mesaj listesini de yenile ki yeni isim/avatar mesajlarda görünsün
    setMessages((prev) =>
      prev.map((msg) => {
        if (!msg.user_id) return msg;
        // Sadece güncellenen kullanıcının mesajlarını değiştir
        const cached = profileCache.current[msg.user_id];
        if (!cached) return msg;
        return {
          ...msg,
          user: cached.node_name || cached.full_name || cached.email?.split("@")[0] || msg.user,
          avatar_url: cached.avatar_url ?? msg.avatar_url,
        };
      })
    );
  }, []);
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<{
    id: string;
    email: string;
    node_name: string | null;
    avatar_url: string | null;
    plan_level: string | null;
  } | null>(null);

  // Profile Cache to prevent redundant profile fetches
  const profileCache = useRef<Record<string, {
    node_name: string | null;
    avatar_url: string | null;
    full_name: string | null;
    email: string | null;
  }>>({});

  const nodeName = profile?.node_name || "Root_Node";

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  const scrollBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollBottom(); }, [messages, scrollBottom]);

  // Auth check & load profile
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      
      const user = session.user;
      setCurrentUser(user);
      
      // Fetch user's profile
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("id, email, node_name, avatar_url, plan_level, full_name, active_plan")
        .eq("id", user.id)
        .single();
        
      if (!error && profileData) {
        const mappedName = profileData.node_name || profileData.full_name || user.email?.split("@")[0] || "Anon_Node";
        setProfile({
          id: profileData.id,
          email: profileData.email,
          node_name: mappedName,
          avatar_url: profileData.avatar_url,
          plan_level: profileData.plan_level || profileData.active_plan || "Free",
        });

        // Cache the current user's profile immediately
        profileCache.current[user.id] = {
          node_name: mappedName,
          avatar_url: profileData.avatar_url,
          full_name: profileData.full_name,
          email: profileData.email,
        };
      } else {
        // Fallback profile if profile row is missing or error
        const mappedName = user.email?.split("@")[0] || "Anon_Node";
        setProfile({
          id: user.id,
          email: user.email || "",
          node_name: mappedName,
          avatar_url: null,
          plan_level: "Free",
        });

        profileCache.current[user.id] = {
          node_name: mappedName,
          avatar_url: null,
          full_name: null,
          email: user.email || "",
        };
      }
    };
    
    checkUser();
  }, [navigate]);

  // Fetch messages using Frontend Composition (Manual mapping)
  const fetchMessages = useCallback(async (channelId: string) => {
    try {
      // 1. Fetch raw messages without relational join
      const { data: rawMessages, error: msgError } = await supabase
        .from("nexus_messages")
        .select("*")
        .eq("channel_id", channelId)
        .order("created_at", { ascending: true });

      if (msgError) {
        console.error("Error fetching messages:", msgError.message);
        return;
      }

      if (!rawMessages) return;

      // 2. Collect unique user_ids of senders
      const userIds = Array.from(
        new Set(rawMessages.map((m: any) => m.user_id).filter(Boolean))
      ) as string[];

      // 3. Find user_ids that are not yet in the profile cache
      const missingUserIds = userIds.filter((id) => !profileCache.current[id]);

      // 4. Fetch missing profiles in bulk
      if (missingUserIds.length > 0) {
        const { data: fetchedProfiles, error: profError } = await supabase
          .from("profiles")
          .select("id, node_name, avatar_url, full_name, email")
          .in("id", missingUserIds);

        if (!profError && fetchedProfiles) {
          fetchedProfiles.forEach((p: any) => {
            profileCache.current[p.id] = {
              node_name: p.node_name,
              avatar_url: p.avatar_url,
              full_name: p.full_name,
              email: p.email,
            };
          });
        }
      }

      // 5. Compose / Map raw messages with the profiles stored in cache
      const mapped = rawMessages.map((msg: any) => {
        const tsDate = new Date(msg.created_at);
        const ts = isNaN(tsDate.getTime())
          ? "00:00"
          : `${String(tsDate.getHours()).padStart(2, "0")}:${String(tsDate.getMinutes()).padStart(2, "0")}`;
        
        const prof = msg.user_id ? profileCache.current[msg.user_id] : null;
        const displayUser = prof?.node_name || prof?.full_name || prof?.email?.split("@")[0] || "Node_??";
        
        return {
          id: msg.id,
          ts,
          user: displayUser,
          text: msg.content,
          system: !!msg.is_system,
          user_id: msg.user_id,
          avatar_url: prof?.avatar_url || null,
        };
      });

      setMessages(mapped);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  }, []);

  // Subscribe to real-time events & fetch messages on channel change
  useEffect(() => {
    if (!activeChannel) return;
    
    fetchMessages(activeChannel);
    
    const channel = supabase
      .channel(`nexus_messages_${activeChannel}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "nexus_messages",
          filter: `channel_id=eq.${activeChannel}`,
        },
        async (payload) => {
          const newMsg = payload.new;
          const senderId = newMsg.user_id;

          if (senderId && !profileCache.current[senderId]) {
            // Check if sender is the current user first to reuse
            if (profile && senderId === profile.id) {
              profileCache.current[senderId] = {
                node_name: profile.node_name,
                avatar_url: profile.avatar_url,
                full_name: null,
                email: profile.email,
              };
            } else {
              // Fetch missing sender profile from database
              const { data } = await supabase
                .from("profiles")
                .select("id, node_name, avatar_url, full_name, email")
                .eq("id", senderId)
                .single();
              
              if (data) {
                profileCache.current[senderId] = {
                  node_name: data.node_name,
                  avatar_url: data.avatar_url,
                  full_name: data.full_name,
                  email: data.email,
                };
              }
            }
          }
          
          const tsDate = new Date(newMsg.created_at);
          const ts = isNaN(tsDate.getTime())
            ? "00:00"
            : `${String(tsDate.getHours()).padStart(2, "0")}:${String(tsDate.getMinutes()).padStart(2, "0")}`;
            
          const prof = senderId ? profileCache.current[senderId] : null;
          const displayUser = prof?.node_name || prof?.full_name || prof?.email?.split("@")[0] || "Node_??";

          const mappedMsg: Message = {
            id: newMsg.id,
            ts,
            user: displayUser,
            text: newMsg.content,
            system: !!newMsg.is_system,
            user_id: senderId,
            avatar_url: prof?.avatar_url || null,
          };
          
          setMessages((prev) => {
            if (prev.some((m) => m.id === mappedMsg.id)) return prev;
            return [...prev, mappedMsg];
          });
          
          setTimeout(scrollBottom, 100);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChannel, profile, fetchMessages, scrollBottom]);

  // Insert message into database
  const sendMessage = useCallback(async () => {
    const text = inputVal.trim();
    if (!text || !profile) return;
    
    setInputVal("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    
    try {
      const { error } = await supabase
        .from("nexus_messages")
        .insert({
          channel_id: activeChannel,
          user_id: profile.id,
          content: text
        });
        
      if (error) {
        console.error("Error inserting message:", error.message);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }, [inputVal, profile, activeChannel]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleEnterDarkNode = useCallback((code: string) => {
    setDarkNodes((prev) => {
      if (prev.includes(code)) return prev;
      return [...prev, code];
    });
    setActiveChannel(code);
  }, []);

  const activeLabel = CHANNELS.find((c) => c.id === activeChannel)?.label ?? activeChannel;

  // Aynı kullanıcının art arda mesajlarını grupla — sadece ilk satırda avatar/isim göster
  const messagesWithGroup = messages.map((msg, i) => ({
    ...msg,
    showAvatar: msg.system
      ? false
      : i === 0 || messages[i - 1].user !== msg.user || messages[i - 1].system,
  }));

  const dynamicActiveNodes = ACTIVE_NODES.map((node) => {
    if (node.id === "root") {
      return {
        ...node,
        name: nodeName,
        role: profile?.plan_level ? `${profile.plan_level} Node` : "Admin",
        color: getUserColor(nodeName),
      };
    }
    return {
      ...node,
      color: getUserColor(node.name),
    };
  });

  // ─── Render ─────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

        /* Subtle scrollbar */
        .nx-scroll::-webkit-scrollbar       { width: 3px; }
        .nx-scroll::-webkit-scrollbar-track { background: transparent; }
        .nx-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        .nx-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }

        @keyframes nd-dot {
          0%,100% { opacity:1; } 50% { opacity:0.25; }
        }
        .nd-dot { animation: nd-dot 2.8s ease-in-out infinite; }
      `}</style>

      <div
        className="h-screen w-screen overflow-hidden flex flex-col"
        style={{ background: C.bg, fontFamily: "Inter, -apple-system, sans-serif" }}
      >

        {/* ═══════════════ TOP BAR ═══════════════ */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0 z-30"
          style={{ background: C.topbar, borderBottom: `1px solid ${C.border}` }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: C.accentDim, border: `1px solid ${C.accentBorder}` }}
            >
              <Terminal className="w-3.5 h-3.5" style={{ color: C.accent }} />
            </div>
            <span className="text-sm font-semibold" style={{ color: C.textPrimary }}>
              Must-b Nexus
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{
                fontFamily: "'Space Mono', monospace",
                background: "rgba(255,255,255,0.05)",
                color: C.textMuted,
                border: `1px solid ${C.borderSub}`,
              }}
            >
              v3.1.4
            </span>
          </div>

          {/* Orta — kanal */}
          <div className="flex items-center gap-1.5" style={{ color: C.textMuted }}>
            {darkNodes.includes(activeChannel) ? (
              <Lock className="w-3.5 h-3.5 text-red-500/80" style={{ color: C.accent }} />
            ) : (
              <Hash className="w-3.5 h-3.5" />
            )}
            <span className="text-sm" style={{ color: C.textSecondary }}>{activeLabel}</span>
          </div>

          {/* Sağ */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <motion.span
                className="w-2 h-2 rounded-full"
                style={{ background: C.accent }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span
                className="text-xs font-medium"
                style={{ fontFamily: "'Space Mono', monospace", color: C.accent }}
              >
                {nodeName}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs transition-colors"
              style={{ color: C.textMuted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
            >
              <LogOut className="w-3.5 h-3.5" />
              Çıkış
            </button>
          </div>
        </div>

        {/* ═══════════════ 3 KOLON ═══════════════ */}
        <div className="flex flex-1 min-h-0">

          {/* ── SOL SİDEBAR ── */}
          <div
            className="w-60 shrink-0 flex flex-col"
            style={{ background: C.sidebar, borderRight: `1px solid ${C.border}` }}
          >
            {/* Kullanıcı profil */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 shrink-0"
              style={{ borderBottom: `1px solid ${C.borderSub}` }}
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={nodeName}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                  style={{ border: `1.5px solid ${getUserColor(nodeName)}40` }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{
                    background: `${getUserColor(nodeName)}18`,
                    border: `1.5px solid ${getUserColor(nodeName)}40`,
                    color: getUserColor(nodeName),
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {nodeName[0]}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: C.textPrimary }}>
                  {nodeName}
                </p>
                <p className="text-[10px] font-medium tracking-wide" style={{ color: C.textMuted }}>
                  {profile?.plan_level ? `${profile.plan_level} Node` : "Admin Node"}
                </p>
              </div>
            </div>

            {/* Kanallar */}
            <div className="flex-1 overflow-y-auto nx-scroll px-3 py-4">
              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-2 px-2"
                style={{ color: C.textGhost, fontFamily: "'Space Mono', monospace" }}
              >
                Kanallar
              </p>

              <div className="space-y-0.5">
                {CHANNELS.map((ch) => {
                  const isActive = ch.id === activeChannel;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChannel(ch.id)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-all duration-150"
                      style={{
                        background: isActive ? C.accentDim : "transparent",
                        border: isActive ? `1px solid ${C.accentBorder}` : "1px solid transparent",
                      }}
                    >
                      <Hash
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: isActive ? C.accent : C.textMuted }}
                      />
                      <span
                        className="text-sm flex-1 truncate"
                        style={{
                          color: isActive ? C.accent : C.textSecondary,
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {ch.label}
                      </span>
                      {ch.unread > 0 && !isActive && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                          style={{ background: C.accentDim, color: C.accent, border: `1px solid ${C.accentBorder}` }}
                        >
                          {ch.unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Karanlık Odalar */}
              {darkNodes.length > 0 && (
                <>
                  <div className="my-5 h-px mx-2" style={{ background: C.borderSub }} />
                  <p
                    className="text-[10px] font-semibold uppercase tracking-widest mb-2 px-2"
                    style={{ color: C.textGhost, fontFamily: "'Space Mono', monospace" }}
                  >
                    Karanlık Odalar
                  </p>
                  <div className="space-y-0.5">
                    {darkNodes.map((code) => {
                      const isActive = code === activeChannel;
                      return (
                        <button
                          key={code}
                          onClick={() => setActiveChannel(code)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-all duration-150"
                          style={{
                            background: isActive ? C.accentDim : "transparent",
                            border: isActive ? `1px solid ${C.accentBorder}` : "1px solid transparent",
                          }}
                        >
                          <Lock
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: isActive ? C.accent : "rgba(239, 68, 68, 0.6)" }}
                          />
                          <span
                            className="text-sm flex-1 truncate font-mono tracking-wider"
                            style={{
                              color: isActive ? C.accent : C.textSecondary,
                              fontWeight: isActive ? 600 : 400,
                            }}
                          >
                            {code}
                          </span>
                          <span className="text-[10px]" style={{ color: C.textGhost }}>
                            🔒
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Divider */}
              <div className="my-5 h-px mx-2" style={{ background: C.borderSub }} />

              {/* Ghost Protocol */}
              <div className="flex items-center gap-1.5 px-2 mb-2.5">
                <Radio className="w-3 h-3" style={{ color: C.textGhost }} />
                <p
                  className="text-[10px] font-semibold tracking-widest uppercase"
                  style={{ fontFamily: "'Space Mono', monospace", color: C.textGhost }}
                >
                  Ghost Protocol
                </p>
              </div>
              <GhostInput onEnter={handleEnterDarkNode} />
            </div>

            {/* Alt kilit */}
            <div
              className="px-4 py-3 shrink-0 flex items-center gap-1.5"
              style={{ borderTop: `1px solid ${C.borderSub}` }}
            >
              <Lock className="w-3 h-3" style={{ color: C.textGhost }} />
              <span
                className="text-[10px]"
                style={{ fontFamily: "'Space Mono', monospace", color: C.textGhost }}
              >
                E2EE · AES-256-GCM
              </span>
            </div>
          </div>

          {/* ── ORTA ANA ALAN ── */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0" style={{ background: C.bg }}>

            {/* Kanal header */}
            <div
              className="flex items-center justify-between px-5 py-3 shrink-0"
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <div className="flex items-center gap-2.5">
                {darkNodes.includes(activeChannel) ? (
                  <Lock className="w-4 h-4 text-red-500/80" style={{ color: C.accent }} />
                ) : (
                  <Hash className="w-4 h-4" style={{ color: C.accent }} />
                )}
                <span className="text-sm font-semibold" style={{ color: C.textPrimary }}>
                  {activeLabel}
                </span>
                <span className="text-xs" style={{ color: C.textMuted }}>
                  — uçtan uca şifreli
                </span>
              </div>
              <E2EEBadge />
            </div>

            {/* Mesajlar */}
            <div className="flex-1 overflow-y-auto nx-scroll py-4">
              {/* Kanal başlangıç notu */}
              <div className="flex items-center gap-3 mx-4 mb-6">
                <div className="flex-1 h-px" style={{ background: C.borderSub }} />
                <span
                  className="text-[10px] px-2"
                  style={{ fontFamily: "'Space Mono', monospace", color: C.textGhost }}
                >
                  #{activeLabel} başlangıcı
                </span>
                <div className="flex-1 h-px" style={{ background: C.borderSub }} />
              </div>

              <AnimatePresence initial={false}>
                {messagesWithGroup.map((msg) => (
                  <MessageRow
                    key={msg.id}
                    msg={msg}
                    isOwn={msg.user === nodeName}
                    showAvatar={msg.showAvatar}
                    onAvatarClick={(userId, username, avatarUrl, e) => {
                      // plan_level'i profileCache'den almaya çalış
                      // (fetchMessages sırasında plan_level cache'e eklenmemiştir;
                      //  basit yaklaşım: kendi profiliyse profile state'inden al)
                      const planLevel =
                        profile && userId === profile.id
                          ? profile.plan_level
                          : null; // diğerleri için şimdilik null (Free görünür)
                      openProfileCard(userId, username, avatarUrl, planLevel, e);
                    }}
                  />
                ))}
              </AnimatePresence>

              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Mesaj yazma kutusu */}
            <div className="px-4 pb-4 pt-2 shrink-0">
              <div
                className="flex items-end gap-2 rounded-xl px-3 py-2.5 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${C.border}`,
                }}
              >
                {/* Dosya ekle */}
                <button
                  className="p-1 shrink-0 self-end mb-0.5 rounded transition-colors"
                  style={{ color: C.textMuted }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.textSecondary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}
                  title="Dosya / Kod ekle"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={`#${activeLabel} kanalına mesaj yaz…`}
                  className="flex-1 bg-transparent text-sm outline-none resize-none min-h-[24px] max-h-[120px] leading-relaxed"
                  style={{
                    fontFamily: "Inter, -apple-system, sans-serif",
                    color: C.textPrimary,
                    caretColor: C.accent,
                  }}
                />

                {/* Gönder */}
                <motion.button
                  onClick={sendMessage}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  disabled={!inputVal.trim()}
                  className="p-1.5 rounded-lg shrink-0 self-end mb-0.5 transition-all duration-200"
                  style={{
                    background: inputVal.trim() ? C.accentDim : "transparent",
                    border: `1px solid ${inputVal.trim() ? C.accentBorder : C.borderSub}`,
                    color: inputVal.trim() ? C.accent : C.textGhost,
                    boxShadow: inputVal.trim() ? `0 0 12px rgba(34,197,94,0.15)` : "none",
                  }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>

              <p
                className="text-[10px] mt-1.5 px-1"
                style={{ fontFamily: "'Space Mono', monospace", color: C.textGhost }}
              >
                Enter → gönder · Shift+Enter → satır
              </p>
            </div>
          </div>

          {/* ── SAĞ NODE PANELİ ── */}
          <div
            className="w-56 shrink-0 flex flex-col"
            style={{ background: C.sidebar, borderLeft: `1px solid ${C.border}` }}
          >
            {/* Başlık */}
            <div
              className="px-4 py-3.5 shrink-0 flex items-center gap-2"
              style={{ borderBottom: `1px solid ${C.borderSub}` }}
            >
              <Wifi className="w-3.5 h-3.5" style={{ color: C.textMuted }} />
              <span className="text-xs font-semibold flex-1" style={{ color: C.textSecondary }}>
                Aktif Node'lar
              </span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: C.accentDim, color: C.accent, border: `1px solid ${C.accentBorder}` }}
              >
                {ACTIVE_NODES.length}
              </span>
            </div>

            {/* Node listesi */}
            <div className="flex-1 overflow-y-auto nx-scroll px-3 py-3 space-y-0.5">
              {dynamicActiveNodes.map((node, idx) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center gap-2.5 px-2 py-2 rounded-md transition-colors ${node.ghost ? "cursor-default" : "cursor-pointer"}`}
                  style={{ opacity: node.ghost ? 0.35 : 1 }}
                  onMouseEnter={(e) => { if (!node.ghost) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                  onClick={(e) => {
                    if (node.ghost) return;
                    // Aktif kullanıcı (root) için profile state'inden plan al
                    const isCurrentUser = node.id === "root";
                    const planLevel = isCurrentUser ? profile?.plan_level : null;
                    const userId    = isCurrentUser ? (profile?.id ?? node.id) : node.id;
                    openProfileCard(userId, node.name, null, planLevel, e);
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: `${node.color}15`,
                      border: `1px solid ${node.color}30`,
                      color: node.color,
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {node.name[0]}
                  </div>

                  {/* İsim & Rol */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: node.ghost ? C.textGhost : C.textPrimary }}
                    >
                      {node.name}
                    </p>
                    <p
                      className="text-[10px]"
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        color: node.ghost ? C.textGhost : `${node.color}90`,
                      }}
                    >
                      {node.role}
                    </p>
                  </div>

                  {/* Online noktası */}
                  <div
                    className="nd-dot w-2 h-2 rounded-full shrink-0"
                    style={{
                      background: node.ghost ? C.textGhost : node.color,
                      boxShadow: node.ghost ? "none" : `0 0 5px ${node.color}`,
                      animationDelay: `${idx * 0.5}s`,
                    }}
                  />
                </motion.div>
              ))}

              {/* Alt not */}
              <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${C.borderSub}` }}>
                <div className="flex items-center gap-1.5 px-2">
                  <AlertTriangle className="w-3 h-3 text-yellow-600/60" />
                  <span className="text-[10px]" style={{ color: C.textGhost }}>
                    Kimlikler şifreli
                  </span>
                </div>
              </div>
            </div>

            {/* Bağlantı istatistiği */}
            <div
              className="px-4 py-3.5 shrink-0 space-y-2"
              style={{ borderTop: `1px solid ${C.borderSub}` }}
            >
              {[
                { label: "Gecikme",   value: "12 ms"   },
                { label: "Şifreleme", value: "AES-256" },
                { label: "Kanal",     value: "OPEN"    },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: C.textMuted }}>{label}</span>
                  <span
                    className="text-[10px] font-medium"
                    style={{ fontFamily: "'Space Mono', monospace", color: C.accent }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>{/* /3 kolon */}
      </div>

      {/* ── ProfileCard Overlay ── */}
      <ProfileCard
        targetUser={pcUser}
        currentUserId={currentUser?.id ?? null}
        anchorRect={pcAnchor}
        onClose={closeProfileCard}
        onEditClick={() => setIsSettingsOpen(true)}
        onUpgradeClick={() => setIsPricingOpen(true)}
      />

      {/* ── Profile Settings Modal (z-99998) ── */}
      <ProfileSettingsModal
        isOpen={isSettingsOpen}
        userId={currentUser?.id ?? null}
        initialNodeName={profile?.node_name ?? ""}
        initialAvatarUrl={profile?.avatar_url ?? null}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={handleProfileUpdated}
      />

      {/* ── Pricing Modal (z-99999) ── */}
      <PricingModal
        isOpen={isPricingOpen}
        currentPlanLevel={profile?.plan_level ?? null}
        onClose={() => setIsPricingOpen(false)}
      />
    </>
  );
}
