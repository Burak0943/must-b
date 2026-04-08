import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

// Mobilde daha az parçacık kullanarak işlemciyi kurtarıyoruz
const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;
const PARTICLE_COUNT = IS_MOBILE ? 12 : 25;

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
  const [dimensions, setDimensions] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    setDimensions({ w: window.innerWidth, h: window.innerHeight });
    // Resize olayını biraz daha sakin yönetiyoruz
    let timeoutId: number;
    const handler = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setDimensions({ w: window.innerWidth, h: window.innerHeight });
      }, 200);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const particles: Particle[] = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // Yüzde bazlı kullanacağız, daha performanslı
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * -20,
        opacity: Math.random() * 0.3 + 0.1,
      })),
    [] // Boyut değişince parçacıkları yeniden oluşturmaya gerek yok
  );

  return (
    <div className="mesh-gradient-bg fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#0a0a0a]">
      {/* BLOB OPTİMİZASYONU: 
          - willChange: transform ekledik (GPU layer oluşturur)
          - Blur değerlerini hafifçe düşürdük
      */}
      
      {/* Primary indigo blob */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[100px] opacity-60"
        style={{ background: "hsl(239 84% 67% / 0.15)", willChange: "transform" }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Purple blob */}
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[100px] opacity-50"
        style={{ background: "hsl(280 60% 35% / 0.12)", willChange: "transform" }}
        animate={{
          x: [0, -40, 20, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: `hsl(239 84% 67% / ${p.opacity})`,
              willChange: "transform",
            }}
            animate={{
              y: [0, -200], // Piksel yerine daha kısa mesafe
              opacity: [0, p.opacity, 0],
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

      {/* Grid overlay - Statik olduğu için dokunmuyoruz */}
      <div
        className="absolute inset-0 opacity-[0.03]"
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