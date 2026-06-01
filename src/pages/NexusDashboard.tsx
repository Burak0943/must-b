/**
 * NexusDashboard.tsx — Must-b Premium Community Platform
 *
 * Design System v3 — "Must-b Classy Chat (WhatsApp/Telegram Style)"
 * ─ Layout  : 3-column elegant layout
 * ─ Palette : bg #0A0A0A | surfaces #121212 / #1E1E1E | borders #27272A
 * ─ Accent  : Must-b Blue #3B82F6
 * ─ Messages: Chat Bubbles style (Own right/blue, others left/gray)
 */

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Lock, Plus, Send, Ghost,
  Shield, Wifi, LogOut, ChevronRight,
  MessageSquare, BadgeCheck, Compass,
  Settings, Sparkles, Hash
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ProfileCard, type ProfileCardUser } from "@/components/ProfileCard";
import { ProfileSettingsModal } from "@/components/ProfileSettingsModal";
import { PricingModal } from "@/components/PricingModal";
import { toast } from "sonner";

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

const ACTIVE_NODES = [
  { id: "root",   name: "Root_Node",    role: "Admin",  ghost: false },
  { id: "elite",  name: "Elite_0x9A",  role: "Elite",  ghost: false },
  { id: "anon",   name: "Anon_7f3c",   role: "Core",   ghost: false },
  { id: "shadow", name: "Shadow_Relay", role: "Local",  ghost: false },
  { id: "ghost1", name: "Node_??",     role: "—",      ghost: true  },
];

// Muted, premium avatar colors
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
// E2EE Badge — elegant, minimal
// ─────────────────────────────────────────────────────────

const E2EEBadge = memo(function E2EEBadge() {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1 rounded-full select-none"
      style={{
        background: "rgba(59,130,246,0.10)",
        border: "1px solid rgba(59,130,246,0.20)",
        color: "#3B82F6",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      <motion.span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: "#3B82F6" }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <Shield className="w-3.5 h-3.5" />
      E2EE Güvenli
    </div>
  );
});

