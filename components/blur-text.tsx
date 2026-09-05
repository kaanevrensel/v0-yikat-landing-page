"use client"

// reactbits.dev BlurText deseninden ilhamla temiz-oda yazım (RB lisansı MIT+Commons Clause
// olduğundan kaynak kopyalanmadı). Kelime/karakter bazlı blur-reveal — hero metin diliyle aynı aksan.
import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

type BlurTextProps = {
  text: string
  as?: "h2" | "p"
  delay?: number // birim başına ms
  animateBy?: "words" | "characters"
  className?: string
}

const item = {
  // Readable by default, including SSR or a failed observer. Motion starts only
  // when in view and never owns the heading's visibility.
  visible: { y: [6, 0], filter: ["blur(2px)", "blur(0px)"], transition: { duration: 0.45, ease: "easeOut" as const } },
}

export default function BlurText({ text, as = "h2", delay = 60, animateBy = "words", className }: BlurTextProps) {
  const prefersReduced = useReducedMotion()
  // Hydration güvenliği: SSR'da useReducedMotion null döner — reduced-motion dalına ancak
  // mount SONRASI geçilir ki sunucu ve ilk istemci render DOM'u hep aynı (animasyonlu) yapı olsun.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const Tag = as
  if (prefersReduced && mounted) return <Tag className={className}>{text}</Tag>

  const units = animateBy === "words" ? text.split(" ") : Array.from(text)
  const MotionTag = as === "h2" ? motion.h2 : motion.p

  return (
    <MotionTag
      initial={false}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ visible: { transition: { staggerChildren: delay / 1000 } } }}
      className={className}
    >
      {/* One accessible string works for paragraphs and headings alike. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden className="contents">
        {units.map((u, i) => (
          // whitespace-pre: inline-block span'in SONUNDAKİ boşluk normalde kırpılır — kelimeler
          // görsel olarak birleşirdi ("Üçadımda,aynıgün"); pre bunu korur.
          <motion.span key={`${u}-${i}`} variants={item} className="inline-block whitespace-pre">
            {u}
            {animateBy === "words" && i < units.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </span>
    </MotionTag>
  )
}
