"use client"

import { useEffect, useRef, useState } from "react"
import { useMotionValueEvent, type MotionValue } from "framer-motion"

// ffprobe ile ölçülen video süresi (saniye).
const VIDEO_DURATION = 12.13

// Doğrusal eşleme (kullanıcı kararı, 2026-07-05): video scroll ile birebir eş zamanlı
// akar, hiç durmaz — "durup hızlı geçme" hissi veren parçalı hold eşlemesi kaldırıldı.
function scrollToTime(v: number): number {
  return Math.min(Math.max(v, 0), 1) * VIDEO_DURATION
}

// Masaüstü scrub katmanı: SSR'da ve <md'de hiç render edilmez (hydration güvenli);
// canplaythrough gelene dek görünmez — altındaki statik keyframe katmanları tam deneyim sunar.
export function HeroScrubVideo({ progress }: { progress: MotionValue<number> }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const targetTime = useRef(0)
  const [ready, setReady] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [src, setSrc] = useState<string | null>(null)

  // Video LCP ile bant genişliği yarışmasın: src ancak window 'load' SONRASI atanır
  // (keyframe fallback o ana dek tam deneyim). ~3.4MB optimize encode (1536px, CRF26, GOP12).
  useEffect(() => {
    const start = () => setSrc("/videos/hero-scrub.mp4")
    if (document.readyState === "complete") {
      start()
      return
    }
    window.addEventListener("load", start, { once: true })
    return () => window.removeEventListener("load", start)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const update = () => {
      setIsDesktop(mq.matches)
      // md sınırından çıkınca video unmount olur; yeni mount tekrar canplaythrough beklemeli.
      if (!mq.matches) setReady(false)
    }
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  useMotionValueEvent(progress, "change", (v) => {
    targetTime.current = scrollToTime(v)
  })

  // Seek gecikmesini maskeleyen lerp: her frame hedefe %18 yaklaş.
  useEffect(() => {
    if (!isDesktop || !ready) return
    const video = videoRef.current
    if (!video) return
    targetTime.current = scrollToTime(progress.get())
    let raf = 0
    const tick = () => {
      // Gerçek süre sabitten kısaysa (yeniden encode vb.) süre sonunda seek fırtınası olmasın.
      const cap = Number.isFinite(video.duration) && video.duration > 0 ? video.duration - 0.05 : VIDEO_DURATION
      const diff = Math.min(targetTime.current, cap) - video.currentTime
      if (Math.abs(diff) > 0.01) video.currentTime = video.currentTime + diff * 0.18
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isDesktop, ready, progress])

  if (!isDesktop || !src) return null

  return (
    <video
      ref={videoRef}
      aria-hidden
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      onCanPlayThrough={() => setReady(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
      src={src}
    />
  )
}
