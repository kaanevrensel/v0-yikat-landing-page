import Link from "next/link"
import { DiscoveryShell, FaqList, JsonLd, RelatedLinks, ShopInvitation, SourceList, ScrollableTable } from "./shared"
import { BUSINESS_ID, CONTENT_DATE, WEBSITE_ID, careSources, formatContentDate, type CareGuide } from "@/lib/discovery"
import { guideBySlug } from "@/lib/care-guides"
import { siteConfig } from "@/lib/site"
import { DiscoveryLink } from "./actions"

export function GuideView({ guide }: { guide: CareGuide }) {
  const path = `/rehber/${guide.slug}`
  const published = guide.published ?? CONTENT_DATE
  const related = guide.related.map(slug => guideBySlug(slug)!).map(g => ({ href: `/rehber/${g.slug}`, title: g.title }))
  return <DiscoveryShell crumbs={[{ name: "Bakım rehberi", path: "/rehber" }, { name: guide.title, path }]}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", "@id": `${siteConfig.url}${path}#article`, headline: guide.title, description: guide.description, mainEntityOfPage: `${siteConfig.url}${path}`, url: `${siteConfig.url}${path}`, inLanguage: "tr-TR", articleSection: guide.category, datePublished: published, dateModified: guide.updated ?? published, author: { "@id": BUSINESS_ID, name: "Yıkat", url: `${siteConfig.url}/iletisim` }, publisher: { "@id": BUSINESS_ID }, isPartOf: { "@id": WEBSITE_ID }, citation: guide.sourceIds.map(id => careSources[id].url) }}/>
    <article>
      <header className="discovery-heading guide-heading"><h1>{guide.title}</h1><p className="discovery-answer">{guide.answer}</p><p className="discovery-byline"><Link href="/iletisim">Yıkat</Link> · <time dateTime={published}>{formatContentDate(published)}</time>{guide.updated && <> · Güncellendi: <time dateTime={guide.updated}>{formatContentDate(guide.updated)}</time></>} · <a href="#kaynaklar">Kaynaklar</a></p>{guide.service && <DiscoveryLink action="service" className="discovery-service-link" href={guide.service.href}>{guide.service.label} →</DiscoveryLink>}</header>
      <div className="discovery-reading-layout">
        <aside className="discovery-toc"><nav aria-label="Bu rehberde"><p>Bu rehberde</p><ol>{guide.sections.map(s => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ol></nav></aside>
        <div className="discovery-prose">
          {guide.sections.map(section => <section id={section.id} key={section.id}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map(p => <p key={p}>{p}</p>)}
            {section.steps && <ol className="discovery-steps">{section.steps.map(step => <li key={step}>{step}</li>)}</ol>}
            {section.table && <ScrollableTable label={section.table.caption}><table data-columns={section.table.headings.length}><caption>{section.table.caption}</caption><thead><tr>{section.table.headings.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{section.table.rows.map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody></table></ScrollableTable>}
            {section.sourceIds && <p className="discovery-section-sources">Kaynak: {section.sourceIds.map((id, i) => <span key={id}>{i > 0 && " · "}<a href={`#kaynak-${id}`}>{careSources[id].title.split(" — ")[0]}</a></span>)}</p>}
          </section>)}
          <FaqList faqs={guide.faqs}/>
          <SourceList ids={guide.sourceIds} updated={guide.updated} published={published}/>
        </div>
      </div>
    </article>
    <RelatedLinks links={related}/>
    {guide.category === "Ayakkabı" ? <ShopInvitation/> : <section className="discovery-textile-note"><h2>Hizmet uygunluğunu önce kontrol et.</h2><p>Tekstil hizmetlerimiz için hazırlıklarımız sürüyor. Şu an Bakırköy dükkânında ayakkabı temizliği yapıyoruz. Güncel durumu <DiscoveryLink action="whatsapp" href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp’tan sor</DiscoveryLink>. <Link href="/urun">Yıkat uygulamasını keşfet.</Link></p></section>}
  </DiscoveryShell>
}
