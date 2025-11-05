import { motion } from "framer-motion";
import { useState } from "react";
import { Star, GitMerge, AlertCircle } from "lucide-react";
import { GitHubContributionGraph } from "../components/GitHubContributionGraph";
import data from "../assets/info.json";

interface Contribution {
  id: number;
  repo: string;
  stars: number;
  title: string;
  description: string;
  status: "merged" | "open";
  language: string;
  languageColor: string;
  additions: number;
  deletions: number;
  files: number;
  createdDate: string;
  mergedDate?: string;
  repoUrl: string;
  prUrl: string;
}

const contributions: Contribution[] = data.contributions as Contribution[];

export function OpenSourcePage() {
  const [filter, setFilter] = useState<
    "all" | "merged" | "open"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "stars">(
    "date",
  );

  const filteredContributions = contributions
    .filter((c) => filter === "all" || c.status === filter)
    .sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.createdDate).getTime() -
          new Date(a.createdDate).getTime()
        );
      }
      return b.stars - a.stars;
    });

  const mergedCount = contributions.filter(
    (c) => c.status === "merged",
  ).length;
  const openCount = contributions.filter(
    (c) => c.status === "open",
  ).length;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* GitHub Contributions Graph */}
        <GitHubContributionGraph />

        {/* Filter and Sort Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          {/* Filter Tabs */}
          <div
            className="flex items-center gap-2 p-1 rounded-full"
            style={{
              backgroundColor: "rgba(42, 21, 59, 0.05)",
            }}
          >
            {[
              {
                label: "All",
                value: "all" as const,
                count: contributions.length,
              },
              {
                label: "Merged",
                value: "merged" as const,
                count: mergedCount,
              },
              {
                label: "Open",
                value: "open" as const,
                count: openCount,
              },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className="px-4 py-2 rounded-full transition-all duration-200"
                style={{
                  fontSize: "0.9375rem",
                  fontWeight:
                    filter === tab.value ? "600" : "500",
                  color:
                    filter === tab.value
                      ? "var(--nav-active-text)"
                      : "var(--text-primary)",
                  backgroundColor:
                    filter === tab.value
                      ? "var(--nav-active-bg)"
                      : "transparent",
                  cursor: "pointer",
                }}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "date" | "stars")
            }
            className="px-4 py-2 rounded-lg border outline-none cursor-pointer"
            style={{
              fontSize: "0.9375rem",
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <option value="date">Sort by: Date Created</option>
            <option value="stars">Sort by: Stars</option>
          </select>
        </motion.div>

        {/* Contributions List */}
        <div className="space-y-6">
          {filteredContributions.map((contribution, index) => (
            <motion.a
              key={contribution.id}
              href={contribution.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.4 + index * 0.1,
              }}
              whileHover={{ scale: 1.01 }}
              className="block p-6 rounded-2xl transition-all duration-200"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              }}
            >
              {/* Repo Line */}
              <div className="flex items-center gap-2 mb-2">
                <a
                  href={contribution.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity duration-200 hover:opacity-70"
                  style={{
                    fontSize: "1rem",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {contribution.repo}
                </a>
                <Star
                  className="w-4 h-4"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {contribution.stars.toLocaleString()}
                </span>
              </div>

              {/* PR Title */}
              <h3
                className="mb-2"
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "var(--foreground)",
                }}
              >
                {contribution.title}
              </h3>

              {/* Description */}
              <p
                className="mb-4 line-clamp-2"
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--muted-foreground)",
                  lineHeight: "1.6",
                }}
              >
                {contribution.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {/* Status Badge */}
                <span
                  className="px-3 py-1 rounded-full flex items-center gap-1.5"
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: "600",
                    backgroundColor:
                      contribution.status === "merged"
                        ? "rgba(34, 197, 94, 0.1)"
                        : "rgba(147, 51, 234, 0.1)",
                    color:
                      contribution.status === "merged"
                        ? "#22c55e"
                        : "#9333ea",
                  }}
                >
                  {contribution.status === "merged" ? (
                    <GitMerge className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {contribution.status === "merged"
                    ? "Merged"
                    : "Open"}
                </span>

                {/* Language */}
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        contribution.languageColor,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--foreground)",
                    }}
                  >
                    {contribution.language}
                  </span>
                </div>

                {/* Diff Stats */}
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--addition-color)",
                  }}
                >
                  +{contribution.additions}
                </span>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--deletion-color)",
                  }}
                >
                  -{contribution.deletions}
                </span>

                {/* Files */}
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {contribution.files} files
                </span>
              </div>

              {/* Date Line */}
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--muted-foreground)",
                }}
              >
                Created {contribution.createdDate}
                {contribution.mergedDate &&
                  ` • Merged ${contribution.mergedDate}`}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}