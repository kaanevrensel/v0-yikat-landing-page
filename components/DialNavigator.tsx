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
const KNOB_R = 160                   // reduced from 185 — solid knob, no bezel

// Indicator: short radial white line INSIDE the knob. With strokeLinecap="round"
// the outer rounded cap intentionally overshoots KNOB_R by ~strokeWidth/2 so the
// tip "kisses" the edge instead of sinking inside it — don't inset by stroke/2.
const INDICATOR_LENGTH = 18         // 11.25% of KNOB_R (inside 8-12% target range)
const INDICATOR_STROKE = 3.5
const INDICATOR_OUTER_R = KNOB_R    // tip at knob edge = 160
const INDICATOR_INNER_R = KNOB_R - INDICATOR_LENGTH  // 142

// Mobile: labels rotate 90° so active lands at 6 o'clock, not 3.
const MOBILE_ROTATION_OFFSET_DEG = 90

// ---------- Size constants (CSS pixels) ----------
const BASE_SIZE = 500                       // container footprint (matches viewBox)
const HERO_SIZE = 380                       // visible diameter at hero
const HERO_SCALE = HERO_SIZE / BASE_SIZE    // 0.76
const SCROLLED_PADDING = 40                 // 20px top + 20px bottom
const MIN_SCROLLED_SIZE = 420               // clamp floor for short viewports
const MOBILE_HERO_DIAL_VW = 70              // full diameter at hero state (fully visible, centered)
const MOBILE_SCROLLED_DIAL_VW = 100         // full diameter when scrolled (top-clipped, edge-to-edge)
const MOBILE_HERO_TOP_PCT = 30              // center at 30% of viewport height in hero state

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
  const mobileHeroScale = (MOBILE_HERO_DIAL_VW / 100 * viewport.w) / BASE_SIZE
  const mobileScrolledScale = (MOBILE_SCROLLED_DIAL_VW / 100 * viewport.w) / BASE_SIZE

  const rotationTarget = useMotionValue(0)
  const rotation = useSpring(rotationTarget, { stiffness: 60, damping: 20 })

  useEffect(() => {
    rotationTarget.set(-active * 45)
  }, [active, rotationTarget])

  const { scrollY } = useScroll()
  const rawProgress = useTransform(scrollY, [120, 380], [0, 1], { clamp: true })
  const easedProgress = useTransform(rawProgress, easeInOutCubic)
  const morphProgress = useSpring(easedProgress, { stiffness: 50, damping: 20 })

  // Indicator: hidden in hero (opacity 0), fades in with the morph spring, fully visible when scrolled.
  const indicatorOpacity = useTransform(morphProgress, [0, 1], [0, 1])
  const effectiveIndicatorOpacity = prefersReducedMotion ? 1 : indicatorOpacity

  const left = useTransform(morphProgress, [0, 1], ["50vw", "0vw"])
  const scale = useTransform(morphProgress, [0, 1], [HERO_SCALE, scrolledScale])

  // Mobile morph: hero (fully visible, centered ~30% from top, 70vw) → scrolled (top-clipped, 100vw).
  const mobileTop = useTransform(morphProgress, [0, 1], [`${MOBILE_HERO_TOP_PCT}%`, "0%"])
  const mobileScale = useTransform(morphProgress, [0, 1], [mobileHeroScale, mobileScrolledScale])

  const instantRotation = useMotionValue(-active * 45)
  useEffect(() => {
    instantRotation.set(-active * 45)
  }, [active, instantRotation])

  const effectiveLeft = prefersReducedMotion ? "0vw" : left
  const effectiveScale = prefersReducedMotion ? scrolledScale : scale
  const effectiveRotation = prefersReducedMotion ? instantRotation : rotation

  const effectiveMobileTop = prefersReducedMotion ? "0%" : mobileTop
  const effectiveMobileScale = prefersReducedMotion ? mobileScrolledScale : mobileScale

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

          <circle cx={CX} cy={CY} r={KNOB_R} fill="url(#concave-knob)" />

          <motion.line
            x1={CX + INDICATOR_INNER_R}
            y1={CY}
            x2={CX + INDICATOR_OUTER_R}
            y2={CY}
            stroke="#FFFFFF"
            strokeWidth={INDICATOR_STROKE}
            strokeLinecap="round"
            style={{ opacity: effectiveIndicatorOpacity }}
          />
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

      {/* Mobile: same dial, morphs from fully-visible center (hero) to top-clipped (scrolled). Active at 6 o'clock. */}
      <motion.div
        role="navigation"
        aria-label="Sayfa içi gezinti"
        className="pointer-events-none fixed left-1/2 z-40 h-[500px] w-[500px] lg:hidden"
        style={{
          top: effectiveMobileTop,
          x: "-50%",
          y: "-50%",
          scale: effectiveMobileScale,
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

          <circle cx={CX} cy={CY} r={KNOB_R} fill="url(#concave-knob-mobile)" />

          <motion.line
            x1={CX}
            y1={CY + INDICATOR_INNER_R}
            x2={CX}
            y2={CY + INDICATOR_OUTER_R}
            stroke="#FFFFFF"
            strokeWidth={INDICATOR_STROKE}
            strokeLinecap="round"
            style={{ opacity: effectiveIndicatorOpacity }}
          />
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
