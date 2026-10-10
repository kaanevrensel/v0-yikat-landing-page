"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, Pause, Play, RotateCcw } from "lucide-react";
import { useScenePlayback } from "./motion";

const steps = [
  { title: "Malzemesine göre", text: "Süet, deri, kumaş. Her çift için uygun yöntemi seçiyoruz." },
  { title: "Fırça ve detay", text: "Fırçalama ve detay temizliğiyle her bölgeye ayrı çalışıyoruz." },
  { title: "Özenle kurutma", text: "Temizlenen ayakkabıları kurutma dolabına alıyoruz." },
];

export function WashingProcess() {
  const { ref, visible, tabVisible, playing: inView } = useScenePlayback();
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
  return <section className="washing-process" aria-labelledby="washing-title">
    <div className="washing-layout motion-scene" data-playing={inView}>
      <div className="washing-copy">
        <h2 id="washing-title">Nasıl <br/>temizliyoruz?</h2>
        <ol className="washing-steps">
          {steps.map((step, i) => <li key={step.title}>
            <span className="washing-number" aria-hidden="true">0{i + 1}</span>
            <div><h3>{step.title}</h3><p>{step.text}</p></div>
          </li>)}
        </ol>
      </div>
      <div className="washing-film" ref={ref}>
        <svg className="washing-thread" viewBox="0 0 660 800" fill="none" aria-hidden="true"><path d="M12 200C122 102 489 7 602 191S547 648 378 720 18 633 61 456 564 262 639 524"/><path className="washing-thread-glint" d="M12 200C122 102 489 7 602 191S547 648 378 720 18 633 61 456 564 262 639 524"/></svg>
        <div className="washing-film-frame">
          <video ref={video} src="/videos/care/drying-20261010.mp4" poster="/images/care/drying-20261010.webp" playsInline muted preload="none"
            onPlaying={() => setPhase("playing")}
            onWaiting={() => { if (wantsPlayback.current) setPhase("loading"); }}
            onPause={() => setPhase(current => current === "playing" || current === "loading" ? "paused" : current)}
            onEnded={() => { wantsPlayback.current = false; setPhase("ended"); }}
            onError={() => { wantsPlayback.current = false; setPhase("error"); }}
            aria-label="Bakırköy dükkânında ayakkabıların kurutma dolabına yerleştirilmesi">
            <track kind="captions" src="/videos/care/drying-tr.vtt" srcLang="tr" label="Türkçe" default/>
          </video>
          <button type="button" className="washing-play" onClick={toggle} aria-busy={phase === "loading"} aria-label={phase === "ended" ? "Dükkân videosunu tekrar oynat" : phase === "error" ? "Videoyu yeniden dene" : playing ? "Dükkân videosunu duraklat" : "Dükkân videosunu oynat"}>
            {phase === "loading" ? <LoaderCircle className="washing-loading" size={19} aria-hidden="true"/> : phase === "ended" || phase === "error" ? <RotateCcw size={19} aria-hidden="true"/> : playing ? <Pause size={19} fill="currentColor" aria-hidden="true"/> : <Play size={19} fill="currentColor" aria-hidden="true"/>}
          </button>
          {phase === "error" && <span className="sr-only" role="status">Video yüklenemedi. Yeniden deneyebilirsin.</span>}
        </div>
        <svg className="washing-seal" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47" fill="#fff" stroke="#b7dff5" strokeWidth="2"/><path d="M50 16C52 39 61 48 84 50 61 52 52 61 50 84 48 61 39 52 16 50 39 48 48 39 50 16Z" fill="#258eed"/></svg>
      </div>
    </div>
  </section>;
}
