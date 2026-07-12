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

// Otomatik hero videosu (2026-07-12 sahip kararları: scroll-scrub → autoplay loop; mobil de
// keyframe döngüsü değil videoyu oynatır — md kapısı kaldırıldı). SSR'da render edilmez
// (src, mount + window 'load' sonrası atanır; hydration güvenli); canplaythrough gelene dek
// görünmez — altındaki statik keyframe katmanları + zamanlayıcı tam deneyim sunar. Oynamaya
// başlayınca sahne metinlerini video saatine bağlar (onSceneChange), zamanlayıcıyı devre dışı
// bırakır. Dikey ekranda object-cover merkez kırpımı 16:9 karenin ~500px'lik orta kolonunu
// gösterir — ön ayakkabı 4 sahnede de bu bantta (2026-07-12 kare kare doğrulandı, ffmpeg
// crop önizlemeleri), object-position gerekmez.
export function HeroAutoVideo({
  onSceneChange,
  onDrivingChange,
}: {
  onSceneChange: (i: number) => void
  onDrivingChange: (driving: boolean) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
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

  // Hazır olunca oynat ve metin saatini devral; autoplay reddedilirse (örn. iOS Düşük Güç
  // Modu, veri tasarrufu ayarları) zamanlayıcı keyframe döngüsüne geri düş.
  useEffect(() => {
    if (!ready) return
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
  }, [ready, onSceneChange, onDrivingChange])

  if (!src) return null

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
