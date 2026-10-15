"use client"

import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { assessCare, careConditions, careMaterials } from "@/lib/care-assessment"
import { careSources } from "@/lib/discovery"
import { PhotoEnquiryLink } from "./actions"

const subscribe = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

export function CareAssessment() {
  const enhanced = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot)
  const [material, setMaterial] = useState("")
  const [condition, setCondition] = useState("")
  const advice = assessCare(material, condition)

  return <section id="bakim-secimi" className="care-assessment" aria-labelledby="care-assessment-title">
    <div className="care-assessment-intro">
      <h2 id="care-assessment-title">Ayakkabın için<br/>nereden başlamalı?</h2>
      <p>Malzemeyi ve gördüğün sorunu seç; ilk adımı ve dükkâna danışırken hangi bilgilerin işe yarayacağını gör.</p>
      <p className="care-assessment-note">Ayakkabıyı görmeden kesin sonuç söyleyemeyiz. İşlem ve ücret dükkânda netleşir.</p>
    </div>
    <div className="care-assessment-workspace">
      <div hidden={!enhanced}>
        <div className="care-assessment-controls">
          <div><label htmlFor="care-material">Malzemesi</label><select id="care-material" value={material} onChange={event => setMaterial(event.target.value)} aria-describedby="care-selection-help"><option value="">Malzeme seç</option>{careMaterials.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
          <div><label htmlFor="care-condition">Gördüğün durum</label><select id="care-condition" value={condition} onChange={event => setCondition(event.target.value)} aria-describedby="care-selection-help"><option value="">Durum seç</option>{careConditions.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
        </div>
        <p id="care-selection-help" className="care-assessment-note">İki seçimi tamamladığında rehber aşağıda güncellenir.</p>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{advice ? `Rehber güncellendi. ${advice.title}` : "Rehber için malzeme ve durum seç."}</p>
        {advice ? <div className="care-assessment-result" aria-labelledby="care-result-title">
          <h3 id="care-result-title">{advice.title}</h3>
          <p>{advice.next}</p>
          {advice.materialNote && <p>{advice.materialNote}</p>}
          <h4>Danışırken paylaş</h4><p>{advice.bring}</p>
          <div className="care-assessment-links"><Link href={advice.guide.href}>{advice.guide.label}</Link><Link href={advice.materialGuide.href}>{advice.materialGuide.label}</Link><Link href={advice.service.href}>{advice.service.label}</Link></div>
          {advice.materialNote && <p className="care-assessment-note">Bakım kaynağı: <a href={careSources[advice.sourceId].url} target="_blank" rel="noopener noreferrer">{advice.sourceId === "clarksCare" ? "Clarks" : "Nike"} üretici rehberi</a>. Kendi modelinin bakım talimatı önceliklidir.</p>}
        </div> : <p className="care-assessment-start">Süet detaylı bir sneaker mı, yağmurda ıslanmış deri bir çift mi? Aynı görünen kir, farklı bir ilk adım gerektirebilir.</p>}
      </div>
      <div hidden={enhanced} className="care-assessment-fallback">
        <h3>Önce malzemeyi ve sorunu ayır.</h3>
        <p>Süet ve nubukta kumaşa uygulanan ıslak temizliği kullanma. Karışık malzemeyi bütün olarak göster. Islak ayakkabıya doğrudan ısı verme; çatlak veya taban açılmasını kir gibi ovalama.</p>
        <p>Bir bütün görünüm, sorunlu bölgenin yakını ve varsa model etiketiyle başla. Daha önce sürdüğün ürünü ve ihtiyaç duyduğun teslim tarihini de paylaş.</p>
        <div className="care-assessment-links"><Link href="/rehber/spor-ayakkabi-nasil-temizlenir">Kumaş ve karışık malzeme</Link><Link href="/rehber/suet-nubuk-ayakkabi-nasil-temizlenir">Süet ve nubuk</Link><Link href="/rehber/deri-ayakkabi-nasil-temizlenir">Düz deri</Link><Link href="/rehber/ayakkabi-bakimi-mi-onarim-mi">Leke mi, hasar mı?</Link></div>
      </div>
      <PhotoEnquiryLink className="discovery-inline-link">Fotoğrafla birlikte sor</PhotoEnquiryLink>
    </div>
  </section>
}
