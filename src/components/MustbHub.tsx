import React, { useState } from 'react';

// --- Gelişmiş Veri Setimiz (Videodaki formata uygun) ---
const data = {
  skills: [
    { id: 1, name: 'Self-improving-agent', version: 'v1.24.0', summary: 'Kendi hatalarını analiz edip kodunu düzelten 4 aşamalı otonom ajan.', author: '@aytac', stars: '1.2k', downloads: '45k', os: ['Linux', 'macOS', 'Windows'] },
    { id: 2, name: 'Fuzzy Patch Engine', version: 'v1.23.5', summary: 'Bozuk boşlukları ve indentasyon hatalarını tolere eden 3 aşamalı yama motoru.', author: '@burak', stars: '850', downloads: '22k', os: ['Linux', 'macOS'] },
    { id: 3, name: 'RAM Doctor', version: 'v1.0.0', summary: 'Sistem belleğine göre ajan performansını dinamik olarak kısıtlayan/açan modül.', author: '@core_team', stars: '3.4k', downloads: '110k', os: ['Windows'] },
    { id: 4, name: '3-Tier Router', version: 'v1.21.0', summary: 'Görev zorluğuna göre LLM modelini otomatik seçerek API maliyetini düşürür.', author: '@aytac', stars: '920', downloads: '34k', os: ['Linux', 'macOS', 'Windows'] },
  ],
  plugins: [
    { id: 1, name: 'Terminal Stream', version: 'v2.1', summary: 'İşletim sistemi terminaline doğrudan müdahale ve okuma yeteneği sağlar.', author: '@native', stars: '4.1k', downloads: '200k' },
    { id: 2, name: 'Browser Vision', version: 'v1.5', summary: 'Arayüzü test etmek için tarayıcıyı açıp ekranı piksellerine kadar analiz eder.', author: '@ruflo', stars: '2.8k', downloads: '89k' },
  ]
};

export default function MustbHub() {
  const [activeTab, setActiveTab] = useState<'skills' | 'plugins' | 'docs'>('skills');
  const [searchQuery, setSearchQuery] = useState('');

  // Aktif sekmeye göre veriyi filtrele
  const currentData = activeTab === 'skills' ? data.skills : activeTab === 'plugins' ? data.plugins : [];
  const filteredData = currentData.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#111111] text-gray-200 p-8 font-sans">
      
      {/* Üst Başlık ve Arama */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">Must-b Hub. </span> 
          Ajanlar için yetenek rıhtımı.
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Yetenek paketlerini yükleyin, NPM gibi çekin ve sisteminize entegre edin. Vektörlerle aranabilir, geçit yok, sadece saf yetenek.
        </p>

        {/* Sekmeler (Tabs) */}
        <div className="flex justify-center space-x-6 mb-8 border-b border-gray-800 pb-4">
          <button onClick={() => setActiveTab('skills')} className={`pb-2 px-2 text-lg font-medium transition-colors ${activeTab === 'skills' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-500 hover:text-gray-300'}`}>Skills</button>
          <button onClick={() => setActiveTab('plugins')} className={`pb-2 px-2 text-lg font-medium transition-colors ${activeTab === 'plugins' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-500 hover:text-gray-300'}`}>Plugins</button>
          <button onClick={() => setActiveTab('docs')} className={`pb-2 px-2 text-lg font-medium transition-colors ${activeTab === 'docs' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-500 hover:text-gray-300'}`}>About</button>
        </div>

        {/* Arama Çubuğu */}
        <div className="max-w-3xl mx-auto flex gap-4 items-center bg-[#1a1a1a] p-2 rounded-lg border border-gray-800 focus-within:border-red-900/50 transition-colors">
          <svg className="w-6 h-6 text-gray-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Skill veya plugin ara (örn: self-improving)..." 
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
              <div key={item.id} className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-6 hover:border-red-900/50 hover:bg-[#1a1a1a] transition-all cursor-pointer group flex flex-col justify-between h-full shadow-lg shadow-black/50">
                
                <div>
                  {/* Kart Başlığı ve Sürüm */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-red-400 transition-colors">{item.name}</h3>
                    <span className="text-xs font-mono bg-gray-800 text-gray-400 px-2 py-1 rounded">{item.version}</span>
                  </div>
                  
                  {/* Açıklama */}
                  <p className="text-sm text-gray-400 mb-6 line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                {/* Alt Bilgiler (Yazar, OS, İstatistikler) */}
                <div className="mt-auto">
                  {/* OS Etiketleri */}
                  {item.os && (
                    <div className="flex gap-2 mb-4">
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
                      <span className="flex items-center gap-1" title="İndirmeler">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        {item.downloads}
                      </span>
                      <span className="flex items-center gap-1" title="Yıldızlar">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        {item.stars}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* About/Docs Sekmesi İçin Geçici Alan */
          <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-8 text-center text-gray-400">
            <h2 className="text-2xl text-gray-200 mb-4">Policies & Documentation</h2>
            <p>What Must-b will Not Host. (Videodaki About sayfası gibi buraya kurallar eklenecek)</p>
          </div>
        )}
      </div>
    </div>
  );
}