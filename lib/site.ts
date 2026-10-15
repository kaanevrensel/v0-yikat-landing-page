// Merkezi site verisi — ayakkabı yıkama pivotu.
// Spec: docs/superpowers/specs/2026-07-05-ayakkabi-pivot-design.md
// Kural: Çekmeköy/eski döneme ait hiçbir veri ve rakam kullanılmaz (spec §2).

export const siteConfig = {
  name: "Yıkat",
  url: "https://www.yikat.tech",
  phone: "0850 303 31 93",
  phoneE164: "+908503033193",
  phoneHref: "tel:+908503033193",
  email: "destek@yikat.tech",
  address: {
    // Adres düzeltmesi (sahip, 2026-08-26): resmi adres Sakızağacı Mah. İskele Caddesi
    // No:15-B. Posta kodu 34142 değişmedi (Sakızağacı Mah. aynı posta bölgesinde).
    // NAP kuralı (2026-07-10 SEO spec): bu format karakteri karakterine her platformda.
    street: "Sakızağacı Mahallesi İskele Caddesi No:15-B",
    district: "Bakırköy",
    city: "İstanbul",
    postalCode: "34142",
    full: "Sakızağacı Mahallesi İskele Caddesi No:15-B, 34142 Bakırköy/İstanbul",
  },
  // Owner correction (Kaan, 2026-10-07; reconfirmed 2026-10-12): Monday–Saturday
  // 08:30–20:30, Sunday 10:00–20:30. Supersedes the "daily 10:00–22:00" brief.
  // `schedule` feeds JSON-LD openingHoursSpecification; `label` is the one visible string.
  hours: {
    label: "Pazartesi–Cumartesi 08:30 – 20:30, Pazar 10:00 – 20:30",
    schedule: [
      {
        label: "Pazartesi–Cumartesi",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:30",
        closes: "20:30",
      },
      { label: "Pazar", days: ["Sunday"], opens: "10:00", closes: "20:30" },
    ],
  },
  // Sahip beyanı (2026-07-11): kategoriye göre sabit fiyat, bu aralıkta. Kesin menü gelince
  // priceMenu doldurulur; bu etiket UI + JSON-LD priceRange'in tek kaynağıdır.
  priceRangeLabel: "400–1000 ₺",
  // Google/Apple Maps derin linkleri (Yol Tarifi CTA'ları)
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Sak%C4%B1za%C4%9Fac%C4%B1+Mahallesi+%C4%B0skele+Caddesi+15-B+Bak%C4%B1rk%C3%B6y+%C4%B0stanbul",
  mapsPlaceUrl:
    "https://www.google.com/maps?cid=11452704591158275657",
  appleDirectionsUrl:
    "https://maps.apple.com/?daddr=Sak%C4%B1za%C4%9Fac%C4%B1+Mahallesi+%C4%B0skele+Caddesi+15-B+Bak%C4%B1rk%C3%B6y+%C4%B0stanbul",
  // GERÇEK pin (sahip paylaşımı 2026-07-11, maps.app.goo.gl/r4Z4ebDJxrPf9avY6) — Google'ın
  // yapılandırılmış veri şartı olan ≥5 ondalık hassasiyette. Launch-blocker kapandı.
  // 2026-08-26 adres düzeltmesinde (15C → Sakızağacı Mah. 15-B) pin korundu: aynı İskele
  // Caddesi dükkânı. Dükkân fiziken taşındıysa sahipten yeni pin al + dukkan-harita.webp yenile.
  geo: { latitude: 40.9778141, longitude: 28.8777991 },
  // WhatsApp: 0850 hattı üzerinden (sahip GBP'ye de aynı linki koydu, 2026-07-11).
  whatsappHref: "https://wa.me/908503033193",
  // Both identities verified in the owner's Google Business Profile, 2026-10-15.
  socialLinks: { googleBusinessProfile: "https://www.google.com/maps?cid=11452704591158275657", instagram: "https://www.instagram.com/yikat.app/" },
} as const

