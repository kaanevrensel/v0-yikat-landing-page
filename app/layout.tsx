import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { WebVitalsReporter } from "@/components/web-vitals-reporter"
import { ContactMeasurement } from "@/components/contact-measurement"
import { contactPagePaths } from "@/lib/contact-measurement"
import { careGuides } from "@/lib/care-guides"
import { priceMenu, siteConfig } from "@/lib/site"
import "./globals.css"
import "./marketing.css"
import "./centered.css"
import "./editorial.css"
import "./objects.css"
import "./craft.css"
import "./experiences.css"
import "./discovery.css"

// Site yüzü: Bricolage Grotesque (SIL OFL 1.1, sahip kararı 2026-07-10 — her yerde).
// Değişken font: opsz ekseni küçük boyutlarda metin-optik kesim sağlar; latin-ext Türkçe için.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-bricolage",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Yıkat | Bakırköy Ayakkabı Temizleme",
  description:
    "Bakırköy’de ayakkabını malzemesine uygun yıkat. Sneaker, deri, süet ve nubuk bakımı; dükkân bilgileri, bakım rehberleri ve Yıkat uygulaması.",
  keywords: [
    "ayakkabı yıkama bakırköy",
    "ayakkabı temizleme",
    "sneaker yıkama",
    "sneaker temizleme istanbul",
    "süet ayakkabı temizliği",
    "deri ayakkabı bakımı",
    "Yıkat",
  ],
  icons: {
    icon: [
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  alternates: { canonical: siteConfig.url },
  robots: { index: true, follow: true },
  verification: {
    google: [
      "STVQceqys-HuTc9IuB8MElUcaltLIoRKCwBQ-FkwUYA",
      "rJEiugQDezmZLCEBY3hXbFkFKyIcQW3heWUz3njtwos",
    ],
    other: { "msvalidate.01": "6573F2E41E63FCBCB097E4CCBBB288F7" },
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: "Yıkat",
    locale: "tr_TR",
    title: "Yıkat | Bakırköy Ayakkabı Temizleme",
    description: "Bakırköy Sakızağacı’nda ayakkabı temizleme ve bakım. Dükkân, çalışma saatleri ve malzemeye göre bakım rehberleri.",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Yıkat, Ayakkabı Yıkama Bakırköy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yıkat | Bakırköy Ayakkabı Temizleme",
    description: "Bakırköy Sakızağacı’nda ayakkabı temizleme ve bakım. Dükkân, çalışma saatleri ve malzemeye göre bakım rehberleri.",
    images: ["/images/og.jpg"],
  },
}

export const viewport: Viewport = {
  themeColor: "#269AFF",
  width: "device-width",
  initialScale: 1,
}

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  // En spesifik mevcut alt-tip (Google şartı; ShoeCleaning tipi yok, additionalType desteklenmiyor).
  "@type": "DryCleaningOrLaundry",
  name: "Yıkat",
  alternateName: "Yıkat Ayakkabı Yıkama",
  description:
    "Bakırköy Sakızağacı’nda ayakkabı temizleme ve bakım dükkânı. Sneaker, deri, süet, nubuk ve çocuk ayakkabıları için malzemeye göre değerlendirme.",
  "@id": `${siteConfig.url}/#business`,
  url: siteConfig.url,
  telephone: siteConfig.phoneE164,
  email: siteConfig.email,
  image: `${siteConfig.url}/images/shop/bakirkoy-owner-202608.webp`,
  logo: `${siteConfig.url}/images/yikat-logo-blue.png`,
  // No current itemized menu: do not publish an old price range as a live quote.
  hasMap: siteConfig.mapsPlaceUrl,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.district,
    addressRegion: siteConfig.address.city,
    postalCode: siteConfig.address.postalCode,
    addressCountry: "TR",
  },
  openingHoursSpecification: siteConfig.hours.schedule.map((slot) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: slot.days,
    opens: slot.opens,
    closes: slot.closes,
  })),
  geo: {
    "@type": "GeoCoordinates",
    latitude: siteConfig.geo.latitude,
    longitude: siteConfig.geo.longitude,
  },
  // A physical shop is not a promise of city-wide collection.
  areaServed: { "@type": "AdministrativeArea", name: "Bakırköy" },
  // Kaynağı SSS'teki gerçek beyan ("Nakit ve kart geçerli") — uydurma veri değil.
  paymentAccepted: "Cash, Credit Card",
  currenciesAccepted: "TRY",
  // Hizmet kataloğu priceMenu'den türetilir; price:null kuralı gereği Offer'larda fiyat alanı YOK
  // ("Menü yakında" string'i şemaya sızmaz). Sahip menüyü verince fiyatlar tek noktadan akabilir.
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Ayakkabı Yıkama Hizmetleri",
    itemListElement: priceMenu.map((p) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: `${p.category} Yıkama`, description: p.note },
    })),
  },
  // sameAs yalnız gerçek profil linkleri girildiğinde üretilir (owner-blockers.md).
  ...(() => {
    // as string[]: siteConfig `as const` olduğundan boş alanlar "" literal tipinde kalıyor.
    const sameAs = (
      [siteConfig.socialLinks.googleBusinessProfile, siteConfig.socialLinks.instagram] as string[]
    ).filter(Boolean)
    return sameAs.length > 0 ? { sameAs } : {}
  })(),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${bricolage.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c") }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "WebSite", "@id": `${siteConfig.url}/#website`,
          name: "Yıkat", url: siteConfig.url, inLanguage: "tr-TR",
          publisher: { "@id": `${siteConfig.url}/#business` },
        }).replace(/</g, "\\u003c") }} />
        {children}
        <Analytics />
        <ContactMeasurement publicPaths={contactPagePaths(careGuides.map(guide => guide.slug))} />
        <WebVitalsReporter />
      </body>
    </html>
  )
}
