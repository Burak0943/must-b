import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Index from "./pages/Index";
import Login from "./pages/Login";
import LocalSetup from "./pages/LocalSetup";
import AuthConnect from "./pages/AuthConnect";
import CliLogin from "./pages/CliLogin";
import NotFound from "./pages/NotFound";
import MustbHub from "./components/MustbHub";
import HubDetail from "./pages/HubDetail";
import DocsPage from "./pages/DocsPage";
import PricingPage from "./pages/PricingPage";
import VectorVault from "./pages/VectorVault";
import TheBridge from "./pages/TheBridge";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Security from "./pages/Security";
import Download from "./pages/Download";
import NexusAuth from "./pages/NexusAuth";
import { CodeApprovalPanel } from "@/components/CodeApprovalPanel";

const queryClient = new QueryClient();

// /cli-login için guard: session yoksa CLI params'i URL'de taşıyarak /login'e yönlendir
const CliLoginGuard = ({ session, loading }: { session: any; loading: boolean }) => {
  if (loading) return null; // Session yüklenene kadar bekle — yanlış yönlendirme olmasın
  if (!session) {
    // CLI params'i URL'de taşı — localStorage'a dokunma
    const sp = new URLSearchParams(window.location.search);
    const uri   = sp.get('redirect_uri') ?? '';
    const state = sp.get('state') ?? '';
    const loginUrl = uri
      ? `/login?redirect_uri=${encodeURIComponent(uri)}${state ? `&state=${encodeURIComponent(state)}` : ''}`
      : '/login';
    return <Navigate to={loginUrl} replace />;
  }
  return <CliLogin />;
};

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    // 1. Mevcut session'ı kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoading(false);
    });

    // 2. Auth değişimlerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Landing Page her zaman açık */}
            <Route path="/" element={<Index />} />
            
            {/* MUST-B HUB - Herkese Açık (Yatırımcılar ve misafirler görsün diye) */}
            <Route path="/ecosystem" element={<MustbHub />} />
            <Route path="/ecosystem/:type/:id" element={<HubDetail />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/download" element={<Download />} />

            {/* /auth — Nexus kapısı: oturum varsa ana sayfaya at */}
            <Route
              path="/auth"
              element={
                sessionLoading ? null : (
                  !session
                    ? <NexusAuth />
                    : <Navigate to="/" replace />
                )
              }
            />

            {/* /nexus ve /community — oturum yoksa /auth'a yönlendir */}
            <Route
              path="/nexus"
              element={session ? <Navigate to="/" replace /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="/community"
              element={session ? <Navigate to="/" replace /> : <Navigate to="/auth" replace />}
            />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/docs/skills" element={<Navigate to="/ecosystem" replace />} />
            <Route path="/docs/setup" element={<Navigate to="/docs" replace />} />
            
            {/* Giriş yapmamışsa Login'e gidemez değil, artık tam tersi:
                Giriş yapmış + CLI params varsa /cli-login'e at, yoksa /login göster */}
            <Route 
              path="/login"
              element={
                sessionLoading ? null : (
                  !session
                    ? <Login />
                    : (() => {
                        const sp = new URLSearchParams(window.location.search);
                        const uri = sp.get('redirect_uri') ?? '';
                        const state = sp.get('state') ?? '';
                        return uri
                          ? <Navigate to={`/cli-login?redirect_uri=${encodeURIComponent(uri)}${state ? `&state=${encodeURIComponent(state)}` : ''}`} replace />
                          : <Navigate to="/" replace />;
                      })()
                )
              }
            />

            {/* /cli-login: oturum yoksa /login'e gönder (guard CliLoginGuard içinde) */}
            <Route path="/cli-login" element={<CliLoginGuard session={session} loading={sessionLoading} />} />

            <Route 
              path="/vector-vault" 
              element={session ? <VectorVault /> : <Navigate to="/login" replace />} 
            />

            <Route 
              path="/the-bridge" 
              element={session ? <TheBridge /> : <Navigate to="/login" replace />} 
            />

            <Route path="/setup" element={session ? <LocalSetup /> : <Navigate to="/login" />} />
            <Route path="/connect" element={session ? <AuthConnect /> : <Navigate to="/login" />} />
            {/* Şifre değiştirme — sadece oturum açık kullanıcılar */}
            <Route path="/security" element={session ? <Security /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        {/* CodeApprovalPanel — always mounted, shows as a floating overlay when backend emits require_approval */}
        <CodeApprovalPanel />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;