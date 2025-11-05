import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface ScrollToTopButtonProps {
  isDark: boolean;
}

export function ScrollToTopButton({ isDark }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled more than 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 z-50 p-3 rounded-full shadow-lg"
          style={{
            backgroundColor: "var(--cta-button-bg)",
            color: "var(--cta-button-text)",
            cursor: "pointer",
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: isDark
              ? "0 8px 24px rgba(147, 51, 234, 0.4)"
              : "0 8px 24px rgba(42, 21, 59, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
