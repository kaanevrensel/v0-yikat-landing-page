"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const MotionContext = createContext({ reduced: false });
export function WebsiteMotionProvider({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return (
    <MotionContext.Provider value={{ reduced }}>
      <div
        className="site-experience"
        data-motion={reduced ? "paused" : "playing"}
      >
        {children}
      </div>
    </MotionContext.Provider>
  );
}
export function useScenePlayback(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const { reduced } = useContext(MotionContext);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= threshold),
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    const update = () => setTabVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [threshold]);
  return { ref, visible, tabVisible, playing: visible && tabVisible && !reduced };
}
export function MotionScene({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const { ref, playing } = useScenePlayback();
  return (
    <div
      ref={ref}
      className={`motion-scene ${className}`}
      style={style}
      data-playing={playing}
    >
      {children}
    </div>
  );
}
/** Begin at step one, advance only in view; an explicit choice takes control. */
export function useSceneSequence(count: number, intervalMs = 4200) {
  const { ref, playing } = useScenePlayback(0.5);
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  useEffect(() => {
    if (!playing || manual) return;
    const timer = window.setTimeout(() => setActive(index => (index + 1) % count), intervalMs);
    return () => window.clearTimeout(timer);
  }, [playing, manual, count, active, intervalMs]);
  return {
    ref,
    playing,
    active,
    select: (index: number) => {
      setManual(true);
      setActive(index);
    },
  };
}
