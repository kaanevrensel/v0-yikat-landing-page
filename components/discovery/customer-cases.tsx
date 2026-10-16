import Image from "next/image"
import { customerCases, publishableCases } from "@/lib/customer-cases"
import { formatContentDate } from "@/lib/discovery"

export function CustomerCases() {
  const cases = publishableCases(customerCases)
  if (!cases.length) return null
  return <section className="customer-cases" id="sonuclar" aria-labelledby="cases-title">
    <h2 id="cases-title">Dükkândan önce ve sonra.</h2>
    <p>Her çiftin malzemesi ve mevcut durumu farklı. Buradaki sonuçlar, gösterilen ayakkabıların kendi işlem kayıtlarına ait.</p>
    {cases.map(item => <article key={item.slug} aria-labelledby={`case-${item.slug}`}>
      <h3 id={`case-${item.slug}`}>{item.title}</h3>
      <p>{item.material} · <time dateTime={item.completedOn}>{formatContentDate(item.completedOn)}</time></p>
      <div className="customer-case-images">{(["before", "after"] as const).map(stage => <figure key={stage}>
        <Image src={item[stage].src} alt={item[stage].alt} width={item[stage].width} height={item[stage].height} sizes="(max-width: 680px) calc(100vw - 40px), (max-width: 1240px) calc(50vw - 60px), 540px"/>
        <figcaption>{stage === "before" ? "İşlem öncesi" : "İşlem sonrası"}</figcaption>
      </figure>)}</div>
      <dl>{[["Getirildiğinde", item.problem], ["Uygulanan işlem", item.treatment], ["Sonuç", item.result], ["Kalan iz ve sınırlar", item.limitations]].map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
    </article>)}
  </section>
}
