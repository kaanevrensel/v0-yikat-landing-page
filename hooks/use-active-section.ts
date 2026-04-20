"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { SECTION_IDS } from "@/lib/sections"

interface Options {
  /** If true, IntersectionObserver updates are ignored (set during programmatic scroll). */
  freeze?: boolean
}

/**
 * Tracks which section is currently active based on scroll position.
 * Uses IntersectionObserver; the section whose center is closest to the
 * viewport center wins. Returns a [activeIndex, setActiveIndex] pair.
 *
 * `setActiveIndex` is intended for click-to-scroll: callers invoke it to
 * lock the active index while a smooth scroll is in flight, then unfreeze.
 */
export function useActiveSection(options: Options = {}): [number, (i: number) => void] {
  const [active, setActive] = useState(0)
  const frozenRef = useRef(false)

  // Allow callers to toggle freeze
  useEffect(() => {
    frozenRef.current = !!options.freeze
  }, [options.freeze])

  // Manual setter used during click-to-scroll
  const setActiveManual = useCallback((i: number) => {
    setActive(i)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const elements = SECTION_IDS
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    // Use rootMargin to create a "selection band" near viewport center
    const observer = new IntersectionObserver(
      (entries) => {
        if (frozenRef.current) return
        // Pick the entry with the highest intersection ratio
        let best: IntersectionObserverEntry | null = null
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry
          }
        }
        if (best) {
          const idx = SECTION_IDS.indexOf(best.target.id)
          if (idx !== -1) setActive(idx)
        }
      },
      {
        // Trigger when a section crosses the middle 40% of viewport
        rootMargin: "-30% 0px -30% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return [active, setActiveManual]
}
