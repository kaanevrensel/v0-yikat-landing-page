"use client"

import { useEffect, useState, useCallback, type MutableRefObject } from "react"
import { SECTION_IDS } from "@/lib/sections"

export function useActiveSection(
  freezeRef?: MutableRefObject<boolean>
): [number, (i: number) => void] {
  const [active, setActive] = useState(0)

  const setActiveManual = useCallback((i: number) => {
    setActive(i)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const elements = SECTION_IDS
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (freezeRef?.current) return
        let best: IntersectionObserverEntry | null = null
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry
        }
        if (best) {
          const idx = SECTION_IDS.indexOf(best.target.id)
          if (idx !== -1) setActive(idx)
        }
      },
      {
        rootMargin: "-30% 0px -30% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [freezeRef])

  return [active, setActiveManual]
}
