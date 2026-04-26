"use client"

import { type RefObject, useEffect, useState, useRef, useCallback } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "framer-motion"
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
  MARKER_ANGLE_DESKTOP,
  MARKER_ANGLE_MOBILE,
  LABEL_RING_GAP,
  VISIBILITY_GATE_START,
  VISIBILITY_GATE_END,
} from "@/lib/knob-geometry"
import { SECTIONS, SECTION_IDS } from "@/lib/sections"
import { useActiveSection } from "@/hooks/use-active-section"

type Props = {
  containerRef: RefObject<HTMLDivElement | null>
}

const DEFAULT_REST_SCALE = 100 / BASE_SIZE

function easeInOutCubic(t: number): number {
  if (t < 0.5) return 4 * t * t * t
  const f = 2 * t - 2
  return 0.5 * f * f * f + 1
}

const lerp = (r: number, d: number, p: number) => r + (d - r) * p

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

function shortestSignedAngle(from: number, to: number): number {
  return ((to - from + 540) % 360) - 180
}

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

function computeRingRotation(
  scrollY: number,
  sectionTops: number[],
  markerAngle: number,
  sectionAngles: number[],
): number {
  if (sectionTops.length === 0) return 0
  const target = (i: number) => markerAngle - sectionAngles[i]

  if (scrollY <= sectionTops[0]) return target(0)
  if (scrollY >= sectionTops[sectionTops.length - 1]) return target(sectionTops.length - 1)

  let i = 0
  while (i < sectionTops.length - 1 && sectionTops[i + 1] <= scrollY) i++

  const lo = sectionTops[i]
  const hi = sectionTops[i + 1]
  const frac = hi === lo ? 0 : clamp((scrollY - lo) / (hi - lo), 0, 1)
  const eased = easeInOutCubic(frac)

  const r0 = target(i)
  const r1 = target(i + 1)
  const delta = shortestSignedAngle(r0, r1)
  return r0 + delta * eased
}

type LabelButtonProps = {
  section: typeof SECTIONS[number]
  isActive: boolean
  isDesktop: boolean
  cx: number
  cy: number
  ringRotation: MotionValue<number>
  markerAngle: number
  prefersReducedMotion: boolean
  onClick: () => void
}

function LabelButton({ section, isActive, isDesktop, cx, cy, ringRotation, markerAngle, prefersReducedMotion, onClick }: LabelButtonProps) {
  const isHighlighted = section.highlight === true

  // Per-label angular distance from marker, signed in (-180°, 180°].
  const labelDistance = useTransform(ringRotation, (r) =>
    shortestSignedAngle(markerAngle, section.angle + r),
  )
  const absDistance = useTransform(labelDistance, (d) => Math.abs(d))

  // Opacity: piecewise easeOutQuad, anchors at 0°→1.0, 45°→0.55, 90°→0.
  const opacity = useTransform(absDistance, (d) => {
    if (d >= 90) return 0
    if (d <= 45) {
      const t = d / 45
      return 1 - easeOutQuad(t) * (1 - 0.55)
    }
    const t = (d - 45) / 45
    return 0.55 - easeOutQuad(t) * 0.55
  })
  // Reduced-motion: ring rotation snaps on activeIndex change, which would
  // produce a hard opacity step as labels swap slots. Tween the result over
  // 120ms to soften the swap into a crossfade. Created unconditionally; the
  // boolean below picks the right MV for style.opacity.
  const opacityRM = useSpring(opacity, { duration: 120, bounce: 0 })
  const finalOpacity = prefersReducedMotion ? opacityRM : opacity

  // Scale: easeInOutCubic from 1.0 → 0.78 over 0°→90°, clamps below.
  const scale = useTransform(absDistance, (d) => {
    const t = clamp(d / 90, 0, 1)
    return 1 - easeInOutCubic(t) * (1 - 0.78)
  })

  // Counter-rotation to keep label upright as ring spins.
  const counterRotate = useTransform(ringRotation, (r) => -r)

  // Color: brand if SİPARİŞ (always), or if within ±15° of marker. Otherwise neutral.
  const color = useTransform(absDistance, (d) =>
    (isHighlighted || d <= 15) ? "#2798ff" : "#0F172A",
  )

  // Font-weight: snap-flip at ±22.5° (halfway through prev/next arc).
  const fontWeight = useTransform(absDistance, (d) => (d <= 22.5 ? 600 : 500))

  // Active-arrival weight pulse: bump pulseKey when isActive flips false→true.
  // Gated on !prefersReducedMotion to match Knob.tsx pointer-pulse behavior.
  const [pulseKey, setPulseKey] = useState(0)
  const wasActiveRef = useRef(isActive)
  useEffect(() => {
    if (isActive && !wasActiveRef.current && !prefersReducedMotion) {
      setPulseKey((k) => k + 1)
    }
    wasActiveRef.current = isActive
  }, [isActive, prefersReducedMotion])

  return (
    <motion.button
      key={pulseKey}
      type="button"
      onClick={onClick}
      aria-label={section.ariaLabel}
      aria-current={isActive ? "true" : undefined}
      className="focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2798ff] rounded"
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        x: "-50%",
        y: "-50%",
        rotate: counterRotate,
        opacity: finalOpacity,
        scale,
        color,
        fontSize: isDesktop ? 16 : 13,
        fontWeight,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        pointerEvents: "auto",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
        paddingTop: 4,
        lineHeight: 1,
        fontFamily: "inherit",
        animation: pulseKey > 0 ? `label-active-pulse 280ms cubic-bezier(0.34, 1.56, 0.64, 1)` : undefined,
      }}
    >
      {section.label}
    </motion.button>
  )
}

