import type { CareGuide } from "@/lib/discovery"

// Deliberate, individually edited answers. No city/brand permutation generator.
export const careGuides: CareGuide[] = [
  {
    slug: "ayakkabi-makinede-yikanir-mi",
    updated: "2026-10-12",
    title: "Ayakkabı çamaşır makinesinde yıkanır mı?",
    description: "Hayır, ayakkabıyı çamaşır makinesine atma. Makinenin yapıştırıcıya, tabana ve forma etkisi; file ve düşük derecenin neden yetmediği ve makine yerine yapabileceklerin.",
    category: "Ayakkabı",
    answer: "Hayır. Ayakkabını çamaşır makinesine atma. Tamburun çarpması, uzun süre suda kalma ve sıkma; yapıştırıcıyı, tabanı ve ayakkabının formunu yıpratabilir. Düşük derece, yıkama filesi veya makinedeki “spor ayakkabı programı” bunu değiştirmez. Yüzey kirini elde, malzemeye uygun yöntemle temizle.",
    sections: [
      { id: "neden", title: "Makine ayakkabıya ne yapar?", paragraphs: ["Çamaşır makinesi kumaş için tasarlanır. Ayakkabı ise birbirine yapıştırılmış ve dikilmiş farklı parçalardan oluşur: üst yüzey, astar, ara taban, dış taban. Üst yüzeyi kumaş olan bir sneaker’da bile bu parçaların hepsi aynı anda suya, sürtünmeye ve sıkmaya girer.", "Nike da genel bakım rehberinde ayakkabıyı makinede yıkamayı önermiyor; elde, nazik temizliği anlatıyor."], table: { caption: "Makinede yıkamanın riskleri", headings: ["Parça", "Ne olabilir?"], rows: [["Yapıştırıcı ve taban", "Uzun süre su ve sıcaklık yapıştırıcıyı zayıflatabilir; taban açılabilir."], ["Form", "Tambur ve sıkma burun, topuk ve yan destekleri ezebilir; ayakkabı şeklini kaybedebilir."], ["Deri, süet, nubuk ve baskılar", "Su ve sürtünme yüzeyi sertleştirebilir, rengi soldurabilir veya baskıyı dökebilir."], ["İç dolgu ve tabanlık", "Suyu emer ve geç kurur; nemli kalan iç yüzey kokuya yol açabilir."]] }, sourceIds: ["nikeMachine"] },
      { id: "derece", title: "30 derece, file veya “spor ayakkabı programı” olursa?", paragraphs: ["Yine atma. Düşük sıcaklık yalnız ısıyı azaltır; tamburun çarpması, suda kalma süresi ve sıkma aynı kalır. Yıkama filesi veya yastık kılıfı ayakkabıyı sudan da darbeden de korumaz.", "“Spor ayakkabı programı” makinenin bir özelliğidir; ayakkabının makineye dayanacağını göstermez. Ayakkabının beyaz, bez veya fileli olması da bunu değiştirmez.", "Kurutma makinesi için de aynısı geçerli: ısı ve dönme hareketi yapıştırıcıya ve forma zarar verebilir."] },
      { id: "alternatif", title: "Makine yerine ne yapabilirsin?", steps: ["Bağcıkları ve çıkarılabilen tabanlığı ayır.", "Kuru tozu ve çamuru yumuşak bir fırçayla al.", "Malzemeye uygun temizleyiciyi önce küçük, görünmeyen bir yerde dene; sonra az suyla, elde temizle. Ayakkabıyı suya batırma.", "Doğrudan ısı vermeden, hava alan bir yerde tamamen kurut."], paragraphs: ["Bu sıra kumaş ve düz yüzeyler içindir. Süet ve nubuk için ayrı rehbere geç; kumaş temizliğini bu yüzeylere uygulama."], sourceIds: ["nikeClean"] },
      { id: "dukkan", title: "Elde temizlik yetmediğinde", paragraphs: ["Elde temizlik yüzey kirini alır. İçine işlemiş kir, koku, karışık malzeme veya emin olamadığın bir leke varsa ayakkabıyı makineye atmak yerine bize getir.", "Bakırköy’deki dükkânımızda ayakkabıya özel ekipmanla çalışıyoruz; yöntemi malzemeye göre seçiyor, temizlikten sonra ayakkabıyı kontrollü biçimde kurutuyoruz. WhatsApp’tan fotoğraf gönderirsen ne yapılabileceğini önceden konuşabiliriz."] },
    ],
    faqs: [
      { q: "Ayakkabı kaç derecede yıkanır?", a: "Hiçbir derecede: ayakkabıyı çamaşır makinesine atmanı önermiyoruz. Sorun yalnız sıcaklık değil; tamburun çarpması, uzun süre su ve sıkma da ayakkabıyı yıpratır." },
      { q: "Yıkama filesi veya yastık kılıfıyla atsam olur mu?", a: "Olmaz. File, ayakkabıyı sudan da tambura çarpmaktan da korumaz; yapıştırıcı ve form aynı riski taşır." },
      { q: "Bez (kanvas) ayakkabı da mı atılmaz?", a: "Onu da atma. Üst yüzeyi kumaş olsa da taban, yapıştırıcı ve iç yapı makinede aynı şekilde yıpranır. Elde temizle veya dükkâna getir." },
      { q: "Bakırköy’de ayakkabımı gösterebileceğim bir yer var mı?", a: "Sakızağacı Mahallesi İskele Caddesi No:15-B’deki dükkânımıza Pazartesi–Cumartesi 08:30–20:30, Pazar 10:00–20:30 arasında getirebilirsin. Uygun yöntemi, ücreti ve teslim zamanını birlikte netleştirelim." },
    ],
    related: ["spor-ayakkabi-nasil-temizlenir", "suet-nubuk-ayakkabi-nasil-temizlenir", "ayakkabi-nasil-kurutulur"],
    service: { href: "/sneaker-yikama", label: "Sneaker ve spor ayakkabı temizleme" },
    sourceIds: ["nikeMachine", "nikeClean"],
  },
  {
    slug: "beyaz-ayakkabi-nasil-temizlenir",
    updated: "2026-10-12",
    title: "Beyaz ayakkabı nasıl temizlenir?",
    description: "Beyaz kumaş, deri ve süet ayakkabıya aynı yöntemi uygulama. Yüzey kiri, leke ve sararmayı ayıran pratik bir bakım rehberi.",
    category: "Ayakkabı",
    answer: "Beyaz ayakkabıyı temizlerken önce rengini değil malzemesini belirle. Kuru kiri al, üreticinin önerdiği temizleyiciyi küçük ve görünmeyen bir yerde dene; üst yüzeyi, tabanı ve bağcıkları ayrı değerlendir. Sararma, çizik ve yüzey aşınması her zaman temizlikle düzelmez.",
    sections: [
      { id: "malzeme", title: "Beyaz ama hangi malzeme?", table: { caption: "Renge göre değil, yüzeye göre bakım seç", headings: ["Yüzey", "İlk karar", "Dikkat et"], rows: [["Kumaş / kanvas / mesh", "Modelin bakım talimatını bul.", "Kumaş olması, çamaşır makinesine atılabileceği anlamına gelmez; atma."], ["Düz deri", "Deri yüzeye uygun temizleyici seç.", "Kumaşa uygulanan ıslak işlemi deriye taşıma."], ["Süet / nubuk", "Ayrı, hassas yüzey bakımını kullan.", "Düz deri kremi ve sert ovalamayı genelleme."], ["Karışık malzeme", "Her parçayı ayrı tanımla.", "Renkli parçalar ve baskıları da hesaba kat."]] }, paragraphs: ["Aynı ayakkabıda beyaz deri, kumaş dil ve renkli süet birlikte bulunabilir. “Beyaz sneaker temizliği” tek bir ürün veya yöntem adı değildir. Malzemeyi tanıyamıyorsan kutudaki model bilgisi ve üreticinin ürün sayfası iyi bir başlangıçtır."] },
      { id: "sirayla", title: "Kontrollü bir temizlik sırası", steps: ["Bağcıkları çıkar; yüzeydeki kuru tozu ve gevşek kiri nazikçe al.", "Üreticiye ve malzemeye uygun ürünü küçük, görünmeyen bir bölgede dene. Renk veya doku değişirse devam etme.", "Üst yüzey ve taban için ayrı bez ya da fırça kullan; tabandaki kiri kumaşa taşıma.", "Temizleyici kalıntısını ürün talimatına göre gider. Ayakkabı ve bağcıkları yeniden birleştirmeden önce uygun biçimde kurut."], sourceIds: ["nikeClean", "adidasLeather"] },
      { id: "sararma", title: "Kir ile sararma aynı şey değil", paragraphs: ["Toz, çamur ve yüzey kiri temizleme konusu olabilir. Boya kaybı, çatlak, soyulma veya malzemenin kendi rengindeki değişim ise farklı bir değerlendirme gerektirir. “Bembeyaz olur” sözü vermeden önce hangi sorunla karşı karşıya olduğumuzu görmek gerekir.", "Bir bölge diğerinden farklı görünüyorsa fotoğrafta hem yakın planı hem ayakkabının bütününü göster. Ne zaman oluştuğunu ve daha önce hangi ürünleri sürdüğünü de belirt. Böylece eski bir işlem iziyle yeni bir lekeyi karıştırmadan konuşabiliriz."] },
      { id: "karisimlar", title: "Evdeki her beyazlatıcı ayakkabı için uygun değil", paragraphs: ["Çamaşır suyu, güçlü leke çıkarıcı veya internette önerilen bir karışımı yalnız beyaz renge bakarak seçme. Bir malzeme için verilen tarif, baskı, süet detay veya yapıştırılmış parça için uygun olmayabilir. Ürün etiketinde ve ayakkabı talimatında açıkça uygunluk aramak daha doğru bir karar noktasıdır.", "Daha fazla ürün veya daha sert fırça, daha iyi sonuç anlamına gelmez. Renk değişimi, yüzeyde tüylenme ya da soyulma fark edersen işlemi durdur; üstünü yeni bir karışımla kapatmaya çalışma."] },
    ],
    faqs: [
      { q: "Beyaz tabandaki sararma kesin çıkar mı?", a: "Kesin sonuç söylenemez. Kir, leke, aşınma ve malzemenin renk değişimi farklı sorunlardır; ayakkabıyı görerek değerlendirmek gerekir." },
      { q: "Beyaz ayakkabıyı makineye atabilir miyim?", a: "Hayır. Beyaz olsun olmasın, ayakkabıyı çamaşır makinesine atma; yapıştırıcı, taban ve form zarar görebilir. Nedenlerini makine rehberimizde anlattık." },
      { q: "Boya veya taban yenileme de yapılıyor mu?", a: "Burada anlatılan hizmet temizlik ve bakımdır. Boyama, taban yenileme veya onarımı temizlik hizmetinin parçası olarak varsayma." },
    ],
    related: ["ayakkabi-makinede-yikanir-mi", "ayakkabi-nasil-kurutulur"],
    service: { href: "/sneaker-yikama", label: "Spor ayakkabını dükkânda yıkat" },
    sourceIds: ["nikeClean", "adidasLeather"],
  },
  {
    slug: "suet-nubuk-ayakkabi-nasil-temizlenir",
    title: "Süet ve nubuk ayakkabı nasıl temizlenir?",
    description: "Süet ve nubukta kuru kir, ıslak yüzey ve yerleşmiş leke için karar rehberi. Fırça seçimi, ürün testi ve profesyonel değerlendirme sınırları.",
    category: "Ayakkabı",
    answer: "Süet ve nubukta önce yüzeyin kurumasını bekle, gevşek kiri uygun bir bakım fırçasıyla nazikçe al. Suya batırma ve düz deri için hazırlanmış ürünü bu dokulara otomatik olarak uygulama. Leke kalırsa malzemeye uygun ürün ve küçük alan testiyle ilerle; her iz tamamen çıkmayabilir.",
    sections: [
      { id: "baslangic", title: "Önce kuru kir mi, ıslak leke mi?", table: { caption: "İşleme başlamadan durumu ayır", headings: ["Gördüğün durum", "İlk adım", "Ne zaman durmalı?"], rows: [["Kuru toz ve gevşek kir", "Uygun süet/nubuk fırçasıyla hafifçe temizle.", "Yüzeyde belirgin tüy kaybı veya renk değişimi olursa."], ["Yağmurdan ıslanmış yüzey", "Doğrudan ısı uygulamadan kurumasını bekle.", "Kurutmayı hızlandırmak için sıcak hava verme."], ["Yağ, eski leke veya önceki ürün izi", "Lekenin ve kullanılan ürünün bilgisini not et.", "Malzemeye uygun yöntemden emin değilsen değerlendirme iste."]] }, sourceIds: ["nikeSuede", "clarks"] },
      { id: "firca", title: "Fırçalama bir güç testi değil", paragraphs: ["Nike’ın süet bakım rehberi ve Clarks’ın bakım önerileri, gevşek kuru kiri nazikçe almaya odaklanır. Önce hafif basınçla küçük bir bölümde çalış. Sertçe bastırarak bütün yüzeyi aynı anda ovalamak yerine değişimi gözleyerek ilerle.", "Fırçanın temiz olması da önemli: tabanda kullandığın kirli aleti hassas üst yüzeye taşımamaya dikkat et. Ürünün süet veya nubuk için açıkça uygun olduğunu kontrol et; “deri temizleyici” yazması tek başına yeterli açıklama olmayabilir."], sourceIds: ["nikeSuede", "clarks"] },
      { id: "leke", title: "Leke kalırsa yöntemi üst üste ekleme", paragraphs: ["Kuru bakım sonrasında iz kaldığında sırayla deterjan, sirke ve başka karışımlar denemek değerlendirmeyi zorlaştırır. Ne sürdüğünü, ne kadar beklettiğini ve ayakkabının o sırada ıslak olup olmadığını kaydet. Bu bilgi, dükkânda sorunu anlamamıza yardımcı olur.", "Özellikle açık renkli ve karışık yüzeyli modellerde ayakkabının tamamının fotoğrafını da paylaş. Yakın plandaki bir leke, doku ve rengin genel durumunu tek başına göstermez."] },
      { id: "dukkanda", title: "Temizlik, renk yenileme ve onarım ayrı işler", paragraphs: ["Süet ve nubuk temizliği, mevcut kir ve lekelerin malzemeye uygun biçimde ele alınmasıdır. Solan rengi yeniden boyamak, yıpranmış havı onarmak veya kopmuş parçayı tamir etmekle aynı işlem değildir.", "Bakırköy’de ayakkabıyı görerek yapılabilecek temizliği ve sınırlarını konuşabiliriz. Eski lekeye veya yıpranmış yüzeye bakmadan kusursuz sonuç ve sabit teslim süresi vermiyoruz. İşlem öncesi beklentiyi birlikte netleştirmek en faydalı başlangıçtır."] },
    ],
    faqs: [
      { q: "Süet ayakkabı ıslak bezle silinir mi?", a: "Bütün süetlere ortak bir ıslak silme tarifi vermek doğru olmaz. Önce üretici talimatını izle; hassas dokuyu suya boğmadan, uygun ürün ve küçük alan testiyle değerlendir." },
      { q: "Nubukta deri kremi kullanabilir miyim?", a: "Düz deri için satılan kremi nubukta otomatik olarak kullanma. Ürünün nubuk için uygunluğunu ve ayakkabının bakım talimatını kontrol et." },
      { q: "Eski süet lekesi tamamen çıkar mı?", a: "Lekenin türüne, önceki işlemlere ve yüzeyin durumuna göre değişir. Tamamen çıkacağı önceden garanti edilemez." },
    ],
    related: ["ayakkabi-makinede-yikanir-mi", "ayakkabi-nasil-kurutulur"],
    service: { href: "/suet-nubuk-temizleme", label: "Bakırköy’de süet ve nubuk temizleme" },
    sourceIds: ["nikeSuede", "clarks"],
  },
  {
    slug: "ayakkabi-kokusu-nasil-giderilir",
    updated: "2026-10-12",
    title: "Ayakkabı kokusu nasıl giderilir?",
    description: "Kokuyu parfümle örtmek yerine nem, tabanlık ve kuruma durumunu kontrol et. Malzemeye uygun temizlik ve tekrar kullanmadan önce yapılacaklar.",
    category: "Ayakkabı",
    answer: "Ayakkabı kokusunda önce nemi ve iç yüzeyin durumunu kontrol et. Çıkarılabilir tabanlığı kendi talimatına göre temizle; ayakkabının içi tamamen kurumadan yeniden giyme veya kapalı dolaba kaldırma. Koku giderici sprey, uygun temizliğin ve kurutmanın yerine geçmez.",
    sections: [
      { id: "nereden", title: "Önce kokunun nerede kaldığını bul", paragraphs: ["Nike’ın koku rehberi, ayakkabıda biriken ter ve nemin rolünü vurgular. Dış yüzeyi temiz görünen bir çiftin içi hâlâ nemli olabilir. Sadece dışını silmiş olmak, iç bakımın da tamamlandığı anlamına gelmez.", "Çıkarılabilen tabanlığı ayrı kontrol et; yapışık tabanlığı zorlayarak sökme. Bir ayakkabı diğerinden farklı kokuyorsa bunu da not et. Daha önce yıkandıysa nasıl kurutulduğunu bilmek, sorunu yalnız “kirli ayakkabı” diye adlandırmaktan daha faydalıdır."], sourceIds: ["nikeOdor"] },
      { id: "kontrol", title: "Temizlikten önce ve sonra kontrol listesi", steps: ["Malzemeyi ve bakım talimatını belirle. Ayakkabıyı çamaşır makinesine atma.", "Çıkarılabilen parçaları ayır; her parça için uygun temizlik talimatını izle.", "Temizlik sonrasında dil ve iç kısım dahil kuruma durumunu kontrol et. Dış yüzeyin kuru olması tek başına yeterli değildir.", "Tam kuruduktan sonra kullan. Tekrar nemlenen ayakkabıya havalanması için zaman tanı; nemli biçimde kapalı çantaya kaldırma."], sourceIds: ["nikeOdor"] },
      { id: "sprey", title: "Sprey seçmeden önce neye bakmalı?", paragraphs: ["Ürünün ayakkabının iç yüzeyine ve malzemesine uygun olduğunu, nasıl uygulanacağını ve kuruma talimatını oku. Güçlü bir koku, sorunun çözüldüğünü göstermez. Birbiri ardına farklı ürünler uygulamak yerine ilk ürünün talimatını ve sonucunu değerlendir.", "Buradaki bakım önerileri dezenfeksiyon veya sağlık tedavisi iddiası taşımaz. Koku giderme hizmetini, ayakkabının tamamen steril hale gelmesiyle eş tutma."] },
      { id: "degerlendirme", title: "Dükkâna getirirken bu bilgileri paylaş", paragraphs: ["Ayakkabı ne zaman ıslandı veya temizlendi? Tabanlığı çıkıyor mu? Hangi ürünü kullandın? Kokuyla birlikte görünen bir leke ya da yüzey hasarı var mı? Bu kısa bilgiler, yalnız tek bir dış yüzey fotoğrafından daha açıklayıcıdır.", "Temizlik sonrası sonuç ayakkabının durumuna göre değişebilir. Kalıcı kokuya kesin çözüm sözü vermeden önce iç yüzeyi ve bakım geçmişini değerlendirelim."], table: { caption: "Fotoğrafa eklemen yararlı olan bilgiler", headings: ["Bilgi", "Örnek"], rows: [["Son işlem", "Evde yıkandı; doğal biçimde / makinede kurutuldu."], ["Kullanılan ürün", "Ürün adı veya etiketi; karışım yapıldıysa içeriği."], ["Mevcut durum", "İçi hâlâ nemli; tabanlık çıkıyor / çıkmıyor."]] } },
    ],
    faqs: [
      { q: "Sadece parfüm sıkmak yeterli mi?", a: "Kokuyu geçici olarak örtebilir ama temizlik veya kurutma yerine geçmez. Önce iç yüzeyin nem ve bakım durumunu değerlendir." },
      { q: "Koku tamamen ve kalıcı olarak gider mi?", a: "Her ayakkabı için böyle bir garanti verilemez. Malzeme, tabanlık, eski işlemler ve sonraki kullanım sonucu etkiler." },
    ],
    related: ["ayakkabi-nasil-kurutulur", "ayakkabi-makinede-yikanir-mi"],
    service: { href: "/ayakkabi-temizleme", label: "Ayakkabı temizleme ve değerlendirme" },
    sourceIds: ["nikeOdor"],
  },
  {
    slug: "ayakkabi-nasil-kurutulur",
    updated: "2026-10-12",
    title: "Ayakkabı nasıl kurutulur?",
    description: "Islak ayakkabıda doğrudan ısı yerine kontrollü kurutma. Tabanlık, hava dolaşımı ve tamamen kuruduğunu anlamak için pratik kontroller.",
    category: "Ayakkabı",
    answer: "Üreticinin talimatını izleyerek ayakkabıyı hava alan bir yerde kurut. Çıkarılabilen tabanlığı ve bağcıkları ayır; doğrudan kalorifer, saç kurutma makinesi veya yoğun ısı uygulama. Ayakkabının dışı kadar dilinin, burun içinin ve tabanlık altının da kurumasını bekle.",
    sections: [
      { id: "hazirlik", title: "Kurutmadan önce ayakkabıyı hazırla", steps: ["Üreticinin kurutma talimatını kontrol et. Isıya izin verildiğini varsayma.", "Çıkarılabilen tabanlığı ve bağcıkları ayır; yapışık parçaları zorlamadan dili açık bırak.", "Fazla nemi bastırmadan, malzemeye uygun temiz bir bezle al. Formu zorlayacak biçimde sıkıştırma.", "Hava dolaşımı olan yerde beklet. Gerekirse ısıtıcı yerine ortam havasını dolaştıran bir fan kullan."], sourceIds: ["nikeDry"] },
      { id: "sure", title: "Kaç saatte kurur?", paragraphs: ["Tek bir saat vermek doğru olmaz. Islaklık miktarı, astar, tabanlık ve ortam koşulları farklıdır. Bir çiftin bir gecede kuruması, başka bir modelin de aynı sürede hazır olacağı anlamına gelmez.", "Dükkânda da teslim zamanını yalnız çalışma saatine bakarak belirlemiyoruz. Ayakkabının durumunu ve işlem ihtiyacını birlikte değerlendirmek gerekir. Bir etkinlik veya yolculuk için belirli saate ihtiyacın varsa bunu baştan söyle."] },
      { id: "isi", title: "Kurutma makinesi ve kalorifer neden ortak çözüm değil?", paragraphs: ["Nike, kurutucudaki ısının ayakkabının yapısını etkileyebileceğini belirtir ve fanla ya da emici kâğıtla kurutma seçeneklerini anlatır. Ayakkabıyı kurutma makinesine atma; güçlü ısıyı bir hızlandırma yöntemi olarak seçme.", "Kâğıt kullanıyorsan renk aktarabilecek baskılı kısımların hassas yüzeye temasını önle; nemlenen kâğıdı değiştir. Ayakkabıyı gereğinden fazla doldurarak şeklini zorlamamak gerekir."], sourceIds: ["nikeDry"] },
      { id: "son-kontrol", title: "Giyebilmeden önce son kontrol", table: { caption: "Dışarıdan kuru görünmek yeterli değil", headings: ["Bölge", "Kontrol"], rows: [["Burun içi ve dil", "İç yüzeyde nem kaldı mı?"], ["Tabanlık ve altı", "Ayrı parçalar tamamen kurudu mu?"], ["Yapışma ve yüzey", "Öncesine göre açılma veya şekil değişimi var mı?"], ["Saklama", "Nemli biçimde poşete veya kapalı çantaya koyuyor musun?"]] }, paragraphs: ["Yeni bir şekil kaybı ya da açılma fark edersen daha fazla ısı uygulama. Fotoğrafını çekip değerlendirme iste; kurutma işlemi mevcut bir hasarı onarmaz."] },
    ],
    faqs: [
      { q: "Saç kurutma makinesiyle kurutabilir miyim?", a: "Doğrudan sıcak hava, her malzemeye uygun değildir. Üretici talimatı izin vermedikçe bunu genel bir yöntem olarak kullanma." },
      { q: "Bir gecede kesin kurur mu?", a: "Hayır. Malzeme, ıslaklık ve ortam koşullarına göre değişir. İç kısımları kontrol etmeden yalnız geçen süreye güvenme." },
    ],
    related: ["ayakkabi-kokusu-nasil-giderilir", "suet-nubuk-ayakkabi-nasil-temizlenir"],
    service: { href: "/sneaker-yikama", label: "Sneaker temizliği ve teslim bilgisi" },
    sourceIds: ["nikeDry"],
  },
  {
    slug: "yikama-sembolleri",
    title: "Yıkama sembolleri ne anlama gelir?",
    description: "Bakım etiketindeki yıkama, ağartma, kurutma, ütü ve profesyonel temizlik işaretlerini okuyarak yöntem seç. Derece, çizgi ve çarpı açıklamaları.",
    category: "Tekstil",
    answer: "Bakım etiketini tek bir işaretten değil, bütün talimatlardan oku. Leğen içindeki sayı en yüksek yıkama sıcaklığını, alt çizgiler daha hassas işlemi belirtir. Üzerine çarpı konmuş işlem uygulanmaz. Yıkama izni, ağartma, kurutma makinesi veya ütü izniyle aynı şey değildir.",
    sections: [
      { id: "bes-grup", title: "Etiketteki beş işlem grubu", table: { caption: "GINETEX bakım işaretlerinin metinle açıklaması", headings: ["Şekil", "Hangi işlemi anlatır?", "Neye bakmalısın?"], rows: [["Leğen", "Yıkama", "Sayı, alt çizgi, el veya çarpı."], ["Üçgen", "Ağartma", "Ağartıcıya izin verilip verilmediği."], ["Kare", "Kurutma", "Doğal kurutma mı, tamburlu kurutma mı?"], ["Ütü", "Ütüleme", "Isı ve varsa buhar kısıtlaması."], ["Daire", "Profesyonel tekstil bakımı", "İşlem türünü gösteren harf ve çizgiler."]] }, sourceIds: ["ginetex"] },
      { id: "derece-cizgi", title: "Sayı bir hedef değil, üst sınırdır", paragraphs: ["Leğen içindeki 40 sayısı sıcaklığın 40 °C’yi aşmaması gerektiğini anlatır. Altındaki çizgi işlemin hassasiyetini değiştirir. Bu yüzden yalnız dereceyi kopyalayıp sıkma ve programı rastgele seçmek, etiketi bütünüyle uygulamak değildir.", "Ev tipi makinenin program adları birbirinden farklı olabilir. “Hassas” yazan bir düğmenin ne yaptığını makinenin kullanım kılavuzundan kontrol et. Etiket okunmuyorsa kumaş adından yola çıkarak sıcaklık uydurma."], sourceIds: ["ginetex"] },
      { id: "ornek", title: "Bir gömleğin etiketini nasıl okursun?", steps: ["Yıkamaya izin var mı? Önce leğen grubuna bak.", "Varsa sıcaklık üst sınırını ve hassas işlem koşulunu birlikte not et.", "Ağartma, kurutma ve ütü işaretlerini ayrı ayrı kontrol et.", "Daire grubunu profesyonel bakım seçeneği için oku; yıkama izniyle karıştırma."], paragraphs: ["Örneğin yıkamaya izin verilen bir giyside kurutma makinesi yasak olabilir. Bu çelişki değildir; iki ayrı aşama için iki ayrı sınırdır. Sökülebilir aksesuar ve astar gibi parçalar varsa ürünün ek bakım metnini de oku."] },
      { id: "etiket-yok", title: "Etiket eksikse veya silinmişse", paragraphs: ["Ürünün modelini ve üreticinin bakım sayfasını ara. Eski bir sipariş kaydı veya ürün etiketi fotoğrafı yardımcı olabilir. Benzer görünen başka bir ürünün talimatını birebir kopyalamak yerine kesin bilgiyi bulmaya çalış.", "Bir bakım talebi iletirken etiketin tamamını, ürünün genelini ve lekeyi ayrı fotoğraflarla göster. Etikette izin verilmeyen bir işlem için, yalnız lekenin zor görünmesi nedeniyle daha sert yönteme geçme."] },
    ],
    faqs: [
      { q: "Etikette 30 yazıyorsa 40 derecede yıkanır mı?", a: "Etiketteki sayı maksimum sıcaklığı gösterir. Daha yüksek sıcaklığı kendiliğinden güvenli kabul etme." },
      { q: "Kuru temizleme işareti makinede yıkama izni midir?", a: "Hayır. Profesyonel bakım ile evde yıkama ayrı işlem gruplarıdır; etiketteki bütün talimatları birlikte oku." },
    ],
    related: ["gomlek-nasil-utulenir", "kuru-temizleme-nedir", "yorgan-nasil-yikanir"],
    sourceIds: ["ginetex"],
  },
  {
    slug: "kuru-temizleme-nedir",
    title: "Kuru temizleme nedir, yıkamadan farkı ne?",
    description: "Kuru temizleme, profesyonel ıslak temizleme ve evde yıkama arasındaki fark. Kumaş adından önce etikete bakmayı sağlayan kısa karar rehberi.",
    category: "Tekstil",
    answer: "Kuru temizleme, evdeki su ve deterjanla yıkamadan farklı bir profesyonel tekstil bakım işlemidir; “hiç sıvı kullanılmaz” anlamına gelmez. Bir giysinin uygun yöntemi yalnız kumaş adına bakılarak seçilmez. Üreticinin bakım etiketi, astar ve parçalarla birlikte değerlendirilmelidir.",
    sections: [
      { id: "fark", title: "Üç farklı bakım yolu", table: { caption: "Etiketteki işlemleri birbirine karıştırma", headings: ["İşlem", "Karar için gereken bilgi"], rows: [["Evde yıkama", "Yıkama grubundaki izin, sıcaklık ve hassasiyet talimatı."], ["Kuru temizleme", "Profesyonel bakım grubundaki uygun işlem bilgisi."], ["Profesyonel ıslak temizleme", "Su kullanılsa da evde yıkamadan ayrı profesyonel bakım talimatı."]] }, paragraphs: ["GINETEX, profesyonel bakımı kendi işaret grubunda gösterir. Bu ayrım, “su değebilir mi?” sorusunun tek başına yeterli olmadığını anlatır. Bir işlemin profesyonel ortamda uygun olması, evdeki makinede de aynı sonucu vereceği anlamına gelmez."], sourceIds: ["ginetex"] },
      { id: "yunun-durumu", title: "Yün olan her ürün aynı şekilde temizlenmez", paragraphs: ["Woolmark, yünlü ürünlerde bakım etiketine göre hareket etmeyi önerir. Makinede yıkanabilir, elde yıkanabilir veya yalnız kuru temizlemeye uygun ürünleri tek başlık altında toplamak doğru olmaz.", "Yalnız kumaş içeriğinin fotoğrafı yerine bakım etiketinin tümünü görmek gerekir. Ürün modeli, astar ve aksesuar bilgisi de kararın parçasıdır. Etiket silinmişse markanın güncel ürün veya destek sayfasına bak."], sourceIds: ["woolmark"] },
      { id: "leke", title: "Temizliğe vermeden önce ne söylemelisin?", steps: ["Lekenin ne zaman oluştuğunu ve mümkünse kaynağını belirt.", "Evde denediğin ürün ve işlemleri açıkça paylaş.", "Düğme, süs, astar veya dikişte mevcut hasar varsa göster.", "Ücretin hangi işleme ait olduğunu ve teslim tarihini kabulden önce netleştir."], paragraphs: ["Bir lekenin çıkma ihtimaliyle giysinin genel bakım ihtiyacı ayrı konulardır. “Kuru temizleme her lekeyi çıkarır” diye düşünmek yerine, sonucu etkileyen sınırları baştan konuşmak daha yararlıdır."] },
      { id: "hizmet", title: "Hizmet seçmeden önce uygunluğu kontrol et", paragraphs: ["Bu sayfa bakım yöntemlerini açıklayan bir rehberdir. Yıkat Gitsin uygulamasında hizmetler adrese göre görüntülenir; bir rehberin yayımlanması, her bölgede o hizmetin açık olduğu anlamına gelmez. Sipariş vermeden veya ürünü taşımadan önce güncel uygunluğu kontrol et.", "Bakırköy dükkânında doğrulanmış ayakkabı temizleme ve bakım seçeneklerini ayrı hizmet sayfalarında bulabilirsin. Tekstil ürünü için kabul koşullarını önceden WhatsApp’tan sor."] },
    ],
    faqs: [
      { q: "Kuru temizleme her lekeyi çıkarır mı?", a: "Hayır. Leke türü, bekleme süresi, malzeme ve daha önce uygulanan işlemler sonucu etkiler. İşlem öncesi değerlendirme gerekir." },
      { q: "Takım elbiseyi yalnız kumaş yüzdesine bakarak yıkayabilir miyim?", a: "Yöntemi yalnız kumaş yüzdesiyle seçme. Bakım etiketi ve ürünün bütün yapısı birlikte değerlendirilmelidir." },
    ],
    related: ["yikama-sembolleri", "yorgan-nasil-yikanir"],
    sourceIds: ["ginetex", "woolmark"],
  },
  {
    slug: "yorgan-nasil-yikanir",
    title: "Yorgan nasıl yıkanır?",
    description: "Yorganın dolgusunu, bakım etiketini ve makine kapasitesini birlikte kontrol et. Yün, kuş tüyü ve sentetik dolguda tek bir dereceye güvenme.",
    category: "Tekstil",
    answer: "Yorganı yıkamadan önce bakım etiketini, dolgu türünü ve makinenin o ürün için kapasitesini kontrol et. Her yorgan aynı sıcaklıkta veya programda yıkanmaz. Yıkama kadar dolgunun tamamen kuruması da önemlidir; etiketteki kurutma talimatını ayrıca oku.",
    sections: [
      { id: "etiket", title: "Nevresimin değil, yorganın etiketini oku", paragraphs: ["Nevresim ve içindeki yorgan iki farklı üründür. Kılıfın talimatı dolgulu ürün için geçerli olmayabilir. Önce yorganın kendi etiketindeki yıkama ve kurutma koşullarını bul.", "IKEA’nın yorgan bakım rehberi de ürün etiketini temel alır. Bir markanın belirli dolgular için verdiği sıcaklığı başka bir markanın veya başka bir dolgunun bütün ürünlerine uygulama."], sourceIds: ["ikeaDuvet"] },
      { id: "dolgu", title: "Dolgu adını bilmek başlangıçtır", table: { caption: "Aynı ürün grubunda farklı bakım talimatları olabilir", headings: ["Dolgu", "Önce kontrol et"], rows: [["Yün", "Etiket elde yıkama, makine veya profesyonel bakım seçeneklerinden hangisine izin veriyor?"], ["Kuş tüyü / kaz tüyü", "Yıkama ve kurutma için hangi özel koşullar belirtilmiş?"], ["Sentetik dolgu", "Ürünün kendi sıcaklık, program ve kurutma sınırları ne?"], ["Belirsiz veya etiketsiz", "Model bilgisi üreticiden bulunabiliyor mu?"]] }, paragraphs: ["“Yünlü” veya “elyaf” kelimesi tek başına bir makine ayarı değildir. Kumaş, dolgu ve dikiş yapısını bir ürün olarak değerlendirmek gerekir."], sourceIds: ["woolmark", "ikeaDuvet"] },
      { id: "kapasite", title: "Makineye sığması yeterli ölçüt mü?", paragraphs: ["Yorganın tambura fiziksel olarak girmesi, üreticinin kapasite ve program koşullarını karşıladığını göstermez. Makinenin kullanım kılavuzunda yorgan veya hacimli ürünler için belirtilen sınırlara bak.", "Yıkama ve kurutmayı birlikte planla. Ürünün izin verdiği kurutma yöntemi evde uygulanamıyorsa, yıkamaya başladıktan sonra çözüm aramak yerine önceden uygun bakım seçeneğini netleştir."] },
      { id: "sirayla", title: "Başlamadan önce kısa kontrol", steps: ["Yorganın kendi bakım etiketini ve dolgu bilgisini bul; nevresimi ayrı değerlendir.", "Dikişlerde açılma veya dolgu çıkışı olup olmadığını kontrol et.", "Yıkama ve kurutma talimatının ikisini de uygulayabildiğinden emin ol.", "Tam kurumadan katlayıp poşete veya dolaba kaldırma. Bakım talebinde dolgu, ölçü ve etiket fotoğrafını paylaş."], paragraphs: ["Bu bir bakım rehberidir; belirli bir bölgede yorgan teslim alındığı anlamına gelmez. Ürünü dükkâna taşımadan veya uygulamadan sipariş planlamadan önce güncel hizmet uygunluğunu sor."] },
    ],
    faqs: [
      { q: "Her yorgan 60 derecede yıkanır mı?", a: "Hayır. Ürünlerin bakım talimatları farklıdır. Kendi yorganının etiketi izin vermedikçe 60 dereceyi genel kural kabul etme." },
      { q: "Yorganı kurutma makinesine koyabilir miyim?", a: "Yıkama izni, kurutma makinesi izni anlamına gelmez. Etiketteki kurutma koşullarını ve makinenin kapasite talimatını ayrıca kontrol et." },
    ],
    related: ["yikama-sembolleri", "kuru-temizleme-nedir"],
    sourceIds: ["ikeaDuvet", "woolmark"],
  },
  {
    "slug": "spor-ayakkabi-nasil-temizlenir",
    "updated": "2026-10-12",
    "title": "Spor ayakkabı nasıl temizlenir?",
    "description": "Spor ayakkabının üst yüzeyi, tabanı, bağcığı ve tabanlığı için ayrı bakım kararları. Evde temizlik sırası ve durup değerlendirme istemen gereken durumlar.",
    "category": "Ayakkabı",
    "answer": "Spor ayakkabını temizlemeden önce modelini ve malzemesini kontrol et. Gevşek kiri yumuşak, kuru bir fırçayla al; üreticinin uygun gördüğü temizleyiciyle küçük bir alanı dene. Üst yüzeyi, dış tabanı ve çıkarılabilen parçaları ayrı ele al. Temizliğin ardından içi ve dışı tamamen kurumadan giyme.",
    "sections": [
      {
        "id": "parcalar",
        "title": "Bir çift ayakkabıda dört farklı bakım alanı",
        "paragraphs": [
          "Spor ayakkabı bir kullanım adı; tek bir malzeme adı değil. Koşu ayakkabısındaki file, günlük sneaker’daki deri panel ve süet detay aynı ürüne farklı tepki verebilir. Önce hangi parçaya dokunacağını belirlemek, bütün ayakkabıya tek işlem uygulamaktan daha açıklayıcı bir başlangıçtır."
        ],
        "table": {
          "caption": "İşleme başlamadan parçaları ayır",
          "headings": [
            "Bölge",
            "İlk kontrol",
            "Yöntem seçerken"
          ],
          "rows": [
            [
              "Üst yüzey",
              "Kumaş, mesh, deri, süet veya karışım mı?",
              "En hassas detayı da hesaba kat."
            ],
            [
              "Dış taban",
              "Oluklarda yüzey kiri mi, malzemede aşınma mı var?",
              "Tabandaki kirli fırçayı üst yüzeye taşıma."
            ],
            [
              "Bağcık",
              "Çıkarılabiliyor mu, renkli mi?",
              "Renk ve malzemesine uygun ayrı bakım seç."
            ],
            [
              "Tabanlık ve iç yüzey",
              "Tabanlık çıkarılabiliyor mu?",
              "Yapışık parçayı zorlamadan kendi talimatını izle."
            ]
          ]
        }
      },
      {
        "id": "elle-temizlik",
        "title": "Elle temizlik için uygulanabilir sıra",
        "steps": [
          "Bakım talimatını bul; bağcıkları ve yalnız çıkarılmaya uygun tabanlığı ayır.",
          "Gevşek kiri kuru ve yumuşak bir fırçayla al.",
          "Modelin izin verdiği temizleyiciyi görünmeyen küçük bir noktada dene; renk veya doku değişirse dur.",
          "Dış tabanı ve üst yüzeyi ayrı araçlarla, malzemeye uygun biçimde temizle. Ayakkabıyı gereksiz yere suya doyurma.",
          "Ürün talimatına göre kalıntıyı al; parçaları havalanan bir yerde tamamen kurut."
        ],
        "paragraphs": [
          "Nike’ın genel rehberi parçaları ayrı temizlemeyi anlatır. adidas’ın örneği ise deri üst yüzeyli Superstar modelidir. Kaynakta gösterilen fırçayı, ürünü veya baskıyı farklı malzemeye sahip bir modele otomatik olarak uygulama."
        ],
        "sourceIds": [
          "nikeClean",
          "adidasLeather"
        ]
      },
      {
        "id": "durma-noktasi",
        "title": "Ne zaman daha fazla ovalamamalısın?",
        "paragraphs": [
          "Bezde ayakkabının kendi rengini görüyorsan, yüzey kabarıyorsa veya taban bağlantısı açılıyorsa işlemi artırma. Önce ne kullandığını ve nerede değişiklik gördüğünü kaydet. Aynı iz üzerinde art arda farklı ürün denemek, sonradan yapılacak değerlendirmeyi zorlaştırır.",
          "Temizlikten sonra kalan her iz kir değildir. Çizik, baskı kaybı, taban aşınması ve eski bir tamir ayrı konulardır. Daha sert temizlikle düzeleceğini varsayma."
        ]
      },
      {
        "id": "degerlendirme",
        "title": "Profesyonel değerlendirme için ne paylaşmalısın?",
        "paragraphs": [
          "Ayakkabının genel fotoğrafı, sorunlu bölgenin yakını ve varsa model etiketi iyi bir başlangıç. Son uyguladığın ürünü, ayakkabının ıslanıp ıslanmadığını ve belirli bir teslim tarihine ihtiyacın olup olmadığını ekle.",
          "Bakırköy dükkânında bu bilgilerle işlem kapsamını, güncel ücreti ve teslim uygunluğunu birlikte netleştirelim. Temizlik talebini onarım veya renk yenileme talebiyle karıştırmamak, beklentinin baştan anlaşılmasını sağlar."
        ]
      }
    ],
    "faqs": [
      {
        "q": "Spor ayakkabı makinede yıkanır mı?",
        "a": "Hayır, çamaşır makinesine atma. Spor ayakkabı olması veya makinede özel program bulunması bunu değiştirmez; tambur, su ve sıkma yapıştırıcıyı, tabanı ve formu yıpratabilir."
      },
      {
        "q": "Her kullanımdan sonra yıkamak gerekir mi?",
        "a": "Takvime göre bütün ayakkabıyı yıkamak yerine kir, nem ve üreticinin bakım talimatına göre karar ver. Küçük bir yüzey kiri ile içi tamamen ıslanmış ayakkabı aynı ihtiyaç değildir."
      }
    ],
    "related": [
      "ayakkabi-makinede-yikanir-mi",
      "beyaz-ayakkabi-nasil-temizlenir",
      "ayakkabi-nasil-kurutulur"
    ],
    "service": {
      "href": "/sneaker-yikama",
      "label": "Bakırköy’de sneaker ve spor ayakkabı temizleme"
    },
    "sourceIds": [
      "nikeClean",
      "adidasLeather"
    ]
  },
  {
    "slug": "deri-ayakkabi-nasil-temizlenir",
    "title": "Deri ayakkabı nasıl temizlenir?",
    "description": "Düz deri, rugan ve süeti ayırarak bakım seç. Kuru kirin alınması, uygun ürün seçimi, kurutma ve temizlikle onarım arasındaki fark.",
    "category": "Ayakkabı",
    "answer": "Deri ayakkabıda önce yüzey türünü belirle. Düz deride gevşek kiri yumuşak bir fırça veya bezle al; yalnız o yüzey için uygun temizleyici ve bakım ürününü talimatına göre kullan. Küçük bir alanda deneme yap, ayakkabıyı suya doyurma ve doğrudan ısıyla kurutma. Süet ve nubuk için ayrı yönteme geç.",
    "sections": [
      {
        "id": "yuzey",
        "title": "Deri kelimesi tek bir bakım yöntemi seçtirmez",
        "table": {
          "caption": "Ürünü seçmeden yüzeyi tanımla",
          "headings": [
            "Yüzey",
            "Bakım kararı",
            "Karıştırma"
          ],
          "rows": [
            [
              "Düz deri",
              "Modelin önerdiği deri temizleyici ve bakım ürününü araştır.",
              "Temizleyici, bakım kremi ve renkli cila aynı ürün değildir."
            ],
            [
              "Rugan / özel kaplama",
              "Ürünün bu yüzey için açıkça uygun olduğunu doğrula.",
              "Düz deri kremi her kaplamaya uygun olmayabilir."
            ],
            [
              "Süet / nubuk",
              "Bu dokuya ayrılmış fırça ve ürünleri değerlendir.",
              "Parlak deri cilasını havlı yüzeye uygulama."
            ],
            [
              "Belirsiz / karışık malzeme",
              "Model bilgisi veya üreticinin desteğiyle netleştir.",
              "Görünüşünden gerçek deri veya aynı kaplama olduğunu varsayma."
            ]
          ]
        },
        "sourceIds": [
          "clarks"
        ]
      },
      {
        "id": "sira",
        "title": "Temizlik, bakım ve parlatmayı ayır",
        "steps": [
          "Ayakkabının kuru, gevşek kirini yumuşak araçla al.",
          "Yüzeye uygun temizleyicinin uygulama ve kalıntı alma talimatını oku; küçük alanda dene.",
          "Temizliği kontrollü biçimde uygula. Kirin çıkmadığı yerde basıncı artırmadan önce lekenin ne olduğunu değerlendir.",
          "Doğal kuruma için zaman bırak; kalorifer veya saç kurutma makinesiyle hızlandırma.",
          "Yüzey ve üretici uygun görüyorsa bakım veya parlatma aşamasını ayrıca seç. Renkli ürünün rengine ve kapsamına dikkat et."
        ],
        "paragraphs": [
          "Clarks’ın deri rehberi temizlik, bakım ve parlatmayı ayrı aşamalar olarak ele alır. Bu sırayı, her ayakkabıya aynı kremi sürme talimatı olarak okumamak gerekir. Özel yüzeyler için ürünün kendi kapsamını kontrol et."
        ],
        "sourceIds": [
          "clarksCare"
        ]
      },
      {
        "id": "izler",
        "title": "Kir, renk kaybı ve çatlak farklı sorunlardır",
        "paragraphs": [
          "Bir ayakkabıda yüzey kiriyle birlikte boya kaybı veya çatlak bulunabilir. Kirin alınması, eksilen rengin ya da hasarlı yüzeyin kendiliğinden onarılacağı anlamına gelmez. İşlem öncesi ve sonrası beklentiyi bu ayrımla değerlendir.",
          "Krem veya cila sürdükten sonra belirginleşen bir izi daha fazla ürünle kapatmaya çalışmadan önce kullanılan ürünün adını not et. Değerlendirme isterken temizliği mi, görünüm yenilemeyi mi beklediğini açıkça anlat."
        ]
      },
      {
        "id": "dukkan",
        "title": "Dükkâna getirirken bakım geçmişini paylaş",
        "paragraphs": [
          "Daha önce sürülen boya, krem veya temizleyici; ayakkabının ıslanması; mevcut tamirler ve bekleyen lekeler değerlendirmeye yardımcı olur. Genel fotoğrafın yanında yakın plan ve model bilgisi de paylaşabilirsin.",
          "Bakırköy’deki deri ayakkabı hizmetimiz temizlik ve bakım içindir. Boyama, taban değişimi veya restorasyon yapılacağını bu rehberden çıkarma; ihtiyacın olan işlemi kabulden önce netleştirelim."
        ]
      }
    ],
    "faqs": [
      {
        "q": "Deri ayakkabıyı ıslak mendille silebilir miyim?",
        "a": "Islak mendilin içeriği ve derinin yüzeyi değişir; bütün ürünler için uygun kabul etme. Ayakkabının üreticisinin önerdiği yöntemi ve o yüzey için hazırlanmış ürün talimatını izle."
      },
      {
        "q": "Çatlamış deri bakım kremiyle tamamen düzelir mi?",
        "a": "Bakım, hasarlı yüzeyin tamamen onarılması anlamına gelmez. Çatlak veya soyulmayı görmeden yenileme sözü verilmemeli."
      }
    ],
    "related": [
      "suet-nubuk-ayakkabi-nasil-temizlenir",
      "ayakkabi-nasil-kurutulur"
    ],
    "service": {
      "href": "/deri-ayakkabi-bakimi",
      "label": "Bakırköy’de deri ayakkabı temizliği ve bakımı"
    },
    "sourceIds": [
      "clarksCare",
      "clarks"
    ]
  },
  {
    "slug": "gomlek-nasil-utulenir",
    "title": "Gömlek nasıl ütülenir?",
    "description": "Bakım etiketinden yaka, manşet ve gövde sırasına: gömlek ütülerken sıcaklığı seç, yeni kırışıklık oluşturmadan ilerle ve kumaşın sınırlarını koru.",
    "category": "Tekstil",
    "answer": "Önce gömleğin bakım etiketindeki ütü ve buhar koşullarını kontrol et. Düğmeleri açıp kumaşı düz yerleştir; yaka, manşet, kol ve omuz gibi küçük bölümlerden sonra ön ve arka gövdeye geç. Ütülediğin yüzeyi yeniden buruşturmadan ilerle; bitince gömleği askıda soğumaya bırak.",
    "sections": [
      {
        "id": "etiket",
        "title": "Sıcaklığı yalnız kumaş adına göre seçme",
        "paragraphs": [
          "Pamuklu görünüm, etiket yerine geçmez. Karışım oranı, kaplama, baskı ve süsler bakım kararını değiştirebilir. Ütünün ayar adını gömleğin talimatıyla birlikte kontrol et; başka bir gömleğin ayarını otomatik olarak kullanma."
        ],
        "table": {
          "caption": "Ütüye başlamadan etiket kontrolü",
          "headings": [
            "Etikette gördüğün",
            "Ne yapmalısın?"
          ],
          "rows": [
            [
              "Üzeri çizili ütü",
              "Ütüleme uygulama."
            ],
            [
              "Noktalı ütü",
              "Gösterilen ısı sınırını ütünün kılavuzuyla eşleştir."
            ],
            [
              "Buhar kısıtlaması",
              "Buharı ayrıca değerlendir; ütü izniyle aynı şey değildir."
            ],
            [
              "Okunmayan etiket",
              "Üreticinin model bilgisini bulmadan rastgele yüksek ısı seçme."
            ]
          ]
        },
        "sourceIds": [
          "ginetexCurrent"
        ]
      },
      {
        "id": "hazirlik",
        "title": "Masayı ve gömleği hazırlarken",
        "paragraphs": [
          "Ütü tabanının ve masa örtüsünün temiz olduğundan emin ol. Suyu ve cihazın bakımını kendi kullanım kılavuzuna göre seç; internetteki bir su tarifini bütün ütülere uygulama. Gömleğin düğmelerini, manşetler dahil, aç ve çalışacağın kısmı masaya düz yerleştir.",
          "Ütülediğin kısmın masadan sarkarken yeniden sıkışmaması için gömleğin kalanını düzenle. Katlanmış iki yüzeyi fark etmeden birlikte bastırmak yerine dikişlerin nerede olduğunu görerek ilerle."
        ],
        "sourceIds": [
          "tefalShirt"
        ]
      },
      {
        "id": "utuleme-sirasi",
        "title": "Yaka ve kollardan gövdeye ilerle",
        "steps": [
          "Yakayı açıp düzleştir; ütülenmesine izin verilen yüzeyi kumaşın talimatına göre ele al.",
          "Manşetleri aç. Düğme ve süslerin üzerinden doğrudan basmak yerine çevresinde kontrollü çalış.",
          "Kolun dikişlerini hizala; istenmeyen bir katı sabitlemeden önce kumaşı düzelt.",
          "Omuz bölümünü masanın ucuna uygun biçimde yerleştir. Küçük alanları tamamla.",
          "Ön parçaları ve sırtı bölümler halinde ütüle; biten yüzeyi yeniden buruşturmamaya dikkat et.",
          "Gömleği askıya alıp soğumasını bekle. Cihazı kapatma ve kaldırma adımlarında kendi kılavuzunu izle."
        ],
        "paragraphs": [
          "Tefal’ın gömlek rehberindeki küçük bölgelerden büyük yüzeylere ilerleme fikrini kullanıyoruz. Aynı yazıdaki genel pamuk sıcaklığını bütün gömlekler için bir derece önerisi olarak aktarmıyoruz; ürünün etiketi önceliklidir."
        ],
        "sourceIds": [
          "tefalShirt"
        ]
      },
      {
        "id": "sorun",
        "title": "İz veya parlama görürsen ısıyı artırma",
        "paragraphs": [
          "Yeni bir iz, renk değişimi veya parlama fark ettiğinde dur. Bunu daha fazla basınç ve ısıyla düzeltmeye çalışmadan önce kumaşın talimatını, tabanın temizliğini ve uyguladığın ayarı kontrol et. Aynı gömleğin gizli bir bölgesindeki uygunluk denemesi bile etiket yasağını geçersiz kılmaz.",
          "Bu sayfa bir bakım rehberidir. Bakırköy dükkânında veya uygulamada ütü hizmetinin açık olduğunu göstermez. Gömlek teslim etmeyi planlıyorsan kabul ve güncel hizmet uygunluğunu önceden sor."
        ]
      }
    ],
    "faqs": [
      {
        "q": "Gömlek kaç derecede ütülenir?",
        "a": "Bütün gömlekler için tek bir sıcaklık yok. Bakım etiketindeki sınırı ve varsa buhar kısıtlamasını, kullandığın ütünün kılavuzuyla birlikte uygula."
      },
      {
        "q": "Gömleği ütüledikten hemen sonra katlayabilir miyim?",
        "a": "Askıda soğumasına zaman bırakmak, yeniden kırışmasını azaltmaya yardımcı olur. Saklamadan önce kumaşın durumunu kontrol et."
      },
      {
        "q": "Bu rehber ütü hizmeti için sipariş sayfası mı?",
        "a": "Hayır, evde bakım hakkında bilgi verir. Tekstil kabulünü, ücretini ve teslim koşullarını hizmet planlamadan önce doğrula."
      }
    ],
    "related": [
      "yikama-sembolleri",
      "kuru-temizleme-nedir"
    ],
    "sourceIds": [
      "tefalShirt",
      "ginetexCurrent"
    ]
  },
]

export const guideBySlug = (slug: string) => careGuides.find(guide => guide.slug === slug)
