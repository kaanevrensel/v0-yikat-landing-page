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

// Mobile: labels rotate 90° so active lands at 6 o'clock, not 3.
const MOBILE_ROTATION_OFFSET_DEG = 90

// ---------- Size constants (CSS pixels) ----------
const BASE_SIZE = 500                       // container footprint (matches viewBox)
const HERO_SIZE = 110                       // visible diameter at hero (matches photo's knob on-screen)
const HERO_SCALE = HERO_SIZE / BASE_SIZE    // 0.22
const SCROLLED_PADDING = 40                 // 20px top + 20px bottom
const MIN_SCROLLED_SIZE = 420               // clamp floor for short viewports
const MOBILE_HERO_DIAL_VW = 70              // full diameter at hero state (fully visible, centered)
const MOBILE_SCROLLED_DIAL_VW = 100         // full diameter when scrolled (top-clipped, edge-to-edge)
const MOBILE_HERO_TOP_PCT = 30              // center at 30% of viewport height in hero state

// Hero state (desktop): knob visually overlays the photograph's physical knob on the left half.
// 30vw lands roughly in the center of the left column on a max-w-1400 grid at wider viewports.
const HERO_LEFT_VW = 30
// Hero state (desktop): knob sits at ~40% from top (aligns with photograph's knob position).
const HERO_TOP_PCT = 40

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

  const left = useTransform(morphProgress, [0, 1], [`${HERO_LEFT_VW}vw`, "0vw"])
  const top = useTransform(morphProgress, [0, 1], [`${HERO_TOP_PCT}%`, "50%"])
  const scale = useTransform(morphProgress, [0, 1], [HERO_SCALE, scrolledScale])

  // Mobile morph: hero (fully visible, centered ~30% from top, 70vw) → scrolled (top-clipped, 100vw).
  const mobileTop = useTransform(morphProgress, [0, 1], [`${MOBILE_HERO_TOP_PCT}%`, "0%"])
  const mobileScale = useTransform(morphProgress, [0, 1], [mobileHeroScale, mobileScrolledScale])

  const instantRotation = useMotionValue(-active * 45)
  useEffect(() => {
    instantRotation.set(-active * 45)
  }, [active, instantRotation])

  const effectiveLeft = prefersReducedMotion ? "0vw" : left
  const effectiveTop = prefersReducedMotion ? "50%" : top
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
        className="pointer-events-none fixed z-40 hidden h-[500px] w-[500px] lg:block"
        style={{
          left: effectiveLeft,
          top: effectiveTop,
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
            <linearGradient id="dial-knobBody-desktop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#5AA8FF" />
              <stop offset="40%"  stopColor="#2E86F0" />
              <stop offset="75%"  stopColor="#1A63C4" />
              <stop offset="100%" stopColor="#0D3F86" />
            </linearGradient>
            <linearGradient id="dial-knobTop-desktop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#6EB6FF" />
              <stop offset="100%" stopColor="#1E6DCC" />
            </linearGradient>
          </defs>

          <circle cx={CX} cy={CY} r={KNOB_R} fill="url(#dial-knobBody-desktop)" />
          <circle cx={CX} cy={CY} r={130} fill="url(#dial-knobTop-desktop)" />
          <circle cx={CX} cy={CY} r={8.4} fill="#F4F6FA" />

          <motion.rect
            x={CX - 6.85}
            y={CY - 115}
            width={13.7}
            height={42}
            rx={6.1}
            fill="#F4F6FA"
            opacity={0.9}
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
            <linearGradient id="dial-knobBody-mobile" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#5AA8FF" />
              <stop offset="40%"  stopColor="#2E86F0" />
              <stop offset="75%"  stopColor="#1A63C4" />
              <stop offset="100%" stopColor="#0D3F86" />
            </linearGradient>
            <linearGradient id="dial-knobTop-mobile" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#6EB6FF" />
              <stop offset="100%" stopColor="#1E6DCC" />
            </linearGradient>
          </defs>

          <circle cx={CX} cy={CY} r={KNOB_R} fill="url(#dial-knobBody-mobile)" />
          <circle cx={CX} cy={CY} r={130} fill="url(#dial-knobTop-mobile)" />
          <circle cx={CX} cy={CY} r={8.4} fill="#F4F6FA" />

          <motion.rect
            x={CX - 6.85}
            y={CY + 73}
            width={13.7}
            height={42}
            rx={6.1}
            fill="#F4F6FA"
            opacity={0.9}
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
