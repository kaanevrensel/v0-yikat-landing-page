"use client"

import { useEffect } from "react"
import { track } from "@/lib/analytics"
import { CONTACT_EVENT, contactProperties } from "@/lib/contact-measurement"

// A single activation is counted once even if this component is mounted twice.
// Repeated genuine activations remain events, not deduplicated people or orders.
const observed = new WeakSet<Event>()

export function ContactMeasurement({ publicPaths }: { publicPaths: string[] }) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || observed.has(event)) return
      const target = event.target instanceof Element ? event.target : null
      const anchor = target?.closest("a[href]")
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute("download")) return
      const properties = contactProperties(anchor.href, window.location.pathname, document.referrer, publicPaths)
      if (!properties) return
      observed.add(event)
      // Use the existing SDK and its host, automation and beforeSend controls.
      // Never block navigation or call the analytics ingestion endpoint directly.
      track(CONTACT_EVENT, properties)
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [publicPaths])
  return null
}
