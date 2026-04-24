"use client"

import { type RefObject, useEffect, useState } from "react"
import { motion, useScroll, useSpring, useTransform, useReducedMotion, useMotionValue } from "framer-motion"

type Props = {
  containerRef: RefObject<HTMLDivElement | null>
}

// New fixed container: 500×500 motion.div, scaled uniformly via `restScale`.
// The knob SVG inside uses a 0 0 500 500 viewBox with geometry centered at (250, 250).
// All circle/pointer radii are scaled from the old 100-unit viewBox (knob diameter 88)
// to fill the 500-unit viewBox — scale factor k = 500/88. The outer `restScale` then
// brings the rendered knob back to its old CSS size: rendered knob CSS radius =
// (44*k) * restScale = (44*500/88) * (88*machine_scale/500) = 44*machine_scale,
// matching commit efa011c's rendered knob exactly.
const BASE_SIZE = 500
const VIEWBOX_W = 900
const VIEWBOX_H = 1100
const KNOB_LOCAL_X = 450
const KNOB_LOCAL_Y = 210
const KNOB_DIAMETER = 88                                // r=44 in old 100-unit viewBox
const KNOB_FILL_SCALE = BASE_SIZE / KNOB_DIAMETER       // 500/88 ≈ 5.6818
const C = BASE_SIZE / 2                                 // 250 — knob center in new viewBox
// Fallback rest-scale used before measurement; harmless since opacity=0 until isMeasured.
const DEFAULT_REST_SCALE = 100 / BASE_SIZE

// Morph driver constants (ported verbatim from deleted DialNavigator.tsx @ ac52fd0~1).
const MORPH_START = 120              // scrollY px — morph begins
const MORPH_END = 380                // scrollY px — morph settled
const SCROLLED_PADDING = 40          // 20 top + 20 bottom (used in Task 3 for dest scale)
const MIN_SCROLLED_SIZE = 420        // clamp floor (used in Task 3)

function easeInOutCubic(t: number): number {
  if (t < 0.5) return 4 * t * t * t
  const f = 2 * t - 2
  return 0.5 * f * f * f + 1
}

