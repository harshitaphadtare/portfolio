import { motion } from "framer-motion";
import { useState } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies?: string[];
  badges: { text: string; color: string }[];
  date: string;
  images?: string[];
  image: string;
  index: number;
  side: "left" | "right";
  onClick?: () => void;
}

export function ProjectCard({
  title,
  description,
  badges,
  date,
  images,
  image,
  index,
  side,
  onClick,
}: ProjectCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="mb-20 last:mb-0"
    >
      {/* Container - Stack on mobile, row on desktop */}
  <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-start">
        {/* Image - 400x280 Rectangle with Border & Padding */}
        <motion.div
          className={`w-full md:w-[520px] lg:w-[550px] flex-shrink-0 ${
            side === "right" ? "md:order-2" : "md:order-1"
          }`}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="rounded-2xl p-4 cursor-pointer"
            style={{
              border: "2px solid var(--hero-title)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
            onClick={onClick}
          >
            <div 
              className="relative overflow-hidden rounded-xl"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img
                src={(function(){
                  const raw = (images && images.length > 0 ? images[0] : image) as string
                  if (!raw) return raw as any
                  if (/^https?:\/\//i.test(raw) || /^data:/i.test(raw)) return raw
                  const base = (import.meta as any).env?.BASE_URL ?? '/'
                  const normalized = raw.replace(/^\/+/, '')
                  const withBase = (base.endsWith('/') ? base : base + '/') + normalized
                  return withBase
                })() as any}
                alt={title}
                className="w-full max-w-full h-auto max-h-[320px] object-contain bg-[var(--nav-bg)] mx-auto"
              />
              
              {/* View Project Badge Following Cursor */}
              {isHovering && (
                <motion.div
                  className="absolute pointer-events-none px-4 py-2 rounded-full font-quantico"
                  style={{
                    left: mousePosition.x,
                    top: mousePosition.y,
                    background: "var(--profile-gradient)",
                    color: "#ffffff",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    boxShadow: "0 8px 30px var(--accent-purple-light)",
                    transform: "translate(-50%, -50%)",
                    whiteSpace: "nowrap",
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  View Project
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Text Content - Left aligned */}
        <div
          className={`flex-1 ${
            side === "right" ? "md:order-1" : "md:order-2"
          }`}
        >
          {/* Title */}
          <motion.h3
            className="pt-2 mb-3 font-quantico"
            style={{
              fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
              fontWeight: "700",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              lineHeight: "1.3",
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.1 }}
          >
            {title}
          </motion.h3>

          {/* Date */}
          <motion.p
            className="mb-4"
            style={{
              fontSize: "0.8125rem",
              fontWeight: "600",
              color: "var(--text-tertiary)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.15 + 0.15 }}
          >
            {date}
          </motion.p>

          {/* Badges */}
          <motion.div
            className="flex flex-wrap gap-2 mb-5"
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
          >
            {badges.map((badge, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-md"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  backgroundColor: badge.color,
                  color:
                    badge.color === "rgba(16, 185, 129, 0.15)"
                      ? "#10b981"
                      : badge.color === "rgba(147, 51, 234, 0.15)"
                      ? "#9333ea"
                      : badge.color === "rgba(251, 191, 36, 0.2)"
                      ? "#f59e0b"
                      : "#3b82f6",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                {badge.text}
              </span>
            ))}
          </motion.div>

          {/* Description */}
          <motion.p
            style={{
              fontSize: "1rem",
              lineHeight: "1.7",
              color: "var(--text-secondary)",
            }}
            initial={{ opacity: 0, y: 5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.15 + 0.25 }}
          >
            {description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
