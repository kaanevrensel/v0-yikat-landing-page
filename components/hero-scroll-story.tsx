"use client"

import { useCallback, useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ChevronDown, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroAutoVideo } from "@/components/hero-scrub-video"
import Magnet from "@/components/magnet"
import { useDirectionsUrl } from "@/hooks/use-directions-url"
import { siteConfig } from "@/lib/site"
import { track } from "@/lib/analytics"

// Sabit kadrajlı takip çekimi (spec + 2026-07-05 konsept revizyonu): ayakkabılar giyili,
// kadraj sabit, sahneden sahneye dünya ilerler. Kareler Higgsfield kompozit keyframe'leri;
// gradyan yalnız görsel yüklenene dek fallback zemin.
export const SCENES = [
  {
    key: "sokak",
    bg: "linear-gradient(160deg, #d7dde4 0%, #eef1f4 60%, #f8fafc 100%)",
    img: "/images/hero/keyframe-sokak.webp",
    imgMobile: "/images/hero/keyframe-sokak-mobile.webp",
    title: "Temiz ayakkabı, başka yürüyüş.",
    sub: "Bakırköy'de profesyonel ayakkabı yıkama, aynı gün teslim",
    // Sahip kararı (2026-07-12): son sahne hariç tüm sahne metinleri beyaz.
    dark: true,
  },
  // KOPYA KURALI (sahip, 2026-07-11): "yıkat" marka adı AYNI ZAMANDA emir kipi — cümlelerde
  // YÜKLEM olarak kullanılır ("sen yıkama, yıkat"). ASLA özne-isim olarak yazılmaz ("YIKAT yıkar" YASAK).
  {
    key: "camur",
    bg: "linear-gradient(160deg, #3f3122 0%, #6b4a2b 55%, #8a6237 100%)",
    img: "/images/hero/keyframe-camur.webp",
    imgMobile: "/images/hero/keyframe-camur-mobile.webp",
    title: "Sokak izini bırakır.",
    sub: "Çamur, toz, leke. Hepsi bir günün işi.",
    dark: true,
  },
  {
    key: "yikat",
    // Saks ailesi fallback (beyaz metin her durakta AA): görsel yüklenene dek TEK zemin —
    // beyaz metin #4a8cff üstünde 3.2:1 kalıyordu (axe, yavaş yüklemede harf harf yakalıyordu).
    bg: "linear-gradient(160deg, #123b8f 0%, #1d4fc4 55%, #2563eb 100%)",
    img: "/images/hero/keyframe-yikat.webp",
    imgMobile: "/images/hero/keyframe-yikat-mobile.webp",
    title: "Eskitme, yıkat.",
    sub: "Makineye atma, fırçayla uğraşma. Ustasına bırak.",
    dark: true,
  },
  {
    key: "temiz",
    bg: "linear-gradient(160deg, #e6f1fb 0%, #f3f8ff 55%, #ffffff 100%)",
    img: "/images/hero/keyframe-temiz.webp",
    imgMobile: "/images/hero/keyframe-temiz-mobile.webp",
    title: "Aynı gün hazır.",
    sub: "Sabah bırak, akşam 20:00'ye kadar al.",
    dark: false,
  },
] as const

// Fotoğraf üstünde okunabilirlik: koyu sahnede koyu, açık sahnede açık ışıma.
const DARK_SHADOW = "[text-shadow:0_2px_24px_rgba(4,44,83,0.55)]"
const LIGHT_SHADOW = "[text-shadow:0_1px_16px_rgba(255,255,255,0.65)]"

// LCP karesi için art-direction: <picture> tarayıcının preload tarayıcısına tek doğru
// kırpımı erken keşfettirir — çift <Image priority> her cihazda iki eager indirme yapıyordu.
// images.unoptimized: true olduğundan next/image burada ek değer katmıyor.
function SceneLcpPicture({ scene }: { scene: (typeof SCENES)[number] }) {
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={scene.img} />
      <img
        src={scene.imgMobile}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </picture>
  )
}

export function HeroCtas({ eventPrefix }: { eventPrefix: string }) {
  const directionsUrl = useDirectionsUrl()
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Magnet maxShift={8}>
        {/* bg-[#2563eb]: buton dolgusu düz renk — 14px beyaz metin #4A8CFF üstünde AA geçemiyor. */}
        <Button asChild size="lg" className="cta-ripple rounded-full bg-[#2563eb] hover:bg-[#1d4fc4]">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(`${eventPrefix}_directions_click`)}
          >
            <MapPin className="size-4" /> Yol Tarifi Al
          </a>
        </Button>
      </Magnet>
      <Button asChild size="lg" variant="outline" className="cta-ripple rounded-full bg-background/70">
        <a href={siteConfig.phoneHref} onClick={() => track(`${eventPrefix}_call_click`)}>
          <Phone className="size-4" /> {siteConfig.phone}
        </a>
      </Button>
    </div>
  )
}

// Reduced-motion ve düşük güç fallback'i: final sahnesi statik (spec §4).
export function StaticHero() {
  const scene = SCENES[3]
  return (
    <section
      className="relative flex min-h-dvh flex-col items-center justify-end overflow-hidden px-4 pb-[12vh] pt-16"
      style={{ background: scene.bg }}
    >
      <SceneLcpPicture scene={scene} />
      <div className="relative z-10 flex flex-col items-center">
        <h1 className={`text-balance text-center text-4xl font-semibold tracking-tight text-foreground md:text-5xl ${LIGHT_SHADOW}`}>
          Temiz ayakkabı, başka yürüyüş.
        </h1>
        <p className={`mt-3 text-center text-lg text-muted-foreground ${LIGHT_SHADOW}`}>
          Bakırköy'de profesyonel ayakkabı yıkama, aynı gün teslim.
        </p>
        <div className="mt-8">
          <HeroCtas eventPrefix="hero_static" />
        </div>
      </div>
    </section>
  )
}

