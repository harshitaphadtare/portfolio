import { motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import data from "../info.json";

export const projects = data.projects;

interface ProjectsSectionProps {
  onProjectClick?: (projectId: string) => void;
}

export function ProjectsSection({ onProjectClick }: ProjectsSectionProps) {
  return (
    <section
      className="py-24 px-4 sm:px-6 md:px-10 lg:px-16"
      id="projects"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-center mb-24"
        >
          <h2
            className="mb-5 font-michroma"
            style={{
              fontSize: "clamp(2rem, 4vw, 2.5rem)",
              fontWeight: "800",
              color: "var(--section-title)",
              letterSpacing: "-0.03em",
              lineHeight: "1.2",
            }}
          >
            Projects
          </h2>
        </motion.div>

        {/* Projects List - Centered */}
        <div className="space-y-24">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              {...project}
              index={index}
              side={index % 2 === 0 ? "left" : "right"}
              onClick={() => onProjectClick?.(project.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}