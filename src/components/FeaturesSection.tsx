import { motion, useInView } from "framer-motion";
import { Shield, BrainCircuit, Terminal } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: BrainCircuit,
    title: "Autonomous Planning",
    desc: "must-b uses GPT-4o and Claude 3.5 Sonnet as its reasoning layer. Given a goal, it decomposes the work into a directed task graph — spawning specialized sub-agents per node, resolving dependencies, retrying failures, and collapsing results back into a final output. Zero manual orchestration.",
    badge: "GPT-4o · Claude 3.5",
    gradient: "from-indigo-500/20 to-indigo-600/5",
    detail: [
      "Task graph decomposition",
      "Parallel sub-agent spawning",
      "Automatic retry + fallback",
    ],
  },
  {
    icon: Terminal,
    title: "Full OS Control",
    desc: "Agents have direct access to your shell, filesystem, and git. They can run arbitrary commands, read and patch files, commit changes, open PRs, and chain tool calls across sessions — all from a single natural-language instruction.",
    badge: "shell · git · fs",
    gradient: "from-violet-500/20 to-violet-600/5",
    detail: [
      "Shell command execution",
      "File read / write / patch",
      "Git commit, push, PR creation",
    ],
  },
  {
    icon: Shield,
    title: "Privacy First",
    desc: "Every node generates an Ed25519 key pair at install time. Execution stays local — model weights run on your hardware, tool calls never leave your machine. Zero telemetry, zero data retention. Cloud sync is opt-in, end-to-end signed.",
    badge: "local-first · zero-data",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    detail: [
      "Ed25519 identity, local keygen",
      "No telemetry, no data retention",
      "Cloud sync is opt-in & signed",
    ],
  },
];

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const FeatureCard = ({ feature }: { feature: typeof features[0] }) => {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card-neon-glow group relative p-7 md:p-8 rounded-outer overflow-hidden cursor-default flex flex-col gap-5"
    >
      {/* Gradient bg on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-outer`} />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4">
        {/* Icon + badge row */}
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
            <feature.icon className="w-5 h-5 text-primary" />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/50 border border-white/[0.08] px-2 py-0.5 rounded-full bg-white/[0.02]">
            {feature.badge}
          </span>
        </div>

        {/* Title + description */}
        <div>
          <h3 className="text-base font-bold text-foreground mb-2">{feature.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
        </div>

        {/* Detail list */}
        <ul className="space-y-1.5 pt-1 border-t border-white/[0.05]">
          {feature.detail.map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground/70 font-mono">
              <span className="w-1 h-1 rounded-full bg-primary/60 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-24 md:py-32 px-6 relative">
      {/* Section divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isHeadingInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-block text-xs font-mono text-primary uppercase tracking-[0.2em] mb-4"
          >
            Features
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Built for autonomous work.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A framework where agents plan, delegate, and execute — locally, privately, and at scale.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
