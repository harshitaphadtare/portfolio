import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { ProjectsSection, projects } from "./components/ProjectsSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { OpenSourcePage } from "./pages/OpenSourcePage";
import { AboutPage } from "./pages/AboutPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { Footer } from "./components/Footer";
import { BackgroundAnimation } from "./components/BackgroundAnimation";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState<"home" | "about" | "opensource" | "project">("home");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "light" || (!savedTheme && !systemPrefersDark)) {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentPage("project");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navigate to Home and then scroll to a specific section id (e.g., "projects" or "experience")
  const handleRequestScrollTo = (href: string) => {
    const id = href.replace(/^#/, "");
    if (currentPage !== "home") {
      setCurrentPage("home");
    }
    setPendingAnchor(id);
  };

  const handleBackToProjects = () => {
    setCurrentPage("home");
    setSelectedProjectId(null);
    // Scroll to projects section after a short delay
    setTimeout(() => {
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        const offsetTop =
          projectsSection.getBoundingClientRect().top +
          window.pageYOffset -
          80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handleNavigateProject = (direction: "prev" | "next") => {
    if (!selectedProjectId) return;
    const currentIndex = projects.findIndex((p) => p.id === selectedProjectId);
    const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < projects.length) {
      setSelectedProjectId(projects[newIndex].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const selectedProject = selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId)
    : null;
  const currentProjectIndex = selectedProjectId
    ? projects.findIndex((p) => p.id === selectedProjectId)
    : -1;

  // After switching to Home, perform the scroll when the element exists
  useEffect(() => {
    if (currentPage !== "home" || !pendingAnchor) return;

    let attempts = 0;
    const maxAttempts = 20; // ~1s total if interval=50ms
    const interval = 50;

    const tryScroll = () => {
      const el = document.getElementById(pendingAnchor!);
      if (el) {
        const offsetTop = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
        setPendingAnchor(null);
        return;
      }
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(tryScroll, interval);
      } else {
        // Give up after retries
        setPendingAnchor(null);
      }
    };

    // Kick off after a tick so Home can mount
    const timeout = setTimeout(tryScroll, 0);
    return () => clearTimeout(timeout);
  }, [currentPage, pendingAnchor]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Professional Background Animation */}
      <BackgroundAnimation />

      {/* Navigation */}
      <Navigation 
        isDark={isDark} 
        toggleTheme={toggleTheme}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onRequestScrollTo={handleRequestScrollTo}
      />

      {/* Scroll to Top Button */}
      <ScrollToTopButton isDark={isDark} />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentPage === "home" ? (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <HeroSection onLearnMore={() => setCurrentPage("about")} />
            <ProjectsSection onProjectClick={handleProjectClick} />
            <ExperienceSection />
            <Footer />
          </motion.main>
        ) : currentPage === "about" ? (
          <motion.main
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <AboutPage />
            <Footer />
          </motion.main>
        ) : currentPage === "project" && selectedProject ? (
          <motion.main
            key="project"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <ProjectDetailPage
              project={selectedProject}
              onBack={handleBackToProjects}
              onPrevious={() => handleNavigateProject("prev")}
              onNext={() => handleNavigateProject("next")}
              hasPrevious={currentProjectIndex > 0}
              hasNext={currentProjectIndex < projects.length - 1}
            />
            <Footer />
          </motion.main>
        ) : (
          <motion.main
            key="opensource"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <OpenSourcePage />
            <Footer />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
