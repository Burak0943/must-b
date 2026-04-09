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
        <blockquote className="text-xl italic text-white/50 border-l-2 border-cyan-500/50 pl-4 py-2 mb-8">
          "Zero latency in thought, absolute sovereignty in execution."
        </blockquote>
        <p>
          Must-b is a proprietary, elite, and self-hosted <strong>Cognitive Operating System (Cognitive OS)</strong>, architected and founded by Mustafa Aytaç ÖZTAN (Co-Founder) and Muhammed Burak CANSU (Co-Founder). The current landscape of Artificial Intelligence is plagued by fragmented "assistants" trapped within browser tabs, entirely dependent on sandboxed environments and rigid, rate-limited API endpoints. Must-b shatters this paradigm by acting as an omnipresent, bidirectional orchestration layer that directly bridges cloud-based neural synthesis with bare-metal local hardware execution.
        </p>
        <h3 className="text-xl font-semibold text-white mt-8 mb-4">What is Must-b?</h3>
        <p>
          Must-b is not a chatbot; it is a decentralized orchestration gateway. It runs a highly privileged local daemon on your operating system that listens to secure, cryptographically signed Webhooks (The Bridge) from external channels such as WhatsApp, Discord, or our encrypted Web Control UI. When a natural language command is received, the <strong>Cloud Brain</strong> (powered by state-of-the-art LLMs) synthesizes the intent into deterministic sub-tasks. The <strong>Local Muscle</strong> (via Ghost Mode or Terminal Supremacy) then executes these tasks directly on your machine—compiling source code, manipulating legacy GUI software, managing file systems, or spawning browser instances.
        </p>
        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Who is it for?</h3>
        <p>
          This architecture is engineered exclusively for elite developers, enterprise systems architects, and power users who demand a sovereign AI entity capable of autonomous system administration, devoid of third-party API dependencies or data scraping vulnerabilities.
        </p>
        <h3 className="text-xl font-semibold text-white mt-8 mb-4">The Architectural Blueprint</h3>
        <p className="mb-4">The system operates on an Asynchronous Event Loop designed for zero-cold start deployments.</p>
        <div className="p-6 bg-[#0a0a0a] rounded-xl border border-[#1f2937] font-mono text-sm text-cyan-400 overflow-x-auto shadow-[0_0_15px_rgba(6,182,212,0.1)] mb-6 whitespace-pre">
{`[ External Node: WhatsApp / Discord ] -> (Encrypted E2E Payload)
                     ⬇
[ Vercel Edge Webhook ] -> [ Supabase RLS / PostgreSQL Task Queue ]
                     ⬇
[ Must-b Cloud Brain (LLM Orchestrator + Vector Vault HNSW Index) ]
                     ⬇
[ Local Must-b Daemon (Zero-Latency WebSocket Polling) ]
                     ⬇
[ Ghost Mode (Mouse/Key) | Terminal Supremacy (Bash) | API-less Browser (DOM) ]`}
        </div>
        <p>
          The Cloud Brain serves as the immutable single source of truth for global sessions, memory state, and semantic context, while the Local Daemon serves as the physical actuator, bringing thought into reality on your host machine.
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
