import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase'; 
import PackageCard from './PackageCard';
import { Search, Terminal, Cpu, Zap, ShieldCheck } from 'lucide-react';

export default function MustbHub() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPackages() {
      try {
        setLoading(true);
        // 1400 verinin hepsini tek seferde çekmek yerine limit koyabilirsin, 
        // ama şimdilik client-side search için hepsini çekiyoruz.
        const { data, error: sbError } = await supabase
          .from('packages')
          .select('*')
          .order('downloads', { ascending: false });

        if (sbError) throw sbError;
        if (data) setPackages(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  // Gelişmiş Arama Filtresi
  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, packages]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-cyan-400 font-mono animate-pulse">[[ AJANLAR SENKRONİZE EDİLİYOR... ]]</p>
    </div>
  );

  if (error) return (
    <div className="bg-red-500/10 border border-red-500 p-6 rounded-lg text-red-500 text-center my-10">
      <p className="font-bold">Bağlantı Hatası!</p>
      <p className="text-sm">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 underline">Tekrar Dene</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* ÜST BİLGİ VE İSTATİSTİKLER */}
      <div className="relative mb-16 overflow-hidden bg-gradient-to-r from-cyan-900/20 to-transparent p-8 rounded-3xl border border-white/5">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-cyan-400 mb-4 font-mono text-sm tracking-widest">
            <Terminal size={16} /> <span>MUST-B CORE NETWORK v4.0</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter italic">
            AGENT <span className="text-cyan-500">HUB</span>
          </h1>
          <div className="flex flex-wrap gap-6 text-gray-400 text-sm font-mono">
            <div className="flex items-center gap-2"><Cpu size={14}/> {packages.length} YETENEK</div>
            <div className="flex items-center gap-2"><Zap size={14}/> OTONOM AKTİF</div>
            <div className="flex items-center gap-2"><ShieldCheck size={14}/> GÜVENLİ RLS</div>
          </div>
        </div>
      </div>

      {/* ARAMA BARI */}
      <div className="relative mb-12">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
          <Search size={20} />
        </div>
        <input 
          type="text"
          placeholder="Yetenek ara (örn: Vision, Logic, Crypto...)"
          className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* SONUÇLAR */}
      {filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
          <p className="text-gray-500 font-mono text-lg italic">" {searchTerm} " ile eşleşen bir ajan bulunamadı.</p>
        </div>
      )}
    </div>
  );
}