import Link from "next/link"
import { MapPin, Clock, Phone, Mail, MessageCircle } from "lucide-react"

import { LegalPageShell } from "@/components/legal/legal-page-shell"
import { PaymentBand } from "@/components/payment-band"
import { siteConfig } from "@/lib/site"
import legal from "@/lib/legal-content.json"
import { BUSINESS_ID, WEBSITE_ID, discoveryMetadata } from "@/lib/discovery"

// İletişim — iyzico üye işyeri incelemesi web sitesinde iletişim e-postası ve/veya
// telefon numarası arıyor (eksik-belge e-postası 2026-08-27; footer'da vardı ama
// ayrı sayfa istendi). Pivot yönlendirmesi (/iletisim → /) kaldırıldı.
// Hakkımızda bloğu app.yikat.tech/iletisim ile aynı ticari kimliği taşır:
// işletme kimliği lib/legal-content.json'daki COMPANY'den gelir.

export const metadata = discoveryMetadata("İletişim ve İşletme Bilgileri", "Yıkat’ın resmi iletişim bilgileri: Bakırköy dükkân adresi, çalışma saatleri, telefon, WhatsApp, uygulama desteği ve işletme kimliği.", "/iletisim")

const company = legal.company

export default function IletisimPage() {
  return (
    <LegalPageShell title="İletişim">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "ContactPage", "@id": `${siteConfig.url}/iletisim#webpage`,
        url: `${siteConfig.url}/iletisim`, name: "Yıkat İletişim ve İşletme Bilgileri", inLanguage: "tr-TR",
        isPartOf: { "@id": WEBSITE_ID }, mainEntity: { "@id": BUSINESS_ID },
      }).replace(/</g, "\\u003c") }} />
      <div className="mt-2 space-y-4">
        <p className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-5 shrink-0 text-foreground" aria-hidden />
          <span>
            <strong className="text-foreground">{"Dükkân: "}</strong>
            {siteConfig.address.full}
            {" · "}
            <a
              href={siteConfig.mapsPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-4"
            >
              {"Haritada gör"}
            </a>
          </span>
        </p>
        <p className="flex items-start gap-3">
          <Clock className="mt-0.5 size-5 shrink-0 text-foreground" aria-hidden />
          <span>{siteConfig.hours.label}</span>
        </p>
        <p className="flex items-start gap-3">
          <Phone className="mt-0.5 size-5 shrink-0 text-foreground" aria-hidden />
          <a href={siteConfig.phoneHref} className="font-medium text-foreground underline underline-offset-4">
            {siteConfig.phone}
          </a>
        </p>
        <p className="flex items-start gap-3">
          <MessageCircle className="mt-0.5 size-5 shrink-0 text-foreground" aria-hidden />
          <a
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-4"
          >
            {"WhatsApp ile yazın"}
          </a>
        </p>
        <p className="flex items-start gap-3">
          <Mail className="mt-0.5 size-5 shrink-0 text-foreground" aria-hidden />
          <a href={`mailto:${siteConfig.email}`} className="font-medium text-foreground underline underline-offset-4">
            {siteConfig.email}
          </a>
        </p>
      </div>

      <h2 className="mt-12 text-xl font-semibold text-foreground sm:text-2xl">{"Hakkımızda"}</h2>
      <p className="mt-4">
        Yıkat, İstanbul Bakırköy Sakızağacı’nda ayakkabı temizliği ve bakımı için hizmet verir.
        {" Sneaker, deri, süet ve nubuk ayakkabını "}
        <Link href="/bakirkoy-ayakkabi-temizleme" className="font-medium text-foreground underline underline-offset-4">Bakırköy dükkânına</Link>
        {" getirebilirsin. Malzemeye göre bakım, güncel baz ücretler ve teslim süreci "}
        <Link href="/ayakkabi-temizleme" className="font-medium text-foreground underline underline-offset-4">ayakkabı temizleme sayfamızda</Link>.
      </p>
      <div className="mt-4 space-y-1.5">
        <p>
          <strong className="text-foreground">{"Ünvan:"}</strong> {company.legalName}
        </p>
        <p>
          <strong className="text-foreground">{"Marka:"}</strong>{" "}
          {"Yıkat tescilli bir markadır."}
        </p>
        <p>
          <strong className="text-foreground">{"İşletme adresi:"}</strong> {company.address}
        </p>
        <p>
          <strong className="text-foreground">{"Vergi Dairesi / No:"}</strong>{" "}
          {`${company.taxOffice} / ${company.taxNo}`}
        </p>
        <p>
          <strong className="text-foreground">{"Web:"}</strong> {company.web}
        </p>
      </div>

      <h2 className="mt-12 text-xl font-semibold text-foreground sm:text-2xl">{"Uygulama ve resmi hesaplar"}</h2>
      <p className="mt-4">
        Yıkat’ın resmi web sitesi yikat.tech, Instagram hesabı @yikat.app’tir.
        {" iPhone uygulamasının App Store’daki geliştirici adı "}{siteConfig.iosApp.developerName}{". Android uygulaması henüz genel kullanıma açılmadı."}
      </p>
      <ul className="mt-3 space-y-1">
        <li><Link href="/urun" className="inline-flex min-h-11 items-center font-medium text-foreground underline underline-offset-4">Uygulama ve yayın durumu</Link></li>
        <li><a href={siteConfig.iosApp.storeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-medium text-foreground underline underline-offset-4">Yıkat’ı App Store’dan indir</a></li>
        <li><a href={siteConfig.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-medium text-foreground underline underline-offset-4">Instagram: @yikat.app</a></li>
      </ul>

      <div className="mt-12 rounded-xl border border-border bg-card p-4">
        <PaymentBand tone="light" />
      </div>
    </LegalPageShell>
  )
}
