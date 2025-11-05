import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative z-10 border-t"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--background)",
      }}
    >
      <div className="px-4 sm:px-6 md:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full"
        >
          {/* Left - Copyright */}
          <p
            className="font-quantico"
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
            }}
          >
            © {currentYear} Harshita Phadtare. All rights
            reserved.
          </p>

          {/* Right - Developed By */}
          <p
            className="font-quantico"
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
            }}
          >
            Designed & Developed by{" "}
            <span
              style={{
                color: "var(--hero-title)",
                fontWeight: "600",
              }}
            >
              Harshita Phadtare
            </span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}