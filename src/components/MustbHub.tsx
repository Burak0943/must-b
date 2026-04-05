import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import PackageCard from './PackageCard';
import { X, Download, Terminal, Shield, ArrowLeft, Star, Info, FileCode, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MustbHub() {
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<any | null>(null);
  const [filter, setFilter] = useState<'skill' | 'plugin'>('skill');

  useEffect(() => {
    async function fetchPackages() {
      const { data } = await supabase.from('packages').select('*').order('stars', { ascending: false });
      if (data) setPackages(data);
    }
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ddd] font-sans">
      {/* NAV */}
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <Link to="/" className="text-gray-500 hover:text-white flex items-center gap-2"><ArrowLeft size={18}/> Geri</Link>
        <div className="flex gap-4">
          <button onClick={() => setFilter('skill')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'skill' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'hover:bg-white/5'}`}>SKILLS</button>
          <button onClick={() => setFilter('plugin')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'plugin' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'hover:bg-white/5'}`}>PLUGINS</button>
        </div>
        <h1 className="text-xl font-black italic tracking-tighter uppercase">MUST-B <span className="text-cyan-500 underline">HUB</span></h1>
      </nav>

      {/* GRID */}
      <main className="max-w-7xl mx-auto p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {packages.filter(p => p.type === filter).map((pkg) => (
          <div key={pkg.id} onClick={() => setSelectedPkg(pkg)} className="cursor-pointer">
            <PackageCard pkg={pkg} />
          </div>
        ))}
      </main>

      {/* EFSANE DETAY PANELİ (OPENCLAW TARZI) */}
      {selectedPkg && (
        <div className="fixed inset-0 bg-black/98 z-[100] overflow-y-auto animate-in fade-in duration-300">
          <div className="max-w-6xl mx-auto py-20 px-6">
            <button onClick={() => setSelectedPkg(null)} className="fixed top-10 right-10 text-gray-500 hover:text-white transition-all"><X size={40}/></button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* SOL KOLON: İçerik */}
              <div className="lg:col-span-2 space-y-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest"><Shield size={16}/> MUST-B CERTIFIED</div>
                  <h1 className="text-7xl font-black italic uppercase leading-tight">{selectedPkg.name}</h1>
                  <p className="text-2xl text-gray-400 font-light">{selectedPkg.summary}</p>
                </div>

                {/* TABBED AREA */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 space-y-10">
                  <div className="flex gap-10 border-b border-white/5 pb-6 text-sm font-mono text-gray-500">
                    <span className="text-cyan-500 border-b-2 border-cyan-500 pb-6 flex items-center gap-2 cursor-pointer"><Info size={16}/> README.md</span>
                    <span className="hover:text-white flex items-center gap-2 cursor-pointer transition-colors"><FileCode size={16}/> FILES</span>
                  </div>
                  <div className="prose prose-invert max-w-none whitespace-pre-wrap font-light text-gray-300 leading-relaxed text-lg italic">
                    {selectedPkg.readme}
                  </div>
                </div>
              </div>

              {/* SAĞ KOLON: İstatistikler ve Kurulum */}
              <div className="space-y-6">
                <a href={selectedPkg.storage_path} download className="block w-full bg-cyan-500 hover:bg-cyan-400 text-black text-center font-black py-7 rounded-3xl text-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] transition-all transform hover:-translate-y-1">
                  DOWNLOAD .ZIP
                </a>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-4">CLI INSTALL</label>
                    <div className="bg-black p-5 rounded-2xl border border-white/10 flex justify-between items-center">
                      <code className="text-cyan-400 font-mono text-sm">{selectedPkg.install_command}</code>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 text-sm font-mono">
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">Version</span><span>{selectedPkg.version}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">Security</span><span className="text-green-500 flex items-center gap-1"><CheckCircle2 size={14}/> {selectedPkg.security_status}</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">License</span><span>{selectedPkg.license}</span></div>
                    <div className="flex justify-between text-yellow-500"><span className="text-gray-500 text-white">Stars</span><span className="flex items-center gap-1"><Star size={14} fill="currentColor"/> {selectedPkg.stars.toLocaleString()}</span></div>
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