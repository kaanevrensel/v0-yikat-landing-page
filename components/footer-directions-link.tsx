"use client"

// Footer server component kaldığı için analytics'li tek link bu minik client bileşene çıkarıldı.
import { useDirectionsUrl } from "@/hooks/use-directions-url"
import { track } from "@/lib/analytics"

export function FooterDirectionsLink() {
  // Diğer yüzeylerle tutarlı: iOS'ta Apple Haritalar.
  const directionsUrl = useDirectionsUrl()
  return (
    <a
      href={directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("footer_directions_click")}
      className="hover:text-white"
    >
      Yol tarifi al →
    </a>
  )
}
