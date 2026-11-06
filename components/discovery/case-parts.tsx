import Image from "next/image"
import type { CaseReel, CustomerCase } from "@/lib/customer-cases"
import { formatContentDate } from "@/lib/discovery"
import "@/app/local-growth.css"

const facts = (item: CustomerCase) => [
  ["Geldiğinde", item.problem],
  ["Ne yaptık", item.treatment],
  ["Sonuç", item.result],
  ["Ne kaldı", item.limitations],
] as const

/** One reviewed pair: both photos always visible (side by side, stacked on phones), then the facts. */
export function CaseArticle({ item }: { item: CustomerCase }) {
  const id = `case-${item.slug}`
  return <article className="case" id={id} aria-labelledby={`${id}-title`}>
    <div className="case-pair">
      {(["before", "after"] as const).map(stage => <figure key={stage} className={`case-photo case-photo-${stage}`}>
        <Image src={item[stage].src} alt={item[stage].alt} width={item[stage].width} height={item[stage].height}
          sizes="(max-width: 680px) calc(100vw - 40px), (max-width: 1240px) calc(50vw - 47px), 580px"/>
        <figcaption>{stage === "before" ? "Önce" : "Sonra"}</figcaption>
      </figure>)}
    </div>
    <div className="case-text">
      <h3 id={`${id}-title`}>{item.title}</h3>
      <p className="case-meta">{item.material} · <time dateTime={item.completedOn}>{formatContentDate(item.completedOn)}</time></p>
      <dl className="case-facts">{facts(item).map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
    </div>
  </article>
}

/** The silent before/after film. Plays only when asked; nothing downloads before that but the poster. */
export function CaseReelFigure({ reel }: { reel: CaseReel }) {
  return <figure className="case-reel">
    <video controls muted playsInline preload="none" poster={reel.poster.src} width={reel.video.width} height={reel.video.height}
      aria-label={reel.title} aria-describedby="case-reel-caption">
      <source src={reel.video.src} type="video/mp4"/>
      <track kind="captions" src={reel.captions.src} srcLang="tr" label="Türkçe"/>
    </video>
    <figcaption id="case-reel-caption">{reel.description}</figcaption>
  </figure>
}
