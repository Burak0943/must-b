import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import MeshBackground from "@/components/MeshBackground";
import PricingSection from "@/components/PricingSection";
import CostKillerSection from "@/components/CostKillerSection";
import FeatureMatrix from "@/components/FeatureMatrix";
import { SiteFooter } from "@/components/SiteFooter";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function PricingPage() {
  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="relative overflow-hidden min-h-screen"
    >
      <MeshBackground />
      <Navbar />

      {/* ── Hero başlık ── */}
      <div className="pt-24 md:pt-36 pb-4 px-6 text-center max-w-4xl mx-auto">
        <motion.div variants={itemVariants} className="mb-4">
          <span
            className="inline-block text-xs font-mono font-bold uppercase tracking-[0.3em] px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "#34d399",
            }}
          >
            Fiyatlandırma
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight"
          style={{
            background: "linear-gradient(to bottom, #ffffff 30%, rgba(255,255,255,0.45))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Kod Yazmayın,<br />
          <span
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #10b981 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "hero-gradient-shift 4s ease infinite",
            }}
          >
            Sistem İnşa Edin.
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-white/45 max-w-2xl mx-auto leading-relaxed"
        >
          Sınırları aşan otonomi. Hobi projelerinden devasa kurumsal mimarilere kadar
          her ölçekte zekâ ve performans — doğru fiyatla.
        </motion.p>
      </div>

      {/* ── Bölümler ── */}
      <motion.div variants={itemVariants}>
        <PricingSection />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <CostKillerSection />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <FeatureMatrix />
      </motion.div>

      <SiteFooter />

      <style>{`
        @keyframes hero-gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
      `}</style>
    </motion.main>
  );
}
