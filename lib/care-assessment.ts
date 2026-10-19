// Editorial routing, not a diagnosis or a price calculation. No customer data.
export const careMaterials = [
  { value: "textile", label: "Kumaş / file / örgü" },
  { value: "leather", label: "Düz deri" },
  { value: "suede", label: "Süet / nubuk" },
  { value: "mixed", label: "Karışık / emin değilim" },
] as const

export const careConditions = [
  { value: "dirt", label: "Toz / kuru çamur" },
  { value: "wet", label: "Islaklık / yağmur izi" },
  { value: "odor", label: "İç kısımda koku" },
  { value: "stain", label: "Yağ / leke / ürün izi" },
  { value: "color", label: "Sararma / renk farkı" },
  { value: "damage", label: "Hasar veya açılma" },
] as const

export type CareMaterial = typeof careMaterials[number]["value"]
export type CareCondition = typeof careConditions[number]["value"]
type CareLink = { href: string; label: string }
type MaterialAdvice = { note: string; guide: CareLink; service: CareLink; sourceId: string }

const materials: Record<CareMaterial, MaterialAdvice> = {
  textile: {
    note: "File ve örgüde yumuşak araç kullan; iplikleri çekecek sert fırçalamadan kaçın. Süet detay veya baskı varsa ayakkabının tamamını kumaş gibi ele alma.",
    guide: { href: "/rehber/file-orgu-ayakkabi-temizligi", label: "File ve örgü bakımını oku" },
    service: { href: "/sneaker-yikama", label: "Sneaker temizliğinin kapsamı" }, sourceId: "nikeMesh",
  },
  leather: {
    note: "Temizleyici, bakım kremi ve renkli cila farklı işler yapar. Düz deri için bile ürünün uygunluğunu kontrol et; rugan veya özel kaplamayı aynı kabul etme.",
    guide: { href: "/rehber/deri-ayakkabi-nasil-temizlenir", label: "Deri bakımını oku" },
    service: { href: "/deri-ayakkabi-bakimi", label: "Deri temizliği ve bakım kapsamı" }, sourceId: "clarksCare",
  },
  suede: {
    note: "Süet ve nubuğu suya batırma; düz deri kremi kullanma. Kuru yüzeyde, bu dokuya uygun fırçayla hafifçe çalışmak başlangıç olabilir; yerleşmiş lekeye aynı işlemi zorlayarak devam etme.",
    guide: { href: "/rehber/suet-nubuk-ayakkabi-nasil-temizlenir", label: "Süet ve nubuk bakımını oku" },
    service: { href: "/suet-nubuk-temizleme", label: "Süet ve nubuk temizliğinin kapsamı" }, sourceId: "nikeSuede",
  },
  mixed: {
    note: "Önce ayakkabının tamamını ve varsa model etiketini göster. En geniş yüzeyin kumaş olması, süet detayın veya baskının da aynı ürüne uygun olduğu anlamına gelmez.",
    guide: { href: "/rehber/spor-ayakkabi-nasil-temizlenir", label: "Ayakkabının parçalarını tanı" },
    service: { href: "/bakirkoy-ayakkabi-temizleme", label: "Dükkânda birlikte değerlendirelim" }, sourceId: "nikeClean",
  },
}

