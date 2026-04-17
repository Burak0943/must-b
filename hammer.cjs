const fs = require('fs');
let lines = fs.readFileSync('src/pages/DocsPage.tsx', 'utf8').split(/\r?\n/);

// We know the injected block in DocumentViewer starts at line 445: '{activeDoc === "Introduction" && ('
// and ends at line 561: '        )}'
// So we delete indices 444 through 560.
lines.splice(444, 117);

// Now we insert the Manifesto at the top of the "Introduction" content block.
// The empty line 40 is index 39. Let's insert the new content there.
const manifesto = `        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Must-b: Autonomous AI Operating System 🚀</h1>
          <p className="text-gray-300 mb-6">
            <strong>Must-b</strong> is a next-generation, locally hosted autonomous AI agent ecosystem. It transitions AI from being a passive chatbot in a browser tab to an active, autonomous digital workforce operating directly on your machine.
          </p>
          <p className="text-gray-300 mb-8">
            🌐 <strong>Official Website:</strong> <a href="https://must-b.com" className="text-cyan-400 hover:underline">must-b.com</a> | 📚 <strong>Documentation:</strong> <a href="https://must-b.com/docs" className="text-cyan-400 hover:underline">must-b.com/docs</a>
          </p>
          
          <hr className="border-gray-800 my-8" />

          <h2 className="text-2xl font-bold text-white mb-4">🌟 The Paradigm Shift: Why Must-b?</h2>
          <p className="text-gray-300 mb-8">
            Must-b changes the game by acting as the <strong>Orchestrator of your entire workflow</strong>. You provide a high-level goal. Must-b dynamically spawns a swarm of specialized AI agents, maps out a parallel execution graph, controls your terminal, edits your local files, navigates the web via automated browsers, and enforces strict security protocols—all without human intervention.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4">🏗️ Core Architecture & Features</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 mb-8">
            <li><strong>Multi-Agent Swarms (SwarmCoordinator):</strong> Spawns isolated PM, Frontend, Backend, and QA agents that work in parallel and communicate natively.</li>
            <li><strong>DAG Workflow Engine:</strong> Executes complex plans with parallel branching, rollback capabilities, and fault tolerance.</li>
            <li><strong>The Shield Protocol (Hookify):</strong> Write natural language rules (e.g., 'never delete databases') that instantly convert to runtime execution blocks.</li>
            <li><strong>200+ Native & Assimilated Skills:</strong> Ships with a massive arsenal of tools for GitHub PR reviews, codebase indexing, web scraping, and terminal execution.</li>
            <li><strong>Memory & Lifecycle:</strong> HNSW-backed vector store (LTM) with semantic search, plus Ghost Guard (RAM/CPU monitoring) and Night Owl (background execution).</li>
            <li><strong>8-Language UI:</strong> Fluent in English, Turkish, German, French, Spanish, Portuguese, Japanese, and Chinese.</li>
          </ul>

          <hr className="border-gray-800 my-8" />

          <h2 className="text-2xl font-bold text-white mb-4">⚡ Installation & Quick Start</h2>
          
          <p className="text-gray-300 mb-2"><strong>Requirements:</strong></p>
          <ul className="list-disc pl-5 space-y-1 text-gray-300 mb-6">
            <li><strong>Node.js</strong> &gt;= 20</li>
            <li>An API key for at least one LLM provider (OpenRouter, Anthropic, OpenAI, Gemini, Ollama).</li>
            <li><em>Optional:</em> Playwright browsers for web automation (<code>npx playwright install chromium</code>).</li>
          </ul>

          <p className="text-gray-300 mb-2"><strong>Global Installation</strong></p>
          <p className="text-gray-300 mb-2">Must-b is a proprietary enterprise system distributed securely via NPM.</p>
          <pre className="bg-gray-900 text-emerald-400 p-4 rounded-xl mb-4 overflow-x-auto"><code>{\`npm install -g @must-b/must-b@latest
must-b gateway       # Starts the Web Dashboard\`}</code></pre>
          <p className="text-gray-300 mb-8 italic">
            (Typing just <code>must-b</code> also defaults to starting the gateway. Follow the setup wizard on the first run.)
          </p>

          <h3 className="text-xl font-bold text-white mb-4">📡 Autonomous Channels Setup</h3>
          <p className="text-gray-300 mb-4">
            Must-b can connect to your daily communication channels. Send a message to your WhatsApp or Discord bot, and Must-b will wake up, execute the task on your computer, and reply with the results. Configuration is stored safely in your local <code>.env</code> file.
          </p>

          <p className="text-gray-300 mb-2"><strong>WhatsApp Setup</strong></p>
          <ul className="list-disc pl-5 space-y-1 text-gray-300 mb-6">
            <li>Create a Meta App at <a href="https://developers.facebook.com" className="text-cyan-400 hover:underline" target="_blank" rel="noreferrer">developers.facebook.com</a></li>
            <li>Configure webhook URL: <code>https://your-domain.com/webhook/whatsapp</code></li>
            <li>Set <code>WHATSAPP_VERIFY_TOKEN</code> in <code>.env</code> to match your Meta webhook token.</li>
            <li>Add <code>WHATSAPP_PHONE_NUMBER_ID</code> and <code>WHATSAPP_ACCESS_TOKEN</code>.</li>
          </ul>

          <p className="text-gray-300 mb-2"><strong>Discord Setup</strong></p>
          <ul className="list-disc pl-5 space-y-1 text-gray-300 mb-8">
            <li>Create a bot at <a href="https://discord.com/developers/applications" className="text-cyan-400 hover:underline" target="_blank" rel="noreferrer">discord.com/developers/applications</a></li>
            <li>Set Interactions Endpoint URL: <code>https://your-domain.com/webhook/discord</code></li>
            <li>Add <code>DISCORD_BOT_TOKEN</code>, <code>DISCORD_CLIENT_ID</code>, and <code>DISCORD_PUBLIC_KEY</code> to your <code>.env</code> file.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mb-4">💻 CLI Commands</h3>
          <pre className="bg-gray-900 text-emerald-400 p-4 rounded-xl mb-10 overflow-x-auto"><code>{\`must-b               # Start the Web Dashboard (same as 'must-b gateway')
must-b gateway       # Start the Web Dashboard
must-b cli           # Enter Terminal-only Chat Mode
must-b doctor        # Run System Health Check & Auto-Repair
must-b onboard       # Re-run the Setup Wizard\`}</code></pre>

          <hr className="border-gray-800 my-10" />

          <h2 className="text-2xl font-bold text-white mb-4">Must-b — Türkçe 🇹🇷</h2>
          <p className="text-gray-300 mb-4">
            Otonom Yapay Zeka İşletim Sistemi — Sizin adınıza düşünen, harekete geçen ve öğrenen profesyonel bir dijital işgücü.
          </p>
          <p className="text-gray-300 mb-8">
            🌐 <strong>Resmi Web Sitesi:</strong> <a href="https://must-b.com" className="text-cyan-400 hover:underline">must-b.com</a> | 📚 <strong>Dokümantasyon:</strong> <a href="https://must-b.com/docs" className="text-cyan-400 hover:underline">must-b.com/docs</a>
          </p>

          <h3 className="text-xl font-bold text-white mb-4">Must-b Nedir?</h3>
          <p className="text-gray-300 mb-8">
            Must-b, doğrudan makinenizde çalışan ve ortamınıza tam erişim sağlayan otonom bir sistemdir. Hedefi anlar, plan yapar, terminalinizi kullanır, kodlarınızı düzenler, tarayıcınızı yönetir ve projelerinizi baştan sona kendi başına tamamlar.
          </p>

          <h3 className="text-xl font-bold text-white mb-4">Çekirdek Güçleri</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 mb-8">
            <li><strong>Çoklu Ajan Orkestrası (SwarmCoordinator):</strong> Görevin büyüklüğüne göre kendi içinde PM, Frontend ve QA ajanları yaratır ve projeyi paralel olarak geliştirir.</li>
            <li><strong>DAG İş Akışı Motoru:</strong> Görevleri paralel kollar halinde işler. Hata oluştuğunda sistemi çökertmez, işlemi geri alır (Rollback).</li>
            <li><strong>Yıkılmaz Güvenlik (Hookify):</strong> Yapay zekanın tehlikeli komutlar çalıştırmasını engellemek için doğal dilde kurallar koyabilirsiniz.</li>
            <li><strong>200+ Devasa Yetenek:</strong> GitHub yönetimi, web kazıma, kod analizi ve detaylı terminal kontrolü.</li>
            <li><strong>Uzun Süreli Hafıza:</strong> Vektör veritabanı (LTM) ile haftalar önceki bağlamı hatırlar; Ghost Guard ile RAM/CPU izler.</li>
            <li><strong>8 Dil Desteği:</strong> Türkçe dahil İngilizce, Almanca, Fransızca, İspanyolca, Portekizce, Japonca ve Çince tam destek.</li>
          </ul>

          <h3 className="text-xl font-bold text-white mb-4">Kurulum ve Kullanım</h3>
          <p className="text-gray-300 mb-4">
            <strong>Gereksinimler:</strong> Node.js &gt;= 20 ve LLM API Anahtarı. (Tarayıcı otomasyonu için: <code>npx playwright install chromium</code>)
          </p>
          <pre className="bg-gray-900 text-emerald-400 p-4 rounded-xl mb-4 overflow-x-auto"><code>{\`npm install -g @must-b/must-b@latest
must-b gateway       # Web panelini başlatır\`}</code></pre>
          <p className="text-gray-300 mb-8 italic">
            (Sadece <code>must-b</code> yazmak da varsayılan olarak paneli başlatır.)
          </p>

          <p className="text-gray-300 mb-8">
            <strong>Kanal Entegrasyonları (WhatsApp & Discord):</strong> Sisteminizi WhatsApp veya Discord'a bağlamak için gerekli olan API anahtarlarını sırasıyla Meta Developer ve Discord Developer portallarından alıp <code>.env</code> dosyanıza ekleyebilirsiniz. Detaylı bilgi için dokümantasyona göz atın.
          </p>

          <p className="text-gray-400 text-sm">
            <strong>License:</strong> MIT © 2026 Must-b Inc. All rights reserved.
          </p>
        </div>`;

lines.splice(39, 0, manifesto);
fs.writeFileSync('src/pages/DocsPage.tsx', lines.join('\\n'));
console.log('Fixed DocsPage.tsx successfully');
