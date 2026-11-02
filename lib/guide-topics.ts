import type { CareGuide, GuideTopic } from "@/lib/discovery"

export type GuideTopicInfo = { category: CareGuide["category"]; anchor: string; intro: string }

// /rehber sections in hub order (content plan of 2 November 2026). The anchor is the
// section id on the single /rehber URL; there are no topic, tag or category URLs.
// Intros stay true whichever guides of the topic are in the release, so they name
// kinds of problems rather than individual guides. Textile intros are informational
// only: no textile service is offered yet.
export const guideTopics = {
  "Malzemeye göre temizlik": { category: "Ayakkabı", anchor: "malzeme", intro: "Süet, deri, file ya da kumaş: her malzeme suya ve fırçaya farklı tepki verir. Önce ayakkabının neyden yapıldığına bak, sonra ona uygun rehberi aç." },
  "Leke ve sararma": { category: "Ayakkabı", anchor: "leke-ve-sararma", intro: "Leke, sararma ve yerleşmiş kir için adım adım yöntemler. Her temizleyiciyi önce görünmeyen bir yerde dene." },
  "Yıkama ve kurutma": { category: "Ayakkabı", anchor: "yikama-ve-kurutma", intro: "Makine sorusu, elde temizlik ve doğru kurutma. Kalorifer, saç kurutma makinesi ve güneş neden zarar verir, yerine ne yapılır?" },
  "Koku, tabanlık ve bağcık": { category: "Ayakkabı", anchor: "koku-tabanlik-bagcik", intro: "Koku çoğu zaman tabanlıkta ve nemde başlar. Tabanlık, bağcık ve ayakkabının iç kısmı bu başlıkta." },
  "Marka bakımı": { category: "Ayakkabı", anchor: "marka-bakimi", intro: "Markaların kendi yayımladığı bakım önerileri, sade bir dille. Kendi modelinin etiketi ve üretici talimatı her zaman önce gelir." },
  "Bakım, saklama ve fiyat": { category: "Ayakkabı", anchor: "bakim-saklama-fiyat", intro: "Sezon sonu saklama, bakım mı onarım mı sorusu ve temizlik ücretini neyin belirlediği." },
  "Leke çıkarma": { category: "Tekstil", anchor: "leke-cikarma", intro: "Kumaştaki lekeler için adım adım yöntemler. Her lekenin su sıcaklığı ve sırası farklı; leke çıkmadan çamaşırı kurutmaya atma." },
  "Yiyecek ve içecek lekeleri": { category: "Tekstil", anchor: "yiyecek-icecek-lekeleri", intro: "Çay, kahve, şarap ve meyve gibi lekeler. Çoğunda ilk adım aynı: lekeyi ovmadan al ve bekletmeden soğuk suyla çalış." },
  "Çamaşır yıkama": { category: "Tekstil", anchor: "camasir-yikama", intro: "Beyazlar, renkliler, siyahlar ve hassas çamaşırlar için derece ve program. Kararı bakım etiketindeki sembol verir." },
  "Ev tekstili": { category: "Tekstil", anchor: "ev-tekstili", intro: "Yorgan, perde, yastık ve havlu gibi büyük parçalar. Makineye atmadan önce bakım etiketini ve makinenin kapasitesini kontrol et." },
  "Giysi bakımı": { category: "Tekstil", anchor: "giysi-bakimi", intro: "Mont, kaban, yün ve ipek gibi giysiler: hangisi makineye girer, hangisi girmez?" },
  "Etiket, ütü ve kuru temizleme": { category: "Tekstil", anchor: "etiket-utu-kuru-temizleme", intro: "Yıkama sembollerinin anlamı, ütüleme ve kuru temizlemenin ne olduğu." },
} satisfies Record<GuideTopic, GuideTopicInfo>

export const guideCategories = [
  { category: "Ayakkabı", title: "Ayakkabı bakımı", anchor: "ayakkabi-bakimi" },
  { category: "Tekstil", title: "Tekstil bakımı", anchor: "tekstil-bakimi" },
] as const satisfies readonly { category: CareGuide["category"]; title: string; anchor: string }[]

/** Topic labels of one category, in hub order. */
export const topicsOf = (category: CareGuide["category"]) =>
  (Object.keys(guideTopics) as GuideTopic[]).filter(topic => guideTopics[topic].category === category)
