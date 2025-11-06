import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Star, GitMerge, AlertCircle } from "lucide-react";
import { GitHubContributionGraph } from "../components/GitHubContributionGraph";

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

const DEFAULT_LOGIN = "harshitaphadtare";

export function OpenSourcePage() {
  const currentYear = new Date().getFullYear();
  const token = (import.meta as any).env?.VITE_GITHUB_TOKEN as string | undefined;
  const [filter, setFilter] = useState<
    "all" | "merged" | "open"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "stars">(
    "date",
  );

  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"rolling" | "year">("rolling");
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  // Pagination state (1-based)
  const [page, setPage] = useState<number>(1);
  const PAGE_SIZE = 10;

  // Client-only fetch (static hosting friendly)
  useEffect(() => {
    let cancelled = false;

    const fmtDate = (iso?: string | null) => {
      if (!iso) return undefined;
      try {
        const d = new Date(iso);
        const fmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        // Format like "Jun 5, 2024"
        return fmt.format(d);
      } catch {
        return iso ?? undefined;
      }
    };

    const fetchViaGitHub = async () => {
      try {
        setLoading(true);
        setError(null);
        const now = new Date();
        let fromStr: string;
        let toStr: string;
        if (view === "year") {
          fromStr = `${selectedYear}-01-01`;
          toStr = `${selectedYear}-12-31`;
        } else {
          const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const start = new Date(end);
          start.setDate(start.getDate() - 365);
          const toISO = (d: Date) => d.toISOString().split("T")[0];
          fromStr = toISO(start);
          toStr = toISO(end);
        }
        // Prefer GraphQL (complete fields). Fallback to REST if no token.
        if (token) {
          const gql = `
            query($q: String!, $first: Int!) {
              search(query: $q, type: ISSUE, first: $first) {
                nodes {
                  ... on PullRequest {
                    title
                    body
                    state
                    url
                    createdAt
                    mergedAt
                    additions
                    deletions
                    changedFiles
                    repository {
                      name
                      nameWithOwner
                      url
                      description
                      stargazerCount
                      primaryLanguage { name color }
                    }
                  }
                }
              }
            }
          `;
          const q = `is:pr author:${DEFAULT_LOGIN} created:${fromStr}..${toStr} is:public`;
          const resp = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ query: gql, variables: { q, first: 50 } })
          });
          if (resp.ok) {
            const j = await resp.json();
            const nodes = (j?.data?.search?.nodes || []).filter((n: any) => n && n.url);
            const mapped: Contribution[] = nodes.map((n: any, idx: number) => ({
              id: idx + 1,
              repo: n.repository?.name || '',
              stars: n.repository?.stargazerCount ?? 0,
              title: n.title,
              // Prefer PR body; fallback to repo description
              description: (n.body?.trim?.() || n.repository?.description || ''),
              status: n.state?.toLowerCase() === 'open' ? 'open' : 'merged',
              language: n.repository?.primaryLanguage?.name ?? '—',
              languageColor: n.repository?.primaryLanguage?.color ?? '#9ca3af',
              additions: n.additions ?? 0,
              deletions: n.deletions ?? 0,
              files: n.changedFiles ?? 0,
              createdDate: fmtDate(n.createdAt)!,
              mergedDate: fmtDate(n.mergedAt) as string | undefined,
              repoUrl: n.repository?.url ?? '',
              prUrl: n.url,
            }));
            if (!cancelled) { setContributions(mapped); return; }
          }
        }
        // REST search path (limited fields). We'll keep placeholders where data isn't available without extra calls.
        const qPrimary = `is:pr+author:${DEFAULT_LOGIN}+created:${fromStr}..${toStr}+is:public`;
        const headers: Record<string, string> = { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
        const urlPrimary = `https://api.github.com/search/issues?q=${encodeURIComponent(qPrimary)}&sort=created&order=desc&per_page=30`;
        let res = await fetch(urlPrimary, { headers });
        if (!res.ok) {
          // Retry with a simpler query if GitHub returns 422 (validation error)
          if (res.status === 422 || res.status === 400) {
            const qFallback = `is:pr+involves:${DEFAULT_LOGIN}+created:${fromStr}..${toStr}+is:public`;
            const urlFallback = `https://api.github.com/search/issues?q=${encodeURIComponent(qFallback)}&sort=created&order=desc&per_page=30`;
            res = await fetch(urlFallback, { headers });
          }
        }
        if (res.ok) {
          const data = await res.json();
          const items = (data.items || []) as any[];
          const mapped: Contribution[] = items.map((it, idx) => {
            const repoApi = it.repository_url || '';
            const repoUrl = repoApi.replace("api.github.com/repos", "github.com");
            const repoName = repoApi.split("/").pop() || '';
            return {
              id: idx + 1,
              repo: repoName,
              stars: 0,
              title: it.title,
              // Search API includes `body`; use it
              description: (it.body || ''),
              status: it.state === "open" ? "open" : "merged",
              language: "—",
              languageColor: "#9ca3af",
              additions: 0,
              deletions: 0,
              files: 0,
              createdDate: fmtDate(it.created_at)!,
              mergedDate: undefined,
              repoUrl,
              prUrl: it.html_url,
            } as Contribution;
          });
          if (!cancelled) { setContributions(mapped); return; }
        }

        // Final fallback: use events API to capture recent PRs
        const eventsUrl = `https://api.github.com/users/${DEFAULT_LOGIN}/events/public`;
        const evRes = await fetch(eventsUrl, { headers });
        if (evRes.ok) {
          const events = await evRes.json();
          const prs: Contribution[] = [];
          const toTime = new Date(toStr).getTime();
          const fromTime = new Date(fromStr).getTime();
          for (const e of events as any[]) {
            if (e?.type === 'PullRequestEvent' && e?.payload?.pull_request) {
              const pr = e.payload.pull_request;
              const t = new Date(pr.created_at).getTime();
              if (t >= fromTime && t <= toTime) {
                prs.push({
                  id: prs.length + 1,
                  repo: pr.base?.repo?.full_name || pr.head?.repo?.full_name || '',
                  stars: 0,
                  title: pr.title,
                  description: pr.body || '',
                  status: pr.merged_at ? 'merged' : (pr.state === 'open' ? 'open' : 'merged'),
                  language: '—',
                  languageColor: '#9ca3af',
                  additions: pr.additions ?? 0,
                  deletions: pr.deletions ?? 0,
                  files: pr.changed_files ?? 0,
                  createdDate: pr.created_at,
                  mergedDate: pr.merged_at ?? undefined,
                  repoUrl: pr.base?.repo?.html_url || '',
                  prUrl: pr.html_url,
                });
              }
            }
          }
          if (!cancelled) { setContributions(prs); return; }
        }

        // If everything failed
        throw new Error('GitHub API 422');
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load contributions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchViaGitHub();
    const id = setInterval(fetchViaGitHub, 2 * 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, [view, selectedYear]);

  // Reset to first page whenever filters that change the list root change
  useEffect(() => {
    setPage(1);
  }, [filter, sortBy, view, selectedYear]);

  const filteredContributions = useMemo(() => (contributions ?? [])
    .filter((c) => filter === "all" || c.status === filter)
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      }
      return b.stars - a.stars;
    }), [contributions, filter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredContributions.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const paginatedContributions = filteredContributions.slice(startIdx, endIdx);

  const mergedCount = (contributions ?? []).filter((c) => c.status === "merged").length;
  const openCount = (contributions ?? []).filter((c) => c.status === "open").length;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
  {/* GitHub Contributions Graph */}
  <GitHubContributionGraph onYearChange={(y) => { setView("year"); setSelectedYear(y); }} />

        {/* Filter and Sort Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          {/* Filter Tabs */}
          <div
            className="flex items-center gap-1 sm:gap-2 p-1 rounded-full overflow-x-auto"
            style={{
              backgroundColor: "rgba(42, 21, 59, 0.05)",
              WebkitOverflowScrolling: 'touch'
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
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 whitespace-nowrap"
                style={{
                  fontSize: "clamp(0.7rem, 2.2vw, 0.9375rem)",
                  fontWeight: filter === tab.value ? "600" : "500",
                  color: filter === tab.value ? "var(--nav-active-text)" : "var(--text-primary)",
                  backgroundColor: filter === tab.value ? "var(--nav-active-bg)" : "transparent",
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
            onChange={(e) => setSortBy(e.target.value as "date" | "stars")}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border outline-none cursor-pointer"
            style={{
              fontSize: "clamp(0.7rem, 2vw, 0.9375rem)",
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
        {error && (
          <div className="mb-4 text-red-400 text-sm">{error}</div>
        )}
        {loading && contributions.length === 0 && (
          <div className="mb-6 text-sm" style={{color: 'var(--muted-foreground)'}}>Loading latest contributions…</div>
        )}
        <div className="space-y-6">
          {paginatedContributions.map((contribution, index) => (
            <motion.div
              key={contribution.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                // Stagger only within current page
                delay: 0.4 + index * 0.06,
              }}
              whileHover={{ scale: 1.01 }}
              role="link"
              tabIndex={0}
              onClick={() => window.open(contribution.prUrl, '_blank', 'noopener,noreferrer')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open(contribution.prUrl, '_blank', 'noopener,noreferrer'); } }}
              className="block p-6 rounded-2xl transition-all duration-200 cursor-pointer"
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
                    fontSize: "clamp(0.9rem, 2.4vw, 1rem)",
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
                  fontSize: "clamp(1rem, 2.6vw, 1.125rem)",
                  fontWeight: "600",
                  color: "var(--foreground)",
                  lineHeight: '1.35'
                }}
              >
                {contribution.title}
              </h3>

              {/* Description */}
              <p
                className="mb-4 line-clamp-2"
                style={{
                  fontSize: "clamp(0.8rem, 2.2vw, 0.9375rem)",
                  color: "var(--muted-foreground)",
                  lineHeight: "1.55",
                }}
              >
                {contribution.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {/* Status Badge */}
                <span
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5"
                  style={{
                    fontSize: "clamp(0.68rem, 1.9vw, 0.8125rem)",
                    fontWeight: "600",
                    backgroundColor: contribution.status === "merged" ? "rgba(34, 197, 94, 0.1)" : "rgba(147, 51, 234, 0.1)",
                    color: contribution.status === "merged" ? "#22c55e" : "#9333ea",
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
                      fontSize: "clamp(0.68rem, 2vw, 0.875rem)",
                      color: "var(--foreground)",
                    }}
                  >
                    {contribution.language}
                  </span>
                </div>

                {/* Diff Stats */}
                <span
                  style={{
                    fontSize: "clamp(0.68rem, 2vw, 0.875rem)",
                    color: "var(--addition-color)",
                  }}
                >
                  +{contribution.additions}
                </span>
                <span
                  style={{
                    fontSize: "clamp(0.68rem, 2vw, 0.875rem)",
                    color: "var(--deletion-color)",
                  }}
                >
                  -{contribution.deletions}
                </span>
                <span
                  style={{
                    fontSize: "clamp(0.68rem, 2vw, 0.875rem)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {contribution.files} files
                </span>
              </div>

              {/* Date Line */}
              <div
                style={{
                  fontSize: "clamp(0.7rem, 1.8vw, 0.8125rem)",
                  color: "var(--muted-foreground)",
                }}
              >
                Created {contribution.createdDate}
                {contribution.mergedDate &&
                  ` • Merged ${contribution.mergedDate}`}
              </div>
            </motion.div>
          ))}
        </div>
        {filteredContributions.length === 0 && !loading && !error && (
          <div className="mt-6 text-sm" style={{color: 'var(--muted-foreground)'}}>No pull requests found for the selected criteria.</div>
        )}
        {totalPages > 1 && (
          <div className="mt-10 pt-6 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 sm:px-5 py-2 rounded-md font-medium border disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  fontSize: 'clamp(0.7rem, 1.8vw, 0.8125rem)',
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
                aria-label="Previous page"
              >Prev</button>
              {/* Page number buttons (show up to 7 with ellipsis) */}
              {(() => {
                const buttons: JSX.Element[] = [];
                const maxButtons = 7;
                const addBtn = (p: number, label?: string) => buttons.push(
                  <button
                    key={`page-${p}-${label??''}`}
                    onClick={() => setPage(p)}
                    disabled={p === currentPage}
                    className={`px-4 sm:px-5 py-2 rounded-md font-medium border ${p === currentPage ? 'cursor-default' : ''}`}
                    style={{
                      fontSize: 'clamp(0.7rem, 1.8vw, 0.8125rem)',
                      backgroundColor: p === currentPage ? 'var(--nav-active-bg)' : 'var(--card)',
                      borderColor: 'var(--border)',
                      color: p === currentPage ? 'var(--nav-active-text)' : 'var(--foreground)'
                    }}
                    aria-current={p === currentPage ? 'page' : undefined}
                  >{label ?? p}</button>
                );
                if (totalPages <= maxButtons) {
                  for (let i = 1; i <= totalPages; i++) addBtn(i);
                } else {
                  const showRange = (from: number, to: number) => { for (let i = from; i <= to; i++) addBtn(i); };
                  const left = Math.max(2, currentPage - 1);
                  const right = Math.min(totalPages - 1, currentPage + 1);
                  addBtn(1);
                  if (left > 2) addBtn(left - 1, '…');
                  showRange(left, right);
                  if (right < totalPages - 1) addBtn(right + 1, '…');
                  addBtn(totalPages);
                }
                return buttons;
              })()}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 sm:px-5 py-2 rounded-md font-medium border disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  fontSize: 'clamp(0.7rem, 1.8vw, 0.8125rem)',
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
                aria-label="Next page"
              >Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}