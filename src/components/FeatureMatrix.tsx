import { Check, X, Shield, Zap, Database, Cpu } from "lucide-react";

const tableData = [
  {
    category: "Otonom Yetenekler",
    icon: Zap,
    features: [
      { name: "Daily Limit (Günlük Hacim)", free: "$2", pro: "$20", elite: "$100", local: "Sınırsız" },
      { name: "Artifacts 2.0 (Görsel Kod Panelleri)", free: false, pro: true, elite: true, local: false },
      { name: "Multi-Agent Swarm (Ajan Sürüsü)", free: false, pro: false, elite: "13+ Ajan", local: "Sınırsız" },
      { name: "Auto-Fix (Hata Çözme)", free: false, pro: true, elite: true, local: true },
      { name: "Akıllı Rotalama (Model Router)", free: true, pro: true, elite: true, local: false },
    ]
  },
  {
    category: "Bağlam ve Hafıza",
    icon: Database,
    features: [
      { name: "Hafıza Tipi", free: "Lokal Context", pro: "Cloud LTM", elite: "Cloud LTM", local: "Lokal Context" },
      { name: "Dosya Okuma ve İndeksleme", free: "5 Dosya", pro: "Sınırsız", elite: "Sınırsız", local: "Sınırsız" },
      { name: "Deep Research & Scrape", free: false, pro: "Kısmi", elite: true, local: true },
    ]
  },
  {
    category: "Güvenlik ve Altyapı",
    icon: Shield,
    features: [
      { name: "Model Kullanımı", free: "Smart Routing", pro: "Smart Routing", elite: "Smart Routing", local: "Kendi API'n / Ollama" },
      { name: "Zero-Telemetry (Veri Gizliliği)", free: false, pro: false, elite: "Opsiyonel", local: true },
      { name: "Air-Gapped (Çevrimdışı Çalışma)", free: false, pro: false, elite: false, local: true },
      { name: "Full Skill Store Erişimi", free: false, pro: true, elite: true, local: true },
    ]
  }
];

export default function FeatureMatrix() {
  const renderCell = (val: any) => {
    if (typeof val === "boolean") {
      return val ? (
        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-white/10 mx-auto" />
      );
    }
    return <span className="text-sm text-white/80 font-medium text-center block">{val}</span>;
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Detaylı Özellik Karşılaştırması</h2>
          <p className="text-muted-foreground">V1.72.40 — Stratejik Yetenek Matrisi</p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/[0.08] bg-[#060709] backdrop-blur-xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="p-8 text-sm font-bold text-muted-foreground uppercase tracking-widest bg-white/[0.02]">Özellikler</th>
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
                  <div className="text-purple-400 font-bold text-xl">Local</div>
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

import React from "react";
