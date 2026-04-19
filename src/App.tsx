import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LocalSetup from "./pages/LocalSetup";
import AuthConnect from "./pages/AuthConnect";
import NotFound from "./pages/NotFound";
import MustbHub from "./components/MustbHub";
import HubDetail from "./pages/HubDetail";
import DocsPage from "./pages/DocsPage";
import VectorVault from "./pages/VectorVault";
import TheBridge from "./pages/TheBridge";
import { CodeApprovalPanel } from "@/components/CodeApprovalPanel";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // 1. Mevcut session'ı kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
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
            <Route path="/docs/skills" element={<Navigate to="/ecosystem" replace />} />
            <Route path="/docs/setup" element={<Navigate to="/docs" replace />} />
            
            {/* Giriş yapmışsa Login'e gidemez, Dashboard'a fırlatılır */}
            <Route 
              path="/login" 
              element={!session ? <Login /> : <Navigate to="/dashboard" replace />} 
            />

            {/* Giriş yapmamışsa Dashboard'a gidemez, Login'e fırlatılır */}
            <Route 
              path="/dashboard" 
              element={session ? <Dashboard /> : <Navigate to="/login" replace />} 
            />

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