// ─────────────────────────────────────────────────────────
// MessageRow — Chat Bubbles Style (WhatsApp/iMessage hybrid)
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
      <div className="flex items-center gap-3 mx-4 my-4 select-none justify-center">
        <span
          className="text-xs px-3 py-1 rounded-full text-[#8B949E] bg-[#1E1E1E]/80 border border-[#27272A]"
        >
          {msg.text}
        </span>
      </div>
    );
  }

  const avatarColor = getAvatarColor(msg.user);
  const clickable = !!(onAvatarClick && msg.user_id);

  const handleAvatarClick = (e: React.MouseEvent) => {
    if (clickable) onAvatarClick!(msg.user_id!, msg.user, msg.avatar_url, e);
  };

  // Kendi mesajımız ise -> Sağa Yasla (Mavi Balon)
  if (isOwn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="flex justify-end mb-4 px-6"
      >
        <div className="flex flex-col items-end max-w-[70%]">
          <div className="bg-blue-600 text-white p-3 px-4 rounded-2xl rounded-br-none shadow-md">
            <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
              {msg.text}
            </p>
          </div>
          <span className="text-[10px] text-[#8B949E] mt-1 pr-1">{msg.ts}</span>
        </div>
      </motion.div>
    );
  }

  // Başkasının mesajı ise -> Sola Yasla (Koyu Gri Balon) + Solunda Avatar ve İsim
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="flex items-start gap-3 mb-4 px-6"
    >
      {/* Sol tarafta Avatar */}
      <div className="flex-shrink-0 mt-6">
        {msg.avatar_url ? (
          <img
            src={msg.avatar_url}
            alt={msg.user}
            className={`w-9 h-9 rounded-full object-cover flex-shrink-0 ${clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
            onClick={handleAvatarClick}
          />
        ) : (
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
            style={{
              background: `${avatarColor}18`,
              border: `1px solid #27272A`,
              color: avatarColor,
            }}
            onClick={handleAvatarClick}
          >
            {msg.user[0]?.toUpperCase()}
          </div>
        )}
      </div>

      {/* Mesaj İçeriği ve Adı */}
      <div className="flex flex-col items-start max-w-[70%]">
        {/* Üstte Gönderen Adı */}
        <span
          className={`text-[12px] font-semibold text-[#8B949E] mb-1 pl-1 ${clickable ? "cursor-pointer hover:underline hover:underline-offset-2" : ""}`}
          onClick={handleAvatarClick}
        >
          {msg.user}
        </span>
        <div className="bg-[#1E1E1E] text-white p-3 px-4 rounded-2xl rounded-bl-none shadow-md">
          <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap text-[#E6EDF3]">
            {msg.text}
          </p>
        </div>
        <span className="text-[10px] text-[#8B949E] mt-1 pl-1">{msg.ts}</span>
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
      className="rounded-xl px-3 py-2.5 transition-all duration-200"
      style={{
        opacity: visible ? 1 : 0.6,
        background: focused ? "#1E1E1E" : "#1A1A1A",
        border: `1px solid ${focused ? "#3B82F6" : "#27272A"}`,
      }}
    >
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4 shrink-0 text-[#8B949E]" />
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Oda kodu girin..."
          className="flex-1 bg-transparent text-xs text-white outline-none w-full font-medium placeholder:text-[#8B949E]/50"
          style={{
            caretColor: "#3B82F6",
          }}
        />
        {val && (
          <button onClick={() => { onEnter(val.trim()); setVal(""); }} className="text-blue-500">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MessageInput — Telegram Style Rounded Input Area
// ─────────────────────────────────────────────────────────

interface MessageInputProps {
  placeholder: string;
  onSend: (text: string) => void;
}

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
    <div className="bg-[#121212] border-t border-[#27272A] p-4 shrink-0">
      <div className="flex items-center gap-3">
        {/* Dosya ekle butonu */}
        <button
          className="p-2 shrink-0 rounded-full transition-colors text-[#8B949E] hover:bg-[#27272A] hover:text-white"
          title="Dosya / Kod ekle"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Telegram tarzı yuvarlak input */}
        <div className="flex-1 bg-[#1E1E1E] rounded-full px-5 py-2.5 flex items-center">
          <textarea
            ref={taRef}
            rows={1}
            value={val}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-[15px] text-white caret-blue-500 placeholder:text-[#8B949E] outline-none focus:outline-none resize-none max-h-[100px] leading-relaxed py-0.5"
            style={{ minHeight: "22px" }}
          />
        </div>

        {/* Gönder butonu (Mavi daire) */}
        <button
          onClick={handleSend}
          disabled={!hasText}
          className={`p-3 rounded-full shrink-0 transition-all duration-150 flex items-center justify-center ${
            hasText
              ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 cursor-pointer shadow-md shadow-blue-600/10"
              : "bg-[#1E1E1E] text-[#8B949E] cursor-not-allowed opacity-50"
          }`}
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </div>
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
  const [darkNodes, setDarkNodes]         = useState<string[]>([]);

  // sendMessage'e dışarıdan erişim için ref köprüsü
  const sendMessageRef = useRef<((text: string) => Promise<void>) | null>(null);
  // ── ProfileCard state ──────────────────────────────────
  const [pcUser,   setPcUser]   = useState<ProfileCardUser | null>(null);
  const [pcAnchor, setPcAnchor] = useState<DOMRect | null>(null);

  // ── Modal state'leri ───────────────────────────────────
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPricingOpen,  setIsPricingOpen]  = useState(false);

  const openProfileCard = useCallback(async (
    userId: string,
    username: string,
    avatarUrl: string | null | undefined,
    planLevel: string | null | undefined,
    e: React.MouseEvent,
  ) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    
    let cached = profileCache.current[userId];
    if (!cached || cached.bio === undefined) {
      const { data } = await supabase
        .from("profiles")
        .select("bio, social_links, preferences, plan_level, active_plan")
        .eq("id", userId)
        .single();
      if (data) {
        cached = {
          ...cached,
          node_name: username,
          avatar_url: avatarUrl ?? null,
          full_name: null,
          email: null,
          bio: data.bio,
          social_links: data.social_links,
          preferences: data.preferences,
          plan_level: data.plan_level || data.active_plan || "Free",
        };
        profileCache.current[userId] = cached;
      }
    }

    setPcUser({
      userId,
      username,
      avatarUrl,
      planLevel: planLevel ?? cached?.plan_level ?? "Free",
      cognitiveCredits: 0,
      bio: cached?.bio,
      social_links: cached?.social_links,
      preferences: cached?.preferences,
    });
    setPcAnchor(rect);
  }, [profile]);

  const closeProfileCard = useCallback(() => {
    setPcUser(null);
    setPcAnchor(null);
  }, []);

  /** ProfileSettingsModal kaydettiğinde profile state + cache'i anında güncelle */
  const handleProfileUpdated = useCallback((
    newNodeName: string,
    newAvatarUrl: string | null,
    newBio: string | null,
    newSocialLinks: Record<string, string> | null,
    newPreferences: { sound?: boolean; desktop_notifications?: boolean; stealth_mode?: boolean } | null
  ) => {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        node_name: newNodeName,
        avatar_url: newAvatarUrl,
        bio: newBio,
        social_links: newSocialLinks,
        preferences: newPreferences,
      };
    });
    // profileCache'i de anlık güncelle (mevcut kullanıcının ID'si üzerinden)
    setCurrentUser((prev: any) => {
      if (prev?.id) {
        profileCache.current[prev.id] = {
          ...profileCache.current[prev.id],
          node_name:  newNodeName,
          avatar_url: newAvatarUrl,
          bio:        newBio,
          social_links: newSocialLinks,
          preferences:  newPreferences,
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
    bio?: string | null;
    social_links?: Record<string, string> | null;
    preferences?: { sound?: boolean; desktop_notifications?: boolean; stealth_mode?: boolean } | null;
  } | null>(null);

  // Profile Cache to prevent redundant profile fetches
  const profileCache = useRef<Record<string, {
    node_name: string | null;
    avatar_url: string | null;
    full_name: string | null;
    email: string | null;
    bio?: string | null;
    social_links?: Record<string, string> | null;
    preferences?: { sound?: boolean; desktop_notifications?: boolean; stealth_mode?: boolean } | null;
  }>>({});

  const nodeName = profile?.node_name || "Root_Node";

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        .select("id, email, node_name, avatar_url, plan_level, full_name, active_plan, bio, social_links, preferences")
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
          bio: profileData.bio,
          social_links: profileData.social_links,
          preferences: profileData.preferences,
        });

        // Cache the current user's profile immediately
        profileCache.current[user.id] = {
          node_name: mappedName,
          avatar_url: profileData.avatar_url,
          full_name: profileData.full_name,
          email: profileData.email,
          bio: profileData.bio,
          social_links: profileData.social_links,
          preferences: profileData.preferences,
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

      const userIds = Array.from(
        new Set(rawMessages.map((m: any) => m.user_id).filter(Boolean))
      ) as string[];

      const missingUserIds = userIds.filter((id) => !profileCache.current[id]);

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
            if (profile && senderId === profile.id) {
              profileCache.current[senderId] = {
                node_name: profile.node_name,
                avatar_url: profile.avatar_url,
                full_name: null,
                email: profile.email,
              };
            } else {
              const { data } = await supabase
                .from("profiles")
                .select("id, node_name, avatar_url, full_name, email, bio, social_links, preferences")
                .eq("id", senderId)
                .single();
              
              if (data) {
                profileCache.current[senderId] = {
                  node_name: data.node_name,
                  avatar_url: data.avatar_url,
                  full_name: data.full_name,
                  email: data.email,
                  bio: data.bio,
                  social_links: data.social_links,
                  preferences: data.preferences,
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
  }, []);

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        /* Subtle scrollbar */
        .nx-scroll::-webkit-scrollbar       { width: 4px; }
        .nx-scroll::-webkit-scrollbar-track { background: transparent; }
        .nx-scroll::-webkit-scrollbar-thumb { background: #27272A; border-radius: 4px; }
        .nx-scroll::-webkit-scrollbar-thumb:hover { background: #3F3F46; }
      `}</style>

      <div
        className="h-screen w-screen overflow-hidden flex bg-[#0A0A0A] text-white font-sans"
        style={{ fontFamily: "Inter, -apple-system, system-ui, sans-serif" }}
      >

        {/* ═══════════════ SOL PANEL (Sidebar - WhatsApp/Telegram Style) ═══════════════ */}
        <div
          className="w-72 shrink-0 flex flex-col bg-[#121212] border-r border-[#27272A]"
        >
          {/* Logo & Sürüm */}
          <div className="p-4 border-b border-[#27272A] flex items-center justify-between bg-[#161616]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">Must-b Hub</span>
            </div>
            <span className="text-[10px] font-bold text-blue-500 bg-blue-600/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              v3.1
            </span>
          </div>

          {/* Kendi Profilimiz */}
          <div className="p-4 flex items-center gap-3 border-b border-[#27272A] bg-[#121212]">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={nodeName}
                className="w-10 h-10 rounded-full object-cover border border-[#27272A]"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{
                  background: `${getAvatarColor(nodeName)}18`,
                  border: `1px solid #27272A`,
                  color: getAvatarColor(nodeName),
                }}
              >
                {nodeName[0]?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold truncate text-white">{nodeName}</p>
                {profile?.plan_level && profile.plan_level !== "Free" && (
                  <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
                )}
              </div>
              <p className="text-xs text-[#8B949E]">{profile?.plan_level || "Free"} Plan</p>
            </div>
          </div>

          {/* WhatsApp Tarzı Navigasyon Menüleri */}
          <div className="p-3 space-y-0.5 border-b border-[#27272A] bg-[#121212]">
            <button
              onClick={() => {
                toast.info("Keşfet Aktif", { description: "Yakında Must-b topluluk keşif motoru yayında!" });
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-[#8B949E] hover:bg-[#27272A] hover:text-white transition-all"
            >
              <Compass className="w-4 h-4" />
              <span className="font-medium">Keşfet</span>
            </button>
            
            <button
              onClick={() => setActiveChannel("nexus-terminal")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-[#8B949E] hover:bg-[#27272A] hover:text-white transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">Odalarım</span>
            </button>

            <button
              onClick={() => setIsPricingOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-[#8B949E] hover:bg-[#27272A] hover:text-white transition-all"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Premium Planlar</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm text-[#8B949E] hover:bg-[#27272A] hover:text-white transition-all"
            >
              <Settings className="w-4 h-4" />
              <span className="font-medium">Ayarlar</span>
            </button>
          </div>

          {/* Sohbet Listesi (WhatsApp Chat List Style) */}
          <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1 bg-[#121212] nx-scroll">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8B949E]/50 mb-2 px-3">
              Sohbet Odaları
            </p>
            
            {CHANNELS.map((ch) => {
              const isActive = ch.id === activeChannel;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                    isActive ? "bg-blue-600 text-white" : "hover:bg-[#1E1E1E] text-[#8B949E] hover:text-white"
                  }`}
                >
                  {/* Daire Kanal İkonu */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                    isActive ? "bg-white/20 text-white" : "bg-[#27272A] text-white"
                  }`}>
                    {ch.label[0]?.toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm truncate font-semibold ${isActive ? "text-white" : "text-[#E6EDF3]"}`}>
                        {ch.label}
                      </span>
                      {ch.unread > 0 && !isActive && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-600 text-white">
                          {ch.unread}
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] truncate ${isActive ? "text-white/70" : "text-[#8B949E]"}`}>
                      Sohbete girmek için tıklayın...
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Özel Karanlık Odalar (Ghost) */}
            {darkNodes.length > 0 && (
              <>
                <div className="my-4 h-px bg-[#27272A]" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8B949E]/50 mb-2 px-3">
                  Karanlık Odalar
                </p>
                {darkNodes.map((code) => {
                  const isActive = code === activeChannel;
                  return (
                    <button
                      key={code}
                      onClick={() => setActiveChannel(code)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                        isActive ? "bg-blue-600 text-white" : "hover:bg-[#1E1E1E] text-[#8B949E] hover:text-white"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                        isActive ? "bg-white/20 text-white" : "bg-[#27272A] text-white"
                      }`}>
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm truncate font-semibold block text-[#E6EDF3]">
                          {code}
                        </span>
                        <p className="text-[11px] truncate text-[#8B949E]">
                          Şifreli özel kanal
                        </p>
                      </div>
                    </button>
                  );
                })}
              </>
            )}

            {/* Ghost Protocol Giriş Alant */}
            <div className="my-4 h-px bg-[#27272A]" />
            <div className="px-2">
              <GhostInput onEnter={handleEnterDarkNode} />
            </div>
          </div>

          {/* En Alt Güvenli Notu */}
          <div
            className="p-4 shrink-0 flex items-center gap-1.5 border-t border-[#27272A] bg-[#161616]"
          >
            <Shield className="w-3.5 h-3.5 text-[#8B949E]" />
            <span className="text-xs text-[#8B949E]">
              E2EE Şifreli Bağlantı
            </span>
            <button
              onClick={handleSignOut}
              className="ml-auto flex items-center gap-1 text-xs text-red-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Çıkış
            </button>
          </div>
        </div>

        {/* ═══════════════ ORTA SOHBET ALANI (WhatsApp/Telegram Web Bubble Style) ═══════════════ */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A]">
          {/* Sohbet Üst Barı */}
          <div className="h-16 px-6 border-b border-[#27272A] flex items-center justify-between bg-[#121212] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-semibold text-sm">
                {activeLabel[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">{activeLabel}</h2>
                <p className="text-[11px] text-[#8B949E]">şifreli bağlantı aktif</p>
              </div>
            </div>
            <E2EEBadge />
          </div>

          {/* Sohbet Balonları (Chat Bubbles) Akışı */}
          <div className="flex-1 overflow-y-auto py-6 nx-scroll bg-[#0A0A0A]">
            <div className="flex items-center gap-3 mx-6 mb-6 justify-center">
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#1E1E1E] text-[#8B949E]/70 border border-[#27272A]">
                #{activeLabel} — güvenli oturum başlangıcı
              </span>
            </div>

            <AnimatePresence initial={false}>
              {messagesWithGroup.map((msg) => (
                <MessageRow
                  key={msg.id}
                  msg={msg}
                  isOwn={msg.user === nodeName}
                  showAvatar={msg.showAvatar}
                  onAvatarClick={(userId, username, avatarUrl, e) => {
                    const planLevel =
                      profile && userId === profile.id
                        ? profile.plan_level
                        : null;
                    openProfileCard(userId, username, avatarUrl, planLevel, e);
                  }}
                />
              ))}
            </AnimatePresence>

            <div ref={messagesEndRef} className="h-2" />
          </div>

          {/* Telegram Tarzı Yuvarlak Yazma Alanı */}
          <MessageInput
            placeholder={`Mesaj yaz #${activeLabel}…`}
            onSend={(text) => sendMessageRef.current?.(text)}
          />
        </div>

        {/* ═══════════════ SAĞ PANEL (WhatsApp Grup Bilgisi Tarzı) ═══════════════ */}
        <div
          className="w-80 shrink-0 flex flex-col bg-[#121212] border-l border-[#27272A]"
        >
          {/* Üst Kısım: Grup Resmi & Detaylar */}
          <div className="p-6 flex flex-col items-center text-center border-b border-[#27272A] bg-[#161616]">
            <div className="w-20 h-20 rounded-full bg-blue-600/10 border-2 border-blue-500/20 flex items-center justify-center text-blue-500 mb-3 shadow-inner shadow-blue-500/10">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Must-b Topluluğu</h3>
            <p className="text-xs text-[#8B949E]">
              {activeLabel === "nexus-terminal"
                ? "Ana Hub & İletişim Kanalı"
                : `${activeLabel} Odası`}
            </p>
          </div>

          {/* Üye Sayısı & Liste Başlığı */}
          <div className="px-4 py-3 shrink-0 flex items-center gap-2 border-b border-[#27272A] bg-[#121212]">
            <Wifi className="w-3.5 h-3.5 text-[#8B949E]" />
            <span className="text-xs font-semibold flex-1 text-[#8B949E] uppercase tracking-wider">
              Topluluk Üyeleri
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-500 border border-blue-500/20">
              {ACTIVE_NODES.length}
            </span>
          </div>

          {/* Üye Listesi */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 nx-scroll">
            {dynamicActiveNodes.map((node, idx) => {
              const nodeColor = getAvatarColor(node.name);
              const isPremium = node.role === "Elite" || node.role === "Core" || node.role === "Admin" || node.role === "Root" || node.role === "Pro";
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center gap-3 px-2.5 py-2 rounded-xl transition-all ${
                    node.ghost ? "opacity-35 cursor-default" : "cursor-pointer hover:bg-[#27272A]"
                  }`}
                  onClick={(e) => {
                    if (node.ghost) return;
                    const isCurrentUser = node.id === "root";
                    const planLevel = isCurrentUser ? profile?.plan_level : null;
                    const userId    = isCurrentUser ? (profile?.id ?? node.id) : node.id;
                    openProfileCard(userId, node.name, null, planLevel, e);
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-8.5 h-8.5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                    style={{
                      background: `${nodeColor}15`,
                      border: `1px solid #27272A`,
                      color: nodeColor,
                    }}
                  >
                    {node.name[0]?.toUpperCase()}
                  </div>

                  {/* İsim & Rol */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium truncate text-[#E6EDF3]">
                        {node.name}
                      </p>
                      {!node.ghost && isPremium && (
                        <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#8B949E]">
                      {node.role}
                    </p>
                  </div>

                  {/* Online Durum Dot */}
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: node.ghost ? "#484F58" : "#22C55E" }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* İstatistikler */}
          <div className="p-4 border-t border-[#27272A] bg-[#161616] space-y-2">
            {[
              { label: "Gecikme", value: "12 ms" },
              { label: "Şifreleme", value: "AES-256" },
              { label: "Sunucu", value: "AKTİF" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-[#8B949E]">{label}</span>
                <span className="text-[11px] font-semibold text-blue-500 font-mono">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

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

      {/* ── Profile Settings Modal ── */}
      <ProfileSettingsModal
        isOpen={isSettingsOpen}
        userId={currentUser?.id ?? null}
        initialNodeName={profile?.node_name ?? ""}
        initialAvatarUrl={profile?.avatar_url ?? null}
        initialBio={profile?.bio ?? null}
        initialSocialLinks={profile?.social_links ?? null}
        initialPreferences={profile?.preferences ?? null}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={handleProfileUpdated}
      />

      {/* ── Pricing Modal ── */}
      <PricingModal
        isOpen={isPricingOpen}
        currentPlanLevel={profile?.plan_level ?? null}
        onClose={() => setIsPricingOpen(false)}
      />
    </>
  );
}
