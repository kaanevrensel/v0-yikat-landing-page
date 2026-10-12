"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { ChevronRight, Play, X } from "lucide-react";
import { useDownload } from "./shared";
import { useDirectionsUrl } from "@/hooks/use-directions-url";
import { siteConfig } from "@/lib/site";
import { WashBackdrop } from "./wash-backdrop";
import { CareGlyph } from "./brand-art";
import { ServiceArt } from "./service-art";
import { AppInvitation } from "./app-invitation";
import { PartnerInvitation } from "./partner-invitation";
import { WashingProcess } from "./washing-process";

const choices = [
  { name: "Kuru temizleme", image: "dry-cleaning", key: "dry-cleaning", tilt: -9, rise: 35 },
  { name: "Ütü", image: "utu", key: "utu", tilt: -5, rise: 5 },
  { name: "Ayakkabı", image: "ayakkabi", key: "ayakkabi", tilt: 0, rise: -20 },
  { name: "Çamaşır", image: "kiloyla", key: "kiloyla", tilt: 6, rise: 5 },
  { name: "Yorgan & battaniye", image: "hacimli", key: "hacimli", tilt: 10, rise: 35 },
] as const;
type Choice = (typeof choices)[number];

export function HomePage() {
  const [selected, setSelected] = useState<Choice>(choices[2]);
  const [instant, setInstant] = useState(false);
  const [night, setNight] = useState(false);
  const routeDialog = useRef<HTMLDialogElement>(null);
  const routeVideo = useRef<HTMLVideoElement>(null);
  const routeOpener = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const directions = useDirectionsUrl();
  const download = useDownload();

  useEffect(() => {
    const dialogs = [sheet.current, routeDialog.current];
    function dismissBackdrop(event: Event) {
      if (event.target === event.currentTarget) (event.currentTarget as HTMLDialogElement).close();
    }
    const pauseWhenHidden = () => { if (document.hidden) routeVideo.current?.pause(); };
    dialogs.forEach(dialog => dialog?.addEventListener("click", dismissBackdrop));
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      dialogs.forEach(dialog => dialog?.removeEventListener("click", dismissBackdrop));
      document.removeEventListener("visibilitychange", pauseWhenHidden);
    };
  }, []);

  function choose(choice: Choice, event: MouseEvent<HTMLButtonElement>) {
    opener.current = event.currentTarget;
    setSelected(choice);
    setInstant(event.detail === 0);
    sheet.current?.showModal();
  }
  function openDownload() {
    sheet.current?.close();
    download();
  }
  const whatsapp = new URL(siteConfig.whatsappHref);
  whatsapp.searchParams.set("text", `Merhaba, ${selected.name.toLocaleLowerCase("tr-TR")} için bilgi almak istiyorum.`);

  return (
    <main id="main" className="marketing-main object-home">
      <section className="object-hero" aria-labelledby="home-title">
        <WashBackdrop />
        <h1 id="home-title" className="sr-only">Yıkat temizlik ve bakım hizmetleri</h1>
        <div id="hizmetler" className="object-choices" role="group" aria-label="Neyi yıkatalım?">
          {choices.map((choice, index) => (
            <div
              className={`object-entry object-${choice.key}`}
              key={choice.key}
              style={{ "--tilt": `${choice.tilt}deg`, "--rise": `${choice.rise}px`, "--arrival": `${index * 45}ms` } as CSSProperties}
            >
              <button type="button" className="object-choice" onClick={(event) => choose(choice, event)} aria-haspopup="dialog">
                <span className="object-art">
                  <Image unoptimized src={`/images/services/hero-v2/${choice.image}.webp`} alt="" width={512} height={512} priority loading="eager" sizes="(max-width: 600px) 34vw, (max-width: 900px) 22vw, 270px" draggable={false} />
                </span>
                <span className="object-label"><span>{choice.name}</span><ChevronRight aria-hidden="true" size={17} /></span>
              </button>
            </div>
          ))}
        </div>
        <div className="object-quick-actions">
          <a className="contact-action contact-primary" href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer"><span className="contact-mark"><CareGlyph kind="message" /></span><span>WhatsApp’tan yaz</span></a>
          <a className="contact-action" href={directions} target="_blank" rel="noopener noreferrer"><span className="contact-mark"><CareGlyph kind="place" /></span><span>Yol tarifi al</span></a>
        </div>
      </section>

      <AppInvitation />

      <WashingProcess />

      <section className="shop-destination" aria-labelledby="shop-title">
        <div className="shop-welcome">
          <h2 id="shop-title">Bakırköy’deyiz</h2>
          <div className="shop-photo">
            <Image unoptimized src={night ? "/images/shop/bakirkoy-night-drive.webp" : "/images/shop/bakirkoy-owner-202608.webp"} alt={night ? "Bakırköy Yıkat dükkânının akşam ışıkları ve mavi tabelası" : "Bakırköy Yıkat dükkânının mavi tabelası ve cam giriş kapısı"} width={1000} height={1333} sizes="(max-width: 600px) 100vw, 480px" className={night ? "shop-night-photo" : ""}/>
            <div className="shop-photo-switch" role="group" aria-label="Dükkân fotoğrafını seç">
              <button type="button" aria-pressed={!night} onClick={() => setNight(false)}>Gündüz</button>
              <button type="button" aria-pressed={night} onClick={() => setNight(true)}>Akşam</button>
            </div>
          </div>
          <a className="destination-link" href={directions} target="_blank" rel="noopener noreferrer">Yol tarifi al <ChevronRight size={19} aria-hidden="true" /></a>
          <Link className="shop-detail-link" href="/bakirkoy-ayakkabi-temizleme">Dükkân, saatler ve hizmetler</Link>
        </div>
        <div className="shop-map-wrap">
          <a className="shop-folded-map" href={directions} target="_blank" rel="noopener noreferrer" aria-label="Bakırköy dükkânına yol tarifi al">
            <Image unoptimized src="/images/map/dukkan-harita.webp" alt="Bakırköy’deki dükkânın haritadaki konumu" fill sizes="(max-width: 700px) 100vw, 600px" />
            <span className="map-fold map-fold-one" /><span className="map-fold map-fold-two" />
            <span className="map-attribution">© OpenStreetMap · © CARTO</span>
            <span className="map-open-arrow" aria-hidden="true">↗</span>
          </a>
          <button ref={routeOpener} type="button" className="shop-walk-button" aria-haspopup="dialog" onClick={() => { routeDialog.current?.showModal(); routeVideo.current?.play().catch(() => {}); }}><span className="walk-play"><Play size={19} fill="currentColor" aria-hidden="true"/></span><span>Meydandan dükkâna</span><ChevronRight size={19} aria-hidden="true"/></button>
        </div>
      </section>

      <PartnerInvitation />

      <dialog ref={routeDialog} className="shop-walk-dialog" aria-labelledby="walk-title" onClose={() => { routeVideo.current?.pause(); routeOpener.current?.focus(); }}>
        <div className="shop-walk-content">
          <div className="shop-walk-header"><h2 id="walk-title">Meydandan dükkâna</h2><button type="button" className="icon-button" aria-label="Videoyu kapat" onClick={() => routeDialog.current?.close()}><X size={21}/></button></div>
          <video ref={routeVideo} controls playsInline muted preload="none" poster="/images/shop/walk-poster.webp" aria-label="Bakırköy Meydanı’ndan Yıkat dükkânına yürüyüş rotası">
            <source src="/videos/shop/bakirkoy-walk.mp4" type="video/mp4"/>
            <track kind="captions" src="/videos/shop/bakirkoy-walk-tr.vtt" srcLang="tr" label="Türkçe" default/>
          </video>
          <a className="destination-link" href={directions} target="_blank" rel="noopener noreferrer">Haritada aç <ChevronRight size={19} aria-hidden="true"/></a>
        </div>
      </dialog>

      <dialog
        ref={sheet}
        className="service-action-sheet"
        data-instant={instant}
        aria-labelledby="service-action-title"
        onClose={() => opener.current?.focus()}
      >
        <div className="service-action-content">
          <button type="button" className="icon-button service-sheet-close" aria-label="Pencereyi kapat" onClick={() => sheet.current?.close()}><X size={22} /></button>
          <div className="service-ticket-top">
            <ServiceArt kind={selected.key} className="service-sheet-image" />
            <h2 id="service-action-title">{selected.name}</h2>
          </div>
          <div className="ticket-perforation" aria-hidden="true" />
          <div className="service-ticket-actions">
            {selected.key === "ayakkabi" && <a className="ticket-action" href={directions} target="_blank" rel="noopener noreferrer"><CareGlyph kind="place" /><span>Dükkâna getir</span><ChevronRight aria-hidden="true" size={20} /></a>}
            <a className="ticket-action" href={whatsapp.toString()} target="_blank" rel="noopener noreferrer"><CareGlyph kind="message" /><span>WhatsApp’tan sor</span><ChevronRight aria-hidden="true" size={20} /></a>
          </div>
          <div className="service-app-actions">
            <button type="button" onClick={openDownload}>Uygulamayı indir</button>
          </div>
        </div>
      </dialog>
    </main>
  );
}
