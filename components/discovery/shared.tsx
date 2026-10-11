import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"
import { SiteShell } from "@/components/website/shared"
import { ShopActions } from "./actions"
import { breadcrumbJson, CONTENT_DATE, careSources } from "@/lib/discovery"
import { siteConfig } from "@/lib/site"

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}/>
}

export function ScrollableTable({ label, children }: { label: string; children: ReactNode }) {
  // A named, focusable scroll region lets keyboard users pan wide tables on small screens.
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  return <div className="discovery-table-wrap" role="region" aria-label={label} tabIndex={0}>{children}</div>
}

export function DiscoveryShell({ children, crumbs }: { children: ReactNode; crumbs: { name: string; path: string }[] }) {
  return <SiteShell><main id="main" className="discovery">
    <JsonLd data={breadcrumbJson(crumbs)}/>
    {children}
  </main></SiteShell>
}

export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return <section className="discovery-faq" aria-labelledby="faq-title"><h2 id="faq-title">Merak ettiklerin</h2>{faqs.map(f => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</section>
}

export function SourceList({ ids }: { ids: string[] }) {
  return <section className="discovery-sources" id="kaynaklar" aria-labelledby="sources-title"><h2 id="sources-title">Kaynaklar ve içerik notu</h2><p>Bu rehber, aşağıdaki üretici ve bakım kuruluşlarının yayımladığı bilgilerden yararlanır. Kendi ürününün güncel bakım talimatı önceliklidir.</p><ul>{ids.map(id => <li key={id} id={`kaynak-${id}`}><a href={careSources[id].url} target="_blank" rel="noopener noreferrer">{careSources[id].title}<ArrowUpRight size={15} aria-hidden="true"/></a></li>)}</ul><p>Yayınlayan: <Link href="/iletisim">Yıkat</Link> · <time dateTime={CONTENT_DATE}>10 Ekim 2026</time>. Bir düzeltme için <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p></section>
}

export function ShopInvitation() {
  return <section className="discovery-invitation"><div><h2>Ayakkabını birlikte değerlendirelim.</h2><p>{siteConfig.hours.label}. Fotoğrafını WhatsApp’tan paylaşabilir veya İskele Caddesi No:15-B’deki dükkâna getirebilirsin.</p><Link className="discovery-inline-link" href="/bakirkoy-ayakkabi-temizleme">Dükkân ve ulaşım bilgileri <ArrowUpRight size={17} aria-hidden="true"/></Link></div><ShopActions/></section>
}

export function RelatedLinks({ links, title = "Buradan devam et" }: { links: { href: string; title: string; text?: string }[]; title?: string }) {
  return <section className="discovery-related"><h2>{title}</h2><ul>{links.map(link => <li key={link.href}><Link href={link.href}><span><strong>{link.title}</strong>{link.text && <span>{link.text}</span>}</span><ArrowUpRight size={22} aria-hidden="true"/></Link></li>)}</ul></section>
}
