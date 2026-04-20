import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
})

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-fraunces',
  axes: ['opsz'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Çekmeköy Çamaşır ve Ayakkabı Yıkama Servisi | Kapıdan Alım, Kapıya Teslim — YIKAT',
  description: 'Çekmeköy çamaşır yıkama servisi. Evden çamaşır toplama, yıkama, ütüleme ve kapıya teslim. Kilo bazlı fiyatlandırma, 24–48 saat teslim. WhatsApp ile sipariş.',  
  icons: {
    icon: [
      {
        url: '/images/yikat-logo-blue.png',
        type: 'image/png',
      },
    ],
    apple: '/images/yikat-logo-blue.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.yikat.tech/',
    title: 'YIKAT — Çamaşır ve Ayakkabı Yıkama Servisi',
    description: 'Çekmeköy çamaşır yıkama servisi. Kapıdan toplama, yıkama, ütüleme ve teslim. Kilo bazlı fiyat, 24–48 saat.',
    locale: 'tr_TR',
    siteName: 'YIKAT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YIKAT — Çamaşır ve Ayakkabı Yıkama Servisi',
    description: 'Kapıdan alım, kapıya teslim. Kilo bazlı çamaşır ve ayakkabı yıkama hizmeti.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.yikat.tech/',
  },
  verification: {
    google: 'STVQceqys-HuTc9IuB8MElUcaltLIoRKCwBQ-FkwUYA',
  },
}

export const viewport: Viewport = {
  themeColor: '#4A8CFF',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CleaningService",
      "name": "YIKAT",
      "alternateName": "Yıkat Çamaşır Servisi",
      "description": "Çamaşır ve ayakkabı temizliğini kapıdan alıp kapıya teslim eden, kilo bazlı fiyatlandırma ile çalışan pratik temizlik servisi.",
      "url": "https://www.yikat.tech",
      "telephone": "+908503033193",
      "email": "destek@yikat.tech",
      "priceRange": "₺₺",
      "openingHours": "Mo-Su 08:00-22:00",
      "areaServed": { "@type": "City", "name": "Çekmeköy" },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Yıkat Hizmetleri",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": { "@type": "Service", "name": "Kiloyla Çamaşır Yıkama" },
            "price": "110", "priceCurrency": "TRY"
          },
          {
            "@type": "Offer",
            "itemOffered": { "@type": "Service", "name": "Ütü Hizmeti" },
            "price": "30", "priceCurrency": "TRY"
          },
          {
            "@type": "Offer",
            "itemOffered": { "@type": "Service", "name": "Ayakkabı Yıkama" }
          }
        ]
      }
    })
  }}
/>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "YIKAT nedir?",
          "acceptedAnswer": { "@type": "Answer", "text": "YIKAT, çamaşır ve ayakkabı temizliğini kapıdan alıp kapıya teslim eden bir hizmet servisidir. Kilo bazlı fiyatlandırma ile çalışır." }
        },
        {
          "@type": "Question",
          "name": "Hangi bölgelerde hizmet veriyorsunuz?",
          "acceptedAnswer": { "@type": "Answer", "text": "Şu an Çekmeköy'de hizmet vermekteyiz. Hizmet bölgemizi sürekli genişletiyoruz." }
        },
        {
          "@type": "Question",
          "name": "Çamaşırlarım ne kadar sürede teslim edilir?",
          "acceptedAnswer": { "@type": "Answer", "text": "Standart siparişlerde teslim süresi 24–48 saattir." }
        },
        {
          "@type": "Question",
          "name": "Ödeme nasıl yapılıyor?",
          "acceptedAnswer": { "@type": "Answer", "text": "Nakit, kredi kartı veya havale ile ödeme yapabilirsiniz." }
        }
      ]
    })
  }}
         />
         {children}
        <Analytics />
      </body>
    </html>
  )
}
