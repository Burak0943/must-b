import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 md:px-10 py-5 max-w-7xl mx-auto">

      {/* Logo */}
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

      {/* Desktop pill nav */}
      <div className="hidden md:flex items-center gap-6 bg-black/40 border border-white/10 rounded-full py-1.5 px-2 backdrop-blur-md">
        <Link to="/ecosystem" className="text-sm font-medium text-white/70 hover:text-white transition-colors pl-2">
          Hub
        </Link>
        <Link to="/docs" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
          Docs
        </Link>
        <Link to="/pricing" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
          Pricing
        </Link>
        <Link to="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
          Login
        </Link>
        <button
          onClick={() => navigate("/login?mode=signup")}
          className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold
                     hover:bg-primary/90 transition-all shadow-[0_0_16px_hsl(192_91%_43%/0.35)]"
        >
          Get Started
        </button>
      </div>

      {/* Mobile toggle */}
      <button className="md:hidden text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile dropdown */}
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
              Hub
            </Link>
            <Link to="/docs" onClick={() => setMobileOpen(false)}
              className="py-2.5 px-4 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all rounded-xl">
              Docs
            </Link>
            <Link to="/pricing" onClick={() => setMobileOpen(false)}
              className="py-2.5 px-4 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-all rounded-xl">
              Pricing
            </Link>
            <div className="h-px w-full bg-white/10 mb-2" />
            <Link to="/login" onClick={() => setMobileOpen(false)}
              className="py-2.5 text-center text-sm font-medium text-white/70 border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-all">
              Login
            </Link>
            <button
              onClick={() => { setMobileOpen(false); navigate("/login?mode=signup"); }}
              className="py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all"
            >
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;