import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"
import { careGuides } from "@/lib/care-guides"
import { CONTENT_DATE } from "@/lib/discovery"

// changeFrequency/priority bilinçle YOK (Google ikisini de yok sayıyor). lastModified her build'de
// yenilenen new Date() İDİ — Google lastmod'u yalnız "tutarlı ve doğrulanabilir" ise kullanır;
// bu yüzden gerçek içerik-değişim tarihleri elle tutulur (içerik değişince güncelle).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["/ayakkabi-temizleme", "/bakirkoy-ayakkabi-temizleme", "/rehber", ...careGuides.map(g => `/rehber/${g.slug}`)].map(path => ({ url: `${siteConfig.url}${path}`, lastModified: new Date(CONTENT_DATE) })),
    { url: `${siteConfig.url}/urun`, lastModified: new Date("2026-10-10") },
    { url: `${siteConfig.url}/partnerler`, lastModified: new Date("2026-10-10") },
    { url: siteConfig.url, lastModified: new Date("2026-10-10") },
    { url: `${siteConfig.url}/sneaker-yikama`, lastModified: new Date(CONTENT_DATE) },
    { url: `${siteConfig.url}/suet-nubuk-temizleme`, lastModified: new Date(CONTENT_DATE) },
    { url: `${siteConfig.url}/deri-ayakkabi-bakimi`, lastModified: new Date(CONTENT_DATE) },
    { url: `${siteConfig.url}/kvkk`, lastModified: new Date("2026-10-12") },
    // Legal texts the contract and privacy pages cite by name (published 2026-10-12).
    ...["/kullanim-kosullari", "/odeme-ve-guvenli-alisveris", "/kvkk-basvuru-formu", "/acik-riza-metni", "/kart-saklama-metni"].map(path => ({ url: `${siteConfig.url}${path}`, lastModified: new Date("2026-10-12") })),
    { url: `${siteConfig.url}/mesafeli-satis-sozlesmesi`, lastModified: new Date("2026-08-27") },
    { url: `${siteConfig.url}/gizlilik-politikasi`, lastModified: new Date("2026-10-08") },
    { url: `${siteConfig.url}/hesap-silme`, lastModified: new Date("2026-09-05") },
    { url: `${siteConfig.url}/teslimat-ve-iade`, lastModified: new Date("2026-08-27") },
    { url: `${siteConfig.url}/iletisim`, lastModified: new Date(CONTENT_DATE) },
  ]
}
