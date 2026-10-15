"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { LoaderCircle, Pause, Play, RotateCcw } from "lucide-react";
import { useScenePlayback } from "./motion";

// "Nasıl temizliyoruz?" — one process per service, chosen from a pill row that
// follows the site navigation's sliding-highlight idea (owner request 2026-10-12:
// every service explains its care steps here, without changing the section's look).
// Shoes keep the real shop film; the other services show their hero sculpture
// until genuine footage exists. Upcoming services describe care principles without claiming availability; keep it short and free of prices, durations or guarantees.
const processes = [
  {
    key: "ayakkabi",
    name: "Ayakkabı",
    steps: [
      { title: "Malzemesine göre", text: "Süet, deri, kumaş. Her çift için uygun yöntemi seçiyoruz." },
      { title: "Fırça ve detay", text: "Fırçalama ve detay temizliğiyle her bölgeye ayrı çalışıyoruz." },
      { title: "Özenle kurutma", text: "Temizlenen ayakkabıları kurutma dolabına alıyoruz." },
    ],
  },
  {
    key: "dry-cleaning",
    name: "Kuru temizleme",
    steps: [
      { title: "Etiketine göre", text: "Bakım etiketi ve kumaş, uygun yöntemin başlangıç noktası." },
      { title: "Leke kontrolü", text: "Lekenin kaynağı ve önceki işlemler ayrı değerlendirilir." },
      { title: "Hazırlık ve paketleme", text: "Temizlik sonrası kontrol ve paketleme birlikte planlanır." },
    ],
  },
  {
    key: "kiloyla",
    name: "Çamaşır",
    steps: [
      { title: "Ayırarak", text: "Renk, kumaş ve bakım etiketi birlikte değerlendirilir." },
      { title: "Uygun programda", text: "Yıkama ve kurutma koşulları ürünün etiketinden seçilir." },
      { title: "Katlayıp teslim", text: "Temiz ve tamamen kuru parçalar katlamaya hazırlanır." },
    ],
  },
  {
    key: "utu",
    name: "Ütü",
    steps: [
      { title: "Kumaşına göre", text: "Isı ve buhar sınırı kumaşa ve bakım etiketine göre belirlenir." },
      { title: "Detaylara özen", text: "Yaka, manşet ve pililer parçanın yapısına göre ele alınır." },
      { title: "Giyilmeye hazır", text: "Son kontrolün ardından uygun askı veya katlama seçilir." },
    ],
  },
  {
    key: "hacimli",
    name: "Yorgan & battaniye",
    steps: [
      { title: "Dolgusuna göre", text: "Dolgu türü ve bakım etiketi yöntemi belirler." },
      { title: "Hacmine uygun yıkama", text: "Hacim, dolgu ve etiket birlikte değerlendirilir." },
      { title: "Tam kurutma", text: "Yalnız yüzeyin değil, dolgunun da kuruması gerekir." },
    ],
  },
] as const;

export function WashingProcess() {
  const { ref, visible, tabVisible, playing: inView } = useScenePlayback();
  const [active, setActive] = useState(0);
  // Keyboard changes swap content at once; pointer changes get a short fade.
  const [instant, setInstant] = useState(true);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [highlight, setHighlight] = useState<{ x: number; width: number } | null>(null);
  const process = processes[active];

  // One highlight slides to the measured position of the selected pill.
  useLayoutEffect(() => {
    const measure = () => {
      const tab = tabs.current[active];
      if (tab) setHighlight({ x: tab.offsetLeft, width: tab.offsetWidth });
    };
    measure();
    const observer = new ResizeObserver(measure);
    const list = tabs.current[active]?.parentElement;
    if (list) observer.observe(list);
    return () => observer.disconnect();
  }, [active]);

  function select(index: number, viaKeyboard: boolean) {
    setInstant(viaKeyboard);
    setActive(index);
    const tab = tabs.current[index];
    if (viaKeyboard) tab?.focus();
    // Keep the chosen pill in view inside the scrolling row without moving the page.
    const list = tab?.parentElement;
    if (tab && list) list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: viaKeyboard ? "auto" : "smooth" });
  }
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = processes.length - 1;
    const next = event.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : event.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : -1;
    if (next < 0) return;
    event.preventDefault();
    select(next, true);
  }

  return <section className="washing-process" aria-labelledby="washing-title">
    <div className="washing-layout motion-scene" data-playing={inView}>
      <div className="washing-copy">
        <h2 id="washing-title">Nasıl <br/>temizliyoruz?</h2>
        <div className="washing-tabs" role="tablist" aria-label="Hizmet seç" data-ready={highlight !== null} data-instant={instant}>
          {highlight && <span className="washing-tab-highlight" aria-hidden="true" style={{ width: highlight.width, transform: `translateX(${highlight.x}px)` }}/>}
          {processes.map((item, index) => <button
            key={item.key}
            ref={node => { tabs.current[index] = node; }}
            type="button"
            role="tab"
            id={`washing-tab-${item.key}`}
            aria-selected={index === active}
            aria-controls="washing-panel"
            tabIndex={index === active ? 0 : -1}
            onClick={event => select(index, event.detail === 0)}
            onKeyDown={onKeyDown}
          >{item.name}</button>)}
        </div>
        <div id="washing-panel" role="tabpanel" aria-labelledby={`washing-tab-${process.key}`}>
          {process.key !== "ayakkabi" && <p className="washing-coming-soon">Yakında. Bu hizmet henüz siparişe açık değil.</p>}
          <ol className="washing-steps" key={process.key} data-instant={instant}>
            {process.steps.map((step, i) => <li key={step.title}>
              <span className="washing-number" aria-hidden="true">0{i + 1}</span>
              <div><h3>{step.title}</h3><p>{step.text}</p></div>
            </li>)}
          </ol>
        </div>
      </div>
      <div className="washing-film" ref={ref}>
        <svg className="washing-thread" viewBox="0 0 660 800" fill="none" aria-hidden="true"><path d="M12 200C122 102 489 7 602 191S547 648 378 720 18 633 61 456 564 262 639 524"/><path className="washing-thread-glint" d="M12 200C122 102 489 7 602 191S547 648 378 720 18 633 61 456 564 262 639 524"/></svg>
        <div className="washing-film-frame">
          <div className="washing-media" key={process.key} data-instant={instant}>
            {process.key === "ayakkabi"
              ? <ShopFilm visible={visible} tabVisible={tabVisible}/>
              : <Image unoptimized className="washing-still" src={`/images/services/hero-v2/${process.key}.webp`} alt="" width={512} height={512} sizes="(max-width: 900px) 330px, 400px"/>}
          </div>
        </div>
        <svg className="washing-seal" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47" fill="#fff" stroke="#b7dff5" strokeWidth="2"/><path d="M50 16C52 39 61 48 84 50 61 52 52 61 50 84 48 61 39 52 16 50 39 48 48 39 50 16Z" fill="#258eed"/></svg>
      </div>
    </div>
  </section>;
}

