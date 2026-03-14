import { motion } from "framer-motion";
import { Shield, Cpu, Cloud, Zap } from "lucide-react";
import { useRef } from "react";
import { useInView } from "framer-motion";

const features = [
  {
    icon: Cpu,
    title: "Local Execution",
    desc: "Run AI models directly on your hardware. No cloud dependency for inference. Your data never leaves your machine.",
    direction: "left" as const,
  },
  {
    icon: Cloud,
    title: "Cloud Orchestration",
    desc: "Manage, update, and monitor all your agents from a single cloud dashboard. Push configurations at scale.",
    direction: "right" as const,
  },
  {
    icon: Shield,
    title: "Zero-Trust Privacy",
    desc: "End-to-end encryption for sync. Local processing guarantees your sensitive data stays local. Always.",
    direction: "left" as const,
  },
  {
    icon: Zap,
    title: "Instant Response",
    desc: "No network round-trips for inference. Sub-millisecond latency. Your AI responds as fast as your hardware allows.",
    direction: "right" as const,
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        x: feature.direction === "left" ? -60 : 60 
      }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="glass glass-hover p-6 md:p-8 rounded-outer group"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
      >
        <feature.icon className="w-6 h-6 text-primary" />
      </motion.div>
      <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Engineered for the Edge
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every architectural decision optimized for privacy, speed, and developer experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
