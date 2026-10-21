// One existing URL per material intent. Verified shop scope; no invented prices or outcomes.
export type ServiceFaq = { q: string; a: string }
export type Service = {
  slug: string; nav: string; metaTitle: string; metaDescription: string; h1: string; intro: string;
  heroImg: string; risks: { title: string; text: string }[]; steps: { title: string; text: string }[];
  notes: string[]; faqs: ServiceFaq[]; priceCategory: string; guideSlug: string; sourceIds: string[];
  beforeVisit: string; afterCare: string; afterCareSourceId: string; relatedGuides: string[];
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
      { title: "Mevcut hasar", text: "Açılmış taban, soyulma veya daha önce yapıştırılmış bir bölge varsa temizlikten önce göster. Onarım yapmıyoruz; temizlik bu hasarı gidermez." },
    ],
    steps: [
      { title: "Ayakkabıyı inceleyelim", text: "Malzeme, leke ve mevcut yıpranmayı değerlendirelim. Daha önce evde uyguladığın ürünleri de paylaş." },
      { title: "Kapsamı netleştirelim", text: "Uygun temizliği, güncel ücreti ve teslim zamanını kabul öncesinde konuşalım." },
      { title: "Malzemeye uygun temizlik", text: "Bağcık, tabanlık, üst yüzey ve tabanı ayakkabının yapısına uygun biçimde ele alıyoruz." },
      { title: "Kurutma ve son kontrol", text: "Temizliğin ardından kurutma ve son kontrol geliyor. Hazır olma durumunu yalnız geçen saatle değerlendirmiyoruz." },
    ],
    notes: ["Boyama, taban değişimi veya restorasyon yapmıyoruz; yalnızca temizlik ve bakım yapıyoruz.", "Eski lekeler, boya kaybı veya malzemedeki renk değişimi tamamen düzelmeyebilir. İşleme başlamadan beklentiyi konuşalım."],
    beforeVisit: "Filede iplik çekilmesi, baskıda kalkma veya tabanda açılma varsa yakın planını göster. Süet detaylı bir sneaker’ı yalnız kumaş ayakkabı diye tarif etme. Özel tabanlık veya orijinal bağcık kullanıyorsan bunu da belirt.",
    afterCare: "File ve örgüyü sert fırçayla ovalama; gevşek kiri nazikçe al. İplik çekilmesi veya tüylenme görürsen dur. Islanan ayakkabıyı doğrudan ısıya vermeden kurut; yeniden giymeden önce içini de kontrol et.",
    afterCareSourceId: "nikeMesh", relatedGuides: ["file-orgu-ayakkabi-temizligi", "ayakkabi-tabanligi-nasil-temizlenir"],
    faqs: [
      { q: "Sneaker çamaşır makinesinde yıkanır mı?", a: "Hayır, sneaker’ını çamaşır makinesine atma. Tambur, uzun süre su ve sıkma; yapıştırıcıyı, tabanı ve formu yıpratabilir. File veya düşük derece bunu değiştirmez; nedenlerini bakım rehberimizde anlattık." },
      { q: "Sneaker yıkama aynı gün teslim edilir mi?", a: timing },
      { q: "Beyaz spor ayakkabıdaki sararma çıkar mı?", a: "Kir, leke ve malzemenin renk değişimi ayrı değerlendirilir. Ayakkabıyı görmeden kesin beyazlatma veya yenileme sözü vermiyoruz." },
      { q: "Spor ayakkabı yıkama fiyatı ne kadar?", a: price },
    ],
    priceCategory: "Spor Ayakkabı", guideSlug: "spor-ayakkabi-nasil-temizlenir", sourceIds: ["nikeMachine", "nikeClean"],
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
    notes: ["Solmuş rengi boyamıyor, aşınmış dokuyu onarmıyoruz; yalnızca temizlik ve bakım yapıyoruz.", "Yağ, eski ürün kalıntısı veya yerleşmiş lekelerin tamamen çıkacağı garanti edilemez."],
    beforeVisit: "Yağmur halkası, yağ izi ve havın yatması aynı sorun değil. İzi ne zaman fark ettiğini ve ayakkabı o sırada ıslak mı kuru mu olduğunu söyle. Krem, su geçirmezlik spreyi veya leke çıkarıcı kullandıysan ürün adını paylaş.",
    afterCare: "Kuru yüzeyde bu dokuya uygun bir fırçayla nazikçe çalış. Suya batırma; düz deri bakımını süete uygulama. Yeni bir ürün kullanmadan ayakkabının ve ürünün kendi talimatlarını birlikte kontrol et.",
    afterCareSourceId: "nikeSuede", relatedGuides: ["yagmurda-islanan-ayakkabi-bakimi", "ayakkabi-bakimi-mi-onarim-mi"],
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
    intro: "Klasik ve günlük deri ayakkabıda önce yüzeyin türünü ve mevcut durumunu inceliyoruz. Temizlik kiri alır; çizik, soyulma veya çatlağı onarmaz. Yapılabilecek temizlik ve bakımı birlikte değerlendirelim.",
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
    notes: ["Mevcut derin çatlak veya soyulmayı temizliğin gidereceği varsayılmamalı.", "Lostra, boyama, renk yenileme, taban değişimi veya onarım hizmeti vermiyoruz; yalnızca temizlik ve bakım yapıyoruz."],
    beforeVisit: "Rugan, kaplamalı yüzey ve düz deriyi ayırabilmek için bütün ayakkabıyı göster. Çizik veya soyulmanın yakınıyla birlikte daha önce kullanılan boya, cila ve kremi belirt. Hangi lekenin veya bölgenin temizlenmesini beklediğini baştan söyle.",
    afterCare: "Temizleme, bakım ve parlatmayı ayrı ihtiyaçlar olarak düşün. Krem veya cilayı yalnız uygun yüzeyde kullan; rengi ve ürün kapsamını kontrol et. Saklamadan önce kurumasını bekle ve doğrudan ısıyla hızlandırma.",
    afterCareSourceId: "clarksCare", relatedGuides: ["ayakkabi-bakimi-mi-onarim-mi", "ayakkabi-nasil-saklanir"],
    faqs: [
      { q: "Deri ayakkabı suyla yıkanır mı?", a: "Düz deriye, kumaş ayakkabıdakiyle aynı ıslak işlemi uygulama. Üreticinin talimatına ve deri yüzeye uygun temizleyiciye göre ilerlemek gerekir." },
      { q: "Derideki çatlaklar temizlikle geçer mi?", a: "Hayır. Temizlik ve bakım hasarlı yüzeyi onarmaz; onarım hizmeti de vermiyoruz. Mevcut çatlak ve soyulmayı önceden göstererek beklentiyi netleştirelim." },
      { q: "Deri bakım ne kadar sürer?", a: timing },
      { q: "Deri ayakkabı bakım fiyatı ne kadar?", a: price },
    ],
    priceCategory: "Deri Ayakkabı", guideSlug: "deri-ayakkabi-nasil-temizlenir", sourceIds: ["adidasLeather"],
  },
]
export const serviceBySlug = (slug: string) => services.find(s => s.slug === slug)
