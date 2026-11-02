import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"
import { careGuides, guideRelease } from "@/lib/care-guides"
import { guideModified } from "@/lib/discovery"

// changeFrequency/priority bilinçle YOK (Google ikisini de yok sayıyor). lastModified her build'de
// yenilenen new Date() İDİ — Google lastmod'u yalnız "tutarlı ve doğrulanabilir" ise kullanır;
// bu yüzden gerçek içerik-değişim tarihleri elle tutulur (içerik değişince güncelle).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteConfig.url}/ayakkabi-temizleme`, lastModified: new Date("2026-10-21") },
    { url: `${siteConfig.url}/bakirkoy-ayakkabi-temizleme`, lastModified: new Date("2026-10-25") },
    // The hub lists every guide of the release: lastmod moves when that list changes (converter).
    { url: `${siteConfig.url}/rehber`, lastModified: new Date(guideRelease.hubUpdated) },
    ...careGuides.map(guide => ({
      url: `${siteConfig.url}/rehber/${guide.slug}`,
      // The guide's own last substantive edit (updated ?? published ?? first release). No sitewide
      // floor: link-only changes (related guides, guide links, service rows) do not move it.
      lastModified: new Date(guideModified(guide)),
    })),
    { url: `${siteConfig.url}/urun`, lastModified: new Date("2026-10-16") },
    { url: `${siteConfig.url}/partnerler`, lastModified: new Date("2026-10-10") },
    { url: siteConfig.url, lastModified: new Date("2026-10-25") },
    // Actual service-scope edits in ac6b2d4 (2026-10-21), not this build's date.
    { url: `${siteConfig.url}/sneaker-yikama`, lastModified: new Date("2026-10-21") },
    { url: `${siteConfig.url}/suet-nubuk-temizleme`, lastModified: new Date("2026-10-21") },
    { url: `${siteConfig.url}/deri-ayakkabi-bakimi`, lastModified: new Date("2026-10-21") },
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
