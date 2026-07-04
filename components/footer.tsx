import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/lib/site"

export function Footer() {
  return (
    <footer className="bg-navy py-12 text-navy-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/images/yikat-logo-white.png" alt="" width={28} height={28} className="size-7" />
              <span className="text-lg font-semibold tracking-tight text-white">YIKAT</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/70">
              Bakırköy'de profesyonel ayakkabı yıkama. Aynı gün teslim.
            </p>
          </div>
          <div className="text-sm text-white/70">
            <p>{siteConfig.address.full}</p>
            <p className="mt-2">{siteConfig.hours.label}</p>
            <p className="mt-2">
              <a href={siteConfig.phoneHref} className="hover:text-white">
                {siteConfig.phone}
              </a>
              {" · "}
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-white/70">
            <Link href="/kvkk" className="hover:text-white">
              KVKK Aydınlatma Metni
            </Link>
            <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-white">
              Mesafeli Satış Sözleşmesi
            </Link>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
          © 2026 YIKAT. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  )
}
