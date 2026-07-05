"use client"

// reactbits.dev BlurText deseninden ilhamla temiz-oda yazım (RB lisansı MIT+Commons Clause
// olduğundan kaynak kopyalanmadı). Kelime/karakter bazlı blur-reveal — hero metin diliyle aynı aksan.
import { motion, useReducedMotion } from "framer-motion"

type BlurTextProps = {
  text: string
  as?: "h2" | "p"
  delay?: number // birim başına ms
  animateBy?: "words" | "characters"
  className?: string
}

const item = {
  hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: "easeOut" as const } },
}

export default function BlurText({ text, as = "h2", delay = 60, animateBy = "words", className }: BlurTextProps) {
  const prefersReduced = useReducedMotion()
  const Tag = as
  if (prefersReduced) return <Tag className={className}>{text}</Tag>

  const units = animateBy === "words" ? text.split(" ") : Array.from(text)
  const MotionTag = as === "h2" ? motion.h2 : motion.p

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: delay / 1000 } } }}
      className={className}
    >
      {units.map((u, i) => (
        <motion.span key={`${u}-${i}`} variants={item} className="inline-block will-change-transform">
          {u}
          {animateBy === "words" && i < units.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </MotionTag>
  )
}
