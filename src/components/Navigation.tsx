import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const profileImage = "/memoji.png";

interface NavigationProps {
  isDark: boolean;
  toggleTheme: () => void;
  currentPage: "home" | "about" | "opensource" | "project";
  setCurrentPage: (
    page: "home" | "about" | "opensource" | "project",
  ) => void;
  onRequestScrollTo?: (href: string) => void;
}

export function Navigation({
  isDark,
  toggleTheme,
  currentPage,
  setCurrentPage,
  onRequestScrollTo,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const homeNavItems = [
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (currentPage === "home") {
        const sections = ["projects", "experience"];
        const current = sections.find((section) => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });

        if (current) {
          const label = homeNavItems.find((item) => item.href === `#${current}`)
            ?.label;
          if (label) setActiveSection(label);
        } else {
          setActiveSection("");
        }
      } else {
        setActiveSection("");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  const handleNavClick = (label: string, href?: string) => {
    setIsMobileMenuOpen(false);

    if (label === "Home") {
      setCurrentPage("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("");
    } else if (label === "About") {
      setCurrentPage("about");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("");
    } else if (label === "Contributions") {
      setCurrentPage("opensource");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("");
    } else {
      if (href) {
        // Prefer App-level handler to ensure scroll happens after Home mounts
        if (onRequestScrollTo) {
          onRequestScrollTo(href);
          if (currentPage !== "home") {
            setCurrentPage("home");
          }
        } else {
          // Fallback to local behavior if handler is not provided
          if (currentPage !== "home") {
            setCurrentPage("home");
            setTimeout(() => scrollToSection(href), 300);
          } else {
            scrollToSection(href);
          }
        }
      }
      setActiveSection(label);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="w-full px-4 sm:px-6 md:px-8 py-2">
        <div className="flex items-center justify-between h-16">
          {/* Profile Image */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              setCurrentPage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src={profileImage}
              alt="Harshita Phadtare"
              className="w-10 h-10 object-cover rounded-lg"
            />
          </div>

          {/* Center Navigation - Desktop Only */}
          <div
            className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center rounded-full p-1 transition-all duration-300"
            style={{
              backgroundColor: isScrolled
                ? isDark
                  ? "rgba(30, 30, 40, 1)"
                  : "rgba(255, 255, 255, 1)"
                : isDark
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.05)",
              boxShadow: isScrolled
                ? isDark
                  ? "0 4px 24px rgba(0, 0, 0, 0.3)"
                  : "0 4px 24px rgba(0, 0, 0, 0.1)"
                : "none",
            }}
          >
            <motion.button
              onClick={() => handleNavClick("Home")}
              className="relative px-5 py-2 rounded-full transition-all duration-200 font-quantico"
              style={{
                color:
                  currentPage === "home" && activeSection === ""
                    ? "var(--nav-active-text)"
                    : "var(--text-secondary)",
                fontSize: "0.9375rem",
                fontWeight:
                  currentPage === "home" && activeSection === "" ? "600" : "500",
                backgroundColor:
                  currentPage === "home" && activeSection === ""
                    ? "var(--nav-active-bg)"
                    : "transparent",
                cursor: "pointer",
              }}
              whileHover={{
                scale: currentPage === "home" && activeSection === "" ? 1 : 1.02,
                backgroundColor:
                  currentPage === "home" && activeSection === ""
                    ? "var(--nav-active-bg)"
                    : "var(--nav-hover-bg)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Home
            </motion.button>

            <motion.button
              onClick={() => handleNavClick("About")}
              className="relative px-5 py-2 rounded-full transition-all duration-200 font-quantico"
              style={{
                color: currentPage === "about" ? "var(--nav-active-text)" : "var(--text-secondary)",
                fontSize: "0.9375rem",
                fontWeight: currentPage === "about" ? "600" : "500",
                backgroundColor: currentPage === "about" ? "var(--nav-active-bg)" : "transparent",
                cursor: "pointer",
              }}
              whileHover={{
                scale: currentPage === "about" ? 1 : 1.02,
                backgroundColor: currentPage === "about" ? "var(--nav-active-bg)" : "var(--nav-hover-bg)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              About
            </motion.button>

            {homeNavItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => handleNavClick(item.label, item.href)}
                className="relative px-5 py-2 rounded-full transition-all duration-200 font-quantico"
                style={{
                  color: activeSection === item.label && currentPage === "home" ? "var(--nav-active-text)" : "var(--text-secondary)",
                  fontSize: "0.9375rem",
                  fontWeight: activeSection === item.label && currentPage === "home" ? "600" : "500",
                  backgroundColor: activeSection === item.label && currentPage === "home" ? "var(--nav-active-bg)" : "transparent",
                  cursor: "pointer",
                }}
                whileHover={{
                  scale: activeSection === item.label && currentPage === "home" ? 1 : 1.02,
                  backgroundColor: activeSection === item.label && currentPage === "home" ? "var(--nav-active-bg)" : "var(--nav-hover-bg)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {item.label}
              </motion.button>
            ))}

            <motion.button
              onClick={() => handleNavClick("Contributions")}
              className="relative px-5 py-2 rounded-full transition-all duration-200 font-quantico"
              style={{
                color: currentPage === "opensource" ? "var(--nav-active-text)" : "var(--text-secondary)",
                fontSize: "0.9375rem",
                fontWeight: currentPage === "opensource" ? "600" : "500",
                backgroundColor: currentPage === "opensource" ? "var(--nav-active-bg)" : "transparent",
                cursor: "pointer",
              }}
              whileHover={{
                scale: currentPage === "opensource" ? 1 : 1.02,
                backgroundColor: currentPage === "opensource" ? "var(--nav-active-bg)" : "var(--nav-hover-bg)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Contributions
            </motion.button>
          </div>

          {/* Right Side - Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full transition-colors duration-200 flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: 'var(--card)',
                color: 'var(--nav-active-bg)',
                cursor: 'pointer',
                border: '1px solid var(--border)'
              }}
              whileHover={{ scale: 1.05, backgroundColor: 'var(--nav-active-bg)', color: 'var(--nav-active-text)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              aria-label="Toggle theme"
            >
              <motion.div initial={false} animate={{ rotate: isDark ? 0 : 180 }} transition={{ duration: 0.3 }}>
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </motion.div>
            </motion.button>

            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full transition-colors duration-200 flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: 'var(--card)',
                color: 'var(--nav-active-bg)',
                cursor: 'pointer',
                border: '1px solid var(--border)'
              }}
              whileHover={{ scale: 1.05, backgroundColor: 'var(--nav-active-bg)', color: 'var(--nav-active-text)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="lg:hidden overflow-hidden" style={{ backgroundColor: isDark ? "rgba(30,30,40,0.98)" : "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }}>
            <div className="px-4 py-6 space-y-2">
              <motion.button onClick={() => handleNavClick("Home")} className="w-full px-5 py-3 rounded-lg transition-all duration-200 font-quantico text-left" style={{ color: currentPage === "home" && activeSection === "" ? "var(--nav-active-text)" : "var(--text-secondary)", fontSize: "1rem", fontWeight: currentPage === "home" && activeSection === "" ? "600" : "500", backgroundColor: currentPage === "home" && activeSection === "" ? "var(--nav-active-bg)" : "transparent", cursor: "pointer" }} whileTap={{ scale: 0.98 }}>Home</motion.button>

              <motion.button onClick={() => handleNavClick("About")} className="w-full px-5 py-3 rounded-lg transition-all duration-200 font-quantico text-left" style={{ color: currentPage === "about" ? "var(--nav-active-text)" : "var(--text-secondary)", fontSize: "1rem", fontWeight: currentPage === "about" ? "600" : "500", backgroundColor: currentPage === "about" ? "var(--nav-active-bg)" : "transparent", cursor: "pointer" }} whileTap={{ scale: 0.98 }}>About</motion.button>

              {homeNavItems.map((item) => (
                <motion.button key={item.label} onClick={() => handleNavClick(item.label, item.href)} className="w-full px-5 py-3 rounded-lg transition-all duration-200 font-quantico text-left" style={{ color: activeSection === item.label && currentPage === "home" ? "var(--nav-active-text)" : "var(--text-secondary)", fontSize: "1rem", fontWeight: activeSection === item.label && currentPage === "home" ? "600" : "500", backgroundColor: activeSection === item.label && currentPage === "home" ? "var(--nav-active-bg)" : "transparent", cursor: "pointer" }} whileTap={{ scale: 0.98 }}>{item.label}</motion.button>
              ))}

              <motion.button onClick={() => handleNavClick("Contributions")} className="w-full px-5 py-3 rounded-lg transition-all duration-200 font-quantico text-left" style={{ color: currentPage === "opensource" ? "var(--nav-active-text)" : "var(--text-secondary)", fontSize: "1rem", fontWeight: currentPage === "opensource" ? "600" : "500", backgroundColor: currentPage === "opensource" ? "var(--nav-active-bg)" : "transparent", cursor: "pointer" }} whileTap={{ scale: 0.98 }}>Contributions</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}