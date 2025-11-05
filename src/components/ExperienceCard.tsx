import { motion } from "framer-motion";
import { Briefcase, Calendar, ChevronRight } from "lucide-react";

interface ExperienceCardProps {
  title: string;
  company: string;
  dates: string;
  description: string[];
  technologies: string[];
  index: number;
  side: "left" | "right";
}

export function ExperienceCard({
  title,
  company,
  dates,
  description,
  technologies,
  index,
  side,
}: ExperienceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "right" ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-16 last:mb-0"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side */}
        {side === "left" ? (
          <>
            {/* Content Card on Left */}
            <div className="flex justify-end">
              <motion.div
                className="relative w-full max-w-md group"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
              >
                {/* Decorative gradient background - Reduced intensity */}
                <div
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{
                    background: "var(--profile-gradient)",
                    filter: "blur(8px)",
                  }}
                />

                <div
                  className="relative p-8 rounded-2xl"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "2px solid var(--border)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  {/* Enhanced Pointer - Hidden on mobile */}
                  <div
                    className="hidden md:block absolute right-0 top-10 w-0 h-0"
                    style={{
                      transform: "translateX(100%)",
                      borderTop: "10px solid transparent",
                      borderBottom: "10px solid transparent",
                      borderLeft: "14px solid var(--border)",
                    }}
                  />
                  <div
                    className="hidden md:block absolute right-0 top-10 w-0 h-0"
                    style={{
                      transform: "translateX(calc(100% - 2px))",
                      borderTop: "10px solid transparent",
                      borderBottom: "10px solid transparent",
                      borderLeft: "14px solid var(--card)",
                    }}
                  />

                  {/* Company Badge */}
                  <motion.div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-3"
                    style={{
                      backgroundColor: "var(--accent-purple-light)",
                      border: "1px solid var(--accent-purple-light)",
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <Briefcase className="w-3.5 h-3.5" style={{ color: "var(--accent-purple)" }} />
                    <span
                      className="font-quantico"
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: "700",
                        color: "var(--accent-purple)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {company}
                    </span>
                  </motion.div>

                  {/* Job Title */}
                  <h3
                    className="mb-2 font-quantico"
                    style={{
                      fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                      fontWeight: "700",
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em",
                      lineHeight: "1.3",
                    }}
                  >
                    {title}
                  </h3>

                  {/* Dates with Icon */}
                  <div
                    className="mb-4 flex items-center gap-2"
                    style={{
                      fontSize: "0.875rem",
                    }}
                  >
                    <Calendar className="w-3.5 h-3.5" style={{ color: "var(--text-tertiary)" }} />
                    <span
                      style={{
                        color: "var(--text-tertiary)",
                        fontWeight: "500",
                      }}
                    >
                      {dates}
                    </span>
                  </div>

                  {/* Divider */}
                  <div
                    className="w-full h-px mb-4"
                    style={{
                      background: "linear-gradient(90deg, transparent, var(--border), transparent)",
                    }}
                  />

                  {/* Description Bullets */}
                  <ul className="mb-5 space-y-3">
                    {description.map((item, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-start gap-2"
                        style={{
                          fontSize: "0.9375rem",
                          color: "var(--text-secondary)",
                          lineHeight: "1.6",
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.3 + idx * 0.05 }}
                      >
                        <ChevronRight
                          className="flex-shrink-0 mt-0.5"
                          style={{
                            width: "16px",
                            height: "16px",
                            color: "var(--accent-purple)",
                          }}
                        />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, idx) => (
                      <motion.span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg"
                        style={{
                          fontSize: "0.8125rem",
                          fontWeight: "600",
                          backgroundColor: "var(--secondary)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border)",
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.4 + idx * 0.03 }}
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "var(--accent-purple-light)",
                          borderColor: "var(--accent-purple)",
                          color: "var(--accent-purple)",
                        }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Empty Right Side - Hidden on mobile */}
            <div className="hidden md:block" />
          </>
        ) : (
          <>
            {/* Empty Left Side - Hidden on mobile */}
            <div className="hidden md:block" />

            {/* Content Card on Right */}
            <div className="flex justify-start">
              <motion.div
                className="relative w-full max-w-md group"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
              >
                {/* Decorative gradient background - Reduced intensity */}
                <div
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{
                    background: "var(--profile-gradient)",
                    filter: "blur(8px)",
                  }}
                />

                <div
                  className="relative p-8 rounded-2xl"
                  style={{
                    backgroundColor: "var(--card)",
                    border: "2px solid var(--border)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  {/* Enhanced Pointer - Hidden on mobile */}
                  <div
                    className="hidden md:block absolute left-0 top-10 w-0 h-0"
                    style={{
                      transform: "translateX(-100%)",
                      borderTop: "10px solid transparent",
                      borderBottom: "10px solid transparent",
                      borderRight: "14px solid var(--border)",
                    }}
                  />
                  <div
                    className="hidden md:block absolute left-0 top-10 w-0 h-0"
                    style={{
                      transform: "translateX(calc(-100% + 2px))",
                      borderTop: "10px solid transparent",
                      borderBottom: "10px solid transparent",
                      borderRight: "14px solid var(--card)",
                    }}
                  />

                  {/* Company Badge */}
                  <motion.div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-3"
                    style={{
                      backgroundColor: "var(--accent-purple-light)",
                      border: "1px solid var(--accent-purple-light)",
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <Briefcase className="w-3.5 h-3.5" style={{ color: "var(--accent-purple)" }} />
                    <span
                      className="font-quantico"
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: "700",
                        color: "var(--accent-purple)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {company}
                    </span>
                  </motion.div>

                  {/* Job Title */}
                  <h3
                    className="mb-2 font-quantico"
                    style={{
                      fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                      fontWeight: "700",
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em",
                      lineHeight: "1.3",
                    }}
                  >
                    {title}
                  </h3>

                  {/* Dates with Icon */}
                  <div
                    className="mb-4 flex items-center gap-2"
                    style={{
                      fontSize: "0.875rem",
                    }}
                  >
                    <Calendar className="w-3.5 h-3.5" style={{ color: "var(--text-tertiary)" }} />
                    <span
                      style={{
                        color: "var(--text-tertiary)",
                        fontWeight: "500",
                      }}
                    >
                      {dates}
                    </span>
                  </div>

                  {/* Divider */}
                  <div
                    className="w-full h-px mb-4"
                    style={{
                      background: "linear-gradient(90deg, transparent, var(--border), transparent)",
                    }}
                  />

                  {/* Description Bullets */}
                  <ul className="mb-5 space-y-3">
                    {description.map((item, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-start gap-2"
                        style={{
                          fontSize: "0.9375rem",
                          color: "var(--text-secondary)",
                          lineHeight: "1.6",
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.3 + idx * 0.05 }}
                      >
                        <ChevronRight
                          className="flex-shrink-0 mt-0.5"
                          style={{
                            width: "16px",
                            height: "16px",
                            color: "var(--accent-purple)",
                          }}
                        />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, idx) => (
                      <motion.span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg"
                        style={{
                          fontSize: "0.8125rem",
                          fontWeight: "600",
                          backgroundColor: "var(--secondary)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border)",
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.4 + idx * 0.03 }}
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "var(--accent-purple-light)",
                          borderColor: "var(--accent-purple)",
                          color: "var(--accent-purple)",
                        }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
