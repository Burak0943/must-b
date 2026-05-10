import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Must-b yerel modelleri nasıl kullanıyor?",
    answer: "Must-b, bilgisayarınızdaki donanım gücünü (özellikle GPU) tam kapasiteyle kullanabilmeniz için Ollama ve benzeri yerel LLM (Büyük Dil Modeli) çalışma zamanlarıyla %100 entegre çalışır. Sisteme Llama 3, Mistral veya kendi eğittiğiniz herhangi bir açık kaynaklı modeli doğrudan bağlayabilirsiniz. Bu sayede kodunuz, proje dosyalarınız veya ticari sırlarınız hiçbir zaman dış bulut sunucularına (OpenAI, Google vb.) gönderilmez. Hem \"Sıfır API Maliyeti\" avantajıyla öngörülemeyen dolar bazlı faturalardan kurtulursunuz hem de dış dünyadan tamamen izole, maksimum güvenlikli bir otonom yapay zeka deneyimi yaşarsınız."
  },
  {
    question: "API anahtarlarımı kendim mi sağlamalıyım?",
    answer: "Bu durum seçtiğiniz plana göre esneklik gösterir. Eğer Must-b Pro veya Elite paketlerinden birini kullanıyorsanız, hiçbir API anahtarıyla uğraşmanıza gerek yoktur; en güçlü bulut modellerine (GPT-4o, Claude 3.5 Sonnet vb.) kesintisiz erişim aboneliğinize dahildir ve arka planda bizim tarafımızdan yönetilir. Ancak Must-b Lite veya Local paketini tercih ederseniz kontrol tamamen size geçer. Kendi OpenAI, Anthropic veya diğer API anahtarlarınızı sisteme tanımlayarak (Bring Your Own Key) sadece harcadığınız token kadar ödeyebilir ya da güçlü bir bilgisayarınız varsa tamamen yerel modelleri (Local LLM) kullanarak API masrafını %100 sıfırlayabilirsiniz."
  },
  {
    question: "Kurumsal sürümde internet bağlantısı zorunlu mu?",
    answer: "Kesinlikle hayır. Must-b Enterprise (Kurumsal) sürümünün, piyasadaki standart yapay zeka araçlarından en büyük farkı budur. Savunma sanayisi, bankacılık ve sağlık gibi veri gizliliğinin kırmızı çizgi olduğu stratejik sektörler için sistemimiz \"Air-Gapped\" (İnternetsiz / İzole Ağ) standartlarında çalışacak şekilde tasarlanmıştır. Kurumunuzun kendi yerel sunucularına (On-Premise) kurulan Must-b, dış dünya ile hiçbir veri alışverişi (Zero-Telemetry) yapmaz. Wi-Fi kartı sökülmüş gizlilik dereceli odalarda ve kapalı intranet ağlarında bile otonom yazılım geliştirme süreçlerini tam performansla, sızıntı riski sıfır olarak sürdürebilirsiniz."
  },
  {
    question: "Multi-Agent Swarm mimarisi ne işe yarar?",
    answer: "Multi-Agent Swarm (Ajan Sürüsü) mimarisi, yapay zekayı tek boyutlu bir \"sohbet asistanı\" olmaktan çıkarıp otonom bir \"siber yazılım fabrikasına\" dönüştüren çekirdek teknolojimizdir. Siz sisteme büyük bir mimari görev verdiğinizde, Must-b bu işi tek bir ajana yüklemek yerine uzmanlıklara böler. Bir ajan veritabanı tablolarını ve RLS güvenlik politikalarını hazırlarken, eş zamanlı olarak diğer ajan UI/UX bileşenlerini kodlar, bir diğeri ise terminalden dönen logları okuyup çıkan hataları kendi kendine çözer (Auto-Fix). Bu paralel çalışma sistemi, insan müdahalesini %80 oranında ortadan kaldırır ve projelerin geleneksel yöntemlere göre katbekat hızlı ayağa kalkmasını sağlar."
  },
  {
    question: "Aboneliğimi istediğim zaman iptal edebilir miyim?",
    answer: "Evet, Must-b'nin Bireysel ve Profesyonel (Lite, Pro, Elite) paketlerinde taahhüt, gizli sözleşmeler veya karmaşık iptal süreçleri yoktur. Aboneliğinizi kullanıcı panelinizden tek tıkla istediğiniz an iptal edebilirsiniz. İptal ettiğinizde, o ayki fatura döneminizin sonuna kadar mevcut haklarınızı kullanmaya devam edersiniz. Ayrıca Must-b, projelerinizi kendi yerel dizininizde ve sizin bağladığınız hesaplarda (Vercel, Supabase vb.) ayağa kaldırdığı için aboneliğiniz bitse bile; yazdırılan tüm kodlar, kurulan mimariler ve oluşturulan veritabanları sonsuza kadar %100 sizin mülkiyetinizde kalır. Bizi bir kilit değil, bir hızlandırıcı olarak görün."
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
