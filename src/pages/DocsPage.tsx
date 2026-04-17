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
        <p>
          The fundamental architecture of Must-b is strictly governed by the <strong className="text-cyan-400">"Cloud Brain, Local Muscle"</strong> paradigm. This design philosophy isolates heavy cognitive synthesis from raw physical execution, optimizing for both computational efficiency and absolute data sovereignty.
        </p>
        
        <h3 className="text-xl font-semibold text-white mt-8 mb-4">1. The Cloud Brain (Cognitive Offloading)</h3>
        <p>
          Complex reasoning, multi-step execution planning, high-dimensional token processing, and Omni-Context memory retrieval are entirely offloaded to our secure cloud infrastructure. By leveraging advanced LLM orchestration via Vercel Edge functions, we ensure zero computational drag (CPU/GPU monopolization) on your local hardware. The cognitive engine "thinks" globally, evaluating millions of parameters in milliseconds.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">2. The Local Muscle (Sovereign Execution)</h3>
        <p>
          The actual physical manifestation of tasks—hardware-level mouse event simulation via Win32/Quartz APIs, keystroke injection, binary execution, background process management, and local file system mutations—occurs strictly on the host machine via the Must-b Daemon.
        </p>

        <div className="mt-6 p-4 rounded-xl bg-cyan-950/20 border-l-4 border-cyan-500">
          <p>
            <strong className="text-white">The Security Air-Gap:</strong> Most critically, this hybrid architecture guarantees that sensitive local environment variables (<code>.env</code> files), proprietary source code directories, and system-level authentication tokens never leave the physical boundaries of your machine without explicit cryptographic authorization. Must-b acts as an impenetrable air-gap, translating high-level cloud directives into secure, low-level OS API calls locally.
          </p>
        </div>
      </>
    )
  },
  "Prerequisites": {
    title: "Prerequisites",
    icon: Terminal,
    content: (
      <>
        <p>
          Deploying the Must-b Cognitive OS daemon to your local environment requires establishing a secure, authenticated telemetry link to the Must-b core registry.
        </p>
        <p className="mt-4">
          Ensure <strong>Node.js (v20.x LTS or higher)</strong> is installed to provide the necessary V8 JavaScript engine runtime. This is the only rigid environmental requirement to bridge your local system with the Orchestrator Engine.
        </p>
      </>
    )
  },
  "Installation": {
    title: "Installation",
    icon: Globe,
    content: (
      <>
        <h3 className="text-xl font-semibold text-white mb-4">1. Provisioning the Local Muscle</h3>
        <p>
          Execute the global installation via your native package manager:
        </p>
        <div className="mt-4 p-4 rounded-xl bg-black border border-white/10 font-mono text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] select-all mb-4">
          npm install -g @must-b/must-b@latest
        </div>
        <p className="text-sm text-white/40 italic">
          *(Note for Unix-based architectures: Global execution privileges are mandatory for terminal supremacy. Prepend <code>sudo</code> to grant the daemon the necessary root-level access required to hook into local OS processes).*
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">2. Core Configuration (must-b.json)</h3>
        <p>
          Granular control over the Cognitive OS is managed locally via <code>~/.must-b/must-b.json</code>. This JSON schema defines the physical boundaries of your local agent.
        </p>
        <div className="mt-4 p-4 rounded-xl bg-[#0a0a0a] border border-[#1f2937] overflow-x-auto">
          <pre><code className="text-sm text-[#ce9178]">{`{
  "system": {
    "orchestrator_model": "gpt-4o",
    "memory_indexing": "hnsw-local-1536d",
    "cloud_sync_telemetry": true
  },
  "capabilities": {
    "ghostMode": {
      "enabled": true,
      "maxMouseSpeedMultipler": 1.4,
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
        </div>
      </>
    )
  },
  "First Boot": {
    title: "First Boot",
    icon: Cpu,
    content: (
      <>
        <h3 className="text-xl font-semibold text-white mb-4">Initialization and Cyber Fortress Pairing</h3>
        <p>
          Once installed, initialize the Zero-Cold Start sequence. This protocol generates cryptographic session keys, binds to your hardware abstraction layer, and pairs with your Supabase database.
        </p>
        <div className="mt-4 p-4 rounded-xl bg-black border border-white/10 font-mono text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] select-all mb-4">
          must-b onboard --install-daemon --enable-ghost-mode
        </div>
        <p className="mt-6 mb-2 font-semibold">Expected Terminal Output:</p>
        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1f2937] font-mono text-xs text-white/70 overflow-x-auto whitespace-pre">
{`[SUCCESS] Daemon installed to system registry.
[SUCCESS] Ghost Mode enabled (Win32/Quartz bindings active).
[SUCCESS] Handshake with Supabase RLS verified. Waiting for payload...`}
        </div>
      </>
    )
  },
  "Ghost Mode": {
    title: "Ghost Mode",
    icon: Shield,
    content: (
      <>
        <p>
          <strong className="text-cyan-400">Ghost Mode</strong> represents the absolute pinnacle of our physical intervention layer, distinguishing Must-b from any existing software automation tool on the market. When engaged, Must-b transcends digital REST API limitations and interacts directly with the host operating system at the Hardware Abstraction Layer (HAL).
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Deep Execution Mechanics & OS Hooking</h3>
        <ul className="list-disc pl-5 space-y-3 mt-4 text-white/80">
          <li><strong>Windows (NT Kernel):</strong> Must-b interfaces directly with the raw Win32 API (User32.dll and GDI32.dll) to dispatch synthetic input events directly into the message queue of target windows, bypassing higher-level application sandboxes.</li>
          <li><strong>macOS (Darwin):</strong> Hooks into low-level Quartz Event Services and CoreGraphics frameworks, allowing the daemon to inject HID (Human Interface Device) payloads seamlessly.</li>
          <li><strong>Linux (Unix-like):</strong> Manipulates X11 display server protocols or Wayland compositors via direct socket communication.</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Neuromotor Trajectory Simulation</h3>
        <p>
          To bypass advanced heuristic anti-bot detection systems (like Cloudflare Turnstile or Akamai Bot Manager), mouse trajectories are not calculated as linear A-to-B jumps. Must-b dynamically generates complex Bezier curves, perfectly mimicking human neuromotor delays, acceleration/deceleration physics, and micro-jitter during click-hold durations.
        </p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Legacy GUI Manipulation</h3>
        <p>
          Ghost Mode empowers Must-b to autonomously operate outdated, proprietary enterprise software (e.g., legacy ERPs, customized SAP modules) that lack modern APIs. It utilizes real-time visual DOM rendering and OCR to calculate precise X/Y pixel coordinates on your physical display, acting as a tireless digital operator working in the background.
        </p>
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
