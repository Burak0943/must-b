import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import Login from "./Login";

export default function CliLogin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);

  const redirectUri = searchParams.get('redirect_uri') || localStorage.getItem('cli_redirect_uri');
  const state = searchParams.get('state') || localStorage.getItem('cli_state');

  useEffect(() => {
    if (searchParams.get('redirect_uri')) {
      localStorage.setItem('cli_redirect_uri', searchParams.get('redirect_uri')!);
    }
    if (searchParams.get('state')) {
      localStorage.setItem('cli_state', searchParams.get('state')!);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        handleBridge(session);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        handleBridge(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [searchParams]);

  const handleBridge = async (currentSession: any) => {
    if (!redirectUri) return;
    
    setLoading(true);
    try {
      // Fetch user profile to get api_access_token
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('api_access_token')
        .eq('id', currentSession.user.id)
        .single();

      if (error) throw error;
      if (!profile?.api_access_token) {
        toast.error("API Access Token bulunamadı. Lütfen önce Dashboard'dan bir token oluşturun.");
        return;
      }

      // Construct redirect URL
      const url = new URL(redirectUri);
      url.searchParams.set('token', profile.api_access_token);
      if (state) url.searchParams.set('state', state);

      // Clear storage
      localStorage.removeItem('cli_redirect_uri');
      localStorage.removeItem('cli_state');

      // Immediate redirect
      window.location.href = url.toString();
    } catch (err: any) {
      console.error("Bridge Error:", err);
      toast.error("Bağlantı kurulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">CLI Bağlantısı Kuruluyor</h1>
        <p className="text-white/60">Güvenli token aktarımı yapılıyor, lütfen bekleyin...</p>
      </div>
    );
  }

  // If no session, show the login UI
  return <Login />;
}
