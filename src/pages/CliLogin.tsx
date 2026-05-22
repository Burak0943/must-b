import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, Shield, Copy, CheckCheck, RefreshCw,
  ChevronRight, AlertCircle, Loader2, User
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

// ─── Tipler ──────────────────────────────────────────────────────────────────
type Stage = 'loading' | 'prompt' | 'authorizing' | 'fallback' | 'error';

interface UserProfile {
  email: string;
  fullName: string;
  avatarUrl: string | null;
  accessToken: string;
}

// ─── Ana Bileşen ──────────────────────────────────────────────────────────────
export default function CliLogin() {
  const [searchParams] = useSearchParams();
  const [stage, setStage]           = useState<Stage>('loading');
  const [profile, setProfile]       = useState<UserProfile | null>(null);
  const [errorMsg, setErrorMsg]     = useState('');
  const [copied, setCopied]         = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const fallbackTimerRef            = useRef<ReturnType<typeof setTimeout> | null>(null);

  // URL veya localStorage'dan CLI parametrelerini al
  const getCliParams = () => {
    const uri   = searchParams.get('redirect_uri') ?? localStorage.getItem('cli_redirect_uri') ?? '';
    const state = searchParams.get('state')        ?? localStorage.getItem('cli_state')        ?? '';
    return { uri, state };
  };

  // ─── Mount: Session ve Profil Yükle ─────────────────────────────────────────
  useEffect(() => {
    // URL'deki parametreleri localStorage'a da yaz (OAuth callback sonrası yedek)
    const rawUri   = searchParams.get('redirect_uri');
    const rawState = searchParams.get('state');
    if (rawUri)   localStorage.setItem('cli_redirect_uri', rawUri);
    if (rawState) localStorage.setItem('cli_state', rawState);

    // Session yükle — oturum yoksa App.tsx guard /login'e yönlendirir, biz bir şey yapmayız
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // App.tsx'teki <Route path="/cli-login"> guardı zaten devreye girer.
        // Burada window.location.replace KULLANMA — döngü yaratır.
        setStage('error');
        setErrorMsg('Oturum bulunamadı. Lütfen önce giriş yapın.');
        return;
      }

      setProfile({
        email:       session.user.email ?? '',
        fullName:    session.user.user_metadata?.full_name ?? session.user.email ?? '',
        avatarUrl:   session.user.user_metadata?.avatar_url ?? null,
        accessToken: session.access_token,
      });
      setStage('prompt');
    });

    // Auth state değişimlerini dinle (farklı hesapla giriş sonrası)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setProfile({
          email:       session.user.email ?? '',
          fullName:    session.user.user_metadata?.full_name ?? session.user.email ?? '',
          avatarUrl:   session.user.user_metadata?.avatar_url ?? null,
          accessToken: session.access_token,
        });
        setStage('prompt');
      }
    });

    return () => {
      subscription.unsubscribe();
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Yetkilendir Butonu ───────────────────────────────────────────────────────
  const handleAuthorize = () => {
    if (!profile) return;
    const { uri, state } = getCliParams();

    setStage('authorizing');

    // 3 saniye sonra fallback göster
    fallbackTimerRef.current = setTimeout(() => {
      setStage('fallback');
    }, 3000);

    // localStorage'ı temizle
    localStorage.removeItem('cli_redirect_uri');
    localStorage.removeItem('cli_state');

    // Masaüstü uygulamasına token gönder
    const dest = new URL(uri);
    dest.searchParams.set('token', profile.accessToken);
    if (state) dest.searchParams.set('state', state);

    const finalUrl = dest.toString();
    console.log('[CliLogin] Authorizing → ', finalUrl);
    window.location.href = finalUrl;
  };

  // ─── Farklı Hesapla Gir ───────────────────────────────────────────────────────
  const handleSwitchAccount = async () => {
    setSwitchLoading(true);
    try {
      // Mevcut oturumu kapat
      await supabase.auth.signOut();

      const { uri, state } = getCliParams();

      // Google'a prompt=select_account ile git
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/cli-login`,
          queryParams: { prompt: 'consent select_account' },
        },
      });

      // localStorage'ı koru (OAuth sonrası geri döneceğiz)
      if (uri)   localStorage.setItem('cli_redirect_uri', uri);
      if (state) localStorage.setItem('cli_state', state);

      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message ?? 'Hesap değiştirme başarısız.');
      setSwitchLoading(false);
    }
  };

  // ─── Token Kopyala ────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    if (!profile) return;
    await navigator.clipboard.writeText(profile.accessToken);
    setCopied(true);
    toast.success('Token kopyalandı.');
    setTimeout(() => setCopied(false), 2500);
  };

  // ─── Avatar Baş Harfi ─────────────────────────────────────────────────────────
  const initials = profile?.fullName
    ? profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">

      {/* ── Arka Plan ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/40 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-b-full bg-violet-600/10 blur-[100px] pointer-events-none" />

      {/* Izgara desen */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <AnimatePresence mode="wait">

        {/* ── YÜKLEME ── */}
        {stage === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            <p className="text-white/40 text-sm">Oturum kontrol ediliyor…</p>
          </motion.div>
        )}

        {/* ── ONAY EKRANI ── */}
        {stage === 'prompt' && profile && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[420px]"
          >
            {/* Kart */}
            <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">

              {/* Üst mor şerit */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

              <div className="p-8">

                {/* Logo + App Adı */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <img
                      src="/mascot.png"
                      alt="Must-b"
                      className="w-6 h-6 object-contain"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/30 font-mono uppercase tracking-widest">must-b.com</p>
                    <p className="text-white font-semibold text-sm leading-tight">Must-b OS</p>
                  </div>

                  {/* Verified badge */}
                  <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400 font-medium">Doğrulandı</span>
                  </div>
                </div>

                {/* Başlık */}
                <div className="mb-6">
                  <h1 className="text-[22px] font-bold text-white leading-snug mb-2">
                    Must-b OS masaüstü uygulaması<br />
                    <span className="text-white/50">hesabınıza erişmek istiyor.</span>
                  </h1>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Yetkilendirirseniz, uygulamanız oturumunuz adına işlem yapabilir.
                    İstediğiniz zaman bu erişimi iptal edebilirsiniz.
                  </p>
                </div>

                {/* Ayırıcı */}
                <div className="h-px bg-white/[0.06] my-5" />

                {/* Kullanıcı Profil Kartı */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06] mb-6">
                  {/* Avatar */}
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-violet-500/20"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-violet-500/20">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{profile.fullName}</p>
                    <p className="text-white/40 text-xs truncate">{profile.email}</p>
                  </div>
                  <div className="ml-auto shrink-0 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </div>

                {/* İzinler */}
                <div className="space-y-2 mb-7">
                  {[
                    { icon: Monitor, text: 'Masaüstü uygulamanızla senkronize ol' },
                    { icon: Shield, text: 'Hesap bilgilerinizi güvenli şekilde oku' },
                    { icon: User,   text: 'Oturumunuz adına komut çalıştır' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-white/50 text-sm">
                      <div className="w-5 h-5 rounded-md bg-violet-500/10 border border-violet-500/15 flex items-center justify-center shrink-0">
                        <Icon className="w-3 h-3 text-violet-400" />
                      </div>
                      {text}
                    </div>
                  ))}
                </div>

                {/* Butonlar */}
                <div className="space-y-3">
                  {/* Yetkilendir */}
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={handleAuthorize}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 transition-all duration-200"
                  >
                    Yetkilendir
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>

                  {/* Farklı Hesapla Gir */}
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={handleSwitchAccount}
                    disabled={switchLoading}
                    className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
                  >
                    {switchLoading
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <RefreshCw className="w-4 h-4" />
                    }
                    Farklı Hesapla Gir
                  </motion.button>
                </div>

                {/* Alt Not */}
                <p className="text-center text-[11px] text-white/20 mt-5 leading-relaxed">
                  Bu yetkilendirme yalnızca bu oturum için geçerlidir.<br />
                  Verileriniz şifreli iletilir ve saklanmaz.
                </p>
              </div>

              {/* Alt mor şerit */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            </div>
          </motion.div>
        )}

        {/* ── YETKİLENDİRİLİYOR (3sn bekleniyor) ── */}
        {stage === 'authorizing' && (
          <motion.div
            key="authorizing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 flex flex-col items-center gap-5 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Loader2 className="w-9 h-9 text-violet-400 animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Masaüstü uygulaması bekleniyor…</h2>
              <p className="text-white/40 text-sm">Must-b OS'un yanıt vermesi için bekleniyor.</p>
            </div>
            {/* Pulse bar */}
            <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-violet-500 rounded-full"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* ── FALLBACK: 3 saniye geçti, token göster ── */}
        {stage === 'fallback' && profile && (
          <motion.div
            key="fallback"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 w-full max-w-[440px]"
          >
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
              <div className="p-8">

                <div className="flex items-start gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg leading-tight mb-1">Yönlendirme Başarısız</h2>
                    <p className="text-white/50 text-sm leading-relaxed">
                      Masaüstü uygulaması yanıt vermedi. Aşağıdaki token'ı kopyalayıp
                      Must-b terminaline yapıştırın.
                    </p>
                  </div>
                </div>

                <div className="h-px bg-white/[0.06] my-5" />

                <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-3">Erişim Token'ı</p>

                {/* Token kutusu */}
                <div className="relative rounded-xl bg-black/40 border border-white/10 overflow-hidden">
                  <div className="px-4 py-3 pr-14 font-mono text-xs text-emerald-400 break-all leading-relaxed max-h-28 overflow-y-auto">
                    {profile.accessToken}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopy}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                    title="Kopyala"
                  >
                    <AnimatePresence mode="wait">
                      {copied
                        ? <motion.span key="check"   initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCheck className="w-3.5 h-3.5 text-emerald-400" /></motion.span>
                        : <motion.span key="copy"    initial={{ scale: 0 }} animate={{ scale: 1 }}><Copy       className="w-3.5 h-3.5 text-white/50"  /></motion.span>
                      }
                    </AnimatePresence>
                  </motion.button>
                </div>

                <p className="text-white/25 text-[11px] mt-3 text-center leading-relaxed">
                  Token'ı terminale yapıştırmak için: <code className="text-violet-400 font-mono">must-b login --token &lt;token&gt;</code>
                </p>

                {/* Tekrar dene */}
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
                    handleAuthorize();
                  }}
                  className="w-full mt-5 h-10 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Tekrar Yönlendirmeyi Dene
                </motion.button>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
            </div>
          </motion.div>
        )}

        {/* ── HATA ── */}
        {stage === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center gap-5 text-center max-w-sm"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Bağlantı Hatası</h2>
              <p className="text-white/50 text-sm">{errorMsg}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm font-medium transition-all"
            >
              Sayfayı Yenile
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
