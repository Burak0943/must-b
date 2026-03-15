// GOOGLE TRANSLATE ÇÖKMESİNİ ENGELLEYEN GLOBAL YAMA
if (typeof window !== 'undefined') {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child: any) {
    if (child.parentNode !== this) {
      if (console) console.warn("Blocked an improper removeChild call.", this, child);
      return child; // Hata fırlatmak yerine işlemi iptal eder
    }
    return originalRemoveChild.apply(this, arguments as any);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode: any, referenceNode: any) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) console.warn("Blocked an improper insertBefore call.", this, referenceNode);
      return newNode; // Hata fırlatmak yerine işlemi iptal eder
    }
    return originalInsertBefore.apply(this, arguments as any);
  };
}

// ... Mevcut importların ve ReactDOM.createRoot kodun burada devam etsin
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Bileşenleri import ediyoruz (Yolların doğru olduğundan eminiz)
import Navbar from "@/components/Navbar";
import MeshBackground from "@/components/MeshBackground";
import HeroTerminal from "@/components/HeroTerminal";
import FeaturesSection from "@/components/FeaturesSection";
import DownloadSection from "@/components/DownloadSection";

const Index = () => {
  const navigate = useNavigate();

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden min-h-screen"
    >
      <MeshBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 md:pt-24 pb-24 md:pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Versiyon Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-xs font-mono text-muted-foreground mb-8">
              <span className="pulse-dot" />
              <span>v1.0 — Now Available</span>
            </div>

            {/* Ana Başlık */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-gradient-hero leading-[1.1]">
              <span>Cloud Brain,</span> <br /> <span>Local Muscle.</span>
            </h1>

            {/* Alt Metin */}
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              <span>The first AI agent that lives on your hardware but learns from the swarm. Zero latency, total privacy, infinite scale.</span>
            </p>

            {/* Butonlar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate("/login")} 
                className="btn-primary-glow inline-flex items-center gap-2 group border-none cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a href="#features" className="btn-glass inline-flex items-center gap-2 px-8 py-4 text-foreground">
                <span>Learn More</span>
              </a>
            </div>
          </motion.div>

          {/* Terminal Alanı */}
          <div className="mt-16 md:mt-20">
            <HeroTerminal />
          </div>
        </div>
      </section>

      <FeaturesSection />
      <DownloadSection />

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-bold text-foreground">
            <div className="w-8 h-8 relative rounded-lg overflow-hidden border border-white/10 bg-[#0f1115]">
              <img 
                src="/mascot.png" 
                alt="must-b mascot" 
                className="w-full h-full object-contain scale-110"
              />
            </div>
            <span>must-b</span>
          </div>
          <p className="text-xs text-muted-foreground">
            <span>© 2026 must-b. All rights reserved.</span>
          </p>
        </div>
      </footer>
    </motion.main>
  );
};

export default Index;
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
