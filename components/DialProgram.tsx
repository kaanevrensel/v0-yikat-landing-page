"use client"

import { motion, type MotionValue, useTransform } from "framer-motion"
import { type Section } from "@/lib/sections"

interface DialProgramProps {
  section: Section
  index: number
  activeIndex: number
  /** Label ring rotation (degrees). Pass through from parent for counter-rotation. */
  ringRotation: MotionValue<number>
  /** Radius in viewBox units (0..250 where dial container is 500x500). Default 205 (inside bezel annulus). */
  radius?: number
  onClick: (index: number) => void
}

export function DialProgram({
  section,
  index,
  activeIndex,
  ringRotation,
  radius = 215,
  onClick,
}: DialProgramProps) {
  const isActive = index === activeIndex
  const rad = (section.angle * Math.PI) / 180
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius

  const counterRotation = useTransform(ringRotation, r => -r)

  const colorClass = isActive
    ? section.highlight
      ? "text-[#2798ff]"
      : "text-[#0F172A]"
    : "text-[#0F172A]/50"

  const sizeClass = isActive
    ? "text-[15px] tracking-[0.16em]"
    : "text-[12px] tracking-[0.12em]"

  const weightClass = isActive ? "font-bold" : "font-normal"

  return (
    <motion.button
      type="button"
      onClick={() => onClick(index)}
      aria-label={section.ariaLabel}
      aria-current={isActive ? "location" : undefined}
      className={`absolute left-1/2 top-1/2 whitespace-nowrap rounded-sm px-2 py-1 outline-none transition-[font-size,color,letter-spacing,font-weight] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#2798ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF7] ${colorClass} ${sizeClass} ${weightClass}`}
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
