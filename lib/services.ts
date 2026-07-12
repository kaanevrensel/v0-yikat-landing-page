// Hizmet sayfaları — tek kaynak. KURALLAR: uydurma iddia yok (süreç ifadeleri sitedeki
// doğrulanmış beyanlarla ve dürüst/temkinli genel bilgilerle sınırlı); "yıkat" kopyada yalnız
// YÜKLEM olarak kullanılır (CLAUDE.md Kopya sesi); fiyat = sahip beyanı genel aralık.
import { siteConfig } from "@/lib/site"

export type ServiceFaq = { q: string; a: string }
export type Service = {
  slug: string
  nav: string
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  heroImg: string
  /** "Evde/kendin yapınca" riskleri — dönüşüm köprüsü, korku pazarlaması değil gerçekler. */
  risks: { title: string; text: string }[]
  steps: { title: string; text: string }[]
  /** Dürüst sınırlar/notlar — E-E-A-T'nin güven ayağı. */
  notes: string[]
  faqs: ServiceFaq[]
  priceCategory: string
}

export const services: Service[] = [
  {
    slug: "sneaker-yikama",
    nav: "Sneaker Yıkama",
    metaTitle: "Sneaker Yıkama Bakırköy — Aynı Gün Teslim | YIKAT",
    metaDescription:
      "Bakırköy'de profesyonel sneaker ve spor ayakkabı yıkama. Kumaş, mesh, karışık malzeme — elde, malzemesine uygun ürünle. Aynı gün teslim, randevusuz.",
    h1: "Sneaker yıkama — makineye atma, ustasına bırak",
    intro:
      "Kumaş, mesh ve karışık malzemeli sneaker'lar dükkânımızda elde, malzemesine uygun ürünlerle yıkanır. Sabah bırak, aynı gün akşam 20:00'ye kadar tertemiz teslim al — randevu gerekmez.",
    heroImg: "/images/services/sneaker-hero.webp",
    risks: [
      {
        title: "Çamaşır makinesi formu bozabilir",
        text: "Sıcak su ve tambur darbesi, sneaker'ın formunu ve taban yapıştırıcısını zorlar; ayrılma ve deformasyon riski gerçektir.",
      },
      {
        title: "Yanlış deterjan rengi soldurur",
        text: "Genel amaçlı deterjanlar kumaş boyasını ve baskıları yıpratabilir; agresif çamaşır suyu sararmayı artırabilir.",
      },
      {
        title: "Yanlış kurutma koku bırakır",
        text: "İçi tam kurumayan ayakkabı nem ve koku tutar; kalorifer/ütü gibi doğrudan ısı ise malzemeyi sertleştirir.",
      },
    ],
    steps: [
      { title: "Ön inceleme", text: "Malzeme ve lekeler tek tek kontrol edilir; yıkama yöntemi ayakkabıya göre seçilir." },
      { title: "Söküm", text: "Bağcık ve tabanlık ayrılır, ayrı temizlenir — kumaşın her noktasına ulaşılır." },
      { title: "Derin temizlik", text: "Malzemesine uygun ürünle elde, suya boğmadan derin yıkama yapılır." },
      { title: "Şekilli kurutma", text: "Form koruyucuyla, doğrudan ısıya tutmadan kurutulur — deformasyon olmaz." },
      { title: "Son kontrol", text: "Bağcıklar takılır, son kontrol yapılır; akşam 20:00'ye kadar teslim." },
    ],
    notes: [
      "Beyaz tabanlardaki sararma çoğu zaman belirgin biçimde açılır; ancak malzemenin yaşına ve durumuna göre sonuç değişebilir — dükkânda görünce net konuşuruz.",
      "Bu hizmet temizlik ve bakım içindir; boya, yenileme veya onarım kapsamda değildir.",
    ],
    faqs: [
      {
        q: "Sneaker çamaşır makinesinde yıkanır mı?",
        a: "Önermiyoruz: sıcak su ve tambur darbesi taban yapıştırıcısını ve formu bozabilir. Dükkânda elde, malzemesine uygun ürünle yıkanır — risk almana gerek yok.",
      },
      {
        q: "Sneaker yıkama aynı gün teslim edilir mi?",
        a: "Evet. Sabah bıraktığın sneaker'ı aynı gün akşam 20:00'ye kadar teslim alırsın.",
      },
      {
        q: "Beyaz sneaker'daki sararma çıkar mı?",
        a: "Çoğu durumda belirgin biçimde açılır; malzemenin durumuna göre değişir. Ayakkabıyı görünce net bilgi veririz.",
      },
      {
        q: "Sneaker yıkama ücreti ne kadar?",
        a: `Kategoriye göre sabit fiyat, ${siteConfig.priceRangeLabel} aralığında. Kesin menü dükkânda.`,
      },
    ],
    priceCategory: "Spor Ayakkabı",
  },
  {
    slug: "suet-nubuk-temizleme",
    nav: "Süet & Nubuk",
    metaTitle: "Süet ve Nubuk Ayakkabı Temizleme Bakırköy | YIKAT",
    metaDescription:
      "Süet ve nubuk ayakkabılar suya boğmadan, hassas yüzeye özel fırça ve ürünlerle temizlenir. Bakırköy'de, aynı gün teslim, randevusuz.",
    h1: "Süet & nubuk temizleme — hassas dokuya hassas bakım",
    intro:
      "Süet ve nubuk, su ve yanlış fırçayla kolay bozulan yüzeylerdir. Dükkânımızda suya boğmadan, hassas yüzeye özel fırça ve ürünlerle temizlenir; dokusu korunur.",
    heroImg: "/images/services/suet-hero.webp",
    risks: [
      {
        title: "Su, süetin dokusunu bozar",
        text: "Süeti suya batırmak veya ıslak bezle ovmak dokuyu yatırır, kuruyunca sert ve lekeli bir yüzey bırakabilir.",
      },
      {
        title: "Yanlış fırça havı yıpratır",
        text: "Sert fırçayla ters yönde fırçalamak havı söker; parlak, geri dönmeyen izler oluşabilir.",
      },
      {
        title: "Yağmur ve tuz izi kalıcılaşabilir",
        text: "Bekleyen su/tuz lekeleri yüzeye işler; ne kadar erken müdahale edilirse sonuç o kadar iyi olur.",
      },
    ],
    steps: [
      { title: "Yüzey analizi", text: "Süet mi nubuk mu, leke türü ne — yöntem ve ürün buna göre seçilir." },
      { title: "Kuru ön temizlik", text: "Toz ve yüzey kiri, dokuya uygun fırçayla hav yönünde alınır." },
      { title: "Hassas derin temizlik", text: "Suya boğmadan, hassas yüzeye özel ürünlerle leke ve kir çözülür." },
      { title: "Doğal kurutma", text: "Doğrudan ısı olmadan kurutulur; havın yatmasına izin verilmez." },
      { title: "Doku tazeleme", text: "Hav, fırçayla yönüne uygun kaldırılır; ayakkabı aynı gün teslim edilir." },
    ],
    notes: [
      "Eski, yüzeye işlemiş lekelerde iyileşme sağlanır ancak her iz tamamen çıkmayabilir — durumu dükkânda görünce net söyleriz.",
      "Zamanla solmuş rengi geri getirme (boyama) bu hizmetin kapsamında değildir.",
    ],
    faqs: [
      {
        q: "Süet ayakkabı yıkanır mı?",
        a: "Evet — ama suya boğmadan. Süet ve nubuk, hassas yüzeye özel fırça ve ürünlerle temizlenir; klasik yıkama süete zarar verir.",
      },
      {
        q: "Yağmur ve tuz lekeleri çıkar mı?",
        a: "Çoğu iz belirgin biçimde açılır; ne kadar erken gelirse sonuç o kadar iyi. Yüzeye işlemiş eski izlerde durumu görünce net bilgi veririz.",
      },
      {
        q: "Süet temizliği de aynı gün mü?",
        a: "Evet. Sabah bırakılan süet/nubuk ayakkabı da aynı gün akşam 20:00'ye kadar hazır olur.",
      },
      {
        q: "Süet temizleme ücreti ne kadar?",
        a: `Kategoriye göre sabit fiyat, ${siteConfig.priceRangeLabel} aralığında. Kesin menü dükkânda.`,
      },
    ],
    priceCategory: "Süet & Nubuk",
  },
  {
    slug: "deri-ayakkabi-bakimi",
    nav: "Deri Bakımı",
    metaTitle: "Deri Ayakkabı Temizleme ve Bakımı Bakırköy | YIKAT",
    metaDescription:
      "Klasik ve günlük deri ayakkabılar için temizlik ve bakım: suya boğmadan temizlik, kuruma ve çatlamaya karşı bakım. Bakırköy'de, aynı gün teslim.",
    h1: "Deri ayakkabı temizlik & bakımı",
    intro:
      "Deri, doğru bakımla yıllarca taşır; bakımsız kaldığında kurur ve çatlar. Klasik ve günlük deri ayakkabıların dükkânımızda suya boğmadan temizlenir, deriyi besleyen bakımla teslim edilir.",
    heroImg: "/images/services/deri-hero.webp",
    risks: [
      {
        title: "Deri suyu sevmez",
        text: "Deriyi suya batırmak veya makinede yıkamak kurumaya, sertleşmeye ve şekil kaybına yol açar.",
      },
      {
        title: "Bakımsız deri çatlar",
        text: "Temizlenmeyen kir ve bakımsızlık derinin esnekliğini azaltır; oluşan çatlaklar geri dönmez.",
      },
      {
        title: "Yanlış ürün yüzeyi matlaştırır",
        text: "Genel amaçlı temizleyiciler derinin yüzey işlemesini bozabilir; leke yerine daha büyük bir sorun kalır.",
      },
    ],
    steps: [
      { title: "Deri analizi", text: "Derinin türü ve durumu incelenir; ürün ve yöntem buna göre seçilir." },
      { title: "Nazik temizlik", text: "Kir ve lekeler, deriye uygun ürünle suya boğmadan temizlenir." },
      { title: "Bakım", text: "Deri, kurumaya ve çatlamaya karşı beslenir; esnekliği korunur." },
      { title: "Kurutma ve son kontrol", text: "Doğal kurutma sonrası son kontrol yapılır; aynı gün teslim." },
    ],
    notes: [
      "Mevcut derin çatlaklar geri döndürülemez; düzenli bakım ilerlemesini yavaşlatır.",
      "Bu hizmet temizlik ve bakım içindir; boyama/renk yenileme için dükkânda birlikte değerlendiririz.",
    ],
    faqs: [
      {
        q: "Deri ayakkabı su ile yıkanır mı?",
        a: "Klasik anlamda yıkanmaz — deri suya boğulmadan, deriye uygun ürünlerle temizlenir ve ardından bakım yapılır.",
      },
      {
        q: "Derideki çatlaklar geçer mi?",
        a: "Oluşmuş derin çatlaklar geri dönmez; bakım, derinin beslenmesini sağlayarak ilerlemeyi yavaşlatır. Erken bakım bu yüzden önemli.",
      },
      {
        q: "Deri bakım da aynı gün mü teslim?",
        a: "Evet. Sabah bırakılan deri ayakkabı aynı gün akşam 20:00'ye kadar hazır olur.",
      },
      {
        q: "Deri temizlik ve bakım ücreti ne kadar?",
        a: `Kategoriye göre sabit fiyat, ${siteConfig.priceRangeLabel} aralığında. Kesin menü dükkânda.`,
      },
    ],
    priceCategory: "Deri Ayakkabı",
  },
]

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug)
