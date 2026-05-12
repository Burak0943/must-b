import React from "react";
import { Check, X, Shield, Zap, Database, Cpu } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FeatureMatrix() {
  const { t } = useTranslation();

  const tableData = [
    {
      category: t('pricing.matrix.categories.autonomous'),
      icon: Zap,
      features: [
        { name: t('pricing.matrix.items.volume'), free: "$2", pro: "$20", elite: "$100", local: t('pricing.matrix.values.unlimited') },
        { name: t('pricing.matrix.items.architecture'), free: t('pricing.matrix.values.single'), pro: t('pricing.matrix.values.hybrid'), elite: t('pricing.matrix.values.swarm'), local: t('pricing.matrix.values.customizable') },
        { name: t('pricing.matrix.items.artifacts'), free: false, pro: true, elite: true, local: t('pricing.matrix.values.advanced') },
        { name: t('pricing.matrix.items.autofix'), free: t('pricing.matrix.values.manual'), pro: t('pricing.matrix.values.autonomous'), elite: t('pricing.matrix.values.autonomousPlus'), local: t('pricing.matrix.values.archLevel') },
      ]
    },
    {
      category: t('pricing.matrix.categories.memory'),
      icon: Database,
      features: [
        { name: t('pricing.matrix.items.memoryType'), free: t('pricing.matrix.values.deviceBased'), pro: t('pricing.matrix.values.cloudSync'), elite: t('pricing.matrix.values.cloudSync'), local: t('pricing.matrix.values.dataCenter') },
        { name: t('pricing.matrix.items.indexing'), free: t('pricing.matrix.values.files'), pro: t('pricing.matrix.values.sirus'), elite: t('pricing.matrix.values.sirus'), local: t('pricing.matrix.values.sirus') },
        { name: t('pricing.matrix.items.research'), free: false, pro: t('pricing.matrix.values.partial'), elite: true, local: true },
      ]
    },
    {
      category: t('pricing.matrix.categories.security'),
      icon: Shield,
      features: [
        { name: t('pricing.matrix.items.privacy'), free: t('pricing.matrix.values.standard'), pro: t('pricing.matrix.values.standard'), elite: t('pricing.matrix.values.optional'), local: t('pricing.matrix.values.zeroTelemetry') },
        { name: t('pricing.matrix.items.offline'), free: false, pro: false, elite: false, local: t('pricing.matrix.values.airGapped') },
        { name: t('pricing.matrix.items.byok'), free: false, pro: false, elite: false, local: t('pricing.matrix.values.byok') },
        { name: t('pricing.matrix.items.skillstore'), free: false, pro: true, elite: true, local: true },
      ]
    }
  ];

  const renderCell = (val: any) => {
    if (typeof val === "boolean") {
      return val ? (
        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-white/10 mx-auto" />
      );
    }
    return <span className="text-sm text-white/80 font-medium text-center block whitespace-pre-wrap">{val}</span>;
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">{t('pricing.matrix.title')}</h2>
          <p className="text-muted-foreground">{t('pricing.matrix.version')}</p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/[0.08] bg-[#060709] backdrop-blur-xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="p-8 text-sm font-bold text-muted-foreground uppercase tracking-widest bg-white/[0.02]">{t('pricing.matrix.features')}</th>
                <th className="p-8 text-center bg-white/[0.02]">
                  <div className="text-white font-bold text-xl">Free</div>
                </th>
                <th className="p-8 text-center bg-primary/[0.05] relative">
                  <div className="text-primary font-bold text-xl">Pro</div>
                  <div className="absolute top-0 inset-x-0 h-1 bg-primary shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                </th>
                <th className="p-8 text-center bg-white/[0.02]">
                  <div className="text-white font-bold text-xl">Elite</div>
                </th>
                <th className="p-8 text-center bg-white/[0.02]">
                  <div className="text-purple-400 font-bold text-xl">Local (Sovereign)</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((category, catIdx) => (
                <React.Fragment key={catIdx}>
                  <tr className="bg-white/[0.03]">
                    <td colSpan={5} className="px-8 py-4">
                      <div className="flex items-center gap-3 text-white/40">
                        <category.icon className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">{category.category}</span>
                      </div>
                    </td>
                  </tr>
                  {category.features.map((feature, featIdx) => (
                    <tr key={featIdx} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                      <td className="p-8 text-white/70 group-hover:text-white transition-colors">
                        <span className="text-sm font-medium">{feature.name}</span>
                      </td>
                      <td className="p-8 border-l border-white/[0.04]">{renderCell(feature.free)}</td>
                      <td className="p-8 border-l border-white/[0.04] bg-primary/[0.02]">{renderCell(feature.pro)}</td>
                      <td className="p-8 border-l border-white/[0.04]">{renderCell(feature.elite)}</td>
                      <td className="p-8 border-l border-white/[0.04]">{renderCell(feature.local)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
