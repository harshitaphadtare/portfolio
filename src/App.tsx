import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion } from "framer-motion";
import { Cursor, Nav } from "./components/Chrome";
import { Home } from "./pages/Home";
import { CaseStudy } from "./pages/CaseStudy";
import { RouterProvider, useRouter } from "./lib/router";
import { profile, projects } from "./content";

function Routes() {
  const { path } = useRouter();
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ lerp: 0.1 });
    lenis.current = l;
    let raf = 0;
    const loop = (t: number) => {
      l.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      l.destroy();
    };
  }, []);

  // Smooth-scroll to an in-page anchor, waiting for it to mount after a route change.
  useEffect(() => {
    const scrollTo = (id: string, tries = 0) => {
      const el = document.getElementById(id);
      if (!el) {
        if (tries < 40) setTimeout(() => scrollTo(id, tries + 1), 50);
        return;
      }
      if (lenis.current) lenis.current.scrollTo(el, { offset: -20, duration: 1.4 });
      else el.scrollIntoView();
    };
    const onScrollTo = (e: Event) => scrollTo((e as CustomEvent<string>).detail);
    window.addEventListener("scroll-to", onScrollTo);
    if (window.location.hash) scrollTo(window.location.hash.slice(1));
    return () => window.removeEventListener("scroll-to", onScrollTo);
  }, []);

  const match = path.match(/^\/work\/([^/]+)/);
  const project = match ? projects.find((p) => p.id === match[1]) : undefined;

  const resetScroll = () => {
    if (window.location.hash) return;
    lenis.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    document.title = project ? `${project.title} · ${profile.name}` : `${profile.name} · ${profile.role}`;
  }, [path]);

  return (
    <AnimatePresence mode="wait" onExitComplete={resetScroll}>
      <motion.div
        key={project?.id ?? "home"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        {project ? <CaseStudy project={project} /> : <Home />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Nav />
      <Routes />
    </RouterProvider>
  );
}
