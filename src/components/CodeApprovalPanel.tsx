// src/components/CodeApprovalPanel.tsx
// Diff viewer — blocks file writes until the user approves or rejects.
// Mount once at the root level (App.tsx) so it floats over all content.

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { Check, X, FileText, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ApprovalRequest {
  id:        string;
  action:    string;
  file:      string;
  additions: number;
  deletions: number;
  before:    string;
  after:     string;
}

export function CodeApprovalPanel() {
  const [queue, setQueue] = useState<ApprovalRequest[]>([]);
  const current           = queue[0] ?? null;

  useEffect(() => {
    const socket = getSocket();
    const onApproval = (req: ApprovalRequest) => {
      setQueue(prev => [...prev, req]);
    };
    socket.on("require_approval", onApproval);
    return () => { socket.off("require_approval", onApproval); };
  }, []);

  const respond = (granted: boolean) => {
    if (!current) return;
    getSocket().emit("approval_response", { id: current.id, granted });
    setQueue(prev => prev.slice(1));
  };

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-4 bottom-24 z-[9000] max-w-2xl mx-auto"
        >
          <div
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background:    "rgba(10,5,2,0.97)",
              border:        "1px solid rgba(249,115,22,0.35)",
              backdropFilter:"blur(24px)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/6">
              <div className="flex items-center gap-2.5">
                <FileText size={14} className="text-orange-400" />
                <span className="text-[12px] font-bold text-orange-300 uppercase tracking-wide">
                  File Edit Approval
                </span>
                {queue.length > 1 && (
                  <span className="text-[10px] text-white/30 ml-1">+{queue.length - 1} more</span>
                )}
              </div>
              <p className="text-[11px] text-white/30 font-mono truncate max-w-[220px]">{current.file}</p>
            </div>

            {/* Diff stats */}
            <div className="flex items-center gap-4 px-5 py-2.5 bg-white/[0.02]">
              <div className="flex items-center gap-1.5 text-green-400">
                <Plus size={12} />
                <span className="text-[13px] font-bold">{current.additions}</span>
                <span className="text-[11px] text-green-400/60">additions</span>
              </div>
              <div className="flex items-center gap-1.5 text-red-400">
                <Minus size={12} />
                <span className="text-[13px] font-bold">{current.deletions}</span>
                <span className="text-[11px] text-red-400/60">deletions</span>
              </div>
            </div>

            {/* Diff preview — side by side on md+, stacked on mobile */}
            <div className="grid grid-cols-2 gap-px bg-white/[0.04] max-h-48 overflow-hidden">
              {/* Before */}
              <div className="bg-[#0a0a0a] overflow-y-auto px-4 py-3 max-h-48 scrollbar-hide">
                <p className="text-[9px] font-bold uppercase text-red-400/50 mb-1.5 tracking-widest">Before</p>
                <pre className="text-[11px] text-red-300/60 font-mono whitespace-pre-wrap break-all leading-relaxed">
                  {current.before || "(new file)"}
                </pre>
              </div>
              {/* After */}
              <div className="bg-[#0a0a0a] overflow-y-auto px-4 py-3 max-h-48 scrollbar-hide">
                <p className="text-[9px] font-bold uppercase text-green-400/50 mb-1.5 tracking-widest">After</p>
                <pre className="text-[11px] text-green-300/70 font-mono whitespace-pre-wrap break-all leading-relaxed">
                  {current.after}
                </pre>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-white/6">
              <button
                onClick={() => respond(false)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-900/20 hover:bg-red-900/40 border border-red-800/40 text-red-300 text-[13px] font-bold transition-all active:scale-95"
              >
                <X size={14} />
                Reject
              </button>
              <button
                onClick={() => respond(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-[13px] font-bold shadow-[0_0_18px_rgba(249,115,22,0.5)] transition-all active:scale-95"
              >
                <Check size={14} />
                Approve
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
