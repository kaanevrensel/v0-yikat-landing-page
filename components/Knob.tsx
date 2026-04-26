"use client"

import { type RefObject, useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue } from "framer-motion"
import {
  BASE_SIZE,
  VIEWBOX_W,
  VIEWBOX_H,
  KNOB_LOCAL_X,
  KNOB_LOCAL_Y,
  KNOB_DIAMETER,
  MORPH_START,
  MORPH_END,
  SCROLLED_PADDING,
  MIN_SCROLLED_SIZE,
  DESKTOP_BREAKPOINT,
} from "@/lib/knob-geometry"
import { useActiveSection } from "@/hooks/use-active-section"

type Props = {
  containerRef: RefObject<HTMLDivElement | null>
}

// Derived locally — not shared (LabelRing computes from BASE_SIZE directly).
const KNOB_FILL_SCALE = BASE_SIZE / KNOB_DIAMETER       // 500/88 ≈ 5.6818
const C = BASE_SIZE / 2                                 // 250 — knob center in new viewBox
const DEFAULT_REST_SCALE = 100 / BASE_SIZE              // SSR fallback; opacity=0 hides until measured

function easeInOutCubic(t: number): number {
  if (t < 0.5) return 4 * t * t * t
  const f = 2 * t - 2
  return 0.5 * f * f * f + 1
}

const lerp = (r: number, d: number, p: number) => r + (d - r) * p

