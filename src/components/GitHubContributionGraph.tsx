import { motion } from "framer-motion";

export function GitHubContributionGraph() {
  // Generate contribution data for the last year (52 weeks * 7 days)
  const generateContributions = () => {
    const contributions = [];
    for (let week = 0; week < 52; week++) {
      for (let day = 0; day < 7; day++) {
        // Random intensity from 0-4
        const intensity = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0;
        contributions.push({ week, day, intensity });
      }
    }
    return contributions;
  };

  const contributions = generateContributions();
  const totalContributions = contributions.reduce((acc, c) => acc + c.intensity * 3, 0);

  // Month labels
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Get intensity color - CSS variables for theme support
  const getColor = (intensity: number) => {
    if (intensity === 0) return "var(--contribution-0)";
    if (intensity === 1) return "var(--contribution-1)";
    if (intensity === 2) return "var(--contribution-2)";
    if (intensity === 3) return "var(--contribution-3)";
    return "var(--contribution-4)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="rounded-2xl p-6 sm:p-8 mb-16"
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Header with Title and Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3
            className="mb-2 font-michroma"
            style={{
              fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
              fontWeight: "700",
              color: "var(--section-title)",
              letterSpacing: "-0.02em",
            }}
          >
            GitHub Contributions
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
            }}
          >
            {totalContributions} contributions in the last year
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2">
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              marginRight: "4px",
            }}
          >
            Less
          </span>
          {[0, 1, 2, 3, 4].map((intensity) => (
            <motion.div
              key={intensity}
              className="rounded-sm"
              style={{
                width: "14px",
                height: "14px",
                backgroundColor: getColor(intensity),
                border: "1px solid var(--border)",
              }}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
            />
          ))}
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              marginLeft: "4px",
            }}
          >
            More
          </span>
        </div>
      </div>

      <div className="flex overflow-x-auto" style={{ width: "fit-content", maxWidth: "100%" }}>
        {/* Day labels */}
        <div className="flex flex-col gap-[13px]" style={{ marginTop: "22px", paddingRight: "8px" }}>
          {["Mon", "Wed", "Fri"].map((day, i) => (
            <div
              key={day}
              style={{
                fontSize: "0.6875rem",
                color: "var(--text-secondary)",
                width: "24px",
                textAlign: "right",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Contribution Grid Container */}
        <div style={{ width: "fit-content" }}>
          {/* Month labels */}
          <div className="flex gap-[14px] mb-2">
            {months.map((month, i) => (
              <div
                key={month}
                style={{
                  fontSize: "0.6875rem",
                  color: "var(--text-secondary)",
                  minWidth: "32px",
                  textAlign: "left",
                  fontWeight: "500",
                }}
              >
                {month}
              </div>
            ))}
          </div>

          {/* Contribution Grid */}
          <div
            className="inline-grid gap-[3px]"
            style={{
              gridTemplateRows: "repeat(7, 1fr)",
              gridAutoFlow: "column",
              paddingBottom: "8px",
            }}
          >
            {contributions.map((contribution, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: i * 0.0008 }}
                whileHover={{ 
                  scale: 1.3,
                  zIndex: 10,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
                className="rounded-[3px] cursor-pointer"
                style={{
                  width: "13px",
                  height: "13px",
                  backgroundColor: getColor(contribution.intensity),
                  border: "1px solid var(--border)",
                }}
                title={`${contribution.intensity * 3} contributions`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
