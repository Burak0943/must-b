import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

// Hub-aware nav: hangi sekme aktif olduğunu URL'den okuyabiliriz.
// /ecosystem?tab=skills  |  /ecosystem?tab=plugins  |  /about

const NAV_LINKS = [
  { label: "SKILLS",   href: "/ecosystem?tab=skills"  },
  { label: "PLUGINS",  href: "/ecosystem?tab=plugins" },
  { label: "HAKKINDA", href: "/about"                  },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="relative z-50 px-6 md:px-10 py-5 max-w-7xl mx-auto">
      {/* ── Desktop: üç kolon — logo | nav | cta ── */}
      <div className="hidden md:grid grid-cols-3 items-center">

        {/* Sol: Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group w-fit"
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}
            className="relative w-8 h-8 flex items-center justify-center overflow-hidden"
          >
            <img
              src="/mascot.png"
              alt="must-b"
              className="w-full h-full object-contain pointer-events-none"
            />
          </motion.div>
          <span className="font-bold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
            MUST-B HUB
          </span>
        </Link>

        {/* Orta: Pill nav — TAM ORTADA */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-full py-1.5 px-2 backdrop-blur-md">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                className="relative px-4 py-1.5 rounded-full text-sm font-semibold text-white/60
                           hover:text-white transition-colors duration-200
                           hover:bg-white/[0.06]
                           tracking-wide"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Sağ: CTA buton */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/login?mode=signup")}
            className="px-5 py-2 rounded-full text-sm font-semibold
                       bg-primary text-primary-foreground
                       hover:bg-primary/90 transition-all duration-200
                       shadow-[0_0_20px_hsl(192_91%_43%/0.3)]
                       hover:shadow-[0_0_32px_hsl(192_91%_43%/0.5)]"
          >
            Başla →
          </button>
        </div>
      </div>

      {/* ── Mobile: logo + hamburger ── */}
      <div className="flex md:hidden items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-foreground">
          <img src="/mascot.png" alt="must-b" className="w-7 h-7 object-contain" />
          <span className="text-base tracking-tight">MUST-B HUB</span>
        </Link>
        <button
          className="text-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-4 right-4 mt-2 z-50
                       bg-[#0a0a0a] border border-white/[0.08]
                       rounded-2xl p-3 flex flex-col gap-1 shadow-2xl backdrop-blur-xl"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 px-4 rounded-xl text-sm font-semibold text-white/60
                           hover:text-white hover:bg-white/[0.06] transition-all"
              >
                {label}
              </Link>
            ))}
            <div className="h-px w-full bg-white/[0.08] my-1" />
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 text-center text-sm font-medium text-white/60
                         border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-all"
            >
              Giriş Yap
            </Link>
            <button
              onClick={() => { setMobileOpen(false); navigate("/login?mode=signup"); }}
              className="py-2.5 text-sm font-bold bg-primary text-primary-foreground
                         rounded-xl hover:bg-primary/90 transition-all"
            >
              Başla →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;