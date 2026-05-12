import { Check, Star, Zap, Shield, Server, ArrowRight, Rocket, Lock, Bot, ShieldCheck, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import FeatureMatrix from "./FeatureMatrix";

export default function PricingSection() {
  const { t } = useTranslation();

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

  const plans = [
    {
      id: "free",
      name: t('pricing.plans.free.title'),
      tagline: t('pricing.plans.free.tagline'),
      price: "0",
      desc: t('pricing.plans.free.desc'),
      features: t('pricing.plans.free.features', { returnObjects: true }) as string[],
      button: t('pricing.plans.free.button'),
      icon: Bot,
      color: "text-white/40",
      border: "border-white/10",
    },
    {
      id: "pro",
      name: t('pricing.plans.pro.title'),
      tagline: t('pricing.plans.pro.tagline'),
      price: "29",
      desc: t('pricing.plans.pro.desc'),
      features: t('pricing.plans.pro.features', { returnObjects: true }) as string[],
      button: t('pricing.plans.pro.button'),
      icon: Zap,
      color: "text-primary",
      border: "border-primary/50",
      popular: true,
    },
    {
      id: "elite",
      name: t('pricing.plans.elite.title'),
      tagline: t('pricing.plans.elite.tagline'),
      price: "99",
      desc: t('pricing.plans.elite.desc'),
      features: t('pricing.plans.elite.features', { returnObjects: true }) as string[],
      button: t('pricing.plans.elite.button'),
      icon: RocketIcon,
      color: "text-cyan-400",
      border: "border-cyan-400/20",
    },
    {
      id: "local",
      name: t('pricing.plans.local.title'),
      tagline: t('pricing.plans.local.tagline'),
      price: "199",
      desc: t('pricing.plans.local.desc'),
      features: t('pricing.plans.local.features', { returnObjects: true }) as string[],
      button: t('pricing.plans.local.button'),
      icon: Lock,
      color: "text-purple-400",
      border: "border-purple-400/20",
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6 relative overflow-hidden bg-[#060709]">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(34,211,238,0.05),transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-mono text-primary uppercase tracking-[0.3em] mb-4">
            {t('pricing.title')}
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('pricing.subtitle')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            {t('pricing.desc')}
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 xl:gap-8 mb-16"
        >
          {plans.map((plan) => (
            <motion.div 
              key={plan.id}
              variants={itemVariants} 
              className={`relative flex flex-col p-6 lg:p-8 rounded-3xl border ${plan.border} ${plan.popular ? 'bg-[#0a0c10] shadow-[0_0_30px_rgba(34,211,238,0.15)] lg:-translate-y-4' : 'bg-[#0a0c10]/50 backdrop-blur-sm'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-xs font-bold text-primary whitespace-nowrap backdrop-blur-md">
                    <Star className="w-3.5 h-3.5 fill-primary" />
                    {t('pricing.plans.pro.badge')}
                  </div>
                </div>
              )}

              <div className="mb-6 relative z-10">
                <div className={`w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-6`}>
                  <plan.icon className={`w-6 h-6 ${plan.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className={`text-xs font-bold ${plan.color} uppercase tracking-wider mb-2`}>{plan.tagline}</p>
                <p className="text-sm text-muted-foreground min-h-[40px]">{plan.desc}</p>
              </div>

              <div className="mb-6 relative z-10">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-sm font-mono text-muted-foreground">/{plan.id === 'local' ? 'yr' : 'mo'}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1 relative z-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white/90">
                    <Check className={`w-4 h-4 ${plan.color} shrink-0 mt-0.5`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all relative z-10 
                ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
                {plan.button}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Enterprise Block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-3xl border border-white/[0.08] bg-[#030405] overflow-hidden mt-20"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-600/50 to-transparent" />
          
          <div className="p-8 md:p-10 lg:p-12 relative z-10 flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-muted-foreground mb-6">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('pricing.enterprise.badge')}</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight uppercase">
                {t('pricing.enterprise.title')}
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl">
                {t('pricing.enterprise.desc')}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                <div className="flex gap-4">
                  <Server className="w-6 h-6 text-cyan-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{t('pricing.enterprise.features.onPrem.title')}</h4>
                    <p className="text-xs text-muted-foreground">{t('pricing.enterprise.features.onPrem.desc')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Shield className="w-6 h-6 text-cyan-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{t('pricing.enterprise.features.airGapped.title')}</h4>
                    <p className="text-xs text-muted-foreground">{t('pricing.enterprise.features.airGapped.desc')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Zap className="w-6 h-6 text-cyan-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{t('pricing.enterprise.features.independence.title')}</h4>
                    <p className="text-xs text-muted-foreground">{t('pricing.enterprise.features.independence.desc')}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Star className="w-6 h-6 text-cyan-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">{t('pricing.enterprise.features.customRd.title')}</h4>
                    <p className="text-xs text-muted-foreground">{t('pricing.enterprise.features.customRd.desc')}</p>
                  </div>
                </div>
              </div>

              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors">
                {t('pricing.enterprise.button')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden lg:flex w-[300px] h-[300px] shrink-0 items-center justify-center relative">
              <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-48 h-48 border border-white/10 rounded-3xl bg-black/50 backdrop-blur-xl flex items-center justify-center shadow-2xl">
                <Shield className="w-20 h-20 text-cyan-500/80" />
                <div className="absolute inset-0 border border-cyan-500/30 rounded-3xl animate-ping opacity-20" style={{ animationDuration: '3s' }} />
              </div>
            </div>
          </div>
        </motion.div>

        <FeatureMatrix />
      </div>
    </section>
  );
}

const RocketIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.74 5-2 5-2" />
    <path d="M12 15v5s3.03-.55 4.5-2c1.74-1.62 2-5 2-5" />
  </svg>
);
