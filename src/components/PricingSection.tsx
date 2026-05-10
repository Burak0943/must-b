import { motion } from "framer-motion";
import { Check, Star, Zap, Shield, Server, ArrowRight } from "lucide-react";

export default function PricingSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="py-24 px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono text-primary uppercase tracking-[0.2em] mb-4">
            Fiyatlandırma
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Sınırları aşan otonomi.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Hobi projelerinden devasa kurumsal mimarilere kadar her ölçekte zeka ve performans.
          </p>
        </div>

        {/* 4 Kolonlu Fiyatlandırma */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 xl:gap-8 mb-16"
        >
          {/* MUST-B LITE */}
          <motion.div variants={itemVariants} className="relative flex flex-col p-6 lg:p-8 rounded-3xl border border-white/10 bg-[#0a0c10]/50 backdrop-blur-sm">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Must-b Lite</h3>
              <p className="text-sm text-muted-foreground min-h-[40px]">Otonom dünyaya ilk adım. Hobi geliştiricileri için ideal.</p>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">$19</span>
                <span className="text-sm font-mono text-muted-foreground">/ay</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Klasik sohbet yerine doğrudan kod yazımı",
                "Tek Ajan (Single Agent) Mimarisi",
                "Kısa süreli bilişsel hafıza (Context)",
                "Temel otonom terminal erişimi",
                "Discord topluluk desteği"
              ].map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/10">
              Lite ile Başla
            </button>
          </motion.div>

          {/* MUST-B PRO (Vurgulu) */}
          <motion.div variants={itemVariants} className="relative flex flex-col p-6 lg:p-8 rounded-3xl border border-primary/50 bg-[#0a0c10] shadow-[0_0_30px_rgba(34,211,238,0.15)] transform lg:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-xs font-bold text-primary whitespace-nowrap backdrop-blur-md">
                <Star className="w-3.5 h-3.5 fill-primary" />
                EN POPÜLER
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl pointer-events-none" />
            
            <div className="mb-6 relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">Must-b Pro</h3>
              <p className="text-sm text-muted-foreground min-h-[40px]">Full-stack yetkinliği. Ameleliğe son, üretime odaklanın.</p>
            </div>
            <div className="mb-6 relative z-10">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$49</span>
                <span className="text-sm font-mono text-muted-foreground">/ay</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1 relative z-10">
              {[
                "Uçtan uca UI/UX, DB ve Deployment teslimatı",
                "Genişletilmiş Bilişsel Hafıza (LTM)",
                "Otonom Hata Çözme (Auto-Fix)",
                "Gelişmiş IDE Entegrasyonu",
                "Öncelikli E-posta Desteği"
              ].map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/90">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] relative z-10">
              Pro'ya Yükselt
            </button>
          </motion.div>

          {/* MUST-B ELITE */}
          <motion.div variants={itemVariants} className="relative flex flex-col p-6 lg:p-8 rounded-3xl border border-white/10 bg-[#0a0c10]/50 backdrop-blur-sm">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Must-b Elite</h3>
              <p className="text-sm text-muted-foreground min-h-[40px]">Kendi otonom ordunu kur. Ajanslar ve senyörler için.</p>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">$149</span>
                <span className="text-sm font-mono text-muted-foreground">/ay</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Multi-Agent Swarm (Ajan Sürüsü) mimarisi",
                "%80 otonom karar verme yetkisi",
                "Maksimum proje bağlam hafızası",
                "Sınırsız otonom bulut görevi (Step)",
                "7/24 VIP Mühendis Desteği"
              ].map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/10">
              Elite Ol
            </button>
          </motion.div>

          {/* MUST-B LOCAL */}
          <motion.div variants={itemVariants} className="relative flex flex-col p-6 lg:p-8 rounded-3xl border border-purple-500/20 bg-[#0a0c10]/50 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="w-24 h-24 text-purple-400" />
            </div>
            <div className="mb-6 relative z-10">
              <h3 className="text-xl font-bold text-purple-400 mb-2">Must-b Local</h3>
              <p className="text-sm text-muted-foreground min-h-[40px]">Kendi donanımın, sıfır bulut faturası. The Unfair Advantage.</p>
            </div>
            <div className="mb-6 relative z-10">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">$499</span>
                <span className="text-sm font-mono text-muted-foreground">/ömür boyu</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1 relative z-10">
              {[
                "Sıfır API maliyeti, kendi donanım gücün",
                "%100 Veri gizliliği, yerel çalışma",
                "Yerel LLM (Ollama vb.) tam optimizasyon",
                "Sınırsız kullanım, bulut kotası yok",
                "Kendi API anahtarlarını ekleme imkanı"
              ].map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors border border-purple-500/20 relative z-10">
              Yerel Gücü Kullan
            </button>
          </motion.div>
        </motion.div>

        {/* Kurumsal / Enterprise Blok - Compact Banner Version */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-3xl border border-white/[0.08] bg-[#030405] overflow-hidden"
        >
          {/* Subtle grid/glow background for enterprise */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-600/50 to-transparent" />
          
          <div className="p-6 md:p-8 lg:p-10 relative z-10 flex flex-col lg:flex-row gap-8 items-center">
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  <span>ENTERPRISE (B2B & B2G)</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  Savunma Sanayii ve Kurumlar İçin Milli Bilişsel Altyapı
                </h3>
              </div>
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-3xl">
                Veri gizliliğinin hayati olduğu kapalı ağlarda, dış dünyaya tamamen kapalı (Air-Gapped) çalışan otonom işletim sistemi. Kurumunuzun KVKK yükümlülüklerini sıfırlayın.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-0">
                <div className="flex gap-3 items-start">
                  <Server className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <div className="font-medium text-white/80 text-[11px] leading-tight">On-Premise Kurulum</div>
                </div>
                <div className="flex gap-3 items-start">
                  <Shield className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <div className="font-medium text-white/80 text-[11px] leading-tight">Air-Gapped Güvenlik</div>
                </div>
                <div className="flex gap-3 items-start">
                  <Zap className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <div className="font-medium text-white/80 text-[11px] leading-tight">Yerel Model Optimizasyonu</div>
                </div>
                <div className="flex gap-3 items-start">
                  <Star className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <div className="font-medium text-white/80 text-[11px] leading-tight">Özel Eğitim ve Ar-Ge</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-gray-200 transition-colors">
                Özel Teklif Alın
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              
              <div className="hidden sm:flex w-16 h-16 shrink-0 items-center justify-center relative">
                <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
                <div className="relative w-12 h-12 border border-white/10 rounded-xl bg-black/50 backdrop-blur-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-cyan-500/80" />
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
