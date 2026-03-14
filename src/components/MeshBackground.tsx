import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

const PARTICLE_COUNT = 60;

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const MeshBackground = () => {
  const [dimensions, setDimensions] = useState({ w: 1920, h: 1080 });

  useEffect(() => {
    setDimensions({ w: window.innerWidth, h: window.innerHeight });
    const handler = () => setDimensions({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const particles: Particle[] = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * dimensions.w,
        y: Math.random() * dimensions.h * 3,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * -20,
        opacity: Math.random() * 0.4 + 0.1,
      })),
    [dimensions]
  );

  return (
    <div className="mesh-gradient-bg">
      {/* Primary indigo blob */}
      <motion.div
        className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] rounded-full blur-[150px]"
        style={{ background: "hsl(239 84% 67% / 0.18)" }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Purple blob */}
      <motion.div
        className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] rounded-full blur-[150px]"
        style={{ background: "hsl(280 60% 35% / 0.14)" }}
        animate={{
          x: [0, -50, 20, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Center accent blob */}
      <motion.div
        className="absolute top-[30%] left-[40%] w-[35%] h-[35%] rounded-full blur-[130px]"
        style={{ background: "hsl(239 84% 67% / 0.1)" }}
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 30, -20, 0],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Deep purple secondary */}
      <motion.div
        className="absolute top-[60%] right-[20%] w-[25%] h-[25%] rounded-full blur-[100px]"
        style={{ background: "hsl(260 70% 50% / 0.08)" }}
        animate={{
          x: [0, 30, -50, 0],
          y: [0, -40, 20, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: p.x,
              top: p.y,
              background: `hsl(239 84% 67% / ${p.opacity})`,
            }}
            animate={{
              y: [0, -dimensions.h * 0.5],
              x: [0, Math.sin(p.id) * 40],
              opacity: [0, p.opacity, p.opacity, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(239 84% 67% / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(239 84% 67% / 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
};

export default MeshBackground;
