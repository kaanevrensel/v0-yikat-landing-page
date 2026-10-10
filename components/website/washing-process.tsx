"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useScenePlayback } from "./motion";

const steps = [
  { title: "Malzemesine göre", text: "Süet, deri, kumaş. Her çift için uygun yöntemi seçiyoruz." },
  { title: "Fırça ve detay", text: "Fırçalama ve detay temizliğiyle her bölgeye ayrı çalışıyoruz." },
  { title: "Özenle kurutma", text: "Temizlenen ayakkabıları kurutma dolabına alıyoruz." },
];

export function WashingProcess() {
  const { ref, visible, tabVisible, playing: inView } = useScenePlayback();
  const video = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!visible || !tabVisible) video.current?.pause();
  }, [visible, tabVisible]);
  useEffect(() => {
    if (loaded) video.current?.play().catch(() => {});
  }, [loaded]);
  function toggle() {
    if (!loaded) { setLoaded(true); return; }
    if (video.current?.paused) video.current.play().catch(() => {});
    else video.current?.pause();
  }
  return <section className="washing-process" aria-labelledby="washing-title">
    <div className="washing-layout motion-scene" ref={ref} data-playing={inView}>
      <div className="washing-copy">
        <h2 id="washing-title">Nasıl <br/>temizliyoruz?</h2>
        <ol className="washing-steps">
          {steps.map((step, i) => <li key={step.title}>
            <span className="washing-number" aria-hidden="true">0{i + 1}</span>
            <div><h3>{step.title}</h3><p>{step.text}</p></div>
          </li>)}
        </ol>
      </div>
      <div className="washing-film">
        <svg className="washing-thread" viewBox="0 0 660 800" fill="none" aria-hidden="true"><path d="M12 200C122 102 489 7 602 191S547 648 378 720 18 633 61 456 564 262 639 524"/><path className="washing-thread-glint" d="M12 200C122 102 489 7 602 191S547 648 378 720 18 633 61 456 564 262 639 524"/></svg>
        <div className="washing-film-frame">
          <video ref={video} src={loaded ? "/videos/care/drying-20261010.mp4" : undefined} poster="/images/care/drying-20261010.webp" playsInline muted loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-label="Bakırköy dükkânında ayakkabıların kurutma dolabına yerleştirilmesi">
            <track kind="captions" src="/videos/care/drying-tr.vtt" srcLang="tr" label="Türkçe" default/>
          </video>
          <button type="button" className="washing-play" onClick={toggle} aria-label={playing ? "Dükkân videosunu duraklat" : "Dükkân videosunu oynat"}>
            {playing ? <Pause size={19} fill="currentColor" aria-hidden="true"/> : <Play size={19} fill="currentColor" aria-hidden="true"/>}
          </button>
        </div>
        <svg className="washing-seal" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47" fill="#fff" stroke="#b7dff5" strokeWidth="2"/><path d="M50 16C52 39 61 48 84 50 61 52 52 61 50 84 48 61 39 52 16 50 39 48 48 39 50 16Z" fill="#258eed"/></svg>
      </div>
    </div>
  </section>;
}
