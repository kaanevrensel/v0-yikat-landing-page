"use client"

import { motion, type Variants } from "framer-motion"
import { type ReactNode } from "react"

// RM handled by <MotionConfig reducedMotion="user"> in app/page.tsx — covers
// both the container wrapper animation and revealItem children. If used outside
// that wrapper, add useReducedMotion() here.
const container: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.11,
      delayChildren: 0.22,
    },
  },
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

interface SectionRevealProps {
  id: string
  ariaLabel?: string
  className?: string
  children: ReactNode
}

export function SectionReveal({ id, ariaLabel, className, children }: SectionRevealProps) {
  return (
    <motion.section
      id={id}
      aria-label={ariaLabel}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={className}
    >
      {children}
    </motion.section>
  )
}
