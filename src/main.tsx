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

  if (session?.access_token && cliRedirectUri) {
    console.log('[Boot] CLI login detected — intercepting before React mounts.');

    // localStorage'ı temizle (tekrar tetiklenmesin)
    localStorage.removeItem('cli_redirect_uri');
    localStorage.removeItem('cli_state');

    // Token'ı CLI adresine ekle ve sayfayı değiştir
    const dest = new URL(cliRedirectUri);
    dest.searchParams.set('token', session.access_token);
    if (cliState) dest.searchParams.set('state', cliState);

    const finalUrl = dest.toString();
    console.log('[Boot] Redirecting to:', finalUrl);
    window.location.replace(finalUrl);
    return; // React ASLA mount edilmez — Router müdahale edemez
  }

  // CLI hedefi yok → normal React uygulamasını başlat
  createRoot(document.getElementById('root')!).render(<App />);
}

boot();
