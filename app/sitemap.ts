import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"

// changeFrequency/priority bilinçle YOK (Google ikisini de yok sayıyor). lastModified her build'de
// yenilenen new Date() İDİ — Google lastmod'u yalnız "tutarlı ve doğrulanabilir" ise kullanır;
// bu yüzden gerçek içerik-değişim tarihleri elle tutulur (içerik değişince güncelle).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, lastModified: new Date("2026-07-12") },
    { url: `${siteConfig.url}/sneaker-yikama`, lastModified: new Date("2026-07-12") },
    { url: `${siteConfig.url}/suet-nubuk-temizleme`, lastModified: new Date("2026-07-12") },
    { url: `${siteConfig.url}/deri-ayakkabi-bakimi`, lastModified: new Date("2026-07-12") },
    { url: `${siteConfig.url}/kvkk`, lastModified: new Date("2026-07-08") },
    { url: `${siteConfig.url}/mesafeli-satis-sozlesmesi`, lastModified: new Date("2026-08-27") },
    { url: `${siteConfig.url}/gizlilik-politikasi`, lastModified: new Date("2026-08-27") },
    { url: `${siteConfig.url}/hesap-silme`, lastModified: new Date("2026-09-05") },
    { url: `${siteConfig.url}/teslimat-ve-iade`, lastModified: new Date("2026-08-27") },
    { url: `${siteConfig.url}/iletisim`, lastModified: new Date("2026-08-27") },
  ]
}
