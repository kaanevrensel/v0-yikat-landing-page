import type { Metadata } from "next"
import { MapPin, Clock, Phone, Mail, MessageCircle } from "lucide-react"

import { LegalPageShell } from "@/components/legal/legal-page-shell"
import { PaymentBand } from "@/components/payment-band"
import { siteConfig } from "@/lib/site"
import legal from "@/lib/legal-content.json"

// İletişim — iyzico üye işyeri incelemesi web sitesinde iletişim e-postası ve/veya
// telefon numarası arıyor (eksik-belge e-postası 2026-08-27; footer'da vardı ama
// ayrı sayfa istendi). Pivot yönlendirmesi (/iletisim → /) kaldırıldı.
// Hakkımızda bloğu app.yikat.tech/iletisim ile aynı ticari kimliği taşır:
// işletme kimliği lib/legal-content.json'daki COMPANY'den gelir.

export const metadata: Metadata = {
  title: "İletişim - Yıkat",
  description:
    "Yıkat iletişim: Bakırköy dükkân adresi, telefon, WhatsApp, e-posta ve çalışma saatleri.",
  alternates: { canonical: "https://www.yikat.tech/iletisim" },
}

const company = legal.company

export default function IletisimPage() {
  return (
    <LegalPageShell title="İletişim">
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

      <div className="mt-12 rounded-xl border border-border bg-card p-4">
        <PaymentBand tone="light" />
      </div>
    </LegalPageShell>
  )
}
