import Link from "next/link"
import { services } from "@/lib/services"
import { priceMenu, priceMenuVerifiedAt, siteConfig } from "@/lib/site"
import { discoveryMetadata, formatContentDate, BUSINESS_ID } from "@/lib/discovery"
import { DiscoveryShell, JsonLd, RelatedLinks, FaqList, ShopInvitation, ScrollableTable } from "@/components/discovery/shared"
import { PhotoEnquiryLink, ShopActions } from "@/components/discovery/actions"
import { CareAssessment } from "@/components/discovery/care-assessment"
import { ServiceExpectations } from "@/components/discovery/service-expectations"
import { CustomerCases } from "@/components/discovery/customer-cases"
import "@/app/local-growth.css"

export const metadata = discoveryMetadata("Ayakkabı Temizleme ve Yıkama Hizmetleri", "Sneaker, deri, süet ve nubuk için ayakkabı temizleme seçenekleri. Malzemeye göre yöntem, işlem kapsamı, ücret ve Bakırköy dükkân bilgileri.", "/ayakkabi-temizleme")

export default function Page() {
  return <DiscoveryShell crumbs={[{ name: "Ayakkabı temizleme", path: "/ayakkabi-temizleme" }]}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", "@id": `${siteConfig.url}/ayakkabi-temizleme#service`, name: "Ayakkabı temizleme ve bakım", serviceType: "Ayakkabı temizleme", url: `${siteConfig.url}/ayakkabi-temizleme`, provider: { "@id": BUSINESS_ID }, availableChannel: { "@type": "ServiceChannel", serviceLocation: { "@id": BUSINESS_ID } } }}/>
    <header className="discovery-heading"><h1>Malzemeye göre<br/>ayakkabı temizleme.</h1><p className="discovery-answer">Ayakkabı yıkamada yöntem, yalnız lekeye değil malzemeye ve ayakkabının mevcut durumuna göre seçilir. Sneaker, deri, süet ve nubuk için seçenekleri incele; Bakırköy dükkânına gelmeden önce aklındakini sor.</p><ShopActions/></header>
    <CareAssessment/>
    <RelatedLinks title="Malzemene göre devam et" links={services.map(s => ({ href: `/${s.slug}`, title: s.nav, text: s.intro }))}/>
    <section className="discovery-prose discovery-narrow" id="kapsam"><h2>Bir çiftte neleri birlikte değerlendiriyoruz?</h2><p>Üst yüzey, dış taban ve iç yüzey aynı ihtiyaçta olmayabilir. Genel kirin yanında özellikle çıkmasını istediğin bir lekeyi belirt; bağcık, çıkarılabilir tabanlık ve özel aksesuarların işlem kapsamını kabulde konuşalım.</p><ScrollableTable label="Ayakkabı temizliğinde değerlendirme kapsamı"><table data-columns="2"><caption>Temizliği planlamadan önce ayırdığımız konular</caption><thead><tr><th scope="col">Gördüğün durum</th><th scope="col">Birlikte netleştirelim</th></tr></thead><tbody><tr><th scope="row">Üst yüzeyde kir veya leke</th><td>Hangi malzemede? Tek bir bölge mi, tüm çift mi? Önceden ürün sürüldü mü?</td></tr><tr><th scope="row">Tabanda koyuluk veya sararma</th><td>Yüzey kiri ile aşınma ve malzemedeki renk farkını ayıralım. Her renk farkı temizlenebilir bir leke değildir.</td></tr><tr><th scope="row">İç kısımda koku veya nem</th><td>Tabanlık çıkıyor mu, ayakkabı en son nasıl kurutuldu? İç yüzeyin durumunu ayrıca değerlendirelim.</td></tr><tr><th scope="row">Çatlak, soyulma veya açılma</th><td>Mevcut hasarı işlemden önce göster. Temizlik hizmeti boyama, taban değişimi veya onarım içermez.</td></tr></tbody></table></ScrollableTable><Link href="/rehber/ayakkabi-bakimi-mi-onarim-mi" className="discovery-inline-link">Temizlik, bakım ve onarımın farkı</Link></section>
    <section className="discovery-process" id="kurutma">
      <div>
        <h2>Dükkânımızdan<br/>kurutma aşaması.</h2>
        <p>Bu kısa görüntü Bakırköy dükkânımızdaki ayakkabı kurutma dolabına ait. Temizliğin ardından kurutma ve teslim öncesi kontrol gelir; hazır olma zamanını malzeme, mevcut durum ve kuruma ihtiyacıyla birlikte değerlendirelim.</p>
        <p>Kabulde konuştuğumuz bölgelere teslimde yeniden bakalım. Kalan iz veya sonraki bakım hakkında sorunu paylaş; aşınma ve renk kaybı, temizlenebilir kirle aynı şey değildir.</p>
        <p>Ayakkabını evde çamaşır veya kurutma makinesine atma; nedenlerini <Link href="/rehber/ayakkabi-makinede-yikanir-mi">bakım rehberinde</Link> anlattık.</p>
        <Link href="/bakirkoy-ayakkabi-temizleme" className="discovery-inline-link">Dükkânı ve ulaşımı incele →</Link>
      </div>
      <figure>
        <video controls playsInline muted preload="none" poster="/images/care/drying-cabinet-20261015.webp" width={720} height={1280} aria-label="Bakırköy dükkânındaki ayakkabı kurutma dolabı">
          <source src="/videos/care/drying-cabinet-20261015.mp4" type="video/mp4"/>
          <track kind="captions" src="/videos/care/drying-cabinet-20261015-tr.vtt" srcLang="tr" label="Türkçe" default/>
        </video>
        <figcaption>Bakırköy’deki kurutma dolabımız. Kendi dükkân çekimimiz.</figcaption>
      </figure>
    </section>
    <section id="fiyat" className="discovery-prose discovery-narrow">
      <h2>Ayakkabı temizleme fiyatları</h2>
      <p><time dateTime={priceMenuVerifiedAt}>{formatContentDate(priceMenuVerifiedAt)}</time> tarihinde doğrulanan baz fiyatlar. Tutarlar <strong>bir çift</strong> içindir.</p>
      <ScrollableTable label="Ayakkabı temizleme baz fiyatları">
        <table data-columns="2">
          <caption>Bir çift için kategoriye göre baz ücret</caption>
          <thead><tr><th scope="col">Kategori</th><th scope="col">Baz fiyat</th></tr></thead>
          <tbody>{priceMenu.map(item => <tr key={item.category}><th scope="row">{item.category}</th><td>{item.price}</td></tr>)}</tbody>
        </table>
      </ScrollableTable>
      <p>Ayakkabının kategorisini, işlem kapsamını ve ödeyeceğin son tutarı kabulden önce birlikte netleştirelim. Varsa indirim veya kampanya da bu aşamada değerlendirilir.</p>
      <p>Fotoğrafla sorarken çiftin tamamını, sorunlu bölgeyi ve varsa bakım etiketini göster. Daha önce uygulanan ürünü ve ihtiyaç duyduğun tarihi de belirt; fiziksel inceleme gerektiğinde bunu söyleriz.</p>
      <PhotoEnquiryLink className="discovery-inline-link">Fotoğrafla ücret sor</PhotoEnquiryLink>
    </section>
    <ServiceExpectations/>
    <CustomerCases/>
    <section className="discovery-prose discovery-narrow"><h2>Evde bakım mı, profesyonel değerlendirme mi?</h2><p>Üretici talimatı açık olan hafif yüzey kiri için bakım rehberlerinden başlayabilirsin. Karışık malzeme, süet detay, önceki ürün izi veya mevcut hasarda önce değerlendirme istemek daha yerinde olur.</p><p>“Ayakkabı kuru temizleme” ifadesi de tek bir yöntem tarif etmez. Tekstilde kullanılan profesyonel işlemin her ayakkabı için uygun olduğu varsayılamaz. Ayakkabının malzemesi ve yapısı önceliklidir.</p><p>Hafif yüzey bakımı için <Link href="/rehber/spor-ayakkabi-nasil-temizlenir">spor ayakkabı rehberini</Link>, iç yüzey için <Link href="/rehber/ayakkabi-tabanligi-nasil-temizlenir">tabanlık rehberini</Link> kullan. Ücret sorusunu hazırlamak için <Link href="/rehber/ayakkabi-temizleme-fiyati-neye-gore-belirlenir">kabul öncesi soruları</Link> incele.</p></section>
    <div className="discovery-narrow"><FaqList faqs={[
      { q: "Ayakkabı temizleme ile yıkama aynı şey mi?", a: "Günlük kullanımda benzer hizmeti anlatabilir; fakat uygulanacak işlem malzemeye göre değişir. Süet, deri ve kumaşa aynı yıkama yöntemi uygulanmaz." },
      { q: "Aynı gün teslim alabilir miyim?", a: "Uygunluğu ayakkabının durumuna, işlem ve kuruma ihtiyacına göre netleştirelim. Belirli bir saate ihtiyacın varsa önceden paylaş." },
      { q: "Her leke ve sararma çıkar mı?", a: "Hayır; her iz kir değildir. Boya kaybı, aşınma, çatlak ve malzemenin renk değişimi temizlikten farklı değerlendirilir." },
      { q: "İstanbul’un her yerinden teslim alıyor musunuz?", a: "Kapıdan alım henüz başlamadı. Şu an ayakkabını Bakırköy Sakızağacı’ndaki dükkâna bırakıp buradan teslim alabilirsin. Kargo göndermeden önce kabul koşullarını doğrudan dükkânla netleştir." },
    ]}/></div>
    <RelatedLinks title="Yıkamadan önce oku" links={[{ href: "/rehber/ayakkabi-makinede-yikanir-mi", title: "Ayakkabı makinede yıkanır mı?" }, { href: "/rehber/beyaz-ayakkabi-nasil-temizlenir", title: "Beyaz ayakkabıda kir ve sararma" }, { href: "/rehber/ayakkabi-kokusu-nasil-giderilir", title: "Ayakkabı kokusunda nem ve kurutma" }]}/>
    <ShopInvitation/>
  </DiscoveryShell>
}
