"use client";

import { ServiceArt } from "./service-art";
import { useState, type CSSProperties } from "react";
import { Check, Package, Sparkles, ArrowDownRight } from "lucide-react";
import { PartnerForm } from "./partner-form";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/lib/site";
import { serviceItems } from "./services";
import { CareObject } from "./care-objects";
import { MotionScene, useSceneSequence } from "./motion";
import { PartnerArt } from "./partner-art";

export function PartnersPage() {
  const [service, setService] = useState(0);
  return (
    <main id="main" className="marketing-main centered-site">
      <section className="partner-visual-hero" aria-labelledby="partner-title">
        <h1 id="partner-title" className="sr-only">Verdiğin hizmeti yeni müşterilerle buluşturalım.</h1>
        <MotionScene className="partner-service-rail">
          <div className="service-rail-bar" aria-hidden="true"/>
          <div className="service-rail-choices" role="group" aria-label="İşletmenin hizmetini seç">
            {serviceItems.map((item, index) => <button
              type="button" key={item.name} className="rail-service"
              style={{ "--rail-index": index, "--rail-turn": `${[5,-4,3,-5,4][index]}deg` } as CSSProperties}
              aria-pressed={service === index} onClick={() => setService(index)}>
              <span className="rail-hook" aria-hidden="true"/>
              <span className="rail-service-art"><ServiceArt kind={item.image}/></span>
              <span className="rail-service-label">{item.name}<ArrowDownRight size={15} aria-hidden="true"/></span>
            </button>)}
          </div>
        </MotionScene>
        <PartnerScene service={service}/>
        <div className="partner-hero-action"><a href="#basvuru" className="button primary">Başvur <ArrowDownRight size={18} aria-hidden="true"/></a></div>
      </section>
      <PartnerFlow />
      <section id="basvuru" className="application-section">
        <div className="wide application-layout">
          <PartnerForm />
        </div>
      </section>
      <section className="faq-section wide section-space">
        <div>
          <h2>Soruların varsa</h2>
        </div>
        <div className="faq-list">
          {[
            [
              "Kimler başvurabilir?",
              "Ayakkabı bakımı, kuru temizleme, çamaşır, ütü veya hacimli tekstil temizliği alanında hizmet veren işletmeler başvurabilir. Bölge, kapasite ve hizmet kalitesini birlikte değerlendiririz.",
            ],
            [
              "Başvuru yapınca hemen iş ortağı olur muyum?",
              "Başvurun önce değerlendirilir. Hizmet kapsamı ve çalışma koşullarında karşılıklı anlaşma sağlandıktan sonra başlangıç planlanır.",
            ],
            [
              "Komisyon ve ödeme koşulları nasıl belirleniyor?",
              "Ticari koşullar hizmetine ve çalışma modeline göre görüşmede netleştirilir. Başvuru yapmak ücret veya sözleşme yükümlülüğü oluşturmaz.",
            ],
            [
              "Siparişleri nasıl takip ederim?",
              "Kurulum tamamlandığında iş ortağı panelinden siparişlerini ve iş aşamalarını takip edebilirsin.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <a
          className="button secondary partner-question"
          href={siteConfig.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp’tan konuşalım
        </a>
      </section>
    </main>
  );
}

function PartnerScene({ service }: { service: number }) {
  const { ref, playing, active, select } = useSceneSequence(3);
  return (
    <div
      ref={ref}
      data-playing={playing}
      className="partner-scene motion-scene"
    >
      <div className="partner-scene-disc" />
      <div className="partner-panel">
        <div className="partner-panel-header">
          <Logo width={66} />
          <span>İş ortağı paneli</span>
        </div>
        <div className="partner-board">
          <div className="partner-board-headings" role="group" aria-label="Örnek siparişin aşamasını seç">
            {["Yeni sipariş", "Temizlikte", "Hazır"].map((label, i) => (
              <button
                type="button"
                key={label}
                aria-pressed={active === i}
                onClick={() => select(i)}
              >
                <span className={`status-dot status-${i}`} />
                {label}
              </button>
            ))}
          </div>
          <div className="partner-board-lanes">
            <span />
            <span />
            <span />
            <div
              className="partner-live-order"
              style={{
                transform: `translateX(calc(${active * 100}% + ${active * 12}px))`,
              }}
            >
              <ServiceArt kind={serviceItems[service].image} />
              <strong>{serviceItems[service].name}</strong>
              <span>
                {
                  [
                    "İşlem için bekliyor",
                    "Özenle temizleniyor",
                    "Teslime hazır",
                  ][active]
                }
              </span>
              <i>
                {active === 0 ? (
                  <Package size={18} />
                ) : active === 1 ? (
                  <Sparkles size={18} />
                ) : (
                  <Check size={18} />
                )}
              </i>
            </div>
          </div>
        </div>
      </div>
      <CareObject kind="tag" className="partner-counter-tag" />
    </div>
  );
}

const benefits = [
  {
    kind: "region",
    title: "Yeni müşterilerle tanış",
  },
  {
    kind: "board",
    title: "İşlerin tek yerde",
  },
  {
    kind: "rhythm",
    title: "Senin düzenine göre",
  },
] as const;
function PartnerFlow() {
  return (
    <section className="partner-craft-section section-space">
      <div className="wide">
        <h2 className="sr-only">Birlikte nasıl çalışabiliriz?</h2>
        <div className="partner-craft">
          {benefits.map(({ kind, title }) => (
            <MotionScene key={kind} className={`partner-craft-${kind}`}>
              <PartnerArt kind={kind} />
              <h3>{title}</h3>
            </MotionScene>
          ))}
        </div>
      </div>
    </section>
  );
}
