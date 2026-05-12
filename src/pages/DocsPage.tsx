import { motion } from "framer-motion";
import { BookOpen, Shield, Cpu, Terminal, Layers, Globe, Scale, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";

const getDocsData = (t: any): Record<string, { title: string; content: React.ReactNode; icon: any }> => ({
  "Introduction": {
    title: t('docs:introduction.title'),
    icon: BookOpen,
    content: (
      <>
        <h1 className="text-4xl font-bold text-white mb-4">{t('docs:introduction.mainTitle')}</h1>
        <p className="text-gray-300 mb-6">
          {t('docs:introduction.p1')}
        </p>
        <p className="text-gray-300 mb-8">
          🌐 <strong>{t('footer.brand.tagline')}</strong>{" "}
          <a href="https://must-b.com" className="text-cyan-400 hover:underline">must-b.com</a>
        </p>

        <hr className="border-gray-800 my-8" />

        <h2 className="text-2xl font-bold text-white mb-4">🌟 {t('docs:introduction.paradigmShift')}</h2>
        <p className="text-gray-300 mb-8">
          {t('docs:introduction.orchestratorDesc')}
        </p>

        <h2 className="text-2xl font-bold text-white mb-4">🏗️ {t('docs:introduction.coreArchitecture')}</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-300 mb-8">
          {(t('docs:introduction.features', { returnObjects: true }) as string[]).map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>

        <hr className="border-gray-800 my-8" />

        <h2 className="text-2xl font-bold text-white mb-4">⚡ Installation &amp; Quick Start</h2>

        <p className="text-gray-300 mb-2"><strong>Requirements:</strong></p>
        <ul className="list-disc pl-5 space-y-1 text-gray-300 mb-6">
          <li><strong>Node.js</strong> &gt;= 20</li>
          <li>An API key for at least one LLM provider (OpenRouter, Anthropic, OpenAI, Gemini, Ollama).</li>
          <li><em>Optional:</em> Playwright browsers for web automation (<code>npx playwright install chromium</code>).</li>
        </ul>

        <p className="text-gray-300 mb-2"><strong>Global Installation</strong></p>
        <p className="text-gray-300 mb-2">Must-b is a proprietary enterprise system distributed securely via NPM.</p>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-xl mb-4 overflow-x-auto"><code>{`npm install -g @must-b/must-b@latest\nmust-b gateway       # Starts the Web Dashboard`}</code></pre>
        <p className="text-gray-300 mb-8 italic">
          (Typing just <code>must-b</code> also defaults to starting the gateway. Follow the setup wizard on the first run.)
        </p>

        <h3 className="text-xl font-bold text-white mb-4">📡 Autonomous Channels Setup</h3>
        <p className="text-gray-300 mb-4">
          Must-b can connect to your daily communication channels. Send a message to your WhatsApp or Discord bot, and Must-b will wake up, execute the task on your computer, and reply with the results.
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
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-xl mb-10 overflow-x-auto"><code>{`must-b               # Start the Web Dashboard\nmust-b gateway       # Start the Web Dashboard\nmust-b cli           # Enter Terminal-only Chat Mode\nmust-b doctor        # Run System Health Check & Auto-Repair\nmust-b onboard       # Re-run the Setup Wizard`}</code></pre>

        <hr className="border-gray-800 my-10" />

        <h2 className="text-2xl font-bold text-white mb-4">Must-b — Türkçe 🇹🇷</h2>
        <p className="text-gray-300 mb-4">
          Otonom Yapay Zeka İşletim Sistemi — Sizin adınıza düşünen, harekete geçen ve öğrenen profesyonel bir dijital işgücü.
        </p>
        <p className="text-gray-300 mb-8">
          🌐 <strong>Resmi Web Sitesi:</strong>{" "}
          <a href="https://must-b.com" className="text-cyan-400 hover:underline">must-b.com</a>
          {" "}| 📚 <strong>Dokümantasyon:</strong>{" "}
          <a href="https://must-b.com/docs" className="text-cyan-400 hover:underline">must-b.com/docs</a>
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
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-xl mb-4 overflow-x-auto"><code>{`npm install -g @must-b/must-b@latest\nmust-b gateway       # Web panelini başlatır`}</code></pre>
        <p className="text-gray-300 mb-8 italic">
          (Sadece <code>must-b</code> yazmak da varsayılan olarak paneli başlatır.)
        </p>

        <p className="text-gray-300 mb-8">
          <strong>Kanal Entegrasyonları (WhatsApp &amp; Discord):</strong> Sisteminizi WhatsApp veya Discord'a bağlamak için gerekli olan API anahtarlarını sırasıyla Meta Developer ve Discord Developer portallarından alıp <code>.env</code> dosyanıza ekleyebilirsiniz.
        </p>

        <p className="text-gray-400 text-sm">
          <strong>License:</strong> MIT © 2026 Must-b Inc. All rights reserved.
        </p>
      </>
    )
  },
  "Core Philosophy": {
    title: t('docs:introduction.corePhilosophy.title'),
    icon: Layers,
    content: (
      <>
        <p className="text-gray-300 mb-4 leading-relaxed">
          {t('docs:introduction.corePhilosophy.p1')}
        </p>
        <p className="text-gray-300 mb-8 leading-relaxed">
          {t('docs:introduction.corePhilosophy.p2')}
        </p>

        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🧠 {t('docs:introduction.corePhilosophy.cloudBrain.title')}</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          {t('docs:introduction.corePhilosophy.cloudBrain.p1')}
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          {(t('docs:introduction.corePhilosophy.cloudBrain.list', { returnObjects: true }) as string[]).map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🦾 {t('docs:introduction.corePhilosophy.localMuscle.title')}</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          {t('docs:introduction.corePhilosophy.localMuscle.p1')}
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          {(t('docs:introduction.corePhilosophy.localMuscle.list', { returnObjects: true }) as string[]).map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <p className="text-gray-300 mb-4 leading-relaxed">
          The physical manifestation of tasks occurs strictly on the host machine via the highly privileged Must-b Daemon.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed"><strong className="text-white">OS-Level Domination:</strong> Hardware-level mouse event simulation via Win32/Quartz APIs, keystroke injection, and background binary execution.</li>
          <li className="leading-relaxed"><strong className="text-white">Stateful Manipulation:</strong> Direct read/write access to local file systems, Git repositories, terminal sessions, and legacy GUI software without requiring restrictive APIs.</li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── Comparison Table ─────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">⚖️ The Paradigm Shift: Traditional AI vs. Must-b OS</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm mb-8 mt-4">
            <thead>
              <tr>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Capability</th>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Traditional AI (ChatGPT/Claude)</th>
                <th className="border-b border-gray-800 pb-2 text-white font-semibold">Must-b Operating System</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Execution Environment</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Sandboxed Browser Tab</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Bare-Metal Operating System</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Action Capability</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Text/Code Generation</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Direct File, Terminal &amp; GUI Manipulation</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Workflow Orchestration</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Manual Copy-Pasting</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Autonomous Multi-Agent DAG Execution</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">System Awareness</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Blind to Local Context</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Deep Codebase &amp; OS Telemetry (Ghost Guard)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-gray-800 my-8" />

        {/* ── Security Air-Gap ─────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🛡️ The Security Air-Gap (Zero-Trust)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Bridging cloud intelligence with local execution introduces extreme vectors of vulnerability. Must-b acts as an impenetrable air-gap between the two.
        </p>
        <p className="text-gray-300 mb-6 leading-relaxed">
          Sensitive local environment variables (<code className="bg-gray-800 px-1 rounded text-emerald-400">.env</code>), proprietary source code directories, and system-level authentication tokens <strong className="text-white">never leave the physical boundaries of your machine</strong> without explicit cryptographic authorization. The Cloud Brain sends high-level directives; the Local Muscle enforces security before executing low-level OS API calls.
        </p>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`// Example: The Shield Protocol (Hookify) evaluating a Cloud Brain directive
function evaluateIntent(cloudPayload, localContext) {
  if (cloudPayload.action === "DELETE_TABLE" && localContext.isProductionDB) {
     throw new SecurityError("Must-b Hookify: Unauthorized critical system mutation blocked.");
  }
  return executeLocally(cloudPayload);
}`}</code></pre>
      </>
    )
  },

  "Prerequisites": {
    title: "Prerequisites",
    icon: Terminal,
    content: (
      <>
        {/* ── Opening ──────────────────────────────────────── */}
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b is not a standard web application; it is an <strong className="text-white">Autonomous AI Operating System</strong> that operates directly on your hardware. Because it assumes total sovereignty over your local environment to execute complex DAG (Directed Acyclic Graph) workflows, your system must meet strict infrastructure, networking, and security prerequisites before initialization.
        </p>

        <hr className="border-gray-800 my-8" />

        {/* ── 1. OS Support ────────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">💻 1. Kernel &amp; Operating System Support</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b interacts directly with native OS APIs for background binary execution, filesystem tracking, and peripheral simulation.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed"><strong className="text-white">macOS:</strong> macOS 12 (Monterey) or higher. Apple Silicon (M1/M2/M3) is heavily optimized for local vector embedding generation. Must-b will require <code className="bg-gray-800 px-1 rounded text-emerald-400">Accessibility</code> and <code className="bg-gray-800 px-1 rounded text-emerald-400">Automation</code> permissions via Gatekeeper for UI manipulation.</li>
          <li className="leading-relaxed"><strong className="text-white">Windows:</strong> Windows 10 / 11. Full integration requires PowerShell 5.1+ or Windows Terminal. <strong className="text-white">WSL2 (Windows Subsystem for Linux)</strong> is highly recommended for containerized developer skills.</li>
          <li className="leading-relaxed"><strong className="text-white">Linux:</strong> Ubuntu 20.04+, Debian, Arch. Requires standard <code className="bg-gray-800 px-1 rounded text-emerald-400">systemd</code> and <code className="bg-gray-800 px-1 rounded text-emerald-400">bash</code>/<code className="bg-gray-800 px-1 rounded text-emerald-400">zsh</code> environments for background daemonization.</li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 2. Node.js ───────────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">⚙️ 2. Core Execution Engine (V8 I/O)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          The Swarm Coordinator and Local Muscle rely on high-frequency asynchronous I/O to manage parallel agent communication.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-4">
          <li className="leading-relaxed"><strong className="text-white">Required:</strong> Node.js v20.x LTS or strictly higher.</li>
          <li className="leading-relaxed"><strong className="text-white">Package Manager:</strong> <code className="bg-gray-800 px-1 rounded text-emerald-400">npm</code> (bundled with Node) or <code className="bg-gray-800 px-1 rounded text-emerald-400">pnpm</code> (recommended for faster dependency resolution).</li>
        </ul>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`# Verify your execution environment
node -v && npm -v
# Ensure you are on v20+ to support native structured cloning and fetch APIs`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── 3. Privileges ────────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🔐 3. Bare-Metal Privileges &amp; Access Control</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          To allow Must-b to act as a true digital workforce, it must be granted sufficient escalation rights depending on the tasks you assign it.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed"><strong className="text-white">Sudo / Administrator Rights:</strong> If Must-b is tasked with global package installation, system port binding, or modifying firewall rules, it will request elevation. On Windows, running your terminal as Administrator is recommended for global dev-ops workflows.</li>
          <li className="leading-relaxed"><strong className="text-white">Security Air-Gap:</strong> Even with elevation, Must-b's internal Hookify engine prevents destructive commands (e.g., <code className="bg-gray-800 px-1 rounded text-emerald-400">rm -rf /</code>) unless explicitly overridden by the user.</li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 4. Networking ────────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🌐 4. Network Topology &amp; Webhooks</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b operates a local gateway server to communicate between the Web Dashboard, the CLI, and external integrations (like Slack or GitHub).
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed"><strong className="text-white">Local Port Binding:</strong> Must-b requires port <code className="bg-gray-800 px-1 rounded text-emerald-400">4309</code> to be available on localhost.</li>
          <li className="leading-relaxed"><strong className="text-white">Firewall Rules:</strong> Your local firewall must allow outbound HTTPS connections to reach LLM endpoints (OpenRouter, Anthropic, etc.).</li>
          <li className="leading-relaxed"><strong className="text-white">Webhooks (For Slack/GitHub):</strong> To receive inbound events from the outside world, you will need a secure tunnel (like <code className="bg-gray-800 px-1 rounded text-emerald-400">ngrok</code> or Cloudflare Tunnels) pointing to <code className="bg-gray-800 px-1 rounded text-emerald-400">http://localhost:4309</code>.</li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 5. Cloud Brain ───────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🧠 5. Cognitive Endpoints (The Cloud Brain)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b offloads abstract reasoning to LLMs. You must provide access to an external cognitive engine with sufficient API limits.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed"><strong className="text-white">API Key Required:</strong> You need a funded API key from OpenRouter, Anthropic, OpenAI, or Google. Free-tier keys with heavy rate-limits (e.g., 3 requests/min) will cause multi-agent DAG workflows to crash.</li>
          <li className="leading-relaxed"><strong className="text-white">Local Fallback:</strong> For 100% offline environments, a local <code className="bg-gray-800 px-1 rounded text-emerald-400">Ollama</code> instance can be linked. This shifts the cognitive load back to your machine.</li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 6. Hardware Thresholds ───────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🛡️ 6. Hardware Thresholds (Ghost Guard Telemetry)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          While the Cloud Brain handles the thinking, your machine handles the memory and execution. Must-b's Ghost Guard continuously profiles your RAM and CPU.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm mb-8 mt-4">
            <thead>
              <tr>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Telemetry</th>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Minimum (Lite Mode)</th>
                <th className="border-b border-gray-800 pb-2 text-white font-semibold">Recommended (Full Autonomy)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">CPU Architecture</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">2 Cores (x64 / ARM64)</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">8+ Cores (For Swarm parallelization)</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">System RAM</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">4 GB</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">16 GB+ (Required for deep Omni-Context memory caching)</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Disk Storage</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">1 GB Free Space</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">10 GB+ SSD (For SQLite Vector FTS5 databases)</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">GPU / VRAM</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Not required</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">8GB+ VRAM (Strictly if using local Ollama models)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-gray-800 my-8" />

        {/* ── 7. Optional Toolchains ───────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🛠️ 7. Extended Developer Toolchains (Optional but Recommended)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          To unlock the absolute maximum potential of Must-b's 200+ Skills Catalog, the following toolchains should be present in your system's <code className="bg-gray-800 px-1 rounded text-emerald-400">PATH</code>:
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-6">
          <li className="leading-relaxed"><strong className="text-white">Git:</strong> Mandatory for autonomous repository management, PR generation, and branch switching.</li>
          <li className="leading-relaxed"><strong className="text-white">Docker Engine:</strong> Required if you want Must-b to sandbox unstable code testing or spin up local databases for backend architecture generation.</li>
          <li className="leading-relaxed"><strong className="text-white">Python 3.10+:</strong> Required for specific Agent SDK verifiers and data-science execution skills.</li>
        </ul>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`# Recommended quick-check for full autonomy readiness
git --version
docker --version
python3 --version`}</code></pre>
      </>
    )
  },

  "Installation": {
    title: "Installation",
    icon: Globe,
    content: (
      <>
        {/* ── Opening ──────────────────────────────────────── */}
        <p className="text-gray-300 mb-4 leading-relaxed">
          Installing Must-b is not like adding a standard dependency to your project. You are injecting a highly privileged, autonomous daemon directly into your host operating system. Proceed with the understanding that Must-b will have bare-metal access to your machine's resources.
        </p>

        <hr className="border-gray-800 my-8" />

        {/* ── 1. Global Injection ──────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">📦 1. Global OS Injection (Provisioning the Local Muscle)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b must be installed globally to intercept terminal commands, manage parallel agent workflows, and bind to local network ports for The Bridge (Webhook routing).
        </p>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`# Execute the global installation via your native package manager
npm install -g @must-b/must-b@latest

# Or using pnpm for strictly isolated dependency resolution
pnpm add -g @must-b/must-b`}</code></pre>
        <p className="text-gray-300 mb-8 leading-relaxed">
          <strong className="text-white">Security Note for Unix-based architectures (macOS/Linux):</strong> Global execution privileges are mandatory for Terminal Supremacy. Prepend <code className="bg-gray-800 px-1 rounded text-emerald-400">sudo</code> only if your environment requires root-level access to hook into local OS processes.
        </p>

        <hr className="border-gray-800 my-8" />

        {/* ── 2. Daemon Init ───────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🚀 2. Daemon Initialization &amp; Vault Creation</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Once the binary is injected, you must initialize the local daemon. This command creates the <code className="bg-gray-800 px-1 rounded text-emerald-400">~/.must-b/</code> secure vault in your home directory, which houses your SQLite Vector Databases (Omni-Context Memory) and cryptographic keys.
        </p>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`# Initialize the daemon and generate the secure local vault
must-b daemon --init

# Verify system hooks and Air-Gap integrity
must-b doctor`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── 3. Config Engine ─────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">⚙️ 3. Core Configuration Engine (must-b.json)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Granular control over the Cognitive OS is managed strictly via <code className="bg-gray-800 px-1 rounded text-emerald-400">~/.must-b/must-b.json</code>. This schema defines the physical and psychological boundaries of your local agent swarm.
        </p>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`{
  "system": {
    "orchestrator_model": "claude-3-5-sonnet",
    "memory_indexing": "sqlite-fts5-vector",
    "cloud_sync_telemetry": false
  },
  "capabilities": {
    "ghostMode": {
      "enabled": true,
      "maxMouseSpeedMultiplier": 1.4,
      "bezierSmoothingAlgorithms": true,
      "hardwareAcceleration": true
    },
    "terminalSupremacy": {
      "allowRootSudoCommands": false,
      "autoDebugHealingLoop": true,
      "maxRecursionDepth": 5
    }
  },
  "bridge": {
    "whatsapp_webhook": {
      "endToEndEncryption": true,
      "allowListPattern": ["+1555*"]
    }
  }
}`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── 4. Schema Reference Table ────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🛡️ 4. Configuration Schema Reference</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Every parameter in the JSON configuration acts as a strict boundary for the Swarm Coordinator.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm mb-8 mt-4">
            <thead>
              <tr>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Parameter</th>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Domain</th>
                <th className="border-b border-gray-800 pb-2 text-white font-semibold">Technical Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-emerald-400 font-mono whitespace-nowrap">orchestrator_model</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium">System</td>
                <td className="border-b border-gray-800/50 py-3 text-gray-300">Defines the primary Cloud Brain. Models like <code className="bg-gray-800 px-1 rounded text-emerald-400">claude-3-5-sonnet</code> are highly recommended for complex DAG code generation workflows.</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-emerald-400 font-mono whitespace-nowrap">maxMouseSpeedMultiplier</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium">Ghost Mode</td>
                <td className="border-b border-gray-800/50 py-3 text-gray-300">Dictates the velocity of autonomous UI manipulation. Values above <code className="bg-gray-800 px-1 rounded text-emerald-400">2.0</code> may trigger OS-level anti-cheat or bot-detection heuristics in certain software.</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-emerald-400 font-mono whitespace-nowrap">bezierSmoothing</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium">Ghost Mode</td>
                <td className="border-b border-gray-800/50 py-3 text-gray-300">Injects human-like Bezier curves into autonomous cursor movements, preventing rigid, linear robotic traces.</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-emerald-400 font-mono whitespace-nowrap">allowRootSudoCommands</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium">Terminal</td>
                <td className="border-b border-gray-800/50 py-3 text-gray-300"><strong className="text-red-400">CRITICAL:</strong> If <code className="bg-gray-800 px-1 rounded text-emerald-400">true</code>, Must-b can autonomously execute <code className="bg-gray-800 px-1 rounded text-emerald-400">sudo</code> commands. This effectively grants the Cloud Brain root access to your machine.</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-emerald-400 font-mono whitespace-nowrap">autoDebugHealingLoop</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium">Terminal</td>
                <td className="border-b border-gray-800/50 py-3 text-gray-300">Allows Must-b to read terminal STDERR outputs, automatically rewrite failed code, and re-execute until tests pass (capped by <code className="bg-gray-800 px-1 rounded text-emerald-400">maxRecursionDepth</code>).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-gray-800 my-8" />

        {/* ── 5. Environment Variables ─────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🔑 5. Environment Variable Linking</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Authentication tokens for your chosen Cloud Brain (LLM Providers) must never be hardcoded. Store them securely in your <code className="bg-gray-800 px-1 rounded text-emerald-400">~/.must-b/.env</code> file.
        </p>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`# Example ~/.must-b/.env configuration
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
SLACK_BOT_TOKEN=xoxb-...`}</code></pre>
      </>
    )
  },

  "First Boot": {
    title: "First Boot",
    icon: Cpu,
    content: (
      <>
        {/* ── Slack Integration ───────────────────────────── */}
        <h2 className="text-2xl font-semibold text-white mb-4">Slack Integration</h2>

        <h3 className="text-lg font-semibold text-white mb-3">Step 1 — Create a Slack App</h3>
        <ol className="list-decimal pl-5 space-y-2 text-gray-300 mb-6">
          <li>Go to <a href="https://api.slack.com/apps" className="text-cyan-400 hover:underline" target="_blank" rel="noreferrer">api.slack.com/apps</a> → Create New App → From Scratch</li>
          <li>Under <strong className="text-white">OAuth &amp; Permissions</strong> → add scopes: <code className="bg-gray-800 px-1 rounded text-emerald-400">chat:write</code>, <code className="bg-gray-800 px-1 rounded text-emerald-400">im:history</code>, <code className="bg-gray-800 px-1 rounded text-emerald-400">im:read</code></li>
          <li>Under <strong className="text-white">Event Subscriptions</strong> → enable and set Request URL: <code className="bg-gray-800 px-1 rounded text-emerald-400">https://your-domain.com/webhook/slack</code></li>
          <li>Subscribe to bot event: <code className="bg-gray-800 px-1 rounded text-emerald-400">message.im</code></li>
        </ol>

        <h3 className="text-lg font-semibold text-white mb-3">Step 2 — Install App to Workspace</h3>
        <p className="text-gray-300 mb-3">Copy the Bot User OAuth Token and add to your <code className="bg-gray-800 px-1 rounded text-emerald-400">.env</code>:</p>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-4 overflow-x-auto"><code>{`SLACK_BOT_TOKEN=xoxb-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxxxxxxxx
SLACK_SIGNING_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── Skills Catalog ───────────────────────────────── */}
        <h2 className="text-2xl font-semibold text-white mb-2">Features Reference — 200+ Skills Catalog</h2>
        <p className="text-gray-300 mb-4">Must-b ships with a native skills library (<code className="bg-gray-800 px-1 rounded text-emerald-400">must-b-skills/</code>) covering:</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Category</th>
                <th className="border-b border-gray-800 pb-2 text-white font-semibold">Skills</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Code Intelligence</td><td className="border-b border-gray-800/50 py-3 text-gray-300">Codebase indexing, architecture blueprint generation, PR review (6 specialized reviewers), code simplifier, type design analyzer</td></tr>
              <tr><td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">GitHub Integration</td><td className="border-b border-gray-800/50 py-3 text-gray-300">PR creation, branch management, issue triage, commit message generation, automated review workflows</td></tr>
              <tr><td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Web &amp; Browser</td><td className="border-b border-gray-800/50 py-3 text-gray-300">Playwright scraping (text, links, images), live screenshot capture with UI element detection, web search</td></tr>
              <tr><td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Terminal &amp; System</td><td className="border-b border-gray-800/50 py-3 text-gray-300">Shell execution, filesystem CRUD, process management, environment inspection</td></tr>
              <tr><td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Security</td><td className="border-b border-gray-800/50 py-3 text-gray-300">Hookify rule engine, OWASP pattern detection, dangerous command blocking, authorization context enforcement</td></tr>
              <tr><td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Frontend Design</td><td className="border-b border-gray-800/50 py-3 text-gray-300">Design-system-aware UI agent, accessibility checks, component pattern reuse rules</td></tr>
              <tr><td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Agent SDK</td><td className="border-b border-gray-800/50 py-3 text-gray-300">Python + TypeScript verifier agents for SDK usage, caching pattern checks, model compatibility</td></tr>
            </tbody>
          </table>
        </div>

        <hr className="border-gray-800 my-8" />

        {/* ── Long-Term Memory ─────────────────────────────── */}
        <h2 className="text-2xl font-semibold text-white mb-3">Long-Term Memory (LTM)</h2>
        <p className="text-gray-300 mb-4">Must-b maintains two memory layers:</p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-4">
          <li><strong className="text-white">Conversation Memory</strong> (<code className="bg-gray-800 px-1 rounded text-emerald-400">memory/user.json</code>): Last 200 conversation entries + user profile. Persisted across sessions.</li>
          <li><strong className="text-white">Semantic Memory</strong> (SQLite FTS5 + vector embeddings): Full-text search with 30-day temporal decay. Queries return ranked results by recency and relevance.</li>
        </ul>
        <p className="text-gray-300 mb-3">Memory is searchable via REST endpoints:</p>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-4 overflow-x-auto"><code>{`GET  /api/memory/search?q=your+query
POST /api/memory/import    # Import external memory entries
GET  /api/memory/export    # Export full memory as JSON`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── Ghost Guard ──────────────────────────────────── */}
        <h2 className="text-2xl font-semibold text-white mb-3">Ghost Guard</h2>
        <p className="text-gray-300 mb-6">Ghost Guard monitors system resources in real time. When RAM or CPU usage exceeds configured thresholds, Must-b automatically switches to <strong className="text-white">Lite Mode</strong> — using a lighter LLM model and disabling background indexing. Thresholds are configurable in <strong className="text-white">Settings → System</strong>.</p>

        <hr className="border-gray-800 my-8" />

        {/* ── Night Owl ────────────────────────────────────── */}
        <h2 className="text-2xl font-semibold text-white mb-3">Night Owl Mode</h2>
        <p className="text-gray-300 mb-6">Night Owl allows Must-b to execute queued tasks autonomously while the user is away. Tasks added to the queue before the user steps away are processed in order overnight. Results are available in the Dashboard on next login.</p>

        <hr className="border-gray-800 my-8" />

        {/* ── CLI Reference ────────────────────────────────── */}
        <h2 className="text-2xl font-semibold text-white mb-3">CLI Reference</h2>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-4 overflow-x-auto"><code>{`must-b                # Start Web Dashboard (port 4309)
must-b gateway        # Same as above — explicit gateway mode
must-b cli            # Terminal-only REPL chat mode
must-b doctor         # System health check and auto-repair
must-b onboard        # Re-run interactive setup wizard
must-b memory-sync    # View and reindex memory statistics`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── LLM Provider Config ──────────────────────────── */}
        <h2 className="text-2xl font-semibold text-white mb-3">LLM Provider Configuration</h2>
        <p className="text-gray-300 mb-4">Must-b supports 20+ LLM backends. Switch providers at runtime from the Settings page or by editing <code className="bg-gray-800 px-1 rounded text-emerald-400">.env</code>.</p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Provider</th>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">LLM_PROVIDER value</th>
                <th className="border-b border-gray-800 pb-2 text-white font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium">OpenRouter</td><td className="border-b border-gray-800/50 py-3 pr-6 text-emerald-400 font-mono">openrouter</td><td className="border-b border-gray-800/50 py-3 text-gray-300">Access to 100+ models; recommended for flexibility</td></tr>
              <tr><td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium">Anthropic</td><td className="border-b border-gray-800/50 py-3 pr-6 text-emerald-400 font-mono">anthropic</td><td className="border-b border-gray-800/50 py-3 text-gray-300">Claude 3.5 Sonnet / Opus — best for code tasks</td></tr>
              <tr><td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium">OpenAI</td><td className="border-b border-gray-800/50 py-3 pr-6 text-emerald-400 font-mono">openai</td><td className="border-b border-gray-800/50 py-3 text-gray-300">GPT-4o, o1, o3-mini</td></tr>
              <tr><td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium">Google</td><td className="border-b border-gray-800/50 py-3 pr-6 text-emerald-400 font-mono">gemini</td><td className="border-b border-gray-800/50 py-3 text-gray-300">Gemini 1.5 Pro / Flash</td></tr>
              <tr><td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium">Groq</td><td className="border-b border-gray-800/50 py-3 pr-6 text-emerald-400 font-mono">groq</td><td className="border-b border-gray-800/50 py-3 text-gray-300">Fastest inference for Llama/Mixtral</td></tr>
              <tr><td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium">Ollama</td><td className="border-b border-gray-800/50 py-3 pr-6 text-emerald-400 font-mono">ollama</td><td className="border-b border-gray-800/50 py-3 text-gray-300">100% local/offline — no data leaves your machine</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-300 text-sm">Per-provider API key rotation is supported — add multiple keys separated by commas for automatic failover.</p>
      </>
    )
  },

  "Ghost Mode": {
    title: "Ghost Mode",
    icon: Shield,
    content: (
      <>
        {/* ── Opening ──────────────────────────────────────── */}
        <p className="text-gray-300 mb-4 leading-relaxed">
          <strong className="text-cyan-400">Ghost Mode</strong> is the crowning engineering achievement of the Must-b ecosystem. It represents the absolute pinnacle of physical intervention. Unlike traditional automation tools (like Selenium, Puppeteer, or Playwright) that rely on easily detectable, fragile DOM (Document Object Model) scraping, Ghost Mode transcends software sandboxes.
        </p>
        <p className="text-gray-300 mb-8 leading-relaxed">
          When engaged, Must-b does not read HTML; it reads raw pixels. It does not send HTTP requests; it physically commands your mouse and keyboard at the <strong className="text-white">Hardware Abstraction Layer (HAL)</strong>. This grants the AI an unprecedented level of sovereignty over legacy Desktop applications, remote desktop protocols (RDP), video games, and heavily protected web environments.
        </p>

        <hr className="border-gray-800 my-8" />

        {/* ── 1. Vision Pipeline ───────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">👁️ 1. The Cognitive Vision Pipeline (Pixel-Perfect Parsing)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          To interact with a system autonomously, the AI must first construct a spatial understanding of the screen. Must-b achieves this through a multi-layered local inference pipeline.
        </p>
        <ol className="list-decimal pl-5 space-y-4 text-gray-300 mb-6">
          <li className="leading-relaxed">
            <strong className="text-white">High-Frequency Frame Buffering:</strong> The Must-b daemon hooks directly into the OS display compositor (e.g., DXGI Desktop Duplication on Windows, CGDisplayStream on macOS) to capture uncompressed screen buffers at up to 60 FPS without taxing the CPU.
          </li>
          <li className="leading-relaxed">
            <strong className="text-white">Omni-Parser &amp; Bounding Box Generation:</strong> Captured frames are routed through a localized, quantized neural network (running efficiently on the CPU or local VRAM). This model detects interactive elements (buttons, inputs, dropdowns) and translates them into a strict spatial matrix of <code className="bg-gray-800 px-1 rounded text-emerald-400">[x, y]</code> coordinates.
          </li>
          <li className="leading-relaxed">
            <strong className="text-white">OCR (Optical Character Recognition) Overlay:</strong> Tesseract-based edge-detection runs in parallel to extract text from images, merging semantic meaning with spatial coordinates.
          </li>
        </ol>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`# Simplified representation of the Omni-Parser Vision Pipeline
def process_screen_buffer(frame_buffer):
    # 1. Edge detection and element segmentation
    bounding_boxes = vision_model.predict(frame_buffer, threshold=0.85)
    
    # 2. Extract semantic context via OCR
    text_overlay = ocr_engine.extract(frame_buffer)
    
    # 3. Map screen space to actionable coordinates
    spatial_matrix = SpatialMatrix.merge(bounding_boxes, text_overlay)
    
    return spatial_matrix.get_coordinates_for_intent("Click the Deploy Button")`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── 2. OS Hooking Table ──────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🦾 2. Deep OS Hooking &amp; Native Execution</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Once the Cloud Brain determines the exact <code className="bg-gray-800 px-1 rounded text-emerald-400">[x, y]</code> coordinates, the local daemon must execute the movement. Must-b utilizes C++ and Rust-based FFI (Foreign Function Interfaces) to bypass application-layer protections and communicate directly with the kernel's peripheral message queues.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm mb-8 mt-4">
            <thead>
              <tr>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Operating System</th>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Low-Level API Hook</th>
                <th className="border-b border-gray-800 pb-2 text-white font-semibold">Execution Mechanism &amp; Evasion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Windows (NT Kernel)</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-emerald-400 font-mono">User32.dll (SendInput)</td>
                <td className="border-b border-gray-800/50 py-3 text-gray-300">Dispatches synthetic events directly into the raw message queue. Bypasses higher-level UWP sandboxes and ignores application-level input blockers.</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">macOS (Darwin)</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-emerald-400 font-mono">Quartz Event Services</td>
                <td className="border-b border-gray-800/50 py-3 text-gray-300">Injects HID (Human Interface Device) payloads seamlessly into the CoreGraphics pipeline. Requires Accessibility permissions via Gatekeeper.</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Linux (Unix-like)</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-emerald-400 font-mono">X11 / uinput</td>
                <td className="border-b border-gray-800/50 py-3 text-gray-300">Manipulates display server protocols via direct socket communication, essentially creating a "virtual physical mouse" in <code className="bg-gray-800 px-1 rounded text-emerald-400">/dev/input/</code>.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr className="border-gray-800 my-8" />

        {/* ── 3. Neuromotor Evasion ────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🧠 3. Neuromotor Evasion Tactics (Bypassing Anti-Bot Heuristics)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Modern cybersecurity infrastructure (Cloudflare Turnstile, Datadome, Akamai Bot Manager, ReCAPTCHA v3) uses advanced machine learning to profile mouse movement. They flag linear A-to-B teleportation, constant velocity, and zero-latency clicks as bot activity.
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b's Ghost Mode employs <strong className="text-white">Neuromotor Trajectory Simulation</strong> to mathematically emulate the biological imperfections of a human hand.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-6">
          <li className="leading-relaxed"><strong className="text-white">Fitts's Law Physics:</strong> The acceleration and deceleration of the cursor are dynamically calculated based on the distance to the target and the target's size.</li>
          <li className="leading-relaxed"><strong className="text-white">Cubic Bezier Curves &amp; Entropy:</strong> The trajectory is never a straight line. Must-b injects mathematical "entropy"—randomized control points that create arcs, micro-hesitations, and overshoots/corrections before clicking.</li>
          <li className="leading-relaxed"><strong className="text-white">Variable Dwell Time:</strong> The time between a <code className="bg-gray-800 px-1 rounded text-emerald-400">mousedown</code> and <code className="bg-gray-800 px-1 rounded text-emerald-400">mouseup</code> event is randomized within human biological limits (e.g., 40ms to 120ms).</li>
        </ul>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`// The Physics of Ghost Mode: Emulating Human Imperfection
function executeGhostTrajectory(startX, startY, targetX, targetY) {
  const distance = Math.hypot(targetX - startX, targetY - startY);
  
  // 1. Calculate base velocity using Fitts's Law
  const targetWidth = 120; // Estimated button width
  const indexDifficulty = Math.log2((2 * distance) / targetWidth);
  const baseDuration = 100 + (indexDifficulty * 80); 
  
  // 2. Inject Biological Entropy (Bezier Control Points)
  const arcDeviation = Math.random() * 40 - 20; 
  const curve = new Bezier(startX, startY, startX + arcDeviation, startY + arcDeviation, targetX, targetY);
  
  // 3. Execute with micro-jitters
  return NativeMouse.trace(curve, { duration: baseDuration, jitter: 0.15 });
}`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── 4. Hardware Failsafe ─────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🛡️ 4. The Hardware Failsafe (Priority Kernel Interrupts)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Granting an autonomous system absolute control over your cursor introduces severe existential risks to your local environment. If an agent hallucinates, enters an infinite loop, or misinterprets the UI, it could inadvertently click destructive elements.
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b is engineered with a <strong className="text-white">Zero-Latency Hardware Failsafe</strong> to protect the host:
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-6">
          <li className="leading-relaxed">
            <strong className="text-white">Physical Override Heuristics:</strong> The daemon continuously listens to physical USB/Bluetooth mouse inputs. If the user physically moves the mouse while Ghost Mode is active, the daemon detects the physical-over-synthetic input clash and instantly pauses the agent.
          </li>
          <li className="leading-relaxed">
            <strong className="text-white">The SIGKILL Panic Switch:</strong> By pressing <code className="bg-gray-800 px-1 rounded text-emerald-400">CTRL + SHIFT + ESC</code> (Windows/Linux) or <code className="bg-gray-800 px-1 rounded text-emerald-400">CMD + SHIFT + ESC</code> (macOS), the Must-b background daemon receives a highest-priority kernel interrupt. This instantly kills the Node.js execution thread and severs the Cloud Brain connection, returning 100% absolute sovereignty to the human operator.
          </li>
        </ul>
      </>
    )
  },

  "API-less Native Browsing": {
    title: "API-less Native Browsing",
    icon: Globe,
    content: (
      <>
        {/* ── Opening ──────────────────────────────────────── */}
        <p className="text-gray-300 mb-4 leading-relaxed">
          The modern internet is a hostile, fragmented landscape. Corporate walled gardens, draconian CORS policies, heavily rate-limited GraphQL endpoints, and aggressive Web Application Firewalls (WAFs) like Cloudflare, Datadome, and Akamai have effectively killed the open web for traditional AI agents. Relying on official REST APIs means accepting artificial limitations, delayed data, and exorbitant paywalls.
        </p>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Must-b fundamentally rejects these constraints. Through <strong className="text-cyan-400">API-less Native Browsing</strong>, the Must-b daemon assumes the cryptographic and behavioral identity of a legitimate human user. It does not politely ask for data via APIs; it physically renders the target application, infiltrates the Virtual DOM, and extracts the intelligence directly from the structural layout.
        </p>

        <hr className="border-gray-800 my-8" />

        {/* ── 1. CDP Revolution ────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🕸️ 1. The Death of the WebDriver &amp; The CDP Revolution</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Traditional automation tools (Selenium, Playwright, Puppeteer) are functionally obsolete against modern security. The moment a script launches, the browser leaks a <code className="bg-gray-800 px-1 rounded text-emerald-400">navigator.webdriver = true</code> flag, instantly triggering CAPTCHAs and IP bans.
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b operates at a fundamentally deeper level. Instead of wrapping the browser in a detectable automation layer, Must-b spawns a completely isolated, headless Chromium process and assumes control exclusively via raw <strong className="text-white">Chrome DevTools Protocol (CDP) Websockets</strong>. By directly manipulating the V8 JavaScript engine and the Blink rendering pipeline, Must-b acts as an invisible puppeteer.
        </p>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`// Must-b CDP Injection Engine: Bypassing Automation Tripwires
async function spawnCryptographicBrowserContext(targetUrl: string) {
  const browser = await CDPEngine.launch({
    headless: "new",
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',           // Annihilate CORS restrictions
      '--disable-site-isolation-trials',  // Bypass out-of-process iframes (OOPIF)
      '--no-sandbox',
      '--disable-gpu-sandbox'
    ]
  });
  
  const cdpSession = await browser.target().createCDPSession();
  
  // Strip out webdriver signatures at the V8 engine level before the first page load
  await cdpSession.send('Page.addScriptToEvaluateOnNewDocument', {
    source: \`
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      window.chrome = { runtime: {} };
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
    \`
  });
  
  return cdpSession;
}`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── 2. Fingerprint Masking ───────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🎭 2. Multi-Layer Cryptographic Fingerprint Masking</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          WAFs do not just check for webdriver flags; they cryptographically fingerprint your machine. To survive, Must-b employs a dynamic spoofing engine that synthesizes organic hardware signatures on the fly, making the daemon indistinguishable from a high-end consumer laptop.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed"><strong className="text-white">TLS/JA3 Signature Spoofing:</strong> Standard Node.js HTTP clients have predictable TLS Hello packets (JA3 fingerprints) that are instantly blocked. Must-b routes requests through a custom HTTP/3 QUIC layer, perfectly mimicking the TLS signature of a standard Chrome browser.</li>
          <li className="leading-relaxed"><strong className="text-white">WebGL &amp; Canvas Noise Injection:</strong> Security scripts render hidden 3D shapes on a <code className="bg-gray-800 px-1 rounded text-emerald-400">&lt;canvas&gt;</code> to fingerprint your specific GPU. Must-b intercepts the <code className="bg-gray-800 px-1 rounded text-emerald-400">getContext('webgl')</code> API, injecting algorithmic micro-noise into the rendering buffer, effectively creating a new, untraceable virtual GPU for every session.</li>
          <li className="leading-relaxed"><strong className="text-white">AudioContext Masking:</strong> Must-b alters the oscillator dynamics and compressor signatures at the OS audio-stack level to bypass audio-fingerprinting heuristics.</li>
          <li className="leading-relaxed"><strong className="text-white">Hardware Profile Generation:</strong> Dynamically randomizes <code className="bg-gray-800 px-1 rounded text-emerald-400">navigator.deviceMemory</code>, <code className="bg-gray-800 px-1 rounded text-emerald-400">navigator.hardwareConcurrency</code>, and screen resolution metrics to simulate realistic consumer hardware entropy.</li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 3. Async Rendering ───────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">⏳ 3. Asynchronous Rendering &amp; The Event Loop</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Legacy AI scrapers fail spectacularly on Single-Page Applications (React, Vue, Angular) because they parse the initial HTML payload, which is usually just an empty <code className="bg-gray-800 px-1 rounded text-emerald-400">&lt;div id="root"&gt;&lt;/div&gt;</code>. The actual data is fetched asynchronously via JavaScript.
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b's Native Browsing engine does not care about static HTML. It waits for the <strong className="text-white">Network Idle State</strong>.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed"><strong className="text-white">Request Interception:</strong> Must-b hooks into the CDP Network domain, monitoring every outbound XHR/Fetch request and WebSocket frame.</li>
          <li className="leading-relaxed"><strong className="text-white">JIT Compilation Monitoring:</strong> It waits until the V8 Just-In-Time compiler has executed the client-side JavaScript.</li>
          <li className="leading-relaxed"><strong className="text-white">Visual Paint Confirmation:</strong> The engine verifies that the GraphQL/REST payloads have resolved and the browser has painted the final visual layout tree onto the screen before extraction begins.</li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 4. Shadow DOM Piercing ───────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🗡️ 4. Piercing the Shadow DOM &amp; Nested Iframes</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Modern web components utilize the <code className="bg-gray-800 px-1 rounded text-emerald-400">ShadowRoot</code> API to encapsulate styling and markup, completely hiding crucial data from standard <code className="bg-gray-800 px-1 rounded text-emerald-400">document.querySelector</code> operations. Financial dashboards and secure payment gateways often bury data inside nested, cross-origin iframes.
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b recursively traverses the DOM tree. When it encounters a <code className="bg-gray-800 px-1 rounded text-emerald-400">shadowRoot</code> (even if it is set to <code className="bg-gray-800 px-1 rounded text-emerald-400">mode: 'closed'</code>), Must-b uses its elevated CDP privileges to pierce the boundary, unpack the hidden nodes, and flatten the entire application state into a single, analyzable Abstract Syntax Tree (AST).
        </p>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`// Shadow DOM Piercing via Recursive AST Flattening
function extractDeepNodes(rootElement) {
  let nodes = [];
  const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_ELEMENT);
  
  while (walker.nextNode()) {
    const node = walker.currentNode;
    nodes.push(node);
    
    // Pierce Shadow DOM boundaries
    if (node.shadowRoot) {
      nodes.push(...extractDeepNodes(node.shadowRoot));
    }
    
    // Pierce Same-Origin Iframes
    if (node.tagName === 'IFRAME' && node.contentDocument) {
      nodes.push(...extractDeepNodes(node.contentDocument.body));
    }
  }
  return nodes;
}`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── 5. Semantic Extraction ───────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🧠 5. Semantic Extraction (The Omni-Parser)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Once the WAF is bypassed and the page is fully rendered, Must-b does not rely on brittle CSS selectors that break the moment a website updates its UI.
        </p>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Instead, Must-b serializes the flattened DOM into a compressed semantic tree and feeds it to the Cloud Brain. The Orchestrator LLM looks at the structural relationships (e.g., <em>"This text is visually adjacent to an input field labeled 'Email'"</em>) and deduces the context autonomously. It extracts the data based on visual and semantic meaning, not hardcoded class names.
        </p>

        <hr className="border-gray-800 my-8" />

        {/* ── 6. Anti-Bot Matrix ───────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">⚖️ Anti-Bot &amp; Browsing Supremacy Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm mb-8 mt-4">
            <thead>
              <tr>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Evasion / Execution Layer</th>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Legacy Tools (Puppeteer/BeautifulSoup)</th>
                <th className="border-b border-gray-800 pb-2 text-white font-semibold">Must-b Native Browsing Engine</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">JavaScript Execution</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Fails on SPAs (Reads raw HTML)</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Executes full V8 engine &amp; waits for visual paint</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Automation Flags</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Leaks <code className="bg-gray-900 px-1 rounded">webdriver: true</code></td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">CDP manipulation strips all automation flags</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">TLS Identity</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Predictable Node.js / Python JA3</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Spoofed HTTP/3 QUIC matching Chrome exactly</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">CAPTCHA Handling</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Blocked indefinitely</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Failsafes to Ghost Mode for physical interaction</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Dynamic Content</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Blind to closed Shadow DOMs</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Deep AST traversal &amp; CDP Shadow Root piercing</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Hardware Tracking</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Easily fingerprinted by GPU</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Injects cryptographic noise into WebGL/Canvas APIs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  },

  "Terminal Supremacy": {
    title: "Terminal Supremacy",
    icon: Terminal,
    content: (
      <>
        {/* ── Opening ──────────────────────────────────────── */}
        <p className="text-gray-300 mb-4 leading-relaxed">
          For traditional AI, the command-line interface is a foreign concept—a place where it occasionally suggests bash snippets for the user to manually copy and paste. Must-b fundamentally shatters this barrier.
        </p>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Through <strong className="text-cyan-400">Terminal Supremacy</strong>, the command line is not just a tool; it is the Cognitive OS's primary domain for system-level orchestration. Must-b does not merely execute commands; it assimilates the shell environment, maintaining persistent state, managing detached processes, and autonomously self-healing broken deployments.
        </p>

        <hr className="border-gray-800 my-8" />

        {/* ── 1. PTY Multiplexing ──────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🖥️ 1. Persistent PTY Multiplexing (Stateful Shells)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Standard AI CLI tools execute commands in isolated, stateless child processes (e.g., Node's <code className="bg-gray-800 px-1 rounded text-emerald-400">child_process.exec</code>). This means they forget environment variables (<code className="bg-gray-800 px-1 rounded text-emerald-400">$PATH</code>), directory changes (<code className="bg-gray-800 px-1 rounded text-emerald-400">cd</code>), and SSH keys the millisecond the command finishes.
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b implements native <strong className="text-white">Pseudo-Terminal (PTY) Multiplexing</strong>. It spawns persistent, stateful <code className="bg-gray-800 px-1 rounded text-emerald-400">bash</code>, <code className="bg-gray-800 px-1 rounded text-emerald-400">zsh</code>, or <code className="bg-gray-800 px-1 rounded text-emerald-400">powershell</code> sessions in the background.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed">
            <strong className="text-white">State Retention:</strong> When Must-b navigates to <code className="bg-gray-800 px-1 rounded text-emerald-400">/var/www/html</code>, activates a Python <code className="bg-gray-800 px-1 rounded text-emerald-400">venv</code>, and exports an <code className="bg-gray-800 px-1 rounded text-emerald-400">AWS_ACCESS_KEY</code>, that exact state is preserved for all subsequent multi-agent operations.
          </li>
          <li className="leading-relaxed">
            <strong className="text-white">Interactive Prompt Handling:</strong> If a command prompts for user input (e.g., <code className="bg-gray-800 px-1 rounded text-emerald-400">Do you want to continue? [Y/n]</code>), Must-b intercepts the <code className="bg-gray-800 px-1 rounded text-emerald-400">stdout</code> stream in real-time, autonomously evaluates the context via the Cloud Brain, and injects the correct <code className="bg-gray-800 px-1 rounded text-emerald-400">stdin</code> response without freezing.
          </li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 2. Auto-Healing Loop ─────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🧬 2. The Auto-Debugging Healing Loop</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          The hallmark of Terminal Supremacy is Must-b's ability to act as a relentless DevOps engineer. When a complex operation fails (e.g., compiling a Next.js application, building a fractured Docker image, or encountering a Rust borrow-checker error), Must-b does not halt execution and ask the human for help.
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          It traps the <code className="bg-gray-800 px-1 rounded text-emerald-400">stderr</code> output, reads the non-zero exit code, and initiates an <strong className="text-white">Asynchronous Auto-Healing Event Loop</strong>:
        </p>
        <ol className="list-decimal pl-5 space-y-3 text-gray-300 mb-6">
          <li className="leading-relaxed"><strong className="text-white">Trace Ingestion:</strong> The daemon captures the full stack trace and feeds it back into the Omni-Context Memory.</li>
          <li className="leading-relaxed"><strong className="text-white">AST Structural Patching:</strong> The Cloud Brain synthesizes an Abstract Syntax Tree (AST) diff, locates the faulty logic in the local file system, and writes a highly targeted patch.</li>
          <li className="leading-relaxed"><strong className="text-white">Recursive Execution:</strong> Must-b re-runs the compiler. If it fails again, it increases the context depth and tries a new topological approach.</li>
          <li className="leading-relaxed"><strong className="text-white">Zero-Exit Sovereignty:</strong> This loop continues recursively (capped by the <code className="bg-gray-800 px-1 rounded text-emerald-400">maxRecursionDepth</code> limit) until a <code className="bg-gray-800 px-1 rounded text-emerald-400">0</code> exit code is definitively achieved.</li>
        </ol>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`// The Autonomous Healing Loop Architecture (Conceptual)
async function executeWithSupremacy(command: string, contextDir: string, depth = 0) {
  if (depth > MAX_RECURSION) throw new Error("Terminal Supremacy: Irrecoverable Cascade.");

  const { exitCode, stdout, stderr } = await PTYEngine.run(command, contextDir);
  
  if (exitCode !== 0) {
    Logger.warn(\`Execution failed. Initiating Healing Loop (Depth: \${depth + 1})\`);
    
    // Cloud Brain analyzes the raw stderr and the current file state
    const astPatch = await CloudBrain.analyzeFailure(stderr, FileSystem.getTree());
    
    // Local Muscle applies the patch directly to the disk
    await FileSystem.applyPatch(astPatch);
    
    // Recursive re-execution
    return executeWithSupremacy(command, contextDir, depth + 1);
  }
  
  return stdout; // Execution Sovereign
}`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── 3. PID Sovereignty ───────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">⚙️ 3. PID Sovereignty &amp; Zombie Eradication</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b manages the lifecycle of your host's background tasks with extreme prejudice.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed">
            <strong className="text-white">Detached Spawning:</strong> It can spin up local PostgreSQL databases, Redis caches, or Next.js development servers as detached daemons, keeping them alive even if the main Must-b UI is closed.
          </li>
          <li className="leading-relaxed">
            <strong className="text-white">Zombie Process Eradication:</strong> Utilizing OS-level telemetry, Must-b detects orphaned child processes (zombies) that are hoarding ports (e.g., <code className="bg-gray-800 px-1 rounded text-emerald-400">EADDRINUSE: port 3000 is already in use</code>) and aggressively terminates them via <code className="bg-gray-800 px-1 rounded text-emerald-400">SIGKILL</code> before restarting the required service.
          </li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 4. Hookify Shield ────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🛡️ 4. The Hookify Shield (Execution Air-Gap)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Absolute power requires absolute discipline. Granting an AI stateful, root-level terminal access is a massive security vector. Must-b mitigates this via the <strong className="text-white">Hookify Engine</strong>.
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Before any shell command is physically dispatched to the PTY, it must pass through a strict, zero-trust validation layer.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed">Destructive patterns (e.g., <code className="bg-gray-800 px-1 rounded text-emerald-400">rm -rf /</code>, <code className="bg-gray-800 px-1 rounded text-emerald-400">mkfs</code>, <code className="bg-gray-800 px-1 rounded text-emerald-400">DROP TABLE</code>) are intercepted at the AST level.</li>
          <li className="leading-relaxed">Hookify enforces plain-language rules defined by the user (e.g., <em>"Never delete directories outside of ./tmp"</em>) and translates them into rigid cryptographic execution blockers. The Cloud Brain proposes the command; Hookify authorizes it.</li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 5. Matrix ────────────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">⚖️ Command Line Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm mb-8 mt-4">
            <thead>
              <tr>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Feature</th>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Stateless AI CLI Wrappers</th>
                <th className="border-b border-gray-800 pb-2 text-white font-semibold">Must-b Terminal Supremacy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Execution Context</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Ephemeral, stateless <code className="bg-gray-900 px-1 rounded">exec()</code></td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Persistent, stateful PTY (Pseudo-Terminal)</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Interactive Prompts</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Freezes or crashes</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Autonomously reads stdout and pipes stdin</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Error Handling</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Prints error and exits</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Triggers AST-patching Auto-Healing Loop</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Process Management</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Blind to background PIDs</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Kills port-hogging zombies, spawns daemons</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Security Mechanism</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">None (Executes anything)</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Hookify Shield (AST-level destructive command blocking)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  },

  "Cyber Fortress": {
    title: "Cyber Fortress",
    icon: Shield,
    content: (
      <>
        {/* ── Opening ──────────────────────────────────────── */}
        <p className="text-gray-300 mb-4 leading-relaxed">
          An autonomous AI with bare-metal OS access and Terminal Supremacy is, by definition, a loaded weapon. If compromised, it is not just a data breach; it is total system subversion. Therefore, the Must-b ecosystem is engineered with a paranoid, uncompromising <strong className="text-white">Zero-Trust Cybersecurity Architecture</strong> known as the Cyber Fortress.
        </p>
        <p className="text-gray-300 mb-8 leading-relaxed">
          We operate under the assumption that the network is always hostile, the Cloud Brain can hallucinate, and external webhook channels are constantly under attack.
        </p>

        <hr className="border-gray-800 my-8" />

        {/* ── 1. Cryptographic Vault ───────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🔐 1. The Local Cryptographic Vault (Air-Gapped Secrets)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          In traditional SaaS architectures, your API keys (OpenAI, AWS, Database URIs) are uploaded to a centralized cloud. Must-b fundamentally rejects this.
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          All cognitive execution happens in the cloud, but <strong className="text-white">secrets never leave your machine</strong>. The local Must-b daemon provisions an encrypted SQLite vault (<code className="bg-gray-800 px-1 rounded text-emerald-400">~/.must-b/vault.db</code>) secured via AES-256-GCM.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed">Keys are injected directly into the local execution thread (The Muscle) strictly at runtime.</li>
          <li className="leading-relaxed">The Cloud Brain generates the code (e.g., a Python script to query AWS), but the Local Muscle injects the <code className="bg-gray-800 px-1 rounded text-emerald-400">AWS_ACCESS_KEY</code> dynamically during execution. The LLM never sees your actual credentials.</li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 2. PostgreSQL RLS ────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🛡️ 2. PostgreSQL Row Level Security (Cryptographic Tenant Isolation)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          For cloud-synchronized operational data (such as Live Task Delegation logs, Agent state management, and Vector Vault payloads), Must-b utilizes Supabase. We do not rely on application-layer logic to separate user data; we enforce it at the database engine level using <strong className="text-white">draconian Row Level Security (RLS)</strong>.
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Authentication JWT (JSON Web Tokens) are verified at the edge. A user can mathematically only access, read, or modify data that is cryptographically bound to their <code className="bg-gray-800 px-1 rounded text-emerald-400">auth.uid()</code>. Even if the middleware is compromised, the Postgres kernel will deny access to unauthorized rows.
        </p>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`-- Core Security Policy for Sovereign Agent Execution
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Strict Isolation: Users can only mutate their own autonomous nodes
CREATE POLICY "Strict Isolation: Read/Write bound to JWT UID"
ON agents FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Enforce Immutable Audit Logs (Append-Only)
CREATE POLICY "Append-Only Task Logs"
ON task_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── 3. Zero-Trust Webhooks ───────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🌉 3. The Bridge: Zero-Trust Webhook Ingestion</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b allows you to trigger autonomous workflows remotely via WhatsApp, Discord, or Slack. This introduces a critical attack vector: What if a malicious actor spoofs a WhatsApp payload to execute commands on your local machine?
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          The Bridge endpoints are fortified with a multi-layered cryptographic verification matrix to prevent Replay Attacks, MITM (Man-in-the-Middle) interception, and Payload Tampering:
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-6">
          <li className="leading-relaxed">
            <strong className="text-white">HMAC-SHA256 Signature Validation:</strong> Every incoming webhook must contain a cryptographic hash generated by the provider (e.g., <code className="bg-gray-800 px-1 rounded text-emerald-400">X-Hub-Signature-256</code>). The Must-b edge router recalculates this hash using your private <code className="bg-gray-800 px-1 rounded text-emerald-400">WEBHOOK_SECRET</code>. If the hashes mismatch by a single byte, the payload is silently dropped.
          </li>
          <li className="leading-relaxed">
            <strong className="text-white">Timestamp Drift Protection:</strong> To prevent replay attacks (where a hacker intercepts a valid webhook and resends it later), Must-b enforces a strict 5-minute TTL (Time-To-Live). If <code className="bg-gray-800 px-1 rounded text-emerald-400">{"Math.abs(Date.now() - payload.timestamp) > 300000"}</code>, the request is mathematically invalidated.
          </li>
        </ul>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`// Edge-Level HMAC Verification & Replay Protection
function verifyZeroTrustPayload(req, rawBody, secret) {
  const signature = req.headers['x-hub-signature-256'];
  const timestamp = req.headers['x-timestamp'];
  
  // 1. Replay Attack Mitigation
  if (Date.now() - parseInt(timestamp) > 300000)
    throw new SecurityError("Timestamp Drift Exceeded.");

  // 2. Cryptographic Integrity Check
  const expectedHash = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  if (!crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(\`sha256=\${expectedHash}\`)
  )) {
    throw new SecurityError("HMAC Signature Mismatch. Payload Tampered.");
  }
}`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── 4. Hookify Shield ────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🛑 4. The Hookify Execution Shield (AST Sanitization)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Even if a command originates from an authenticated user, the LLM (Cloud Brain) might hallucinate a destructive command (e.g., <code className="bg-gray-800 px-1 rounded text-emerald-400">rm -rf /</code> or <code className="bg-gray-800 px-1 rounded text-emerald-400">DROP TABLE users</code>).
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Before the Local Muscle dispatches any command to the Terminal or the OS, it must pass through the <strong className="text-white">Hookify Engine</strong>. Hookify does not use simple regex matching; it parses the command into an Abstract Syntax Tree (AST) and evaluates the semantic intent against your strict policy rules.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed"><strong className="text-white">Rule Example:</strong> <em>"Never allow deletion of files outside the ./temp directory."</em></li>
          <li className="leading-relaxed">If the LLM generates <code className="bg-gray-800 px-1 rounded text-emerald-400">rm -rf /var/www/html</code>, Hookify detects the scope violation at the AST level and triggers a <strong className="text-red-400">Fatal Execution Block</strong>, overriding the Cloud Brain entirely.</li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 5. Security Matrix ───────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">⚖️ The Security Paradigm Shift</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm mb-8 mt-4">
            <thead>
              <tr>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Vulnerability Vector</th>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Traditional Cloud AI Providers</th>
                <th className="border-b border-gray-800 pb-2 text-white font-semibold">Must-b Cyber Fortress</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">API Keys &amp; Secrets</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Uploaded to third-party cloud servers</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Encrypted locally (AES-256); injected at runtime</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Command Execution</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Unrestricted remote container execution</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Gated by Hookify AST analysis and Local Failsafes</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Data Isolation</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Software-level tenant checks (Prone to bugs)</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Engine-level PostgreSQL Row Level Security (RLS)</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Remote Triggers</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Basic token checks</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">HMAC-SHA256 integrity + Timestamp Anti-Replay</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  },

  "Omni-Context Memory": {
    title: "Omni-Context Memory",
    icon: Database,
    content: (
      <>
        {/* ── Opening ──────────────────────────────────────── */}
        <p className="text-gray-300 mb-4 leading-relaxed">
          The fatal flaw of modern Large Language Models (LLMs) is <strong className="text-white">Context Amnesia</strong>. As a conversation token window expands, the AI begins to "forget" earlier instructions, loses track of file structures, and inevitably hallucinates. Traditional AI relies on a static, linear context window.
        </p>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Must-b fundamentally eradicates Context Amnesia by decentralizing its memory architecture. Through <strong className="text-cyan-400">Omni-Context Memory</strong>, Must-b operates a dual-layer, infinite-horizon storage mechanism that ensures zero degradation in cognitive recall, whether it is managing a 10-line script or a 5-million-line enterprise monorepo.
        </p>

        <hr className="border-gray-800 my-8" />

        {/* ── 1. Dual-Layer Architecture ───────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🧠 1. The Dual-Layer Memory Architecture</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b does not shove your entire codebase into the LLM prompt. That is inefficient and mathematically impossible for massive repositories. Instead, it maintains two distinct memory layers:
        </p>
        <ol className="list-decimal pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed"><strong className="text-white">Short-Term Conversational Memory (<code className="bg-gray-800 px-1 rounded text-emerald-400">user.json</code>):</strong> A rapid-access cache of the last 200 interaction turns, active environment variables, and immediate task context.</li>
          <li className="leading-relaxed"><strong className="text-white">Long-Term Semantic Vector Vault (SQLite FTS5 + PgVector):</strong> An encrypted, local database where millions of lines of code, PDFs, and documentation are mathematically compressed into high-dimensional space.</li>
        </ol>

        <hr className="border-gray-800 my-8" />

        {/* ── 2. AST-Aware Chunking ────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🔪 2. AST-Aware Semantic Chunking</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Traditional RAG (Retrieval-Augmented Generation) systems use naive "Recursive Character Text Splitting" (e.g., cutting a file every 1000 characters). This breaks code blocks in half, destroying the logic.
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b's ingestion engine is <strong className="text-white">AST-Aware (Abstract Syntax Tree)</strong>.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed">When Must-b ingests a Python or TypeScript file, it parses the actual syntax tree.</li>
          <li className="leading-relaxed">It chunks the data semantically—keeping whole functions, classes, and interfaces perfectly intact.</li>
          <li className="leading-relaxed">Metadata (file path, imports, dependencies) is cryptographically attached to every chunk before it is sent to the embedding model.</li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 3. HNSW Indexing ─────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🌌 3. High-Dimensional Vectorization &amp; HNSW Indexing</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Once the data is semantically chunked, Must-b converts these text blocks into dense mathematical vectors (typically 1536 dimensions using state-of-the-art embedding models).
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          To search through millions of vectors in milliseconds without crashing your CPU, Must-b utilizes <strong className="text-white">HNSW (Hierarchical Navigable Small World)</strong> graph algorithms locally.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-6">
          <li className="leading-relaxed"><strong className="text-white">The Mathematics of Recall:</strong> When the Orchestrator Engine needs to know "How does the authentication module work?", it converts that question into a vector.</li>
          <li className="leading-relaxed"><strong className="text-white">Cosine Similarity Thresholds:</strong> The local HNSW index calculates the cosine distance between the question's vector and the billions of coordinates in the vault.</li>
          <li className="leading-relaxed"><strong className="text-white">Zero-Latency Retrieval:</strong> Must-b instantly extracts the top-K most mathematically relevant code snippets and injects <em>only</em> those fragments into the Cloud Brain's context window.</li>
        </ul>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`# Conceptual Architecture of the Omni-Context Retrieval Engine
async def query_omni_context(intent: str, top_k: int = 5):
    # 1. Convert human intent into a 1536-dimensional vector
    query_vector = await embedding_model.embed(intent)
    
    # 2. Execute HNSW Graph Search on the Local SQLite Vault
    # Calculates cosine similarity distances in O(log N) time
    raw_results = local_vault.hnsw_search(query_vector, k=top_k)
    
    # 3. Apply Temporal Decay & Reranking
    ranked_context = reranker_engine.apply_temporal_decay(raw_results)
    
    # 4. Inject strict, hallucination-free context to the Cloud Brain
    return Orchestrator.inject_context(ranked_context)`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── 4. Temporal Decay ────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">⏳ 4. Temporal Decay &amp; Memory Pruning</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Not all memories are equal. A bug fix from 5 minutes ago is infinitely more relevant than a boilerplate setup from 3 months ago.
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b implements a strict <strong className="text-white">Temporal Decay Function</strong>. As vectors age, their "relevance weight" slowly diminishes unless they are accessed again (which strengthens their neural pathway). This prevents stale, deprecated code from polluting the Cloud Brain's decision-making process.
        </p>

        <hr className="border-gray-800 my-8" />

        {/* ── 5. Memory Matrix ─────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">⚖️ Memory Paradigm Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm mb-8 mt-4">
            <thead>
              <tr>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Feature</th>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Traditional AI (ChatGPT/Claude)</th>
                <th className="border-b border-gray-800 pb-2 text-white font-semibold">Must-b Omni-Context Memory</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Storage Limit</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Hard token limit (128k - 200k tokens)</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Infinite (Limited only by local HDD space)</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Data Ingestion</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Blind text extraction</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">AST-Aware semantic parsing (Function/Class preservation)</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Recall Mechanism</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Reads the entire context linearly</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">HNSW Vector Search (O(log N) cosine similarity)</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Privacy &amp; Sovereignty</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Uploaded to third-party databases</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Encrypted locally in <code className="bg-gray-900 px-1 rounded text-emerald-400">~/.must-b/vault.db</code></td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Relevance Scaling</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Everything has equal weight</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Temporal Decay Engine prioritizes recent/active context</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  },

  "Orchestrator Engine": {
    title: "Orchestrator Engine",
    icon: Cpu,
    content: (
      <>
        {/* ── Opening ──────────────────────────────────────── */}
        <p className="text-gray-300 mb-4 leading-relaxed">
          The <strong className="text-cyan-400">Orchestrator Engine</strong> is the central nervous system of Must-b. Traditional "autonomous" AI frameworks operate on naive, linear <code className="bg-gray-800 px-1 rounded text-emerald-400">while-loops</code> (e.g., Think -&gt; Act -&gt; Observe). This primitive architecture collapses under the weight of complex enterprise tasks, leading to infinite loops and context degradation.
        </p>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Must-b fundamentally abandons linear execution. The Orchestrator Engine treats high-level human intents as complex engineering projects, compiling them into a <strong className="text-white">Directed Acyclic Graph (DAG)</strong> and delegating them to a localized swarm of specialized AI agents.
        </p>

        <hr className="border-gray-800 my-8" />

        {/* ── 1. Swarm Topology & The DAG Compiler ─────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🕸️ 1. Swarm Topology &amp; The DAG Compiler</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          When you instruct Must-b to "Build a full-stack Next.js dashboard with a Supabase backend," a single LLM cannot hold all that context and execute it linearly without hallucinating.
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          The Orchestrator acts as the <strong className="text-white">Project Manager (PM)</strong>. It parses your intent and compiles it into a strict DAG execution matrix:
        </p>
        <ol className="list-decimal pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed">
            <strong className="text-white">Node Isolation:</strong> The task is shattered into atomic, independent nodes (e.g., <code className="bg-gray-800 px-1 rounded text-emerald-400">Setup_DB</code>, <code className="bg-gray-800 px-1 rounded text-emerald-400">Scaffold_UI</code>, <code className="bg-gray-800 px-1 rounded text-emerald-400">Write_Auth_Logic</code>).
          </li>
          <li className="leading-relaxed">
            <strong className="text-white">Dependency Resolution:</strong> The Orchestrator maps which tasks depend on others. (e.g., <code className="bg-gray-800 px-1 rounded text-emerald-400">Write_Auth_Logic</code> cannot start until <code className="bg-gray-800 px-1 rounded text-emerald-400">Setup_DB</code> completes).
          </li>
          <li className="leading-relaxed">
            <strong className="text-white">Parallel Execution:</strong> Any nodes without codependencies are executed simultaneously by different agent instances, drastically reducing total completion time.
          </li>
        </ol>

        <hr className="border-gray-800 my-8" />

        {/* ── 2. Dynamic Neural Routing ────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🧠 2. Dynamic Neural Routing (Cost-Optimized Intelligence)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Not all tasks require the immense cognitive overhead (and cost) of an advanced model like Claude 3.5 Sonnet or GPT-4o. The Orchestrator Engine employs <strong className="text-white">Dynamic Neural Routing</strong> to assign the perfect LLM to each specific node in the DAG.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-6">
          <li className="leading-relaxed">
            <strong className="text-white">Heavy Synthesis (Claude 3.5 Sonnet / DeepSeek-V3):</strong> Routed exclusively for complex architectural decisions, deep refactoring, and AST patching.
          </li>
          <li className="leading-relaxed">
            <strong className="text-white">Rapid Tool Execution (Groq / Llama 3):</strong> Routed for high-speed, low-latency tasks like executing basic terminal commands, parsing git diffs, or navigating DOM trees in Ghost Mode.
          </li>
          <li className="leading-relaxed">
            <strong className="text-white">Local Verification (Ollama):</strong> Fallback routing for validating PII/sensitive data offline before sending payloads to external cloud models.
          </li>
        </ul>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`// Conceptual DAG Node Orchestration & Neural Routing
interface DAGNode {
  id: string;
  intent: string;
  dependencies: string[]; // IDs of nodes that must complete first
  requiredCapability: 'TERMINAL' | 'BROWSER' | 'GHOST_MODE' | 'AST_PATCH';
  optimalModel: 'claude-3-5-sonnet' | 'groq-llama-3' | 'gpt-4o-mini';
}

async function executeSwarm(graph: DAGNode[]) {
  const readyNodes = Orchestrator.getResolvableNodes(graph);
  
  // Execute independent tasks in parallel across the agent swarm
  await Promise.all(readyNodes.map(async (node) => {
    const agent = Swarm.provisionAgent(node.optimalModel);
    await agent.execute(node);
  }));
}`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── 3. QA Sentinel ───────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🛑 3. The QA Sentinel &amp; AST-Level Rollbacks</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          In a true operating system, failures are inevitable (APIs go down, compilers throw errors). The Orchestrator Engine does not crash when an agent makes a mistake. It operates a dedicated <strong className="text-white">QA Sentinel Agent</strong>.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed">
            Every time a "Developer Agent" modifies a file or writes a function, the QA Sentinel autonomously reviews the diff and runs the local test suite via Terminal Supremacy.
          </li>
          <li className="leading-relaxed">
            If the tests fail, the QA Sentinel generates a highly specific critique.
          </li>
          <li className="leading-relaxed">
            <strong className="text-white">Stateful Rollback:</strong> If the Developer Agent enters a degenerative failure loop, the Orchestrator halts that branch of the DAG, instantly rolls back the File System to the exact AST state before the node started, and re-routes the task to a higher-tier model.
          </li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 4. System-Wide Telemetry ─────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">📡 4. System-Wide Telemetry (Ghost Guard Integration)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          The Orchestrator Engine is deeply aware of the host machine's physical limits. Before spawning multiple agents in parallel, it consults <strong className="text-white">Ghost Guard</strong>.
        </p>
        <p className="text-gray-300 mb-8 leading-relaxed">
          If spinning up 4 concurrent V8 isolation contexts for parallel web scraping threatens to exhaust the host's RAM, the Orchestrator dynamically flattens the DAG into a linear queue, sacrificing speed to ensure absolute system stability.
        </p>

        <hr className="border-gray-800 my-8" />

        {/* ── 5. Architecture Matrix ───────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">⚖️ Architecture Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm mb-8 mt-4">
            <thead>
              <tr>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Capability</th>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Legacy Autonomous AI</th>
                <th className="border-b border-gray-800 pb-2 text-white font-semibold">Must-b Orchestrator Engine</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Execution Architecture</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Linear, single-thread loops</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Parallel DAG (Directed Acyclic Graph) workflows</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Model Usage</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Monolithic (One expensive model for everything)</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Dynamic Neural Routing (Mixes Groq, Claude, OpenAI)</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Error Handling</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Frequently gets stuck in infinite retry loops</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">QA Sentinel with AST-level snapshot rollbacks</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Resource Awareness</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Blindly consumes memory until crash</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Ghost Guard integration throttles agent spawning</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  },

  "Cross-Platform Nodes": {
    title: "Cross-Platform Nodes",
    icon: Layers,
    content: (
      <>
        {/* ── Opening ──────────────────────────────────────── */}
        <p className="text-gray-300 mb-4 leading-relaxed">
          An AI that only understands a single operating system is merely an application. An AI that can seamlessly adapt its execution matrix to any host architecture is a true <strong className="text-white">Cognitive Operating System</strong>.
        </p>
        <p className="text-gray-300 mb-8 leading-relaxed">
          The Must-b swarm is designed to be universally infectious. Through the deployment of <strong className="text-cyan-400">Cross-Platform Nodes</strong>, the Orchestrator Engine dynamically translates high-level cloud directives into the native machine code, syscalls, and scripting dialects of the host environment.
        </p>

        <hr className="border-gray-800 my-8" />

        {/* ── 1. Dynamic HAL ───────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">💻 1. The Dynamic HAL (Hardware Abstraction Layer)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          When the Cloud Brain decides, <em>"I need to forcefully terminate the process running on port 3000,"</em> it does not hardcode a specific terminal command. It sends an OS-agnostic intent to the local Node.
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          The Must-b HAL intercepts this intent and compiles it perfectly for the native architecture:
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-6">
          <li className="leading-relaxed">
            <strong className="text-white">Windows Node:</strong> Translates to <code className="bg-gray-800 px-1 rounded text-emerald-400">Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force</code>
          </li>
          <li className="leading-relaxed">
            <strong className="text-white">macOS/Linux Node:</strong> Translates to <code className="bg-gray-800 px-1 rounded text-emerald-400">kill -9 $(lsof -t -i:3000)</code>
          </li>
        </ul>
        <pre className="bg-gray-900 text-emerald-400 p-4 rounded-lg my-6 overflow-x-auto border border-gray-800"><code>{`// The Cross-Platform Intent Router (Conceptual)
async function executeAgnosticIntent(intent: SystemIntent) {
  const osType = NativeOS.getArchitecture(); // 'win32' | 'darwin' | 'linux'
  
  if (intent.action === 'FLUSH_DNS') {
    switch (osType) {
      case 'win32': return PTY.execute('ipconfig /flushdns');
      case 'darwin': return PTY.execute('sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder');
      case 'linux': return PTY.execute('sudo resolvectl flush-caches');
      default: throw new FatalError("Unsupported Node Architecture");
    }
  }
}`}</code></pre>

        <hr className="border-gray-800 my-8" />

        {/* ── 2. Windows Node ──────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🪟 2. Windows Node Supremacy (The NT Kernel)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Windows is the undisputed king of enterprise environments, but its legacy architecture (Registry, COM Objects, Win32 APIs) is notoriously hostile to standard AI agents.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed"><strong className="text-white">PowerShell Deep Hooking:</strong> Must-b bypasses standard <code className="bg-gray-800 px-1 rounded text-emerald-400">cmd.exe</code> limitations, utilizing persistent PowerShell 5.1+ runspaces to interact directly with .NET objects.</li>
          <li className="leading-relaxed"><strong className="text-white">Registry &amp; Service Sovereignty:</strong> The daemon can autonomously modify Windows Registry keys to establish persistence or configure background <code className="bg-gray-800 px-1 rounded text-emerald-400">svchost</code> services.</li>
          <li className="leading-relaxed"><strong className="text-white">DXGI Frame Interception:</strong> Ghost Mode on Windows utilizes DirectX Graphics Infrastructure (DXGI) for zero-latency screen buffering, bypassing standard GDI capture bottlenecks.</li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 3. Unix & macOS ──────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🍏 3. Unix &amp; macOS Sovereignty (POSIX Compliance)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          On Unix-like systems, everything is a file. Must-b leverages this philosophy to achieve absolute system dominance.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed"><strong className="text-white">Daemonization (systemd &amp; launchd):</strong> The local agent provisions itself as a background service, ensuring it survives system reboots and user logouts.</li>
          <li className="leading-relaxed"><strong className="text-white">JXA &amp; AppleScript Injection:</strong> On macOS, Must-b breaks out of the terminal by synthesizing JavaScript for Automation (JXA) scripts. This allows the AI to autonomously control native macOS apps (System Settings, Finder, Safari) even when Ghost Mode (pixel-clicking) is disabled.</li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 4. Mobile Horizon ────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">📱 4. The Mobile Horizon: iOS &amp; Android Nodes (Active R&amp;D)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          A true Cognitive OS must eventually conquer the mobile ecosystem. Must-b Mobile Nodes are currently in advanced R&amp;D within our Cyber Fortress labs. We are not building a simple "Chat App"; we are building tethered mobile execution nodes.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed"><strong className="text-white">Android ADB Injection:</strong> By tethering an Android device to a Desktop Node via the Android Debug Bridge (ADB), Must-b can inject raw <code className="bg-gray-800 px-1 rounded text-emerald-400">input tap x y</code> and <code className="bg-gray-800 px-1 rounded text-emerald-400">input swipe</code> commands directly into the mobile kernel. This enables the AI to navigate apps like Instagram or TikTok that possess impenetrable APIs.</li>
          <li className="leading-relaxed"><strong className="text-white">iOS XCUITest Harnessing:</strong> Bypassing Apple's draconian sandboxing requires leveraging developer testing frameworks. The Must-b iOS Node utilizes automated XCUITest pathways to simulate physical gestures, text injection, and UI element parsing on un-jailbroken iPhones.</li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 5. Node Architecture Matrix ──────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">⚖️ Node Architecture Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm mb-8 mt-4">
            <thead>
              <tr>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Capability</th>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">Windows Node</th>
                <th className="border-b border-gray-800 pb-2 pr-6 text-white font-semibold">macOS / Linux Node</th>
                <th className="border-b border-gray-800 pb-2 text-white font-semibold">Mobile Nodes (R&amp;D)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Native Shell</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">PowerShell / CMD</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Bash / Zsh</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">ADB Shell / XCUITest</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">UI Automation</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Win32 API / Ghost Mode</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Quartz / X11 / JXA</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Appium / Native Injection</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Daemon Persistence</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">Windows Services</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">systemd / launchd</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Background Execution Limits apply</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">File System Access</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">NTFS (Full ACL control)</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">APFS / ext4 (Root via sudo)</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Sandboxed (Scoped storage only)</td>
              </tr>
              <tr>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-cyan-400 font-medium whitespace-nowrap">Cloud Brain Link</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">TCP WebSocket Bridge</td>
                <td className="border-b border-gray-800/50 py-3 pr-6 text-gray-300">TCP WebSocket Bridge</td>
                <td className="border-b border-gray-800/50 py-3 text-emerald-400 font-medium">Tethered / HTTP/3 QUIC</td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    )
  },

  "Proprietary License": {
    title: "Proprietary License",
    icon: Scale,
    content: (
      <>
        {/* ── 0. Warning Box ───────────────────────────────── */}
        <div className="border border-red-900/50 bg-red-950/20 p-6 rounded-lg mb-8">
          <h3 className="text-red-500 font-bold text-lg mb-4 tracking-widest uppercase">Strictly Closed Source &amp; Proprietary</h3>
          <p className="text-gray-200 font-mono text-sm">
            Copyright (c) 2026 Mustafa Aytaç ÖZTAN (Co-Founder) &amp; Muhammed Burak CANSU (Co-Founder).<br/>
            All rights reserved worldwide.
          </p>
        </div>

        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b Cognitive OS is classified as strictly <strong className="text-white">PROPRIETARY AND CLOSED SOURCE</strong> software. The architectural paradigms, cognitive routing algorithms, Ghost Mode neuromotor simulations, and OS-level telemetry infrastructures contained within this ecosystem represent significant, highly sensitive proprietary engineering.
        </p>
        <p className="text-gray-300 mb-8 leading-relaxed">
        {/* ── 1. Prohibitions ──────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🚫 1. Explicit Prohibitions (Zero-Tolerance Policy)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          By installing, downloading, or interacting with the Must-b daemon or its cloud infrastructure, you are legally bound by this agreement. The following actions are strictly prohibited and will trigger immediate legal prosecution under international intellectual property law:
        </p>
        <ul className="text-gray-300 mb-8 leading-relaxed list-disc list-inside space-y-3">
          <li>
            <strong className="text-white">Decompilation &amp; Reverse Engineering:</strong> You may not disassemble, decompile, or attempt to extract the source code of the Must-b local binaries, the Ghost Mode Vision Pipeline, or the Omni-Parser neural networks.
          </li>
          <li>
            <strong className="text-white">Algorithm Harvesting:</strong> You may not analyze the network traffic, CDP (Chrome DevTools Protocol) socket injections, or HAL (Hardware Abstraction Layer) hooks to replicate our API-less Native Browsing or Anti-Bot evasion methodologies.
          </li>
          <li>
            <strong className="text-white">Unauthorized SaaS Bridging:</strong> You may not wrap the Must-b ecosystem (or its agents) behind a commercial API, interface, or web application and offer its autonomous capabilities as a "Service" to third parties without an explicit Enterprise License.
          </li>
          <li>
            <strong className="text-white">License Bypassing:</strong> Modifying the compiled binaries to bypass Ghost Guard hardware checks, API authentication, or cloud-telemetry requirements is a direct violation of the DMCA and equivalent international treaties.
          </li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 2. Data Sovereignty ──────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">⚖️ 2. Data Sovereignty &amp; User Ownership</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          While the Must-b engine and its algorithms are exclusively owned by the Founders, <strong className="text-white">you maintain 100% absolute sovereignty over your personal data.</strong>
        </p>
        <ul className="text-gray-300 mb-8 leading-relaxed list-disc list-inside space-y-3">
          <li>Any code written, files modified, or applications generated by the Must-b Swarm on your local machine belong entirely to you.</li>
          <li>The contents of your local Omni-Context Memory vault (<code className="bg-gray-800 px-1 rounded text-emerald-400">~/.must-b/vault.db</code>) are encrypted and inaccessible to Must-b Inc. We do not claim ownership of the semantic vectors generated from your proprietary codebases.</li>
        </ul>

        <hr className="border-gray-800 my-8" />

        {/* ── 3. Enterprise Licensing ──────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🏢 3. Enterprise &amp; Commercial Licensing</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          The standard deployment of Must-b is intended for individual developers, researchers, and small tactical teams under the terms of the End User License Agreement (EULA).
        </p>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Corporations, sovereign entities, or organizations seeking to:
        </p>
        <ol className="text-gray-300 mb-4 leading-relaxed list-decimal list-inside space-y-3 pl-2">
          <li>Deploy Must-b across massive internal hardware fleets (100+ seats).</li>
          <li>Integrate Must-b into their own commercial product offerings (White-labeling).</li>
          <li>Require offline, entirely air-gapped Cloud Brain deployments on custom sovereign hardware.</li>
        </ol>
        <p className="text-gray-300 mb-8 leading-relaxed mt-4">
          Must contact the Founders directly for a tailored <strong className="text-white">Enterprise Commercial License</strong>.
        </p>

        <hr className="border-gray-800 my-8" />

        {/* ── 4. Responsible Disclosure ────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🛡️ 4. Responsible Disclosure (Bug Bounty)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          We treat the security of the Cyber Fortress with absolute seriousness. If you are a security researcher who has discovered a vulnerability in the Hookify Engine, the Local Vault encryption, or our Cloud Telemetry endpoints, do not disclose it publicly.
        </p>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Contact our security team directly. Validated zero-day vulnerabilities or significant isolation bypasses will be rewarded via our private bug bounty program.
        </p>
      </>
    )
  },
});

// ── Sidebar Component ─────────────────────────────────────────────────────

function Sidebar({ activeDoc, setActiveDoc, sidebarData }: { activeDoc: string, setActiveDoc: (doc: string) => void, sidebarData: any[] }) {
  return (
    <aside className="w-72 shrink-0 hidden lg:flex flex-col gap-6 border-r border-[#1f2937] bg-[#050505] px-6 py-8 sticky top-0 h-screen overflow-y-auto">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-3 mb-4 group">
        <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center text-cyan-400 font-black tracking-tighter shadow-[0_0_10px_rgba(6,182,212,0.2)]">
          MB
        </div> 
        <span className="text-sm font-bold text-white/80 group-hover:text-cyan-400 transition-colors uppercase tracking-widest">
          must-b
        </span>
      </Link>

      {/* Nav groups */}
      <nav className="space-y-8 flex-1">
        {sidebarData.map(({ group, items }) => (
          <div key={group}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/50 mb-3 px-2">
              {group}
            </p>
            <ul className="space-y-1">
              {items.map((item: any) => {
                const isActive = activeDoc === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveDoc(item.id)}
                      className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                        isActive
                          ? "bg-[#06b6d4]/10 text-cyan-400 font-semibold border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                          : "text-white/40 hover:text-white/90 hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Origin details */}
      <div className="mt-auto pt-6 border-t border-[#1f2937]">
        <span className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white/30">
          <Shield className="w-3 h-3 text-cyan-400/50" />
          Omni-Context Layer
        </span>
      </div>
    </aside>
  );
}

// ── Document Viewer ───────────────────────────────────────────────────────

function DocumentViewer({ activeDoc, docsData }: { activeDoc: string, docsData: any }) {
  const doc = docsData[activeDoc] || docsData["Introduction"];
  const Icon = doc.icon;

  return (
    <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] px-8 md:px-16 py-16 bg-[#050505]">
      <motion.div
        key={activeDoc} // Re-animate on doc switch
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-3xl w-full mx-auto"
      >
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#1f2937]">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Icon className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            {doc.title}
          </h1>
        </div>

        <div className="prose prose-invert prose-p:leading-relaxed prose-p:text-white/70 prose-strong:text-white max-w-none text-base md:text-lg">
          {doc.content}
        </div>
      </motion.div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const { t } = useTranslation();
  const [activeDoc, setActiveDoc] = useState("Introduction");

  // ── Sidebar menu structure ────────────────────────────────────────────────
  const SIDEBAR_DATA = [
    {
      group: t('docs.sidebar.groups.overview'),
      items: [
        { id: "Introduction", label: t('docs.sidebar.items.introduction') },
        { id: "Core Philosophy", label: t('docs.sidebar.items.philosophy') }
      ],
    },
    {
      group: t('docs.sidebar.groups.gettingStarted'),
      items: [
        { id: "Prerequisites", label: t('docs.sidebar.items.prerequisites') },
        { id: "Installation", label: t('docs.sidebar.items.installation') },
        { id: "First Boot", label: t('docs.sidebar.items.firstBoot') }
      ],
    },
    {
      group: t('docs.sidebar.groups.capabilities'),
      items: [
        { id: "Ghost Mode", label: t('docs.sidebar.items.ghostMode') },
        { id: "API-less Native Browsing", label: t('docs.sidebar.items.browsing') },
        { id: "Terminal Supremacy", label: t('docs.sidebar.items.terminal') }
      ],
    },
    {
      group: t('docs.sidebar.groups.architecture'),
      items: [
        { id: "Cyber Fortress", label: t('docs.sidebar.items.fortress') },
        { id: "Omni-Context Memory", label: t('docs.sidebar.items.memory') },
        { id: "Orchestrator Engine", label: t('docs.sidebar.items.orchestrator') }
      ],
    },
    {
      group: t('docs.sidebar.groups.ecosystem'),
      items: [
        { id: "Cross-Platform Nodes", label: t('docs.sidebar.items.nodes') },
        { id: "Proprietary License", label: t('docs.sidebar.items.license') }
      ],
    },
  ];

  const docsData = getDocsData(t);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeDoc={activeDoc} setActiveDoc={setActiveDoc} sidebarData={SIDEBAR_DATA} />
        <DocumentViewer activeDoc={activeDoc} docsData={docsData} />
      </div>
    </div>
  );
}
