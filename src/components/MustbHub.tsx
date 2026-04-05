import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import PackageCard from './PackageCard';
import { X, Download, Terminal, Shield, FileCode, ArrowLeft, Star, Info } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0d0d0d] text-[#e0e0e0] font-sans">
      {/* NAV */}
      <nav className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm"><ArrowLeft size={16}/> Ana Sayfa</Link>
        <div className="font-black tracking-widest text-xl italic">MUST-B <span className="text-cyan-500">HUB</span></div>
        <div className="text-[10px] font-mono opacity-40">{packages.length} AJAN HAZIR</div>
      </nav>

      {/* GRID */}
      <main className="max-w-[1600px] mx-auto p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} onClick={() => setSelectedPkg(pkg)} className="cursor-pointer">
            <PackageCard pkg={pkg} />
          </div>
        ))}
      </main>

      {/* PROFESYONEL DETAY GÖRÜNÜMÜ */}
      {selectedPkg && (
        <div className="fixed inset-0 bg-black/95 z-[100] overflow-y-auto animate-in fade-in duration-200">
          <div className="max-w-6xl mx-auto min-h-screen p-10">
            <button onClick={() => setSelectedPkg(null)} className="fixed top-10 right-10 p-4 bg-white/5 rounded-full hover:bg-red-500 transition-all text-white"><X size={32}/></button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* SOL KOLON: Özet Bilgi */}
              <div className="lg:col-span-2 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-cyan-400 font-mono text-sm tracking-widest"><Shield size={18}/> MUST-B VERIFIED</div>
                  <h1 className="text-6xl font-black tracking-tighter italic uppercase">{selectedPkg.name}</h1>
                  <p className="text-xl text-gray-400">{selectedPkg.summary}</p>
                </div>

                {/* README BÖLÜMÜ (İstediğin Uzun Açıklama) */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10">
                  <h3 className="text-sm font-mono text-gray-500 uppercase mb-6 flex items-center gap-2"><Info size={16}/> README.md</h3>
                  <div className="prose prose-invert max-w-none font-light leading-loose opacity-80 whitespace-pre-wrap">
                    {selectedPkg.readme}
                  </div>
                </div>
              </div>

              {/* SAĞ KOLON: İndirme ve Teknik */}
              <div className="space-y-6">
                <a href={selectedPkg.storage_path} download className="block w-full bg-cyan-500 hover:bg-cyan-400 text-black text-center font-black py-6 rounded-2xl text-xl shadow-[0_0_50px_rgba(6,182,212,0.2)] transition-all">
                  DOWNLOAD .ZIP
                </a>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-3">Hızlı Kurulum (CLI)</label>
                    <div className="bg-black p-4 rounded-xl border border-white/10 flex justify-between items-center group">
                      <code className="text-cyan-400 font-mono text-sm">{selectedPkg.install_command}</code>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/40 p-4 rounded-xl text-center"><p className="text-xs text-gray-500 uppercase">Sürüm</p><p className="font-bold">{selectedPkg.version}</p></div>
                    <div className="bg-black/40 p-4 rounded-xl text-center"><p className="text-xs text-gray-500 uppercase">Yıldız</p><p className="font-bold">{selectedPkg.stars}</p></div>
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