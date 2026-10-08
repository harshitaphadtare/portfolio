import { createContext, useContext, useEffect, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";

type Router = { path: string; go: (to: string) => void };

const RouterContext = createContext<Router>({ path: "/", go: () => {} });

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const go = (to: string) => {
    const [pathname, hash] = to.split("#");
    if (pathname && pathname !== window.location.pathname) {
      window.history.pushState({}, "", to);
      setPath(pathname);
    } else if (hash) {
      window.history.replaceState({}, "", to);
    }
    if (hash) window.dispatchEvent(new CustomEvent("scroll-to", { detail: hash }));
  };

  return <RouterContext.Provider value={{ path, go }}>{children}</RouterContext.Provider>;
}

export const useRouter = () => useContext(RouterContext);

export function Link({ to, children, ...rest }: { to: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { go } = useRouter();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go(to);
  };
  return (
    <a href={to} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
