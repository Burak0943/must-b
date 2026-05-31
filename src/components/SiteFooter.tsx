import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { IndustrialSwitch } from "@/components/ui/toggle-switch";
import { useTranslation } from "react-i18next";



export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { t } = useTranslation();

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
    { href: "https://www.instagram.com/mustb_cognitive/", Icon: Instagram, label: "Instagram" },
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
            {t('footer.tagline')}
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
            <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">{t('footer.resources')}</p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="https://www.npmjs.com/package/@must-b/must-b" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">npm Package</a></li>
              <li><a href="https://must-b.com/install.sh" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">CLI Installer</a></li>
              <li><a href="https://discord.gg/mustb" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Discord</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">{t('footer.legal')}</p>
              <IndustrialSwitch initialState={isDark} onToggle={handleToggle} />
            </div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="/terms" className="hover:text-foreground transition-colors">{t('legal.tos.title')}</a></li>
              <li><a href="/privacy" className="hover:text-foreground transition-colors">{t('legal.privacy.title')}</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">{t('footer.newsletter.title')}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t('footer.newsletter.desc')}
          </p>
          {subscribed ? (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-emerald-400 font-mono"
            >
              {t('footer.newsletter.success')}
            </motion.p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletter.placeholder')}
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono
                           text-foreground placeholder:text-muted-foreground/40 outline-none
                           focus:border-primary/40 transition-colors min-w-0"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold
                           hover:bg-primary/90 transition-all shrink-0"
              >
                {t('footer.newsletter.button')}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04] px-6 md:px-10 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground/40 font-mono">{t('footer.rights')}</p>
          <p className="text-[11px] text-muted-foreground/40 font-mono">{t('footer.proprietary')}</p>
        </div>
      </div>
    </footer>
  );
}
