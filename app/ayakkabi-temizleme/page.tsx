import Link from "next/link"
import Image from "next/image"
import { services } from "@/lib/services"
import { siteConfig } from "@/lib/site"
import { discoveryMetadata, BUSINESS_ID } from "@/lib/discovery"
import { DiscoveryShell, JsonLd, RelatedLinks, FaqList, ShopInvitation, ScrollableTable } from "@/components/discovery/shared"
import { ShopActions } from "@/components/discovery/actions"

export const metadata = discoveryMetadata("Ayakkabı Temizleme ve Yıkama Hizmetleri", "Sneaker, deri, süet ve nubuk için ayakkabı temizleme seçenekleri. Malzemeye göre yöntem, işlem kapsamı, ücret ve Bakırköy dükkân bilgileri.", "/ayakkabi-temizleme")

export default function Page() {
  return <DiscoveryShell crumbs={[{ name: "Ayakkabı temizleme", path: "/ayakkabi-temizleme" }]}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", "@id": `${siteConfig.url}/ayakkabi-temizleme#service`, name: "Ayakkabı temizleme ve bakım", serviceType: "Ayakkabı temizleme", url: `${siteConfig.url}/ayakkabi-temizleme`, provider: { "@id": BUSINESS_ID }, availableChannel: { "@type": "ServiceChannel", serviceLocation: { "@id": BUSINESS_ID } } }}/>
    <header className="discovery-heading"><p className="discovery-eyebrow">Ayakkabı temizliği ve bakım</p><h1>Malzemeye göre<br/>ayakkabı temizleme.</h1><p className="discovery-answer">Ayakkabı yıkamada yöntem, yalnız lekeye değil malzemeye ve ayakkabının mevcut durumuna göre seçilir. Sneaker, deri, süet ve nubuk için seçenekleri incele; Bakırköy dükkânına gelmeden önce aklındakini sor.</p><ShopActions/></header>
    <RelatedLinks title="Malzemene göre devam et" links={services.map(s => ({ href: `/${s.slug}`, title: s.nav, text: s.intro }))}/>
    <section className="discovery-process"><div><p className="discovery-eyebrow">Dükkândan gerçek görüntüler</p><h2>Temizliğin ardından<br/>kurutma ve kontrol.</h2><p>Yıkama tek başına bütün süreç değil. Ayakkabının durumunun değerlendirilmesi, uygun temizliğin seçilmesi, kurutma ve son kontrol birlikte düşünülür.</p><p>Bu görüntü Bakırköy dükkânındaki kurutma aşamasından. Ev tipi makinede yıkama veya kurutma için genel bir öneri değildir.</p><Link href="/bakirkoy-ayakkabi-temizleme" className="discovery-inline-link">Dükkânı ve ulaşımı incele →</Link></div><figure><Image src="/images/care/drying-20261010.webp" alt="Bakırköy dükkânındaki ayakkabı kurutma aşamasından gerçek görüntü" width={800} height={1422} sizes="(max-width: 800px) 100vw, 440px"/><figcaption>Bakım sürecinden · Bakırköy</figcaption></figure></section>
    <section id="fiyat" className="discovery-prose discovery-narrow"><h2>Ayakkabı yıkama fiyatı nasıl netleşir?</h2><p>Güncel ücret için ayakkabının türünü ve yapılacak işlemi birlikte değerlendirelim. Kategori, malzeme ve mevcut durum bilinmeden bir fiyatı bütün modellere uygulamak doğru olmaz. İşlemin kapsamını ve ücretini kabulden önce sorabilirsin.</p><ScrollableTable label="Fiyat değerlendirmesi bilgileri"><table><caption>Fiyat ve işlem değerlendirmesi için paylaşabileceklerin</caption><thead><tr><th scope="col">Bilgi</th><th scope="col">Neden gerekli?</th></tr></thead><tbody><tr><th scope="row">Ayakkabının tamamı</th><td>Modeli ve birden fazla malzeme olup olmadığını görmek.</td></tr><tr><th scope="row">Sorunlu bölgenin yakın planı</th><td>Kir, leke ve mevcut yüzey yıpranmasını ayırmak.</td></tr><tr><th scope="row">Önceki işlemler</th><td>Evde kullanılan ürün veya daha önce yapılan temizliği bilmek.</td></tr><tr><th scope="row">İhtiyaç duyduğun tarih</th><td>Teslim uygunluğunu işlemden önce netleştirmek.</td></tr></tbody></table></ScrollableTable><p>Fotoğraf ön değerlendirmeye yardımcı olur; fiziksel inceleme gerektiğinde bunu belirtiriz. Temizlik fiyatını boyama, taban değişimi veya onarım fiyatıyla eş tutma.</p></section>
    <section className="discovery-prose discovery-narrow"><h2>Evde bakım mı, profesyonel değerlendirme mi?</h2><p>Üretici talimatı açık olan hafif yüzey kiri için bakım rehberlerinden başlayabilirsin. Karışık malzeme, süet detay, önceki ürün izi veya mevcut hasarda önce değerlendirme istemek daha yerinde olur.</p><p>“Ayakkabı kuru temizleme” ifadesi de tek bir yöntem tarif etmez. Tekstilde kullanılan profesyonel işlemin her ayakkabı için uygun olduğu varsayılamaz. Ayakkabının malzemesi ve yapısı önceliklidir.</p></section>
    <div className="discovery-narrow"><FaqList faqs={[
      { q: "Ayakkabı temizleme ile yıkama aynı şey mi?", a: "Günlük kullanımda benzer hizmeti anlatabilir; fakat uygulanacak işlem malzemeye göre değişir. Süet, deri ve kumaşa aynı yıkama yöntemi uygulanmaz." },
      { q: "Aynı gün teslim alabilir miyim?", a: "Uygunluğu ayakkabının durumuna, işlem ve kuruma ihtiyacına göre netleştirelim. Belirli bir saate ihtiyacın varsa önceden paylaş." },
      { q: "Her leke ve sararma çıkar mı?", a: "Hayır; her iz kir değildir. Boya kaybı, aşınma, çatlak ve malzemenin renk değişimi temizlikten farklı değerlendirilir." },
      { q: "İstanbul’un her yerinden teslim alıyor musunuz?", a: "Bu sayfada doğrulanmış hizmet noktası Bakırköy’deki fiziksel dükkândır. Adresten alım veya gönderim için güncel uygunluğu önceden sor." },
    ]}/></div>
    <RelatedLinks title="Yıkamadan önce oku" links={[{ href: "/rehber/ayakkabi-makinede-yikanir-mi", title: "Ayakkabı makinede yıkanır mı?" }, { href: "/rehber/beyaz-ayakkabi-nasil-temizlenir", title: "Beyaz ayakkabıda kir ve sararma" }, { href: "/rehber/ayakkabi-kokusu-nasil-giderilir", title: "Ayakkabı kokusunda nem ve kurutma" }]}/>
    <ShopInvitation/>
  </DiscoveryShell>
}
