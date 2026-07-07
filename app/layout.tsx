import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { WebVitalsReporter } from "@/components/web-vitals-reporter"
import { priceMenu, siteConfig } from "@/lib/site"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Ayakkabı Yıkama Bakırköy — YIKAT | Aynı Gün Teslim",
  description:
    "Bakırköy İskele Caddesi'nde profesyonel ayakkabı yıkama. Spor, deri, süet — malzemesine uygun yıkama, aynı gün teslim, YIKAT Garantisi. Her gün 09:00–20:00.",
  keywords: [
    "ayakkabı yıkama bakırköy",
    "ayakkabı temizleme",
    "sneaker yıkama",
    "süet ayakkabı temizliği",
    "deri ayakkabı bakımı",
    "YIKAT",
  ],
  icons: { icon: "/images/yikat-logo-blue.png", apple: "/images/yikat-logo-blue.png" },
  alternates: { canonical: siteConfig.url },
  robots: { index: true, follow: true },
  verification: { google: "STVQceqys-HuTc9IuB8MElUcaltLIoRKCwBQ-FkwUYA" },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: "YIKAT",
    locale: "tr_TR",
    title: "Ayakkabı Yıkama Bakırköy — YIKAT",
    description: "Ayakkabın ilk günkü gibi. Aynı gün teslim, YIKAT Garantisi.",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "YIKAT — Ayakkabı Yıkama Bakırköy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayakkabı Yıkama Bakırköy — YIKAT",
    description: "Ayakkabın ilk günkü gibi. Aynı gün teslim.",
    images: ["/images/og.jpg"],
  },
}

export const viewport: Viewport = {
  themeColor: "#4A8CFF",
  width: "device-width",
  initialScale: 1,
}

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "YIKAT",
  alternateName: "Yıkat Ayakkabı Yıkama",
  description:
    "Bakırköy'de profesyonel ayakkabı yıkama dükkanı. Spor, deri, süet ve çocuk ayakkabıları için malzemesine uygun yıkama, aynı gün teslim.",
  "@id": siteConfig.url,
  url: siteConfig.url,
  telephone: siteConfig.phoneE164,
  email: siteConfig.email,
  image: `${siteConfig.url}/images/yikat-logo-blue.png`,
  priceRange: "₺₺",
  hasMap: siteConfig.mapsPlaceUrl,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.district,
    addressRegion: siteConfig.address.city,
    postalCode: siteConfig.address.postalCode,
    addressCountry: "TR",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: siteConfig.hours.opens,
    closes: siteConfig.hours.closes,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: siteConfig.geo.latitude,
    longitude: siteConfig.geo.longitude,
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Bakırköy" },
    { "@type": "City", name: "İstanbul" },
  ],
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
        <Analytics />
        <WebVitalsReporter />
      </body>
    </html>
  )
}