export function Knob({ containerRef }: Props) {
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [isMeasured, setIsMeasured] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      setRect(el.getBoundingClientRect())
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
  }, [containerRef])

  // Viewport tracking for responsive morph destination (Task 3).
  // SSR initial { 375, 800 } is fine — dest MVs aren't consumed yet, and the
  // existing isMeasured opacity gate hides the knob until the RO callback fires.
  const [viewport, setViewport] = useState({ w: 375, h: 800 })
  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const position = rect
    ? computePosition(rect)
    : { left: 0, top: 0, restScale: DEFAULT_REST_SCALE }

  const prefersReducedMotion = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
  const rawAngle = useTransform(scrollYProgress, [0, 1], [0, 1080])
  const smoothAngle = useSpring(rawAngle, { stiffness: 50, damping: 20 })
  const angle = prefersReducedMotion ? 0 : smoothAngle

  // Morph driver chain (Task 2). Produces a unit-progress MotionValue that will
  // drive rest→destination blending in Tasks 3–5. Not consumed yet.
  const rawProgress = useTransform(scrollY, [MORPH_START, MORPH_END], [0, 1], { clamp: true })
  const easedProgress = useTransform(rawProgress, easeInOutCubic)
  const morphProgressRaw = useSpring(easedProgress, { stiffness: 50, damping: 20 })
  // Reduced-motion: pin to 0. zeroMV is created unconditionally to obey rules of hooks.
  const zeroMV = useMotionValue(0)
  // morphProgress is intentionally unused in Task 2 — it will be consumed in Task 5.
  const morphProgress = prefersReducedMotion ? zeroMV : morphProgressRaw
  void morphProgress

  // Responsive morph destination (Task 3). Plain numbers derived from viewport.
  // Desktop: knob center at left edge, vertically centered (half-clipped).
  // Mobile:  knob center at top  edge, horizontally centered (half-clipped).
  const isDesktop = viewport.w >= 1024
  const destLeftPx = isDesktop ? 0 : viewport.w / 2
  const destTopPx = isDesktop ? viewport.h / 2 : 0
  const destScale = isDesktop
    ? Math.max(MIN_SCROLLED_SIZE, viewport.h - SCROLLED_PADDING) / BASE_SIZE
    : viewport.w / BASE_SIZE

  // Destination MotionValues, fed via effect on viewport change.
  // Intentionally unconsumed in Task 3 — Task 5 will wire them into the blend.
  const destLeftMV = useMotionValue(0)
  const destTopMV = useMotionValue(0)
  const destScaleMV = useMotionValue(0)
  useEffect(() => {
    destLeftMV.set(destLeftPx)
    destTopMV.set(destTopPx)
    destScaleMV.set(destScale)
  }, [destLeftPx, destTopPx, destScale, destLeftMV, destTopMV, destScaleMV])
  void destLeftMV
  void destTopMV
  void destScaleMV

  // Pre-compute scaled geometry (radii/pointer) for the 500-unit viewBox.
  const R_SHADOW = 44 * KNOB_FILL_SCALE   // 250
  const R_BODY = 42 * KNOB_FILL_SCALE     // ≈ 238.636
  const R_TOP = 34 * KNOB_FILL_SCALE      // ≈ 193.182
  const R_DOT = 2.2 * KNOB_FILL_SCALE     // 12.5
  const POINTER_W = 3.6 * KNOB_FILL_SCALE // ≈ 20.455
  const POINTER_H = 11 * KNOB_FILL_SCALE  // 62.5
  const POINTER_RX = 1.6 * KNOB_FILL_SCALE // ≈ 9.091
  const POINTER_X = C - POINTER_W / 2     // centered horizontally at 250
  const POINTER_Y = C + (-30 * KNOB_FILL_SCALE) // old y=-30 shifted to center → ≈ 79.545

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: position.left,
        top: position.top,
        x: "-50%",
        y: "-50%",
        width: BASE_SIZE,
        height: BASE_SIZE,
        scale: position.restScale,
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
        <defs>
          <radialGradient id="knobBody" cx="40%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#5AA8FF" />
            <stop offset="40%" stopColor="#2E86F0" />
            <stop offset="80%" stopColor="#1A63C4" />
            <stop offset="100%" stopColor="#0D3F86" />
          </radialGradient>
          <radialGradient id="knobTop" cx="45%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#6FB0FF" />
            <stop offset="55%" stopColor="#2E86F0" />
            <stop offset="100%" stopColor="#164F9E" />
          </radialGradient>
          <filter id="knobShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation={2.5 * KNOB_FILL_SCALE} />
            <feOffset dx="0" dy={3 * KNOB_FILL_SCALE} result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.45" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#knobShadow)">
          <motion.g
            style={{
              rotate: angle,
              transformOrigin: `${C}px ${C}px`,
              transformBox: "view-box",
            }}
          >
            <circle cx={C} cy={C} r={R_SHADOW} fill="#000" opacity="0.45" />
            <circle cx={C} cy={C} r={R_BODY} fill="url(#knobBody)" />
            <circle cx={C} cy={C} r={R_TOP} fill="url(#knobTop)" />
            <circle cx={C} cy={C} r={R_TOP} fill="none" stroke="#0A2D5C" strokeOpacity="0.35" strokeWidth={0.8 * KNOB_FILL_SCALE} />
            <circle cx={C} cy={C} r={R_DOT} fill="#F4F6FA" opacity="0.95" />
            <rect
              x={POINTER_X}
              y={POINTER_Y}
              width={POINTER_W}
              height={POINTER_H}
              rx={POINTER_RX}
              fill="#F4F6FA"
              opacity="0.9"
            />
          </motion.g>
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
    left: knobCenterX,
    top: knobCenterY,
    restScale,
  }
}
