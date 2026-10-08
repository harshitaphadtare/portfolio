import { useEffect, useRef, useState } from "react";
import { Link } from "../lib/router";
import { profile } from "../content";

/** Accent dot that trails the pointer, grows over links and shows a label over [data-cursor]. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<"" | "is-link" | "is-label">("");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const pos = { x: -100, y: -100 };
    const cur = { x: -100, y: -100 };
    let raf = 0;
    const tick = () => {
      cur.x += (pos.x - cur.x) * 0.22;
      cur.y += (pos.y - cur.y) * 0.22;
      if (ref.current) ref.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        setMode("is-label");
        setLabel(labelled.dataset.cursor || "");
      } else if (t.closest("a, button")) {
        setMode("is-link");
      } else {
        setMode("");
      }
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} className={`cursor ${mode}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}

function useMelbourneTime() {
  const fmt = () =>
    new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Melbourne",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 10_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    return "dark";
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);
  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))] as const;
}

export function Nav() {
  const time = useMelbourneTime();
  const [theme, toggle] = useTheme();
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 200);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`nav${hidden ? " is-hidden" : ""}`}>
      <Link to="/" className="nav__logo" aria-label="Home">
        Harshita Phadtare<sup>©</sup>
      </Link>
      <div className="nav__clock mono">
        <span className="nav__dot" />
        <span>Melbourne {time}</span>
      </div>
      <nav className="nav__links mono">
        <Link to="/#work" className="hide-sm">Work</Link>
        <Link to="/#about" className="hide-sm">About</Link>
        <Link to="/#experience" className="hide-sm">Experience</Link>
        <Link to="/#contact">Contact</Link>
        <button onClick={toggle} aria-label="Toggle colour theme">
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </nav>
    </header>
  );
}

export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <button className="email-btn" onClick={copy} data-cursor={copied ? "Copied" : "Copy"}>
      {profile.email}
      <span className="mono">{copied ? "copied ✓" : "copy"}</span>
    </button>
  );
}
