"use client"

import { motion, type MotionValue, useTransform } from "framer-motion"
import { type Section } from "@/lib/sections"

interface DialProgramProps {
  section: Section
  index: number
  activeIndex: number
  /** Label ring rotation (degrees). Pass through from parent for counter-rotation. */
  ringRotation: MotionValue<number>
  /** Radius in viewBox units (0..250 where dial container is 500x500). Default 215 (outside the 160-radius knob). */
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

  const colorClass = section.highlight
    ? "text-[#2798ff]"
    : "text-[#0F172A]"

  const sizeClass = "text-[15px] tracking-[0.16em]"
  const weightClass = "font-semibold"

  // Hero brand mark: "YIKAT" renders bigger than other labels (brand wordmark presence).
  const isBrandMark = section.id === "basla"
  const finalSizeClass = isBrandMark
    ? "text-[26px] tracking-[0.16em]"
    : sizeClass

  return (
    <motion.button
      type="button"
      onClick={() => onClick(index)}
      aria-label={section.ariaLabel}
      aria-current={isActive ? "location" : undefined}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
      className={`absolute left-1/2 top-1/2 whitespace-nowrap rounded-sm px-2 py-1 outline-none transition-opacity duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#2798ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF7] ${colorClass} ${finalSizeClass} ${weightClass}`}
      style={{
        x: x,
        y: y,
        translateX: "-50%",
        translateY: "-50%",
        rotate: counterRotation,
        pointerEvents: isActive ? "auto" : "none",
        opacity: isActive ? 1 : 0,
        willChange: "transform, opacity",
      }}
    >
      {section.label}
    </motion.button>
  )
}
