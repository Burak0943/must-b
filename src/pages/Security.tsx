import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Eye, EyeOff, ArrowLeft, CheckCircle2,
  ShieldCheck, AlertCircle, Loader2, KeyRound,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

// ── Şifre gücü hesaplama ───────────────────────────────────────────────────
function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: 'Çok zayıf', color: '#ef4444' };
  if (score === 2) return { score, label: 'Zayıf',    color: '#f97316' };
  if (score === 3) return { score, label: 'Orta',     color: '#eab308' };
  if (score === 4) return { score, label: 'Güçlü',    color: '#22c55e' };
  return                  { score, label: 'Çok güçlü', color: '#10b981' };
}

// ── Gereksinimler listesi ──────────────────────────────────────────────────
const requirements = [
  { test: (pw: string) => pw.length >= 8,          label: 'En az 8 karakter' },
  { test: (pw: string) => /[A-Z]/.test(pw),         label: 'Büyük harf içeriyor' },
  { test: (pw: string) => /[0-9]/.test(pw),         label: 'Rakam içeriyor' },
  { test: (pw: string) => /[^A-Za-z0-9]/.test(pw), label: 'Özel karakter (!@#…)' },
];

export default function Security() {
  const navigate = useNavigate();

  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [success,         setSuccess]         = useState(false);

  const strength = getStrength(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error('Şifre en az 8 karakter olmalı.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Şifreler eşleşmiyor.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setSuccess(true);
      toast.success('Şifren başarıyla güncellendi!');
      // 2.5s sonra ana sayfaya dön
      setTimeout(() => navigate('/'), 2500);
    } catch (err: any) {
      toast.error(err.message ?? 'Şifre güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">

      {/* ── Arka Plan ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-b-full bg-emerald-600/10 blur-[100px] pointer-events-none" />
      {/* Izgara */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Geri Butonu ── */}
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium z-50"
      >
        <ArrowLeft size={16} />
        <span>Ana Sayfa</span>
      </Link>

      <AnimatePresence mode="wait">

        {/* ── BAŞARI EKRANI ── */}
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center gap-5 text-center max-w-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
            >
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Şifre Güncellendi!</h1>
              <p className="text-white/50 text-sm leading-relaxed">
                Yeni şifreni bir sonraki girişte kullanabilirsin.<br />
                Ana sayfaya yönlendiriliyorsun…
              </p>
            </div>
            <div className="w-40 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 rounded-full"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        ) : (

          /* ── ŞİFRE FORM EKRANI ── */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[420px]"
          >
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">

              {/* Üst yeşil şerit */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

              <div className="p-8">

                {/* Başlık */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/30 font-mono uppercase tracking-widest">Güvenlik</p>
                    <p className="text-white font-semibold text-sm leading-tight">Şifre Değiştir</p>
                  </div>
                </div>

                <h1 className="text-[22px] font-bold text-white leading-snug mb-1">
                  Yeni bir şifre belirle
                </h1>
                <p className="text-white/40 text-sm mb-7 leading-relaxed">
                  Şifren en az 8 karakter içermeli ve güçlü olmalı.
                </p>

                <div className="h-px bg-white/[0.06] mb-7" />

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Yeni Şifre */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/50 tracking-wide">Yeni Şifre</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 w-4 h-4 text-white/30" />
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete="new-password"
                        className="w-full h-11 bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-10
                                   text-white placeholder:text-white/20 text-sm
                                   focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
                                   transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(v => !v)}
                        className="absolute right-3.5 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Güç Çubuğu */}
                    {newPassword.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-2 space-y-2"
                      >
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div
                              key={i}
                              className="h-1 flex-1 rounded-full transition-all duration-300"
                              style={{
                                backgroundColor: i <= strength.score ? strength.color : 'rgba(255,255,255,0.07)',
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-xs font-medium" style={{ color: strength.color }}>
                          {strength.label}
                        </p>
                        {/* Gereksinimler */}
                        <div className="grid grid-cols-2 gap-1 mt-1">
                          {requirements.map(req => {
                            const ok = req.test(newPassword);
                            return (
                              <div key={req.label} className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${ok ? 'bg-emerald-400' : 'bg-white/20'}`} />
                                <span className={`text-[10px] transition-colors ${ok ? 'text-emerald-400' : 'text-white/30'}`}>
                                  {req.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Şifre Tekrar */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/50 tracking-wide">Şifre Tekrar</label>
                    <div className="relative flex items-center">
                      <KeyRound className="absolute left-3.5 w-4 h-4 text-white/30" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete="new-password"
                        className={`w-full h-11 bg-white/[0.04] border rounded-xl pl-10 pr-10
                                    text-white placeholder:text-white/20 text-sm
                                    focus:outline-none transition-all duration-200
                                    ${confirmPassword.length > 0
                                      ? passwordsMatch
                                        ? 'border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20'
                                        : 'border-red-500/40 focus:ring-1 focus:ring-red-500/20'
                                      : 'border-white/[0.08] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20'
                                    }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-3.5 text-white/30 hover:text-white/60 transition-colors"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Eşleşme durumu */}
                    <AnimatePresence>
                      {confirmPassword.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-1.5 pt-1"
                        >
                          {passwordsMatch ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[11px] text-emerald-400">Şifreler eşleşiyor</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                              <span className="text-[11px] text-red-400">Şifreler eşleşmiyor</span>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Gönder Butonu */}
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    disabled={loading || !passwordsMatch || newPassword.length < 8}
                    className="w-full h-11 mt-2 rounded-xl font-semibold text-sm
                               bg-gradient-to-r from-emerald-600 to-teal-600
                               hover:from-emerald-500 hover:to-teal-500
                               text-white flex items-center justify-center gap-2
                               shadow-lg shadow-emerald-500/20
                               disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                               transition-all duration-200"
                  >
                    {loading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <><ShieldCheck className="w-4 h-4" /> Şifreyi Güncelle</>
                    }
                  </motion.button>

                </form>

                <p className="text-center text-[11px] text-white/20 mt-6 leading-relaxed">
                  Şifren şifreli iletilir ve sunucularımızda saklanmaz.<br />
                  Supabase güvenli auth altyapısı kullanılır.
                </p>

              </div>

              {/* Alt yeşil şerit */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
