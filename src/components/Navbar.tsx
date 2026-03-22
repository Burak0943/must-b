import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <img
            src="/mascot.png"
            alt="must-b"
            className="w-full h-full object-contain pointer-events-none"
          />
        </motion.div>
        <span className="group-hover:text-primary transition-colors duration-300">must-b</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-3">
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground
                     border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all"
        >
          Login
        </Link>
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground
                     hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile toggle */}
      <button className="md:hidden text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 bg-[#0a0b0e] border border-white/[0.08]
                       p-4 mx-4 mt-2 rounded-2xl flex flex-col gap-2 md:hidden z-50"
          >
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 text-center text-sm font-medium text-muted-foreground
                         border border-white/10 rounded-xl hover:bg-white/5 transition-all"
            >
              Login
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 text-center text-sm font-semibold bg-primary text-primary-foreground
                         rounded-xl transition-all"
            >
              Sign Up
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
