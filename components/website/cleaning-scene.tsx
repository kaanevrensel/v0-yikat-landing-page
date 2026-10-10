"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

function FabricFallback({ progress = 1 }: { progress?: number }) {
  return (
    <svg className="fabric-fallback" viewBox="0 0 620 470" aria-hidden="true">
      <defs>
        <linearGradient id="cotton-fold" x1="0" y1="0" x2="1" y2=".4">
          <stop stopColor="#258ef0" />
          <stop offset=".23" stopColor="#6ab6f9" />
          <stop offset=".43" stopColor="#0877d7" />
          <stop offset=".64" stopColor="#3c9ff1" />
          <stop offset="1" stopColor="#116ebf" />
        </linearGradient>
      </defs>
      <ellipse cx="310" cy="423" rx="117" ry="9" fill="#bfd5e1" opacity=".19" />
      <g transform="translate(310 214) rotate(-6)">
        <path
          d="M-48-153-94-165-184-102-143-39-94-66-83 162Q0 175 83 162L94-66 143-39 184-102 94-165 48-153Q0-82-48-153Z"
          fill="url(#cotton-fold)"
        />
        <path
          d="M-48-153Q0-82 48-153"
          fill="none"
          stroke="#126dc1"
          strokeWidth="10"
        />
        <path
          d="M-79 149Q0 160 79 149"
          fill="none"
          stroke="#58acf1"
          strokeWidth="1"
        />
        <ellipse
          cx="17"
          cy="36"
          rx="36"
          ry="28"
          fill="#998570"
          opacity={(1 - progress) * 0.28}
        />
      </g>
    </svg>
  );
}
const Scene = dynamic(() => import("./garment-scene"), {
  ssr: false,
  loading: () => <FabricFallback />,
});
class SceneBoundary extends Component<
  { children: ReactNode; progress: number },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <FabricFallback progress={this.props.progress} />
    ) : (
      this.props.children
    );
  }
}
export function CleaningScene() {
  const [progress, setProgress] = useState(0.08);
  const [pointer, setPointer] = useState<[number, number]>([0, 0]);
  const [reduced, setReduced] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const ready = useRef(false);
  const manual = useRef(false);
  const dragging = useRef(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(query.matches);
      if (query.matches) setProgress(1);
    };
    update();
    query.addEventListener("change", update);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    setSupported(!!context);
    if (!context) ready.current = true;
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    let raf = 0,
      start = 0,
      begun = false;
    const tick = (now: number) => {
      if (manual.current || query.matches) return;
      if (!ready.current) {
        raf = requestAnimationFrame(tick);
        return;
      }
      start ||= now;
      const t = Math.min(1, (now - start) / 4200);
      setProgress(0.08 + 0.92 * (t * t * (3 - 2 * t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !begun && !query.matches) {
          begun = true;
          raf = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting) cancelAnimationFrame(raf);
      },
      { threshold: 0.35 },
    );
    if (frame.current) observer.observe(frame.current);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      query.removeEventListener("change", update);
    };
  }, []);
  function scrub(value: number) {
    manual.current = true;
    setProgress(value);
  }
  return (
    <div className="garment-experience" ref={frame}>
      <div
        className="garment-webgl"
        role="img"
        aria-label="Sürükledikçe lekeleri temizlenen üç boyutlu kıyafet"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          dragging.current = true;
          manual.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width,
            y = (event.clientY - rect.top) / rect.height;
          if (dragging.current)
            scrub(
              Math.max(
                0,
                Math.min(
                  1,
                  rect.width > 600 ? (x - 0.25) / 0.5 : (x - 0.1) / 0.8,
                ),
              ),
            );
          if (!reduced) setPointer([(x - 0.5) * 2, (y - 0.5) * 2]);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        onPointerLeave={() => {
          if (!dragging.current) setPointer([0, 0]);
        }}
      >
        {supported === false ? (
          <FabricFallback progress={progress} />
        ) : (
          <SceneBoundary progress={progress}>
            <Scene
              progress={progress}
              pointer={pointer}
              reduced={reduced}
              onReady={() => {
                ready.current = true;
              }}
            />
          </SceneBoundary>
        )}
      </div>
      <div className="wash-control">
        <span>Sürükle, yıkat</span>
        <input
          type="range"
          min="0"
          max="100"
          step=".2"
          value={progress * 100}
          aria-label="Kıyafeti temizle"
          onChange={(event) => scrub(Number(event.target.value) / 100)}
          style={{ "--wash-progress": `${progress * 100}%` } as CSSProperties}
        />
      </div>
    </div>
  );
}
