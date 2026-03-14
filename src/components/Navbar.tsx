import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 md:px-8 py-6 max-w-7xl mx-auto">
      <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter text-foreground">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-black">
          B
        </div>
        must-b
      </Link>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors duration-200">Features</a>
        <a href="#download" className="hover:text-foreground transition-colors duration-200">Download</a>
        <Link to="/login" className="btn-glass text-foreground">
          Command Center
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden text-foreground p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 glass p-6 mx-4 rounded-2xl flex flex-col gap-4 md:hidden"
          >
            <a href="#features" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors py-2">Features</a>
            <a href="#download" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors py-2">Download</a>
            <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary-glow text-center">
              Command Center
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