const conditions: Record<CareCondition, { title: string; next: string; bring: string; guide: CareLink }> = {
  dirt: {
    title: "Gevşek kiri, kalan izden ayır.",
    next: "Kuru yüzeyde gevşek kiri nazikçe al. Taban için kullandığın kirli fırçayı üst yüzeye taşıma. Kalan iz için basıncı veya ürün miktarını artırmadan malzemeyi kontrol et.",
    bring: "Çamurun çıktığı yer, ne kadar beklediği ve altında kalan iz; tüm ayakkabıyla birlikte yakın plan fotoğraf.",
    guide: { href: "/rehber/camurlu-ayakkabi-nasil-temizlenir", label: "Çamur temizliğinin adımları" },
  },
  wet: {
    title: "Önce kuruma durumunu değerlendir.",
    next: "Doğrudan ısı verme. Yalnız çıkarılabilir tabanlığı ayır; iç yüzey ve dil dahil kurumasına zaman bırak. Kuruduktan sonra kalan halka veya renk farkını ayrıca göster.",
    bring: "Ne zaman ıslandığı, içine su girip girmediği ve kalorifer ya da saç kurutma makinesi kullanılıp kullanılmadığı.",
    guide: { href: "/rehber/yagmurda-islanan-ayakkabi-bakimi", label: "Yağmur sonrası bakım adımları" },
  },
  odor: {
    title: "Dış yüzeyle birlikte içini de kontrol et.",
    next: "Tabanlık ve altındaki nemi kontrol et; yapışık parçayı zorlayarak çıkarma. Parfümle örtmek yerine son temizlik ve kurutmayı anlat. Koku için kalıcı sonuç veya sterilizasyon sözü verilemez.",
    bring: "Son yıkama tarihi, kullanılan sprey veya ürün, tabanlığın çıkıp çıkmadığı ve ayakkabının iç kısmının fotoğrafı.",
    guide: { href: "/rehber/ayakkabi-kokusu-nasil-giderilir", label: "Koku ve nem rehberi" },
  },
  stain: {
    title: "Yeni ürün eklemeden lekeyi göster.",
    next: "Lekenin kaynağını ve daha önce ne sürdüğünü not et. Farklı temizleyicileri art arda denemeden değerlendirme iste; eski lekenin tamamen çıkacağı yalnız bu seçimlerle belirlenemez.",
    bring: "Lekenin yaşı, biliniyorsa kaynağı, kullanılan ürünün adı veya ambalajı; bir yakın plan ve bütün çiftin fotoğrafı.",
    guide: { href: "/rehber/ayakkabi-bakimi-mi-onarim-mi", label: "Leke ile yüzey değişimini ayır" },
  },
  color: {
    title: "Renk farkını kir olarak varsayma.",
    next: "Ayakkabıyı kuru halde ve aynı ışıkta karşılaştır. Sararma, boya kaybı ve aşınma farklı nedenlerle oluşabilir. Daha güçlü beyazlatıcı denemek yerine izi göster; temizlik renk yenileme değildir.",
    bring: "İki ayakkabının filtresiz fotoğrafı, farkın ne zaman başladığı ve önceki temizlikte kullanılan ürünler.",
    guide: { href: "/rehber/beyaz-ayakkabi-nasil-temizlenir", label: "Kir, sararma ve renk kaybı" },
  },
  damage: {
    title: "Temizlikten önce mevcut hasarı göster.",
    next: "Açılan, soyulan veya çatlayan bölgeyi ovalama ya da sökmeye çalışma. Temizlik tabanı yapıştırmaz, eksilen yüzeyi onarmaz. Temizliğin uygunluğu ve sınırları fiziksel incelemede netleşir.",
    bring: "Hasarın yakını, ayakkabının tamamı ve daha önce yapılan yapıştırma veya başka bir işlem bilgisi.",
    guide: { href: "/rehber/ayakkabi-bakimi-mi-onarim-mi", label: "Temizlik ve onarımın farkı" },
  },
}

export function assessCare(material: string, condition: string) {
  if (!careMaterials.some(item => item.value === material) || !careConditions.some(item => item.value === condition)) return null
  const chosenMaterial = materials[material as CareMaterial]
  const chosenCondition = conditions[condition as CareCondition]
  return {
    ...chosenCondition,
    ...(material === "mixed" && condition === "dirt" ? {
      title: "Temizliğe başlamadan malzemeyi netleştir.",
      next: "Hangi yüzey olduğunu bilmeden ürün veya fırça seçme. Model bilgisi ve ayakkabının tamamının fotoğrafıyla başlayalım; tek bir parçaya bakarak bütün ayakkabı için yöntem seçilmez.",
    } : {}),
    materialNote: condition === "damage"
      ? ""
      : chosenMaterial.note,
    materialGuide: chosenMaterial.guide,
    service: chosenMaterial.service,
    sourceId: chosenMaterial.sourceId,
  }
}
