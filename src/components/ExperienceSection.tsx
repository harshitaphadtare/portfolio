import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ExperienceCard } from "./ExperienceCard";
import data from "../info.json";

const experiences = data.experiences;
export function ExperienceSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [targetCardIndex, setTargetCardIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      // Find which card should be targeted based on scroll position
      let newTargetIndex = 0;

      for (let index = cardRefs.current.length - 1; index >= 0; index--) {
        const card = cardRefs.current[index];
        if (!card) continue;
        
        const cardRect = card.getBoundingClientRect();
        
        // If this card's top has passed the top of the viewport
        // The circle should point to the next card
        if (cardRect.top <= 50) {
          newTargetIndex = Math.min(index + 1, experiences.length - 1);
          break;
        }
      }

      setTargetCardIndex(newTargetIndex);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate circle position based on target card
  const getCirclePosition = () => {
    const targetCard = cardRefs.current[targetCardIndex];
    if (targetCard && timelineRef.current) {
      return targetCard.offsetTop + 40; // Offset to align with card content
    }
    return 40; // Default position
  };

  return (
    <section
      className="pt-16 pb-24 sm:pt-20 sm:pb-28 px-4 sm:px-6 md:px-10 lg:px-16"
      id="experience"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="text-center mb-16"
        >
          <h2
            className="mb-4 font-michroma"
            style={{
              fontSize: "clamp(2rem, 4vw, 2.5rem)",
              fontWeight: "800",
              color: "var(--section-title)",
              letterSpacing: "-0.03em",
              lineHeight: "1.2",
            }}
          >
            Experience
          </h2>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative" ref={timelineRef}>
          {/* Central Vertical Line - Static - Hidden on mobile */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5"
            style={{
              transform: "translateX(-50%)",
              backgroundColor: "var(--border)",
              opacity: 0.3,
            }}
          />

          {/* Animated Circle Node - Hidden on mobile */}
          <motion.div
            className="hidden md:block absolute left-1/2 pointer-events-none"
            style={{
              x: "-50%",
              zIndex: 20,
            }}
            animate={{
              top: getCirclePosition(),
            }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
              mass: 0.8,
            }}
          >
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                width: "28px",
                height: "28px",
                transform: "translate(-50%, -50%)",
                left: "50%",
                top: "50%",
                background: "var(--profile-gradient)",
                opacity: 0.3,
                filter: "blur(8px)",
              }}
            />
            
            {/* Main node */}
            <div
              className="relative w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                background: "var(--profile-gradient)",
                boxShadow: "0 0 0 4px var(--background), 0 0 0 6px var(--accent-purple-light)",
              }}
            >
              {/* Inner dot */}
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "var(--timeline-dot)",
                }}
              />
            </div>
          </motion.div>

          {/* Timeline Entries */}
          <div className="relative space-y-6 sm:space-y-8">
            {experiences.map((experience, index) => (
              <div
                key={index}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
              >
                <ExperienceCard
                  {...experience}
                  index={index}
                  side={index % 2 === 0 ? "right" : "left"}
                />
              </div>
            ))}
            {/* Extra spacer for mobile to ensure separation from footer */}
            <div className="h-4 sm:h-2" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
