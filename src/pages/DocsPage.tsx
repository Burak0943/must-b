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
          Must-b is NOT a standard artificial intelligence assistant. Founded by Mustafa Aytaç ÖZTAN (Co-Founder) and Muhammed Burak CANSU (Co-Founder), Must-b is a proprietary, elite, and autonomous <strong>Cognitive Operating System (Cognitive OS)</strong>.
        </p>
        <p className="mt-4">
          It bridges the gap between digital intent and physical execution, acting as an omnipresent layer over your existing infrastructure.
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
          Built upon the <strong className="text-cyan-400">"Cloud Brain, Local Muscle"</strong> paradigm.
        </p>
        <p className="mt-4">
          Must-b performs heavy cognitive processing via secure cloud synchronization, while executing physical and system-level operations strictly locally on your machine. Zero latency in thought, absolute sovereignty in execution.
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
          Deploying the Cognitive OS to your local environment requires establishing a secure link to the Must-b registry. Execute the following command in your terminal (PowerShell/Bash/Zsh):
        </p>
        <div className="mt-6 p-4 rounded-xl bg-black border border-white/10 font-mono text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] select-all">
          npm install -g @must-b/must-b
        </div>
        <p className="mt-6 text-sm text-white/40 italic">
          *(For macOS/Linux, prepend 'sudo' if root access is required for global deployment).*
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
          Must-b transcends code generation. <strong className="text-cyan-400">Ghost Mode</strong> represents our physical intervention layer.
        </p>
        <p className="mt-4">
          When engaged, the Cognitive OS can directly control your mouse and keyboard coordinates, operating legacy software or GUIs autonomously in the background while you continue your primary tasks undisturbed.
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
          The Cognitive OS does not rely on fragile external APIs to perceive the web.
        </p>
        <p className="mt-4">
          It initiates its own native browser sessions, reads the DOM, bypasses captchas, and extracts data with human-like precision before closing without a trace.
        </p>
      </>
    )
  },
  "Terminal Supremacy": {
    title: "Terminal Supremacy",
    icon: Terminal,
    content: (
      <>
        <p>
          The command line is Must-b's native tongue.
        </p>
        <p className="mt-4">
          It possesses the capability to read/write file systems, manage processes, compile projects, and analyze system logs with root-level synchronization. It operates with the precision of a senior DevOps engineer.
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
          Data sovereignty is absolute. All user telemetry, Bridge communications, and Vector Vault payloads are encrypted and protected by Supabase Row Level Security (RLS).
        </p>
        <p className="mt-4">
          Not even an elevated agent can bypass the <code>user_id</code> isolation protocols. Must-b is an impenetrable Cyber Fortress.
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
          Memory is not stored as raw cloud text. Files and directives are semantically chunked, locally indexed, and vectorized into Long-Term Memory (LTM).
        </p>
        <p className="mt-4">
          This ensures Zero-Latency retrieval for the Orchestrator Engine during complex task execution.
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
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-white/80">
        <p className="font-bold text-white mb-2 tracking-widest uppercase text-sm">Strictly Closed Source</p>
        <p className="mb-4">Copyright (c) 2026 Mustafa Aytaç ÖZTAN & Burak. All rights reserved.</p>
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
