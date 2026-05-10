import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";

export default function CostKillerSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Maliyet Katili (Cost Killer)</h2>
          <p className="text-muted-foreground">Bulutun esaretinden kurtulun, kendi donanımınızın gücüyle tasarruf edin.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Geleneksel Yöntem */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl border border-red-500/10 bg-red-500/[0.02] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4 text-red-400">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider">Geleneksel Bulut AI Kullanımı</span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">$1.500+ <span className="text-sm font-normal text-muted-foreground">/aylık ortalama</span></h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Her bir token, her bir istek ve her bir düşünme adımı için dolar bazında ödeme yaparsınız. Proje büyüdükçe fatura kontrol edilemez hale gelir.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-red-500/10 flex items-center gap-2 text-red-400/80 text-xs font-medium uppercase tracking-widest">
              <span>Sürpriz Faturalar</span>
              <div className="h-px flex-1 bg-red-500/20" />
              <span>Sınırlı Erişim</span>
            </div>
          </motion.div>

          {/* Must-b Local */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl border border-primary/50 bg-primary/5 relative overflow-hidden flex flex-col justify-between shadow-[0_0_40px_rgba(34,211,238,0.1)]"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap className="w-32 h-32 text-primary" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <Zap className="w-5 h-5 fill-primary" />
                <span className="font-bold text-sm uppercase tracking-wider">Must-b Local + Kendi Donanımınız</span>
              </div>
              <h3 className="text-5xl font-bold text-white mb-4">$0 <span className="text-sm font-normal text-muted-foreground">/aylık maliyet</span></h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Yerel modeller (Ollama, Llama 3 vb.) ile sınırları tamamen kaldırın. Donanımınızın gücü kadar işlem yapın, asla ek fatura ödemeyin.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-primary/20 flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest relative z-10">
              <span>Sınırsız Token</span>
              <div className="h-px flex-1 bg-primary/30" />
              <span>Tam Özgürlük</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
