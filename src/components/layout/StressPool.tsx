import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

const COLORS = ["#06b6d4", "#f43f5e", "#8b5cf6", "#10b981", "#f59e0b"];

export default function StressPool() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  
  const [gravityEnabled, setGravityEnabled] = useState(true);

  useEffect(() => {
    if (!sceneRef.current) return;

    const width = sceneRef.current.clientWidth;
    const height = 300;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;
    
    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent'
      }
    });
    renderRef.current = render;

    const wallOptions = { isStatic: true, render: { visible: false } };
    const thickness = 100;
    
    // Walls
    const floor = Bodies.rectangle(width / 2, height + thickness / 2, 5000, thickness, wallOptions);
    const ceiling = Bodies.rectangle(width / 2, -thickness / 2, 5000, thickness, wallOptions);
    const leftWall = Bodies.rectangle(-thickness / 2, height / 2, thickness, height * 2, wallOptions);
    const rightWall = Bodies.rectangle(width + thickness / 2, height / 2, thickness, height * 2, wallOptions);

    World.add(engine.world, [floor, ceiling, leftWall, rightWall]);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    World.add(engine.world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Run the renderer
    Render.run(render);
    
    // Create runner and run the engine
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Handle resize to update canvas width and walls
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        if (renderRef.current) {
          renderRef.current.canvas.width = newWidth;
          renderRef.current.options.width = newWidth;
          
          Matter.Body.setPosition(rightWall, { x: newWidth + thickness / 2, y: height / 2 });
          Matter.Body.setPosition(floor, { x: newWidth / 2, y: height + thickness / 2 });
          Matter.Body.setPosition(ceiling, { x: newWidth / 2, y: -thickness / 2 });
        }
      }
    });

    resizeObserver.observe(sceneRef.current);

    // Ensure clean unmount
    return () => {
      resizeObserver.disconnect();
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas) {
        render.canvas.remove();
      }
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!engineRef.current || !sceneRef.current) return;
    
    const rect = sceneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const shapes = [];
    for (let i = 0; i < 7; i++) {
        const radius = 15 + Math.random() * 20;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const shapeType = Math.floor(Math.random() * 3);
        const options = {
            restitution: 0.9,
            render: {
                fillStyle: color,
                strokeStyle: color,
                lineWidth: 1
            }
        };

        let body;
        const spawnX = x + (Math.random() * 40 - 20);
        const spawnY = y + (Math.random() * 40 - 20);

        if (shapeType === 0) {
            body = Bodies.circle(spawnX, spawnY, radius, options);
        } else if (shapeType === 1) {
            body = Bodies.rectangle(spawnX, spawnY, radius * 2, radius * 2, options);
        } else {
            const sides = Math.floor(Math.random() * 3) + 3; // 3 to 5 sides
            body = Bodies.polygon(spawnX, spawnY, sides, radius, options);
        }
        shapes.push(body);
    }

    World.add(engineRef.current.world, shapes);
  };

  const toggleGravity = () => {
    if (engineRef.current) {
        const nextGrav = engineRef.current.world.gravity.y === 1 ? 0 : 1;
        engineRef.current.world.gravity.y = nextGrav;
        setGravityEnabled(nextGrav === 1);
    }
  };

  const clearBodies = () => {
    if (engineRef.current) {
        const world = engineRef.current.world;
        const dynamics = world.bodies.filter(b => !b.isStatic);
        World.remove(world, dynamics);
    }
  };

  return (
    <div className="relative w-full border-t border-white/[0.04] bg-[#060709] overflow-hidden flex flex-col mt-4">
       <div className="flex justify-between items-center p-2 px-6 z-10 relative bg-black/20">
          <p className="text-[10px] text-muted-foreground/50 font-mono tracking-[0.2em] uppercase">Anti-Stress Physics Pool</p>
          <div className="flex gap-2">
            <button 
              onClick={toggleGravity} 
              className="text-[10px] bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-md text-muted-foreground/80 hover:text-white hover:bg-white/[0.06] transition-all font-mono uppercase tracking-wider"
            >
                Yerçekimi: {gravityEnabled ? "Aktif" : "Kapalı"}
            </button>
            <button 
              onClick={clearBodies} 
              className="text-[10px] bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-md text-muted-foreground/80 hover:text-white hover:bg-white/[0.06] transition-all font-mono uppercase tracking-wider"
            >
                Temizle
            </button>
          </div>
       </div>
       <div 
         ref={sceneRef} 
         onClick={handleCanvasClick}
         className="relative w-full h-[300px] cursor-crosshair group"
       >
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
            <p className="text-3xl md:text-5xl font-black text-white/50 tracking-[0.2em] text-center px-4 uppercase select-none">
                Stres Atmak İçin Tıkla
            </p>
         </div>
       </div>
    </div>
  );
}
