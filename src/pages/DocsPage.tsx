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
        <p>
          Must-b is a proprietary, elite, and autonomous <strong>Cognitive Operating System (Cognitive OS)</strong>, founded by Mustafa Aytaç ÖZTAN (Co-Founder) and Muhammed Burak CANSU (Co-Founder). Unlike conventional LLM wrappers or standard AI assistants that operate within sandboxed browser environments, Must-b acts as an omnipresent layer over your entire local and cloud infrastructure.
        </p>
        <p className="mt-4">
          It bridges the gap between digital intent and physical execution. By integrating a multi-tier neural processing pipeline with raw, system-level execution privileges, Must-b fundamentally redefines human-computer interaction. It does not just suggest code; it commands your terminal. It does not just summarize web pages; it physically drives a native browser instance to extract DOM data. Must-b is the ultimate convergence of advanced machine learning and unconstrained systems engineering.
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
          Built upon the <strong className="text-cyan-400">"Cloud Brain, Local Muscle"</strong> paradigm, the architecture strictly separates cognitive synthesis from physical execution.
        </p>
        <ol className="mt-5 list-decimal list-inside space-y-4 text-white/80 ml-2">
          <li><strong>Cloud Brain:</strong> Complex reasoning, token processing, and Omni-Context memory retrieval are handled via secure, encrypted channels to state-of-the-art LLMs. This ensures zero load on local hardware for cognitive tasks.</li>
          <li><strong>Local Muscle:</strong> Action execution (mouse events, keystrokes, process management, DOM manipulation) occurs strictly locally on the host machine.</li>
        </ol>
        <p className="mt-5">
          This hybrid architecture guarantees Zero-Latency in physical execution while maintaining absolute data sovereignty. The cognitive engine "thinks" globally but "acts" locally, ensuring that sensitive environment variables and root directories never leave your local machine without explicit cryptographic authorization.
        </p>
      </>
    )
  },
  "Prerequisites": {
    title: "Prerequisites",
    icon: Terminal,
    content: (
      <>
        <p>
          Must-b is engineered to be OS-agnostic (Windows, macOS, Linux). The only requirement to tether your machine to the Cognitive OS is Node.js infrastructure.
        </p>
        <ul className="mt-4 list-disc list-inside space-y-2 text-white/70">
          <li>Requirement: <strong>Node.js v20.x or higher.</strong></li>
        </ul>
      </>
    )
  },
  "Installation": {
    title: "Installation",
    icon: Globe,
    content: (
      <>
        <p>
          Deploying the Must-b Cognitive OS daemon to your local environment establishes a secure, bidirectional telemetry link to the Must-b core registry. Ensure Node.js (v20.x+) is installed, then execute the global installation via npm:
        </p>
        <div className="mt-6 p-4 rounded-xl bg-black border border-white/10 font-mono text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] select-all">
          npm install -g @must-b/must-b
        </div>
        <p className="mt-6 text-sm text-white/40 italic">
          *(Note for Unix-based systems: Global execution privileges are mandatory. Prepend 'sudo' to grant the daemon the necessary root access to hook into local OS processes).*
        </p>
      </>
    )
  },
  "First Boot": {
    title: "First Boot",
    icon: Cpu,
    content: (
      <>
        <p>
          Once the local muscle is installed, initialize the Zero-Cold Start sequence by simply typing:
        </p>
        <div className="mt-6 p-4 rounded-xl bg-black border border-white/10 font-mono text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] select-all">
          must-b
        </div>
        <p className="mt-6">
          The Cognitive OS will autonomously provision its environment, bind to your system, and redirect you to the Command Center (Dashboard).
        </p>
      </>
    )
  },
  "Ghost Mode": {
    title: "Ghost Mode",
    icon: Shield,
    content: (
      <>
        <p>
          <strong className="text-cyan-400">Ghost Mode</strong> represents our pinnacle physical intervention layer. When engaged, Must-b transcends digital APIs and interacts with the host OS at the hardware abstraction layer.
        </p>
        <ul className="mt-5 list-none space-y-4 text-white/80">
          <li className="pl-4 border-l border-cyan-500/30"><strong className="text-white">Execution Mechanics:</strong> On Windows, it hooks into the Win32 API; on macOS, the Quartz Event Services; and on Linux, the X11/Wayland protocols.</li>
          <li className="pl-4 border-l border-cyan-500/30"><strong className="text-white">Autonomous Navigation:</strong> It utilizes advanced computer vision and visual DOM rendering to calculate precise X/Y coordinates on your screen. It injects synthetic hardware-level mouse movements, clicks, and keystrokes.</li>
          <li className="pl-4 border-l border-cyan-500/30"><strong className="text-white">Legacy System Mastery:</strong> Ghost Mode allows Must-b to operate outdated, proprietary enterprise software (ERP, SAP) that lacks modern APIs, acting as a digital employee working tirelessly in the background while your primary workspace remains uninterrupted.</li>
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
          Traditional AI models fail when confronted with rate limits, CORS policies, or undocumented APIs. Must-b implements <strong className="text-cyan-400">'API-less Native Browsing'</strong> to bypass these limitations natively.
        </p>
        <ul className="mt-5 list-none space-y-4 text-white/80">
          <li className="pl-4 border-l border-cyan-500/30"><strong className="text-white">Headless Chromium Spawning:</strong> Must-b autonomously spawns an isolated, stealth-patched Chromium instance directly on your machine.</li>
          <li className="pl-4 border-l border-cyan-500/30"><strong className="text-white">DOM & AST Parsing:</strong> It navigates to the target, executes necessary JavaScript, bypasses CAPTCHAs using behavioral humanization algorithms, and constructs a visual layout tree.</li>
          <li className="pl-4 border-l border-cyan-500/30"><strong className="text-white">Extraction & Synthesis:</strong> Instead of parsing raw HTML strings, it reads the rendered DOM, extracts the exact semantic data required, and synthesizes it into structured JSON or Markdown, leaving no server-side footprint.</li>
        </ul>
      </>
    )
  },
  "Terminal Supremacy": {
    title: "Terminal Supremacy",
    icon: Terminal,
    content: (
      <>
        <p>
          Must-b possesses native terminal supremacy. The command line is its primary interface for system-level orchestration.
        </p>
        <ul className="mt-5 list-none space-y-4 text-white/80">
          <li className="pl-4 border-l border-cyan-500/30"><strong className="text-white">Process Management:</strong> It can spawn, kill, and monitor background processes, tail log files in real-time, and dynamically allocate system resources.</li>
          <li className="pl-4 border-l border-cyan-500/30"><strong className="text-white">Auto-Debugging Loop:</strong> When an error is encountered during code compilation, Must-b captures the stderr output, feeds it back into its cognitive loop, synthesizes a patch, and re-executes the command. This asynchronous event loop continues until a zero-exit code is achieved.</li>
          <li className="pl-4 border-l border-cyan-500/30"><strong className="text-white">Sandbox Escape:</strong> Must-b operates with the permissions of the host user, enabling root-level synchronization, file system restructuring, and environment variable manipulation.</li>
        </ul>
      </>
    )
  },
  "Cyber Fortress": {
    title: "Cyber Fortress",
    icon: Shield,
    content: (
      <>
        <p>
          Data sovereignty is the bedrock of the Must-b ecosystem. All telemetry, local cache, and user interactions are encapsulated within our <strong className="text-cyan-400">Cyber Fortress</strong> architecture.
        </p>
        <ul className="mt-5 list-none space-y-4 text-white/80">
          <li className="pl-4 border-l border-cyan-500/30"><strong className="text-white">Supabase RLS:</strong> Cloud-synchronized data (such as Task Delegation logs) is secured via strict Row Level Security (RLS) policies. Authentication tokens are verified at the edge, ensuring <code>auth.uid()</code> compliance for every single database transaction.</li>
          <li className="pl-4 border-l border-cyan-500/30"><strong className="text-white">Zero-Trust Execution:</strong> The Webhook and API endpoints are fortified with token verification, preventing replay attacks and unauthorized payload injections from external nodes.</li>
        </ul>
      </>
    )
  },
  "Omni-Context Memory": {
    title: "Omni-Context Memory",
    icon: Database,
    content: (
      <>
        <p>
          Traditional AIs suffer from context amnesia. Must-b leverages an <strong className="text-cyan-400">Omni-Context Memory</strong> architecture, divided into Short-Term (Session) and Long-Term (Vector) Memory.
        </p>
        <ul className="mt-5 list-none space-y-4 text-white/80">
          <li className="pl-4 border-l border-cyan-500/30"><strong className="text-white">Semantic Chunking:</strong> Documents uploaded to the Vector Vault are not stored as static files. They are semantically chunked, vectorized using advanced embedding models, and indexed locally.</li>
          <li className="pl-4 border-l border-cyan-500/30"><strong className="text-white">Orchestrator Retrieval:</strong> When a complex task is initiated, the Orchestrator Engine queries this vector database with zero latency, retrieving only the exact fragments of knowledge required for the current execution context, allowing Must-b to manage codebases spanning millions of lines without hallucination.</li>
        </ul>
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
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-white/80">
        <p className="font-bold text-white mb-2 tracking-widest uppercase text-sm">Strictly Closed Source</p>
        <p className="mb-4">Copyright (c) 2026 Mustafa Aytaç ÖZTAN & Muhammed Burak CANSU. All rights reserved.</p>
        <p className="text-xs leading-relaxed opacity-60">
          PROPRIETARY AND CLOSED SOURCE. Unauthorized copying, distribution, reverse engineering, or modification of this software is strictly prohibited and subject to legal prosecution.
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
