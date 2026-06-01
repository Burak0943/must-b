/**
 * NexusDashboard.tsx — Must-b Premium Community Platform
 *
 * Design System v2 — "Must-b Premium"
 * ─ Palette : bg #0E1116 | surface #161B22 | border #30363D
 * ─ Text    : primary #E6EDF3 | secondary #8B949E | muted #484F58
 * ─ Accent  : Must-b Blue #3B82F6
 * ─ Font    : Inter / system-ui sans-serif everywhere
 * ─ Messages: Twitter/X + Linear hybrid — avatar left, name+time right
 */

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Hash, Lock, Plus, Send, Ghost,
  Shield, Wifi, LogOut, ChevronRight,
  MessageSquare, Radio, BadgeCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ProfileCard, type ProfileCardUser } from "@/components/ProfileCard";
import { ProfileSettingsModal } from "@/components/ProfileSettingsModal";
import { PricingModal } from "@/components/PricingModal";

// ─────────────────────────────────────────────────────────
// Design tokens — Must-b Premium
// ─────────────────────────────────────────────────────────
const C = {
  bg:          "#0E1116",
  surface:     "#161B22",
  surfaceHov:  "#1C2128",
  border:      "#30363D",
  borderSub:   "#21262D",
  accent:      "#3B82F6",
  accentDim:   "rgba(59,130,246,0.10)",
  accentBorder:"rgba(59,130,246,0.25)",
  textPrimary: "#E6EDF3",
  textSecondary:"#8B949E",
  textMuted:   "#484F58",
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
  { id: "root",   name: "Root_Node",    role: "Admin",  ghost: false },
  { id: "elite",  name: "Elite_0x9A",  role: "Elite",  ghost: false },
  { id: "anon",   name: "Anon_7f3c",   role: "Core",   ghost: false },
  { id: "shadow", name: "Shadow_Relay", role: "Local",  ghost: false },
  { id: "ghost1", name: "Node_??",     role: "—",      ghost: true  },
];

// Kullanıcıya sabit, muted avatar renk atama
const AVATAR_COLORS = [
  "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#06B6D4",
];
const getAvatarColor = (username: string) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// ─────────────────────────────────────────────────────────
// E2EE Rozeti — zarif, minimal
// ─────────────────────────────────────────────────────────

const E2EEBadge = memo(function E2EEBadge() {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg select-none"
      style={{
        background: C.accentDim,
        border: `1px solid ${C.accentBorder}`,
        color: C.accent,
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      <motion.span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: C.accent }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <Shield className="w-3 h-3" />
      E2EE
    </div>
  );
});

// ─────────────────────────────────────────────────────────
// MessageRow — Twitter/Linear hybrid style
// ─────────────────────────────────────────────────────────

const MessageRow = memo(function MessageRow({
  msg,
  isOwn,
  showAvatar: _showAvatar,
  onAvatarClick,
}: {
  msg: Message;
  isOwn: boolean;
  showAvatar: boolean;
  onAvatarClick?: (userId: string, username: string, avatarUrl: string | null | undefined, e: React.MouseEvent) => void;
}) {
  if (msg.system) {
    return (
      <div className="flex items-center gap-3 mx-4 my-4 select-none">
        <div className="flex-1 h-px bg-[#30363D]" />
        <span
          className="text-xs px-3 py-1 rounded-full text-[#8B949E] bg-[#161B22] border border-[#30363D]"
        >
          {msg.text}
        </span>
        <div className="flex-1 h-px bg-[#30363D]" />
      </div>
    );
  }

  const avatarColor = getAvatarColor(msg.user);
  const clickable = !!(onAvatarClick && msg.user_id);

  const handleAvatarClick = (e: React.MouseEvent) => {
    if (clickable) onAvatarClick!(msg.user_id!, msg.user, msg.avatar_url, e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="flex gap-4 mb-6 hover:bg-[#161B22]/50 p-2 rounded-xl transition-colors"
    >
      {/* Sol taraf: Avatar */}
      <div className="flex-shrink-0">
        {msg.avatar_url ? (
          <img
            src={msg.avatar_url}
            alt={msg.user}
            className={`w-10 h-10 rounded-full object-cover flex-shrink-0 ${clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
            onClick={handleAvatarClick}
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
            style={{
              background: `${avatarColor}18`,
              border: `2px solid #30363D`,
              color: avatarColor,
            }}
            onClick={handleAvatarClick}
          >
            {msg.user[0]?.toUpperCase()}
          </div>
        )}
      </div>

      {/* Sağ taraf kapsayıcı */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Üst Satır (İsim + Saat) */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`font-semibold text-[#E6EDF3] text-[14px] ${clickable ? "cursor-pointer hover:underline hover:underline-offset-2" : ""}`}
            onClick={handleAvatarClick}
          >
            {msg.user}
          </span>
          {isOwn && (
            <span className="text-[11px] text-[#8B949E]">
              (sen)
            </span>
          )}
          <span className="text-xs text-[#8B949E]">
            {msg.ts}
          </span>
        </div>

        {/* Alt Satır (Mesaj Metni) */}
        <p className="text-[15px] leading-relaxed text-[#E6EDF3] whitespace-pre-wrap break-words">
          {msg.text}
        </p>
      </div>
    </motion.div>
  );
});

