/**
 * ProfileSettingsModal.tsx — Premium Settings Hub
 *
 * - node_name ve avatar_url alanlarını Supabase profiles tablosuna günceller.
 * - Discord ve X (Twitter) ayarlar kalitesinde 2 kolonlu yapı.
 * - Sosyal Bağlantılar ve Tercihler sekmeleri eklendi.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, User, Image, Save, Loader2, CheckCircle2, Camera,
  Twitter, Github, MessageSquare, Instagram, Music,
  Bell, Volume2, ShieldAlert, Link, Edit3
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────

export interface ProfileSettingsModalProps {
  isOpen: boolean;
  userId: string | null;
  initialNodeName: string;
  initialAvatarUrl: string | null;
  onClose: () => void;
  onSaved: (nodeName: string, avatarUrl: string | null) => void;
}

// ─── Switch Component (iOS/X Style) ───────────────────────

function Switch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${
        checked ? "bg-blue-600" : "bg-[#27272A]"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Main Modal ───────────────────────────────────────────

export function ProfileSettingsModal({
  isOpen,
  userId,
  initialNodeName,
  initialAvatarUrl,
  onClose,
  onSaved,
}: ProfileSettingsModalProps) {
  const [nodeName,  setNodeName]  = useState(initialNodeName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? "");
  const [saving,    setSaving]    = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<"profile" | "social" | "preferences">("profile");

  // Sleek Avatar URL overlay trigger
  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [avatarInputVal, setAvatarInputVal] = useState(avatarUrl);

  // Mock social connections state
  const [connected, setConnected] = useState<Record<string, boolean>>({
    "Twitter/X": false,
    "GitHub": false,
    "Discord": false,
    "Instagram": false,
    "Spotify": false,
  });

  // Mock preferences state
  const [prefs, setPrefs] = useState({
    sounds: true,
    notifications: true,
    ghostMode: false,
  });

  // Reset inputs on modal open
  useEffect(() => {
    if (isOpen) {
      setNodeName(initialNodeName);
      setAvatarUrl(initialAvatarUrl ?? "");
      setAvatarInputVal(initialAvatarUrl ?? "");
      setActiveTab("profile");
      setShowAvatarInput(false);
    }
  }, [isOpen, initialNodeName, initialAvatarUrl]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Esc close
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  // Backdrop click close
  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  }, [onClose]);

  // Supabase Save Operation
  const handleSave = async () => {
    if (!userId) return;
    const trimmedName = nodeName.trim();
    const trimmedUrl  = avatarUrl.trim() || null;

    if (!trimmedName) {
      toast.error("Kullanıcı adı boş bırakılamaz.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          node_name:  trimmedName,
          avatar_url: trimmedUrl,
        })
        .eq("id", userId);

      if (error) throw error;

      onSaved(trimmedName, trimmedUrl);
      onClose();
      toast.success("Profiliniz başarıyla güncellendi!", {
        description: `Kullanıcı adınız: ${trimmedName}`,
        icon: <CheckCircle2 className="w-4 h-4 text-green-400" />,
      });
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error("Profil güncellenemedi.", {
        description: err?.message ?? "Bilinmeyen bir hata oluştu",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleConnection = (platform: string) => {
    setConnected(prev => {
      const state = !prev[platform];
      toast.success(state ? `${platform} başarıyla bağlandı!` : `${platform} bağlantısı kaldırıldı.`);
      return { ...prev, [platform]: state };
    });
  };

  // Sleek Avatar Change confirm
  const handleAvatarUrlSave = () => {
    setAvatarUrl(avatarInputVal);
    setShowAvatarInput(false);
    toast.success("Yeni profil resmi bağlantısı hazır. Lütfen kaydet butonuna basın.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={backdropRef}
          key="ps-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            key="ps-card"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-3xl h-[600px] rounded-2xl overflow-hidden bg-[#0A0A0A] border border-[#27272A] shadow-2xl flex flex-col"
          >
            {/* Main Header / Top strip */}
            <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 to-indigo-600 shrink-0" />

            {/* Inner Content Container (Sidebar + Detail view) */}
            <div className="flex flex-1 min-h-0">
              
              {/* ── SOL BÖLÜM (Sidebar) ── */}
              <div className="w-64 bg-[#121212] border-r border-[#27272A] p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-6 px-2">
                  <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8B949E]">
                    Ayarlar Merkezi
                  </span>
                </div>

                <div className="space-y-1 flex-1">
                  {[
                    { id: "profile", label: "Kullanıcı Profili", icon: User },
                    { id: "social", label: "Sosyal Bağlantılar", icon: Link },
                    { id: "preferences", label: "Tercihler", icon: Bell },
                  ].map(tab => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                            : "text-[#8B949E] hover:bg-[#27272A] hover:text-white"
                        }`}
                      >
                        <TabIcon className="w-4 h-4 shrink-0" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Close Button at bottom of sidebar */}
                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-[#27272A] hover:bg-[#1C2128] text-sm text-[#8B949E] hover:text-white font-semibold transition-all"
                >
                  <X className="w-4 h-4" />
                  Geri Dön
                </button>
              </div>

              {/* ── SAĞ ALAN (İçerik) ── */}
              <div className="flex-1 p-8 overflow-y-auto bg-[#0A0A0A] flex flex-col min-w-0">

                {/* ── SEKME 1: KULLANICI PROFİLİ ── */}
                {activeTab === "profile" && (
                  <div className="space-y-6 flex-1">
                    <div>
                      <h2 className="text-lg font-bold text-white mb-1">Kullanıcı Profili</h2>
                      <p className="text-xs text-[#8B949E]">Düğüm kimliğinizi ve görselliğinizi buradan yönetin.</p>
                    </div>

                    {/* Discord Tarzı Avatar Önizlemesi & Değiştirici */}
                    <div className="flex flex-col items-start gap-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#8B949E]">Profil Fotoğrafı</span>
                      
                      <div className="relative group">
                        <div
                          className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#27272A] relative bg-[#121212] cursor-pointer"
                          onClick={() => setShowAvatarInput(!showAvatarInput)}
                        >
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt="Avatar"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-500 bg-blue-600/10">
                              {nodeName[0]?.toUpperCase() ?? "?"}
                            </div>
                          )}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-200">
                            <Camera className="w-5 h-5 text-white" />
                            <span className="text-[9px] font-bold text-white uppercase tracking-wider text-center px-1">
                              FOTOĞRAF DEĞİŞTİR
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Görsel URL Düzenleme Bölümü (Açılıp/Kapanabilir Popover) */}
                      <AnimatePresence>
                        {showAvatarInput && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="w-full bg-[#121212] border border-[#27272A] p-4 rounded-xl space-y-3 shadow-lg"
                          >
                            <span className="text-xs font-bold text-white block">Profil Görseli URL</span>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="https://example.com/gorsel.png"
                                value={avatarInputVal}
                                onChange={(e) => setAvatarInputVal(e.target.value)}
                                className="flex-1 bg-[#0A0A0A] border border-[#27272A] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-[#E6EDF3] rounded-lg px-3 py-2 outline-none"
                              />
                              <button
                                onClick={handleAvatarUrlSave}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                              >
                                Seç
                              </button>
                            </div>
                            <p className="text-[10px] text-[#8B949E]">Doğrudan bir görsel linki (PNG, JPEG, WebP) girin.</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Kullanıcı Adı */}
                    <div className="space-y-2">
                      <label htmlFor="nodeName" className="text-xs font-bold uppercase tracking-widest text-[#8B949E]">
                        Kullanıcı Adı
                      </label>
                      <input
                        id="nodeName"
                        type="text"
                        placeholder="Kullanıcı adı girin..."
                        value={nodeName}
                        onChange={(e) => setNodeName(e.target.value)}
                        disabled={saving}
                        className="w-full bg-[#0E1116] border border-[#27272A] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-[#E6EDF3] rounded-xl px-4 py-3 outline-none transition-all disabled:opacity-50"
                      />
                    </div>

                    {/* Hakkımda (Bio) */}
                    <div className="space-y-2">
                      <label htmlFor="bio" className="text-xs font-bold uppercase tracking-widest text-[#8B949E]">
                        Hakkımda
                      </label>
                      <textarea
                        id="bio"
                        placeholder="Kendinizden bahsedin, burası topluluğa yansıyacak..."
                        className="w-full bg-[#0E1116] border border-[#27272A] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm text-white rounded-xl px-4 py-3 outline-none transition-all h-24 resize-none placeholder:text-[#484F58]"
                      />
                    </div>
                  </div>
                )}

                {/* ── SEKME 2: SOSYAL BAĞLANTILAR ── */}
                {activeTab === "social" && (
                  <div className="space-y-6 flex-1">
                    <div>
                      <h2 className="text-lg font-bold text-white mb-1">Sosyal Bağlantılar</h2>
                      <p className="text-xs text-[#8B949E]">Platform hesaplarınızı bağlayarak topluluktaki etkileşiminizi artırın.</p>
                    </div>

                    <div className="space-y-2">
                      {[
                        { id: "Twitter/X", icon: Twitter, desc: "@username bağla" },
                        { id: "GitHub", icon: Github, desc: "@username bağla" },
                        { id: "Discord", icon: MessageSquare, desc: "Sunucuya katıl" },
                        { id: "Instagram", icon: Instagram, desc: "Profil bağla" },
                        { id: "Spotify", icon: Music, desc: "Çalma listenizi eşleyin" },
                      ].map(item => {
                        const IconComponent = item.icon;
                        const isOk = connected[item.id];
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 bg-[#121212] border border-[#27272A] rounded-xl"
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-lg bg-[#0A0A0A] border border-[#27272A] flex items-center justify-center text-[#8B949E]">
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-[#E6EDF3] block">{item.id}</span>
                                <span className="text-[11px] text-[#8B949E]">{item.desc}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => toggleConnection(item.id)}
                              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                                isOk
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-[#27272A] hover:bg-blue-600 text-white"
                              }`}
                            >
                              {isOk ? "Bağlandı" : "Bağla"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── SEKME 3: TERCİHLER ── */}
                {activeTab === "preferences" && (
                  <div className="space-y-6 flex-1">
                    <div>
                      <h2 className="text-lg font-bold text-white mb-1">Tercihler</h2>
                      <p className="text-xs text-[#8B949E]">Uygulama bildirim ve görünüm tercihlerini kişiselleştirin.</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          id: "sounds",
                          title: "Mesaj Sesleri",
                          desc: "Yeni bir mesaj geldiğinde bildirim sesi çalsın.",
                          icon: Volume2
                        },
                        {
                          id: "notifications",
                          title: "Masaüstü Bildirimleri",
                          desc: "Arka plandayken gelen mesajları anlık bildirim olarak göster.",
                          icon: Bell
                        },
                        {
                          id: "ghostMode",
                          title: "Gizli Mod (Ghost Mode)",
                          desc: "Çevrimiçi statünüzü gizleyerek sessizce gezinin.",
                          icon: ShieldAlert
                        },
                      ].map(pref => {
                        const Icon = pref.icon;
                        const val = prefs[pref.id as keyof typeof prefs];
                        return (
                          <div
                            key={pref.id}
                            className="flex items-center justify-between p-4 bg-[#121212] border border-[#27272A] rounded-xl"
                          >
                            <div className="flex items-start gap-3.5 pr-4">
                              <div className="w-10 h-10 rounded-lg bg-[#0A0A0A] border border-[#27272A] flex items-center justify-center text-[#8B949E] shrink-0 mt-0.5">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-[#E6EDF3] block">{pref.title}</span>
                                <span className="text-[11px] text-[#8B949E] leading-normal block mt-0.5">{pref.desc}</span>
                              </div>
                            </div>

                            <Switch
                              checked={val}
                              onChange={() => setPrefs(prev => ({ ...prev, [pref.id]: !prev[pref.id as keyof typeof prefs] }))}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* ── STICKY ALT BAR (Kaydet & İptal) ── */}
            <div className="bg-[#121212] border-t border-[#27272A] p-4 flex justify-end gap-3 shrink-0">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#27272A] text-[#8B949E] hover:text-white hover:bg-[#1C2128] transition-all disabled:opacity-50"
              >
                İptal
              </button>

              <button
                onClick={handleSave}
                disabled={saving || !nodeName.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/10"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Kaydediliyor…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-white" />
                    Değişiklikleri Kaydet
                  </>
                )}
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
