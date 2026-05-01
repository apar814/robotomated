"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

interface DataColumn {
  x: number;
  chars: string[];
  y: number;
  speed: number;
  nextSwap: number;
  swapInterval: number;
  length: number;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ACCENT = "#D4D4D4";
const NODE_COUNT_MIN = 50;
const NODE_COUNT_MAX = 80;
const CONNECT_DISTANCE = 120;
const CONNECT_MAX_OPACITY = 0.3;
const REPEL_DISTANCE = 100;
const REPEL_STRENGTH = 0.6;
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

const DATA_STREAM_CHARS = "0 1 A B C D E F \u25A0 \u25B2 \u25CF \u2588 \u25C6 \u2B22".split(" ");
const COLUMN_COUNT_MIN = 5;
const COLUMN_COUNT_MAX = 8;
const COLUMN_FONT_SIZE = 10;
const COLUMN_WIDTH = 14;
const COLUMN_CHAR_HEIGHT = 14;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isDarkMode(): boolean {
  if (typeof window === "undefined") return true;
  // Check data-theme attribute first, then media query
  const html = document.documentElement;
  const theme = html.getAttribute("data-theme");
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/* ------------------------------------------------------------------ */
/*  Node factory                                                       */
/* ------------------------------------------------------------------ */

function createNodes(width: number, height: number): Node[] {
  const count = randomInt(NODE_COUNT_MIN, NODE_COUNT_MAX);
  const nodes: Node[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: randomBetween(-0.3, 0.3),
      vy: randomBetween(-0.3, 0.3),
      radius: randomBetween(2, 6),
      opacity: randomBetween(0.2, 0.6),
    });
  }
  return nodes;
}

/* ------------------------------------------------------------------ */
/*  Data stream column factory                                         */
/* ------------------------------------------------------------------ */