// ─────────────────────────────────────────────────────────
// Ghost Protocol Input — minimal, clean
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
      className="rounded-xl px-3 py-2 transition-all duration-200"
      style={{
        opacity: visible ? 1 : 0.4,
        background: focused ? C.surfaceHov : "transparent",
        border: `1px solid ${focused ? C.border : C.borderSub}`,
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
          placeholder="Enter room code..."
          className="flex-1 bg-transparent text-xs outline-none w-full font-mono"
          style={{
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
// MessageInput — iMessage/Telegram style, isolated state
// ─────────────────────────────────────────────────────────

const MessageInput = memo(function MessageInput({ placeholder, onSend }: MessageInputProps) {
  const [val, setVal]   = useState("");
  const taRef           = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const text = val.trim();
    if (!text) return;
    onSend(text);
    setVal("");
    if (taRef.current) {
      taRef.current.style.height = "auto";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVal(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const hasText = val.trim().length > 0;

  return (
    <div className="bg-[#0E1116] p-4 border-t border-[#30363D] shrink-0">
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl flex items-end gap-2 p-2 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
        {/* Dosya ekle */}
        <button
          className="p-2 shrink-0 self-end rounded-xl transition-colors text-[#8B949E] hover:bg-[#30363D]/20 hover:text-[#E6EDF3]"
          title="Dosya / Kod ekle"
        >
          <Plus className="w-4 h-4" />
        </button>

        <textarea
          ref={taRef}
          rows={1}
          value={val}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[15px] text-[#E6EDF3] caret-blue-500 placeholder:text-[#8B949E] outline-none focus:outline-none resize-none min-h-[24px] max-h-[120px] leading-relaxed py-1"
        />

        <button
          onClick={handleSend}
          disabled={!hasText}
          className={`p-2 rounded-xl shrink-0 self-end transition-all duration-150 ${
            hasText
              ? "text-blue-500 hover:bg-blue-500/10 cursor-pointer"
              : "text-[#8B949E] cursor-not-allowed opacity-50"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[11px] mt-1.5 px-2 text-[#8B949E]">
        Enter → gönder · Shift+Enter → satır
      </p>
    </div>
  );
});

// ─────────────────────────────────────────────────────────
// Ana Bileşen
// ─────────────────────────────────────────────────────────

export default function NexusDashboard() {
  const navigate = useNavigate();

  const [activeChannel, setActiveChannel] = useState(CHANNELS[0].id);
  const [messages, setMessages]           = useState<Message[]>([]);
  // inputVal ARTIK BURAYA TAŞINDI → MessageInput kendi state'ini tutar
  // NexusDashboard sadece "gönder" sinyalini ref aracılığıyla alır
  const [darkNodes, setDarkNodes]         = useState<string[]>([]);

  // sendMessage'e dışarıdan erişim için ref köprüsü
  const sendMessageRef = useRef<((text: string) => Promise<void>) | null>(null);

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
  // inputRef ve textareaRef artık MessageInput bileşeni içinde yönetiliyor

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
  // Profile ve activeChannel ref'leri — closure stale olmadan erişim
  const profileRef       = useRef(profile);
  const activeChannelRef = useRef(activeChannel);
  useEffect(() => { profileRef.current = profile; }, [profile]);
  useEffect(() => { activeChannelRef.current = activeChannel; }, [activeChannel]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    const prof    = profileRef.current;
    const channel = activeChannelRef.current;
    if (!trimmed || !prof) return;

    try {
      const { error } = await supabase
        .from("nexus_messages")
        .insert({
          channel_id: channel,
          user_id:    prof.id,
          content:    trimmed,
        });
      if (error) console.error("Error inserting message:", error.message);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }, []); // bağımlılık yok → ref'lerden okur, hiç yeniden oluşmaz

  // Ref köprüsünü güncelle — MessageInput buna erişecek
  useEffect(() => { sendMessageRef.current = sendMessage; }, [sendMessage]);

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
        role: profile?.plan_level ? `${profile.plan_level}` : "Admin",
      };
    }
    return node;
  });

  // ─── Render ─────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        /* Subtle scrollbar */
        .nx-scroll::-webkit-scrollbar       { width: 4px; }
        .nx-scroll::-webkit-scrollbar-track { background: transparent; }
        .nx-scroll::-webkit-scrollbar-thumb { background: ${C.borderSub}; border-radius: 4px; }
        .nx-scroll::-webkit-scrollbar-thumb:hover { background: ${C.border}; }
      `}</style>

      <div
        className="h-screen w-screen overflow-hidden flex flex-col"
        style={{ background: C.bg, fontFamily: "Inter, -apple-system, system-ui, sans-serif", color: C.textPrimary }}
      >

        {/* ═══════════════ TOP BAR ═══════════════ */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0 z-30"
          style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: C.accentDim, border: `1px solid ${C.accentBorder}` }}
            >
              <MessageSquare className="w-4 h-4" style={{ color: C.accent }} />
            </div>
            <span className="text-[15px] font-semibold" style={{ color: C.textPrimary }}>
              Must-b
            </span>
            <span
              className="text-[11px] px-2 py-0.5 rounded-md font-medium"
              style={{
                background: C.accentDim,
                color: C.accent,
                border: `1px solid ${C.accentBorder}`,
              }}
            >
              v3.1.4
            </span>
          </div>

          {/* Orta — kanal */}
          <div className="flex items-center gap-1.5" style={{ color: C.textSecondary }}>
            {darkNodes.includes(activeChannel) ? (
              <Lock className="w-3.5 h-3.5" style={{ color: C.accent }} />
            ) : (
              <Hash className="w-3.5 h-3.5" />
            )}
            <span className="text-sm font-medium">{activeLabel}</span>
          </div>

          {/* Sağ */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "#22C55E" }} />
              <span className="text-sm font-medium" style={{ color: C.textPrimary }}>
                {nodeName}
              </span>
              {profile?.plan_level && profile.plan_level !== "Free" && (
                <BadgeCheck className="w-4 h-4" style={{ color: C.accent }} />
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs transition-colors rounded-lg px-2 py-1"
              style={{ color: C.textMuted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#F87171";
                e.currentTarget.style.background = "rgba(248,113,113,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = C.textMuted;
                e.currentTarget.style.background = "transparent";
              }}
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
            style={{ background: C.surface, borderRight: `1px solid ${C.border}` }}
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
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                  style={{ border: `2px solid ${C.border}` }}
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                  style={{
                    background: `${getAvatarColor(nodeName)}18`,
                    border: `2px solid ${C.border}`,
                    color: getAvatarColor(nodeName),
                  }}
                >
                  {nodeName[0]}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold truncate" style={{ color: C.textPrimary }}>
                    {nodeName}
                  </p>
                  {profile?.plan_level && profile.plan_level !== "Free" && (
                    <BadgeCheck className="w-3.5 h-3.5 shrink-0" style={{ color: C.accent }} />
                  )}
                </div>
                <p className="text-[11px] font-medium" style={{ color: C.textSecondary }}>
                  {profile?.plan_level || "Free"} Plan
                </p>
              </div>
            </div>

            {/* Kanallar */}
            <div className="flex-1 overflow-y-auto nx-scroll px-3 py-4">
              <p
                className="text-[11px] font-semibold uppercase tracking-wider mb-2 px-2"
                style={{ color: C.textMuted }}
              >
                Channels
              </p>

              <div className="space-y-0.5">
                {CHANNELS.map((ch) => {
                  const isActive = ch.id === activeChannel;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChannel(ch.id)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150"
                      style={{
                        background: isActive ? C.accentDim : "transparent",
                        border: isActive ? `1px solid ${C.accentBorder}` : "1px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = C.surfaceHov;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <Hash
                        className="w-4 h-4 shrink-0"
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
                          style={{ background: C.accent, color: "#ffffff" }}
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
                  <div className="my-4 h-px mx-2" style={{ background: C.borderSub }} />
                  <p
                    className="text-[11px] font-semibold uppercase tracking-wider mb-2 px-2"
                    style={{ color: C.textMuted }}
                  >
                    Private Rooms
                  </p>
                  <div className="space-y-0.5">
                    {darkNodes.map((code) => {
                      const isActive = code === activeChannel;
                      return (
                        <button
                          key={code}
                          onClick={() => setActiveChannel(code)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150"
                          style={{
                            background: isActive ? C.accentDim : "transparent",
                            border: isActive ? `1px solid ${C.accentBorder}` : "1px solid transparent",
                          }}
                        >
                          <Lock
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: isActive ? C.accent : C.textMuted }}
                          />
                          <span
                            className="text-sm flex-1 truncate font-mono"
                            style={{
                              color: isActive ? C.accent : C.textSecondary,
                              fontWeight: isActive ? 600 : 400,
                            }}
                          >
                            {code}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Divider */}
              <div className="my-4 h-px mx-2" style={{ background: C.borderSub }} />

              {/* Ghost Protocol */}
              <div className="flex items-center gap-1.5 px-2 mb-2.5">
                <Radio className="w-3 h-3" style={{ color: C.textMuted }} />
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.textMuted }}>
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
              <Shield className="w-3 h-3" style={{ color: C.textMuted }} />
              <span className="text-[11px]" style={{ color: C.textMuted }}>
                End-to-end encrypted
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
                  <Lock className="w-4 h-4" style={{ color: C.accent }} />
                ) : (
                  <Hash className="w-4 h-4" style={{ color: C.accent }} />
                )}
                <span className="text-[15px] font-semibold" style={{ color: C.textPrimary }}>
                  {activeLabel}
                </span>
                <span className="text-xs" style={{ color: C.textMuted }}>
                  — encrypted channel
                </span>
              </div>
              <E2EEBadge />
            </div>

            {/* Mesajlar */}
            <div className="flex-1 overflow-y-auto nx-scroll py-4">
              {/* Kanal başlangıç notu */}
              <div className="flex items-center gap-3 mx-5 mb-6">
                <div className="flex-1 h-px" style={{ background: C.borderSub }} />
                <span className="text-[11px] px-3" style={{ color: C.textMuted }}>
                  #{activeLabel} — beginning of conversation
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

            {/* Mesaj yazma kutusu — izole bileşen */}
            <MessageInput
              placeholder={`Message #${activeLabel}…`}
              onSend={(text) => sendMessageRef.current?.(text)}
            />
          </div>

          {/* ── SAĞ NODE PANELİ ── */}
          <div
            className="w-56 shrink-0 flex flex-col"
            style={{ background: C.surface, borderLeft: `1px solid ${C.border}` }}
          >
            {/* Başlık */}
            <div
              className="px-4 py-3.5 shrink-0 flex items-center gap-2"
              style={{ borderBottom: `1px solid ${C.borderSub}` }}
            >
              <Wifi className="w-3.5 h-3.5" style={{ color: C.textMuted }} />
              <span className="text-xs font-semibold flex-1" style={{ color: C.textSecondary }}>
                Online Members
              </span>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: C.accentDim, color: C.accent }}
              >
                {ACTIVE_NODES.length}
              </span>
            </div>

            {/* Node listesi */}
            <div className="flex-1 overflow-y-auto nx-scroll px-3 py-3 space-y-0.5">
              {dynamicActiveNodes.map((node, idx) => {
                const nodeColor = getAvatarColor(node.name);
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors ${node.ghost ? "cursor-default" : "cursor-pointer"}`}
                    style={{ opacity: node.ghost ? 0.35 : 1 }}
                    onMouseEnter={(e) => { if (!node.ghost) (e.currentTarget as HTMLDivElement).style.background = C.surfaceHov; }}
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
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                      style={{
                        background: `${nodeColor}15`,
                        border: `2px solid ${C.border}`,
                        color: nodeColor,
                      }}
                    >
                      {node.name[0]}
                    </div>

                    {/* İsim & Rol */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium truncate" style={{ color: node.ghost ? C.textMuted : C.textPrimary }}>
                          {node.name}
                        </p>
                        {!node.ghost && (node.role === "Elite" || node.role === "Core" || node.role === "Admin") && (
                          <BadgeCheck className="w-3.5 h-3.5 shrink-0" style={{ color: C.accent }} />
                        )}
                      </div>
                      <p className="text-[11px]" style={{ color: node.ghost ? C.textMuted : C.textSecondary }}>
                        {node.role}
                      </p>
                    </div>

                    {/* Online dot */}
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: node.ghost ? C.textMuted : "#22C55E" }}
                    />
                  </motion.div>
                );
              })}

              {/* Alt not */}
              <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${C.borderSub}` }}>
                <div className="flex items-center gap-1.5 px-2">
                  <Shield className="w-3 h-3" style={{ color: C.textMuted }} />
                  <span className="text-[11px]" style={{ color: C.textMuted }}>
                    Identities encrypted
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
                { label: "Latency",    value: "12 ms"   },
                { label: "Encryption", value: "AES-256" },
                { label: "Status",     value: "ONLINE"  },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: C.textMuted }}>{label}</span>
                  <span className="text-[11px] font-medium font-mono" style={{ color: C.accent }}>
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
