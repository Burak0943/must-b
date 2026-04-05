import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import PackageCard from './PackageCard';
import { X, Download, ShieldCheck, Cpu, Terminal, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MustbHub() {
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<any | null>(null);

  useEffect(() => {
    async function fetchPackages() {
      const { data } = await supabase.from('packages').select('*').order('stars', { ascending: false });
      if (data) setPackages(data);
    }
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* NAV */}
      <nav className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
        <Link to="/" className="text-gray-500 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={20} /> Ana Sayfa
        </Link>
        <h1 className="text-2xl font-black tracking-tighter italic">MUST-B <span className="text-cyan-500 underline">HUB</span></h1>
        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">{packages.length} AJAN AKTİF</div>
      </nav>
      
      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} onClick={() => setSelectedPkg(pkg)} className="cursor-pointer group">
            <PackageCard pkg={pkg} />
          </div>
        ))}
      </div>

      {/* DETAY PANELİ (SAĞDAN AÇILAN) */}
      {selectedPkg && (
        <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-[#050505] border-l border-white/10 z-[100] p-12 shadow-2xl animate-in slide-in-from-right duration-500">
          <button onClick={() => setSelectedPkg(null)} className="absolute top-8 right-8 text-gray-500 hover:text-red-500 transition-colors">
            <X size={32} />
          </button>

          <div className="space-y-10 h-full flex flex-col">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs tracking-tighter">
                <ShieldCheck size={16} /> MUST-B CORE CERTIFIED
              </div>
              <h2 className="text-5xl font-black tracking-tighter italic uppercase">{selectedPkg.name}</h2>
              <p className="text-gray-500 font-mono text-sm">Geliştirici: {selectedPkg.author} | Sürüm: {selectedPkg.version}</p>
            </div>

            {/* UZUNCA AÇIKLAMA BÖLÜMÜ */}
            <div className="flex-1 overflow-y-auto pr-4 space-y-6">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <h3 className="text-cyan-500 font-bold mb-4 flex items-center gap-2 uppercase text-sm tracking-widest">
                  <Terminal size={18}/> Teknik Dökümantasyon
                </h3>
                <p className="text-gray-300 leading-relaxed font-light whitespace-pre-wrap">
                  {selectedPkg.long_description || selectedPkg.summary}
                </p>
              </div>
            </div>

            {/* İNDİRME BUTONU */}
            <div className="pt-8 border-t border-white/5 space-y-4">
              <a 
                href={selectedPkg.storage_path} 
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-6 rounded-3xl flex items-center justify-center gap-4 text-xl transition-all active:scale-95"
              >
                <Download size={28} /> PAKETİ ZIP OLARAK İNDİR
              </a>
              <p className="text-[10px] text-center text-gray-700 tracking-widest uppercase">Güvenli indirme hattı aktif. Tüm paketler taranmıştır.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}