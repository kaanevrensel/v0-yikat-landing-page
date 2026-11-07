import Image from "next/image"
import Link from "next/link"
import { CASE_GALLERY_PATH, caseGroups, showcaseCases, type CaseGroup } from "@/lib/customer-cases"
import "@/app/local-growth.css"

/** A short strip of reviewed pairs on another page (a material page, the Bakırköy page) with the way into the
 * gallery: one group's clearest pairs, or the clearest pair of each group. Each card opens its pair in the gallery.
 * Renders nothing while no pair is published. */
export function CaseTeaser({ group, heading, lead, limit = 3 }: { group?: CaseGroup; heading: string; lead: string; limit?: number }) {
  const { shown, total } = showcaseCases(group, limit)
  if (!shown.length) return null
  const target = group ? caseGroups.find(item => item.id === group) : undefined
  const more = target
    ? { href: `${CASE_GALLERY_PATH}#${target.anchor}`, text: `${total} ${target.title.toLocaleLowerCase("tr-TR")} örneğinin hepsine bak` }
    : { href: CASE_GALLERY_PATH, text: `${total} çiftin hepsine bak` }
  return <section className="case-teaser" aria-labelledby="case-teaser-title">
    <h2 id="case-teaser-title">{heading}</h2>
    <p className="case-teaser-lead">{lead}</p>
    <ul className="case-teaser-list">
      {shown.map(item => <li key={item.slug} className="case-teaser-item">
        <div className="case-teaser-pair">
          {(["before", "after"] as const).map(stage => <figure key={stage} className="case-photo">
            <Image src={item[stage].src} alt={item[stage].alt} width={item[stage].width} height={item[stage].height}
              sizes="(max-width: 680px) calc(50vw - 24px), (max-width: 1240px) calc(16vw - 20px), 190px"/>
            <figcaption>{stage === "before" ? "Önce" : "Sonra"}</figcaption>
          </figure>)}
        </div>
        <h3><Link href={`${CASE_GALLERY_PATH}#case-${item.slug}`}>{item.title}</Link></h3>
      </li>)}
    </ul>
    <p className="case-teaser-more"><Link className="discovery-inline-link" href={more.href}>{more.text}</Link></p>
  </section>
}
