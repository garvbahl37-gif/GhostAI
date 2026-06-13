"use client";

import { useEffect, useRef, useState } from "react";

export interface SwarmNode {
  id: string;
  color: string; // 7-char hex
  name?: string;
  role?: string;
  verdict?: string;
  intent?: number; // 0-100 purchase probability
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  color: string;
  node: SwarmNode;
  jitter: number;
}

function hashId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function intentOf(n: SwarmNode): number {
  if (typeof n.intent === "number") return n.intent;
  // unsimulated / decorative → hover near the "deciding" middle with a little spread
  return 44 + (hashId(n.id) % 13);
}

/**
 * A living "customer swarm". Each AI customer is a glowing node that flows to a
 * horizontal position by purchase intent (left = won't buy → right = will buy)
 * with node-node repulsion (a beeswarm) so the cloud spreads and the buying
 * distribution is readable at a glance. Pure canvas — fast, no Three.js.
 */
export function CustomerSwarm({
  nodes,
  height = 340,
  interactive = false,
  showAxis = false,
  className,
}: {
  nodes: SwarmNode[];
  height?: number;
  interactive?: boolean;
  showAxis?: boolean;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const partsRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const sizeRef = useRef({ w: 0, h: height });
  const [hover, setHover] = useState<{ node: SwarmNode; x: number; y: number } | null>(null);

  // Reconcile particles with the incoming node list (add/remove/update colour).
  useEffect(() => {
    const parts = partsRef.current;
    const { w, h } = sizeRef.current;
    for (let i = 0; i < nodes.length; i++) {
      if (parts[i]) {
        parts[i].color = nodes[i].color;
        parts[i].node = nodes[i];
      } else {
        parts[i] = {
          x: (w || 500) * (0.3 + Math.random() * 0.4),
          y: (h || height) * (0.3 + Math.random() * 0.4),
          vx: 0,
          vy: 0,
          r: 3 + Math.random() * 2.2,
          phase: Math.random() * Math.PI * 2,
          color: nodes[i].color,
          node: nodes[i],
          jitter: (hashId(nodes[i].id) % 100) / 100 - 0.5,
        };
      }
    }
    parts.length = nodes.length;
  }, [nodes, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const PAD = 46;

    const resize = () => {
      const w = wrap.clientWidth;
      sizeRef.current = { w, h: height };
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let t = 0;
    const tick = () => {
      const { w, h } = sizeRef.current;
      const cy = h / 2;
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      const parts = partsRef.current;
      const m = mouseRef.current;

      // targets + light forces
      for (const p of parts) {
        const tx = PAD + (intentOf(p.node) / 100) * (w - 2 * PAD);
        const ty = cy + p.jitter * h * 0.5;
        p.vx += (tx - p.x) * 0.02; // strong: hold the intent column
        p.vy += (ty - p.y) * 0.012; // softer vertical
        p.vx += (Math.random() - 0.5) * 0.05;
        p.vy += (Math.random() - 0.5) * 0.05;
        if (interactive && m.active) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 8000 && d2 > 1) {
            const f = (8000 - d2) / 8000;
            const d = Math.sqrt(d2);
            p.vx += (dx / d) * f * 0.8;
            p.vy += (dy / d) * f * 0.8;
          }
        }
      }

      // pairwise: repulsion (spread) + connection lines
      let lines = 0;
      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 784 && d2 > 0.5) {
            // repel within ~28px so nodes don't pile up
            const d = Math.sqrt(d2);
            const f = ((28 - d) / 28) * 0.7;
            const nx = dx / d;
            const ny = dy / d;
            a.vx += nx * f;
            a.vy += ny * f;
            b.vx -= nx * f;
            b.vy -= ny * f;
          }
          if (d2 < 4200 && lines < 460) {
            const alpha = (1 - d2 / 4200) * 0.16;
            ctx.strokeStyle = `rgba(148,163,184,${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            lines++;
          }
        }
      }

      // integrate + contain
      for (const p of parts) {
        p.vx *= 0.9;
        p.vy *= 0.9;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 1.6) {
          p.vx = (p.vx / sp) * 1.6;
          p.vy = (p.vy / sp) * 1.6;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < PAD) { p.x = PAD; p.vx *= -0.4; }
        if (p.x > w - PAD) { p.x = w - PAD; p.vx *= -0.4; }
        if (p.y < 18) { p.y = 18; p.vy *= -0.4; }
        if (p.y > h - 18) { p.y = h - 18; p.vy *= -0.4; }
      }

      // draw nodes
      for (const p of parts) {
        const pr = p.r + Math.sin(t * 2 + p.phase) * 0.7;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = pr * 2.8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pr, 0, Math.PI * 2);
        ctx.fill();
        // bright core
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, pr * 0.32, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, interactive]);

  function onMove(e: React.PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x, y, active: true };
    if (!interactive) return;
    let best: Particle | null = null;
    let bestD = 18 * 18;
    for (const p of partsRef.current) {
      const d = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    setHover(best ? { node: best.node, x: best.x, y: best.y } : null);
  }

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", height }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mouseRef.current.active = false;
        setHover(null);
      }}
    >
      {showAxis && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-2/5" style={{ background: "linear-gradient(90deg, rgba(251,113,133,0.07), transparent)" }} />
          <div className="absolute inset-y-0 right-0 w-2/5" style={{ background: "linear-gradient(270deg, rgba(52,211,153,0.08), transparent)" }} />
          <span className="absolute bottom-2 left-3 text-[10px] font-medium uppercase tracking-wider text-ghost-rose/70">Won&apos;t buy</span>
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider text-muted-foreground/60">purchase intent →</span>
          <span className="absolute bottom-2 right-3 text-[10px] font-medium uppercase tracking-wider text-ghost-emerald/80">Will buy</span>
        </div>
      )}
      <canvas ref={canvasRef} className="relative block" />
      {hover && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-xl border border-white/15 bg-[#0a0a16]/95 px-3 py-2 shadow-xl backdrop-blur"
          style={{ left: hover.x, top: hover.y - 12, minWidth: 150 }}
        >
          <p className="text-xs font-semibold text-white">{hover.node.name}</p>
          <p className="text-[11px] text-muted-foreground">{hover.node.role}</p>
          {hover.node.verdict && (
            <p className="mt-0.5 text-[11px] font-medium" style={{ color: hover.node.color }}>
              {hover.node.verdict}
              {typeof hover.node.intent === "number" ? ` · ${hover.node.intent}% intent` : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
