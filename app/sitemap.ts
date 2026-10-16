import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"
import { careGuides } from "@/lib/care-guides"
import { CONTENT_UPDATED } from "@/lib/discovery"

// changeFrequency/priority bilinçle YOK (Google ikisini de yok sayıyor). lastModified her build'de
// yenilenen new Date() İDİ — Google lastmod'u yalnız "tutarlı ve doğrulanabilir" ise kullanır;
// bu yüzden gerçek içerik-değişim tarihleri elle tutulur (içerik değişince güncelle).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["/ayakkabi-temizleme", "/bakirkoy-ayakkabi-temizleme", "/rehber"].map(path => ({ url: `${siteConfig.url}${path}`, lastModified: new Date("2026-10-16") })),
    ...careGuides.map(guide => ({
      url: `${siteConfig.url}/rehber/${guide.slug}`,
      // Keep the shared shop-facts revision, but never predate a newer guide edit.
      lastModified: new Date(Math.max(Date.parse(CONTENT_UPDATED), Date.parse(guide.updated ?? guide.published ?? CONTENT_UPDATED))),
    })),
    { url: `${siteConfig.url}/urun`, lastModified: new Date("2026-10-16") },
    { url: `${siteConfig.url}/partnerler`, lastModified: new Date("2026-10-10") },
    { url: siteConfig.url, lastModified: new Date("2026-10-16") },
    { url: `${siteConfig.url}/sneaker-yikama`, lastModified: new Date(CONTENT_UPDATED) },
    { url: `${siteConfig.url}/suet-nubuk-temizleme`, lastModified: new Date(CONTENT_UPDATED) },
    { url: `${siteConfig.url}/deri-ayakkabi-bakimi`, lastModified: new Date(CONTENT_UPDATED) },
    { url: `${siteConfig.url}/kvkk`, lastModified: new Date("2026-10-15") },
    // Legal texts the contract and privacy pages cite by name (published 2026-10-15).
    ...["/kullanim-kosullari", "/odeme-ve-guvenli-alisveris", "/kvkk-basvuru-formu", "/acik-riza-metni", "/kart-saklama-metni"].map(path => ({ url: `${siteConfig.url}${path}`, lastModified: new Date("2026-10-15") })),
    { url: `${siteConfig.url}/mesafeli-satis-sozlesmesi`, lastModified: new Date("2026-10-15") },
    { url: `${siteConfig.url}/gizlilik-politikasi`, lastModified: new Date("2026-10-15") },
    { url: `${siteConfig.url}/hesap-silme`, lastModified: new Date("2026-10-15") },
    { url: `${siteConfig.url}/teslimat-ve-iade`, lastModified: new Date("2026-10-15") },
    { url: `${siteConfig.url}/iletisim`, lastModified: new Date("2026-10-16") },
  ]
}
