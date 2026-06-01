/**
 * ProfileSettingsModal.tsx — Profil Düzenleme Modalı
 *
 * - node_name ve avatar_url alanlarını Supabase profiles tablosuna günceller.
 * - Başarılı kayıtta onSaved(nodeName, avatarUrl) callback'i ile parent state'i anlık günceller.
 * - Dışarı tıklama ve Esc ile kapanır; açıkken body scroll kilitlenir.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Image, Save, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────

export interface ProfileSettingsModalProps {
  isOpen: boolean;
  userId: string | null;
  initialNodeName: string;
  initialAvatarUrl: string | null;
  onClose: () => void;
  /** Parent'ı anlık güncellemek için: yeni nodeName ve avatarUrl döner */
  onSaved: (nodeName: string, avatarUrl: string | null) => void;
}

// ─── Premium input bileşeni ───────────────────────────────

interface FuturisticInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  hint?: string;
  disabled?: boolean;
}

function FuturisticInput({
  id, label, placeholder, value, onChange, icon, hint, disabled,
}: FuturisticInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-widest select-none transition-colors duration-200 ${
          focused ? "text-blue-500" : "text-[#8B949E]"
        }`}
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {icon}
        {label}
      </label>
      <div
        className={`relative rounded-xl transition-all duration-200 bg-[#0E1116] ${
          focused
            ? "border border-blue-500 ring-1 ring-blue-500/20"
            : "border border-[#30363D]"
        }`}
      >
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent px-4 py-3 text-sm text-[#E6EDF3] caret-blue-500 placeholder:text-[#484F58] outline-none rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        />
      </div>
      {hint && (
        <p
          className="text-[10px] text-[#484F58]"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

// ─── Avatar Preview ───────────────────────────────────────

function AvatarPreview({ url, nodeName }: { url: string; nodeName: string }) {
  const [imgOk, setImgOk] = useState(true);

  // URL değişince img state'ini resetle
  useEffect(() => { setImgOk(true); }, [url]);

  if (url && imgOk) {
    return (
      <img
        src={url}
        alt="preview"
        className="w-16 h-16 rounded-full object-cover border-2 border-[#30363D]"
        onError={() => setImgOk(false)}
      />
    );
  }

  return (
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold select-none bg-blue-600/10 border-2 border-[#30363D] text-blue-500"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {nodeName?.[0]?.toUpperCase() ?? "?"}
    </div>
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

  // initiallar değişince (modal yeniden açılırsa) sıfırla
  useEffect(() => {
    if (isOpen) {
      setNodeName(initialNodeName);
      setAvatarUrl(initialAvatarUrl ?? "");
    }
  }, [isOpen, initialNodeName, initialAvatarUrl]);

  // Body scroll kilitle / bırak
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Esc ile kapat
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  // Backdrop tıklama
  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  }, [onClose]);

  // Kaydet
  const handleSave = async () => {
    if (!userId) return;
    const trimmedName = nodeName.trim();
    const trimmedUrl  = avatarUrl.trim() || null;

    if (!trimmedName) {
      toast.error("Node name cannot be empty.");
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

      // Parent'ı anlık güncelle
      onSaved(trimmedName, trimmedUrl);
      onClose();
      toast.success("Profile updated!", {
        description: `Node name set to ${trimmedName}`,
        icon: <CheckCircle2 className="w-4 h-4 text-green-400" />,
      });
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error("Failed to update profile.", {
        description: err?.message ?? "Unknown error",
      });
    } finally {
      setSaving(false);
    }
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
          className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            key="ps-card"
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden bg-[#161B22]/95 backdrop-blur-xl border border-[#30363D] shadow-2xl"
          >
            {/* Blue/indigo header strip */}
            <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 to-indigo-600" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363D]">
              <div>
                <h2
                  className="text-base font-bold text-[#E6EDF3]"
                  style={{ fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "-0.01em" }}
                >
                  Edit Profile
                </h2>
                <p
                  className="text-xs mt-0.5 text-[#8B949E]"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  Node identity settings
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 text-[#484F58] hover:text-[#E6EDF3] hover:bg-[#1C2128]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Avatar önizleme */}
              <div className="flex items-center gap-4">
                <AvatarPreview url={avatarUrl} nodeName={nodeName} />
                <div
                  className="text-xs space-y-0.5"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  <p className="text-[#8B949E]">Live avatar preview</p>
                  <p className="text-[#484F58]">Paste an image URL below</p>
                </div>
              </div>

              {/* Node Name */}
              <FuturisticInput
                id="ps-node-name"
                label="Node Name"
                placeholder="e.g. mazrenofficial"
                value={nodeName}
                onChange={setNodeName}
                icon={<User className="w-3 h-3" />}
                hint="Visible to all nodes in the Nexus."
                disabled={saving}
              />

              {/* Avatar URL */}
              <FuturisticInput
                id="ps-avatar-url"
                label="Avatar URL"
                placeholder="https://example.com/avatar.png"
                value={avatarUrl}
                onChange={setAvatarUrl}
                icon={<Image className="w-3 h-3" />}
                hint="Direct link to a public image (PNG, JPEG, WebP)."
                disabled={saving}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#30363D]">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 disabled:opacity-40 bg-transparent border border-[#30363D] text-[#8B949E] hover:bg-[#1C2128]"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving || !nodeName.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 bg-blue-600 hover:bg-blue-700 text-white"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
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
