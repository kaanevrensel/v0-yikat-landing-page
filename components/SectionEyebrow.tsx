"use client"

import { motion } from "framer-motion"
import { revealItem } from "@/components/SectionReveal"

interface SectionEyebrowProps {
  /** Angle in degrees (0..315) — the section's dial position. Mini knob rotates to match. */
  angle: number
  /** Display number, e.g. "01". */
  number: string
  /** Section label, e.g. "HİZMETLER". */
  label: string
  /** Additional className for the root wrapper (e.g., color overrides on dark sections). */
  className?: string
  /** Dark-mode variant: switches text colors for sections on dark bg (CTASection). */
  onDark?: boolean
}

/**
 * Section header "eyebrow" row: [mini knob, rotated to section angle] [01 ·] [LABEL] ──── rule ────
 * Mirrors the main dial's knob as a brand thread. Part of the "Knob Thread" decoration language.
 */
export function SectionEyebrow({ angle, number, label, className = "", onDark = false }: SectionEyebrowProps) {
  const textColor = onDark ? "text-white/80" : "text-[#64748B]"
  const ruleColor = onDark ? "bg-white/20" : "bg-[#E5E7EB]"

  return (
    <motion.div
      variants={revealItem}
      className={`flex items-center gap-3 ${className}`}
    >
      <svg
        viewBox="0 0 80 80"
        className="size-10 flex-shrink-0"
        style={{ transform: `rotate(${angle}deg)` }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`eyebrow-knob-${number}`} cx="50%" cy="50%" r="55%">
            <stop offset="0%"  stopColor="#4aa5ff" />
            <stop offset="55%" stopColor="#2798ff" />
            <stop offset="100%" stopColor="#1a7de8" />
          </radialGradient>
        </defs>
        <circle cx={40} cy={40} r={32} fill={`url(#eyebrow-knob-${number})`} />
      </svg>

      <span
        className={`text-[12px] font-semibold uppercase tracking-[0.16em] ${textColor}`}
      >
        {number} · {label}
      </span>

      <span className={`h-px flex-1 ${ruleColor} max-w-[240px]`} aria-hidden="true" />
    </motion.div>
  )
}
