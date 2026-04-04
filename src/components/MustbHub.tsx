import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// --- HUB CEPHANELİĞİ (GERÇEK VERİ SETİ) ---
const data = {
  counts: { skills: "1,422", plugins: "948" },
  skills: [
    { id: 1, name: 'Must-b WhatsApp Bridge', version: 'v2.4.0', summary: 'WhatsApp üzerinden otonom ajana erişin. Mesajları analiz eder, yanıt verir ve medya dosyalarını işler.', author: '@must-b_core', stars: '15.2k', downloads: '600k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 2, name: 'DeepSeek Coder Integration', version: 'v3.1.0', summary: 'Karmaşık kodlama görevleri için DeepSeek-V3 modellerini Must-b iş akışına entegre eder.', author: '@aytac', stars: '12.1k', downloads: '450k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 3, name: 'Must-b Vision Studio', version: 'v1.5.0', summary: 'Ekran görüntülerini analiz ederek UI hatalarını bulur ve @must-b protokolüyle düzeltir.', author: '@burak', stars: '9.4k', downloads: '310k', os: ['macOS', 'Windows'] },
    { id: 4, name: 'GitHub Repo Autopilot', version: 'v1.9.0', summary: 'Repoları klonlar, kod yapısını analiz eder ve Unit Testleri eksik olan kısımları tamamlar.', author: '@aytac', stars: '22k', downloads: '1.1m', os: ['Linux', 'macOS'] },
    { id: 5, name: 'Must-b PDF Brain', version: 'v1.0.8', summary: 'Binlerce sayfalık PDF dökümanını RAG teknolojisi ile tarar ve saniyeler içinde cevap verir.', author: '@must-b_core', stars: '18k', downloads: '890k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 6, name: 'Slack Enterprise Connector', version: 'v3.2.0', summary: 'Şirket içi Slack kanallarını izler, threadleri özetler ve Jira üzerinde otomatik ticket oluşturur.', author: '@enterprise_tools', stars: '5.5k', downloads: '120k', os: ['Linux', 'macOS'] },
    { id: 7, name: 'Must-b Google Sheets Sync', version: 'v1.2.0', summary: 'Verileri doğrudan Google tablolarına yazar veya tablolardan veri çekerek analiz raporları oluşturur.', author: '@must-b_core', stars: '8.9k', downloads: '210k', os: ['Cloud', 'Linux'] },
    { id: 8, name: 'PostgreSQL Expert Agent', version: 'v2.1.0', summary: 'Veritabanı şemalarını analiz eder, SQL sorguları yazar ve performans optimizasyonu yapar.', author: '@database_team', stars: '6.2k', downloads: '95k', os: ['Linux', 'Windows'] },
    { id: 9, name: 'Telegram Command Center', version: 'v2.0.1', summary: 'Telegram botu aracılığıyla sunucunuzdaki Must-b ajanını uzaktan yönetin ve durum raporları alın.', author: '@must-b_core', stars: '7.6k', downloads: '180k', os: ['Linux', 'Windows'] },
    { id: 10, name: 'Must-b Stripe Accountant', version: 'v2.1.0', summary: 'Stripe ödemelerini takip eder, iadeleri analiz eder ve aylık gelir projeksiyonu hazırlar.', author: '@finance_ai', stars: '4.2k', downloads: '33k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 11, name: 'AWS Infrastructure Deployer', version: 'v1.3.1', summary: 'Ajanın EC2, S3 ve RDS kaynaklarını Terraform üzerinden otomatik kurmasını sağlar.', author: '@devops_ninja', stars: '7.4k', downloads: '110k', os: ['Linux', 'macOS'] },
    { id: 12, name: 'Notion Workspace Bridge', version: 'v2.0.0', summary: 'Notion sayfalarınızı ajanın hafızasına ekler ve ortak çalışma alanlarını yönetir.', author: '@productivity', stars: '11k', downloads: '290k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 13, name: 'Crypto Market Analyst', version: 'v1.0.4', summary: 'Binance ve Coinbase üzerinden veri çekerek piyasa trendlerini analiz eder ve rapor sunar.', author: '@must-b_finance', stars: '3.8k', downloads: '42k', os: ['Linux', 'Windows'] },
    { id: 14, name: 'Figma to Tailwind Exporter', version: 'v0.9.8', summary: 'Figma tasarımlarını anında temiz Tailwind CSS koduna dönüştürür ve proje içine kaydeder.', author: '@ui_bot', stars: '19.2k', downloads: '400k', os: ['macOS', 'Windows'] },
    { id: 15, name: 'Jira Ticket Automator', version: 'v2.2.0', summary: 'Konuşmalardaki todo ları anlar ve Jira üzerinde otomatik görevler oluşturur.', author: '@pm_agent', stars: '3.3k', downloads: '45k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 16, name: 'Must-b Shopify Sync', version: 'v1.1.0', summary: 'E-ticaret ürün stoklarını takip eder ve düşük stok durumunda tedarikçiye mail atar.', author: '@ecom_bot', stars: '2.4k', downloads: '19k', os: ['Cloud', 'Linux'] }
  ],
  plugins: [
    { id: 1, name: 'Terminal Stream & Control', version: 'v2.5.0', summary: 'İşletim sistemi terminaline Must-b ajanının doğrudan güvenli erişimini ve komut yürütmesini sağlar.', author: '@native', stars: '25k', downloads: '2.4m', os: ['Linux', 'macOS', 'Windows'] },
    { id: 2, name: 'Browser Automation (Playwright)', version: 'v2.1.0', summary: 'Web sitelerinde insan gibi gezinir, formları doldurur ve veri toplama işlemlerini otonom yapar.', author: '@ruflo', stars: '19.5k', downloads: '900k', os: ['Linux', 'macOS'] },
    { id: 3, name: 'Must-b Long-Term Memory (LTM)', version: 'v4.0.0', summary: 'Ajanın önceki konuşmaları aylar sonra bile hatırlamasını sağlayan vektör veritabanı eklentisi.', author: '@must-b_core', stars: '30k', downloads: '3.5m', os: ['Linux', 'macOS', 'Windows'] },
    { id: 4, name: 'VRAM Dynamic Optimizer', version: 'v1.4.0', summary: 'Yerel modeller çalışırken ekran kartı belleğini (VRAM) anlık olarak boşaltır ve hızlandırır.', author: '@gpu_hacker', stars: '14.2k', downloads: '450k', os: ['Windows', 'Linux'] },
    { id: 5, name: 'Must-b VS Code Bridge', version: 'v3.0.0', summary: 'Doğrudan VS Code editörünüze bağlanarak ajanın kod yazmasına ve dosyaları yönetmesine izin verir.', author: '@aytac', stars: '45k', downloads: '5.2m', os: ['Linux', 'macOS', 'Windows'] },
    { id: 6, name: 'Docker Swarm Orchestrator', version: 'v1.0.2', summary: 'Ajanın kodları denemek için izole Docker konteynerleri açmasını ve kapatmasını sağlayan plugin.', author: '@devops_ninja', stars: '8.8k', downloads: '200k', os: ['Linux'] }
  ]
};

export default function MustbHub() {
  const [activeTab, setActiveTab] = useState<'skills' | 'plugins' | 'about'>('skills');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Filtreleme mantığı
  const filteredData = useMemo(() => {
    const source = activeTab === 'skills' ? data.skills : activeTab === 'plugins' ? data.plugins : [];
    return source.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, searchQuery]);

  const getInstallCommand = (name: string, type: string) => {
    const formattedName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `must-b install ${type === 'skills' ? 'skill' : 'plugin'} @must-b/${formattedName}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-6 md:p-12 font-sans relative overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
      </div>

      {/* Geri Dön Butonu */}
      <Link to="/" className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-red-500/50 rounded-full text-gray-400 hover:text-white transition-all backdrop-blur-xl group">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span className="text-sm font-medium">Ana Sayfa</span>
      </Link>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">Must-b Hub.</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Dünyanın en geniş otonom ajan ekosistemi. 1.400'den fazla doğrulanmış yetenek ile ajanınızı güçlendirin.
          </p>
        </div>

        {/* Tabs & Search Container */}
        <div className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md py-6 border-b border-white/5 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Tabs */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button onClick={() => setActiveTab('skills')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'skills' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Skills ({data.counts.skills})</button>
              <button onClick={() => setActiveTab('plugins')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'plugins' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Plugins ({data.counts.plugins})</button>
              <button onClick={() => setActiveTab('about')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'about' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>About</button>
            </div>

            {/* Search */}
            {activeTab !== 'about' && (
              <div className="w-full md:w-96 relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kütüphanede ara (örn: whatsapp, aws)..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-red-500/50 transition-all"
                />
                <svg className="absolute right-4 top-3.5 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            )}
          </div>
        </div>

        {/* Content Grid */}
        {activeTab !== 'about' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className="group bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.04] hover:border-red-500/30 transition-all cursor-pointer flex flex-col justify-between h-72"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-red-500 transition-colors">{item.name}</h3>
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-gray-400">{item.version}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{item.summary}</p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                   <span className="text-xs font-mono text-gray-500">{item.author}</span>
                   <div className="flex gap-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                     <span>{item.downloads} DL</span>
                     <span>{item.stars} Stars</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* About Section */
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center max-w-4xl mx-auto">
             <div className="w-24 h-24 bg-red-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-red-600/20">
               <img src="/mascot.png" alt="must-b" className="w-16 h-16 object-contain" />
             </div>
             <h2 className="text-3xl font-bold mb-6">Must-b: The Future of Sovereign AI</h2>
             <p className="text-gray-400 text-lg leading-relaxed mb-8">
               Must-b, verilerinizin gizliliğini korurken yapay zekanın sınırsız gücünü yerel donanımınıza getiren merkeziyetsiz bir framework'tür. 
               Bu hub, binlerce geliştiricinin katkıda bulunduğu devasa bir zeka kütüphanesidir.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
               <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                 <h4 className="text-red-500 font-bold mb-2">Private</h4>
                 <p className="text-xs text-gray-500">Tüm yetenekler yerel donanımınızda icra edilir.</p>
               </div>
               <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                 <h4 className="text-red-500 font-bold mb-2">Global</h4>
                 <p className="text-xs text-gray-500">Must-b Cloud ile kimliğiniz her yerde senkron.</p>
               </div>
               <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                 <h4 className="text-red-500 font-bold mb-2">Autonomous</h4>
                 <p className="text-xs text-gray-500">Ajanlar görevleri kendi başına planlar ve bitirir.</p>
               </div>
             </div>
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-10">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-4xl font-bold">{selectedItem.name}</h2>
                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <p className="text-gray-400 text-lg mb-8">{selectedItem.summary}</p>
              
              <div className="bg-black p-6 rounded-2xl border border-white/5 mb-8">
                <p className="text-xs font-bold text-gray-600 uppercase mb-3 tracking-widest">Kurulum Komutu</p>
                <div className="flex justify-between items-center font-mono text-emerald-500">
                  <span>{getInstallCommand(selectedItem.name, activeTab)}</span>
                  <button onClick={() => {navigator.clipboard.writeText(getInstallCommand(selectedItem.name, activeTab))}} className="text-gray-500 hover:text-white transition-colors">COPY</button>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-bold pt-6 border-t border-white/5">
                <span className="text-gray-500">Yazar: {selectedItem.author}</span>
                <div className="flex gap-6">
                  <span className="text-red-500">{selectedItem.downloads} İndirme</span>
                  <span className="text-red-500">{selectedItem.stars} Yıldız</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}