export function Knob({ containerRef }: Props) {
  const [isMeasured, setIsMeasured] = useState(false)

  // Rest MotionValues, fed via .set() inside the RO/scroll effect below.
  // Created unconditionally to obey rules of hooks. Defaults: 0 for left/top
  // (offscreen until measured; the isMeasured opacity gate hides the knob
  // anyway) and DEFAULT_REST_SCALE for restScale (matches the SSR fallback path).
  const restLeftMV = useMotionValue(0)
  const restTopMV = useMotionValue(0)
  const restScaleMV = useMotionValue(DEFAULT_REST_SCALE)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      const r = el.getBoundingClientRect()
      const p = computePosition(r)
      restLeftMV.set(p.restLeft)
      restTopMV.set(p.restTop)
      restScaleMV.set(p.restScale)
      setIsMeasured(true)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)

    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [containerRef, restLeftMV, restTopMV, restScaleMV])

  // Viewport tracking for responsive morph destination.
  // SSR initial { 375, 800 } is fine — the isMeasured opacity gate hides
  // the knob until the RO callback fires.
  const [viewport, setViewport] = useState({ w: 375, h: 800 })
  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()

  // Morph driver: scroll-tied with eased shape, no spring smoothing.
  const rawProgress = useTransform(scrollY, [MORPH_START, MORPH_END], [0, 1], { clamp: true })
  const easedProgress = useTransform(rawProgress, easeInOutCubic)
  // Reduced-motion: snap to end-state at MORPH_START (no easing, no intermediate
  // frame). Honors the "no animation" promise by jumping straight to destination
  // rather than interpolating, while preserving feature parity with the animated
  // path. Created unconditionally to obey rules of hooks.
  const morphProgressRM = useTransform(scrollY, (y): number => (y >= MORPH_START ? 1 : 0))
  const morphProgress = prefersReducedMotion ? morphProgressRM : easedProgress

  // Responsive morph destination — plain numbers derived from viewport.
  // Desktop: knob center at left edge, vertically centered (half-clipped).
  // Mobile:  knob center at top  edge, horizontally centered (half-clipped).
  const isDesktop = viewport.w >= DESKTOP_BREAKPOINT

  // Pointer's local origin is at 12 o'clock (POINTER_Y = C - R_BODY).
  // To land at MARKER_ANGLE in CSS-angle convention (0° = 3 o'clock):
  //   desktop (MARKER_ANGLE = 0°)  → rotate 90° CW
  //   mobile  (MARKER_ANGLE = 90°) → rotate 180° CW
  const pointerSvgAngle = isDesktop ? 90 : 180

  // Active-section tracking for pointer-pulse. freezeRef is a no-op local
  // since Knob doesn't initiate clicks; LabelRing owns the freeze logic.
  const freezeRef = useRef(false)
  const [activeIndex] = useActiveSection(freezeRef)

  const [pulse, setPulse] = useState(0)
  const lastActiveRef = useRef(activeIndex)
  useEffect(() => {
    if (lastActiveRef.current !== activeIndex) {
      lastActiveRef.current = activeIndex
      if (!prefersReducedMotion) {
        setPulse((n) => n + 1)
      }
    }
  }, [activeIndex, prefersReducedMotion])

  const destLeftPx = isDesktop ? 0 : viewport.w / 2
  const destTopPx = isDesktop ? viewport.h / 2 : 0
  const destScale = isDesktop
    ? Math.max(MIN_SCROLLED_SIZE, viewport.h - SCROLLED_PADDING) / BASE_SIZE
    : viewport.w / BASE_SIZE

  // Destination MotionValues, fed via effect on viewport change.
  const destLeftMV = useMotionValue(0)
  const destTopMV = useMotionValue(0)
  const destScaleMV = useMotionValue(0)
  useEffect(() => {
    destLeftMV.set(destLeftPx)
    destTopMV.set(destTopPx)
    destScaleMV.set(destScale)
  }, [destLeftPx, destTopPx, destScale, destLeftMV, destTopMV, destScaleMV])

  // Blended MotionValues. At morphProgress=0 these return the rest values
  // exactly (position parity at scrollY=0). As morphProgress eases to 1,
  // they migrate to the destination. Reduced-motion pins morphProgress to 0,
  // so the blend stays at rest forever.
  const left = useTransform(
    [restLeftMV, destLeftMV, morphProgress],
    ([r, d, p]: number[]) => lerp(r, d, p),
  )
  const top = useTransform(
    [restTopMV, destTopMV, morphProgress],
    ([r, d, p]: number[]) => lerp(r, d, p),
  )
  const scale = useTransform(
    [restScaleMV, destScaleMV, morphProgress],
    ([r, d, p]: number[]) => lerp(r, d, p),
  )

  // Pre-compute scaled geometry (radii/pointer) for the 500-unit viewBox.
  // Do NOT re-add a second concentric disc — caused banding at morph scale (see 46bb2de).
  const R_BODY = 42 * KNOB_FILL_SCALE             // ≈ 238.636
  const R_POINTER_INNER = 34 * KNOB_FILL_SCALE    // ≈ 193.182 — pointer's inner edge radius
  const R_DOT = 2.2 * KNOB_FILL_SCALE             // 12.5
  const POINTER_W = 3.6 * KNOB_FILL_SCALE         // ≈ 20.455
  const POINTER_H = R_BODY - R_POINTER_INNER      // spans the outer band region
  const POINTER_RX = 1.6 * KNOB_FILL_SCALE        // ≈ 9.091
  const POINTER_X = C - POINTER_W / 2             // centered horizontally at 250
  const POINTER_Y = C - R_BODY                    // outer edge sits at knob outer edge

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        left,
        top,
        x: "-50%",
        y: "-50%",
        width: BASE_SIZE,
        height: BASE_SIZE,
        scale,
        transformOrigin: "center",
        pointerEvents: "none",
        zIndex: 30,
        opacity: isMeasured ? 1 : 0,
        willChange: "transform",
      }}
    >
      <svg
        viewBox={`0 0 ${BASE_SIZE} ${BASE_SIZE}`}
        width={BASE_SIZE}
        height={BASE_SIZE}
      >
        <g transform={`rotate(${pointerSvgAngle} ${C} ${C})`}>
          <circle cx={C} cy={C} r={R_BODY} fill="#3286E7" />
          <circle cx={C} cy={C} r={R_DOT} fill="#F4F6FA" opacity="0.95" />
          <rect
            key={`pointer-${pulse}`}
            x={POINTER_X}
            y={POINTER_Y}
            width={POINTER_W}
            height={POINTER_H}
            rx={POINTER_RX}
            fill="#F4F6FA"
            opacity="0.9"
            style={{ animation: pulse > 0 ? "knob-pointer-pulse 200ms ease-out" : undefined }}
          />
        </g>
      </svg>
    </motion.div>
  )
}

function computePosition(rect: DOMRect) {
  const containerAspect = rect.width / rect.height
  const svgAspect = VIEWBOX_W / VIEWBOX_H
  const widthConstrained = containerAspect < svgAspect
  const machineScale = widthConstrained ? rect.width / VIEWBOX_W : rect.height / VIEWBOX_H
  const renderedW = VIEWBOX_W * machineScale
  const renderedH = VIEWBOX_H * machineScale
  const offsetX = (rect.width - renderedW) / 2
  const offsetY = (rect.height - renderedH) / 2
  const knobCenterX = rect.left + offsetX + KNOB_LOCAL_X * machineScale
  const knobCenterY = rect.top + offsetY + KNOB_LOCAL_Y * machineScale
  // rest scale: new 500-container scaled so its rendered CSS size equals the old rendered
  // knob diameter (88 * machineScale). Combined with r=250 inside the new viewBox, this
  // makes the rendered knob radius = 44*machineScale — matching commit efa011c exactly.
  const restScale = (KNOB_DIAMETER * machineScale) / BASE_SIZE
  return {
    restLeft: knobCenterX,
    restTop: knobCenterY,
    restScale,
  }
}
