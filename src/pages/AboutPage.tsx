import { motion } from "framer-motion";
import { Linkedin, Github, Mail, FileText } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import profileImage from "../assets/harshita.png";
import data from "../assets/info.json";

// Medium icon as SVG since it's not in lucide-react
const MediumIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
);

// Map icon names to components
const iconMap: Record<string, React.ComponentType> = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Medium: MediumIcon,
  Email: Mail,
};

const socialLinks = data.socialLinks.map(link => ({
  ...link,
  icon: iconMap[link.name] || Mail
}));

const techStack = data.techStack;
const photoGallery = data.photoGallery;
export function AboutPage() {
  const { personal } = data;

  return (
    <div className="relative pt-24 pb-16">
      {/* Row 1: Profile Image + Info */}
      <section className="px-6 sm:px-8 md:px-12 lg:px-16 mb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 lg:gap-16 items-start">
            {/* Left Column - Profile Image + Download Resume */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-center lg:items-start gap-6"
            >
              {/* Profile Image */}
              <div className="relative">
                {/* Gradient Ring */}
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: "var(--profile-gradient)",
                    padding: "4px",
                  }}
                >
                  <div
                    className="w-full h-full rounded-3xl"
                    style={{
                      background: "var(--background)",
                    }}
                  />
                </div>

                {/* Image Container */}
                <motion.div
                  className="relative w-full sm:w-[400px] h-[400px] rounded-3xl overflow-hidden"
                  style={{
                    boxShadow: "0 20px 60px rgba(129, 36, 180, 0.3)",
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={profileImage}
                    alt="Harshita Phadtare"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Download Resume Button */}
              <motion.a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-quantico w-full sm:w-[400px]"
                style={{
                  backgroundColor: "var(--cta-button-bg)",
                  color: "var(--cta-button-text)",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 12px 40px rgba(129, 36, 180, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <FileText className="w-5 h-5" />
                Download Resume
              </motion.a>
            </motion.div>

            {/* Right Column - Info (No Background) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="space-y-8 flex flex-col"
            >
              {/* Name and Title */}
              <div className="space-y-4">
                <h1
                  className="font-michroma"
                  style={{
                    fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                    fontWeight: "800",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    lineHeight: "1.2",
                  }}
                >
                  {personal.name}
                </h1>
                <p
                  className="font-quantico"
                  style={{
                    fontSize: "clamp(1.0625rem, 2vw, 1.25rem)",
                    fontWeight: "600",
                    color: "var(--hero-title)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {personal.title}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-5">
                {personal.bio.map((paragraph, index) => (
                  <p
                    key={index}
                    style={{
                      fontSize: "1.0625rem",
                      lineHeight: "1.8",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Social Links - Icon Circles */}
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: "var(--secondary)",
                        border: "1px solid var(--border)",
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.5 + index * 0.1,
                      }}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "var(--nav-hover-bg)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      title={social.name}
                    >
                      <Icon />
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Row 2: Skills & Technologies */}
      <section className="px-6 sm:px-8 md:px-12 lg:px-16 mb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Title */}
            <h2
              className="mb-10 font-michroma"
              style={{
                fontSize: "clamp(2rem, 4vw, 2.5rem)",
                fontWeight: "800",
                color: "var(--section-title)",
                letterSpacing: "-0.03em",
                lineHeight: "1.2",
              }}
            >
              My Skill Stack
            </h2>

            {/* Tech Stack Grid */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {techStack.map((tech, idx) => (
                <motion.span
                  key={idx}
                  className="px-3 py-1.5 rounded-full font-quantico"
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
                  transition={{
                    duration: 0.3,
                    delay: 0.3 + idx * 0.02,
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "var(--nav-hover-bg)",
                    color: "var(--text-primary)",
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Row 3: Travel Diaries */}
      <section className="relative overflow-hidden">
        <div className="px-6 sm:px-8 md:px-12 lg:px-16 mb-8">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="font-michroma"
              style={{
                fontSize: "clamp(2rem, 4vw, 2.5rem)",
                fontWeight: "800",
                color: "var(--section-title)",
                letterSpacing: "-0.03em",
                lineHeight: "1.2",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              Travel Diaries
            </motion.h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          {/* Gallery Container with Blur Edges */}
          <div className="relative">
            {/* Left Blur Gradient */}
            <div
              className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, var(--background) 0%, transparent 100%)",
              }}
            />

            {/* Right Blur Gradient */}
            <div
              className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to left, var(--background) 0%, transparent 100%)",
              }}
            />

            {/* Auto-Scrolling Gallery */}
            <div className="overflow-x-hidden overflow-y-hidden">
              <motion.div
                className="flex gap-6 px-6 py-4"
                style={{ width: "max-content" }}
                animate={{ x: [0, -1800] }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                }}
              >
                {[...photoGallery, ...photoGallery, ...photoGallery].map(
                  (photo, idx) => (
                    <motion.div
                      key={idx}
                      className="flex-shrink-0"
                      whileHover={{ scale: 1.05, zIndex: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                          width: "280px",
                          height: "420px",
                          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <ImageWithFallback
                          src={photo.url}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>
                  )
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
