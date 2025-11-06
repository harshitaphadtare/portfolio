import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import data from "../info.json";

interface HeroSectionProps {
  onLearnMore?: () => void;
}

export function HeroSection({ onLearnMore }: HeroSectionProps) {
  const { personal } = data;
  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative pt-16"
    >
      <div className="max-w-5xl w-full mx-auto text-center space-y-6 sm:space-y-8 md:space-y-10">
        {/* Main Title - Biggest Text */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative"
        >
          <h1
            className="relative px-4 leading-tight"
            style={{
              // Smaller on phones, scales up smoothly to desktop
              fontSize: "clamp(1.6rem, 6.2vw, 3.25rem)",
              fontWeight: "800",
              letterSpacing: "-0.04em",
              lineHeight: "1.12",
              color: "var(--hero-title)",
              wordBreak: 'break-word',
              overflowWrap: 'anywhere'
            }}
          >
            {personal.heroTitle.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < personal.heroTitle.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>
        </motion.div>

        {/* Description with Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-2xl mx-auto px-4"
        >
          <p
            className="leading-relaxed"
            style={{
              fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)",
              lineHeight: "1.7",
              color: "var(--hero-description)",
              fontWeight: "400",
            }}
          >
            {personal.heroDescription.split(personal.name).map((part, i) => (
              <span key={i}>
                {part}
                {i === 0 && (
                  <span
                    style={{
                      color: "var(--hero-description)",
                      fontWeight: "700",
                    }}
                  >
                    {personal.name}
                  </span>
                )}
              </span>
            ))}
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-4"
        >
          <motion.button
            onClick={onLearnMore}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-lg overflow-hidden transition-all duration-300 font-quantico"
            style={{
              backgroundColor: "var(--cta-button-bg)",
              color: "var(--cta-button-text)",
              fontWeight: "700",
              fontSize: "clamp(0.85rem, 1.7vw, 1.05rem)",
              cursor: "pointer",
              letterSpacing: '.01em'
            }}
            whileHover={{
              scale: 1.02,
              opacity: 0.9,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
            }}
          >
            <span className="relative flex items-center gap-2">
              Learn More
              <ExternalLink className="w-4 h-4" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}