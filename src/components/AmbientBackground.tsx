import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const LINK_DIST = 120;
const POINTER_RADIUS = 160;
const DOT_RGB = '124, 138, 168'; // --slate-soft
const LINE_RGB = '124, 138, 168';
const POINTER_RGB = '255, 107, 53'; // --amber

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const context = canvasEl?.getContext('2d');
    if (!canvasEl || !context) return;

    // Non-null bindings so the nested helpers below don't need redundant checks.
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    const reduced = prefersReducedMotion();
    let points: Point[] = [];
    let width = 0;
    let height = 0;
    let pointer: { x: number; y: number } | null = null;
    let frameId = 0;

    function seed() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(24, Math.min(80, Math.round((width * height) / 24000)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 1 + Math.random() * 1.2,
      }));
    }

    function drawLinks() {
      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist >= LINK_DIST) continue;
          ctx.strokeStyle = `rgba(${LINE_RGB}, ${0.12 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }

        if (pointer) {
          const dist = Math.hypot(a.x - pointer.x, a.y - pointer.y);
          if (dist < POINTER_RADIUS) {
            ctx.strokeStyle = `rgba(${POINTER_RGB}, ${0.25 * (1 - dist / POINTER_RADIUS)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = `rgba(${DOT_RGB}, 0.5)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      for (const p of points) {
        if (pointer) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < POINTER_RADIUS && dist > 0.01) {
            const force = (1 - dist / POINTER_RADIUS) * 0.03;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }

      drawLinks();
      frameId = requestAnimationFrame(step);
    }

    function handlePointerMove(e: PointerEvent) {
      pointer = { x: e.clientX, y: e.clientY };
    }
    function handlePointerLeave() {
      pointer = null;
    }
    function handleResize() {
      seed();
      if (reduced) {
        ctx.clearRect(0, 0, width, height);
        drawLinks();
      }
    }
    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(frameId);
      } else {
        frameId = requestAnimationFrame(step);
      }
    }

    seed();
    window.addEventListener('resize', handleResize);

    if (reduced) {
      // One still frame — no animation loop, no pointer tracking.
      drawLinks();
    } else {
      frameId = requestAnimationFrame(step);
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerleave', handlePointerLeave);
      document.addEventListener('visibilitychange', handleVisibility);
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-bg" aria-hidden="true" />;
}
