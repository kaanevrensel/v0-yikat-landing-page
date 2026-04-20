"use client"

import { motion, type MotionValue, useTransform } from "framer-motion"
import { type Section } from "@/lib/sections"

interface DialProgramProps {
  section: Section
  index: number
  activeIndex: number
  /** Label ring rotation (degrees). Pass through from parent for counter-rotation. */
  ringRotation: MotionValue<number>
  /** Radius in viewBox units (0..250 where dial container is 500x500). Default 220. */
  radius?: number
  onClick: (index: number) => void
}

export function DialProgram({
  section,
  index,
  activeIndex,
  ringRotation,
  radius = 220,
  onClick,
}: DialProgramProps) {
  const isActive = index === activeIndex
  // Position on ring: base angle i*45° (clockwise from 3 o'clock).
  const rad = (section.angle * Math.PI) / 180
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius

  // Counter-rotate so text stays upright while ring rotates
  const counterRotation = useTransform(ringRotation, r => -r)

  const colorClass = isActive
    ? section.highlight
      ? "text-[#2798ff]"
      : "text-[#0F172A]"
    : "text-[#0F172A]/30"

  const weightClass = isActive ? "font-semibold" : "font-normal"

  return (
    <motion.button
      type="button"
      onClick={() => onClick(index)}
      aria-label={section.ariaLabel}
      aria-current={isActive ? "location" : undefined}
      className={`absolute left-1/2 top-1/2 whitespace-nowrap rounded-sm px-2 py-1 font-serif text-sm tracking-[0.08em] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#2798ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF7] ${colorClass} ${weightClass}`}
      style={{
        x: x,
        y: y,
        translateX: "-50%",
        translateY: "-50%",
        rotate: counterRotation,
        pointerEvents: "auto",
        willChange: "transform",
      }}
    >
      {section.label}
    </motion.button>
  )
}
