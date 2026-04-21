"use client"

import { motion, useReducedMotion } from "framer-motion"
import { revealItem } from "@/components/SectionReveal"

interface SectionEmojiProps {
  /** Native emoji character as placeholder (e.g., "🧺"). */
  emoji: string
  /** Section id — used to pick a PNG at /public/emojis/{id}.png if it exists. */
  id: string
  /** Index 0..6 used to calculate breathing phase offset so emojis don't pulse in unison. */
  index: number
  /** Accessible label (the emoji is decorative, so this is usually empty). */
  alt?: string
}

/**
 * Per-section 3D emoji. Placeholder renders the native OS emoji via `<span>`.
 * Will be swapped to a PNG at `/public/emojis/{id}.png` in a future iteration;
 * the `id` prop is reserved for that swap.
 *
 * Breathing animation: scale(1) ↔ scale(1.03), 3.5s ease-in-out. Each section
 * has a phase offset of `index * 438ms` (≈ 3500/8) so 7 emojis pulse at
 * different points in the cycle. Reduced-motion renders static size only.
 */
export function SectionEmoji({ emoji, id, index, alt = "" }: SectionEmojiProps) {
  const prefersReducedMotion = useReducedMotion()
  const phaseDelay = `-${index * 438}ms` // negative offset starts each emoji mid-cycle

  return (
    <motion.div
      variants={revealItem}
      className="flex items-start justify-center md:justify-end"
    >
      {/* Kept as plain <span> (not motion.span) so the CSS `transform: scale(...)`
          from emoji-breathe doesn't collide with Framer's transform on the parent
          motion.div. Wrapping this in a motion element would clobber the animation. */}
      <span
        aria-hidden={alt === "" || undefined}
        aria-label={alt || undefined}
        role={alt ? "img" : undefined}
        className={prefersReducedMotion ? "emoji-static" : "emoji-breathe"}
        style={{
          display: "inline-block",
          transformOrigin: "center",
          willChange: "transform",
          animationDelay: prefersReducedMotion ? undefined : phaseDelay,
        }}
      >
        {emoji}
      </span>
    </motion.div>
  )
}
