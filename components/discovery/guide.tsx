import Link from "next/link"
import { DiscoveryShell, FaqList, JsonLd, RelatedLinks, ShopInvitation, SourceList, ScrollableTable } from "./shared"
import { BUSINESS_ID, CONTENT_DATE, WEBSITE_ID, careSources, type CareGuide } from "@/lib/discovery"
import { guideBySlug } from "@/lib/care-guides"
import { siteConfig } from "@/lib/site"

export function GuideView({ guide }: { guide: CareGuide }) {
  const path = `/rehber/${guide.slug}`
  const related = guide.related.map(slug => guideBySlug(slug)!).map(g => ({ href: `/rehber/${g.slug}`, title: g.title }))
  return <DiscoveryShell crumbs={[{ name: "Bakım rehberi", path: "/rehber" }, { name: guide.title, path }]}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", "@id": `${siteConfig.url}${path}#article`, headline: guide.title, description: guide.description, mainEntityOfPage: `${siteConfig.url}${path}`, url: `${siteConfig.url}${path}`, inLanguage: "tr-TR", articleSection: guide.category, datePublished: CONTENT_DATE, dateModified: CONTENT_DATE, author: { "@id": BUSINESS_ID, name: "Yıkat", url: `${siteConfig.url}/iletisim` }, publisher: { "@id": BUSINESS_ID }, isPartOf: { "@id": WEBSITE_ID }, citation: guide.sourceIds.map(id => careSources[id].url) }}/>
    <article>
      <header className="discovery-heading guide-heading"><p className="discovery-eyebrow">Bakım rehberi / {guide.category}</p><h1>{guide.title}</h1><p className="discovery-answer">{guide.answer}</p><p className="discovery-byline"><Link href="/iletisim">Yıkat</Link> · <time dateTime={CONTENT_DATE}>10 Ekim 2026</time> · <a href="#kaynaklar">Kaynaklar</a></p></header>
      <div className="discovery-reading-layout">
        <aside className="discovery-toc"><nav aria-label="Bu rehberde"><p>Bu rehberde</p><ol>{guide.sections.map(s => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ol></nav>{guide.service && <Link className="discovery-service-link" href={guide.service.href}>{guide.service.label} →</Link>}</aside>
        <div className="discovery-prose">
          {guide.sections.map(section => <section id={section.id} key={section.id}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map(p => <p key={p}>{p}</p>)}
            {section.steps && <ol className="discovery-steps">{section.steps.map(step => <li key={step}>{step}</li>)}</ol>}
            {section.table && <ScrollableTable label={section.table.caption}><table><caption>{section.table.caption}</caption><thead><tr>{section.table.headings.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{section.table.rows.map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody></table></ScrollableTable>}
            {section.sourceIds && <p className="discovery-section-sources">Kaynak: {section.sourceIds.map((id, i) => <span key={id}>{i > 0 && " · "}<a href={`#kaynak-${id}`}>{careSources[id].title.split(" — ")[0]}</a></span>)}</p>}
          </section>)}
          <FaqList faqs={guide.faqs}/>
          <SourceList ids={guide.sourceIds}/>
        </div>
      </div>
    </article>
    <RelatedLinks links={related}/>
    {guide.category === "Ayakkabı" ? <ShopInvitation/> : <section className="discovery-textile-note"><h2>Hizmet uygunluğunu önce kontrol et.</h2><p>Temizlik hizmetleri adrese göre değişir. Bir ürünü taşımadan veya sipariş planlamadan önce güncel kabul koşullarını <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp’tan sor</a>. <Link href="/urun">Yıkat Gitsin uygulamasını keşfet.</Link></p></section>}
  </DiscoveryShell>
}
