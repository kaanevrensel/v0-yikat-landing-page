import Link from "next/link"
import { FooterDirectionsLink, FooterServiceLinks, FooterWhatsAppLink } from "@/components/footer-directions-link"
import { PaymentBand } from "@/components/payment-band"
import { services } from "@/lib/services"
import { siteConfig } from "@/lib/site"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="bg-navy py-12 text-navy-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Logo width={28} className="text-white" />
              <span className="text-lg font-semibold tracking-tight text-white">Yıkat</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-white">
              Bakırköy'de profesyonel ayakkabı yıkama. Aynı gün teslim.
            </p>
          </div>
          <div className="text-sm text-white">
            <p>{siteConfig.address.full}</p>
            {/* Sayfa sonuna gelen ziyaretçi için eksik olan ikinci dönüşüm çıkışı — sessiz text-link. */}
            <p className="mt-2">
              <FooterDirectionsLink />
            </p>
            <p className="mt-2">{siteConfig.hours.label}</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-3">
              <a href={siteConfig.phoneHref} className="inline-flex min-h-11 items-center hover:underline">
                {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="inline-flex min-h-11 items-center hover:underline">
                {siteConfig.email}
              </a>
            </p>
            <p className="mt-2">
              <FooterWhatsAppLink />
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-white">
            <span className="font-semibold">Hizmetler</span>
            <FooterServiceLinks services={services.map((s) => ({ slug: s.slug, nav: s.nav }))} />
          </div>
          <div className="flex flex-col gap-2 text-sm text-white">
            <Link href="/iletisim" className="inline-flex min-h-11 items-center hover:underline">
              İletişim
            </Link>
            <Link href="/gizlilik-politikasi" className="inline-flex min-h-11 items-center hover:underline">
              Gizlilik Politikası
            </Link>
            <Link href="/hesap-silme" className="inline-flex min-h-11 items-center hover:underline">
              Hesap Silme
            </Link>
            <Link href="/kvkk" className="inline-flex min-h-11 items-center hover:underline">
              KVKK Aydınlatma Metni
            </Link>
            <Link href="/mesafeli-satis-sozlesmesi" className="inline-flex min-h-11 items-center hover:underline">
              Mesafeli Satış Sözleşmesi
            </Link>
            <Link href="/teslimat-ve-iade" className="inline-flex min-h-11 items-center hover:underline">
              Teslimat ve İade
            </Link>
          </div>
        </div>
        {/* iyzico üye işyeri incelemesi: "iyzico ile Öde" + Visa + Mastercard
            markaları sitede görünür olmalı (eksik-belge e-postası 2026-08-27).
            Footer'da: her sayfada görünür, satış vaadi değil bilgi bandı. */}
        <div className="mt-10 border-t border-white/20 pt-6">
          <PaymentBand tone="dark" />
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-6 text-xs text-white/95">
          <p>© 2026 Yıkat. Tüm hakları saklıdır.</p>
          {(siteConfig.socialLinks.googleBusinessProfile || siteConfig.socialLinks.instagram) && (
            <p className="flex flex-wrap gap-x-4">
              {siteConfig.socialLinks.googleBusinessProfile && (
                <a href={siteConfig.socialLinks.googleBusinessProfile} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:underline">Google</a>
              )}
              {siteConfig.socialLinks.instagram && (
                <a href={siteConfig.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:underline">Instagram</a>
              )}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
