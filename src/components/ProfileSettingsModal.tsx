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

// ─── Fütüristik input bileşeni ────────────────────────────

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
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest select-none"
        style={{ color: focused ? "#22c55e" : "rgba(255,255,255,0.40)", fontFamily: "'Space Mono', monospace", transition: "color 0.2s" }}
      >
        {icon}
        {label}
      </label>
      <div
        className="relative rounded-xl transition-all duration-200"
        style={{
          background: focused ? "rgba(34,197,94,0.04)" : "rgba(255,255,255,0.03)",
          border: focused
            ? "1px solid rgba(34,197,94,0.40)"
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(34,197,94,0.07)" : "none",
        }}
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
          className="w-full bg-transparent px-4 py-3 text-sm outline-none rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            color: "rgba(255,255,255,0.88)",
            fontFamily: "Inter, sans-serif",
            caretColor: "#22c55e",
          }}
        />
      </div>
      {hint && (
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.22)", fontFamily: "Inter, sans-serif" }}>
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
        className="w-16 h-16 rounded-full object-cover"
        style={{ border: "2px solid rgba(34,197,94,0.35)" }}
        onError={() => setImgOk(false)}
      />
    );
  }

  return (
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold select-none"
      style={{
        background: "rgba(34,197,94,0.12)",
        border: "2px solid rgba(34,197,94,0.30)",
        color: "#22c55e",
        fontFamily: "'Space Mono', monospace",
      }}
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
          className="fixed inset-0 z-[99998] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          onClick={handleBackdropClick}
        >
          <motion.div
            key="ps-card"
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(17,17,17,0.97)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(34,197,94,0.18)",
              boxShadow: "0 0 40px rgba(34,197,94,0.08), 0 24px 64px rgba(0,0,0,0.75)",
            }}
          >
            {/* Neon yeşil header strip */}
            <div
              className="h-1 w-full"
              style={{ background: "linear-gradient(90deg, #22c55e, #4ade80, #22c55e)" }}
            />

            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div>
                <h2
                  className="text-base font-bold"
                  style={{ color: "rgba(255,255,255,0.92)", fontFamily: "Inter, sans-serif", letterSpacing: "-0.01em" }}
                >
                  Edit Profile
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Inter, sans-serif" }}
                >
                  Node identity settings
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.80)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Avatar önizleme */}
              <div className="flex items-center gap-4">
                <AvatarPreview url={avatarUrl} nodeName={nodeName} />
                <div className="text-xs space-y-0.5" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "Inter, sans-serif" }}>
                  <p>Live avatar preview</p>
                  <p style={{ color: "rgba(255,255,255,0.20)" }}>Paste an image URL below</p>
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
            <div
              className="flex items-center justify-end gap-3 px-6 py-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <button
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-40"
                style={{
                  color: "rgba(255,255,255,0.45)",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving || !nodeName.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                style={{
                  background: saving ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.18)",
                  border: "1px solid rgba(34,197,94,0.40)",
                  color: "#22c55e",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: saving ? "none" : "0 0 12px rgba(34,197,94,0.15)",
                }}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.currentTarget.style.background = "rgba(34,197,94,0.25)";
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(34,197,94,0.25)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = saving ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.18)";
                  e.currentTarget.style.boxShadow = saving ? "none" : "0 0 12px rgba(34,197,94,0.15)";
                }}
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
