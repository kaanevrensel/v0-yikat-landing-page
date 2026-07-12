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

// Otomatik hero videosu — tüm ekranlarda, SAYFA AÇILIR AÇILMAZ (sahip, 2026-07-12: "websitesini
// açar açmaz videonun oynaması lazım"). src SSR HTML'inde gömülüdür: tarayıcı dosyayı HTML
// parse sırasında keşfeder ve preload=auto ile hemen indirmeye başlar — hydration'ı bile
// beklemez (eski window-load kapısı LCP önceliğiyle konmuştu; sahip kararıyla video öncelikli).
// Dosya faststart (moov önde) + canplay tetiği: ilk saniyeler iner inmez oynar, 9.2MB'ın
// tamamı beklenmez. Görünürlük fiili oynatmaya bağlı (playing); oynatma engellenirse (iOS
// Düşük Güç Modu) veya medya hatasında onBlocked ile bildirir — keyframe zamanlayıcı döngüsü
// YALNIZ o zaman başlar (hero-scroll-story "bekleme" modu). Oynarken sahne metin saati video
// zamanıdır (onSceneChange). Dikey ekranda object-cover merkez kırpımı 16:9 karenin ~500px'lik
// orta kolonunu gösterir — ön ayakkabı 4 sahnede de bu bantta (2026-07-12 ffmpeg kare
// doğrulaması), object-position gerekmez.
export function HeroAutoVideo({
  onSceneChange,
  onPlaying,
  onBlocked,
}: {
  onSceneChange: (i: number) => void
  onPlaying: () => void
  onBlocked: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)

  // Hydration'dan ÖNCE olup biteni yakala: src SSR'da gömülü olduğundan canplay/error,
  // React handler'ları bağlanmadan ateşlenmiş olabilir (örn. önbellekten anında hazır video
  // veya erken medya hatası) — olay kaçtıysa mevcut duruma bakarak telafi et.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (video.error) {
      onBlocked()
      return
    }
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) setReady(true)
  }, [onBlocked])

  // Oynayabilecek kadar veri gelir gelmez başlat ve metin saatini devral. İlk turda ağ
  // takılırsa video kısa süre duraklayıp kendiliğinden sürer (loop #2'den itibaren tamamı
  // tamponda; ayrıca /videos/* immutable cache'li — yenilemede anında oynar).
  useEffect(() => {
    if (!ready) return
    const video = videoRef.current
    if (!video) return
    const onTime = () => onSceneChange(timeToScene(video.currentTime))
    video
      .play()
      .then(() => {
        setPlaying(true)
        onPlaying()
        video.addEventListener("timeupdate", onTime)
      })
      .catch(() => onBlocked())
    return () => video.removeEventListener("timeupdate", onTime)
  }, [ready, onSceneChange, onPlaying, onBlocked])

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
      onError={() => {
        // Medya hatası (codec/ağ): donmuş kare keyframe'lerin üstünü örtmesin, döngü devralsın.
        setPlaying(false)
        onBlocked()
      }}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
      src="/videos/hero-scrub.mp4"
    />
  )
}
