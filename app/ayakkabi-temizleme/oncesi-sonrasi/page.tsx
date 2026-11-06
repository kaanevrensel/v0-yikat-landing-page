import Link from "next/link"
import { notFound } from "next/navigation"
import { siteConfig } from "@/lib/site"
import { discoveryMetadata, BUSINESS_ID, WEBSITE_ID } from "@/lib/discovery"
import { CASE_GALLERY_PATH, caseGroups, caseReel, customerCases, publishableCases, publishableReel } from "@/lib/customer-cases"
import { DiscoveryShell, JsonLd } from "@/components/discovery/shared"
import { ShopActions } from "@/components/discovery/actions"
import { CaseArticle, CaseReelFigure } from "@/components/discovery/case-parts"

export const metadata = discoveryMetadata(
  "Ayakkabı Temizleme Öncesi ve Sonrası",
  "Bakırköy dükkânından gerçek önce ve sonra fotoğrafları: sneaker, süet, deri, bot ve çocuk ayakkabısı. Her çiftte ne getirildi, ne yapıldı, ne kaldı.",
  CASE_GALLERY_PATH,
)

const absolute = (path: string) => `${siteConfig.url}${path}`

export default function Page() {
  const cases = publishableCases(customerCases)
  if (!cases.length) notFound()
  const reel = publishableReel(caseReel, cases)
  const groups = caseGroups.map(group => ({ ...group, items: cases.filter(item => item.group === group.id) })).filter(group => group.items.length)
  const pageId = `${absolute(CASE_GALLERY_PATH)}#page`
  return <DiscoveryShell crumbs={[{ name: "Ayakkabı temizleme", path: "/ayakkabi-temizleme" }, { name: "Önce ve sonra", path: CASE_GALLERY_PATH }]}>
    <JsonLd data={{
      "@context": "https://schema.org", "@type": "CollectionPage", "@id": pageId, name: "Ayakkabı temizleme öncesi ve sonrası",
      url: absolute(CASE_GALLERY_PATH), inLanguage: "tr-TR", isPartOf: { "@id": WEBSITE_ID }, about: { "@id": BUSINESS_ID },
      mainEntity: { "@type": "ItemList", numberOfItems: cases.length, itemListElement: groups.flatMap(group => group.items).map((item, index) => ({
        "@type": "ListItem", position: index + 1, name: item.title,
        image: [item.before, item.after].map(photo => ({ "@type": "ImageObject", contentUrl: absolute(photo.src), caption: photo.alt, width: photo.width, height: photo.height, creditText: "Yıkat", creator: { "@id": BUSINESS_ID } })),
      })) },
      ...(reel ? { video: { "@type": "VideoObject", name: reel.title, description: reel.description, contentUrl: absolute(reel.video.src), thumbnailUrl: absolute(reel.poster.src), uploadDate: reel.publishedOn, duration: `PT${Math.round(reel.video.durationSeconds)}S`, width: reel.video.width, height: reel.video.height } } : {}),
    }}/>
    <header className={`case-gallery-hero${reel ? "" : " case-gallery-hero-solo"}`}>
      <div className="discovery-heading case-gallery-intro">
        <h1>Ayakkabı temizleme:<br/>önce ve sonra.</h1>
        <p className="discovery-answer">Bakırköy dükkânına gelen gerçek çiftler. Her birini geldiğinde ve iş bitince fotoğrafladık; rötuş yapmadık, yalnızca kırptık. Altlarına ne yaptığımızı ve neyin kaldığını yazdık.</p>
      </div>
      {reel && <CaseReelFigure reel={reel}/>}
      <nav className="case-gallery-jump" aria-label="Malzemeye göre örnekler">{groups.map(group => <a key={group.id} href={`#${group.anchor}`} aria-label={`${group.title}, ${group.items.length} örnek`}>{group.title}<span aria-hidden="true">{group.items.length}</span></a>)}</nav>
    </header>
    {groups.map(group => <section key={group.id} className="case-gallery-group" id={group.anchor} aria-labelledby={`${group.anchor}-title`}>
      <h2 id={`${group.anchor}-title`}>{group.title}</h2>
      {group.items.map(item => <CaseArticle key={item.slug} item={item}/>)}
    </section>)}
    <section className="discovery-prose discovery-narrow case-gallery-note">
      <h2>Her çift farklı.</h2>
      <p>Aynı leke iki ayakkabıda aynı sonucu vermeyebilir. Malzeme, ayakkabının yaşı ve evde daha önce denenen ürünler sonucu değiştirir. Boyama, renk yenileme, taban değişimi veya onarım yapmıyoruz; yalnızca temizlik ve bakım yapıyoruz.</p>
      <p>Kendi çiftin için neler yapılabileceğini malzemeye göre anlattık: <Link href="/sneaker-yikama">sneaker</Link>, <Link href="/suet-nubuk-temizleme">süet ve nubuk</Link>, <Link href="/deri-ayakkabi-bakimi">deri</Link>. Adres ve saatler <Link href="/bakirkoy-ayakkabi-temizleme">Bakırköy dükkânı</Link> sayfasında.</p>
      <p>Buradaki ayakkabılardan biri seninse ve sitede durmasını istemezsen <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> adresine ya da WhatsApp’tan yazman yeterli; o çifti siteden kaldırırız.</p>
    </section>
    <section className="discovery-local-end"><h2>Fotoğrafını gönder,<br/>beraber bakalım.</h2><p>Ayakkabının tamamı, lekenin yakın planı ve varsa bakım etiketi yeterli bir başlangıç.</p><ShopActions/></section>
  </DiscoveryShell>
}
