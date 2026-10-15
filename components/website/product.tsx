"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Clock3,
  ChevronRight,
  Home,
  MapPin,
} from "lucide-react";
import { ActionGroup, DownloadButton } from "./shared";
import { AppStage } from "./app-stage";
import { serviceItems } from "./services";
import { ServiceArt } from "./service-art";
import { useSceneSequence } from "./motion";
import { CareGlyph, TimeDial, type CareGlyphKind } from "./brand-art";

export function ProductPage() {
  return (
    <main id="main" className="marketing-main centered-site">
      <AppStage />
      <OrderDemo />
      <TrackingDemo />
      <section className="product-service-section wide section-space">
        <h2 className="sr-only">Hizmetleri keşfet</h2>
        <div className="product-service-strip">
          {serviceItems.map((service) => (
            <Link href="/#hizmetler" key={service.name}>
              <ServiceArt kind={service.image} />
              <span>{service.name}<ChevronRight aria-hidden="true" size={16} /></span>
            </Link>
          ))}
        </div>
      </section>
      <section className="faq-section wide section-space">
        <div>
          <h2>Soruların varsa</h2>
        </div>
        <div className="faq-list">
          {[
            [
              "Adresime hizmet geliyor mu?",
              "Kapıdan alım ve teslim henüz başlamadı. Şu an ayakkabı temizliği için Bakırköy dükkânına gelebilirsin. Kuru temizleme, ütü, çamaşır ve yorgan hizmetleri hazırlanıyor.",
            ],
            [
              "Üye olmadan inceleyebilir miyim?",
              "Evet. Hizmetlere ve fiyatlara üye olmadan göz atabilirsin. Sipariş vermek istediğinde giriş yapman gerekir.",
            ],
            [
              "Alım ve teslim zamanı nasıl belirleniyor?",
              "Kapıdan alım açıldığında uygun gün ve saatler uygulamada gösterilecek. Sayfadaki akış, uygulamanın işleyişini anlatan bir örnektir.",
            ],
            [
              "Nasıl ödeme yapabilirim?",
              "Bakırköy dükkânında nakit ve kart geçerli. Uygulamanın online kart ödemelerinde iyzico altyapısı kullanılır. Siparişe açık hizmetler ve ödeme seçenekleri uygulamada gösterilir.",
            ],
            [
              "Android uygulaması ne zaman geliyor?",
              "Android uygulaması için henüz bir yayın tarihi paylaşmadık. Yayına girene kadar WhatsApp’tan bize ulaşabilirsin.",
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
      </section>
      <section className="closing-cta wide" aria-label="Yıkat’a ulaş">
        <ActionGroup />
      </section>
    </main>
  );
}

function OrderDemo() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState(0);
  const [address, setAddress] = useState(0);
  const [slot, setSlot] = useState(0);
  const choices = ["Ne yıkatalım?", "Nereden alalım?", "Ne zaman alalım?"];
  const times = ["09.00 – 13.00", "13.00 – 17.00", "17.00 – 21.00"];
  return (
    <section id="urun-deneyimi" className="order-demo-section section-space">
      <div className="wide">
        <h2 className="experience-heading">Nasıl Çalışır?</h2><p className="product-demo-note">Örnek sipariş akışı. Kapıdan alım başladığında kullanılabilecek.</p>
        <div className="order-demo">
          <div
            className="demo-step-tabs"
            aria-label="Sipariş örneğinin adımları"
          >
            {choices.map((choice, i) => (
              <button
                type="button"
                key={choice}
                aria-pressed={step === i}
                onClick={() => setStep(i)}
              >
                <span>{i + 1}</span>
                {choice}
              </button>
            ))}
          </div>
          <div className="demo-canvas" key={step}>
            {step === 0 ? (
              <>
                <div className="demo-chosen-art">
                  <ServiceArt key={service} kind={serviceItems[service].image} label={serviceItems[service].name} />
                </div>
                <h3 className="sr-only">Bugün hangisinden başlayalım?</h3>
                <div className="demo-options service-options">
                  {serviceItems.map((item, i) => (
                    <button
                      type="button"
                      aria-pressed={service === i}
                      key={item.name}
                      onClick={() => setService(i)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </>
            ) : step === 1 ? (
              <>
                <div className="demo-door">
                  <span className="door-number">
                    {address === 0 ? "01" : "02"}
                  </span>
                  <Home size={42} />
                  <i />
                  <ServiceArt kind={serviceItems[service].image} />
                </div>
                <h3 className="sr-only">Adresini seç</h3>
                <div className="demo-options">
                  {["Ev adresim", "İş adresim"].map((label, i) => (
                    <button
                      type="button"
                      key={label}
                      aria-pressed={address === i}
                      onClick={() => setAddress(i)}
                    >
                      <MapPin size={17} />
                      {label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <TimeDial slot={slot} />
                <h3 className="sr-only">Zamanını seç</h3>
                <div className="demo-options time-options">
                  {times.map((time, i) => (
                    <button
                      type="button"
                      key={time}
                      aria-pressed={slot === i}
                      onClick={() => setSlot(i)}
                    >
                      <Clock3 size={17} />
                      {time}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="demo-next">
            {step < 2 ? (
              <button
                type="button"
                className="button primary"
                onClick={() => setStep(step + 1)}
              >
                {step === 0 ? "Adres seçimine geç" : "Zamanını seç"}
              </button>
            ) : (
              <DownloadButton>Uygulamayı keşfet</DownloadButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const statuses = [
  {
    action: "Sipariş ver",
    label: "Sipariş alındı",
    art: "order" as CareGlyphKind,
  },
  {
    action: "Kapından alalım",
    label: "Kapından alındı",
    art: "collect" as CareGlyphKind,
  },
  {
    action: "Temizleniyor",
    label: "Temizleniyor",
    art: "wash" as CareGlyphKind,
  },
  {
    action: "Kapına bırakalım",
    label: "Kapına bırakıldı",
    art: "ready" as CareGlyphKind,
  },
];
function TrackingDemo() {
  const { ref, playing, active, select } = useSceneSequence(4, 1500);
  const [instant, setInstant] = useState(false);
  return (
    <section className="tracking-section care-tracking section-space" aria-labelledby="care-steps-title">
      <div className="wide motion-scene" data-playing={playing} data-instant={instant}>
        <h2 id="care-steps-title" className="experience-heading">4 Adımda Yıkat</h2><p className="product-demo-note">Kapıdan alım ve teslim için hazırladığımız akış.</p>
        <div className="care-stage" ref={ref} aria-label={statuses[active].label}>
          <span className="care-stage-halo" aria-hidden="true" />
          {statuses.map(({ label, art }, i) => <div key={art} className="care-stage-layer" data-active={active === i} aria-hidden={active !== i}>
            <CareGlyph kind={art}/>
            <span className="care-stage-label">{label}</span>
          </div>)}
        </div>
        <div className="care-track" role="group" aria-label="Siparişin dört adımı">
          <span className="care-track-progress" data-reset={active === 0} aria-hidden="true" style={{ transform: `scaleX(${active / 3})` }}/>
          {statuses.map(({ action, art }, i) => (
            <button
              type="button"
              key={action}
              aria-pressed={active === i}
              className={i <= active ? "reached" : ""}
              onClick={event => { setInstant(event.detail === 0); select(i); }}
            >
              <CareGlyph kind={art} />
              <span>{action}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
