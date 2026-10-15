import Link from "next/link"
import { siteConfig } from "@/lib/site"
import { services, type Service } from "@/lib/services"
import { guideBySlug } from "@/lib/care-guides"
import { BUSINESS_ID, breadcrumbJson, careSources } from "@/lib/discovery"
import { DiscoveryShell, FaqList, JsonLd, RelatedLinks, ShopInvitation } from "@/components/discovery/shared"
import { PhotoEnquiryLink, ShopActions } from "@/components/discovery/actions"

export function serviceJsonLd(service: Service) {
  return [{ "@context": "https://schema.org", "@type": "Service", "@id": `${siteConfig.url}/${service.slug}#service`, name: service.nav, serviceType: service.nav, description: service.intro, url: `${siteConfig.url}/${service.slug}`, provider: { "@id": BUSINESS_ID }, availableChannel: { "@type": "ServiceChannel", serviceLocation: { "@id": BUSINESS_ID } } }, breadcrumbJson([{ name: "Ayakkabı temizleme", path: "/ayakkabi-temizleme" }, { name: service.nav, path: `/${service.slug}` }])]
}

export function ServicePageView({ service }: { service: Service }) {
  const guide = guideBySlug(service.guideSlug)!
  const careSource = careSources[service.afterCareSourceId]
  return <DiscoveryShell crumbs={[{ name: "Ayakkabı temizleme", path: "/ayakkabi-temizleme" }, { name: service.nav, path: `/${service.slug}` }]}>
    <JsonLd data={serviceJsonLd(service)[0]}/>
    <header className="discovery-heading"><h1>{service.h1}</h1><p className="discovery-answer">{service.intro}</p><ShopActions/></header>
    <section className="discovery-materials"><h2>İşleme başlamadan önce.</h2><dl>{service.risks.map(r => <div key={r.title}><dt>{r.title}</dt><dd>{r.text}</dd></div>)}</dl></section>
    <section className="discovery-prose discovery-narrow"><h2>Fotoğraf gönderirken neyi göstermeli?</h2><p>{service.beforeVisit}</p><p>Bir karede çiftin tamamını, diğerinde sorunlu bölgeyi göster. Filtre kullanma; varsa model etiketi de yardımcı olur. Fotoğraf ön değerlendirme içindir; işlem uygunluğu ve son kapsam fiziksel kabulde netleşir.</p><PhotoEnquiryLink className="discovery-inline-link">Ayakkabının fotoğrafıyla sor</PhotoEnquiryLink></section>
    <div className="discovery-service-layout"><section className="discovery-prose"><h2>Dükkânda nasıl ilerliyor?</h2><ol className="discovery-steps">{service.steps.map(s => <li key={s.title}><h3>{s.title}</h3><p>{s.text}</p></li>)}</ol><h2>Sonuçtan ne beklemelisin?</h2>{service.notes.map(n => <p key={n}>{n}</p>)}<p>Ayakkabının tamamını, sorunlu bölgesini ve varsa bakım etiketini paylaşabilirsin. Fotoğraf ön değerlendirmeye yardımcı olur; fiziksel inceleme gerektiğinde bunu belirtiriz.</p></section><aside className="discovery-shop-note"><h2>İskele Caddesi<br/>No:15-B</h2><p>{siteConfig.address.full}</p><p><strong>{siteConfig.hours.label}</strong></p><p>Güncel ücret ve teslim zamanı, ayakkabı ve işlem ihtiyacı değerlendirilerek netleşir.</p><Link href="/bakirkoy-ayakkabi-temizleme">Dükkân ve yol tarifi →</Link><Link href="/ayakkabi-temizleme#fiyat">Ücret için gereken bilgiler →</Link></aside></div>
    <div className="discovery-narrow"><FaqList faqs={service.faqs}/></div>
    <section className="discovery-prose discovery-narrow"><h2>Temizlikten sonra bakım.</h2><p>{service.afterCare}</p><p className="discovery-section-sources">Bakım kaynağı: <a href={careSource.url} target="_blank" rel="noopener noreferrer">{careSource.title}</a>. Kendi modelinin bakım talimatı önceliklidir.</p></section>
    <RelatedLinks title="Bakımını daha yakından tanı" links={[{ href: `/rehber/${guide.slug}`, title: guide.title, text: "Üretici kaynakları ve adım adım karar rehberi." }, ...service.relatedGuides.map(slug => ({ href: `/rehber/${slug}`, title: guideBySlug(slug)!.title })), ...services.filter(s => s.slug !== service.slug).map(s => ({ href: `/${s.slug}`, title: s.nav }))]}/>
    <ShopInvitation/>
  </DiscoveryShell>
}
