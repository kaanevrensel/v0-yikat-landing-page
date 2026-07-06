"use client"

// Gerçek Liquid Glass lensing'i (Apple WWDC25 "Meet Liquid Glass") web'e port eden yardımcı.
// SDF (signed distance function) tabanlı hap displacement haritası + feDisplacementMap tekniği
// kube.io/blog/liquid-glass-css-svg ve shuding/liquid-glass analizlerinden İLHAMLA temiz-oda yazım
// (kaynak kopyalanmadı). Kenar bandında arka plan merkeze doğru sıkışır → konveks mercek hissi.
//
// TARAYICI GERÇEĞİ: backdrop-filter: url(#f) YALNIZ Chromium'da çizilir (WebKit bug 245510
// "not planned"; Firefox desteklemiyor; w3c/svgwg#1142 açık). Safari @supports'ta YANLIŞ-POZİTİF
// verdiğinden kapı UA/motor tespitiyle kurulur: navigator.userAgentData yalnız Chromium'da var.
// Diğer motorlar navbar'daki katmanlı frost fallback'ini alır — tasarım "blur-first, lens-enhancement".
import { useEffect, useState } from "react"

export const LENS_FILTER_ID = "yikat-lens"
// feDisplacementMap scale değeri. DİKKAT: 128±127 kanal kodlaması nedeniyle EFEKTİF maksimum
// kayma bu değerin yaklaşık yarısıdır (~13px) — görsel ayar bu gerçek değerle doğrulandı;
// efekti güçlendirmek isteyen scale'i ikiye katlamalı, kodlamayı değil.
const MAX_SHIFT_PX = 26
const EDGE_BAND_PX = 20 // kenardan içeri lens bandı — merkez berrak kalır

// Klasik rounded-rect SDF: içeride negatif, kenarda 0, dışarıda pozitif (px cinsinden).
function roundedRectSDF(x: number, y: number, halfW: number, halfH: number, r: number) {
  const qx = Math.abs(x) - halfW + r
  const qy = Math.abs(y) - halfH + r
  return Math.min(Math.max(qx, qy), 0) + Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - r
}

// Displacement haritası: R=128+dx·127, G=128+dy·127 (128 = nötr). Kenar bandında piksel
// merkeze doğru çekilir; smoothstep ile banda yumuşak giriş. Kapsül radius = yükseklik/2.
function generateLensMap(w: number, h: number): string | null {
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  const img = ctx.createImageData(w, h)
  const data = img.data
  const halfW = w / 2
  const halfH = h / 2
  const radius = Math.min(halfW, halfH)
  const maxR = Math.hypot(halfW, halfH)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x - halfW + 0.5
      const py = y - halfH + 0.5
      const d = roundedRectSDF(px, py, halfW, halfH, radius)
      let t = 1 + d / EDGE_BAND_PX // d=-band → 0 (merkez), d=0 → 1 (kenar)
      t = t < 0 ? 0 : t > 1 ? 1 : t
      const s = t * t * (3 - 2 * t) // smoothstep
      const dx = (-px / maxR) * s * MAX_SHIFT_PX
      const dy = (-py / maxR) * s * MAX_SHIFT_PX
      const i = (y * w + x) * 4
      data[i] = 128 + (dx / MAX_SHIFT_PX) * 127
      data[i + 1] = 128 + (dy / MAX_SHIFT_PX) * 127
      data[i + 2] = 128
      data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL()
}

type LensState = { url: string; w: number; h: number }

/** Chromium + md+ tespiti — mount sonrası (SSR'da false; hydration güvenli). */
export function useLensCapable() {
  const [capable, setCapable] = useState(false)
  useEffect(() => {
    const ua = (navigator as { userAgentData?: { brands?: { brand: string }[] } }).userAgentData
    const chromium = !!ua?.brands?.some((b) => /Chromium|Google Chrome|Microsoft Edge/i.test(b.brand))
    // md+ kapısı canlı: pencere 768px eşiğini geçerse lens açılır/kapanır (perf kuralı korunur).
    const mq = window.matchMedia("(min-width: 768px)")
    const update = () => setCapable(chromium && mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return capable
}

/** Hedef elemanın boyutuna birebir displacement haritası üretir; resize'da yeniler.
    (feImage filtre bölgesi eleman boyutuna otomatik uymaz — araştırma bulgusu.) */
export function useLiquidLens(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [lens, setLens] = useState<LensState | null>(null)
  useEffect(() => {
    if (!enabled) {
      setLens(null)
      return
    }
    const el = ref.current
    if (!el) return
    let raf = 0
    const rebuild = () => {
      const rect = el.getBoundingClientRect()
      const w = Math.round(rect.width)
      const h = Math.round(rect.height)
      if (!w || !h) return
      const url = generateLensMap(w, h)
      if (url) setLens({ url, w, h })
    }
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(rebuild)
    })
    ro.observe(el)
    rebuild()
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [enabled, ref])
  return lens
}

/** Gizli inline SVG filtresi — display:none filtre referansını kırdığından boyutsuz kutuyla gizlenir. */
export function LensFilter({ lens }: { lens: LensState }) {
  return (
    <svg aria-hidden className="absolute h-0 w-0 overflow-hidden" colorInterpolationFilters="sRGB">
      <defs>
        <filter
          id={LENS_FILTER_ID}
          x="0"
          y="0"
          width={lens.w}
          height={lens.h}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feImage href={lens.url} x="0" y="0" width={lens.w} height={lens.h} result="lensMap" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="lensMap"
            scale={MAX_SHIFT_PX}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}
