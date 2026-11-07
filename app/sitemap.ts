import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"
import { careGuides, guideRelease } from "@/lib/care-guides"
import { guideModified } from "@/lib/discovery"
import { CASE_GALLERY_PATH, customerCases, latestApproval, publishableCases } from "@/lib/customer-cases"

// changeFrequency/priority bilinçle YOK (Google ikisini de yok sayıyor). lastModified her build'de
// yenilenen new Date() İDİ — Google lastmod'u yalnız "tutarlı ve doğrulanabilir" ise kullanır;
// bu yüzden gerçek içerik-değişim tarihleri elle tutulur (içerik değişince güncelle).
export default function sitemap(): MetadataRoute.Sitemap {
  // Önce/sonra galerisi yalnız yayın izni incelenmiş vaka varken var; tarihi son onay tarihi.
  const casesUpdated = latestApproval(publishableCases(customerCases))
  const latest = (...dates: (string | null)[]) => new Date(dates.filter((date): date is string => !!date).sort().at(-1)!)
  return [
    { url: `${siteConfig.url}/ayakkabi-temizleme`, lastModified: latest("2026-10-21", casesUpdated) },
    ...(casesUpdated ? [{ url: `${siteConfig.url}${CASE_GALLERY_PATH}`, lastModified: new Date(casesUpdated) }] : []),
    // Pages with a before/after strip move with the latest case approval too.
    { url: `${siteConfig.url}/bakirkoy-ayakkabi-temizleme`, lastModified: latest("2026-10-25", casesUpdated) },
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
    { url: `${siteConfig.url}/sneaker-yikama`, lastModified: latest("2026-10-21", casesUpdated) },
    { url: `${siteConfig.url}/suet-nubuk-temizleme`, lastModified: latest("2026-10-21", casesUpdated) },
    { url: `${siteConfig.url}/deri-ayakkabi-bakimi`, lastModified: latest("2026-10-21", casesUpdated) },
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
