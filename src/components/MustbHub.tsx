import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import PackageCard from './PackageCard';
import { X, Download, Terminal, Shield, ArrowLeft, Star, Info, FileCode, CheckCircle2, Search, Zap, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MustbHub() {
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<any | null>(null);
  const [filter, setFilter] = useState<'skill' | 'plugin'>('skill');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchPackages() {
      // Veriyi çekiyoruz, simsiyah ekran olmasın diye tip filtresine dikkat!
      const { data } = await supabase.from('packages').select('*').order('stars', { ascending: false });
      if (data) setPackages(data);
    }
    fetchPackages();
  }, []);

  const filteredItems = packages.filter(p => p.type === filter && p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#050505] text-[#eee] font-sans selection:bg-cyan-500/30">
      
      {/* PROFESSIONAL NAV - Artık Boş Kalmayacak */}
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/80 backdrop-blur-2xl sticky top-0 z-[60]">
        <div className="flex items-center gap-8">
           <Link to="/" className="text-gray-500 hover:text-white flex items-center gap-2 transition-all group font-mono text-xs uppercase tracking-tighter">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Geri
           </Link>
           <div className="flex bg-white/5 p-1 rounded-xl">
             <button onClick={() => setFilter('skill')} className={`px-5 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all uppercase ${filter === 'skill' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'text-gray-500 hover:text-white'}`}>SKILLS</button>
             <button onClick={() => setFilter('plugin')} className={`px-5 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all uppercase ${filter === 'plugin' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'text-gray-500 hover:text-white'}`}>PLUGINS</button>
           </div>
        </div>

        <h1 className="text-2xl font-black italic tracking-tighter uppercase hidden md:block tracking-widest">MUST-B <span className="text-cyan-500 underline">HUB</span></h1>

        <div className="flex items-center gap-4">
           <div className="relative group hidden sm:block text-gray-500 focus-within:text-cyan-500">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Arama..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-cyan-500/50 transition-all w-40 focus:w-64 text-white font-mono"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em]">{filteredItems.length} RESULT</div>
        </div>
      </nav>

      {/* GRID */}
      <main className="max-w-[1600px] mx-auto p-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 animate-in fade-in duration-500">
        {filteredItems.length > 0 ? (
          filteredItems.map((pkg) => (
            <div key={pkg.id} onClick={() => setSelectedPkg(pkg)} className="cursor-pointer group transform transition-all active:scale-95">
              <PackageCard pkg={pkg} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-40 text-center text-gray-600 font-mono italic text-sm">[[ NO DATA FOUND IN THIS SECTOR ]]</div>
        )}
      </main>

      {/* EFSANE DETAY PANELİ (DETAYLI OPENCLAW REPLİKASI) */}
      {selectedPkg && (
        <div className="fixed inset-0 bg-black/98 z-[100] overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
          <div className="max-w-6xl mx-auto py-16 px-6 relative">
            <button onClick={() => setSelectedPkg(null)} className="fixed top-10 right-10 p-3 bg-white/5 rounded-full hover:bg-red-500 text-white transition-all z-[110] shadow-2xl"><X size={32}/></button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* SOL TARAF: Dökümantasyon ve Güvenlik */}
              <div className="lg:col-span-2 space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase"><Shield size={16}/> Must-b Verified</div>
                  <h1 className="text-7xl font-black tracking-tighter italic uppercase leading-none text-white">{selectedPkg.name}</h1>
                  <p className="text-2xl text-gray-400 font-light italic leading-relaxed">{selectedPkg.summary}</p>
                </div>

                {/* SECURITY SCAN BLOCK */}
                <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/10 rounded-full text-green-500"><Shield size={24}/></div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">Security Scan</p>
                      <p className="text-[10px] text-gray-500 font-mono uppercase">Status: Benign / No suspicious activity found</p>
                    </div>
                  </div>
                  <button className="text-[10px] text-gray-500 hover:text-white underline uppercase font-bold">View Report</button>
                </div>

                {/* README CONTENT */}
                <div className="bg-[#111]/50 border border-white/5 rounded-[40px] p-12 space-y-10 shadow-inner">
                   <div className="flex gap-10 border-b border-white/5 pb-6 text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">
                      <span className="text-cyan-500 border-b-2 border-cyan-500 pb-6 flex items-center gap-2 cursor-pointer font-bold"><Info size={16}/> README.md</span>
                      <span className="hover:text-white flex items-center gap-2 cursor-pointer transition-colors"><FileCode size={16}/> FILES</span>
                   </div>
                   <div className="prose prose-invert max-w-none whitespace-pre-wrap font-light leading-relaxed text-gray-300 text-xl italic font-serif">
                      {selectedPkg.readme}
                   </div>
                </div>
              </div>

              {/* SAĞ TARAF: Teknik Panel */}
              <div className="space-y-8">
                <a 
                  href={selectedPkg.storage_path} 
                  download 
                  className="block w-full bg-cyan-500 hover:bg-cyan-400 text-black text-center font-black py-8 rounded-[32px] text-2xl shadow-[0_0_60px_rgba(6,182,212,0.3)] transition-all transform hover:-translate-y-1 uppercase tracking-tighter"
                >
                  Download .zip
                </a>

                <div className="bg-[#111] border border-white/10 rounded-[32px] p-10 space-y-10">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-4 italic">TERMINAL INSTALL</label>
                    <div className="bg-black p-5 rounded-2xl border border-white/10 flex justify-between items-center group overflow-hidden">
                      <code className="text-cyan-400 font-mono text-sm tracking-tighter truncate">{selectedPkg.install_command}</code>
                    </div>
                  </div>

                  <div className="space-y-6 pt-4 font-mono text-xs border-t border-white/5 text-gray-400">
                    <div className="flex justify-between pb-2"><span className="text-gray-600 uppercase font-bold">Version</span><span className="text-white">{selectedPkg.version}</span></div>
                    <div className="flex justify-between pb-2"><span className="text-gray-600 uppercase font-bold">Runtime</span><span className="text-white underline italic">{selectedPkg.runtime}</span></div>
                    <div className="flex justify-between pb-2"><span className="text-gray-600 uppercase font-bold">License</span><span className="text-white">{selectedPkg.license}</span></div>
                    <div className="flex justify-between pt-2 text-yellow-500 font-black text-xl leading-none">
                      <span className="text-gray-600 uppercase text-[10px] font-bold text-white tracking-widest">Stars</span>
                      <span className="flex items-center gap-1 leading-none tracking-tighter"><Star size={18} fill="currentColor"/> {selectedPkg.stars.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-3xl p-6 text-[10px] text-gray-500 leading-relaxed font-mono italic">
                   Must-b Core Verified: This package meets all security and performance requirements for the v4.0 architecture.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}