"use client"

// Gerçek kullanıcı CWV telemetrisi: LCP/CLS/INP/TTFB, mevcut tek analytics hattına
// (lib/analytics track → @vercel/analytics) özel event olarak akar — ikinci panel/paket yok.
// CLS 0-1 aralığında float olduğundan 1000 ile ölçeklenip yuvarlanır (cls_x1000).
import { useReportWebVitals } from "next/web-vitals"
import { track } from "@/lib/analytics"

const REPORTED = new Set(["LCP", "CLS", "INP", "TTFB"])

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (!REPORTED.has(metric.name)) return
    track(`cwv_${metric.name.toLowerCase()}`, {
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      rating: metric.rating,
    })
  })
  return null
}
