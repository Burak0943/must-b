import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // <-- YENİ: Yönlendirme için eklendi

// --- DEVASA GENİŞLETİLMİŞ VERİ SETİ (İLLÜZYON İÇİN) ---
const data = {
  counts: {
    skills: '1,200+',
    plugins: '850+',
  },
  skills: [
    { id: 1, name: 'Self-improving-agent', version: 'v1.24.0', summary: 'Kendi hatalarını analiz edip kodunu düzelten 4 aşamalı otonom ajan. Kod yazar, test eder, düzeltir.', author: '@aytac', stars: '4.8k', downloads: '125k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 2, name: 'Fuzzy Patch Engine', version: 'v1.23.5', summary: 'Bozuk boşlukları ve indentasyon hatalarını tolere eden 3 aşamalı yama motoru. Dosya düzenlemelerini kusursuzlaştırır.', author: '@burak', stars: '3.2k', downloads: '89k', os: ['Linux', 'macOS'] },
    { id: 3, name: 'RAM Doctor', version: 'v1.0.0', summary: 'Sistem belleğine göre ajan performansını dinamik olarak kısıtlayan/açan modül. PC çökmesini engeller.', author: '@core_team', stars: '5.1k', downloads: '210k', os: ['Windows', 'Linux'] },
    { id: 4, name: '3-Tier Router', version: 'v1.21.0', summary: 'Görev zorluğuna göre LLM modelini otomatik seçerek API maliyetini yerle bir eder.', author: '@aytac', stars: '6.4k', downloads: '340k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 5, name: 'X (Twitter) Search', version: 'v2.0.1', summary: 'X üzerindeki gönderileri, trendleri ve kullanıcıları gerçek zamanlı tarayan analitik ajanı.', author: '@social_bot', stars: '1.2k', downloads: '45k', os: ['Linux', 'Windows'] },
    { id: 6, name: 'Trello Board Manager', version: 'v1.1.0', summary: 'Trello REST API üzerinden kartları okur, taşır ve projeleri ajan aracılığıyla otomatik yönetir.', author: '@pm_agent', stars: '890', downloads: '32k', os: ['macOS', 'Windows'] },
    { id: 7, name: 'Slack Communicator', version: 'v3.4', summary: 'Must-b ajanının Slack kanallarına mesaj atmasını, okumasını ve reaksiyon vermesini sağlar.', author: '@mustb_core', stars: '2.1k', downloads: '76k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 8, name: 'Obsidian Vault Sync', version: 'v2.2', summary: 'Yerel Obsidian Markdown notlarını okuyup onlardan bağlam çıkaran (RAG) hafıza modülü.', author: '@knowledge_base', stars: '7.8k', downloads: '150k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 9, name: 'AWS Infrastructure Deployer', version: 'v1.5', summary: 'Ajanın Terraform veya CDK kullanarak AWS üzerinde sunucu ve veritabanı kurmasını sağlar.', author: '@devops_ninja', stars: '4.7k', downloads: '88k', os: ['Linux', 'macOS'] },
    { id: 10, name: 'Notion Workspace Sync', version: 'v1.8', summary: 'Notion sayfalarını okur, düzenler ve ajan için devasa bir şirket içi bilgi havuzu oluşturur.', author: '@productivity', stars: '3.9k', downloads: '102k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 11, name: 'Figma to Code', version: 'v0.9.beta', summary: 'Figma tasarımlarını analiz edip doğrudan React/Tailwind bileşenlerine dönüştürür.', author: '@ui_bot', stars: '8.4k', downloads: '180k', os: ['macOS', 'Windows'] },
    { id: 12, name: 'Stripe Finance Analyst', version: 'v2.1', summary: 'Stripe API ile gelir-gider tablolarını okur, analiz eder ve CEO için günlük finansal özet çıkarır.', author: '@finance_ai', stars: '1.1k', downloads: '22k', os: ['Linux', 'macOS'] },
    { id: 13, name: 'Supabase Admin', version: 'v2.0', summary: 'Veritabanı şemalarını okur, RLS politikalarını test eder ve güvenli SQL sorguları yazar.', author: '@burak', stars: '9.1k', downloads: '450k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 14, name: 'Linear Ticket Creator', version: 'v1.3', summary: 'Kullanıcı geri bildirimlerinden otomatik olarak Linear issue oluşturur ve etiketler.', author: '@pm_agent', stars: '2.5k', downloads: '45k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 15, name: 'Shopify Product Sync', version: 'v1.0.1', summary: 'E-ticaret sitenizdeki ürünleri ajan aracılığıyla günceller, stok kontrolü yapar.', author: '@ecom_bot', stars: '780', downloads: '15k', os: ['Linux', 'Windows'] },
    { id: 16, name: 'SEO Content Analyzer', version: 'v1.0', summary: 'Web sitelerini tarar, anahtar kelime eksiklerini bulur ve ajan aracılığıyla makale optimize eder.', author: '@marketer', stars: '1.8k', downloads: '30k', os: ['macOS', 'Windows'] },
  ],
  plugins: [
    { id: 1, name: 'Terminal Stream', version: 'v2.1', summary: 'İşletim sistemi terminaline doğrudan müdahale ve okuma yeteneği sağlar. Tehlikeli ama güçlü.', author: '@native', stars: '4.1k', downloads: '200k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 2, name: 'Browser Vision (Playwright)', version: 'v1.5', summary: 'Arayüzü test etmek için tarayıcıyı açıp ekranı piksellerine kadar analiz eder.', author: '@ruflo', stars: '2.8k', downloads: '89k', os: ['Linux', 'macOS'] },
    { id: 3, name: 'PostgreSQL Vector Memory', version: 'v3.0', summary: 'Must-b ajanına uzun süreli bellek kazandıran Supabase / pgvector eklentisi.', author: '@database_team', stars: '5.5k', downloads: '400k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 4, name: 'Local VRAM Optimizer', version: 'v1.2', summary: 'Açık kaynaklı yerel modeller (Llama, Mistral) çalışırken VRAM kullanımını %40 azaltan bypass.', author: '@gpu_hacker', stars: '8.9k', downloads: '500k', os: ['Windows', 'Linux'] },
    { id: 5, name: 'Docker Container Spawner', version: 'v2.0', summary: 'Ajanın kodları test etmek için izole ve güvenli Docker konteynerleri yaratıp yok etmesini sağlar.', author: '@devops_bot', stars: '3.4k', downloads: '110k', os: ['Linux', 'macOS'] },
    { id: 6, name: 'GitHub PR Reviewer', version: 'v1.1', summary: 'Açılan Pull Requestleri otonom olarak okur, kod incelemesi yapar ve yorum bırakır.', author: '@aytac', stars: '4.2k', downloads: '95k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 7, name: 'VS Code Extension Bridge', version: 'v1.0', summary: 'Must-b ajanının doğrudan VS Code editörünüze müdahale edip kod yazmasını sağlayan yerel köprü.', author: '@core_team', stars: '12k', downloads: '800k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 8, name: 'Ngrok Tunneling', version: 'v1.4', summary: 'Yerel ajanı dış dünyaya açarak web hook dinlemesini ve API sunmasını sağlar.', author: '@networker', stars: '2.1k', downloads: '45k', os: ['macOS', 'Windows'] },
    { id: 9, name: 'FastAPI Microservice Spawn', version: 'v1.0', summary: 'Ajanın karmaşık görevler için anlık FastAPI mikro servisleri oluşturup deploy etmesini sağlar.', author: '@backend_ai', stars: '920', downloads: '22k', os: ['Linux'] },
    { id: 10, name: 'Salesforce CRM Connector', version: 'v2.3', summary: 'Salesforce verilerini okur, ajan aracılığıyla fırsatları (lead) otomatik günceller.', author: '@enterprise', stars: '1.5k', downloads: '40k', os: ['Windows', 'Linux'] },
  ]
};

export default function MustbHub() {
  const [activeTab, setActiveTab] = useState<'skills' | 'plugins' | 'about'>('skills');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const currentData = activeTab === 'skills' ? data.skills : activeTab === 'plugins' ? data.plugins : [];
  const filteredData = currentData.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getInstallCommand = (name: string, type: string) => {
    const formattedName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `must-b install ${type === 'skills' ? 'skill' : 'plugin'} @must-b/${formattedName}`;
  };

  return (
    <div className="min-h-screen bg-[#111111] text-gray-200 p-8 font-sans relative overflow-hidden">
      
      {/* Arka plan Cyberpunk Efekti */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg>
      </div>

      {/* --- YENİ EKLENEN: GERİ DÖN BUTONU --- */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-50">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-gray-800 hover:border-gray-500 rounded-full text-gray-400 hover:text-white transition-all backdrop-blur-md group shadow-lg"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span className="text-sm font-medium">Ana Sayfa</span>
        </Link>
      </div>

      {/* Üst Başlık ve Arama */}
      <div className="max-w-7xl mx-auto mb-10 text-center relative z-10 pt-12 md:pt-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">Must-b Hub. </span> 
          Decentralized Agentic Ecosystem.
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
          The sovereign platform for autonomous AI agents. Install, execute, and scale agentic skills on your own hardware, synchronized globally.
        </p>

        {/* Sekmeler (Tabs) */}
        <div className="flex justify-center space-x-6 mb-8 border-b border-gray-800 pb-4">
          <button onClick={() => setActiveTab('skills')} className={`pb-2 px-2 text-lg font-medium transition-colors ${activeTab === 'skills' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-500 hover:text-gray-300'}`}>Skills ({data.counts.skills})</button>
          <button onClick={() => setActiveTab('plugins')} className={`pb-2 px-2 text-lg font-medium transition-colors ${activeTab === 'plugins' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-500 hover:text-gray-300'}`}>Plugins ({data.counts.plugins})</button>
          <button onClick={() => setActiveTab('about')} className={`pb-2 px-2 text-lg font-medium transition-colors ${activeTab === 'about' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-500 hover:text-gray-300'}`}>About must-b OS</button>
        </div>

        {/* Arama Çubuğu */}
        {activeTab !== 'about' && (
          <div className="max-w-3xl mx-auto flex gap-4 items-center bg-[#1a1a1a] p-2 rounded-lg border border-gray-800 focus-within:border-red-900/50 transition-colors shadow-inner shadow-black/30">
            <svg className="w-6 h-6 text-gray-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Skill veya plugin ara (örn: aws, ram, linear, stripe)..." 
              className="w-full bg-transparent border-none focus:outline-none text-gray-200 placeholder:text-gray-600 font-mono text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Ana İçerik Alanı */}
      <div className="max-w-7xl mx-auto relative z-10">
        {activeTab !== 'about' ? (
          // KART IZGARASI (GRID)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item: any) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-6 hover:border-red-900/70 hover:bg-[#1a1a1a] transition-all cursor-pointer group flex flex-col justify-between h-full shadow-lg shadow-black/70 hover:-translate-y-1"
              >
                <div>
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-red-400 transition-colors line-clamp-1">{item.name}</h3>
                    <span className="text-xs font-mono bg-gray-800 text-gray-400 px-2 py-1 rounded shrink-0">{item.version}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-6 line-clamp-3 leading-relaxed">{item.summary}</p>
                </div>

                <div className="mt-auto">
                  {item.os && (
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {item.os.map((os: string) => (
                        <span key={os} className="text-[10px] uppercase tracking-wider bg-[#222] border border-[#333] text-gray-400 px-2 py-0.5 rounded-full">{os}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800/50 pt-4 mt-2 font-mono">
                    <span className="font-medium text-gray-300">{item.author}</span>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>{item.downloads}</span>
                      <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>{item.stars}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // --- ABOUT MUST-B OS (HAKKIMIZDA) BÖLÜMÜ ---
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-10 shadow-2xl shadow-black/70 flex flex-col items-center text-center">
            <div className="relative mb-10 group">
              <div className="absolute inset-0 rounded-3xl bg-red-900/20 blur-2xl scale-125 animate-pulse" />
              <div className="absolute inset-0 rounded-3xl bg-red-900/10 blur-3xl scale-150" />
              <div className="relative w-28 h-28 rounded-3xl overflow-hidden border border-white/10 bg-[#0f1115] flex items-center justify-center shadow-2xl shadow-red-900/30 group-hover:border-red-600/50 transition-colors">
                <img src="/mascot.png" alt="must-b fox agent" className="w-[85%] h-[85%] object-contain pointer-events-none group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>

            <h2 className="text-4xl font-extrabold text-gray-100 mb-6 tracking-tight">Must-b: The Autonomous Agent Framework</h2>
            
            <div className="max-w-3xl space-y-6 text-gray-400 text-lg leading-relaxed font-sans">
              <p>Current AI is monolithic and cloud-dependent. Your data is not your own. Your tools are controlled by others.</p>
              <p><span className="text-red-400 font-bold">must-b breaks this paradigm.</span> We are a decentralized framework designed for sovereign intelligence. We provide the "Cloud Brain" for global synchronization, identity, and security, while your own hardware provides the "Local Muscle" for private, low-latency execution.</p>
              <blockquote className="border-l-4 border-red-900/50 pl-6 py-2 bg-[#1a1a1a] rounded-r-lg text-gray-300 font-medium italic">
                Our vision is an internet where AI agents are truly autonomous, collaborating in massive distributed swarms without a single central authority controlling their potential.
              </blockquote>
              <p>This Hub is the marketplace for that potential. Every skill and plugin is a package that grants your agent new powers—from coding to financial analysis—all running securely on your machine. You control the keys, you control the hardware, you control the agent.</p>
            </div>

            <div className="flex gap-4 mt-12 border-t border-gray-800/50 pt-8 w-full justify-center">
              <a href="https://must-b.com/install.sh" target="_blank" className="bg-[#222] text-gray-100 px-6 py-3 rounded-lg font-bold hover:bg-[#333] transition-colors">Linux / macOS Install</a>
              <a href="https://must-b.com/install.ps1" target="_blank" className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-white/90 transition-colors">Windows Install</a>
              <a href="https://discord.gg/mustb" target="_blank" className="bg-red-900/50 text-red-200 px-6 py-3 rounded-lg font-bold hover:bg-red-900/70 transition-colors">Community Discord</a>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL (DETAY PENCERESİ) --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity">
          <div className="bg-[#161616] border border-[#333] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative shadow-black animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-[#222] p-2 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-3xl font-bold text-white">{selectedItem.name}</h2>
                <span className="text-xs font-mono bg-red-900/30 text-red-400 border border-red-900/50 px-2 py-1 rounded">{selectedItem.version}</span>
              </div>
              <p className="text-gray-400 mb-6 font-mono text-sm">{selectedItem.author} tarafından yayınlandı.</p>
              <div className="bg-[#0a0a0a] p-5 rounded-lg border border-[#222] mb-6 shadow-inner"><p className="text-gray-300 leading-relaxed">{selectedItem.summary}</p></div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Kurulum Komutu (CLI)</h4>
                <div className="flex items-center justify-between bg-black p-4 rounded-lg border border-[#333] shadow-inner">
                  <code className="text-emerald-400 font-mono text-sm">{getInstallCommand(selectedItem.name, activeTab)}</code>
                  <button onClick={() => navigator.clipboard.writeText(getInstallCommand(selectedItem.name, activeTab))} className="text-gray-500 hover:text-white transition-colors p-1" title="Kopyala"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button>
                </div>
              </div>

              <div className="flex items-center gap-8 border-t border-[#333] pt-6 mt-2 flex-wrap">
                <div><span className="block text-xs text-gray-500 uppercase tracking-wider">İndirme</span><span className="text-xl font-bold text-white font-mono">{selectedItem.downloads}</span></div>
                <div><span className="block text-xs text-gray-500 uppercase tracking-wider">Yıldız</span><span className="text-xl font-bold text-white font-mono">{selectedItem.stars}</span></div>
                {selectedItem.os && (<div><span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">OS</span><div className="flex gap-1.5">{selectedItem.os?.map((os: string) => (<span key={os} className="text-[10px] uppercase bg-[#222] border border-[#444] text-gray-300 px-2 py-0.5 rounded">{os}</span>))}</div></div>)}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}