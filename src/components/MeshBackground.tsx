import { motion } from "framer-motion";

const MeshBackground = () => (
  <div className="mesh-gradient-bg">
    <motion.div
      className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]"
      style={{ background: "hsl(239 84% 67% / 0.15)" }}
      animate={{
        x: [0, 30, 0],
        y: [0, -20, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]"
      style={{ background: "hsl(280 60% 40% / 0.1)" }}
      animate={{
        x: [0, -20, 0],
        y: [0, 30, 0],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute top-[40%] left-[50%] w-[30%] h-[30%] rounded-full blur-[100px]"
      style={{ background: "hsl(239 84% 67% / 0.08)" }}
      animate={{
        x: [0, -40, 0],
        y: [0, 20, 0],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export default MeshBackground;
