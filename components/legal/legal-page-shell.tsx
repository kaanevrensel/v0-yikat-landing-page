import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"
import { legalRoutes } from "@/lib/legal-routes"

// /kvkk sayfasının başlık + gövde iskeleti, yasal sayfalarda ortak kullanım
// için çıkarıldı (iyzico üye işyeri incelemesi sayfaları, 2026-08-27).
export function LegalPageShell({
  title,
  subtitle,
  currentHref,
  children,
}: {
  title: string
  subtitle?: string
  /** Path of the page being rendered; it is left out of the list of other legal texts. */
  currentHref?: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex min-h-11 min-w-11 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {"Geri Dön"}
          </Link>
          <div className="ml-auto">
            <Logo width={46} className="text-[#269AFF]" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        {subtitle ? <p className="mt-3 text-sm text-muted-foreground sm:text-base">{subtitle}</p> : null}
        <div className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">{children}</div>
        {currentHref ? (
          <nav aria-label="Diğer yasal metinler" className="mt-14 border-t border-border pt-6 text-sm">
            <h2 className="font-semibold text-foreground">{"Diğer yasal metinler"}</h2>
            <ul className="mt-2 flex flex-wrap gap-x-5">
              {legalRoutes
                .filter((route) => route.href !== currentHref)
                .map((route) => (
                  <li key={route.href}>
                    <Link
                      href={route.href}
                      className="inline-flex min-h-11 items-center font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                    >
                      {route.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        ) : null}
      </main>
    </div>
  )
}
