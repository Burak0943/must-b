/**
 * /auth/connect — CloudAuth Consent Page
 *
 * The local Gateway redirects the user's browser here:
 *   https://must-b.com/auth/connect?uid=X&pub=Y&state=Z&sig=W&callback=http://localhost:PORT/api/auth/cloud-callback
 *
 * Flow:
 *   1. User must be logged in (redirect to /login if not)
 *   2. Show a "Authorize your local Must-b agent?" prompt
 *   3. On "Authorize": POST /api/auth/connect → get CloudAuth JWT
 *   4. Redirect browser to callback?state=Z&token=JWT  (closes the loop with the Gateway)
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shield, Loader2, CheckCircle2, XCircle, Cpu } from "lucide-react";
import MeshBackground from "@/components/MeshBackground";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

type Stage = "loading" | "prompt" | "authorizing" | "success" | "error";

const AuthConnect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [stage, setStage] = useState<Stage>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const uid      = searchParams.get("uid")      ?? "";
  const state    = searchParams.get("state")    ?? "";
  const callback = searchParams.get("callback") ?? "";
  const pub      = searchParams.get("pub")      ?? "";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Preserve the full connect URL so Login can redirect back here
        navigate(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`, {
          replace: true,
        });
        return;
      }
      if (!uid || !state || !callback) {
        setErrorMsg("Missing required parameters (uid / state / callback).");
        setStage("error");
        return;
      }
      setStage("prompt");
    });
  }, [navigate, uid, state, callback]);

  const handleAuthorize = async () => {
    setStage("authorizing");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Session expired. Please log in again.");

      const res = await fetch("/api/auth/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ uid, state, callback }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Authorization failed.");

      setStage("success");
      // Redirect browser to the local Gateway callback — this hands the token off
      setTimeout(() => { window.location.href = json.redirect; }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message ?? "An unexpected error occurred.");
      setStage("error");
      toast.error(err.message);
    }
  };

  const handleDeny = () => {
    navigate("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-6 relative"
    >
      <MeshBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md p-8 glass rounded-outer relative z-10"
      >
        {stage === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Verifying session…</p>
          </div>
        )}

        {stage === "prompt" && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Authorize Local Agent</h2>
              <p className="text-muted-foreground text-sm mt-2">
                A local Must-b instance wants to link to your cloud account.
              </p>
            </div>

            <div className="glass rounded-xl p-4 mb-6 space-y-3 border border-white/5">
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Agent UID</p>
                  <p className="text-sm font-mono text-foreground break-all">{uid || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Public Key</p>
                  <p className="text-sm font-mono text-foreground truncate">{pub ? pub.slice(0, 32) + "…" : "—"}</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mb-6">
              This will issue a 24-hour JWT that lets your local agent verify its identity with must-b.com.
              The token is scoped to this device only.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDeny}
                className="py-3 rounded-xl border border-white/10 text-muted-foreground hover:bg-white/5 transition-all text-sm font-medium"
              >
                Deny
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAuthorize}
                className="py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all text-sm"
              >
                Authorize
              </motion.button>
            </div>
          </>
        )}

        {stage === "authorizing" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Issuing CloudAuth token…</p>
          </div>
        )}

        {stage === "success" && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            <h3 className="text-xl font-bold text-foreground">Agent Authorized</h3>
            <p className="text-muted-foreground text-sm">
              Handing token back to your local agent. You can close this tab.
            </p>
          </div>
        )}

        {stage === "error" && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <XCircle className="w-10 h-10 text-red-500" />
            <h3 className="text-xl font-bold text-foreground">Authorization Failed</h3>
            <p className="text-muted-foreground text-sm">{errorMsg}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate("/login")}
              className="mt-2 px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold"
            >
              Back to Login
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AuthConnect;
