// One existing URL per material intent. Verified shop scope; no invented prices or outcomes.
export type ServiceFaq = { q: string; a: string }
export type Service = {
  slug: string; nav: string; metaTitle: string; metaDescription: string; h1: string; intro: string;
  heroImg: string; risks: { title: string; text: string }[]; steps: { title: string; text: string }[];
  notes: string[]; faqs: ServiceFaq[]; priceCategory: string; guideSlug: string; sourceIds: string[];
}
const timing = "Teslim zamanını ayakkabının durumuna, işlem ve kuruma ihtiyacına göre netleştirelim. Belirli bir saate ihtiyacın varsa gelmeden önce WhatsApp’tan yaz."
const price = "Güncel ücret için ayakkabının tamamını, sorunlu bölgesini ve varsa bakım etiketini paylaş. İşlem kapsamını ve fiyatı kabulden önce netleştirelim."

export const services: Service[] = [
  {
    slug: "sneaker-yikama", nav: "Sneaker ve spor ayakkabı temizleme",
    metaTitle: "Sneaker ve Spor Ayakkabı Temizleme — Bakırköy | Yıkat",
    metaDescription: "Bakırköy’de sneaker, kumaş ve mesh spor ayakkabı temizleme. Malzemeye göre değerlendirme, işlem kapsamı, fiyat bilgisi ve dükkâna yol tarifi.",
    h1: "Sneaker ve spor ayakkabını yıkat.",
    intro: "Kumaş, mesh ve karışık malzemeli sneaker’larda aynı yöntem her parçaya uygun olmayabilir. Bakırköy dükkânında ayakkabının malzemesini, lekelerini ve mevcut durumunu birlikte değerlendirerek temizlik kapsamını netleştirelim.",
    heroImg: "/images/services/sneaker-hero.webp",
    risks: [
      { title: "Karışık malzeme", text: "Kumaş üst yüzey, süet detay, deri parça ve baskı aynı ayakkabıda bulunabilir. Yöntemi seçerken ayakkabının tamamına bakmak gerekir." },
      { title: "Beyaz yüzey ve taban", text: "Kir ile aşınma veya renk değişimi aynı sorun değildir. Sararmayı görmeden tamamen giderileceği söylenemez." },
      { title: "Mevcut hasar", text: "Açılmış taban, soyulma veya eski bir tamir varsa işlemden önce göster. Temizleme, onarım hizmeti anlamına gelmez." },
    ],
    steps: [
      { title: "Ayakkabıyı inceleyelim", text: "Malzeme, leke ve mevcut yıpranmayı değerlendirelim. Daha önce evde uyguladığın ürünleri de paylaş." },
      { title: "Kapsamı netleştirelim", text: "Uygun temizliği, güncel ücreti ve teslim zamanını kabul öncesinde konuşalım." },
      { title: "Malzemeye uygun temizlik", text: "Bağcık, tabanlık, üst yüzey ve tabanı ayakkabının yapısına uygun biçimde ele alıyoruz." },
      { title: "Kurutma ve son kontrol", text: "Temizliğin ardından kurutma ve son kontrol geliyor. Hazır olma durumunu yalnız geçen saatle değerlendirmiyoruz." },
    ],
    notes: ["Temizlik ve bakım, taban değişimi, boyama veya restorasyonla aynı hizmet değildir.", "Eski lekeler, boya kaybı veya malzemedeki renk değişimi tamamen düzelmeyebilir. İşleme başlamadan beklentiyi konuşalım."],
    faqs: [
      { q: "Sneaker çamaşır makinesinde yıkanır mı?", a: "Her model için aynı yanıt yok. Tam modelin üretici talimatını kontrol et. Nike’ın genel önerisi ile adidas’ın 4DFWD için yayımladığı yöntem farklı; bakım rehberimizde kapsamlarını karşılaştırıyoruz." },
      { q: "Sneaker yıkama aynı gün teslim edilir mi?", a: timing },
      { q: "Beyaz spor ayakkabıdaki sararma çıkar mı?", a: "Kir, leke ve malzemenin renk değişimi ayrı değerlendirilir. Ayakkabıyı görmeden kesin beyazlatma veya yenileme sözü vermiyoruz." },
      { q: "Spor ayakkabı yıkama fiyatı ne kadar?", a: price },
    ],
    priceCategory: "Spor Ayakkabı", guideSlug: "ayakkabi-makinede-yikanir-mi", sourceIds: ["nikeMachine", "adidas4d"],
  },
  {
    slug: "suet-nubuk-temizleme", nav: "Süet ve nubuk ayakkabı temizleme",
    metaTitle: "Süet ve Nubuk Ayakkabı Temizleme — Bakırköy | Yıkat",
    metaDescription: "Bakırköy’de süet ve nubuk ayakkabı temizleme: hassas dokuya uygun değerlendirme, leke sınırları, bakım adımları ve dükkân bilgileri.",
    h1: "Süet ve nubuk için özenli temizlik.",
    intro: "Süet ve nubuk yüzeyleri klasik kumaş yıkaması gibi ele almıyoruz. Hassas dokuyu, lekenin türünü ve önceki işlemleri değerlendirerek uygun temizlik ve bakım yolunu birlikte netleştirelim.",
    heroImg: "/images/services/suet-hero.webp",
    risks: [
      { title: "Toz ve yüzey kiri", text: "Kuru yüzey kirini, su veya yağ iziyle karıştırmamak gerekir. İlk değerlendirmede lekenin kaynağını ve bekleme süresini paylaş." },
      { title: "Doku ve renk", text: "Yatmış hav, aşınma ve solma temizlikten farklı konulardır. Yalnız fotoğraftan bütün yüzey için aynı sonucu varsaymayalım." },
      { title: "Önceki ürünler", text: "Deri kremi, deterjan veya evde hazırlanan bir karışım kullandıysan belirt. Ürün adı ve işlem geçmişi değerlendirmeyi kolaylaştırır." },
    ],
    steps: [
      { title: "Yüzeyi değerlendirelim", text: "Süet veya nubuk dokuyu, renk geçişlerini ve mevcut lekeleri inceleyelim." },
      { title: "Beklentiyi konuşalım", text: "Temizliğin kapsamını, mevcut izlerin sınırlarını, ücreti ve teslim uygunluğunu baştan netleştirelim." },
      { title: "Hassas temizlik", text: "Yüzeye uygun fırça ve ürünlerle, ayakkabıyı suya boğmadan ilerliyoruz." },
      { title: "Kurutma ve doku kontrolü", text: "Temizlik sonrasında kuruma ve yüzeyin durumunu kontrol ediyoruz." },
    ],
    notes: ["Solmuş rengi boyayarak yenileme veya aşınmış dokuyu onarma, burada anlatılan temizliğin kapsamı değildir.", "Yağ, eski ürün kalıntısı veya yerleşmiş lekelerin tamamen çıkacağı garanti edilemez."],
    faqs: [
      { q: "Süet ve nubuk ayakkabı yıkanır mı?", a: "Klasik kumaş yıkamasıyla aynı şekilde ele alınmaz. Malzemeye uygun fırça, ürün ve kontrollü yöntem gerekir; üreticinin talimatı önceliklidir." },
      { q: "Yağmur ve eski lekeler çıkar mı?", a: "Sonuç lekeye, dokunun durumuna ve önceki işlemlere göre değişir. Görmeden tüm izlerin çıkacağını söylemek doğru olmaz." },
      { q: "Süet temizliği ne kadar sürer?", a: timing },
      { q: "Süet ve nubuk temizleme ücreti ne kadar?", a: price },
    ],
    priceCategory: "Süet & Nubuk", guideSlug: "suet-nubuk-ayakkabi-nasil-temizlenir", sourceIds: ["nikeSuede", "clarks"],
  },
  {
    slug: "deri-ayakkabi-bakimi", nav: "Deri ayakkabı temizliği ve bakımı",
    metaTitle: "Deri Ayakkabı Temizleme ve Bakımı — Bakırköy | Yıkat",
    metaDescription: "Klasik ve günlük deri ayakkabılar için Bakırköy’de temizlik ve bakım. Deri yüzey, mevcut çatlaklar, işlem sınırları ve ücret değerlendirmesi.",
    h1: "Deri ayakkabına uygun bakım.",
    intro: "Klasik ve günlük deri ayakkabıda önce yüzeyin türünü ve mevcut durumunu inceliyoruz. Kirin temizlenmesiyle çizik, soyulma veya çatlağın onarılması aynı iş değil; yapılabilecek bakımı birlikte değerlendirelim.",
    heroImg: "/images/services/deri-hero.webp",
    risks: [
      { title: "Deri yüzeyin türü", text: "Düz deri, kaplamalı yüzey ve süet görünümü aynı bakıma uygun olmayabilir. Ürünü seçmeden önce malzemeyi netleştirmek gerekir." },
      { title: "Çizik ve çatlak", text: "Yüzey kiri temizleme konusu olabilir; mevcut çatlak veya soyulmanın ortadan kalkması farklı bir beklentidir. Hasarı kabulden önce göster." },
      { title: "Eski bakım ürünü", text: "Daha önce kullanılan boya, cila veya temizleyiciyi belirt. Farklı ürünleri üst üste uygulamak yerine geçmişi bilerek değerlendirelim." },
    ],
    steps: [
      { title: "Deriyi inceleyelim", text: "Yüzeyin türünü, lekeleri ve mevcut yıpranmayı değerlendirelim." },
      { title: "Kapsamı konuşalım", text: "Temizlik ve bakımın sınırlarını, ücreti ve teslim zamanını netleştirelim." },
      { title: "Nazik temizlik ve bakım", text: "Deriyi suya boğmadan, uygun ürün ve yöntemle temizliyoruz; bakım ihtiyacını yüzeye göre ele alıyoruz." },
      { title: "Son kontrol", text: "İşlem ve kurutma sonrasında ayakkabıyı kontrol ediyoruz." },
    ],
    notes: ["Mevcut derin çatlak veya soyulmayı temizliğin gidereceği varsayılmamalı.", "Boyama, renk yenileme, taban değişimi ve onarım bu sayfadaki hizmetle aynı kapsamda değildir."],
    faqs: [
      { q: "Deri ayakkabı suyla yıkanır mı?", a: "Düz deriye, kumaş ayakkabıdakiyle aynı ıslak işlemi uygulama. Üreticinin talimatına ve deri yüzeye uygun temizleyiciye göre ilerlemek gerekir." },
      { q: "Derideki çatlaklar temizlikle geçer mi?", a: "Temizlik ve bakım, hasarlı yüzeyin onarılması anlamına gelmez. Mevcut çatlak ve soyulmayı önceden göstererek beklentiyi netleştirelim." },
      { q: "Deri bakım ne kadar sürer?", a: timing },
      { q: "Deri ayakkabı bakım fiyatı ne kadar?", a: price },
    ],
    priceCategory: "Deri Ayakkabı", guideSlug: "beyaz-ayakkabi-nasil-temizlenir", sourceIds: ["adidasLeather"],
  },
]
export const serviceBySlug = (slug: string) => services.find(s => s.slug === slug)
