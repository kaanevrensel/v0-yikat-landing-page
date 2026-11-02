import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Mail } from "lucide-react"
import { DiscoveryShell } from "@/components/discovery/shared"
import { androidTest } from "@/lib/android-test"
import "@/app/local-growth.css"

// Utility page for the Google Play closed test. Like /yorum it is noindex and
// stays out of the sitemap: it exists for people we invite at the counter.
export const metadata: Metadata = {
  title: "Android’in varsa bir ricamız var | Yıkat",
  description: "Yıkat Gitsin Android uygulaması Google Play’de kapalı testte. İstersen üç adımda teste katılıp uygulamanın herkese açılmasına yardım edebilirsin.",
  alternates: { canonical: "/android" },
  robots: { index: false, follow: true },
}

// Every external link opens a new tab; one shared visually hidden note tells
// screen-reader users so without changing the links' accessible names.
const newTabNote = "android-yeni-sekme"
const external = { target: "_blank", rel: "noopener noreferrer", "aria-describedby": newTabNote } as const

export default function AndroidTestPage() {
  return <DiscoveryShell crumbs={[{ name: "Android testi", path: "/android" }]}>
    <header className="discovery-heading android-test-heading">
      <h1>Android’in varsa bir ricamız var.</h1>
      <p className="discovery-answer">Yıkat Gitsin uygulaması Google Play’de şimdilik kapalı testte. Herkese açabilmemiz için Google, uygulamayı gerçek kişilerin en az 14 gün denemesini istiyor. Bize el atmak istersen şu üç adım yeterli.</p>
      <span id={newTabNote} className="sr-only">Bağlantı yeni sekmede açılır.</span>
    </header>

    <section className="android-test-steps" aria-labelledby="adimlar">
      <h2 id="adimlar">Üç adımda katıl</h2>
      <p>Üç adımda da aynı Google hesabını kullan. Telefonunda hangi hesapla Google Play’e girdiysen o hesap en kolayı.</p>
      <ol className="discovery-steps">
        <li>
          <h3>Test grubuna katıl</h3>
          <p>Google Gruplar’daki Yıkat test grubunu aç ve Google hesabınla gruba katıl.</p>
          <div className="discovery-actions"><a className="button primary" href={androidTest.groupUrl} {...external}>Test grubuna katıl <ArrowUpRight size={18} aria-hidden="true"/></a></div>
        </li>
        <li>
          <h3>Test sayfasında katıl</h3>
          <p>Aynı hesapla test sayfasını aç ve katılma düğmesine dokun. Düğmede Türkçe “Test kullanıcısı ol” ya da İngilizce “Become a tester” gibi bir yazı olur. Sayfa hemen açılmazsa birkaç dakika sonra yeniden dene.</p>
          <div className="discovery-actions"><a className="button primary" href={androidTest.optInUrl} {...external}>Test sayfasını aç <ArrowUpRight size={18} aria-hidden="true"/></a></div>
        </li>
        <li>
          <h3>Google Play’den yükle</h3>
          <p>Sonra Yıkat Gitsin’i Google Play’den her zamanki gibi yükle.</p>
          <div className="discovery-actions"><a className="button primary" href={androidTest.playUrl} {...external}>Google Play’de aç <ArrowUpRight size={18} aria-hidden="true"/></a></div>
        </li>
      </ol>
    </section>

    <section className="discovery-narrow android-test-section" aria-labelledby="neler-var">
      <h2 id="neler-var">Uygulamada şimdilik neler var?</h2>
      <p>Hizmetlere ve fiyatlara bakabilir, giriş yapıp uygulamayı gezebilirsin. Kapıdan alım ve teslim henüz başlamadı, bu yüzden uygulamadan sipariş veremezsin. Şu an ayakkabı temizliği için <Link href="/bakirkoy-ayakkabi-temizleme">Bakırköy dükkânına</Link> gelebilirsin.</p>
    </section>

    <section className="discovery-narrow android-test-section" aria-labelledby="on-dort-gun">
      <h2 id="on-dort-gun">Herkese açılana kadar testte kal</h2>
      <p>Google, testçilerin en az 14 gün kesintisiz testte kalmasını istiyor. Herkes başka bir gün katıldığı için en iyisi, uygulama Google Play’de herkese açılana kadar testte kalman; açılınca haber veririz. Arada bir uygulamayı açıp gezmen yeterli, gerisini biz hallederiz.</p>
    </section>

    <section className="discovery-narrow android-test-section" aria-labelledby="gorus">
      <h2 id="gorus">Aklına bir şey gelirse yaz</h2>
      <p>Bir yerde takıldıysan ya da bir şey gözüne çarptıysa duymak isteriz. Google Play’deki uygulama sayfasında testçilere özel bir geri bildirim alanı var. Oradan ya da e-postayla yazabilirsin.</p>
      <div className="discovery-actions">
        <a className="button secondary" href={`mailto:${androidTest.feedbackEmail}?subject=${encodeURIComponent("Android testi")}`}><Mail size={18} aria-hidden="true"/> E-postayla yaz</a>
      </div>
    </section>

    <section className="discovery-narrow android-test-section" aria-labelledby="ayrilmak">
      <h2 id="ayrilmak">Testten ayrılmak istersen</h2>
      <p>İstediğin zaman <a href={androidTest.optInUrl} {...external}>test sayfasını</a> yeniden açıp programdan ayrılabilir, <a href={androidTest.groupUrl} {...external}>test grubundan</a> da çıkabilirsin. Gruptan çıkmak da testten ayrılmak sayılır; uygulamayı silmek ise sayılmaz. Uygulama herkese açılana kadar kalırsan bize çok yardımı olur ama zorunda değilsin.</p>
    </section>

    <section className="discovery-narrow android-test-section" aria-labelledby="gizlilik">
      <h2 id="gizlilik">Gizlilik</h2>
      <p>Gruba katıldığında Google hesabındaki adın ve e-posta adresin, grubu yöneten Yıkat ekibine görünür; diğer testçiler göremez. Bu bilgileri yalnızca testi yürütmek için kullanırız, kimseyle paylaşmayız. Grup Google’ın altyapısında çalışır. Gruptan istediğin zaman çıkabilirsin.</p>
      <p>Kişisel verilerinle ilgili hakların ve başvuru yolu <Link href="/kvkk">KVKK Aydınlatma Metni</Link>’nde. Genel gizlilik politikamız için: <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>.</p>
    </section>

    <section className="discovery-narrow android-test-section" aria-labelledby="iphone">
      <h2 id="iphone">iPhone kullanıyorsan</h2>
      <p>Teste gerek yok, Yıkat Gitsin <a href={androidTest.appStoreUrl} {...external}>App Store’da</a>.</p>
    </section>

    <section className="android-test-card" aria-labelledby="kart">
      <div className="android-test-qr">
        <Image src={androidTest.qr} alt="Bu sayfayı telefonda açan QR kod" width={240} height={240} unoptimized/>
      </div>
      <div>
        <h2 id="kart">Bilgisayardan mı bakıyorsun?</h2>
        <p>Telefonunun kamerasıyla bu kodu okut, sayfa telefonunda açılsın.</p>
        <a className="discovery-inline-link" href={androidTest.pdf} download>Tezgâh için test kartını indir (PDF)</a>
      </div>
    </section>
  </DiscoveryShell>
}
