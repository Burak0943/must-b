import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Globe, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import FloatingChangelogModal from "./FloatingChangelogModal";

// ── Animated gradient text for the changelog button label ──────────────────
function LiveLabel({ text }: { text: string }) {
  return (
    <span
      className="relative z-10 font-mono text-xs font-bold bg-clip-text text-transparent"
      style={{
        backgroundImage: "linear-gradient(90deg, #34d399, #06b6d4, #818cf8, #34d399)",
        backgroundSize: "250% 100%",
        animation: "changelog-gradient 3.5s linear infinite",
      }}
    >
      {text}
    </span>
  );
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [session, setSession]             = useState<any>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "tr" : "en";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      {/* Inject gradient keyframe once */}
      <style>{`
        @keyframes changelog-gradient {
          0%   { background-position: 0%   50%; }
          100% { background-position: 250% 50%; }
        }
      `}</style>

      <nav className="relative z-50 flex items-center justify-between px-6 md:px-10 py-5 max-w-7xl mx-auto">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tighter text-foreground group">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}
            className="relative w-8 h-8 flex items-center justify-center overflow-hidden"
          >
            <img src="/mascot.png" alt="must-b" className="w-full h-full object-contain pointer-events-none" />
          </motion.div>
          <span className="group-hover:text-primary transition-colors duration-300">must-b</span>
        </Link>

        {/* ── Desktop pill nav ── */}
        <div className="hidden md:flex items-center gap-6 bg-black/40 border border-white/10 rounded-full py-1.5 px-2 backdrop-blur-md">
          <Link to="/ecosystem" className="text-sm font-medium text-white/70 hover:text-white transition-colors pl-2">
            {t("nav.hub")}
          </Link>
          <Link to="/docs" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            {t("nav.docs")}
          </Link>
          <Link to="/pricing" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            {t("nav.pricing")}
          </Link>

          {session ? (
            <button
              onClick={handleSignOut}
              className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-medium
                         hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
            >
              <LogOut className="w-3 h-3" />
              {t("nav.signOut")}
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                {t("nav.login")}
              </Link>
              <button
                onClick={() => navigate("/login?mode=signup")}
                className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold
                           hover:bg-primary/90 transition-all shadow-[0_0_16px_hsl(192_91%_43%/0.35)]"
              >
                {t("nav.getStarted")}
              </button>
            </>
          )}

          <div className="w-px h-4 bg-white/10 mx-1" />

          {/* ── THE LIVE BEACON BUTTON ── */}
          <motion.button
            onClick={() => setChangelogOpen(true)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.93 }}
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full
                       border transition-all duration-300 group overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.06) 100%)",
              borderColor: "rgba(52,211,153,0.25)",
              boxShadow: "0 0 0 0 rgba(52,211,153,0)",
            }}
            animate={{
              boxShadow: [
                "0 0 0px 0px rgba(52,211,153,0.0)",
                "0 0 12px 2px rgba(52,211,153,0.18)",
                "0 0 0px 0px rgba(52,211,153,0.0)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Inner glow sweep on hover */}
            <motion.span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(52,211,153,0.15), transparent 70%)" }}
            />

            {/* Pulse beacon dot */}
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>

            {/* Sparkles icon */}
            <Sparkles className="w-3 h-3 text-emerald-300/80 relative z-10 shrink-0" />

            {/* Flowing gradient text */}
            <LiveLabel text={t("changelog.button")} />
          </motion.button>

          <div className="w-px h-4 bg-white/10 mx-1" />

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-white/5 transition-colors text-xs font-mono font-bold text-white/60 hover:text-white"
          >
            <Globe className="w-3.5 h-3.5" />
            {i18n.language?.toUpperCase().split("-")[0]}
          </button>
        </div>

        {/* ── Mobile toggle ── */}
        <button className="md:hidden text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* ── Mobile dropdown ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 right-0 bg-[#0a0b0e] border border-white/[0.08]
                         p-4 mx-4 mt-2 rounded-2xl flex flex-col gap-2 md:hidden z-50 shadow-2xl"
            >
              <Link to="/ecosystem" onClick={() => setMobileOpen(false)}
                className="py-2.5 px-4 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all rounded-xl">
                {t("nav.hub")}
              </Link>
              <Link to="/docs" onClick={() => setMobileOpen(false)}
                className="py-2.5 px-4 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all rounded-xl">
                {t("nav.docs")}
              </Link>
              <Link to="/pricing" onClick={() => setMobileOpen(false)}
                className="py-2.5 px-4 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all rounded-xl">
                {t("nav.pricing")}
              </Link>
              <div className="h-px w-full bg-white/10 mb-2" />

              {session ? (
                <button
                  onClick={() => { setMobileOpen(false); handleSignOut(); }}
                  className="py-2.5 px-4 text-sm font-medium text-red-400 hover:bg-red-400/5 transition-all rounded-xl flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t("nav.signOut")}
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="py-2.5 text-center text-sm font-medium text-white/70 border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-all">
                    {t("nav.login")}
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); navigate("/login?mode=signup"); }}
                    className="py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all"
                  >
                    {t("nav.getStarted")}
                  </button>
                </>
              )}

              <div className="h-px w-full bg-white/10 my-2" />

              {/* Mobile changelog */}
              <button
                onClick={() => { setMobileOpen(false); setChangelogOpen(true); }}
                className="py-2.5 px-4 text-sm font-bold rounded-xl flex items-center gap-2.5
                           bg-emerald-500/5 border border-emerald-500/20 text-emerald-300
                           hover:bg-emerald-500/10 transition-all"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <Sparkles className="w-4 h-4" />
                {t("changelog.button")}
              </button>

              <div className="h-px w-full bg-white/10 my-2" />
              <button
                onClick={toggleLanguage}
                className="py-2.5 px-4 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {t("dashboard.stats.language") || "Language"}
                </div>
                <span className="font-mono font-bold text-primary">{i18n.language?.toUpperCase().split("-")[0]}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Floating changelog modal — portal to body */}
      <FloatingChangelogModal open={changelogOpen} onClose={() => setChangelogOpen(false)} />
    </>
  );
};

export default Navbar;