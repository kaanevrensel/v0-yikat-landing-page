"use client"

import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import { SECTIONS } from "@/lib/sections"
import { useActiveSection } from "@/hooks/use-active-section"
import { DialProgram } from "./DialProgram"

// ---------- Geometry constants (viewBox 500×500, center 250,250) ----------
const CX = 250
const CY = 250
const BASE_R = 225            // bezel base radius
const BUMP_DELTA = 18         // bump height outward (max r = 243)
const BUMP_HALFWIDTH_DEG = 30 // smoothstep falloff ±30°
const SAMPLES = 240

// Desktop: labels rotate to 3 o'clock; Mobile: labels rotate to 6 o'clock.
const DESKTOP_BUMP_DEG = 0
const MOBILE_BUMP_DEG = 90
const MOBILE_ROTATION_OFFSET_DEG = 90

// ---------- Size constants (CSS pixels) ----------
const BASE_SIZE = 500                       // container footprint (matches viewBox)
const HERO_SIZE = 380                       // visible diameter at hero
const HERO_SCALE = HERO_SIZE / BASE_SIZE    // 0.76
const SCROLLED_PADDING = 40                 // 20px top + 20px bottom
const MIN_SCROLLED_SIZE = 420               // clamp floor for short viewports
const MOBILE_DIAL_VW = 100                  // full diameter = 100% of viewport width; visible half = 50vw tall

function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t))
  return 3 * x * x - 2 * x * x * x
}

