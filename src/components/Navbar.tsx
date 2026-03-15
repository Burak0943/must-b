import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 md:px-8 py-6 max-w-7xl mx-auto">
      
      {/* LOGO BÖLÜMÜ */}
      <Link to="/" className="flex items-center gap-3 font-bold text-xl tracking-tighter text-foreground group">
        
        {/* Tilki Kutusu - Mascot.png ile güncellendi */}
        <motion.div
          animate={{ 
            y: [0, -3, 0], 
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.1 }}
          className="relative w-10 h-10 flex items-center justify-center overflow-hidden" 
        >
          <img 
            src="/mascot.png" // DÜZELTME: fox.jpg yerine mascot.png yaptık
            alt="must-b agent" 
            className="w-full h-full object-contain pointer-events-none" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              console.error("Navbar logosu yüklenemedi!");
            }}
          />
        </motion.div>
        
        <span className="group-hover:text-primary transition-colors duration-300">must-b</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-medium">
        <a href="#features" className="hover:text-foreground transition-colors duration-200">Features</a>
        <a href="#download" className="hover:text-foreground transition-colors duration-200">Download</a>
        <Link 
          to="/login" 
          className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-all backdrop-blur-md"
        >
          Command Center
        </Link>
      </div>

      {/* Mobile Toggle */}
      <button className="md:hidden text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 glass p-6 mx-4 mt-2 rounded-2xl flex flex-col gap-4 md:hidden border border-white/10 bg-[#0A0A0A] z-50"
          >
            <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary-glow text-center py-3 rounded-xl font-bold">
              Command Center
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;