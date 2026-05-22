// GOOGLE TRANSLATE ÇÖKMESİNİ ENGELLEYEN GLOBAL YAMA
if (typeof window !== 'undefined') {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child: any) {
    if (child.parentNode !== this) {
      if (console) console.warn("Blocked an improper removeChild call.", this, child);
      return child; // Hata fırlatmak yerine işlemi iptal eder
    }
    return originalRemoveChild.apply(this, arguments as any);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode: any, referenceNode: any) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) console.warn("Blocked an improper insertBefore call.", this, referenceNode);
      return newNode; // Hata fırlatmak yerine işlemi iptal eder
    }
    return originalInsertBefore.apply(this, arguments as any);
  };
}

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import { supabase } from "./lib/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// AŞAMA 1 — SENKRON: URL parametrelerini hemen localStorage'a yedekle
// React Router henüz yok, hiçbir framework kodu çalışmadı.
// Böylece OAuth provider'dan dönerken URL temizlense bile parametreler kaybolmaz.
// ─────────────────────────────────────────────────────────────────────────────
(function backupCliParams() {
  const sp = new URLSearchParams(window.location.search);
  const uri   = sp.get('redirect_uri');
  const state = sp.get('state');
  if (uri)   { localStorage.setItem('cli_redirect_uri', uri);   console.log('[Boot] CLI redirect_uri saved:', uri); }
  if (state) { localStorage.setItem('cli_state', state);        console.log('[Boot] CLI state saved:', state); }
})();

// ─────────────────────────────────────────────────────────────────────────────
// AŞAMA 2 — ASYNC: Oturum varsa ve CLI hedefi varsa React'i hiç mount etme.
// supabase.auth.getSession() burada BEKLENİR; React Router henüz sahneye çıkmadı.
// ─────────────────────────────────────────────────────────────────────────────
async function boot() {
  const { data: { session } } = await supabase.auth.getSession();

  const cliRedirectUri = localStorage.getItem('cli_redirect_uri');
  const cliState       = localStorage.getItem('cli_state');

  console.log('[Boot] Session:', !!session, '| CLI URI:', cliRedirectUri);

  if (cliRedirectUri) {
    if (session?.access_token) {
      // Oturum VAR + CLI hedefi VAR → onay ekranına git
      console.log('[Boot] CLI login detected + session exists → /cli-login');
      const authUrl = new URL('/cli-login', window.location.origin);
      authUrl.searchParams.set('redirect_uri', cliRedirectUri);
      if (cliState) authUrl.searchParams.set('state', cliState);
      window.location.replace(authUrl.toString());
    } else {
      // Oturum YOK + CLI hedefi VAR → login sayfasına gönder, CLI params URL'de taşı
      // localStorage'ı temizle ki login sonrası döngüye girmesin
      console.log('[Boot] CLI login detected + NO session → /login with CLI params in URL');
      localStorage.removeItem('cli_redirect_uri');
      localStorage.removeItem('cli_state');
      const loginUrl = new URL('/login', window.location.origin);
      loginUrl.searchParams.set('redirect_uri', cliRedirectUri);
      if (cliState) loginUrl.searchParams.set('state', cliState);
      window.location.replace(loginUrl.toString());
    }
    return; // React ASLA mount edilmez
  }

  // CLI hedefi yok → normal React uygulamasını başlat
  createRoot(document.getElementById('root')!).render(<App />);
}

boot();