function buildBezelPath(bumpAngleDeg: number): string {
  const pts: string[] = []
  for (let i = 0; i <= SAMPLES; i++) {
    const angleDeg = (i / SAMPLES) * 360
    let delta = Math.abs(angleDeg - bumpAngleDeg)
    if (delta > 180) delta = 360 - delta
    const norm = Math.min(delta / BUMP_HALFWIDTH_DEG, 1)
    const bump = 1 - smoothstep(norm)
    const r = BASE_R + bump * BUMP_DELTA
    const rad = (angleDeg * Math.PI) / 180
    const x = CX + Math.cos(rad) * r
    const y = CY + Math.sin(rad) * r
    pts.push(i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : `L ${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  pts.push("Z")
  return pts.join(" ")
}

const DESKTOP_BEZEL_PATH = buildBezelPath(DESKTOP_BUMP_DEG)
const MOBILE_BEZEL_PATH = buildBezelPath(MOBILE_BUMP_DEG)

function easeInOutCubic(t: number): number {
  if (t < 0.5) return 4 * t * t * t
  const f = 2 * t - 2
  return 0.5 * f * f * f + 1
}

export function DialNavigator() {
  const prefersReducedMotion = useReducedMotion()
  const programmaticScrollRef = useRef(false)

  const [active, setActiveManual] = useActiveSection(programmaticScrollRef)

  // One resize listener drives both desktop (scrolled height) and mobile (30vw-visible-half) sizing.
  const [viewport, setViewport] = useState({ w: 375, h: 800 })
  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  const scrolledSize = Math.max(MIN_SCROLLED_SIZE, viewport.h - SCROLLED_PADDING)
  const scrolledScale = scrolledSize / BASE_SIZE
  const mobileScale = (MOBILE_DIAL_VW / 100 * viewport.w) / BASE_SIZE

  const rotationTarget = useMotionValue(0)
  const rotation = useSpring(rotationTarget, { stiffness: 60, damping: 20 })

  useEffect(() => {
    rotationTarget.set(-active * 45)
  }, [active, rotationTarget])

  const { scrollY } = useScroll()
  const rawProgress = useTransform(scrollY, [120, 380], [0, 1], { clamp: true })
  const easedProgress = useTransform(rawProgress, easeInOutCubic)
  const morphProgress = useSpring(easedProgress, { stiffness: 50, damping: 20 })

  const left = useTransform(morphProgress, [0, 1], ["50vw", "0vw"])
  const scale = useTransform(morphProgress, [0, 1], [HERO_SCALE, scrolledScale])

  const instantRotation = useMotionValue(-active * 45)
  useEffect(() => {
    instantRotation.set(-active * 45)
  }, [active, instantRotation])

  const effectiveLeft = prefersReducedMotion ? "0vw" : left
  const effectiveScale = prefersReducedMotion ? scrolledScale : scale
  const effectiveRotation = prefersReducedMotion ? instantRotation : rotation

  // Mobile rotation = desktop rotation + 90° (so active lands at 6 o'clock, not 3).
  const mobileRotation = useTransform(rotation, (r) => r + MOBILE_ROTATION_OFFSET_DEG)
  const instantMobileRotation = useTransform(instantRotation, (r) => r + MOBILE_ROTATION_OFFSET_DEG)
  const effectiveMobileRotation = prefersReducedMotion ? instantMobileRotation : mobileRotation

  function handleClick(i: number) {
    programmaticScrollRef.current = true
    setActiveManual(i)
    const el = document.getElementById(SECTIONS[i].id)
    if (el) {
      el.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      })
    }
    window.setTimeout(() => {
      programmaticScrollRef.current = false
    }, 900)
  }

  return (
    <>
      <motion.div
        role="navigation"
        aria-label="Sayfa içi gezinti"
        className="pointer-events-none fixed top-1/2 z-40 hidden h-[500px] w-[500px] lg:block"
        style={{
          left: effectiveLeft,
          x: "-50%",
          y: "-50%",
          scale: effectiveScale,
          transformOrigin: "center",
          willChange: "transform",
        }}
      >
        <svg
          viewBox={`0 0 ${BASE_SIZE} ${BASE_SIZE}`}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="concave-knob" cx="50%" cy="50%" r="55%">
              <stop offset="0%"   stopColor="#4aa5ff" />
              <stop offset="55%"  stopColor="#2798ff" />
              <stop offset="100%" stopColor="#1a7de8" />
            </radialGradient>
          </defs>

          <circle cx={CX} cy={CY} r={248} fill="none" stroke="#2798ff" strokeOpacity={0.4} strokeWidth={1} />
          <path d={DESKTOP_BEZEL_PATH} fill="#FFFFFF" stroke="#2798ff" strokeOpacity={0.5} strokeWidth={2} />
          <circle cx={CX} cy={CY} r={185} fill="url(#concave-knob)" />
          <circle cx={CX} cy={CY} r={6} fill="#FFFFFF" />
        </svg>

        <motion.div
          className="absolute inset-0"
          style={{ rotate: effectiveRotation, willChange: "transform" }}
        >
          {SECTIONS.map((s, i) => (
            <DialProgram
              key={s.id}
              section={s}
              index={i}
              activeIndex={active}
              ringRotation={effectiveRotation}
              onClick={handleClick}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Mobile: same dial, half-clipped top, active label at 6 o'clock, bezel bump at 6 o'clock. */}
      <motion.div
        role="navigation"
        aria-label="Sayfa içi gezinti"
        className="pointer-events-none fixed left-1/2 top-0 z-40 h-[500px] w-[500px] lg:hidden"
        style={{
          x: "-50%",
          y: "-50%",
          scale: mobileScale,
          transformOrigin: "center",
          willChange: "transform",
        }}
      >
        <svg
          viewBox={`0 0 ${BASE_SIZE} ${BASE_SIZE}`}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="concave-knob-mobile" cx="50%" cy="50%" r="55%">
              <stop offset="0%"   stopColor="#4aa5ff" />
              <stop offset="55%"  stopColor="#2798ff" />
              <stop offset="100%" stopColor="#1a7de8" />
            </radialGradient>
          </defs>

          <circle cx={CX} cy={CY} r={248} fill="none" stroke="#2798ff" strokeOpacity={0.4} strokeWidth={1} />
          <path d={MOBILE_BEZEL_PATH} fill="#FFFFFF" stroke="#2798ff" strokeOpacity={0.5} strokeWidth={2} />
          <circle cx={CX} cy={CY} r={185} fill="url(#concave-knob-mobile)" />
          <circle cx={CX} cy={CY} r={6} fill="#FFFFFF" />
        </svg>

        <motion.div
          className="absolute inset-0"
          style={{ rotate: effectiveMobileRotation, willChange: "transform" }}
        >
          {SECTIONS.map((s, i) => (
            <DialProgram
              key={s.id}
              section={s}
              index={i}
              activeIndex={active}
              ringRotation={effectiveMobileRotation}
              onClick={handleClick}
            />
          ))}
        </motion.div>
      </motion.div>
    </>
  )
}
