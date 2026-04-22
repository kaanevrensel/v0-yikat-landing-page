"use client"

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { WashingMachine } from "@/components/WashingMachine"

export function HeroMachine() {
  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 380], [1, 0], { clamp: true })
  const effectiveOpacity = prefersReducedMotion ? 0 : opacity

  return (
    <motion.div
      className="relative w-full"
      style={{ opacity: effectiveOpacity }}
      aria-hidden="true"
    >
      <WashingMachine className="block h-auto w-full" />
    </motion.div>
  )
}
