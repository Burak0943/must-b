import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; 
import PackageCard from './PackageCard';
import { X, Download, Terminal, Shield, ArrowLeft, Star, Info, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MustbHub() {
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPackages() {
      const { data } = await supabase.from('packages').select('*').order('stars', { ascending: false });
      if (data) setPackages(data);
      setLoading(false);
    }
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#eee] font-sans selection:bg-cyan-500/30">
      
      {/* HEADER - Artık Boş Kalmayacak */}
      <nav className="border-b border-white/5 h-20 flex items-center justify-between px-10 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={20}/> <span className="text-sm">Ana Sayfa</span>
        </Link>
        <div className="text-2xl font-black italic tracking-tighter uppercase">
          MUST-B <span className="text-cyan-500 underline text-3xl">HUB</span>
        </div>
        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
          {packages.length} AJAN AKTİF
        </div>
      </nav>

      {/* LİSTE */}
      <main className="max-w-[1600px] mx-auto p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
            <div className="col-span-full py-20 text-center animate-pulse text-gray-500 font-mono italic">
                [[ SİSTEM TARANIYOR... ]]
            </div>
        ) : packages.map((pkg) => (
          <div key={pkg.id} onClick={() => setSelectedPkg(pkg)} className="cursor-pointer transform transition-all active:scale-95">
            <PackageCard pkg={pkg} />
          </div>
        ))}
      </main>

      {/* EFSANE DETAY PANELİ */}
      {selectedPkg && (
        <div className="fixed inset-0 bg-black/98 z-[100] overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
          <div className="max-w-6xl mx-auto p-6 md:p-12">
            <button onClick={() => setSelectedPkg(null)} className="fixed top-8 right-8 p-3 bg-white/5 rounded-full hover:bg-red-500 text-white transition-all shadow-2xl"><X size={32}/></button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* SOL TARAF: Uzun Açıklama ve Detaylar */}
              <div className="lg:col-span-2 space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase"><Shield size={16}/> Must-b Certified</div>
                  <h1 className="text-7xl font-black tracking-tighter italic uppercase leading-none">{selectedPkg.name}</h1>
                  <p className="text-2xl text-gray-400 font-light italic">{selectedPkg.summary}</p>
                </div>

                {/* README BÖLÜMÜ */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 space-y-8 shadow-inner">
                   <div className="flex gap-8 border-b border-white/5 pb-4 text-xs font-mono text-gray-500 uppercase tracking-widest">
                      <span className="text-white border-b border-cyan-500 pb-4 flex items-center gap-2"><Info size={14}/> Readme.md</span>
                      <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"><Layers size={14}/> Files</span>
                   </div>
                   <div className="prose prose-invert max-w-none whitespace-pre-wrap font-light leading-relaxed text-gray-300 text-lg">
                      {selectedPkg.readme}
                   </div>
                </div>
              </div>

              {/* SAĞ TARAF: İndirme ve Terminal */}
              <div className="space-y-6">
                <a href={selectedPkg.storage_path} download className="block w-full bg-cyan-500 hover:bg-cyan-400 text-black text-center font-black py-7 rounded-3xl text-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] transition-all transform hover:-translate-y-1">
                  DOWNLOAD .ZIP
                </a>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-4 italic">TERMINAL INSTALL</label>
                    <div className="bg-black p-5 rounded-2xl border border-white/10 flex justify-between items-center group overflow-hidden">
                      <code className="text-cyan-400 font-mono text-sm tracking-tighter truncate">{selectedPkg.install_command}</code>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 font-mono text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">Version</span><span>{selectedPkg.version}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">Downloads</span><span>{selectedPkg.downloads.toLocaleString()}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">License</span><span className="text-cyan-500">MUST-B MIT</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}