// public/must-b-ui/src/components/TerminalPanel.tsx
// Real-time bash terminal — listens to `terminal_stream` Socket.io events.

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";
import { Terminal, X } from "lucide-react";

interface TerminalLine {
  text:   string;
  stream: "stdout" | "stderr";
  ts:     number;
}

interface Props {
  /** Filter lines to a specific command (optional). Shows all if omitted. */
  command?: string;
  maxLines?: number;
  onClose?: () => void;
}

export function TerminalPanel({ command, maxLines = 500, onClose }: Props) {
  const [lines, setLines]     = useState<TerminalLine[]>([]);
  const [running, setRunning] = useState(false);
  const bottomRef             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();

    const onStream = (data: { text: string; stream: "stdout" | "stderr"; command: string }) => {
      if (command && data.command !== command) return; // optional filter
      setRunning(true);
      setLines(prev => {
        const next = [...prev, { text: data.text, stream: data.stream, ts: Date.now() }];
        return next.length > maxLines ? next.slice(-maxLines) : next;
      });
    };

    socket.on("terminal_stream", onStream);
    return () => { socket.off("terminal_stream", onStream); };
  }, [command, maxLines]);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/8 bg-[#0a0a0a] shadow-2xl font-mono text-[13px]">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/6 bg-[#111]">
        <div className="flex items-center gap-2 text-orange-400/70">
          <Terminal size={13} />
          <span className="text-[11px] font-semibold tracking-wide uppercase">
            {command ?? "Terminal"} {running && <span className="text-green-400/70 ml-1">● live</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* macOS-style traffic lights */}
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          {onClose && (
            <button onClick={onClose} className="ml-2 text-white/30 hover:text-white/70 transition-colors">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Output area */}
      <div className="h-64 overflow-y-auto px-4 py-3 space-y-px scrollbar-hide">
        {lines.length === 0 ? (
          <p className="text-white/20 text-[11px] select-none">Waiting for output…</p>
        ) : (
          lines.map((ln, i) => (
            <div key={i} className="flex gap-2 leading-relaxed">
              <span className="text-white/15 text-[10px] w-4 shrink-0 select-none">{/* gutter */}</span>
              <span className={ln.stream === "stderr" ? "text-red-400/80" : "text-green-300/90"}>
                {ln.text}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
