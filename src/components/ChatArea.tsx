// src/components/ChatArea.tsx
// Chat bubble area for the must-b agent turn output.
// Integrates ThoughtPanel (live thought streaming) and TerminalPanel (bash output).

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSocket } from "@/lib/socket";
import { ThoughtPanel } from "@/components/ThoughtPanel";
import { TerminalPanel } from "@/components/TerminalPanel";
import { Send } from "lucide-react";

interface Message {
  id:      string;
  role:    "user" | "assistant";
  content: string;
  ts:      number;
}

interface AssistantTurn {
  id:       string;
  status:   "pending" | "done";
  content:  string;
  hasTerminal: boolean;
}

export function ChatArea() {
  const [messages,       setMessages]       = useState<Message[]>([]);
  const [activeTurn,     setActiveTurn]     = useState<AssistantTurn | null>(null);
  const [input,          setInput]          = useState("");
  const bottomRef                           = useRef<HTMLDivElement>(null);

  // Listen to socket events
  useEffect(() => {
    const socket = getSocket();

    // New assistant turn begins
    const onTurnStart = (data: { id: string }) => {
      setActiveTurn({ id: data.id, status: "pending", content: "", hasTerminal: false });
    };

    // Streaming assistant text
    const onAssistantChunk = (data: { id: string; chunk: string }) => {
      setActiveTurn(prev =>
        prev?.id === data.id ? { ...prev, content: prev.content + data.chunk } : prev
      );
    };

    // Turn complete — move to messages list
    const onTurnDone = (data: { id: string; content: string }) => {
      setActiveTurn(prev => {
        if (prev?.id === data.id) {
          const finalContent = data.content || prev.content;
          setMessages(m => [...m, { id: data.id, role: "assistant", content: finalContent, ts: Date.now() }]);
          return null;
        }
        return prev;
      });
    };

    // Flag that terminal output has arrived for the active turn
    const onTerminalStream = () => {
      setActiveTurn(prev => prev ? { ...prev, hasTerminal: true } : prev);
    };

    socket.on("turn_start",       onTurnStart);
    socket.on("assistant_chunk",  onAssistantChunk);
    socket.on("turn_done",        onTurnDone);
    socket.on("terminal_stream",  onTerminalStream);

    return () => {
      socket.off("turn_start",       onTurnStart);
      socket.off("assistant_chunk",  onAssistantChunk);
      socket.off("turn_done",        onTurnDone);
      socket.off("terminal_stream",  onTerminalStream);
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTurn]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const socket = getSocket();
    const id = `user-${Date.now()}`;
    setMessages(prev => [...prev, { id, role: "user", content: text, ts: Date.now() }]);
    socket.emit("user_message", { content: text });
    setInput("");
  };

  const isPending = activeTurn?.status === "pending";

  return (
    <div className="flex flex-col h-full bg-[#050505]">
      {/* ── Message list ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#06b6d4]/15 border border-[#06b6d4]/25 text-white rounded-br-sm"
                    : "bg-[#111] border border-white/6 text-gray-200 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* ── Active assistant turn (pending) ── */}
          {activeTurn && (
            <motion.div
              key="active-turn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] w-full space-y-2">
                {/* Partial streamed text (if any) */}
                {activeTurn.content && (
                  <div className="bg-[#111] border border-white/6 text-gray-200 rounded-2xl rounded-bl-sm px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap">
                    {activeTurn.content}
                  </div>
                )}

                {/* "Working…" dots + live thought panel */}
                {isPending && (
                  <>
                    <div className="flex items-center gap-2 py-2 px-1">
                      {[0, 120, 240].map(delay => (
                        <div
                          key={delay}
                          className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{ background: "rgba(251,146,60,0.7)", animationDelay: `${delay}ms` }}
                        />
                      ))}
                      <span className="text-[11px] text-white/25 ml-1">Working…</span>
                    </div>
                    <ThoughtPanel active={isPending} />
                  </>
                )}

                {/* Terminal output panel — shown when at least one terminal_stream arrived */}
                {activeTurn.hasTerminal && (
                  <div className="mt-3">
                    <TerminalPanel />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="border-t border-white/6 px-4 py-4">
        <div className="flex items-center gap-3 bg-[#0f0f0f] border border-white/8 rounded-2xl px-4 py-3 focus-within:border-[#06b6d4]/40 transition-colors">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Send a message…"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isPending}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#06b6d4] hover:bg-[#0891b2] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 text-black"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
