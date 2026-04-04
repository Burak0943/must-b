import React, { useState } from 'react';

// --- DEVASA GENİŞLETİLMİŞ VERİ SETİ ---
const data = {
  skills: [
    { id: 1, name: 'Self-improving-agent', version: 'v1.24.0', summary: 'Kendi hatalarını analiz edip kodunu düzelten 4 aşamalı otonom ajan. Kod yazar, test eder, düzeltir.', author: '@aytac', stars: '4.8k', downloads: '125k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 2, name: 'Fuzzy Patch Engine', version: 'v1.23.5', summary: 'Bozuk boşlukları ve indentasyon hatalarını tolere eden 3 aşamalı yama motoru. Dosya düzenlemelerini kusursuzlaştırır.', author: '@burak', stars: '3.2k', downloads: '89k', os: ['Linux', 'macOS'] },
    { id: 3, name: 'RAM Doctor', version: 'v1.0.0', summary: 'Sistem belleğine göre ajan performansını dinamik olarak kısıtlayan/açan modül. PC çökmesini engeller.', author: '@core_team', stars: '5.1k', downloads: '210k', os: ['Windows', 'Linux'] },
    { id: 4, name: '3-Tier Router', version: 'v1.21.0', summary: 'Görev zorluğuna göre LLM modelini otomatik seçerek API maliyetini yerle bir eder.', author: '@aytac', stars: '6.4k', downloads: '340k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 5, name: 'X (Twitter) Search', version: 'v2.0.1', summary: 'X üzerindeki gönderileri, trendleri ve kullanıcıları gerçek zamanlı tarayan analitik ajanı.', author: '@social_bot', stars: '1.2k', downloads: '45k', os: ['Linux', 'Windows'] },
    { id: 6, name: 'Trello Board Manager', version: 'v1.1.0', summary: 'Trello REST API üzerinden kartları okur, taşır ve projeleri ajan aracılığıyla otomatik yönetir.', author: '@pm_agent', stars: '890', downloads: '32k', os: ['macOS', 'Windows'] },
    { id: 7, name: 'Slack Communicator', version: 'v3.4', summary: 'Must-b ajanının Slack kanallarına mesaj atmasını, okumasını ve reaksiyon vermesini sağlar.', author: '@mustb_core', stars: '2.1k', downloads: '76k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 8, name: 'CalDav Calendar Sync', version: 'v1.0.5', summary: 'iCloud, Google ve Fastmail takvimlerini senkronize edip ajanın toplantı ayarlamasına izin verir.', author: '@scheduler', stars: '450', downloads: '12k', os: ['macOS'] },
    { id: 9, name: 'Obsidian Vault Sync', version: 'v2.2', summary: 'Yerel Obsidian Markdown notlarını okuyup onlardan bağlam çıkaran (RAG) hafıza modülü.', author: '@knowledge_base', stars: '7.8k', downloads: '150k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 10, name: 'Notion Workspace Sync', version: 'v1.8', summary: 'Notion sayfalarını okur, düzenler ve ajan için devasa bir şirket içi bilgi havuzu oluşturur.', author: '@productivity', stars: '3.9k', downloads: '102k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 11, name: 'Figma to Code', version: 'v0.9.beta', summary: 'Figma tasarımlarını analiz edip doğrudan React/Tailwind bileşenlerine dönüştürür.', author: '@ui_bot', stars: '8.4k', downloads: '180k', os: ['macOS', 'Windows'] },
    { id: 12, name: 'Stripe Finance Analyst', version: 'v2.1', summary: 'Stripe API ile gelir-gider tablolarını okur, analiz eder ve CEO için günlük finansal özet çıkarır.', author: '@finance_ai', stars: '1.1k', downloads: '22k', os: ['Linux', 'macOS'] },
    { id: 13, name: 'Linear Ticket Creator', version: 'v1.3', summary: 'Kullanıcı geri bildirimlerinden otomatik olarak Linear issue (görev) oluşturur ve etiketler.', author: '@pm_agent', stars: '2.5k', downloads: '45k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 14, name: 'Gmail Autobot', version: 'v3.0', summary: 'Gelen mailleri okur, kategorize eder ve rutin olanlara kendi başına yanıt taslakları hazırlar.', author: '@core_team', stars: '6.2k', downloads: '300k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 15, name: 'AWS Infrastructure Deployer', version: 'v1.5', summary: 'Ajanın Terraform veya CDK kullanarak AWS üzerinde sunucu ve veritabanı kurmasını sağlar.', author: '@devops_ninja', stars: '4.7k', downloads: '88k', os: ['Linux', 'macOS'] },
    { id: 16, name: 'Supabase Admin', version: 'v2.0', summary: 'Veritabanı şemalarını okur, RLS politikalarını test eder ve güvenli SQL sorguları yazar.', author: '@burak', stars: '9.1k', downloads: '450k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 17, name: 'Discord Moderator', version: 'v1.2', summary: 'Topluluk sunucularında spamı engeller, sorulara dokümanlardan cevap verir.', author: '@community', stars: '3.3k', downloads: '55k', os: ['Linux', 'Windows'] },
    { id: 18, name: 'SEO Content Analyzer', version: 'v1.0', summary: 'Web sitelerini tarar, anahtar kelime eksiklerini bulur ve ajan aracılığıyla makale optimize eder.', author: '@marketer', stars: '1.8k', downloads: '30k', os: ['macOS', 'Windows'] },
  ],
  plugins: [
    { id: 1, name: 'Terminal Stream', version: 'v2.1', summary: 'İşletim sistemi terminaline doğrudan müdahale ve okuma yeteneği sağlar. Tehlikeli ama güçlü.', author: '@native', stars: '4.1k', downloads: '200k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 2, name: 'Browser Vision (Playwright)', version: 'v1.5', summary: 'Arayüzü test etmek için tarayıcıyı açıp ekranı piksellerine kadar analiz eder.', author: '@ruflo', stars: '2.8k', downloads: '89k', os: ['Linux', 'macOS'] },
    { id: 3, name: 'PostgreSQL Vector Memory', version: 'v3.0', summary: 'Must-b ajanına uzun süreli bellek (LTM) kazandıran Supabase / pgvector eklentisi.', author: '@database_team', stars: '5.5k', downloads: '400k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 4, name: 'Local VRAM Optimizer', version: 'v1.2', summary: 'Açık kaynaklı yerel modeller (Llama, Mistral) çalışırken VRAM kullanımını %40 azaltan bypass.', author: '@gpu_hacker', stars: '8.9k', downloads: '500k', os: ['Windows', 'Linux'] },
    { id: 5, name: 'Docker Container Spawner', version: 'v2.0', summary: 'Ajanın kodları test etmek için izole ve güvenli Docker konteynerleri yaratıp yok etmesini sağlar.', author: '@devops_bot', stars: '3.4k', downloads: '110k', os: ['Linux', 'macOS'] },
    { id: 6, name: 'GitHub PR Reviewer', version: 'v1.1', summary: 'Açılan Pull Requestleri otonom olarak okur, kod incelemesi yapar ve yorum bırakır.', author: '@aytac', stars: '4.2k', downloads: '95k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 7, name: 'VS Code Extension Bridge', version: 'v1.0', summary: 'Must-b ajanının doğrudan VS Code editörünüze müdahale edip kod yazmasını sağlayan yerel köprü.', author: '@core_team', stars: '12k', downloads: '800k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 8, name: 'Ngrok Tunneling', version: 'v1.4', summary: 'Yerel ajanı dış dünyaya açarak web hook dinlemesini ve API sunmasını sağlar.', author: '@networker', stars: '2.1k', downloads: '45k', os: ['macOS', 'Windows'] },
  ]
};

export default function MustbHub() {
  const [activeTab, setActiveTab] = useState<'skills' | 'plugins' | 'docs'>('skills');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null); // MODAL İÇİN STATE EKLENDİ

  // Aktif sekmeye göre veriyi filtrele
  const currentData = activeTab === 'skills' ? data.skills : activeTab === 'plugins' ? data.plugins : [];
  const filteredData = currentData.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // İndirme komutu üretici
  const getInstallCommand = (name: string, type: string) => {
    const formattedName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `must-b install ${type === 'skills' ? 'skill' : 'plugin'} @must-b/${formattedName}`;
  };

  return (
    <div className="min-h-screen bg-[#111111] text-gray-200 p-8 font-sans relative">
      
      {/* Üst Başlık ve Arama */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">Must-b Hub. </span> 
          Ajanlar için yetenek rıhtımı.
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          Yetenek paketlerini yükleyin, NPM gibi çekin ve sisteminize entegre edin. Vektörlerle aranabilir, geçit yok, sadece saf yetenek.
        </p>

        {/* Sekmeler (Tabs) */}
        <div className="flex justify-center space-x-6 mb-8 border-b border-gray-800 pb-4">
          <button onClick={() => setActiveTab('skills')} className={`pb-2 px-2 text-lg font-medium transition-colors ${activeTab === 'skills' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-500 hover:text-gray-300'}`}>Skills ({data.skills.length})</button>
          <button onClick={() => setActiveTab('plugins')} className={`pb-2 px-2 text-lg font-medium transition-colors ${activeTab === 'plugins' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-500 hover:text-gray-300'}`}>Plugins ({data.plugins.length})</button>
          <button onClick={() => setActiveTab('docs')} className={`pb-2 px-2 text-lg font-medium transition-colors ${activeTab === 'docs' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-500 hover:text-gray-300'}`}>About</button>
        </div>

        {/* Arama Çubuğu */}
        <div className="max-w-3xl mx-auto flex gap-4 items-center bg-[#1a1a1a] p-2 rounded-lg border border-gray-800 focus-within:border-red-900/50 transition-colors">
          <svg className="w-6 h-6 text-gray-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Skill veya plugin ara (örn: stripe, aws, ram)..." 
            className="w-full bg-transparent border-none focus:outline-none text-gray-200 placeholder-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Kart Izgarası (Grid) */}
      <div className="max-w-7xl mx-auto">
        {activeTab !== 'docs' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item: any) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)} // KARTA TIKLAMA EVENTİ
                className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-6 hover:border-red-900/50 hover:bg-[#1a1a1a] transition-all cursor-pointer group flex flex-col justify-between h-full shadow-lg shadow-black/50"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-red-400 transition-colors">{item.name}</h3>
                    <span className="text-xs font-mono bg-gray-800 text-gray-400 px-2 py-1 rounded">{item.version}</span>
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
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800/50 pt-4 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-300">{item.author}</span>
                    </div>
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
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-8 text-center text-gray-400">
            <h2 className="text-2xl text-gray-200 mb-4">Policies & Documentation</h2>
            <p className="leading-relaxed max-w-xl mx-auto">Tüm Must-b ajan modülleri güvenlik testlerinden geçmiştir. Topluluk kurallarına uymayan zararlı eklentiler barındırılamaz.</p>
          </div>
        )}
      </div>

      {/* --- MODAL (DETAY PENCERESİ) --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="bg-[#161616] border border-[#333] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
            
            {/* Kapat Butonu */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-[#222] p-2 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {/* Modal İçerik */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">{selectedItem.name}</h2>
                <span className="text-xs font-mono bg-red-900/30 text-red-400 border border-red-900/50 px-2 py-1 rounded">{selectedItem.version}</span>
              </div>
              <p className="text-gray-400 mb-6 font-mono text-sm">{selectedItem.author} tarafından yayınlandı.</p>
              
              <div className="bg-[#0a0a0a] p-4 rounded-lg border border-[#222] mb-6">
                <p className="text-gray-300 leading-relaxed">{selectedItem.summary}</p>
              </div>

              {/* Kurulum Kodu (NPM Gibi) */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Kurulum Komutu (CLI)</h4>
                <div className="flex items-center justify-between bg-black p-4 rounded-lg border border-[#333]">
                  <code className="text-emerald-400 font-mono text-sm">
                    {getInstallCommand(selectedItem.name, activeTab)}
                  </code>
                  <button 
                    onClick={() => navigator.clipboard.writeText(getInstallCommand(selectedItem.name, activeTab))}
                    className="text-gray-500 hover:text-white transition-colors"
                    title="Kopyala"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </button>
                </div>
              </div>

              {/* Alt İstatistikler */}
              <div className="flex items-center gap-8 border-t border-[#333] pt-6 mt-2">
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wider">İndirme</span>
                  <span className="text-lg font-bold text-white">{selectedItem.downloads}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wider">Yıldız</span>
                  <span className="text-lg font-bold text-white">{selectedItem.stars}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wider">Desteklenen OS</span>
                  <div className="flex gap-1 mt-1">
                    {selectedItem.os?.map((os: string) => (
                      <span key={os} className="text-[10px] uppercase bg-[#222] border border-[#444] text-gray-300 px-2 py-0.5 rounded">{os}</span>
                    ))}
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