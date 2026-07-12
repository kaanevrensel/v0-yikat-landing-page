"use client"

import { useEffect, useRef, useState } from "react"

// Videonun sahne "anları" 0 / 4 / 8 / 12 sn (3 geçiş klibinin sınırları, ffprobe süre 12.13s).
// Metin, iki anın ortasında değişir — böylece her başlık kendi anının çevresinde okunur.
export function timeToScene(t: number): number {
  if (t < 2) return 0
  if (t < 6) return 1
  if (t < 10) return 2
  return 3
}

// Masaüstü otomatik hero videosu (2026-07-12 sahip kararı: scroll-scrub → autoplay loop).
// SSR'da ve <md'de hiç render edilmez (hydration güvenli); canplaythrough gelene dek görünmez —
// altındaki statik keyframe katmanları + zamanlayıcı tam deneyim sunar. Oynamaya başlayınca
// sahne metinlerini video saatine bağlar (onSceneChange), zamanlayıcıyı devre dışı bırakır.
export function HeroAutoVideo({
  onSceneChange,
  onDrivingChange,
}: {
  onSceneChange: (i: number) => void
  onDrivingChange: (driving: boolean) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [src, setSrc] = useState<string | null>(null)

  // Video LCP ile bant genişliği yarışmasın: src ancak window 'load' SONRASI atanır
  // (keyframe fallback o ana dek tam deneyim).
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

  // Hazır olunca oynat ve metin saatini devral; autoplay reddedilirse zamanlayıcıya geri düş.
  useEffect(() => {
    if (!isDesktop || !ready) return
    const video = videoRef.current
    if (!video) return
    let driving = false
    const onTime = () => onSceneChange(timeToScene(video.currentTime))
    video
      .play()
      .then(() => {
        driving = true
        onDrivingChange(true)
        video.addEventListener("timeupdate", onTime)
      })
      .catch(() => onDrivingChange(false))
    return () => {
      video.removeEventListener("timeupdate", onTime)
      if (driving) onDrivingChange(false)
    }
  }, [isDesktop, ready, onSceneChange, onDrivingChange])

  if (!isDesktop || !src) return null

  return (
    <video
      ref={videoRef}
      aria-hidden
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      disablePictureInPicture
      onCanPlayThrough={() => setReady(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
      src={src}
    />
  )
}
