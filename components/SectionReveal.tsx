"use client"

import { motion, type Variants } from "framer-motion"
import { type ReactNode } from "react"

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
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
