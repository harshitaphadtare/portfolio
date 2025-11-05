import { motion } from "framer-motion";

const mathFormulas = [
  "∂f/∂x",
  "∫ f(x)dx",
  "∇·F",
  "Σ xᵢ",
  "θ = arctan(y/x)",
  "e^(iπ) + 1 = 0",
  "∂²u/∂t²",
  "lim x→∞",
  "∇²φ",
  "∮ E·dl",
  "λ = h/p",
  "f'(x)",
  "∏ aᵢ",
  "∂L/∂θ",
  "√(x² + y²)",
  "∫₀^∞",
  "∇ × B",
  "Σ wᵢxᵢ + b",
];

export function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Subtle gradient orbs */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)",
          top: "-20%",
          right: "-10%",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(42, 21, 59, 0.12) 0%, transparent 70%)",
          bottom: "-15%",
          left: "-10%",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(70px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [-50, 0, -50],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Math Formulas */}
      {mathFormulas.map((formula, index) => {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomDuration = 20 + Math.random() * 15;
        const randomDelay = Math.random() * 10;
        
        return (
          <motion.div
            key={index}
            className="absolute select-none pointer-events-none"
            style={{
              left: `${randomX}%`,
              top: `${randomY}%`,
              fontSize: "clamp(1rem, 1.5vw, 1.5rem)",
              fontFamily: "serif",
              color: "var(--foreground)",
              opacity: 0.08,
              fontWeight: "300",
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.08, 0.14, 0.08],
            }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: randomDelay,
            }}
          >
            {formula}
          </motion.div>
        );
      })}

      {/* Grid pattern overlay for sophistication */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          color: "var(--foreground)",
        }}
      />

      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
