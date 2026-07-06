"use client"

// reactbits.dev ScrollFloat deseninden ilhamla temiz-oda yazım (RB lisansı MIT+Commons Clause
// olduğundan kaynak kopyalanmadı; orijinal gsap+ScrollTrigger tabanlıydı — framer-motion'a yeniden
// tasarlandı). Yumuşatılmış doz: squash-stretch (scaleY 2.3) ve back-overshoot bilinçle yok;
// karakterler verilen scroll penceresine scrub'lı, kademeli süzülür. Hook disiplini: karakter başına
// hook'lar FloatChar alt bileşeninde yaşar (text sabit → eleman sayısı render'lar arası sabit).
import { motion, useTransform, type MotionValue } from "framer-motion"

type ScrollFloatTextProps = {
  text: string
  progress: MotionValue<number>
  /** Kaskadın yaşadığı scroll penceresi (progress 0-1 uzayında): [girişBaşı, tamGörünür]. */
  range: readonly [number, number]
}

function FloatChar({
  char,
  progress,
  from,
  to,
}: {
  char: string
  progress: MotionValue<number>
  from: number
  to: number
}) {
  const y = useTransform(progress, [from, to], ["0.6em", "0em"])
  const opacity = useTransform(progress, [from, to], [0, 1])
  const scaleY = useTransform(progress, [from, to], [1.12, 1])
  return (
    // whitespace-pre: inline-block span sondaki boşluğu kırpar (2026-07-06 BlurText dersi).
    <motion.span className="inline-block origin-bottom whitespace-pre" style={{ y, opacity, scaleY }}>
      {char}
    </motion.span>
  )
}

export function ScrollFloatText({ text, progress, range }: ScrollFloatTextProps) {
  const chars = Array.from(text)
  const [start, end] = range
  const windowSize = end - start
  // Her karakter pencerenin %55'ini kullanır; başlangıç anları kalan %45'e eşit yayılır —
  // son karakter tam `end`'de yerine oturur (blok, sahnenin "tam görünür" anıyla senkron).
  const charSpan = windowSize * 0.55
  const step = chars.length > 1 ? (windowSize - charSpan) / (chars.length - 1) : 0
  return (
    <>
      {/* Ekran okuyucu bütün metni buradan okur; animasyonlu span'ler dekoratif.
          (aria-label <p> üzerinde güvenilmez — blur-text.tsx'teki not.) */}
      <span className="sr-only">{text}</span>
      <span aria-hidden className="contents">
        {chars.map((c, i) => (
          <FloatChar
            key={`${c}-${i}`}
            char={c}
            progress={progress}
            from={start + i * step}
            to={start + i * step + charSpan}
          />
        ))}
      </span>
    </>
  )
}
