import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Must-b yerel modelleri nasıl kullanıyor?",
    answer: "Must-b, Ollama ve benzeri yerel LLM çalışma zamanları ile entegre olarak çalışır. Ekran kartınızın (GPU) gücünü kullanarak verilerinizi buluta göndermeden tamamen kendi donanımınızda işlem yapar."
  },
  {
    question: "API anahtarlarımı kendim mi sağlamalıyım?",
    answer: "Lite ve Pro paketlerinde bulut tabanlı hazır modelleri kullanabilirsiniz. Ancak Local paketi seçerseniz kendi API anahtarlarınızı (OpenAI, Anthropic vb.) kullanabilir veya tamamen ücretsiz yerel modellerle devam edebilirsiniz."
  },
  {
    question: "Kurumsal sürümde internet bağlantısı zorunlu mu?",
    answer: "Hayır. Enterprise (Air-Gapped) sürümümüz tamamen kapalı ağlarda çalışacak şekilde tasarlanmıştır. Hiçbir dış bağlantı veya telemetri verisi transferi gerçekleşmez."
  },
  {
    question: "Multi-Agent Swarm mimarisi ne işe yarar?",
    answer: "Bu mimari, karmaşık bir görevi alt görevlere bölerek farklı uzmanlıklara sahip AI ajanlarına dağıtır. Örneğin bir ajan UI kodlarken diğeri veritabanı şemasını hazırlar, bu da işlem süresini %60'a kadar kısaltır."
  },
  {
    question: "Aboneliğimi istediğim zaman iptal edebilir miyim?",
    answer: "Evet, aylık aboneliklerinizi dilediğiniz zaman kontrol paneliniz üzerinden tek tıkla iptal edebilirsiniz. İptal sonrası fatura dönemi sonuna kadar tüm özelliklere erişmeye devam edersiniz."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 relative border-t border-white/[0.04]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono text-primary uppercase tracking-[0.2em] mb-4">
            SSS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-muted-foreground">
            Must-b hakkında en çok merak edilen konuları sizin için yanıtladık.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <HelpCircle className="w-5 h-5 text-primary opacity-60" />
                  <span className="font-semibold text-white/90">{faq.question}</span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-2 text-sm text-muted-foreground leading-relaxed">
                      <div className="h-px w-full bg-white/5 mb-4" />
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 rounded-3xl border border-primary/20 bg-primary/5 text-center">
          <p className="text-white/80 font-medium mb-4">Başka bir sorunuz mu var?</p>
          <button className="text-primary font-bold hover:underline">
            Discord topluluğumuza katılın veya bize yazın →
          </button>
        </div>
      </div>
    </section>
  );
}
