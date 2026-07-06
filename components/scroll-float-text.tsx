"use client"

// reactbits.dev ScrollFloat deseninden ilhamla temiz-oda yazım (RB lisansı MIT+Commons Clause
// olduğundan kaynak kopyalanmadı; orijinal gsap+ScrollTrigger tabanlıydı — framer-motion'a yeniden
// tasarlandı). Yumuşatılmış doz: squash-stretch (scaleY 2.3) ve back-overshoot bilinçle yok;
// karakterler verilen scroll penceresine scrub'lı, kademeli süzülür. Hook disiplini: karakter başına
// hook'lar FloatChar alt bileşeninde yaşar (text sabit → eleman sayısı render'lar arası sabit).
import { Fragment } from "react"
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
  const totalChars = Array.from(text).length
  const [start, end] = range
  const windowSize = end - start
  // Her karakter pencerenin %55'ini kullanır; başlangıç anları kalan %45'e eşit yayılır —
  // son karakter tam `end`'de yerine oturur (blok, sahnenin "tam görünür" anıyla senkron).
  const charSpan = windowSize * 0.55
  const step = totalChars > 1 ? (windowSize - charSpan) / (totalChars - 1) : 0

  // Kelime bazlı gruplama: inline-block karakter span'leri her karakter arasına satır kırma
  // fırsatı açar ve mobilde başlık kelime ortasından bölünürdü ("Aynı gün ter / temiz teslim.").
  // Karakterler whitespace-nowrap kelime sarmalayıcılarında yaşar; kırılma yalnız boşluklarda.
  // Kaskad zamanlaması global karakter indeksiyle (boşluklar dahil) hesaplanır — davranış aynı.
  const words: { word: string; startIndex: number }[] = []
  {
    let idx = 0
    for (const w of text.split(" ")) {
      words.push({ word: w, startIndex: idx })
      idx += Array.from(w).length + 1 // +1: kelimeyi izleyen boşluk
    }
  }

  return (
    <>
      {/* Ekran okuyucu bütün metni buradan okur; animasyonlu span'ler dekoratif.
          (aria-label <p> üzerinde güvenilmez — blur-text.tsx'teki not.) */}
      <span className="sr-only">{text}</span>
      <span aria-hidden className="contents">
        {words.map(({ word, startIndex }, wi) => (
          <Fragment key={`${word}-${wi}`}>
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((c, ci) => {
                const i = startIndex + ci
                return (
                  <FloatChar
                    key={`${c}-${i}`}
                    char={c}
                    progress={progress}
                    from={start + i * step}
                    to={start + i * step + charSpan}
                  />
                )
              })}
            </span>
            {/* Kelimeler arası boşluk sarmalayıcının DIŞINDA: inline-block içindeki son boşluk
                kırpılır (BlurText dersi) ve satır kırılma fırsatı yalnız burada olmalı. */}
            {wi < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </>
  )
}
