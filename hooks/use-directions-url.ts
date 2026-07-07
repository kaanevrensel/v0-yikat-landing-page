"use client"

// Platforma duyarlı yol tarifi: iOS'ta Apple Haritalar (kurulu olmayan Google Maps yerine),
// diğer her yerde Google. SSR + ilk istemci render Google basar (hydration güvenli);
// iOS tespiti yalnız mount sonrası yapılır. iPadOS 13+ kendini MacIntel tanıttığından
// maxTouchPoints kontrolü şart.
import { useEffect, useState } from "react"
import { siteConfig } from "@/lib/site"

export function useDirectionsUrl(): string {
  const [url, setUrl] = useState<string>(siteConfig.directionsUrl)
  useEffect(() => {
    const isIOS =
      /iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    if (isIOS) setUrl(siteConfig.appleDirectionsUrl)
  }, [])
  return url
}
