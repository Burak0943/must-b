import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase'; 
import PackageCard from './PackageCard';
import { ArrowLeft, Search, Cpu, Globe, Lock, Code } from 'lucide-react';
import { Link } from 'react-router-dom'; // Veya projen neyi kullanıyorsa (a etiketi de olur)

export default function MustbHub() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchPackages() {
      const { data } = await supabase
        .from('packages')
        .select('*')
        .order('stars', { ascending: false });

      if (data) setPackages(data);
      setLoading(false);
    }
    fetchPackages();
  }, []);

  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, packages]);

  // YÜKLEME ANİMASYONU KALDIRILDI (Sadece veri yokken boş döner)
  if (loading && packages.length === 0) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
      
      {/* YENİ SADE HEADER VE GERİ DÖN BUTONU */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Ana Sayfaya Dön</span>
            </Link>
            <div className="h-6 w-px bg-white/10 hidden md:block" />
            <h1 className="text-xl font-bold tracking-tighter hidden md:block">
              AGENT<span className="text-cyan-500">HUB</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/> {packages.length} YETENEK AKTİF</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* ARAMA BARI - DAHA SADE */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-500 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text"
              placeholder="Sistemde yetenek ara..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-gray-600 italic"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* KUTUCUKLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </main>
    </div>
  );
}