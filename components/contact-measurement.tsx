"use client"

import { useEffect } from "react"
import { track } from "@/lib/analytics"
import { CONTACT_EVENT, contactProperties } from "@/lib/contact-measurement"
import { counterPayload } from "@/lib/contact-counter.mjs"

// A single activation is counted once even if this component is mounted twice.
// Repeated genuine activations remain events, not deduplicated people or orders.
const observed = new WeakSet<Event>()

export function ContactMeasurement({ publicPaths }: { publicPaths: string[] }) {
  useEffect(() => {
    const lastAccepted = new Map<string, number>()
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || observed.has(event)) return
      const target = event.target instanceof Element ? event.target : null
      const anchor = target?.closest("a[href]")
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute("download")) return
      const properties = contactProperties(anchor.href, window.location.pathname, document.referrer, publicPaths)
      if (!properties) return
      observed.add(event)
      // Use the existing SDK without changing the Analytics configuration.
      // Never block navigation or call the analytics ingestion endpoint directly.
      track(CONTACT_EVENT, properties)
      // First-party schema 2 is separate from Vercel's unavailable custom report.
      // No storage, visitor ID, retries or delay to the actual contact link.
      if (!event.isTrusted || navigator.webdriver || document.visibilityState !== "visible") return
      const payload = counterPayload(properties)
      const key = `${payload.action}:${payload.page}`
      const now = performance.now()
      if (lastAccepted.has(key) && now - lastAccepted.get(key)! < 1000) return
      lastAccepted.set(key, now)
      void fetch("/api/contact-counts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), keepalive: true, credentials: "omit",
        referrerPolicy: "no-referrer", cache: "no-store",
      }).catch(() => { /* Measurement failure never prevents contact. */ })
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [publicPaths])
  return null
}
