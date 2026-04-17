import { motion } from "framer-motion";
import { BookOpen, Shield, Cpu, Terminal, Layers, Globe, Scale, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";

// ── Sidebar menu structure ────────────────────────────────────────────────

const SIDEBAR = [
  {
    group: "Overview",
    items: ["Introduction", "Core Philosophy"],
  },
  {
    group: "Getting Started",
    items: ["Prerequisites", "Installation", "First Boot"],
  },
  {
    group: "Cognitive Capabilities",
    items: ["Ghost Mode", "API-less Native Browsing", "Terminal Supremacy"],
  },
  {
    group: "Architecture & Security",
    items: ["Cyber Fortress", "Omni-Context Memory", "Orchestrator Engine"],
  },
  {
    group: "Ecosystem & Legal",
    items: ["Cross-Platform Nodes", "Proprietary License"],
  },
];

// ── Documentation Data ───────────────────────────────────────────────────

const DOCS_DATA: Record<string, { title: string; content: React.ReactNode; icon: any }> = {
  "Introduction": {
    title: "Introduction",
    icon: BookOpen,
    content: (
      <>
        <h1 className="text-4xl font-bold text-white mb-4">Must-b: Autonomous AI Operating System 🚀</h1>
        <p className="text-gray-300 mb-6">
          <strong>Must-b</strong> is a next-generation, locally hosted autonomous AI agent ecosystem. It transitions AI from being a passive chatbot in a browser tab to an active, autonomous digital workforce operating directly on your machine.
        </p>
        <p className="text-gray-300 mb-8">
          🌐 <strong>Official Website:</strong>{" "}
          <a href="https://must-b.com" className="text-cyan-400 hover:underline">must-b.com</a>
          {" "}| 📚 <strong>Documentation:</strong>{" "}
          <a href="https://must-b.com/docs" className="text-cyan-400 hover:underline">must-b.com/docs</a>
        </p>

        <hr className="border-gray-800 my-8" />

        <h2 className="text-2xl font-bold text-white mb-4">🌟 The Paradigm Shift: Why Must-b?</h2>
        <p className="text-gray-300 mb-8">
          Must-b changes the game by acting as the <strong>Orchestrator of your entire workflow</strong>. You provide a high-level goal. Must-b dynamically spawns a swarm of specialized AI agents, maps out a parallel execution graph, controls your terminal, edits your local files, navigates the web via automated browsers, and enforces strict security protocols—all without human intervention.
        </p>

        <h2 className="text-2xl font-bold text-white mb-4">🏗️ Core Architecture &amp; Features</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-300 mb-8">
          <li><strong>Multi-Agent Swarms (SwarmCoordinator):</strong> Spawns isolated PM, Frontend, Backend, and QA agents that work in parallel and communicate natively.</li>
          <li><strong>DAG Workflow Engine:</strong> Executes complex plans with parallel branching, rollback capabilities, and fault tolerance.</li>
          <li><strong>The Shield Protocol (Hookify):</strong> Write natural language rules (e.g., 'never delete databases') that instantly convert to runtime execution blocks.</li>
          <li><strong>200+ Native &amp; Assimilated Skills:</strong> Ships with a massive arsenal of tools for GitHub PR reviews, codebase indexing, web scraping, and terminal execution.</li>
          <li><strong>Memory &amp; Lifecycle:</strong> HNSW-backed vector store (LTM) with semantic search, plus Ghost Guard (RAM/CPU monitoring) and Night Owl (background execution).</li>
          <li><strong>8-Language UI:</strong> Fluent in English, Turkish, German, French, Spanish, Portuguese, Japanese, and Chinese.</li>
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
    title: "Core Philosophy",
    icon: Layers,
    content: (
      <>
        {/* ── Opening premise ──────────────────────────────── */}
        <p className="text-gray-300 mb-4 leading-relaxed">
          Must-b is built on a singular, uncompromising premise: <strong className="text-white">Artificial Intelligence should not be a passive conversational partner trapped in a browser tab; it must be a sovereign digital workforce integrated directly into your operating system.</strong>
        </p>
        <p className="text-gray-300 mb-8 leading-relaxed">
          To achieve zero latency in thought and absolute sovereignty in execution, Must-b employs a strict <strong className="text-cyan-400">"Cloud Brain, Local Muscle"</strong> architectural paradigm.
        </p>

        {/* ── Cloud Brain ──────────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🧠 1. The Cloud Brain (Cognitive Offloading)</h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Complex reasoning, multi-step execution planning, high-dimensional token processing, and Omni-Context memory retrieval are entirely offloaded to decentralized LLM infrastructures.
        </p>
        <ul className="list-disc pl-5 space-y-3 text-gray-300 mb-8">
          <li className="leading-relaxed"><strong className="text-white">Dynamic Neural Routing:</strong> Must-b automatically routes tasks to the most capable model based on the context (e.g., Claude 3.5 Sonnet for deep code synthesis, Groq for rapid, low-latency decision trees).</li>
          <li className="leading-relaxed"><strong className="text-white">DAG Generation:</strong> A high-level human intent is mathematically broken down into a <strong className="text-white">Directed Acyclic Graph (DAG)</strong> of parallel sub-tasks, ensuring fault-tolerant, concurrent execution.</li>
        </ul>

        {/* ── Local Muscle ─────────────────────────────────── */}
        <h2 className="text-xl font-semibold text-white mt-8 mb-4">🦾 2. The Local Muscle (Bare-Metal Execution)</h2>
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
        <p>
          Traditional AI models and scraping scripts inevitably fail when confronted with aggressive rate limits, strict CORS policies, and dynamically rendered Single-Page Applications (SPAs). Must-b implements an aggressive <strong className="text-cyan-400">'API-less Native Browsing'</strong> protocol to natively circumvent these artificial limitations.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">The Stealth Extraction Pipeline</h3>
        <div className="space-y-6 mt-4">
          <div className="border-l-2 border-cyan-500/30 pl-4">
            <h4 className="text-lg font-semibold text-white">Headless Chromium Spawning</h4>
            <p className="mt-2 text-white/80">Rather than executing HTTP GET requests, Must-b autonomously spawns an isolated, stealth-patched Chromium instance directly on your local machine via the Chrome DevTools Protocol (CDP).</p>
          </div>
          <div className="border-l-2 border-cyan-500/30 pl-4">
            <h4 className="text-lg font-semibold text-white">Deterministic Fingerprint Masking</h4>
            <p className="mt-2 text-white/80">The engine dynamically strips out predictable browser fingerprints, randomizes User-Agent strings, and masks <code>navigator.webdriver</code> flags to appear entirely as legitimate, organic human traffic.</p>
          </div>
          <div className="border-l-2 border-cyan-500/30 pl-4">
            <h4 className="text-lg font-semibold text-white">Deep DOM & AST Parsing</h4>
            <p className="mt-2 text-white/80">Must-b navigates to the target, executes necessary client-side JavaScript, patiently waits for asynchronous network requests (XHR/Fetch) to resolve, and constructs a complete visual layout tree.</p>
          </div>
          <div className="border-l-2 border-cyan-500/30 pl-4">
            <h4 className="text-lg font-semibold text-white">Contextual Synthesis</h4>
            <p className="mt-2 text-white/80">Instead of blindly parsing raw HTML strings via regex, the system traverses the rendered DOM (piercing through Shadow DOM boundaries), extracts the exact semantic data required based on cognitive intent, and synthesizes it into perfectly structured JSON arrays. Zero server-side footprint is left behind.</p>
          </div>
        </div>
      </>
    )
  },
  "Terminal Supremacy": {
    title: "Terminal Supremacy",
    icon: Terminal,
    content: (
      <>
        <p>
          Must-b possesses absolute, <strong className="text-cyan-400">native terminal supremacy</strong>. The command-line interface is not merely a tool; it is the Cognitive OS's primary domain for system-level orchestration.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Advanced Process Management</h3>
        <p>
          The local daemon retains the capability to spawn detached background processes, aggressively terminate zombie tasks via PID isolation, monitor system resource allocation (CPU/RAM heap telemetry) in real-time, and dynamically pipe standard input/output streams (stdin/stdout) between disparate system applications.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">The Auto-Debugging Healing Loop</h3>
        <p>
          When a fatal error is encountered during complex operations (e.g., compiling a Next.js application or building a Docker container image), Must-b traps the standard error output (stderr) and non-zero exit codes. Instead of halting execution, it feeds this error stack trace back into its cognitive reasoning loop. 
        </p>
        <p className="mt-3">
          The Cloud Brain synthesizes an Abstract Syntax Tree (AST) structural patch, modifies the relevant source files via local File System APIs, and recursively re-executes the command. This deeply integrated, asynchronous auto-healing event loop continues until a zero-exit code is definitively achieved.
        </p>
      </>
    )
  },
  "Cyber Fortress": {
    title: "Cyber Fortress",
    icon: Shield,
    content: (
      <>
        <p>
          Data sovereignty and cryptographic isolation form the uncompromising bedrock of the <strong className="text-cyan-400">Must-b ecosystem</strong>.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Supabase Row Level Security (RLS) Implementation</h3>
        <p className="mb-4">
          Cloud-synchronized operational data, such as Live Task Delegation logs, Agent state management, and Vector Vault payloads, is secured via draconian Row Level Security (RLS) policies within our PostgreSQL infrastructure.
        </p>
        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1f2937] overflow-x-auto mb-4">
          <pre><code className="text-sm font-mono text-blue-400">{`-- Core Security Policy for Sovereign Agent Execution
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Strict Isolation: Users can only mutate their own nodes" 
ON agents FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);`}</code></pre>
        </div>
        <p>
          Authentication JWT tokens are cryptographically verified at the edge. A user can mathematically only access, read, or modify data that is cryptographically bound to their specific session identifier.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Zero-Trust Webhook Execution</h3>
        <p>
          The Bridge endpoints connecting the Local Muscle to external channels (WhatsApp/Discord) are fortified with stringent token verification mechanisms (e.g., Meta's verify_token challenge). We utilize HMAC signatures and payload validation to prevent replay attacks, man-in-the-middle (MITM) interception, and unauthorized arbitrary code execution from malicious external nodes.
        </p>
      </>
    )
  },
  "Omni-Context Memory": {
    title: "Omni-Context Memory",
    icon: Database,
    content: (
      <>
        <p>
          Traditional AI instances suffer from severe context amnesia, "forgetting" instructions as the conversation token window expands. Must-b circumvents this by leveraging a state-of-the-art <strong className="text-cyan-400">Omni-Context Memory</strong> architecture.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Hierarchical Semantic Chunking & Vectorization</h3>
        <p>
          Proprietary documents, PDFs, and raw codebases uploaded to the Vector Vault are systematically ingested and subjected to Recursive Character Text Splitting. These semantic chunks are vectorized into high-dimensional space (1536 dimensions) using advanced embedding models.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">HNSW Local Indexing & Zero-Latency Retrieval</h3>
        <p>
          These vectors are indexed locally using HNSW (Hierarchical Navigable Small World) algorithms for hyper-fast nearest-neighbor search. When a complex autonomous task is initiated by the Orchestrator Engine, it queries this vector database with near-zero latency, calculating cosine similarity thresholds. It retrieves only the exact, semantically relevant fragments of knowledge required for the current execution context, allowing Must-b to seamlessly modify enterprise codebases spanning millions of lines without hallucination.
        </p>
      </>
    )
  },
  "Orchestrator Engine": {
    title: "Orchestrator Engine",
    icon: Cpu,
    content: (
      <>
        <p>
          The core logic loop of Must-b operates on a definitive <strong className="text-cyan-400">"Plan, Execute, Synthesize"</strong> cycle.
        </p>
        <p className="mt-4">
          It evaluates external stimuli, breaks them into actionable sub-tasks, delegates them to specific native capabilities, and synthesizes the outcome into a final, flawless result.
        </p>
      </>
    )
  },
  "Cross-Platform Nodes": {
    title: "Cross-Platform Nodes",
    icon: Layers,
    content: (
      <>
        <p>
          The Cognitive OS dynamically adapts to its host environment. It speaks CMD/PowerShell on Windows, and Bash/Zsh on Unix-based systems seamlessly.
        </p>
        <p className="mt-4">
          Mobile Nodes (iOS/Android) remain in active R&D within our Cyber Fortress labs.
        </p>
      </>
    )
  },
  "Proprietary License": {
    title: "Proprietary License",
    icon: Scale,
    content: (
      <div className="p-8 rounded-2xl bg-white/5 border border-red-500/20 text-white/80 shadow-[0_0_30px_rgba(239,68,68,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[50px] pointer-events-none"></div>
        <p className="font-black text-red-500 mb-4 tracking-widest uppercase text-lg border-b border-red-500/20 pb-4">
          Strictly Closed Source And Proprietary
        </p>
        <p className="mb-6 font-semibold text-white">
          Copyright (c) 2026 Mustafa Aytaç ÖZTAN (Co-Founder) & Muhammed Burak CANSU (Co-Founder). All rights reserved worldwide.
        </p>
        <p className="text-sm leading-relaxed opacity-80 mb-4">
          Must-b Cognitive OS is classified as PROPRIETARY AND CLOSED SOURCE software. The intellectual property, bridging algorithms, neuromotor simulation logic, and cloud-to-local telemetry infrastructure contained within this architecture represent significant proprietary engineering.
        </p>
        <p className="text-sm leading-relaxed opacity-80">
          Unauthorized copying, distribution, decompilation, reverse engineering, unauthorized API bridging, or modification of any part of this software—whether in source or compiled binary form—is strictly prohibited. Violations of this proprietary license will be met with immediate and decisive legal prosecution under international intellectual property law.
        </p>
      </div>
    )
  },
};

// ── Sidebar Component ─────────────────────────────────────────────────────

function Sidebar({ activeDoc, setActiveDoc }: { activeDoc: string, setActiveDoc: (doc: string) => void }) {
  return (
    <aside className="w-72 shrink-0 hidden lg:flex flex-col gap-6 border-r border-[#1f2937] bg-[#050505] px-6 py-8 sticky top-0 h-screen overflow-y-auto">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-3 mb-4 group">
        <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center justify-center text-cyan-400 font-black tracking-tighter shadow-[0_0_10px_rgba(6,182,212,0.2)]">
          MB
        </div> 
        <span className="text-sm font-bold text-white/80 group-hover:text-cyan-400 transition-colors uppercase tracking-widest">
          Manifesto
        </span>
      </Link>

      {/* Nav groups */}
      <nav className="space-y-8 flex-1">
        {SIDEBAR.map(({ group, items }) => (
          <div key={group}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/50 mb-3 px-2">
              {group}
            </p>
            <ul className="space-y-1">
              {items.map((item) => {
                const isActive = activeDoc === item;
                return (
                  <li key={item}>
                    <button
                      onClick={() => setActiveDoc(item)}
                      className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                        isActive
                          ? "bg-[#06b6d4]/10 text-cyan-400 font-semibold border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                          : "text-white/40 hover:text-white/90 hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      {item}
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

function DocumentViewer({ activeDoc }: { activeDoc: string }) {
  const doc = DOCS_DATA[activeDoc] || DOCS_DATA["Introduction"];
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
  const [activeDoc, setActiveDoc] = useState("Introduction");

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeDoc={activeDoc} setActiveDoc={setActiveDoc} />
        <DocumentViewer activeDoc={activeDoc} />
      </div>
    </div>
  );
}
