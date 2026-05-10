import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import MeshBackground from "@/components/MeshBackground";
import PricingSection from "@/components/PricingSection";
import CostKillerSection from "@/components/CostKillerSection";
import FeatureMatrix from "@/components/FeatureMatrix";
import { SiteFooter } from "@/components/SiteFooter";

export default function PricingPage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden min-h-screen"
    >
      <MeshBackground />
      <Navbar />

      <div className="pt-20 md:pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-gradient-hero"
        >
          Şeffaf Fiyatlandırma,<br />Sınırsız Güç.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground"
        >
          Geliştirme sürecinizi otonomlaştırmak için size en uygun paketi seçin.
        </motion.p>
      </div>

      <PricingSection />
      <CostKillerSection />
      <FeatureMatrix />
      <SiteFooter />
    </motion.main>
  );
}
