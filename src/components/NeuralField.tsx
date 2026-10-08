import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number; heat: number };
type Pulse = { x: number; y: number; t: number };

/**
 * A drifting graph of nodes. Nodes near the cursor "attend" to it: they light up,
 * get pulled slightly and draw connections. Clicking fires a pulse that ripples outward.
 */
export function NeuralField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    const pulses: Pulse[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let fg = "238,235,228";
    let accent = "255,90,42";
    let raf = 0;
    let visible = true;

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      const toRgb = (hex: string) => {
        const m = hex.trim().replace("#", "");
        const n = parseInt(m.length === 3 ? m.replace(/./g, "$&$&") : m, 16);
        return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
      };
      fg = toRgb(cs.getPropertyValue("--fg"));
      accent = toRgb(cs.getPropertyValue("--accent"));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(130, (w * h) / 11000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6,
        heat: 0,
      }));
    };

    const LINK = 120;
    const REACH = 190;

    const frame = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of pulses) p.t += 6;
      while (pulses.length && pulses[0].t > Math.max(w, h)) pulses.shift();

      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
        let target = 0;
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < REACH) {
            target = 1 - d / REACH;
            if (!reduced) {
              n.x += dx * 0.004 * target;
              n.y += dy * 0.004 * target;
            }
          }
        }
        for (const p of pulses) {
          const d = Math.hypot(p.x - n.x, p.y - n.y);
          if (Math.abs(d - p.t) < 28) target = Math.max(target, 1);
        }
        n.heat += (target - n.heat) * 0.12;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const fade = 1 - Math.sqrt(d2) / LINK;
          const heat = Math.min(a.heat, b.heat);
          ctx.strokeStyle = heat > 0.05 ? `rgba(${accent},${fade * heat * 0.9})` : `rgba(${fg},${fade * 0.08})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      if (mouse.active) {
        for (const n of nodes) {
          if (n.heat < 0.35) continue;
          ctx.strokeStyle = `rgba(${accent},${n.heat * 0.35})`;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = n.heat > 0.05 ? `rgba(${accent},${0.4 + n.heat * 0.6})` : `rgba(${fg},0.35)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + n.heat * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced && visible) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.y >= 0 && mouse.y <= rect.height;
      if (reduced) frame();
    };
    const onLeave = () => (mouse.active = false);
    const onDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const y = e.clientY - rect.top;
      if (y < 0 || y > rect.height) return;
      pulses.push({ x: e.clientX - rect.left, y, t: 0 });
    };

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was && !reduced) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    const themeObs = new MutationObserver(() => {
      readColors();
      if (reduced) frame();
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    readColors();
    resize();
    frame();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      themeObs.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
