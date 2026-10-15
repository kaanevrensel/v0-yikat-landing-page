"use client";

import { useState, type CSSProperties } from "react";
import { ArrowDownRight } from "lucide-react";
import { PhonePreview, type PhoneMode } from "./phone";
import { CareObject } from "./care-objects";
import { TimeDial } from "./brand-art";
import { MotionScene } from "./motion";
import { DownloadButton } from "./shared";

const views = [
  { mode: "photos", label: "Fotoğraflar", object: "camera" },
  { mode: "plan", label: "Zaman seçimi", object: "clock" },
  { mode: "track", label: "Sipariş takibi", object: "parcel" },
] as const;

export function AppStage() {
  const [mode, setMode] = useState<PhoneMode>("home");
  const [instant, setInstant] = useState(false);
  return <section className="app-object-section app-object-product" aria-labelledby="product-title">
    <h1 id="product-title" className="sr-only">Birkaç dokunuşla yıkat</h1>
    <p className="product-availability">Uygulamayı keşfet. Kapıdan alım henüz başlamadı; ayakkabını Bakırköy dükkânına getirebilirsin.</p>
    <MotionScene className="app-object-scene">
      <div className="app-orbit" aria-hidden="true"><span/><span/><span/></div>
      <div className="app-preview-holder" data-instant={instant}>
        <PhonePreview mode={mode}/>
      </div>
      <div className="app-object-controls" role="group" aria-label="Uygulama önizlemesini seç">
        {views.map((view, index) => <button
          type="button"
          className={`app-object-control app-control-${view.object}`}
          style={{ "--object-index": index } as CSSProperties}
          key={view.mode}
          aria-pressed={mode === view.mode}
          onClick={event => { setInstant(event.detail === 0); setMode(view.mode); }}
        >
          <span className="app-control-art">{view.object === "clock" ? <TimeDial slot={1}/> : <CareObject kind={view.object}/>}</span>
          <span className="app-control-label">{view.label}<ArrowDownRight size={16} aria-hidden="true"/></span>
        </button>)}
      </div>
    </MotionScene>
    <div className="app-object-actions">
      <DownloadButton/>
      <a href="#urun-deneyimi" className="object-discover subtle-discover">Kendin dene <ArrowDownRight aria-hidden="true" size={18}/></a>
    </div>
  </section>;
}
