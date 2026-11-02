import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, MessageCircle } from "lucide-react"
import { DiscoveryShell } from "@/components/discovery/shared"
import { DiscoveryLink } from "@/components/discovery/actions"
import { androidTest } from "@/lib/android-test"
import { siteConfig } from "@/lib/site"
import "@/app/local-growth.css"

// Utility page for the Google Play closed test. Like /yorum it is noindex and
// stays out of the sitemap: it exists for people we invite at the counter.
export const metadata: Metadata = {
  title: "Android’de ilk sen dene | Yıkat",
  description: "Yıkat Gitsin Android uygulaması Google Play’de kapalı testte. Üç adımda teste katılabilir, uygulamayı herkesten önce deneyebilirsin.",
  alternates: { canonical: "/android" },
  robots: { index: false, follow: true },
}

const feedbackMessage = "Merhaba, Android testinden yazıyorum."
const external = { target: "_blank", rel: "noopener noreferrer" } as const

export default function AndroidTestPage() {
  return <DiscoveryShell crumbs={[{ name: "Android testi", path: "/android" }]}>
    <header className="discovery-heading android-test-heading">
      <h1>Android’de ilk sen dene.</h1>
      <p className="discovery-answer">Yıkat Gitsin uygulaması Google Play’de şimdilik kapalı testte. Herkese açabilmemiz için Google, uygulamayı gerçek kullanıcıların 14 gün boyunca denemesini istiyor. Bize bu konuda destek olmak istersen aşağıdaki üç adım yeterli.</p>
    </header>

    <section className="android-test-steps" aria-labelledby="adimlar">
      <h2 id="adimlar">Üç adımda katıl</h2>
      <p>Üç adımda da aynı Google hesabını kullan. Telefonunda hangi hesapla Google Play’e girdiysen o hesap en kolayı.</p>
      <ol className="discovery-steps">
        <li>
          <h3>Test grubuna katıl</h3>
          <p>Yıkat’ın Google Play test grubunu aç ve Google hesabınla gruba katıl.</p>
          <div className="discovery-actions"><a className="button primary" href={androidTest.groupUrl} {...external}>Test grubuna katıl <ArrowUpRight size={18} aria-hidden="true"/></a></div>
        </li>
        <li>
          <h3>Testçi ol</h3>
          <p>Aynı hesapla test sayfasını aç ve katılma düğmesine dokun. Telefonunun diline göre “Testçi ol” ya da “Become a tester” yazar. Sayfa hemen açılmazsa birkaç dakika sonra yeniden dene.</p>
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
      <h2 id="on-dort-gun">14 gün testte kal</h2>
      <p>Google, testçilerin en az 14 gün boyunca testte kalmasını istiyor. Bu süre dolmadan testten ayrılmaman ve arada bir uygulamayı açıp gezmen yeterli. Gerisini biz hallederiz.</p>
    </section>

    <section className="discovery-narrow android-test-section" aria-labelledby="gorus">
      <h2 id="gorus">Aklına bir şey gelirse yaz</h2>
      <p>Bir yerde takıldıysan ya da bir şey gözüne çarptıysa duymak isteriz. Google Play’deki uygulama sayfasında testçilere özel bir geri bildirim alanı var, oradan yazabilirsin. İstersen WhatsApp’tan da yazabilirsin.</p>
      <div className="discovery-actions">
        <DiscoveryLink action="whatsapp" className="button secondary" href={`${siteConfig.whatsappHref}?text=${encodeURIComponent(feedbackMessage)}`} {...external}><MessageCircle size={18} aria-hidden="true"/> WhatsApp’tan yaz</DiscoveryLink>
      </div>
    </section>

    <section className="discovery-narrow android-test-section" aria-labelledby="ayrilmak">
      <h2 id="ayrilmak">Testten ayrılmak istersen</h2>
      <p>Test bittikten sonra istediğin zaman <a href={androidTest.optInUrl} {...external}>test sayfasını</a> yeniden açıp programdan ayrılabilir, <a href={androidTest.groupUrl} {...external}>test grubundan</a> da çıkabilirsin.</p>
    </section>

    <section className="discovery-narrow android-test-section" aria-labelledby="gizlilik">
      <h2 id="gizlilik">Gizlilik</h2>
      <p>Gruba katıldığında Google hesabının adı ve e-posta adresi, gruptaki Yıkat yöneticilerine görünür. Bu bilgileri yalnızca testi yürütmek için kullanırız. Test bittikten sonra gruptan ayrılabilirsin. Ayrıntılar <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link> sayfamızda.</p>
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
