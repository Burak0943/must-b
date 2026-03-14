import { motion, useInView } from "framer-motion";
import { Shield, Cpu, Cloud, Zap } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Cpu,
    title: "Local Execution",
    desc: "Run AI models directly on your hardware. No cloud dependency for inference. Your data never leaves your machine.",
    gradient: "from-indigo-500/20 to-indigo-600/5",
  },
  {
    icon: Cloud,
    title: "Cloud Orchestration",
    desc: "Manage, update, and monitor all your agents from a single cloud dashboard. Push configurations at scale.",
    gradient: "from-purple-500/20 to-purple-600/5",
  },
  {
    icon: Shield,
    title: "Zero-Trust Privacy",
    desc: "End-to-end encryption for sync. Local processing guarantees your sensitive data stays local. Always.",
    gradient: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    icon: Zap,
    title: "Instant Response",
    desc: "No network round-trips for inference. Sub-millisecond latency. Your AI responds as fast as your hardware allows.",
    gradient: "from-amber-500/20 to-amber-600/5",
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

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card-neon-glow group relative p-6 md:p-8 rounded-outer overflow-hidden cursor-default"
    >
      {/* Gradient bg on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-outer`} />

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
          className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300"
        >
          <feature.icon className="w-6 h-6 text-primary" />
        </motion.div>
        <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
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
            Engineered for the Edge
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every architectural decision optimized for privacy, speed, and developer experience.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid md:grid-cols-2 gap-6"
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
