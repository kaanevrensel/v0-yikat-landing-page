import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"

// Ana sayfanın title/canonical/robots:index'ini miras almasın.
export const metadata: Metadata = {
  title: "Sayfa bulunamadı — YIKAT",
  robots: { index: false, follow: true },
}

// Türkçe, marka-kişilikli 404 — server component kalır: motion yok (MotionProvider dışında),
// köpük kenarı foam-divider.tsx'in path'inin STATİK kopyası (motion.svg bilinçle alınmadı).
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        {/* text-[#2563eb]: #4A8CFF beyaz zeminde 14px için AA altı (3.24:1). */}
        <p className="text-sm font-semibold text-[#2563eb]">404</p>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Bu sayfa köpüklerin arasında kaybolmuş.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
          Aradığın sayfa taşınmış ya da hiç olmamış olabilir. Dükkan yerinde duruyor — ayakkabın için doğru
          adres aşağıda.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="cta-ripple rounded-full bg-[#2563eb] hover:bg-[#1d4fc4]">
            <Link href="/">Ana sayfaya dön</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="cta-ripple rounded-full">
            <a href={siteConfig.directionsUrl} target="_blank" rel="noopener noreferrer">
              <MapPin className="size-4" /> Yol Tarifi
            </a>
          </Button>
        </div>
        <a
          href={siteConfig.phoneHref}
          className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <Phone className="size-4" /> {siteConfig.phone}
        </a>
      </main>
      {/* Statik köpük kenarı (foam-divider.tsx path'i) + navy zemin şeridi */}
      <div aria-hidden className="text-navy">
        <div className="relative -mb-px h-10 overflow-hidden sm:h-14">
          <svg viewBox="0 0 1200 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full fill-current">
            <path d="M0,56 L0,34 C80,22 160,42 240,36 C320,30 400,14 480,20 C560,26 640,44 720,40 C800,36 880,18 960,22 C1040,26 1120,40 1200,32 L1200,56 Z" />
            <circle cx="150" cy="26" r="5" />
            <circle cx="470" cy="10" r="4" />
            <circle cx="760" cy="24" r="5" />
            <circle cx="1060" cy="20" r="4" />
          </svg>
        </div>
        <div className="h-16 bg-navy" />
      </div>
    </div>
  )
}
