"use client"

import { useState } from "react"
import { ArrowRight, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AppStoreBadge, PlayStoreBadge } from "@/components/store-badges"
import { siteConfig } from "@/lib/site"
import { cn } from "@/lib/utils"

function track(event: string) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    ;(window as any).gtag("event", event)
  }
}

function getPlatform(): "ios" | "android" | "desktop" {
  if (typeof navigator === "undefined") return "desktop"
  const ua = navigator.userAgent || ""
  if (/iPad|iPhone|iPod/.test(ua)) return "ios"
  if (/android/i.test(ua)) return "android"
  return "desktop"
}

/**
 * Primary "App'i İndir" CTA (Brief §9.6).
 * iOS → App Store, Android → Google Play directly.
 * Desktop → dialog with both badges + instruction (no QR dependency).
 */
export function AppDownloadButton({
  label = "App'i İndir",
  event = "hero_app_download_click",
  className,
  size = "lg",
  variant = "default",
  showArrow = true,
}: {
  label?: string
  event?: string
  className?: string
  size?: "default" | "sm" | "lg"
  variant?: "default" | "outline" | "navy"
  showArrow?: boolean
}) {
  const [open, setOpen] = useState(false)

  function handleClick() {
    track(event)
    const platform = getPlatform()
    if (platform === "ios") {
      window.location.href = siteConfig.appStoreUrl
    } else if (platform === "android") {
      window.location.href = siteConfig.playStoreUrl
    } else {
      setOpen(true)
    }
  }

  const navy =
    variant === "navy"
      ? "bg-white text-navy hover:bg-white/90"
      : variant === "outline"
        ? "border border-border bg-background text-foreground hover:bg-muted"
        : "bg-primary text-primary-foreground hover:bg-primary/90"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        size={size}
        onClick={handleClick}
        className={cn("rounded-full px-7 text-base font-medium", navy, className)}
      >
        {label}
        {showArrow && <ArrowRight className="ml-1 size-4" />}
      </Button>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
            <Smartphone className="size-6" />
          </div>
          <DialogTitle className="text-center text-xl">
            Uygulamayı telefonunuza indirin
          </DialogTitle>
          <DialogDescription className="text-center">
            Tüm sipariş akışı uygulamada. App Store veya Google Play’den
            ücretsiz indirin, adresinizi girin, gerisini bize bırakın.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <AppStoreBadge event="desktop_app_store_click" />
          <PlayStoreBadge event="desktop_play_store_click" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
