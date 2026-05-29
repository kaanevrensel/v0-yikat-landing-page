"use client"

import { siteConfig } from "@/lib/site"

function track(event: string) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    ;(window as any).gtag("event", event)
  }
}

/** Apple-guideline style "Download on the App Store" badge. */
export function AppStoreBadge({ event = "app_store_click" }: { event?: string }) {
  return (
    <a
      href={siteConfig.appStoreUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track(event)}
      aria-label="App Store'dan indir"
      className="inline-flex h-[52px] items-center gap-3 rounded-xl bg-[#1f2937] px-4 text-white transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden="true">
        <path d="M17.05 12.04c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.9-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.23 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.02 2.28-1.27 3.13-2.53.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.72-1.04-2.75-4.13zM14.54 4.42c.71-.86 1.19-2.06 1.06-3.25-1.02.04-2.26.68-2.99 1.54-.66.76-1.23 1.98-1.08 3.14 1.14.09 2.3-.58 3.01-1.43z" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-normal opacity-80">İndir</span>
        <span className="text-[17px] font-medium tracking-tight">App Store</span>
      </span>
    </a>
  )
}

/** Google-guideline style "Get it on Google Play" badge. */
export function PlayStoreBadge({ event = "play_store_click" }: { event?: string }) {
  return (
    <a
      href={siteConfig.playStoreUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track(event)}
      aria-label="Google Play'den indir"
      className="inline-flex h-[52px] items-center gap-3 rounded-xl bg-[#1f2937] px-4 text-white transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
        <path d="M3.6 2.3a1 1 0 0 0-.6.9v17.6a1 1 0 0 0 .6.9l9.9-9.7L3.6 2.3z" fill="#34d399" />
        <path d="M16.8 8.4 13.5 12l3.3 3.6 3.9-2.2c.9-.5.9-1.8 0-2.3l-3.9-2.7z" fill="#fbbf24" />
        <path d="M3.6 2.3 13.5 12l3.3-3.6L5.2 1.6a1.2 1.2 0 0 0-1.6.7z" fill="#60a5fa" />
        <path d="M3.6 21.7 13.5 12l3.3 3.6-11.6 6.8a1.2 1.2 0 0 1-1.6-.7z" fill="#f87171" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-normal opacity-80">İndir</span>
        <span className="text-[17px] font-medium tracking-tight">Google Play</span>
      </span>
    </a>
  )
}

export function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <AppStoreBadge />
      <PlayStoreBadge />
    </div>
  )
}
