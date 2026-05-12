import { useState } from "react";
import { motion } from "framer-motion";
import { Twitter, Youtube, Linkedin, Instagram } from "lucide-react";
import { IndustrialSwitch } from "@/components/ui/toggle-switch";

// Discord SVG icon
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const handleToggle = (dark: boolean) => {
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  const socials = [
    { href: "https://x.com/mustb_ai",             Icon: Twitter,     label: "X / Twitter" },
    { href: "https://discord.gg/mustb",            Icon: DiscordIcon, label: "Discord"     },
    { href: "https://instagram.com/mustb_ai",      Icon: Instagram,   label: "Instagram"   },
    { href: "https://youtube.com/@mustb_ai",       Icon: Youtube,     label: "YouTube"     },
    { href: "https://linkedin.com/company/mustb",  Icon: Linkedin,    label: "LinkedIn"    },
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-[#060709] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid md:grid-cols-3 gap-12 md:gap-8">

        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 font-bold text-foreground tracking-tighter">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/10 bg-[#0f1115] flex items-center justify-center">
              <img src="/mascot.png" alt="must-b" className="w-full h-full object-contain scale-110 pointer-events-none" />
            </div>
            <span>must-b</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
            Autonomous AI agents that run locally, think globally, and execute privately.
          </p>
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            {socials.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center
                           text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/[0.06] transition-all"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Resources + Legal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">Resources</p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="https://www.npmjs.com/package/@must-b/must-b" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">npm Package</a></li>
              <li><a href="https://must-b.com/install.sh" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">CLI Installer</a></li>
              <li><a href="https://discord.gg/mustb" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Discord</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">Legal</p>
              <IndustrialSwitch initialState={isDark} onToggle={handleToggle} />
            </div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">Stay in the loop</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Agent updates, model support releases, and World-Mode news.
          </p>
          {subscribed ? (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-emerald-400 font-mono"
            >
              ✓ You're in. Watch your inbox.
            </motion.p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono
                           text-foreground placeholder:text-muted-foreground/40 outline-none
                           focus:border-primary/40 transition-colors min-w-0"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold
                           hover:bg-primary/90 transition-all shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04] px-6 md:px-10 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground/40 font-mono">© 2026 must-b. All rights reserved.</p>
          <p className="text-[11px] text-muted-foreground/40 font-mono">Proprietary Software</p>
        </div>
      </div>
    </footer>
  );
}