// Sahne süresi (yalnız "dongu" modunda): zamanlayıcı bu aralıkla ilerler.
const SCENE_MS = 4000
// Bekleme emniyeti: bu süre içinde video başlayamadıysa (çok yavaş ağ) döngü devralır —
// hero sonsuza dek donuk kalmaz; video hazır olduğunda yine öne geçer.
const WAIT_MS = 8000

// Hero modları (sahip, 2026-07-12: "websitesini açar açmaz videonun oynaması lazım"):
// - "bekleme": ilk kare sabit poster, kareler DÖNMEZ — video her an başlayacak.
// - "video":   video oynuyor, sahne saati video zamanı (timeToScene).
// - "dongu":   video oynayamıyor (autoplay reddi / medya hatası / WAIT_MS aşıldı) —
//              4sn'lik keyframe crossfade döngüsü, eski fallback davranışı.
type HeroMode = "bekleme" | "video" | "dongu"

export function HeroScrollStory() {
  const prefersReduced = useReducedMotion()
  // Otomatik akış (2026-07-12 sahip kararı: scroll-scrub → autoplay): tek doğruluk kaynağı
  // aktif sahne indeksi; kim ilerleteceğini mode belirler.
  const [active, setActive] = useState(0)
  const [mode, setMode] = useState<HeroMode>("bekleme")

  const handleVideoPlaying = useCallback(() => setMode("video"), [])
  const handleVideoBlocked = useCallback(() => setMode("dongu"), [])

  useEffect(() => {
    if (mode !== "bekleme") return
    const id = setTimeout(() => setMode("dongu"), WAIT_MS)
    return () => clearTimeout(id)
  }, [mode])

  useEffect(() => {
    if (mode !== "dongu") return
    const id = setInterval(() => setActive((a) => (a + 1) % SCENES.length), SCENE_MS)
    return () => clearInterval(id)
  }, [mode])

  if (prefersReduced) return <StaticHero />

  return (
    <section aria-label="Yıkat hikayesi" className="relative h-dvh overflow-hidden">
      {/* Statik keyframe katmanları — beklemede ilk kare sabit poster, "dongu" modunda
          crossfade döngüsü. Katman 0 sabit taban; sonrakiler aktif sahneye dek üst üste
          biner (DOM sırası örter), döngü başa sararken hepsi birlikte söner. */}
      {SCENES.map((scene, i) => (
        <motion.div
          key={scene.key}
          aria-hidden
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: i === 0 || active >= i ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          style={{ background: scene.bg }}
        >
          {i === 0 ? (
            <SceneLcpPicture scene={scene} />
          ) : (
            // <picture> art-direction: CSS'le gizlenen çift <Image> (unoptimized=düz img)
            // her cihazda İKİ varyantı da indiriyordu; source/media tek doğru kırpımı seçer.
            <picture>
              <source media="(min-width: 768px)" srcSet={scene.img} />
              <img
                src={scene.imgMobile}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </picture>
          )}
        </motion.div>
      ))}

      {/* Otomatik hero videosu — tüm ekranlarda, src SSR'da gömülü (indirme HTML parse'ta
          başlar); oynamaya başlar başlamaz statiklerin üstüne biner ve sahne saatini devralır */}
      <HeroAutoVideo onSceneChange={setActive} onPlaying={handleVideoPlaying} onBlocked={handleVideoBlocked} />

      {/* Metin + CTA alt üçte-birde: kompozit karede ayakkabılar merkezde, üstüne binmez.
          bottom 6vh (sahip, 2026-07-12): metinler fotoğrafın sakin/koyu yansıma bandında. */}
      <div className="absolute inset-x-0 bottom-[6vh] z-10 flex flex-col items-center">
        <div className="grid w-full max-w-2xl px-4 text-center">
          {SCENES.map((scene, i) => (
            <motion.div
              key={scene.key}
              // self-center: blok yüksekliği en uzun sahneye göre sabit — kısa sahneler ortalanır.
              // İlk iki sahnenin metni sahip isteğiyle biraz daha aşağıda (pt, transform'la çakışmaz)
              className={`col-start-1 row-start-1 self-center ${i < 2 ? "pt-6" : ""}`}
              initial={false}
              animate={{ opacity: active === i ? 1 : 0, y: active === i ? 0 : 16 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {i === 0 ? (
                <h1
                  className={`text-balance text-4xl font-semibold tracking-tight md:text-5xl ${
                    scene.dark ? `text-white ${DARK_SHADOW}` : `text-foreground ${LIGHT_SHADOW}`
                  }`}
                >
                  {scene.title}
                </h1>
              ) : (
                <p
                  className={`text-balance text-4xl font-semibold tracking-tight md:text-5xl ${
                    scene.dark ? `text-white ${DARK_SHADOW}` : `text-foreground ${LIGHT_SHADOW}`
                  }`}
                >
                  {scene.title}
                </p>
              )}
              <p className={`mt-3 text-lg ${scene.dark ? `text-white/85 ${DARK_SHADOW}` : `text-muted-foreground ${LIGHT_SHADOW}`}`}>
                {scene.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA'lar otomatik akışta hep görünür — dönüşüm yolu sahne beklemez */}
        <div className="mt-4">
          <HeroCtas eventPrefix="hero" />
        </div>
      </div>

      {/* Kaydırma ipucu — konum dış div'de, animasyon içte (transform çakışması olmaz) */}
      <div aria-hidden className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground">
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown className="size-6" />
        </motion.div>
      </div>
    </section>
  )
}