function createColumns(width: number, height: number): DataColumn[] {
  const count = randomInt(COLUMN_COUNT_MIN, COLUMN_COUNT_MAX);
  const columns: DataColumn[] = [];
  // Scatter across the right 60% of the screen
  const startX = width * 0.4;
  const availableWidth = width * 0.6;

  for (let i = 0; i < count; i++) {
    const colLength = randomInt(8, 24);
    const chars: string[] = [];
    for (let j = 0; j < colLength; j++) {
      chars.push(pickRandom(DATA_STREAM_CHARS));
    }
    columns.push({
      x: startX + Math.random() * availableWidth,
      chars,
      y: -Math.random() * height, // start at varying positions above viewport
      speed: randomBetween(0.3, 0.8),
      nextSwap: Date.now() + randomBetween(80, 120),
      swapInterval: randomBetween(80, 120),
      length: colLength,
    });
  }
  return columns;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function HeroBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const columnsRef = useRef<DataColumn[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const [dark, setDark] = useState(true);

  // Detect color scheme
  useEffect(() => {
    setDark(isDarkMode());

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setDark(isDarkMode());
    mq.addEventListener("change", onChange);

    // Also observe data-theme attribute changes
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      mq.removeEventListener("change", onChange);
      observer.disconnect();
    };
  }, []);

  const opacityScale = dark ? 1 : 0.3;

  /* ---- Canvas animation loop ------------------------------------ */

  const animate = useCallback(
    (timestamp: number) => {
      rafRef.current = requestAnimationFrame(animate);

      // Throttle to ~30fps
      if (timestamp - lastFrameRef.current < FRAME_INTERVAL) return;
      lastFrameRef.current = timestamp;

      // Pause when tab hidden
      if (document.hidden) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const columns = columnsRef.current;
      const mouse = mouseRef.current;
      const now = Date.now();

      /* -- Layer 2: Floating nodes + connections ------------------- */

      // Update node positions
      for (const node of nodes) {
        // Mouse repulsion
        if (mouse) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPEL_DISTANCE && dist > 0) {
            const force = (1 - dist / REPEL_DISTANCE) * REPEL_STRENGTH;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }
        }

        // Apply velocity with damping
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Wrap around edges
        if (node.x < -10) node.x = width + 10;
        if (node.x > width + 10) node.x = -10;
        if (node.y < -10) node.y = height + 10;
        if (node.y > height + 10) node.y = -10;
      }

      // Draw connections
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DISTANCE) {
            const alpha =
              (1 - dist / CONNECT_DISTANCE) * CONNECT_MAX_OPACITY * opacityScale;
            ctx.strokeStyle = `rgba(212,212,212,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,212,212,${node.opacity * opacityScale})`;
        ctx.fill();
      }

      /* -- Layer 3: Data streams ----------------------------------- */

      ctx.font = `${COLUMN_FONT_SIZE}px monospace`;
      ctx.textAlign = "center";

      for (const col of columns) {
        // Move column downward
        col.y += col.speed;

        // Reset when entire column scrolled past bottom
        if (col.y > height + col.length * COLUMN_CHAR_HEIGHT) {
          col.y = -(col.length * COLUMN_CHAR_HEIGHT) - Math.random() * height * 0.5;
        }

        // Swap random characters periodically
        if (now > col.nextSwap) {
          const idx = randomInt(0, col.chars.length - 1);
          col.chars[idx] = pickRandom(DATA_STREAM_CHARS);
          col.nextSwap = now + col.swapInterval;
        }

        // Draw characters
        for (let i = 0; i < col.chars.length; i++) {
          const charY = col.y + i * COLUMN_CHAR_HEIGHT;
          // Skip off-screen characters
          if (charY < -COLUMN_CHAR_HEIGHT || charY > height + COLUMN_CHAR_HEIGHT) {
            continue;
          }

          // Fade at top and bottom of viewport
          const fadeTop = Math.min(1, Math.max(0, charY / (height * 0.15)));
          const fadeBottom = Math.min(
            1,
            Math.max(0, (height - charY) / (height * 0.15))
          );
          const charOpacity = 0.08 * fadeTop * fadeBottom * opacityScale;

          if (charOpacity > 0.001) {
            ctx.fillStyle = `rgba(212,212,212,${charOpacity})`;
            ctx.fillText(col.chars[i], col.x, charY);
          }
        }
      }
    },
    [opacityScale]
  );

  /* ---- Setup & teardown ----------------------------------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);

      // Re-initialize particles if needed
      if (nodesRef.current.length === 0) {
        nodesRef.current = createNodes(rect.width, rect.height);
      }
      if (columnsRef.current.length === 0) {
        columnsRef.current = createColumns(rect.width, rect.height);
      }
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Mouse tracking (on the parent container since canvas is pointer-events-none)
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const onMouseLeave = () => {
      mouseRef.current = null;
    };

    // Listen on document so we get mouse even over pointer-events-none overlay
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    // Start animation
    lastFrameRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [animate]);

  /* ---- Render --------------------------------------------------- */

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {/* Layer 1: CSS Perspective Grid */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "-50%",
          right: "-50%",
          height: "70%",
          backgroundImage: `
            linear-gradient(to right, rgba(212,212,212,${0.018 * opacityScale}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(212,212,212,${0.018 * opacityScale}) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: "perspective(1000px) rotateX(60deg)",
          transformOrigin: "top center",
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 80%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 80%)",
        }}
      />

      {/* Layer 2 + 3: Canvas (nodes + data streams) */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          willChange: "transform",
        }}
      />

      {/* Layer 4: Glow Orbs */}
      <div
        style={{
          position: "absolute",
          left: "20%",
          top: "30%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${ACCENT}40 0%, transparent 70%)`,
          opacity: 0.12 * opacityScale,
          transform: "translate(-50%, -50%)",
          animation: "heroOrbPulse 8s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "80%",
          top: "60%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, #8B5CF640 0%, transparent 70%)`,
          opacity: 0.08 * opacityScale,
          transform: "translate(-50%, -50%)",
          animation: "heroOrbPulse 12s ease-in-out 3s infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "80%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle, #06B6D440 0%, transparent 70%)`,
          opacity: 0.1 * opacityScale,
          transform: "translate(-50%, -50%)",
          animation: "heroOrbPulse 6s ease-in-out 1s infinite",
        }}
      />

      {/* Layer 5: Scan Line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(to right, transparent 0%, rgba(212,212,212,0.4) 20%, rgba(212,212,212,0.8) 50%, rgba(212,212,212,0.4) 80%, transparent 100%)`,
          opacity: 0.4 * opacityScale,
          animation: "heroScanLine 8s linear infinite",
        }}
      />

      {/* Keyframe animations injected via style tag */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes heroOrbPulse {
              0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: inherit; }
              50% { transform: translate(-50%, -50%) scale(1.15); opacity: inherit; }
            }
            @keyframes heroScanLine {
              0% { transform: translateY(0); }
              100% { transform: translateY(100vh); }
            }
          `,
        }}
      />
    </div>
  );
}
