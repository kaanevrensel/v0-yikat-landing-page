// Contextual guide links on the shoe service pages (content plan of 2 November 2026,
// siteChanges.serviceLinkRows). They sit inside existing sections with the guide titles as
// anchors; a page shows only the guides that are in the current release. Adding a row is a
// link-only change: it does not move the page's sitemap lastmod.
export const serviceGuideLinks: Record<string, string[]> = {
  "/sneaker-yikama": ["spor-ayakkabi-nasil-temizlenir", "beyaz-ayakkabi-nasil-temizlenir", "file-orgu-ayakkabi-temizligi", "bez-ayakkabi-nasil-temizlenir", "sararan-ayakkabi-tabani-nasil-beyazlatilir"],
  "/suet-nubuk-temizleme": ["suet-nubuk-ayakkabi-nasil-temizlenir", "yagmurda-islanan-ayakkabi-bakimi", "ugg-nasil-temizlenir", "timberland-bot-nasil-temizlenir", "ayakkabida-tuz-lekesi-nasil-cikar"],
  "/deri-ayakkabi-bakimi": ["deri-ayakkabi-nasil-temizlenir", "rugan-ayakkabi-nasil-temizlenir", "bot-nasil-temizlenir", "ayakkabi-nasil-saklanir"],
  // /bakirkoy-ayakkabi-temizleme also keeps its two tested links to makinede and kuru-temizlemeye.
  "/bakirkoy-ayakkabi-temizleme": ["spor-ayakkabi-nasil-temizlenir", "beyaz-ayakkabi-nasil-temizlenir", "suet-nubuk-ayakkabi-nasil-temizlenir", "ayakkabi-temizleme-fiyati-neye-gore-belirlenir"],
  "/ayakkabi-temizleme": ["ayakkabi-nasil-yikanir", "beyaz-ayakkabi-nasil-temizlenir", "ayakkabi-kokusu-nasil-giderilir", "ayakkabidaki-leke-nasil-cikar", "ayakkabidaki-yag-lekesi-nasil-cikar"],
}
