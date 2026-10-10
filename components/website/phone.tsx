"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  Clock3,
  Home,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ServiceArt } from "./service-art";

export type PhoneMode = "home" | "photos" | "plan" | "track" | "repeat";
export function PhonePreview({ mode = "home" }: { mode?: PhoneMode }) {
  return (
    <div className="phone-device" aria-label="Uygulamanın örnek görünümü">
      <div className="phone-camera" />
      <div className="phone-status">
        <span>9:41</span>
        <span>••• ▰</span>
      </div>
      <div className="phone-screen" key={mode}>
        {mode === "home" ? (
          <>
            <div className="phone-brand">
              <Logo width={58} />
              <Bell size={19} />
            </div>
            <div className="phone-address">
              <MapPin size={14} />
              <span>Teslimat adresini seç</span>
              <ChevronDown size={13} />
            </div>
            <h3>Günün sana kalsın</h3>
            <p className="phone-description">Bugün ne yıkatalım?</p>
            <div className="phone-service-main">
              <div>
                <strong>Ayakkabı</strong>
                <span>Her adımda tertemiz.</span>
                <span className="phone-small-button">
                  Keşfet <ArrowRight size={12} />
                </span>
              </div>
              <Image unoptimized
                src="/images/services/ayakkabi.png"
                alt=""
                width={145}
                height={145}
              />
            </div>
            <div className="phone-service-grid">
              {[
                { name: "Kuru temizleme", src: "dry-cleaning" },
                { name: "Çamaşır", src: "kiloyla" },
                { name: "Ütü", src: "utu" },
                { name: "Yorgan & battaniye", src: "hacimli" },
              ].map((s) => (
                <div key={s.name}>
                  <Image unoptimized
                    src={`/images/services/${s.src}.png`}
                    alt=""
                    width={85}
                    height={85}
                  />
                  <span>{s.name}</span>
                </div>
              ))}
            </div>
            <div className="phone-hint">
              <ShieldCheck size={15} />
              <span>Adresine uygun hizmetleri keşfet.</span>
            </div>
          </>
        ) : mode === "photos" ? (
          <>
            <div className="phone-view-title"><ArrowLeft size={20}/><strong>Çiftinin hikâyesi</strong></div>
            <div className="phone-photo-main"><ServiceArt kind="ayakkabi"/><span>Senin çektiğin</span><i/><i/><i/><i/></div>
            <div className="phone-photo-pair">
              <div><ServiceArt kind="ayakkabi"/><span>Alındı</span><Check size={14}/></div>
              <div><ServiceArt kind="ayakkabi"/><span>Hazır</span><Sparkles size={14}/></div>
            </div>
            <p className="phone-photo-note">Her aşama, aynı çift.</p>
          </>
        ) : mode === "plan" ? (
          <>
            <div className="phone-view-title">
              <ArrowLeft size={20} />
              <strong>Alım & teslim</strong>
            </div>
            <h3>
              Sana uyan
              <br />
              zamanı seç
            </h3>
            <p className="phone-description">Alım günü</p>
            <div className="phone-days">
              {["Pzt", "Sal", "Çar", "Per"].map((d, i) => (
                <span className={i === 1 ? "selected" : ""} key={d}>
                  <small>{d}</small>
                  {12 + i}
                </span>
              ))}
            </div>
            <p className="phone-description">Alım saati</p>
            <div className="phone-time selected">
              <Clock3 size={18} />
              09.00 – 13.00
              <Check size={16} />
            </div>
            <div className="phone-time">
              <Clock3 size={18} />
              13.00 – 17.00
            </div>
            <div className="phone-time">
              <Clock3 size={18} />
              17.00 – 21.00
            </div>
            <div className="phone-summary">
              <MapPin size={20} />
              <div>
                <strong>Kapından alalım.</strong>
                <p>Güncel saatler adresine göre gösterilir.</p>
              </div>
            </div>
            <div className="phone-primary">
              Devam et <ArrowRight size={16} />
            </div>
          </>
        ) : mode === "track" ? (
          <>
            <div className="phone-view-title">
              <ArrowLeft size={20} />
              <strong>Siparişin</strong>
            </div>
            <div className="phone-track-art">
              <Image unoptimized
                src="/images/services/ayakkabi.png"
                alt=""
                width={160}
                height={160}
              />
              <span>
                <Sparkles size={15} /> Özenle temizleniyor
              </span>
            </div>
            <h3>
              Siparişini
              <br />
              buradan takip et
            </h3>
            <div className="phone-timeline">
              {[
                "Sipariş alındı",
                "Kapından alındı",
                "Temizleniyor",
                "Teslime hazır",
              ].map((s, i) => (
                <div className={i < 3 ? "done" : ""} key={s}>
                  <i>
                    {i < 2 ? (
                      <Check size={12} />
                    ) : i === 2 ? (
                      <Sparkles size={12} />
                    ) : (
                      <Package size={12} />
                    )}
                  </i>
                  <span>{s}</span>
                  {i === 2 && <small>Şimdi</small>}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="phone-view-title">
              <ArrowLeft size={20} />
              <strong>Favorilerin</strong>
            </div>
            <h3>
              Favorinden
              <br />
              tekrar yıkat
            </h3>
            <p className="phone-description">
              Sevdiğin düzen, hep elinin altında.
            </p>
            <div className="phone-favorite">
              <Image unoptimized
                src="/images/services/kiloyla.png"
                alt=""
                width={160}
                height={160}
              />
              <strong>Haftalık temizlik</strong>
              <span>Favori sipariş örneği</span>
              <div className="phone-primary">
                Tekrar sipariş ver <ArrowRight size={16} />
              </div>
            </div>
            <div className="phone-summary">
              <ShieldCheck size={20} />
              <p>Adresini ve saatini kontrol et, siparişini tamamla.</p>
            </div>
          </>
        )}
      </div>
      <div className="phone-tabs">
        <span className="selected">
          <Home size={17} />
          Ana sayfa
        </span>
        <span>
          <Package size={17} />
          Siparişlerim
        </span>
        <span>
          <User size={17} />
          Profilim
        </span>
      </div>
      <div className="phone-home-bar" />
    </div>
  );
}
