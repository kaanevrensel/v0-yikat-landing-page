// Merkezi site verisi — ayakkabı yıkama pivotu.
// Spec: docs/superpowers/specs/2026-07-05-ayakkabi-pivot-design.md
// Kural: Çekmeköy/eski döneme ait hiçbir veri ve rakam kullanılmaz (spec §2).

export const siteConfig = {
  name: "YIKAT",
  url: "https://www.yikat.tech",
  phone: "0850 303 31 93",
  phoneE164: "+908503033193",
  phoneHref: "tel:+908503033193",
  email: "destek@yikat.tech",
  address: {
    street: "Cevizlik Mah. İskele Cd. No: 15C",
    district: "Bakırköy",
    city: "İstanbul",
    postalCode: "34142",
    full: "Cevizlik Mah. İskele Cd. No: 15C, 34142 Bakırköy/İstanbul",
  },
  hours: { label: "Her gün 09:00 – 20:00", opens: "09:00", closes: "20:00" },
  // Sahip beyanı (2026-07-11): kategoriye göre sabit fiyat, bu aralıkta. Kesin menü gelince
  // priceMenu doldurulur; bu etiket UI + JSON-LD priceRange'in tek kaynağıdır.
  priceRangeLabel: "400–1000 ₺",
  // Google/Apple Maps derin linkleri (Yol Tarifi CTA'ları)
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Cevizlik+Mah.+%C4%B0skele+Cd.+15C+Bak%C4%B1rk%C3%B6y+%C4%B0stanbul",
  mapsPlaceUrl:
    "https://www.google.com/maps/search/?api=1&query=Cevizlik+Mah.+%C4%B0skele+Cd.+15C+Bak%C4%B1rk%C3%B6y+%C4%B0stanbul",
  appleDirectionsUrl:
    "https://maps.apple.com/?daddr=Cevizlik+Mah.+%C4%B0skele+Cd.+15C+Bak%C4%B1rk%C3%B6y+%C4%B0stanbul",
  // GERÇEK pin (sahip paylaşımı 2026-07-11, maps.app.goo.gl/r4Z4ebDJxrPf9avY6) — Google'ın
  // yapılandırılmış veri şartı olan ≥5 ondalık hassasiyette. Launch-blocker kapandı.
  geo: { latitude: 40.977817, longitude: 28.877776 },
  // WhatsApp: 0850 hattı üzerinden (sahip GBP'ye de aynı linki koydu, 2026-07-11).
  whatsappHref: "https://wa.me/908503033193",
  // Sahip GBP'yi sahiplenip gerçek profil linklerini verince doldurulacak — boşken JSON-LD
  // sameAs üretilmez ve footer sosyal satırı render edilmez. Bkz: owner-blockers.md
  socialLinks: { googleBusinessProfile: "", instagram: "" },
} as const

// Güven şeridi — rakamsız değer önerileri (spec §2.2)
export const valueProps = [
  {
    icon: "clock",
    title: "Aynı Gün Teslim",
    description: "Sabah bırak, akşam al. Ayakkabın aynı gün tertemiz hazır.",
  },
  {
    icon: "shield",
    title: "YIKAT Garantisi",
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
    a: "Aynı gün. Sabah bıraktığın ayakkabıyı aynı gün akşam 20:00'ye kadar teslim alabilirsin.",
  },
  {
    q: "Sneaker yıkama aynı gün teslim edilir mi?",
    a: "Evet. Sneaker dahil tüm ayakkabılarda aynı gün teslim geçerli. Sabah bırak, akşam 20:00'ye kadar al.",
  },
  {
    q: "Randevu gerekli mi?",
    a: "Hayır. Randevusuz gel, ayakkabını bırak. Aynı gün akşam 20:00'ye kadar teslim.",
  },
  {
    q: "Memnun kalmazsam ne oluyor?",
    a: "YIKAT Garantisi: Sonuçtan memnun kalmazsan ücretsiz tekrar yıkıyoruz.",
  },
  {
    q: "Ayakkabı yıkama ücreti ne kadar?",
    a: "Kategoriye (spor/sneaker, deri, süet-nubuk, çocuk) göre sabit fiyat uygulanır; fiyatlar 400–1000 ₺ aralığındadır. Kesin menü dükkanda. Yakında bu sayfada da yayınlanacak.",
  },
  {
    q: "Çalışma saatleriniz ne?",
    a: "Her gün 09:00 – 20:00. Pazar günleri de açığız.",
  },
  {
    q: "Ödeme nasıl yapılıyor?",
    a: "Nakit ve kart geçerli.",
  },
  {
    q: "Neredesiniz?",
    a: "Cevizlik Mah. İskele Cd. No: 15C, Bakırköy/İstanbul. İstanbul Caddesi'nin bir alt sokağında. Bakırköy ve Yenimahalle Marmaray istasyonlarına 8 dakika uzaklıkta.",
  },
] as const
