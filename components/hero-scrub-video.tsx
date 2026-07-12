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

// Otomatik hero videosu — tüm ekranlarda (2026-07-12 sahip kararları: scroll-scrub → autoplay
// loop; mobil de videoyu oynatır; keyframe döngüsü YALNIZ videonun henüz/hiç oynayamadığı
// anların fallback'idir). mp4 faststart (moov önde) + canplay tetiği: ilk saniyeler iner inmez
// oynamaya başlar — canplaythrough beklemek 9.2MB'ın tamamını istiyordu ve mobil ağda uzun süre
// görsel döngü gösteriyordu (sahip geri bildirimi, 2026-07-12: "direk video oynasın").
// SSR'da render edilmez (src, mount + window 'load' sonrası atanır; hydration güvenli).
// Görünürlük fiili oynatmaya bağlı (playing): autoplay reddedilirse (örn. iOS Düşük Güç Modu)
// video görünmez kalır, zamanlayıcı keyframe döngüsü deneyimi taşımayı sürdürür. Oynamaya
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
  const [playing, setPlaying] = useState(false)
  const [src, setSrc] = useState<string | null>(null)

  // Video LCP ile bant genişliği yarışmasın: src ancak window 'load' SONRASI atanır
  // (ilk keyframe o ana dek poster görevi görür; sayfa hafif, load hızlı gelir).
  useEffect(() => {
    const start = () => setSrc("/videos/hero-scrub.mp4")
    if (document.readyState === "complete") {
      start()
      return
    }
    window.addEventListener("load", start, { once: true })
    return () => window.removeEventListener("load", start)
  }, [])

  // Oynayabilecek kadar veri gelir gelmez başlat ve metin saatini devral; autoplay
  // reddedilirse zamanlayıcı keyframe döngüsüne geri düş. İlk turda ağ takılırsa video
  // kısa süre duraklayıp kendiliğinden sürer (loop #2'den itibaren tamamı tamponda).
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
        setPlaying(true)
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
      onCanPlay={() => setReady(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
      src={src}
    />
  )
}
