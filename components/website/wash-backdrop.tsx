"use client";

import { useEffect, useId, useRef } from "react";
import { useScenePlayback } from "./motion";

/** Autonomous water, with a still first paint and no pointer dependency. */
export function WashBackdrop() {
  const id = useId();
  const canvas = useRef<HTMLCanvasElement>(null);
  const clock = useRef(0);
  const { ref, playing } = useScenePlayback();

  useEffect(() => {
    const surface = canvas.current;
    if (!surface) return;
    const context = surface.getContext("2d", { alpha: true });
    if (!context) return;
    let frame = 0;
    let previous = 0;
    let width = 0;
    let height = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    function paint(time: number) {
      const ctx = context!;
      ctx.clearRect(0, 0, width, height);
      for (let layer = 0; layer < 3; layer++) {
        const wave = new Path2D();
        const edge = new Path2D();
        const base = height * (0.39 + layer * 0.165);
        const amplitude = height * (0.073 + layer * 0.007);
        for (let x = -24; x <= width + 24; x += 12) {
          const position = x / width;
          const y = base
            + Math.sin(position * Math.PI * 2 + time * (0.66 + layer * 0.13) + layer * 1.7) * amplitude
            + Math.sin(position * Math.PI * 3 - time * 0.48 + layer) * amplitude * 0.35;
          if (x === -24) { wave.moveTo(x, y); edge.moveTo(x, y); }
          else { wave.lineTo(x, y); edge.lineTo(x, y); }
        }
        wave.lineTo(width + 24, height + 24);
        wave.lineTo(-24, height + 24);
        wave.closePath();
        const water = ctx.createLinearGradient(0, base - amplitude, 0, height);
        water.addColorStop(0, `rgba(38,154,255,${0.17 - layer * 0.015})`);
        water.addColorStop(1, "rgba(141,211,255,0.015)");
        ctx.fillStyle = water;
        ctx.fill(wave);
        ctx.strokeStyle = layer === 1 ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.7)";
        ctx.lineWidth = layer === 1 ? 3 : 1.5;
        ctx.stroke(edge);
        ctx.save();
        ctx.translate(0, 13);
        ctx.strokeStyle = "rgba(74,170,237,0.11)";
        ctx.lineWidth = 1;
        ctx.stroke(edge);
        ctx.restore();
      }
      // Sparse soap lenses stay at the edges of the service choices.
      [0.045, 0.15, 0.84, 0.96, 0.27, 0.73].forEach((position, index) => {
        const progress = (time * (0.055 + (index % 3) * 0.007) + index * 0.173) % 1;
        const radius = Math.min(width * 0.033, 31) * (index % 2 ? 0.55 : 1);
        const x = width * position + Math.sin(time * 0.55 + index) * Math.min(width * 0.025, 24);
        const y = height * (1.08 - progress * 1.17);
        ctx.save();
        ctx.globalAlpha = Math.sin(progress * Math.PI) * 0.72;
        const lens = ctx.createRadialGradient(x - radius * 0.4, y - radius * 0.45, 0, x, y, radius);
        lens.addColorStop(0, "rgba(255,255,255,0.8)");
        lens.addColorStop(0.6, "rgba(255,255,255,0.02)");
        lens.addColorStop(0.9, "rgba(103,189,250,0.2)");
        lens.addColorStop(1, "rgba(255,255,255,0.9)");
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = lens;
        ctx.fill();
        ctx.strokeStyle = "rgba(87,169,228,0.2)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.76, Math.PI * 1.12, Math.PI * 1.48);
        ctx.strokeStyle = "rgba(255,255,255,0.95)";
        ctx.lineWidth = 1.7;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
      });
    }
    function resize() {
      const bounds = surface!.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      surface!.width = Math.round(width * ratio);
      surface!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      paint(reduced.matches ? 0 : clock.current);
      surface!.dataset.ready = "true";
    }
    function tick(now: number) {
      if (previous && now - previous < 1000 / 30) {
        frame = requestAnimationFrame(tick);
        return;
      }
      if (previous) clock.current += Math.min((now - previous) / 1000, 0.08);
      previous = now;
      paint(clock.current);
      frame = requestAnimationFrame(tick);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(surface);
    resize();
    if (playing && !reduced.matches) frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [playing]);

  return (
    <div className="home-wash" ref={ref} aria-hidden="true" data-playing={playing}>
      <canvas ref={canvas} />
      <svg className="wash-still" viewBox="0 0 1440 900" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id={`${id}-still`} x2="0" y2="1">
            <stop stopColor="#269aff" stopOpacity=".17" />
            <stop offset="1" stopColor="#269aff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M-40 400Q300 200 700 420T1480 350V900H-40Z" fill={`url(#${id}-still)`} stroke="#ffffffbb" strokeWidth="3" />
        <path d="M-40 600Q350 800 790 600T1480 660V900H-40Z" fill={`url(#${id}-still)`} stroke="#ffffffbb" strokeWidth="3" />
      </svg>
    </div>
  );
}
