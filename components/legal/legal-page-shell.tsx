import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// /kvkk sayfasının başlık + gövde iskeleti, yasal sayfalarda ortak kullanım
// için çıkarıldı (iyzico üye işyeri incelemesi sayfaları, 2026-08-27).
export function LegalPageShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {"Geri Dön"}
          </Link>
          <div className="ml-auto">
            <Image
              src="/images/yikat-logo-blue.png"
              alt="YIKAT"
              width={80}
              height={32}
              className="h-6 w-auto"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-3 text-sm text-muted-foreground sm:text-base">{subtitle}</p> : null}
        <div className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">{children}</div>
      </main>
    </div>
  )
}
