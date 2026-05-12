import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('faq.items.localModels.q'),
      answer: t('faq.items.localModels.a')
    },
    {
      question: t('faq.items.apiKeys.q'),
      answer: t('faq.items.apiKeys.a')
    },
    {
      question: t('faq.items.offline.q'),
      answer: t('faq.items.offline.a')
    },
    {
      question: t('faq.items.swarm.q'),
      answer: t('faq.items.swarm.a')
    },
    {
      question: t('faq.items.cancel.q'),
      answer: t('faq.items.cancel.a')
    }
  ];

  return (
    <section className="py-24 px-6 relative border-t border-white/[0.04]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono text-primary uppercase tracking-[0.2em] mb-4">
            {t('faq.title')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t('faq.subtitle')}
          </h2>
          <p className="text-muted-foreground">
            {t('faq.desc')}
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
          <p className="text-white/80 font-medium mb-4">{t('faq.moreQuestions')}</p>
          <button className="text-primary font-bold hover:underline">
            {t('faq.discord')}
          </button>
        </div>
      </div>
    </section>
  );
}
