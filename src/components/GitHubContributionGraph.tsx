import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const DEFAULT_LOGIN = "harshitaphadtare";

interface ContributionDay {
  date: string;
  count: number;
  intensity: number;
}

interface CalendarCell {
  date: string | null;
  count: number;
  intensity: number;
  weekIndex: number;
  dayIndex: number;
}

interface GraphProps {
  onYearChange?: (year: number) => void;
}

export function GitHubContributionGraph({ onYearChange }: GraphProps) {
  const currentYear = new Date().getFullYear();
  const [view, setView] = useState<"rolling" | "year">("rolling");
  const [year, setYear] = useState<number>(currentYear);
  const [contributionMap, setContributionMap] = useState<Map<string, ContributionDay>>(new Map());
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = (import.meta as any).env?.VITE_GITHUB_TOKEN as string | undefined;
  // Visual sizing constants (keep month labels aligned with grid)
  const CELL_SIZE = 15; // px
  const CELL_GAP = 3;   // px
  const WEEK_STRIDE = CELL_SIZE + CELL_GAP; // horizontal stride per week column

  useEffect(() => {
    let cancelled = false;

    const applyMapAndTotal = (map: Map<string, ContributionDay>) => {
      setContributionMap(map);
      // Compute total for current window
      let total = 0;
      if (view === "year") {
        const yearStr = String(year);
        map.forEach((v) => { if (v.date.startsWith(yearStr)) total += v.count; });
      } else {
        const now = new Date();
        const from = new Date(now);
        from.setDate(from.getDate() - 365);
        const toISO = (d: Date) => d.toISOString().split("T")[0];
        const fromStr = toISO(from);
        const toStr = toISO(now);
        map.forEach((v) => { if (v.date >= fromStr && v.date <= toStr) total += v.count; });
      }
      setTotalContributions(total);
    };

    const fetchViaGraphQL = async () => {
      // Build range
      let from: string;
      let to: string;
      if (view === "year") {
        from = `${year}-01-01`;
        to = `${year}-12-31`;
      } else {
        const now = new Date();
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const start = new Date(end);
        start.setDate(start.getDate() - 365);
        const toISO = (d: Date) => d.toISOString().split("T")[0];
        from = toISO(start);
        to = toISO(end);
      }

      const query = `
        query($login: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                weeks {
                  contributionDays { date contributionCount }
                }
              }
            }
          }
        }
      `;
  const toDateTime = (d: string, endOfDay = false) => endOfDay ? `${d}T23:59:59Z` : `${d}T00:00:00Z`;
  const body = JSON.stringify({ query, variables: { login: DEFAULT_LOGIN, from: toDateTime(from, false), to: toDateTime(to, true) } });
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`GraphQL ${res.status}: ${text.slice(0, 120)}`);
      }
      const json = await res.json();
      const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
      const map = new Map<string, ContributionDay>();
      weeks.forEach((w: any) => {
        (w.contributionDays || []).forEach((d: any) => {
          const count = Number(d.contributionCount || 0);
          let intensity = 0;
          if (count === 0) intensity = 0;
          else if (count <= 3) intensity = 1;
          else if (count <= 6) intensity = 2;
          else if (count <= 9) intensity = 3;
          else intensity = 4;
          if (d.date) map.set(d.date, { date: d.date, count, intensity });
        });
      });
      applyMapAndTotal(map);
    };

    const fetchViaCalendarHtml = async () => {
      let from: string;
      let to: string;
      if (view === "year") {
        from = `${year}-01-01`;
        to = `${year}-12-31`;
      } else {
        const now = new Date();
        const start = new Date(now);
        start.setDate(start.getDate() - 365);
        const toISO = (d: Date) => d.toISOString().split("T")[0];
        from = toISO(start);
        to = toISO(now);
      }
      const direct = `https://github.com/users/${encodeURIComponent(DEFAULT_LOGIN)}/contributions?from=${from}&to=${to}`;

      const getText = async (): Promise<string> => {
        try {
          const r = await fetch(direct, { headers: { Accept: 'text/html' } });
          if (!r.ok) throw new Error(String(r.status));
          return await r.text();
        } catch {
          const proxied = `https://cors.isomorphic-git.org/${direct}`;
          const r2 = await fetch(proxied, { headers: { Accept: 'text/html' } });
          if (!r2.ok) throw new Error(`CORS ${r2.status}`);
          return await r2.text();
        }
      };

      const text = await getText();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const rects = Array.from(doc.querySelectorAll('rect[data-date]')) as HTMLElement[];
      const map = new Map<string, ContributionDay>();
      rects.forEach((el) => {
        const date = el.getAttribute('data-date') || '';
        const count = Number(el.getAttribute('data-count') || '0');
        let intensity = 0;
        if (count === 0) intensity = 0;
        else if (count <= 3) intensity = 1;
        else if (count <= 6) intensity = 2;
        else if (count <= 9) intensity = 3;
        else intensity = 4;
        if (date) map.set(date, { date, count, intensity });
      });
      applyMapAndTotal(map);
    };

    const run = async () => {
      try {
        setLoading(true); setError(null);
        // Prefer GraphQL if token is provided, fallback to HTML calendar
        if (token) {
          try {
            await fetchViaGraphQL();
          } catch (gqlErr) {
            // fallback to calendar if GraphQL fails
            await fetchViaCalendarHtml();
          }
        } else {
          await fetchViaCalendarHtml();
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? 'Failed to load contribution graph');
          setContributionMap(new Map());
          setTotalContributions(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [year, view]);

  // Build the calendar grid for a range (rolling or calendar year)
  const buildCalendarGrid = (): CalendarCell[][] => {
    // Use local date parts to avoid UTC shifting (which caused Dec/Jan overlap)
    const toLocalYMD = (d: Date) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
    let rangeStart: Date;
    let rangeEnd: Date;
    if (view === 'year') {
      rangeStart = new Date(year, 0, 1);
      rangeEnd = new Date(year, 11, 31);
    } else {
      const now = new Date();
      rangeEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      rangeStart = new Date(rangeEnd);
      rangeStart.setDate(rangeStart.getDate() - 365);
    }

    // Align to week boundaries (Sun..Sat)
    const gridStart = new Date(rangeStart);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());
    const gridEnd = new Date(rangeEnd);
    gridEnd.setDate(gridEnd.getDate() + (6 - gridEnd.getDay()));

    const grid: CalendarCell[][] = [];
    let cursor = new Date(gridStart);
    let weekIndex = 0;
    while (cursor <= gridEnd) {
      const week: CalendarCell[] = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const dateStr = toLocalYMD(cursor);
        const inRange = cursor >= rangeStart && cursor <= rangeEnd;
        if (inRange) {
          const contribution = contributionMap.get(dateStr);
          week.push({
            date: dateStr,
            count: contribution?.count || 0,
            intensity: contribution?.intensity || 0,
            weekIndex,
            dayIndex,
          });
        } else {
          week.push({ date: null, count: 0, intensity: 0, weekIndex, dayIndex });
        }
        cursor.setDate(cursor.getDate() + 1);
      }
      grid.push(week);
      weekIndex += 1;
    }
    return grid;
  };

  // Generate month labels with positions
  const getMonthLabels = () => {
    const labels: { month: string; weekIndex: number }[] = [];
    let currentMonth = -1;

    const grid = buildCalendarGrid();

    grid.forEach((week, weekIndex) => {
      const firstValidDay = week.find(cell => cell.date !== null);
      if (firstValidDay && firstValidDay.date) {
        const date = new Date(firstValidDay.date);
        const month = date.getMonth();

        if (month !== currentMonth) {
          currentMonth = month;
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          labels.push({
            month: monthNames[month],
            weekIndex,
          });
        }
      }
    });

    return labels;
  };

  const grid = buildCalendarGrid();
  const monthLabels = getMonthLabels();

  // Get intensity color
  const getColor = (intensity: number) => {
    if (intensity === 0) return "var(--contribution-0)";
    if (intensity === 1) return "var(--contribution-1)";
    if (intensity === 2) return "var(--contribution-2)";
    if (intensity === 3) return "var(--contribution-3)";
    return "var(--contribution-4)";
  };

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 mb-12 md:mb-16">
      {/* Card: title + graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
  className="rounded-2xl p-6 sm:p-7 md:p-8 w-full"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Header with Title and Stats */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h3
              className="mb-2 font-michroma"
              style={{
                fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
                fontWeight: "700",
                color: "var(--section-title)",
                letterSpacing: "-0.02em"
              }}
            >
              GitHub Contributions
            </h3>
            <p style={{ fontSize: "clamp(0.7rem, 2.2vw, 0.875rem)", color: "var(--text-secondary)", lineHeight: 1.4 }}>
              {loading ? "Loading..." : error ? "Failed to load" : view === 'year' ? `${totalContributions} contributions in ${year}` : `${totalContributions} contributions in the last year`}
            </p>
          </div>
        </div>

  {/* Graph area */}
  <div className="overflow-x-auto md:overflow-visible no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex" style={{ minWidth: "fit-content" }}>
            <div>
              {/* Month labels */}
              <div
                className="flex mb-1"
                style={{
                  position: "relative",
                  height: "20px",
                  // Ensure label row is as wide as the grid for correct absolute positioning
                  width: `${grid.length * WEEK_STRIDE - CELL_GAP}px`,
                }}
              >
                {monthLabels.map((label, index) => (
                  <div
                    key={`${label.month}-${index}`}
                    style={{
                      fontSize: "clamp(0.55rem, 1.6vw, 0.6875rem)",
                      color: "var(--text-secondary)",
                      fontWeight: "500",
                      position: "absolute",
                      left: `${label.weekIndex * WEEK_STRIDE}px`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label.month}
                  </div>
                ))}
              </div>

              {/* Contribution Grid */}
              <div className="flex gap-[3px]" style={{ paddingBottom: '4px' }}>
                {grid.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[3px]">
                    {week.map((cell, dayIndex) => (
                      <motion.div
                        key={`${weekIndex}-${dayIndex}`}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.2, delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                        whileHover={cell.date ? {
                          scale: 1.15,
                          zIndex: 10,
                        } : {}}
                        className=""
                        style={{
                          width: `${CELL_SIZE}px`,
                          height: `${CELL_SIZE}px`,
                          backgroundColor: cell.date ? getColor(cell.intensity) : "transparent",
                          border: cell.date ? "1px solid var(--border)" : "none",
                          borderRadius: "3px",
                          cursor: cell.date ? "pointer" : "default",
                        }}
                        title={cell.date ? `${cell.count} contributions on ${cell.date}` : ""}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2" style={{ marginTop: "10px", paddingTop: "4px" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginRight: "4px" }}>
                  Less
                </span>
                {[0, 1, 2, 3, 4].map((intensity) => (
                  <div
                    key={intensity}
                    className="rounded-sm"
                    style={{
                      width: `${Math.max(12, CELL_SIZE - 1)}px`,
                      height: `${Math.max(12, CELL_SIZE - 1)}px`,
                      backgroundColor: getColor(intensity),
                      border: "1px solid var(--border)"
                    }}
                  />
                ))}
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginLeft: "4px" }}>
                  More
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Years selector: horizontal on mobile, stacked on desktop with larger size */}
    <div className="years-selector flex gap-2 md:gap-3 mt-4 md:mt-0 md:ml-2 overflow-x-auto md:overflow-visible no-scrollbar pb-1 -mx-1 md:mx-0 px-1 md:px-0 w-full md:w-auto md:w-[90px] md:items-stretch" style={{ WebkitOverflowScrolling: 'touch' }}>
        {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
          <motion.button
            key={y}
            onClick={() => { setView('year'); setYear(y); onYearChange?.(y); }}
            className="year-chip px-3 py-2 md:px-3 md:py-3 rounded-xl font-quantico transition-all duration-200 shrink-0 w-auto md:w-full text-center"
            style={{
              // Use theme-specific card color for inactive (light: #FFFFFF, dark: #1A1F26); keep active as nav-active color
              backgroundColor: view === 'year' && y === year ? "var(--nav-active-bg)" : "var(--card)",
              color: view === 'year' && y === year ? "var(--nav-active-text)" : "var(--foreground)",
              border: "1px solid var(--border)",
              fontWeight: 700,
              lineHeight: 1.1
            }}
            aria-label={`Show contributions for ${y}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {y}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
