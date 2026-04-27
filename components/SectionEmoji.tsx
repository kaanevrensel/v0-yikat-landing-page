"use client"

import { motion, useReducedMotion } from "framer-motion"
import { revealItem } from "@/components/SectionReveal"

interface SectionEmojiProps {
  /** Native emoji character — fallback for sections without a PNG asset. */
  emoji: string
  /** Section id — resolves to /public/emojis/{id}.png when that file exists. */
  id: string
  /** Index 0..6 used to calculate breathing phase offset so emojis don't pulse in unison. */
  index: number
  /** Accessible label (the emoji is decorative, so this is usually empty). */
  alt?: string
}

// Sections that have a PNG at /public/emojis/{id}.png.
// Add an id here when its asset lands; other sections fall back to the native emoji span.
const PNG_SECTIONS = new Set(["hizmetler", "nasil"])

// RM handled by <MotionConfig reducedMotion="user"> in app/page.tsx — covers
// both the motion.div wrapper and the breathing CSS animation.
export function SectionEmoji({ emoji, id, index, alt = "" }: SectionEmojiProps) {
  const prefersReducedMotion = useReducedMotion()
  const phaseDelay = `-${index * 438}ms`
  const cls = prefersReducedMotion ? "emoji-static" : "emoji-breathe"
  const animStyle = {
    display: "inline-block" as const,
    transformOrigin: "center",
    willChange: "transform",
    animationDelay: prefersReducedMotion ? undefined : phaseDelay,
  }

  return (
    <motion.div
      variants={revealItem}
      className="flex items-start justify-center md:justify-end"
    >
      {PNG_SECTIONS.has(id) ? (
        <img
          src={`/emojis/${id}.png`}
          alt={alt}
          width={120}
          height={120}
          className={`${cls} w-20 md:w-[120px]`}
          style={animStyle}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span
          aria-hidden={alt === "" || undefined}
          aria-label={alt || undefined}
          role={alt ? "img" : undefined}
          className={cls}
          style={animStyle}
        >
          {emoji}
        </span>
      )}
    </motion.div>
  )
}
