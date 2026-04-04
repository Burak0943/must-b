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
// Yeni Hub Bileşenimizi Import Ediyoruz
import MustbHub from "./components/MustbHub"; 

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Mevcut session'ı kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Auth değişimlerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white">must-b OS Loading...</div>;

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

            <Route path="/setup" element={session ? <LocalSetup /> : <Navigate to="/login" />} />
            <Route path="/connect" element={session ? <AuthConnect /> : <Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;