/** Real shop footage for the shoe process. Loads only after an explicit play. */
function ShopFilm({ visible, tabVisible }: { visible: boolean; tabVisible: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const wantsPlayback = useRef(false);
  const playAttempt = useRef(0);
  const [phase, setPhase] = useState<"idle" | "loading" | "playing" | "paused" | "ended" | "error">("idle");
  const requestPlayback = useCallback(() => {
    const player = video.current;
    if (!player) return;
    const attempt = ++playAttempt.current;
    setPhase("loading");
    player.play().catch(() => {
      // A pause, scroll or newer play request invalidates this attempt.
      if (attempt !== playAttempt.current || !wantsPlayback.current) return;
      wantsPlayback.current = false;
      setPhase("error");
    });
  }, []);
  useEffect(() => {
    if (!visible || !tabVisible) {
      playAttempt.current++;
      video.current?.pause();
    } else if (wantsPlayback.current && !video.current?.ended) {
      requestPlayback();
    }
  }, [visible, tabVisible, requestPlayback]);
  function toggle() {
    const player = video.current;
    if (!player) return;
    if (wantsPlayback.current) {
      wantsPlayback.current = false;
      playAttempt.current++;
      player.pause();
      setPhase("paused");
      return;
    }
    if (phase === "error") player.load();
    if (player.ended) player.currentTime = 0;
    wantsPlayback.current = true;
    // Keep play inside the gesture, including the first play on mobile Safari.
    requestPlayback();
  }
  const playing = phase === "playing" || phase === "loading";
  return <>
    <video ref={video} src="/videos/care/drying-cabinet-20261015.mp4" poster="/images/care/drying-cabinet-20261015.webp" playsInline muted preload="none"
      onPlaying={() => setPhase("playing")}
      onWaiting={() => { if (wantsPlayback.current) setPhase("loading"); }}
      onPause={() => setPhase(current => current === "playing" || current === "loading" ? "paused" : current)}
      onEnded={() => { wantsPlayback.current = false; setPhase("ended"); }}
      onError={() => { wantsPlayback.current = false; setPhase("error"); }}
      aria-label="Bakırköy dükkânındaki ayakkabı kurutma dolabı">
      <track kind="captions" src="/videos/care/drying-cabinet-20261015-tr.vtt" srcLang="tr" label="Türkçe" default/>
    </video>
    <button type="button" className="washing-play" onClick={toggle} aria-busy={phase === "loading"} aria-label={phase === "ended" ? "Dükkân videosunu tekrar oynat" : phase === "error" ? "Videoyu yeniden dene" : playing ? "Dükkân videosunu duraklat" : "Dükkân videosunu oynat"}>
      {phase === "loading" ? <LoaderCircle className="washing-loading" size={19} aria-hidden="true"/> : phase === "ended" || phase === "error" ? <RotateCcw size={19} aria-hidden="true"/> : playing ? <Pause size={19} fill="currentColor" aria-hidden="true"/> : <Play size={19} fill="currentColor" aria-hidden="true"/>}
    </button>
    {phase === "error" && <span className="sr-only" role="status">Video yüklenemedi. Yeniden deneyebilirsin.</span>}
  </>;
}