// Güven şeridi — rakamsız değer önerileri (spec §2.2)
export const valueProps = [
  {
    icon: "clock",
    title: "Birlikte planlayalım",
    description: "Teslim zamanını ayakkabının durumuna ve işlem ihtiyacına göre netleştirelim.",
  },
  {
    icon: "shield",
    title: "Yıkat Garantisi",
    description: "Memnun kalmazsan ücretsiz tekrar yıkarız.",
  },
  {
    icon: "gem",
    title: "Malzeme Uzmanlığı",
    description: "Sneaker, süet, deri. Her malzemeye kendine uygun yöntem.",
  },
] as const

// Fiyat menüsü — price null iken "Menü yakında" gösterilir; menü gelince "499 ₺" gibi doldurulur.
export type PriceItem = { category: string; note: string; price: string | null }
export const priceMenu: PriceItem[] = [
  { category: "Spor Ayakkabı", note: "Sneaker, kumaş, mesh ve karışık malzeme", price: null },
  { category: "Deri Ayakkabı", note: "Klasik ve günlük deri modeller", price: null },
  { category: "Süet & Nubuk", note: "Hassas yüzeylere özel bakım", price: null },
  { category: "Çocuk Ayakkabısı", note: "Tüm çocuk modelleri", price: null },
]

// SSS — hem sayfadaki accordion hem app/page.tsx'teki FAQPage JSON-LD buradan beslenir (tamamı).
export const faqs = [
  {
    q: "Hangi ayakkabılar yıkanıyor?",
    a: "Spor ayakkabı, deri, süet/nubuk ve çocuk ayakkabıları. Her malzemeye kendine uygun yöntem ve ürün kullanıyoruz.",
  },
  {
    q: "Süet ve nubuk ayakkabı yıkanır mı?",
    a: "Evet. Süet ve nubuk, hassas yüzeye özel fırça ve ürünlerle, suya boğmadan temizlenir.",
  },
  {
    q: "Ne kadar sürede teslim ediyorsunuz?",
    a: "Teslim zamanını ayakkabının durumuna, kuruma ihtiyacına ve günlük yoğunluğa göre netleştiriyoruz. Belirli bir saate ihtiyacın varsa önce WhatsApp’tan sor.",
  },
  {
    q: "Sneaker yıkama aynı gün teslim edilir mi?",
    a: "Aynı gün uygunluğunu ayakkabıyı değerlendirerek netleştirelim. Her model ve işlem için önceden garanti vermiyoruz.",
  },
  {
    q: "Randevu gerekli mi?",
    a: "Ayakkabını doğrudan dükkâna getirebilirsin. Güncel ücret ve teslim zamanını kabul sırasında netleştirelim.",
  },
  {
    q: "Memnun kalmazsam ne oluyor?",
    a: "Yıkat Garantisi: Sonuçtan memnun kalmazsan ücretsiz tekrar yıkıyoruz.",
  },
  {
    q: "Ayakkabı yıkama ücreti ne kadar?",
    a: "Güncel ücret için ayakkabının türünü ve durumunu paylaş. İşlem kapsamını ve fiyatı dükkânda veya WhatsApp’tan netleştirelim.",
  },
  {
    q: "Çalışma saatleriniz ne?",
    a: "Pazartesi–Cumartesi 08:30 – 20:30, Pazar 10:00 – 20:30.",
  },
  {
    q: "Ödeme nasıl yapılıyor?",
    a: "Nakit ve kart geçerli.",
  },
  {
    q: "Neredesiniz?",
    a: "Sakızağacı Mahallesi İskele Caddesi No:15-B, Bakırköy/İstanbul. Yol tarifi bağlantısı ve dükkân fotoğrafı için Bakırköy sayfamıza bakabilirsin.",
  },
] as const
