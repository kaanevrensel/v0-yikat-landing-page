import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { careGuides } from "@/lib/care-guides"
import { discoveryMetadata, WEBSITE_ID } from "@/lib/discovery"
import { guideCategories, guideTopics, topicsOf } from "@/lib/guide-topics"
import { DiscoveryShell, JsonLd } from "@/components/discovery/shared"
import { siteConfig } from "@/lib/site"

export const metadata = discoveryMetadata("Ayakkabı ve Tekstil Bakım Rehberi", "Ayakkabı yıkama, süet temizliği, beyaz sneaker, koku, kurutma ve tekstil bakımı sorularına üretici kaynaklarıyla yanıtlar.", "/rehber")

// One hub URL: category blocks, then one section per topic (anchor = plan topic anchor).
// careGuides is already in hub order (pillars first); topics without a released guide are left out.
const categories = guideCategories.map(category => ({
  ...category,
  topics: topicsOf(category.category)
    .map(label => ({ label, ...guideTopics[label], guides: careGuides.filter(guide => guide.topic === label) }))
    .filter(topic => topic.guides.length > 0),
})).filter(category => category.topics.length > 0)

export default function Page() {
  return <DiscoveryShell crumbs={[{ name: "Bakım rehberi", path: "/rehber" }]}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Ayakkabı ve tekstil bakım rehberi", url: `${siteConfig.url}/rehber`, isPartOf: { "@id": WEBSITE_ID }, mainEntity: { "@type": "ItemList", itemListElement: careGuides.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: `${siteConfig.url}/rehber/${g.slug}`, name: g.title })) } }}/>
    <header className="discovery-heading"><h1>Yıkamadan önce<br/>bir göz at.</h1><p className="discovery-answer">Hangi yöntem hangi malzemeye uygun? Ayakkabıdan bakım etiketine, sık sorulan soruları üretici kaynaklarıyla birlikte ele alıyoruz.</p></header>
    <nav className="guide-topic-index" aria-label="Rehber konuları">{categories.map(category => <div key={category.anchor}>
      <p><a href={`#${category.anchor}`}>{category.title}</a></p>
      <ul>{category.topics.map(topic => <li key={topic.anchor}><a href={`#${topic.anchor}`}>{topic.label}</a></li>)}</ul>
    </div>)}</nav>
    {categories.map(category => <div className="guide-category" id={category.anchor} key={category.anchor}>
      <h2 className="guide-category-title">{category.title}</h2>
      {category.topics.map(topic => <section className="guide-collection" id={topic.anchor} key={topic.anchor}>
        <h2>{topic.label}</h2>
        <p className="guide-topic-intro">{topic.intro}</p>
        <ul>{topic.guides.map(g => <li key={g.slug}><Link href={`/rehber/${g.slug}`}><div><h3>{g.title}</h3><p>{g.description}</p></div><ArrowUpRight size={24} aria-hidden="true"/></Link></li>)}</ul>
      </section>)}
    </div>)}
    <section className="discovery-prose discovery-narrow" aria-labelledby="care-card-title"><h2 id="care-card-title">Bakım kartın elinin altında olsun.</h2><p>Kumaş ve file, düz deri, süet ve nubuk için ilk adımlar; kurutma ve işlemi bırakman gereken belirtiler tek sayfada. PDF’yi kaydedip çevrimdışı okuyabilir veya yazdırabilirsin.</p><a className="discovery-inline-link" href="/downloads/yikat-ayakkabi-bakim-karti.pdf" download>Ayakkabı bakım kartını indir (PDF, 1 sayfa)</a></section>
    <div className="discovery-editorial-note"><h2>Önce ürünün kendi talimatı.</h2><p>Rehberler genel bilgi verir. Bir modelin üretici talimatını başka bir modele uygulama. Yayınlayan ve iletişim bilgileri için <Link href="/iletisim">künye sayfasına</Link>, ayakkabı hizmetleri için <Link href="/ayakkabi-temizleme">temizleme seçeneklerine</Link> bakabilirsin.</p></div>
  </DiscoveryShell>
}
