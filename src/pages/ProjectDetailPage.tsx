import { motion } from "framer-motion";
import {
  Github,
  Star,
  GitFork,
  Users,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

interface ProjectDetailPageProps {
  project: {
    id: string;
    title: string;
    description: string;
    technologies?: string[];
    badges: { text: string; color: string }[];
    date: string;
    images?: string[];
    image: string;
    githubUrl?: string;
    videoUrl?: string;
    metadata?: string;
    detailedDescription?: string;
    myContribution?: string;
    challenges?: string;
    mediumUrl?: string;
    allTechnologies?: string[];
    stars?: number;
    forks?: number;
    contributors?: number;
  };
  onBack: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function ProjectDetailPage({
  project,
  onBack,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: ProjectDetailPageProps) {
  const slides = useMemo(() => {
    const imgs = (project.images ?? []).filter(Boolean);
    console.log('=== PROJECT DETAIL DEBUG ===');
    console.log('Project ID:', project.id);
    console.log('Project Title:', project.title);
    console.log('Images array:', imgs);
    console.log('Number of images:', imgs.length);
    console.log('===========================');
    return imgs;
  }, [project.images, project.id, project.title])

  const [slideIndex, setSlideIndex] = useState(0)
  const hasSlides = slides.length > 0
  const canNavigate = slides.length > 1
  const [isHovered, setIsHovered] = useState(false)

  const nextSlide = () => {
    if (!canNavigate) return
    setSlideIndex((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    if (!canNavigate) return
    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }
  
  // Auto-advance slides every 7 seconds; pause when hovered or if single slide.
  useEffect(() => {
    if (!canNavigate || isHovered) return
    const id = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length)
    }, 7000)
    return () => clearInterval(id)
  }, [canNavigate, slides.length, isHovered])

  // Prefer `technologies`, fall back to `allTechnologies` if missing
  const keyTech = (project.technologies && project.technologies.length
    ? project.technologies
    : project.allTechnologies || []).slice(0, 5);

  const allTech = project.allTechnologies && project.allTechnologies.length
    ? project.allTechnologies
    : project.technologies || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative pt-24 pb-16 px-6 sm:px-8 md:px-12 lg:px-16"
    >
      <div className="max-w-4xl mx-auto">
        {/* Project Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Project Title */}
          <h1
            className="mb-6 font-michroma"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: "800",
              color: "var(--section-title)",
              letterSpacing: "-0.03em",
              lineHeight: "1.2",
            }}
          >
            {project.title}
          </h1>

          {/* Action Links */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-6">
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 font-quantico"
                style={{
                  border: "2px solid var(--project-button-border)",
                  color: "var(--project-button-text)",
                  fontSize: "0.8125rem",
                  fontWeight: "600",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                }}
                whileHover={{
                  backgroundColor: "var(--nav-active-bg)",
                  color: "var(--nav-active-text)",
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Github className="w-4 h-4" />
                View Code
              </motion.a>
            )}

            {/* Stars Button */}
            {project.stars !== undefined && (
              <motion.div
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 font-quantico"
                style={{
                  border: "2px solid var(--project-button-border)",
                  color: "var(--project-button-text)",
                  fontSize: "0.8125rem",
                  fontWeight: "600",
                  backgroundColor: "transparent",
                  cursor: "default",
                }}
                whileHover={{
                  backgroundColor: "var(--nav-active-bg)",
                  color: "var(--nav-active-text)",
                  scale: 1.05,
                }}
                transition={{ duration: 0.2 }}
              >
                <Star className="w-4 h-4" />
                {project.stars}
              </motion.div>
            )}

            {/* Forks Button */}
            {project.forks !== undefined && (
              <motion.div
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 font-quantico"
                style={{
                  border: "2px solid var(--project-button-border)",
                  color: "var(--project-button-text)",
                  fontSize: "0.8125rem",
                  fontWeight: "600",
                  backgroundColor: "transparent",
                  cursor: "default",
                }}
                whileHover={{
                  backgroundColor: "var(--nav-active-bg)",
                  color: "var(--nav-active-text)",
                  scale: 1.05,
                }}
                transition={{ duration: 0.2 }}
              >
                <GitFork className="w-4 h-4" />
                {project.forks}
              </motion.div>
            )}

            {/* Contributors Button */}
            {project.contributors !== undefined && (
              <motion.div
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 font-quantico"
                style={{
                  border: "2px solid var(--project-button-border)",
                  color: "var(--project-button-text)",
                  fontSize: "0.8125rem",
                  fontWeight: "600",
                  backgroundColor: "transparent",
                  cursor: "default",
                }}
                whileHover={{
                  backgroundColor: "var(--nav-active-bg)",
                  color: "var(--nav-active-text)",
                  scale: 1.05,
                }}
                transition={{ duration: 0.2 }}
              >
                <Users className="w-4 h-4" />
                {project.contributors}
              </motion.div>
            )}
          </div>

        </motion.div>

        {/* Media: prefer images carousel, then video, else fallback image */}
        {hasSlides ? (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div
              className="rounded-2xl overflow-hidden w-full bg-[var(--nav-bg)] relative"
              style={{
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                border: "1px solid var(--border)",
                height: "min(70vh, 720px)",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="relative w-full h-full">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                  <div
                    className="h-full flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${(slideIndex * 100) / slides.length}%)`,
                      width: `${slides.length * 100}%`,
                    }}
                  >
                    {slides.map((src, i) => (
                      <div
                        key={i}
                        className="h-full flex-shrink-0 flex items-center justify-center p-6"
                        style={{ width: `${100 / slides.length}%` }}
                      >
                        <img
                          src={src}
                          alt={`${project.title} slide ${i + 1}`}
                          className="max-w-full max-h-full w-auto h-auto object-contain"
                          onLoad={() => console.log(`✓ Loaded: ${src}`)}
                          onError={(e) => {
                            console.error(`✗ Failed: ${src}`);
                            console.error('Attempted URL:', e.currentTarget.src);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Arrows - Only show if multiple images */}
              {canNavigate && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all hover:scale-110 z-10"
                    style={{
                      background: "rgba(0, 0, 0, 0.6)",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      color: "white",
                    }}
                    aria-label="Previous image"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all hover:scale-110 z-10"
                    style={{
                      background: "rgba(0, 0, 0, 0.6)",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      color: "white",
                    }}
                    aria-label="Next image"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Image Counter */}
                  <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full font-quantico text-sm z-10"
                    style={{
                      background: "rgba(0, 0, 0, 0.7)",
                      color: "white",
                    }}
                  >
                    {slideIndex + 1} / {slides.length}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ) : project.videoUrl?.trim() ? (
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div
              className="rounded-2xl overflow-hidden bg-[var(--nav-bg)]"
              style={{
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                border: "1px solid var(--border)",
              }}
            >
              <video
                className="w-full h-auto"
                controls
                preload="metadata"
              >
                <source src={project.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        ) : (
          // Fallback: single image if provided
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div
              className="rounded-2xl overflow-hidden bg-[var(--nav-bg)] flex items-center justify-center"
              style={{
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                border: "1px solid var(--border)",
                height: "min(70vh, 720px)",
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="max-w-full max-h-full w-auto h-auto object-contain"
              />
            </div>
          </motion.div>
        )}

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Tech Stack Section */}
          {allTech.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2
                className="mb-6 font-michroma"
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
                  fontWeight: "700",
                  color: "var(--section-title)",
                  letterSpacing: "-0.02em",
                }}
              >
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {allTech.map((tech, idx) => (
                  <motion.span
                    key={idx}
                    className="px-3 py-1.5 rounded-full"
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      backgroundColor: "var(--secondary)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border)",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.5 + idx * 0.03,
                    }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "var(--nav-hover-bg)",
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.section>
          )}

          {/* Detailed Description */}
          {project.detailedDescription && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2
                className="mb-6 font-michroma"
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
                  fontWeight: "700",
                  color: "var(--section-title)",
                  letterSpacing: "-0.02em",
                }}
              >
                Detailed Description
              </h2>
              <div
                className="space-y-4"
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: "1.7",
                  color: "var(--text-secondary)",
                }}
              >
                {project.detailedDescription
                  .split("\n\n")
                  .map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
              </div>
            </motion.section>
          )}

          {/* My Contribution */}
          {project.myContribution && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2
                className="mb-6 font-michroma"
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
                  fontWeight: "700",
                  color: "var(--section-title)",
                  letterSpacing: "-0.02em",
                }}
              >
                My Contribution
              </h2>
              <div
                className="space-y-4"
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: "1.7",
                  color: "var(--text-secondary)",
                }}
              >
                {project.myContribution
                  .split("\n\n")
                  .map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
              </div>
            </motion.section>
          )}

          {/* Challenges */}
          {project.challenges && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h2
                className="mb-6 font-michroma"
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
                  fontWeight: "700",
                  color: "var(--section-title)",
                  letterSpacing: "-0.02em",
                }}
              >
                Challenges
              </h2>
              <div
                className="space-y-4"
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: "1.7",
                  color: "var(--text-secondary)",
                }}
              >
                {project.challenges
                  .split("\n\n")
                  .map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
              </div>
            </motion.section>
          )}

          {/* Read More Link */}
          {project.mediumUrl?.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{
                fontSize: "1.0625rem",
                lineHeight: "1.8",
                color: "var(--text-secondary)",
              }}
            >
              <p>
                Want to know the full story?{" "}
                <a
                  href={project.mediumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--project-link-color)",
                    fontWeight: "600",
                    textDecoration: "underline",
                  }}
                >
                  Read the full case study on Medium
                </a>
              </p>
            </motion.div>
          )}
        </div>

        {/* Project Navigation Footer */}
        <motion.div
          className="mt-16 sm:mt-24 pt-6 sm:pt-8 border-t"
          style={{ borderColor: "var(--border)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          {/* Mobile: Stack vertically */}
          <div className="flex flex-col sm:hidden gap-4">
            <motion.button
              onClick={onBack}
              className="w-full px-6 py-3 rounded-full font-quantico"
              style={{
                backgroundColor: "var(--cta-button-bg)",
                color: "var(--cta-button-text)",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              Back to All Projects
            </motion.button>

            <div className="flex items-center justify-between">
              <motion.button
                onClick={onPrevious}
                disabled={!hasPrevious}
                className="flex items-center gap-1.5 font-quantico"
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: "600",
                  color: hasPrevious
                    ? "var(--text-primary)"
                    : "var(--text-tertiary)",
                  cursor: hasPrevious ? "pointer" : "not-allowed",
                  opacity: hasPrevious ? 1 : 0.5,
                }}
                whileTap={hasPrevious ? { scale: 0.95 } : undefined}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden xs:inline">Previous</span>
                <span className="inline xs:hidden">Prev</span>
              </motion.button>

              <motion.button
                onClick={onNext}
                disabled={!hasNext}
                className="flex items-center gap-1.5 font-quantico"
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: "600",
                  color: hasNext
                    ? "var(--text-primary)"
                    : "var(--text-tertiary)",
                  cursor: hasNext ? "pointer" : "not-allowed",
                  opacity: hasNext ? 1 : 0.5,
                }}
                whileTap={hasNext ? { scale: 0.95 } : undefined}
                transition={{ duration: 0.2 }}
              >
                <span className="hidden xs:inline">Next</span>
                <span className="inline xs:hidden">Next</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Desktop: Horizontal layout */}
          <div className="hidden sm:flex items-center justify-between">
            <motion.button
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="flex items-center gap-2 font-quantico"
              style={{
                fontSize: "0.9375rem",
                fontWeight: "600",
                color: hasPrevious
                  ? "var(--text-primary)"
                  : "var(--text-tertiary)",
                cursor: hasPrevious ? "pointer" : "not-allowed",
                opacity: hasPrevious ? 1 : 0.5,
              }}
              whileHover={
                hasPrevious
                  ? { x: -5, color: "var(--project-link-color)" }
                  : undefined
              }
              transition={{ duration: 0.2 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous Project
            </motion.button>

            <motion.button
              onClick={onBack}
              className="px-6 py-3 rounded-full font-quantico"
              style={{
                backgroundColor: "var(--cta-button-bg)",
                color: "var(--cta-button-text)",
                fontSize: "0.9375rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "var(--nav-active-bg-hover)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              Back to All Projects
            </motion.button>

            <motion.button
              onClick={onNext}
              disabled={!hasNext}
              className="flex items-center gap-2 font-quantico"
              style={{
                fontSize: "0.9375rem",
                fontWeight: "600",
                color: hasNext
                  ? "var(--text-primary)"
                  : "var(--text-tertiary)",
                cursor: hasNext ? "pointer" : "not-allowed",
                opacity: hasNext ? 1 : 0.5,
              }}
              whileHover={
                hasNext
                  ? { x: 5, color: "var(--project-link-color)" }
                  : undefined
              }
              transition={{ duration: 0.2 }}
            >
              Next Project
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}