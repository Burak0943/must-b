// src/components/ThoughtPanel.tsx
// Live agent thought process — replaces the static "Thinking…" dots.
// Listens to `thought_stream` Socket.io events.

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import { AnimatePresence, motion } from "framer-motion";

interface Thought {
  id:      number;
  type:    "action" | "result" | "warn" | "plan";
  message: string;
  ts:      number;
}

interface Props {
  /** When false the panel collapses to a single pulsing dot (idle state). */
  active: boolean;
  maxLines?: number;
}

const TYPE_STYLES: Record<Thought["type"], { color: string; dot: string }> = {
  plan:   { color: "text-orange-300/80",  dot: "bg-orange-400"  },
  action: { color: "text-cyan-300/90",    dot: "bg-cyan-400"    },
  result: { color: "text-green-400/90",   dot: "bg-green-400"   },
  warn:   { color: "text-yellow-400/90",  dot: "bg-yellow-400"  },
};

export function ThoughtPanel({ active, maxLines = 120 }: Props) {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [lastMsg,  setLastMsg]  = useState("");
  const bottomRef               = useRef<HTMLDivElement>(null);
  const counterRef              = useRef(0);

  useEffect(() => {
    if (!active) return;
    const socket = getSocket();

    const onThought = (data: { type: Thought["type"]; message: string; ts: number }) => {
      const id = ++counterRef.current;
      setLastMsg(data.message);
      setThoughts(prev => {
        const next = [...prev, { id, ...data }];
        return next.length > maxLines ? next.slice(-maxLines) : next;
      });
    };

    socket.on("thought_stream", onThought);
    return () => { socket.off("thought_stream", onThought); };
  }, [active, maxLines]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thoughts]);

  if (!active && thoughts.length === 0) return null;

  return (
    <div className="w-full mt-2 rounded-xl overflow-hidden border border-white/6 bg-[#080808]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400/60">
            Agent Actions
          </span>
        </div>
        {active && (
          <span className="ml-auto text-[10px] text-white/20 font-mono truncate max-w-[220px]">
            {lastMsg}
          </span>
        )}
      </div>

      {/* Thought log */}
      <div className="max-h-52 overflow-y-auto px-4 py-3 space-y-0.5 scrollbar-hide font-mono text-[12px] leading-relaxed">
        <AnimatePresence initial={false}>
          {thoughts.map((t) => {
            const { color, dot } = TYPE_STYLES[t.type] ?? TYPE_STYLES.action;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.12 }}
                className={`flex items-start gap-2 ${color}`}
              >
                <span className={`mt-[6px] w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                <span className="break-all">{t.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
