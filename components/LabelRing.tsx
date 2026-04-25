"use client"

import { type RefObject, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useMotionValue, useReducedMotion } from "framer-motion"
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
import { SECTIONS } from "@/lib/sections"

type Props = {
  containerRef: RefObject<HTMLDivElement | null>
}

const DEFAULT_REST_SCALE = 100 / BASE_SIZE
const LABEL_RING_GAP = 16                    // px gap between knob edge and label center

function easeInOutCubic(t: number): number {
  if (t < 0.5) return 4 * t * t * t
  const f = 2 * t - 2
  return 0.5 * f * f * f + 1
}

const lerp = (r: number, d: number, p: number) => r + (d - r) * p

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

  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const rawProgress = useTransform(scrollY, [MORPH_START, MORPH_END], [0, 1], { clamp: true })
  const easedProgress = useTransform(rawProgress, easeInOutCubic)
  const zeroMV = useMotionValue(0)
  const morphProgress = prefersReducedMotion ? zeroMV : easedProgress

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

  // TASK 2 SCAFFOLD: hardcoded active index. Replaced with useActiveSection in Task 4.
  const activeIndex = 0

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
        zIndex: 40,
        opacity: isMeasured ? 1 : 0,
      }}
    >
      {SECTIONS.map((section, i) => {
        const isActive = i === activeIndex
        const dist = angularDistance(section.angle, SECTIONS[activeIndex].angle)
        const visual = depthOfField(dist, isDesktop)

        // Position label center on the ring (radius in BASE_SIZE units, since
        // the parent motion.div is BASE_SIZE×BASE_SIZE and uses scale to size).
        // Label center coords relative to parent: (BASE_SIZE/2 + r*cos, BASE_SIZE/2 + r*sin)
        const knobRadiusInBase = BASE_SIZE / 2
        const ringRadiusInBase = knobRadiusInBase + LABEL_RING_GAP
        const angleRad = (section.angle * Math.PI) / 180
        const cx = BASE_SIZE / 2 + ringRadiusInBase * Math.cos(angleRad)
        const cy = BASE_SIZE / 2 + ringRadiusInBase * Math.sin(angleRad)

        const isHighlighted = section.highlight === true
        const color = (isHighlighted || isActive) ? "#2798ff" : "#0F172A"

        return (
          <div
            key={section.id}
            style={{
              position: "absolute",
              left: cx,
              top: cy,
              transform: `translate(-50%, -50%) scale(${visual.scale})`,
              opacity: visual.opacity,
              color,
              fontSize: visual.fontSize,
              fontWeight: isActive ? 600 : 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {section.label}
          </div>
        )
      })}
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

function angularDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360
  return diff > 180 ? 360 - diff : diff
}

function depthOfField(distanceDeg: number, isDesktop: boolean): {
  opacity: number; scale: number; fontSize: number
} {
  const desktop = isDesktop
  if (distanceDeg === 0) {
    return { opacity: 1.00, scale: 1.00, fontSize: desktop ? 16 : 13 }
  }
  if (distanceDeg <= 45) {
    return { opacity: 0.62, scale: 0.86, fontSize: desktop ? 14 : 12 }
  }
  if (distanceDeg <= 90) {
    return { opacity: 0.34, scale: 0.74, fontSize: desktop ? 13 : 11 }
  }
  if (distanceDeg <= 135) {
    return { opacity: 0.18, scale: 0.66, fontSize: desktop ? 12 : 10 }
  }
  return { opacity: 0.10, scale: 0.62, fontSize: desktop ? 12 : 10 }
}
