import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Dosya adın lib/supabase.ts olduğu için böyle
import PackageCard from './PackageCard';
import { X, Download, ShieldCheck, Terminal, ArrowLeft } from 'lucide-react';
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

  if (loading && packages.length === 0) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 relative selection:bg-cyan-500/30">
      <nav className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
        <Link to="/" className="text-gray-500 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={20} /> Ana Sayfaya Dön
        </Link>
        <h1 className="text-2xl font-black tracking-tighter italic">MUST-B <span className="text-cyan-500 underline text-3xl">HUB</span></h1>
        <div className="text-xs font-mono text-gray-500">{packages.length} AJAN AKTİF</div>
      </nav>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} onClick={() => setSelectedPkg(pkg)} className="cursor-pointer group active:scale-95 transition-all">
            <PackageCard pkg={pkg} />
          </div>
        ))}
      </div>

      {selectedPkg && (
        <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-[#050505] border-l border-white/10 z-[100] p-12 shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
          <button onClick={() => setSelectedPkg(null)} className="absolute top-8 right-8 text-gray-500 hover:text-red-500 transition-colors">
            <X size={32} />
          </button>

          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs tracking-tighter">
                <ShieldCheck size={16} /> MUST-B CORE CERTIFIED
              </div>
              <h2 className="text-5xl font-black tracking-tighter italic uppercase leading-tight">{selectedPkg.name}</h2>
              <p className="text-gray-500 font-mono text-sm">Geliştirici: {selectedPkg.author} | Sürüm: {selectedPkg.version}</p>
            </div>

            <div className="bg-white/5 p-8 rounded-3xl border border-white/5 space-y-6">
              <h3 className="text-cyan-500 font-bold flex items-center gap-2 uppercase text-sm tracking-widest border-b border-white/5 pb-4">
                <Terminal size={18}/> Teknik Dökümantasyon
              </h3>
              <p className="text-gray-300 leading-relaxed font-light whitespace-pre-wrap text-lg italic">
                {selectedPkg.long_description || selectedPkg.summary}
              </p>
            </div>

            <div className="space-y-4 pt-6">
              <a 
                href={selectedPkg.storage_path} 
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-6 rounded-3xl flex items-center justify-center gap-4 text-2xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]"
              >
                <Download size={28} /> AJANI .ZIP OLARAK İNDİR
              </a>
              <p className="text-[10px] text-center text-gray-700 tracking-widest uppercase">Paket şifreli ve imzalıdır. Güvenle indirilebilir.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}