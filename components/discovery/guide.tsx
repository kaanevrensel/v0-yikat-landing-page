import Link from "next/link"
import { DiscoveryShell, FaqList, GuideLinks, JsonLd, RelatedLinks, ShopInvitation, SourceList, ScrollableTable } from "./shared"
import { BUSINESS_ID, WEBSITE_ID, careSources, formatContentDate, guideModified, guidePublished, type CareGuide, type CareSectionLink } from "@/lib/discovery"
import { guideBySlug } from "@/lib/care-guides"
import { siteConfig } from "@/lib/site"
import { DiscoveryLink, PhotoEnquiryLink } from "./actions"

// Photo and service links are calls to action and sit under the section's paragraphs.
// Guide links are reading links: one quiet line at the end of the section, where the
// text refers to them ("tablonun altında", "adımların altındaki rehberler").
const actionLinks = (links: CareSectionLink[] = []) => links.filter(link => link.type !== "guide")
const readingLinks = (links: CareSectionLink[] = []) => links.flatMap(link => link.type === "guide" && guideBySlug(link.slug) ? [{ href: `/rehber/${link.slug}`, label: link.label }] : [])

// A section's source line names each publisher once ("Kaynak: Persil (3 sayfa) · Tide"), linking to its first
// page in the source list, where every page is listed in full. Titles have the form "Publisher — Page title".
const sourceGroups = (ids: string[]) => ids.reduce<{ publisher: string; ids: string[] }[]>((groups, id) => {
  const publisher = careSources[id].title.split(" — ")[0]
  const group = groups.find(g => g.publisher === publisher)
  if (group) group.ids.push(id)
  else groups.push({ publisher, ids: [id] })
  return groups
}, [])

export function GuideView({ guide }: { guide: CareGuide }) {
  const path = `/rehber/${guide.slug}`
  const published = guidePublished(guide)
  const modified = guideModified(guide)
  const related = guide.related.flatMap(slug => guideBySlug(slug) ?? []).map(g => ({ href: `/rehber/${g.slug}`, title: g.title }))
  return <DiscoveryShell crumbs={[{ name: "Bakım rehberi", path: "/rehber" }, { name: guide.title, path }]}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", "@id": `${siteConfig.url}${path}#article`, headline: guide.title, description: guide.description, mainEntityOfPage: `${siteConfig.url}${path}`, url: `${siteConfig.url}${path}`, inLanguage: "tr-TR", articleSection: guide.category, datePublished: published, dateModified: modified, author: { "@id": BUSINESS_ID, name: "Yıkat", url: `${siteConfig.url}/iletisim` }, publisher: { "@id": BUSINESS_ID }, isPartOf: { "@id": WEBSITE_ID }, citation: guide.sourceIds.map(id => careSources[id].url) }}/>
    <article>
      <header className="discovery-heading guide-heading"><h1>{guide.title}</h1><p className="discovery-answer">{guide.answer}</p><p className="discovery-byline"><Link href="/iletisim">Yıkat</Link> · <time dateTime={published}>{formatContentDate(published)}</time>{guide.updated && <> · Güncellendi: <time dateTime={guide.updated}>{formatContentDate(guide.updated)}</time></>} · <a href="#kaynaklar">Kaynaklar</a></p>{guide.service && <DiscoveryLink action="service" className="discovery-service-link" href={guide.service.href}>{guide.service.label} →</DiscoveryLink>}</header>
      <div className="discovery-reading-layout">
        <aside className="discovery-toc"><nav aria-label="Bu rehberde"><p>Bu rehberde</p><ol>{guide.sections.map(s => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ol></nav></aside>
        <div className="discovery-prose">
          {guide.sections.map(section => <section id={section.id} key={section.id}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map(p => <p key={p}>{p}</p>)}
            {actionLinks(section.links).length > 0 && <div className="discovery-section-links">{actionLinks(section.links).map(link => link.type === "photo"
              ? <PhotoEnquiryLink key={link.label} className="discovery-inline-link">{link.label}</PhotoEnquiryLink>
              : <DiscoveryLink key={link.href} action="service" href={link.href} className="discovery-inline-link">{link.label}</DiscoveryLink>
            )}</div>}
            {section.steps && <ol className="discovery-steps">{section.steps.map(step => <li key={step}>{step}</li>)}</ol>}
            {section.table && <ScrollableTable label={section.table.caption}><table data-columns={section.table.headings.length}><caption>{section.table.caption}</caption><thead><tr>{section.table.headings.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{section.table.rows.map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody></table></ScrollableTable>}
            <GuideLinks links={readingLinks(section.links)}/>
            {section.sourceIds && <p className="discovery-section-sources">Kaynak: {sourceGroups(section.sourceIds).map((group, i) => <span key={group.ids[0]}>{i > 0 && " · "}<a href={`#kaynak-${group.ids[0]}`}>{group.publisher}</a>{group.ids.length > 1 && ` (${group.ids.length} sayfa)`}</span>)}</p>}
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
