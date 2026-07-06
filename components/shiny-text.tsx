"use client"

// reactbits.dev ShinyText deseninden ilhamla temiz-oda yazım (RB lisansı MIT+Commons Clause
// olduğundan kaynak kopyalanmadı). Bilinçli sapma: background-clip:text yerine pill'in üstünden
// geçen transform-only ışık bandı — metin dolgusu değişmediği için kontrast bozulmaz ve animasyon
// compositor'da kalır. Bant CSS keyframe'le süpürür (globals.css: .shine-band); yalnız viewport
// içindeyken oynar, reduced-motion'da hem CSS media query hem de render koşulu kapatır.
import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

type ShinyTextProps = {
  children: React.ReactNode
  className?: string
}

export default function ShinyText({ children, className }: ShinyTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { amount: 0.5 })
  const prefersReduced = useReducedMotion()
  // Hydration güvenliği (blur-text ile aynı desen): useReducedMotion SSR'da null döner —
  // reduced-motion dalına ancak mount SONRASI geçilir; o ana dek CSS media query motion'ı durdurur.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const showBand = !(mounted && prefersReduced)

  return (
    // inline-block taban: overflow-hidden inline elemanda kırpmaz — çağıran display sınıfı
    // (örn. inline-flex) geçerse tailwind-merge onu üstün kılar.
    <span ref={ref} className={cn("relative inline-block overflow-hidden", className)}>
      {children}
      {showBand && (
        <span aria-hidden className="shine-band" style={{ animationPlayState: inView ? "running" : "paused" }} />
      )}
    </span>
  )
}
