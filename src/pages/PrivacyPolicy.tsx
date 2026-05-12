import React from 'react';
import Navbar from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';
import { motion } from 'framer-motion';
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const sections = t('privacy.sections', { returnObjects: true }) as any[];

  return (
    <div className="min-h-screen bg-[#050608] text-foreground font-sans selection:bg-primary/30">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            {t('privacy.title')}
          </h1>
          <p className="text-muted-foreground font-mono text-sm mb-12">{t('privacy.lastUpdated')}</p>
          
          <div className="prose prose-invert prose-sm md:prose-base max-w-none space-y-8 text-white/70 leading-relaxed">
            {sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-xl font-semibold text-white mb-4">{section.title}</h2>
                <p>{section.content}</p>
              </section>
            ))}
          </div>
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
}
