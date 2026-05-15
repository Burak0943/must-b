import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, Terminal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login';

// ─── Aşamalar ────────────────────────────────────────────────────────────────
type Stage = 'idle' | 'fetching' | 'redirecting' | 'success' | 'error';

// ─── Ana Bileşen ──────────────────────────────────────────────────────────────
export default function CliLogin() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const [stage, setStage] = useState<Stage>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [hasCliParams, setHasCliParams] = useState(false);

  // Sadece bir kez çalışmasını garantilemek için ref kullan
  const bridgeFiredRef = useRef(false);

  // ─── 1. Mount: URL Parametrelerini Yakala ve Kaydet ─────────────────────────
  useEffect(() => {
    const urlRedirectUri = searchParams.get('redirect_uri');
    const urlState       = searchParams.get('state');

    // URL'de parametreler varsa localStorage'a kaydet (Google redirect sonrası kaybolmasın)
    if (urlRedirectUri) localStorage.setItem('cli_redirect_uri', urlRedirectUri);
    if (urlState)       localStorage.setItem('cli_state', urlState);

    // localStorage'da (ya da URL'de) CLI parametresi var mı?
    const savedUri   = urlRedirectUri ?? localStorage.getItem('cli_redirect_uri');
    const savedState = urlState       ?? localStorage.getItem('cli_state');

    setHasCliParams(!!(savedUri));

    // ─── 2. Session Kontrolü ───────────────────────────────────────────────────
    const tryBridge = async (session: any) => {
      if (!session || bridgeFiredRef.current) return;

      const currentUri   = localStorage.getItem('cli_redirect_uri');
      const currentState = localStorage.getItem('cli_state');

      // CLI parametresi yoksa normal web akışı — /dashboard'a yönlendir
      if (!currentUri) {
        window.location.replace('/dashboard');
        return;
      }

      bridgeFiredRef.current = true;
      setStage('fetching');

      try {
        // profiles tablosundan api_access_token'ı çek
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('api_access_token')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        if (!profile?.api_access_token) {
          throw new Error(t('cliBridge.noToken') || 'API access token bulunamadı.');
        }

        setStage('redirecting');

        // localStorage'ı temizle
        localStorage.removeItem('cli_redirect_uri');
        localStorage.removeItem('cli_state');

        // Masaüstü uygulamasına geri yönlendir
        const redirectUrl = new URL(currentUri);
        redirectUrl.searchParams.set('token', profile.api_access_token);
        if (currentState) redirectUrl.searchParams.set('state', currentState);

        // Kısa bir delay ile yönlendir (UI'nin "success" göstermesi için)
        setTimeout(() => {
          window.location.href = redirectUrl.toString();
        }, 800);

      } catch (err: any) {
        console.error('[CliLogin] Bridge Error:', err);
        const msg = err?.message || t('cliBridge.error') || 'Beklenmedik bir hata oluştu.';
        setErrorMsg(msg);
        setStage('error');
        toast.error(msg);
        bridgeFiredRef.current = false; // Retry için sıfırla
      }
    };

    // Mevcut session'ı kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) tryBridge(session);
    });

    // Auth state değişimlerini dinle (OAuth callback sonrası session gelir)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) tryBridge(session);
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Session Yoksa ve CLI Parametresi Varsa → Login'i Göster ────────────────
  // (stage === 'idle' && hasCliParams && session yok demek)
  if (stage === 'idle') {
    return <Login />;
  }

  // ─── Bridge Aşama UI'leri ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Arka plan gradyanı */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/30 via-purple-900/20 to-black" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vh] h-[50vh] rounded-b-[50%] bg-purple-500/10 blur-[80px]" />

      <AnimatePresence mode="wait">
        {/* Fetching / Redirecting */}
        {(stage === 'fetching' || stage === 'redirecting') && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 flex flex-col items-center gap-6 text-center max-w-sm"
          >
            <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              {stage === 'redirecting'
                ? <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-pulse" />
                : <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              }
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">
                {stage === 'redirecting'
                  ? (t('cliBridge.redirecting') || 'Yönlendiriliyor…')
                  : (t('cliBridge.connecting') || 'Bağlanıyor…')
                }
              </h1>
              <p className="text-white/50 text-sm leading-relaxed">
                {stage === 'redirecting'
                  ? (t('cliBridge.transferring') || 'Token masaüstü uygulamanıza aktarılıyor.')
                  : 'API erişim tokenınız alınıyor, lütfen bekleyin.'
                }
              </p>
            </div>

            {/* Progress indicator */}
            <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-violet-400 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: stage === 'redirecting' ? '100%' : '60%' }}
                transition={{ duration: stage === 'redirecting' ? 0.8 : 2, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* Error */}
        {stage === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 flex flex-col items-center gap-6 text-center max-w-sm"
          >
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Bağlantı Başarısız</h1>
              <p className="text-white/50 text-sm leading-relaxed">{errorMsg}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                bridgeFiredRef.current = false;
                setStage('idle');
                setErrorMsg('');
              }}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium transition-all"
            >
              Tekrar Dene
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
