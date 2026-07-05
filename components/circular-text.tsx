"use client"

// reactbits.dev CircularText deseninden ilhamla temiz-oda yazım — SVG textPath ile dönen damga.
import { useId } from "react"
import { motion, useReducedMotion } from "framer-motion"

type CircularTextProps = { text: string; spinDuration?: number; className?: string }

export default function CircularText({ text, spinDuration = 30, className }: CircularTextProps) {
  const id = useId()
  const prefersReduced = useReducedMotion()

  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 100 100"
      className={className}
      animate={prefersReduced ? undefined : { rotate: 360 }}
      transition={prefersReduced ? undefined : { duration: spinDuration, repeat: Infinity, ease: "linear" }}
    >
      <defs>
        <path id={id} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
      </defs>
      <text className="fill-current uppercase">
        <textPath href={`#${id}`}>{text}</textPath>
      </text>
    </motion.svg>
  )
}
