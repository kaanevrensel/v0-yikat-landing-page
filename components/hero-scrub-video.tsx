"use client"

import { useEffect, useRef, useState } from "react"
import { useMotionValueEvent, type MotionValue } from "framer-motion"

// ffprobe ile ölçülen kümülatif klip sınırları (saniye): 3 klip × 4.0417 sn.
const CLIP_BOUNDS = [0, 4.04, 8.08, 12.13] as const

// WINDOWS crossfade pencereleriyle hizalı parçalı eşleme (spec §3):
// hold aralığında video keyframe'de durur, crossfade penceresinde ilgili klip oynar.
const SCROLL_STOPS = [0.19, 0.25, 0.44, 0.5, 0.69, 0.75] as const
const TIME_STOPS = [
  CLIP_BOUNDS[0], CLIP_BOUNDS[1],
  CLIP_BOUNDS[1], CLIP_BOUNDS[2],
  CLIP_BOUNDS[2], CLIP_BOUNDS[3],
] as const

function scrollToTime(v: number): number {
  if (v <= SCROLL_STOPS[0]) return TIME_STOPS[0]
  for (let i = 1; i < SCROLL_STOPS.length; i++) {
    if (v <= SCROLL_STOPS[i]) {
      const f = (v - SCROLL_STOPS[i - 1]) / (SCROLL_STOPS[i] - SCROLL_STOPS[i - 1])
      return TIME_STOPS[i - 1] + f * (TIME_STOPS[i] - TIME_STOPS[i - 1])
    }
  }
  return TIME_STOPS[TIME_STOPS.length - 1]
}

// Masaüstü scrub katmanı: SSR'da ve <md'de hiç render edilmez (hydration güvenli);
// canplaythrough gelene dek görünmez — altındaki statik keyframe katmanları tam deneyim sunar.
export function HeroScrubVideo({ progress }: { progress: MotionValue<number> }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const targetTime = useRef(0)
  const [ready, setReady] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const update = () => setIsDesktop(mq.matches)
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
      const diff = targetTime.current - video.currentTime
      if (Math.abs(diff) > 0.01) video.currentTime = video.currentTime + diff * 0.18
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isDesktop, ready, progress])

  if (!isDesktop) return null

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
      src="/videos/hero-scrub.mp4"
    />
  )
}
