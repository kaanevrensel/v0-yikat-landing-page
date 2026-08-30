import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni - YIKAT",
  description:
    "YIKAT Kişisel Verilerin İşlenmesine İlişkin Aydınlatma Metni. 6698 sayılı KVKK kapsamında haklarınız.",
  alternates: { canonical: "https://www.yikat.tech/kvkk" },
}

export default function KvkkPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {"Geri Dön"}
          </Link>
          <div className="ml-auto">
            <Logo width={46} className="text-[#269AFF]" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {"Kişisel Verilerin İşlenmesine İlişkin Aydınlatma Metni"}
        </h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <p>
            {"YIKAT olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi ile Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ kapsamında, kişisel verilerinizin işlenmesine ilişkin sizleri bilgilendirmek amacıyla işbu aydınlatma metnini hazırladık."}
          </p>
          <p>
            {"YIKAT, çamaşır yıkama, kurutma, ütü ve ayakkabı yıkama hizmetlerini adresinizden teslim alıp, kendi çamaşırhanesinde işleyerek yeniden adresinize teslim eden bir temizlik hizmeti sunmaktadır. Siparişler web sitesi veya WhatsApp üzerinden verilmekte, teslim alma ve teslim işlemleri kurye aracılığıyla gerçekleştirilmektedir."}
          </p>

          {/* Mobil uygulama: ayrı veri işleme (Supabase, Resend, PostHog, Sentry,
              Nominatim) — metni uygulama kendi yasal sayfalarında yayınlar; burada
              kopyalanmaz ki iki sürüm ayrışmasın. */}
          <div className="rounded-xl border border-border bg-card p-4 text-sm sm:text-base">
            <p className="font-medium text-foreground">{"YIKAT mobil uygulaması"}</p>
            <p className="mt-1">
              {"Mobil uygulamada işlenen verilere ilişkin gizlilik politikası ve aydınlatma metni ayrıca yayınlanır: "}
              <Link
                href="https://app.yikat.tech/legal/gizlilik"
                className="font-medium text-foreground underline underline-offset-4"
              >
                {"app.yikat.tech/legal/gizlilik"}
              </Link>
            </p>
          </div>

          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"1. İşlenen Kişisel Veri Kategorileri"}
            </h2>
            <p className="mt-3">
              {"YIKAT hizmetlerinden yararlanmanız sırasında aşağıdaki kişisel veri kategorileri işlenmektedir:"}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">{"Özel nitelikli kişisel veri:"}</strong> {"YIKAT, hizmet süreci kapsamında özel nitelikli kişisel veri (sağlık, biyometrik, din, ırk vb.) işlememektedir."}</li>
              <li><strong className="text-foreground">{"Çerez/Analitik Verileri:"}</strong> {"Çerez tanımlayıcıları, sayfa görüntülenme verileri, oturum bilgileri. Web sitesi kullanım analizi ve iyileştirme için işlenmektedir."}</li>
              <li><strong className="text-foreground">{"Teknik Veriler:"}</strong> {"IP adresi, cihaz bilgisi, tarayıcı türü, log kayıtları. Web sitesi güvenliği ve performans analizi için işlenmektedir."}</li>
              <li><strong className="text-foreground">{"İletişim Kayıtları:"}</strong> {"Çağrı kayıtları, WhatsApp mesajları, e-posta yazışmaları. Destek taleplerinin takibi ve çözümü için işlenmektedir."}</li>
              <li><strong className="text-foreground">{"Ödeme Bilgileri:"}</strong> {"Ödeme yöntemi, işlem referans numarası. Ödemenin doğrulanması için işlenmektedir. YIKAT kart bilgilerini doğrudan işlemez ve saklamaz; kart verileri ödeme sağlayıcısı tarafından işlenir."}</li>
              <li><strong className="text-foreground">{"Sipariş Bilgileri:"}</strong> {"Paket türü, teslim notu. Hizmetin doğru şekilde yerine getirilmesi için işlenmektedir."}</li>
              <li><strong className="text-foreground">{"Adres Bilgileri:"}</strong> {"Açık adres, il, ilçe. Kurye ile teslim alma ve teslim işlemleri için işlenmektedir."}</li>
              <li><strong className="text-foreground">{"İletişim Bilgileri:"}</strong> {"Telefon numarası, e-posta adresi. Sipariş bildirimleri ve destek iletişimi için işlenmektedir."}</li>
              <li><strong className="text-foreground">{"Kimlik Bilgileri:"}</strong> {"Ad, Soyad. Hesap oluşturma ve sipariş süreci için işlenmektedir."}</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"2. Kişisel Verilerin İşlenme Amaçları"}
            </h2>
            <p className="mt-3">{"Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:"}</p>

            <h3 className="mt-5 text-lg font-semibold text-foreground">{"A. Hizmet Sunumu ve Sipariş Yönetimi"}</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>{"Ödeme işlemlerinin tamamlanması ve faturalandırma"}</li>
              <li>{"Yıkama, kurutma ve ütü hizmetlerinin yürütülmesi"}</li>
              <li>{"Kurye ile çamaşırların teslim alınması ve temizlenmiş ürünlerin teslim edilmesi"}</li>
              <li>{"Sipariş alınması, onaylanması ve takibi"}</li>
              <li>{"Üyelik/ön kayıt işlemlerinin gerçekleştirilmesi"}</li>
            </ul>

            <h3 className="mt-5 text-lg font-semibold text-foreground">{"B. Müşteri İletişimi ve Destek"}</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>{"Hizmetle ilgili operasyonel bildirimlerin yapılması (teslimat saati değişikliği, sipariş onayları vb.)"}</li>
              <li>{"Müşteri şikâyet ve taleplerinin alınması, takibi ve sonuçlandırılması"}</li>
              <li>{"Sipariş durumu hakkında bilgilendirme (SMS, e-posta, uygulama içi bildirim, WhatsApp)"}</li>
            </ul>

            <h3 className="mt-5 text-lg font-semibold text-foreground">{"C. Pazarlama ve Ticari İletişim (Açık Rızaya Bağlıdır)"}</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>{"Müşteri memnuniyet anketlerinin gönderilmesi"}</li>
              <li>{"Kişiselleştirilmiş tekliflerin oluşturulması ve iletilmesi"}</li>
              <li>{"Kampanya, indirim ve promosyon bilgilendirmelerinin yapılması"}</li>
            </ul>

            <h3 className="mt-5 text-lg font-semibold text-foreground">{"D. Analiz ve İyileştirme"}</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>{"Kullanıcı deneyiminin geliştirilmesi"}</li>
              <li>{"Hizmet kalitesinin ölçülmesi ve iyileştirilmesi"}</li>
              <li>{"Web sitesi kullanım istatistiklerinin toplanması ve analizi"}</li>
            </ul>

            <h3 className="mt-5 text-lg font-semibold text-foreground">{"E. Hukuki Yükümlülükler ve Güvenlik"}</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>{"Hukuki uyuşmazlıklarda delil olarak kullanılması"}</li>
              <li>{"Bilgi güvenliği süreçlerinin yürütülmesi"}</li>
              <li>{"Yetkili kamu kurum ve kuruluşlarına bilgi sunulması"}</li>
              <li>{"Yasal düzenleme ve mevzuattan kaynaklanan yükümlülüklerin yerine getirilmesi (vergi mevzuatı, tüketici mevzuatı, e-ticaret mevzuatı vb.)"}</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"3. Hukuki Sebepler (KVKK m.5 / m.6 Çerçevesi)"}
            </h2>
            <p className="mt-3">
              {"Kişisel verileriniz, Kanun'un 5. maddesinin 2. fıkrasında yer alan aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:"}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">{"Özel nitelikli veri (m.6):"}</strong> {"YIKAT, özel nitelikli kişisel veri işlememekte olup bu madde kapsamında bir işleme faaliyeti bulunmamaktadır."}</li>
              <li><strong className="text-foreground">{"Açık rıza (m.5/1):"}</strong> {"Ticari elektronik ileti gönderimi, pazarlama amaçlı profilleme ve çerez bazlı izleme (zorunlu olmayan çerezler) için iletişim bilgileri ve çerez/analitik verileri işlenmektedir."}</li>
              <li><strong className="text-foreground">{"(f) Meşru menfaat:"}</strong> {"Hizmet kalitesinin arttırılması, iş süreçlerinin geliştirilmesi ve dolandırıcılık önleme amacıyla teknik veriler, sipariş bilgileri ve analitik verileri işlenmektedir."}</li>
              <li><strong className="text-foreground">{"(d) Bir hakkın tesisi, kullanılması veya korunması:"}</strong> {"Olası uyuşmazlıklarda delil muhafazası ve hukuki süreçlerin yürütülmesi amacıyla sipariş, iletişim kayıtları ve ödeme bilgileri işlenmektedir."}</li>
              <li><strong className="text-foreground">{"(c) Veri sorumlusunun hukuki yükümlülüğü:"}</strong> {"Fatura düzenleme, vergisel yükümlülükler ve tüketici hakları mevzuatı kapsamında kimlik, adres ve fatura/ödeme bilgileri işlenmektedir."}</li>
              <li><strong className="text-foreground">{"(c) Sözleşmenin kurulması veya ifası:"}</strong> {"Mesafeli hizmet sözleşmesinin kurulması, siparişin alınması, hizmetin teslimi ve ödemenin işlenmesi amacıyla ad-soyad, telefon, adres, sipariş bilgileri ve ödeme referansı işlenmektedir."}</li>
              <li><strong className="text-foreground">{"(a) Kanunlarda açıkça öngörülmesi:"}</strong> {"6563 sayılı Elektronik Ticaretin Düzenlenmesi Hk. Kanun, 213 sayılı VUK, 6502 sayılı Tüketicinin Korunması Hk. Kanun ve 5651 sayılı Kanun uyarınca kayıt tutma yükümlülükleri çerçevesinde kimlik, iletişim, adres, sipariş, ödeme ve teknik veriler işlenmektedir."}</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"4. Kişisel Verilerin Aktarılması (Alıcı Grupları)"}
            </h2>
            <p className="mt-3">
              {"Kişisel verileriniz, Kanun'un 8. maddesi çerçevesinde aşağıdaki alıcı gruplarına aktarılabilmektedir:"}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">{"Hukuk danışmanları:"}</strong> {"Hukuki süreçlerin takibi amacıyla uyuşmazlığa konu veriler aktarılmaktadır."}</li>
              <li><strong className="text-foreground">{"Yetkili kamu kurum ve kuruluşları:"}</strong> {"Yasal yükümlülükler (vergi, tüketici hakları, adli makam talepleri) kapsamında mevzuatın gerektirdiği veri türleri aktarılmaktadır."}</li>
              <li><strong className="text-foreground">{"Kurye / Lojistik:"}</strong> {"Teslim alma ve teslim işlemleri için ad-soyad, adres ve telefon numarası aktarılmaktadır."}</li>
              <li><strong className="text-foreground">{"CRM / Destek yazılımı:"}</strong> {"Müşteri destek taleplerinin yönetimi için iletişim bilgileri ve talep/şikâyet içerikleri aktarılmaktadır."}</li>
              <li><strong className="text-foreground">{"Analitik sağlayıcıları:"}</strong> {"Web sitesi kullanım analizi için çerez tanımlayıcıları, IP adresi ve cihaz bilgisi aktarılmaktadır."}</li>
              <li><strong className="text-foreground">{"E-posta gönderim sağlayıcısı:"}</strong> {"İşlemsel e-postalar ve bildirimler için e-posta adresi ve ad-soyad aktarılmaktadır."}</li>
              <li><strong className="text-foreground">{"SMS sağlayıcısı:"}</strong> {"Sipariş bildirimleri ve doğrulama kodları için telefon numarası ve mesaj içeriği aktarılmaktadır."}</li>
              <li><strong className="text-foreground">{"Hosting / E-ticaret altyapısı:"}</strong> {"Web sitesinin barındırılması ve sipariş yönetimi amacıyla kimlik, iletişim, adres ve sipariş bilgileri aktarılmaktadır."}</li>
              <li><strong className="text-foreground">{"Ödeme sağlayıcısı:"}</strong> {"Ödeme işlemlerinin gerçekleştirilmesi amacıyla ödeme referansı aktarılmaktadır."}</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"5. Yurt Dışına Aktarım"}
            </h2>
            <p className="mt-3">
              {"YIKAT'ın kullandığı bazı üçüncü parti hizmet sağlayıcılarının sunucuları yurt dışında (AB veya ABD) konumlu olabilir. Aşağıda mevcut durum özetlenmiştir:"}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>{"E-posta gönderim — E-posta iletimi"}</li>
              <li>{"SMS sağlayıcısı — Bildirim gönderme"}</li>
              <li>{"İkas (e-ticaret altyapısı) — Sipariş ve site yönetimi. Sunucu konumu: AWS (Amazon Web Services)"}</li>
            </ul>
            <p className="mt-3">
              {"Yurt dışına veri aktarımı yapılması durumunda, Kanun'un 9. maddesi kapsamında gerekli hukuki tedbirler (açık rıza, yeterli koruma bulunan ülkeler, taahhütnameler veya Kurul kararları) çerçevesinde işlem yapılmaktadır."}
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"6. Saklama Süreleri"}
            </h2>
            <p className="mt-3">
              {"Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve ilgili mevzuatın öngördüğü zorunlu saklama süreleri dahilinde muhafaza edilmektedir:"}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">{"Ticari elektronik ileti onayları:"}</strong> {"Onay tarihi + 3 yıl; onay geri çekilirse geri çekilme tarihi + 1 yıl (6563 s. Kanun, Ticari Elektronik İleti Yönetmeliği)."}</li>
              <li><strong className="text-foreground">{"Çerez verileri:"}</strong> {"Çerez türüne göre 13 ay — 2 yıl. AB uygulamalarıyla uyumlu politika."}</li>
              <li><strong className="text-foreground">{"Teknik loglar (IP, erişim kayıtları):"}</strong> {"2 yıl (5651 s. Kanun)."}</li>
              <li><strong className="text-foreground">{"İletişim kayıtları (destek):"}</strong> {"Talebin kapatılmasından itibaren 3 yıl. Şikâyet zamanaşımına göre belirlenmiştir."}</li>
              <li><strong className="text-foreground">{"Fatura ve ödeme bilgileri:"}</strong> {"İşlem tarihi + 10 yıl (213 s. VUK)."}</li>
              <li><strong className="text-foreground">{"Sipariş ve işlem kayıtları:"}</strong> {"İşlem tarihi + 10 yıl (6102 s. TTK, 213 s. VUK)."}</li>
              <li><strong className="text-foreground">{"Kimlik ve iletişim bilgileri:"}</strong> {"Üyelik süresi + 10 yıl (6098 s. TBK genel zamanaşımı süresi)."}</li>
            </ul>
            <p className="mt-3">
              {"Saklama süresi sona eren veriler, YIKAT'ın Kişisel Veri Saklama ve İmha Politikasına uygun olarak silinir, yok edilir veya anonim hale getirilir."}
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"7. Veri Toplama Yöntemleri ve Hukuki Sebep İlişkisi"}
            </h2>
            <p className="mt-3">
              {"Kişisel verileriniz aşağıdaki kanallar aracılığıyla toplanmaktadır:"}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">{"Ödeme sağlayıcısı:"}</strong> {"Ödeme referans bilgisi toplanmaktadır. Hukuki sebep: Sözleşmenin ifası (m.5/2-c) ve kanunda öngörülme (m.5/2-a)."}</li>
              <li><strong className="text-foreground">{"Uygulama içi bildirimler:"}</strong> {"Cihaz token bilgisi toplanmaktadır. Hukuki sebep: Sözleşmenin ifası (m.5/2-c); pazarlama için açık rıza (m.5/1)."}</li>
              <li><strong className="text-foreground">{"SMS:"}</strong> {"Telefon numarası toplanmaktadır. Hukuki sebep: Sözleşmenin ifası (m.5/2-c); ticari ileti için açık rıza (m.5/1)."}</li>
              <li><strong className="text-foreground">{"Telefon / WhatsApp / E-posta:"}</strong> {"İletişim bilgileri ve görüşme/mesaj içerikleri toplanmaktadır. Hukuki sebep: Sözleşmenin ifası (m.5/2-c) ve meşru menfaat (m.5/2-f)."}</li>
              <li><strong className="text-foreground">{"Web sitesi çerezleri:"}</strong> {"IP, cihaz bilgisi, tarayıcı ve sayfa görüntülenme verileri toplanmaktadır. Hukuki sebep: Zorunlu çerezler için meşru menfaat (m.5/2-f); analitik ve pazarlama çerezleri için açık rıza (m.5/1)."}</li>
              <li><strong className="text-foreground">{"Web sitesi üyelik/sipariş formu:"}</strong> {"Ad-soyad, telefon, e-posta, adres ve sipariş detayları toplanmaktadır. Hukuki sebep: Sözleşmenin kurulması ve ifası (m.5/2-c)."}</li>
            </ul>
            <p className="mt-3">
              {"Veriler; tamamen veya kısmen otomatik yollarla ya da bir veri kayıt sisteminin parçası olmak kaydıyla otomatik olmayan yollarla toplanmaktadır."}
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"8. İlgili Kişinin Hakları (KVKK m.11) ve Başvuru Yolları"}
            </h2>
            <p className="mt-3">{"Kanun'un 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:"}</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>{"(a) Kişisel verilerinizin işlenip işlenmediğini öğrenme"}</li>
              <li>{"(b) Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme"}</li>
              <li>{"(c) Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme"}</li>
              <li>{"(c) Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme"}</li>
              <li>{"(d) Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme"}</li>
              <li>{"(e) Kanun'un 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme"}</li>
              <li>{"(f) (d) ve (e) bentleri uyarınca yapılan işlemlerin, kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme"}</li>
              <li>{"(g) İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme"}</li>
              <li>{"(g) Kişisel verilerinizin Kanun'a aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme"}</li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold text-foreground">{"Başvuru Yolları"}</h3>
            <p className="mt-2">{"Haklarınızı kullanmak için aşağıdaki yöntemlerden birini tercih edebilirsiniz:"}</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>{"E-posta: Kayıtlı e-posta adresinizden kimlik doğrulayıcı bilgilerle birlikte gönderim."}</li>
              <li>{"KEP (Kayıtlı Elektronik Posta): Güvenli elektronik imzalı başvuru."}</li>
              <li>{"Noter aracılığıyla: Kanalıyla gönderim."}</li>
              <li>{"Yazılı başvuru (elden): Kimlik tespiti yapılabilecek belgelerle birlikte bizzat başvuru."}</li>
            </ul>
            <p className="mt-3">
              {"Başvurular, talebin niteliği ve karmaşıklığına göre en kısa sürede ve her hâlükârda en geç 30 (otuz) gün içinde ücretsiz olarak sonuçlandırılır. İşlemin ayrıca bir maliyet gerektirmesi halinde, Kişisel Verileri Koruma Kurulunca belirlenen tarife üzerinden ücret talep edilebilir."}
            </p>
            <p className="mt-3">
              {"Başvurunuzun reddedilmesi, verilen cevabın yetersiz bulunması veya süresinde cevap verilmemesi halinde, cevabı öğrendiğiniz tarihten itibaren 30 gün ve her hâlükârda başvuru tarihinden itibaren 60 gün içinde Kişisel Verileri Koruma Kurulu'na şikâyet başvurusunda bulunabilirsiniz."}
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"9. Diğer Hususlar"}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>{"YIKAT, kişisel verilerin güvenliğini sağlamak için gerekli teknik ve idari tedbirleri almaktadır."}</li>
              <li>{"Aydınlatma metni, bilgilendirme amacı taşımakta olup bir rıza metni değildir. Açık rıza gerektiren işlemler için ayrıca onay alınır."}</li>
              <li>{"YIKAT, işbu aydınlatma metnini mevzuat değişiklikleri veya veri işleme süreçlerindeki güncellemeler doğrultusunda değiştirme hakkını saklı tutar. Güncel metin her zaman yikat.tech adresinde yayımlanır."}</li>
            </ul>
          </section>
        </div>

        {/* Back to home */}
        <div className="mt-12 border-t border-border pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2563eb] transition-colors hover:text-[#1d4fc4]"
          >
            <ArrowLeft className="size-4" />
            {"Ana Sayfaya Dön"}
          </Link>
        </div>
      </main>
    </div>
  )
}