export function LabelRing({ containerRef }: Props) {
  const [isMeasured, setIsMeasured] = useState(false)
  const restLeftMV = useMotionValue(0)
  const restTopMV = useMotionValue(0)
  const restScaleMV = useMotionValue(DEFAULT_REST_SCALE)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      const r = el.getBoundingClientRect()
      const p = computeRestPosition(r)
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

  const [viewport, setViewport] = useState({ w: 375, h: 800 })
  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const [sectionTops, setSectionTops] = useState<number[]>([])
  useEffect(() => {
    if (typeof window === "undefined") return
    const measure = () => {
      const tops = SECTION_IDS.map((id) => {
        const el = document.getElementById(id)
        return el ? el.getBoundingClientRect().top + window.scrollY : 0
      })
      setSectionTops(tops)
    }
    measure()
    // Re-measure on viewport changes.
    window.addEventListener("resize", measure)
    window.addEventListener("load", measure)
    // Re-measure when document body height changes (lazy images, font swaps,
    // accordion expansions). ResizeObserver fires once with the initial size,
    // so subsequent firings reflect actual layout shifts.
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    // Re-measure once fonts are swapped in (FOUT/FOIT shifts metrics).
    if (document.fonts && typeof document.fonts.ready?.then === "function") {
      document.fonts.ready.then(measure)
    }
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
      window.removeEventListener("load", measure)
    }
  }, [])

  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const rawProgress = useTransform(scrollY, [MORPH_START, MORPH_END], [0, 1], { clamp: true })
  const easedProgress = useTransform(rawProgress, easeInOutCubic)
  // Reduced-motion: snap to end-state at MORPH_START. Mirrors Knob.tsx so
  // the ring tracks the knob's morph perfectly under RM.
  const morphProgressRM = useTransform(scrollY, (y): number => (y >= MORPH_START ? 1 : 0))
  const morphProgress = prefersReducedMotion ? morphProgressRM : easedProgress

  // Ring visibility gate: hide labels while knob is still in the machine
  // (would otherwise orbit a tiny in-machine knob and look broken).
  // Under RM, morphProgress now snaps 0→1 at MORPH_START, so the morph-based
  // gate would also work — but we keep the scrollY gate at MORPH_END to
  // preserve the original intent: labels appear ONLY after morph fully done,
  // not at the start of morph. Both gates created unconditionally (rules of
  // hooks); pick at the boolean.
  const ringOpacityScrollGate = useTransform(scrollY, (y): number => (y >= MORPH_END ? 1 : 0))
  const ringOpacityMorphGate = useTransform(morphProgress, [VISIBILITY_GATE_START, VISIBILITY_GATE_END], [0, 1], { clamp: true })
  const ringOpacityGate = prefersReducedMotion ? ringOpacityScrollGate : ringOpacityMorphGate
  const ringOpacity = useTransform(ringOpacityGate, (g) => (isMeasured ? g : 0))
  // Disable pointer-events on invisible labels — opacity:0 alone doesn't
  // suppress hit-testing, so any future hero CTA inside the orbit radius
  // would be silently click-blocked.
  const ringPointerEvents = useTransform(ringOpacity, (o) => (o > 0 ? "auto" : "none"))

  const isDesktop = viewport.w >= DESKTOP_BREAKPOINT
  const destLeftPx = isDesktop ? 0 : viewport.w / 2
  const destTopPx = isDesktop ? viewport.h / 2 : 0
  const destScale = isDesktop
    ? Math.max(MIN_SCROLLED_SIZE, viewport.h - SCROLLED_PADDING) / BASE_SIZE
    : viewport.w / BASE_SIZE

  const destLeftMV = useMotionValue(0)
  const destTopMV = useMotionValue(0)
  const destScaleMV = useMotionValue(0)
  useEffect(() => {
    destLeftMV.set(destLeftPx)
    destTopMV.set(destTopPx)
    destScaleMV.set(destScale)
  }, [destLeftPx, destTopPx, destScale, destLeftMV, destTopMV, destScaleMV])

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

  const freezeRef = useRef(false)
  const freezeTimerRef = useRef<number | null>(null)
  const [activeIndex, setActiveManual] = useActiveSection(freezeRef)

  useEffect(() => {
    return () => {
      if (freezeTimerRef.current !== null) {
        window.clearTimeout(freezeTimerRef.current)
      }
    }
  }, [])

  const handleClick = useCallback((index: number, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    if (freezeTimerRef.current !== null) {
      window.clearTimeout(freezeTimerRef.current)
    }
    freezeRef.current = true
    setActiveManual(index)
    el.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    })
    freezeTimerRef.current = window.setTimeout(() => {
      freezeRef.current = false
      freezeTimerRef.current = null
    }, 900)
  }, [setActiveManual, prefersReducedMotion])

  const markerAngle = isDesktop ? MARKER_ANGLE_DESKTOP : MARKER_ANGLE_MOBILE
  const sectionAngles = SECTIONS.map((s) => s.angle)

  const ringRotationRaw = useTransform(scrollY, (y) =>
    computeRingRotation(y, sectionTops, markerAngle, sectionAngles),
  )
  // Reduced-motion path: a plain MotionValue whose .set() fires only when the
  // active section or marker angle changes. Avoids per-scroll-tick recompute
  // for the very users who explicitly opted into less motion.
  const ringRotationDiscrete = useMotionValue(markerAngle - SECTIONS[activeIndex].angle)
  useEffect(() => {
    ringRotationDiscrete.set(markerAngle - SECTIONS[activeIndex].angle)
  }, [activeIndex, markerAngle, ringRotationDiscrete])
  const ringRotation = prefersReducedMotion ? ringRotationDiscrete : ringRotationRaw

  return (
    <motion.div
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
        zIndex: 40,
        opacity: ringOpacity,
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          rotate: ringRotation,
          transformOrigin: "center",
          pointerEvents: ringPointerEvents,
        }}
      >
        {SECTIONS.map((section, i) => {
          const angleRad = (section.angle * Math.PI) / 180
          const ringRadiusInBase = BASE_SIZE / 2 + LABEL_RING_GAP
          const cx = BASE_SIZE / 2 + ringRadiusInBase * Math.cos(angleRad)
          const cy = BASE_SIZE / 2 + ringRadiusInBase * Math.sin(angleRad)

          return (
            <LabelButton
              key={section.id}
              section={section}
              isActive={i === activeIndex}
              isDesktop={isDesktop}
              cx={cx}
              cy={cy}
              ringRotation={ringRotation}
              markerAngle={markerAngle}
              prefersReducedMotion={prefersReducedMotion === true}
              onClick={() => handleClick(i, section.id)}
            />
          )
        })}
      </motion.div>
    </motion.div>
  )
}

function computeRestPosition(rect: DOMRect) {
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
  const restScale = (KNOB_DIAMETER * machineScale) / BASE_SIZE
  return {
    restLeft: knobCenterX,
    restTop: knobCenterY,
    restScale,
  }
}
