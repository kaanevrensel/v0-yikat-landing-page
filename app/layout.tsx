import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const okine = localFont({
  src: [
    { path: '../public/fonts/MADEOkineSansPERSONALUSE-Thin.otf', weight: '100' },
    { path: '../public/fonts/MADEOkineSansPERSONALUSE-Light.otf', weight: '300' },
    { path: '../public/fonts/MADEOkineSansPERSONALUSE-Regular.otf', weight: '400' },
    { path: '../public/fonts/MADEOkineSansPERSONALUSE-Medium.otf', weight: '500' },
    { path: '../public/fonts/MADEOkineSansPERSONALUSE-Bold.otf', weight: '700' },
    { path: '../public/fonts/MADEOkineSansPERSONALUSE-Black.otf', weight: '900' },
  ],
  variable: '--font-okine',
  display: 'swap',
})

const SITE_URL = 'https://www.yikat.tech'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'YIKAT — Kuru Temizleme, Çamaşır ve Ütü | Kapıdan Alım, Kapıya Teslim',
  description:
    'Siz işinize bakın, kıyafet bize emanet. Kuru temizleme, çamaşır, ütü ve daha fazlası. Kapıdan toplama, profesyonel temizlik, kapıya teslim. İstanbul Anadolu Yakası’nda seçilmiş partner kuru temizlemecilerle. Tüm sipariş uygulamada.',
  keywords: [
    'kuru temizleme istanbul',
    'kuru temizleme kapıdan',
    'çamaşır yıkama servisi',
    'ütü hizmeti',
    'kapıdan alım kapıya teslim',
    'YIKAT',
  ],
  icons: {
    icon: [{ url: '/images/yikat-logo-blue.png', type: 'image/png' }],
    apple: '/images/yikat-logo-blue.png',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'YIKAT — Siz işinize bakın. Kıyafet bize emanet.',
    description:
      'Kuru temizleme, çamaşır, ütü ve daha fazlası. Kapıdan toplama, profesyonel temizlik, kapıya teslim. Tüm sipariş uygulamada.',
    locale: 'tr_TR',
    siteName: 'YIKAT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YIKAT — Siz işinize bakın. Kıyafet bize emanet.',
    description:
      'Premium temizlik aggregator. Kapıdan alım, kapıya teslim. Tüm sipariş uygulamada.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  verification: {
    google: 'STVQceqys-HuTc9IuB8MElUcaltLIoRKCwBQ-FkwUYA',
  },
}

export const viewport: Viewport = {
  themeColor: '#4A8CFF',
  width: 'device-width',
  initialScale: 1,
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'YIKAT',
  alternateName: 'Yıkat',
  url: SITE_URL,
  logo: `${SITE_URL}/images/yikat-logo-blue.png`,
  email: 'destek@yikat.tech',
  telephone: '+908503033193',
  sameAs: [],
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'DryCleaningOrLaundry',
  name: 'YIKAT',
  description:
    'Kuru temizleme, çamaşır ve ütü hizmetini kapıdan alıp kapıya teslim eden, seçilmiş partner kuru temizlemecilerle çalışan premium temizlik aggregator. Tüm sipariş mobil uygulamada tamamlanır.',
  url: SITE_URL,
  telephone: '+908503033193',
  email: 'destek@yikat.tech',
  priceRange: '₺₺',
  openingHours: 'Mo-Su 08:00-22:00',
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'İstanbul Anadolu Yakası' },
    { '@type': 'City', name: 'İstanbul' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'YIKAT Hizmetleri',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Kuru Temizleme' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Çamaşır Yıkama' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Ütü Hizmeti' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Ayakkabı Temizleme' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hacimli Tekstil Temizliği' } },
    ],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hangi bölgelerde hizmet veriyorsunuz?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'İstanbul Anadolu Yakası’ndan başlıyoruz ve listemiz her hafta büyüyor. Mahalleniz kapsamda mı, uygulamada adresinizi girince anında görürsünüz.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kuru temizleme fiyatları nasıl belirleniyor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fiyatlar hizmet ve parça bazında, uygulama içinde şeffaf biçimde gösterilir. Adresinizi girdiğinizde size uygun fiyatları net olarak görürsünüz.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hasar olursa ne oluyor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'YIKAT Garantisi geçerlidir: memnun kalmazsanız ücretsiz yeniden temizleriz, hasar durumunda açık ve yazılı bir iade prosedürü işletiriz.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ödeme nasıl yapılıyor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tüm sipariş ve ödeme akışı mobil uygulamada gerçekleşir. Kartınızı bir kez tanımlar, sonraki siparişlerde tek dokunuşla ödersiniz.',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body className={`${okine.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
