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
  // Google/Apple Maps derin linkleri (Yol Tarifi CTA'ları)
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Cevizlik+Mah.+%C4%B0skele+Cd.+15C+Bak%C4%B1rk%C3%B6y+%C4%B0stanbul",
  mapsPlaceUrl:
    "https://www.google.com/maps/search/?api=1&query=Cevizlik+Mah.+%C4%B0skele+Cd.+15C+Bak%C4%B1rk%C3%B6y+%C4%B0stanbul",
  appleDirectionsUrl:
    "https://maps.apple.com/?daddr=Cevizlik+Mah.+%C4%B0skele+Cd.+15C+Bak%C4%B1rk%C3%B6y+%C4%B0stanbul",
  // Yaklaşık konum — açılıştan önce dükkanın gerçek Google Maps pin'iyle doğrulanacak
  geo: { latitude: 40.9781, longitude: 28.8724 },
} as const

// Güven şeridi — rakamsız değer önerileri (spec §2.2)
export const valueProps = [
  {
    title: "Aynı Gün Teslim",
    description: "Sabah bırak, akşam al. Ayakkabın aynı gün tertemiz hazır.",
  },
  {
    title: "YIKAT Garantisi",
    description: "Memnun kalmazsan ücretsiz tekrar yıkarız.",
  },
  {
    title: "Malzeme Uzmanlığı",
    description: "Süet, deri, spor — her malzemeye kendine uygun yöntem.",
  },
] as const

// Fiyat menüsü — price null iken "Menü yakında" gösterilir; menü gelince "499 ₺" gibi doldurulur.
export type PriceItem = { category: string; note: string; price: string | null }
export const priceMenu: PriceItem[] = [
  { category: "Spor Ayakkabı", note: "Kumaş, mesh ve karışık malzeme", price: null },
  { category: "Deri Ayakkabı", note: "Klasik ve günlük deri modeller", price: null },
  { category: "Süet & Nubuk", note: "Hassas yüzeylere özel bakım", price: null },
  { category: "Çocuk Ayakkabısı", note: "Tüm çocuk modelleri", price: null },
]

// SSS — hem sayfadaki accordion hem layout'taki FAQPage JSON-LD buradan beslenir.
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
    q: "Memnun kalmazsam ne oluyor?",
    a: "YIKAT Garantisi: Sonuçtan memnun kalmazsan ücretsiz tekrar yıkıyoruz.",
  },
  {
    q: "Fiyatlar ne kadar?",
    a: "Fiyat menümüz dükkanda; yakında bu sayfada da yayınlanacak. Kategoriye (spor, deri, süet/nubuk, çocuk) göre sabit fiyat uygulanır.",
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
    a: "Cevizlik Mah. İskele Cd. No: 15C, Bakırköy/İstanbul. Bakırköy çarşı bölgesinde, iskeleye yürüme mesafesinde.",
  },
] as const
