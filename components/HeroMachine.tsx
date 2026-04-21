"use client"

import Image from "next/image"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"

/**
 * Layered hero visual: photograph of a washing machine + CSS-animated drum
 * overlay + a slot where the DialNavigator's knob is visually positioned
 * during hero state.
 *
 * The knob itself is rendered by DialNavigator (fixed-position). This
 * component does NOT own the knob — it owns the photograph and drum only,
 * and provides a visual anchor position for where the knob *appears* to
 * sit on the photo. The knob morphs out of this position on scroll.
 */
export function HeroMachine() {
  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 380], [1, 0], { clamp: true })
  const effectiveOpacity = prefersReducedMotion ? 0 : opacity

  return (
    <motion.div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#E5E7EB]"
      style={{ opacity: effectiveOpacity }}
      aria-hidden="true"
    >
      {/* Layer 1: photograph */}
      <Image
        src="/hero-machine.jpg"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 480px, 100vw"
        className="object-cover"
      />

      {/* Layer 2: drum — rotating CSS overlay inside the photograph's drum window.
          Position values (top/left/size) are tuned to match the photo's drum position.
          ADJUST these three values to match the final asset. */}
      <div
        className="absolute rounded-full opacity-40 mix-blend-multiply drum-spin"
        style={{
          top: "30%",
          left: "30%",
          width: "40%",
          aspectRatio: "1",
          background: "radial-gradient(circle at 50% 50%, transparent 60%, rgba(15,23,42,0.15) 62%, transparent 64%), radial-gradient(circle at 30% 70%, rgba(15,23,42,0.25), transparent 40%), radial-gradient(circle at 70% 30%, rgba(15,23,42,0.2), transparent 35%)",
        }}
      />
    </motion.div>
  )
}
