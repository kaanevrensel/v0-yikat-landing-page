import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi - YIKAT",
  description:
    "YIKAT Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu. 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında.",
  alternates: { canonical: "https://www.yikat.tech/mesafeli-satis-sozlesmesi" },
}

export default function MesafeliSatisSozlesmesiPage() {
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
            <Image
              src="/images/yikat-logo-blue.png"
              alt="YIKAT"
              width={80}
              height={32}
              className="h-6 w-auto"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {"Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu"}
        </h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">

          {/* BÖLÜM 1 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {"Bölüm 1 – Ön Bilgilendirme Formu"}
            </h2>
            <p className="mt-4">
              {"Bu form, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği gereğince, sipariş onayından (ödeme yükümlülüğünden) önce tüketiciye sunulmaktadır."}
            </p>
          </section>

          {/* A. Satıcı Bilgileri */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"A. Satıcı / Sağlayıcı Bilgileri"}
            </h3>
            <div className="mt-4 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left">
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{"Unvan"}</td>
                    <td className="px-4 py-3">{"Yıkat Laundry – Ahmet Kaan Evrensel"}</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{"Vergi Dairesi / VKN"}</td>
                    <td className="px-4 py-3">{"Sarıgazi V.D. / 3830369314"}</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{"Adres"}</td>
                    <td className="px-4 py-3">{"Çatalmeşe Mah. Saray Cad. No: 98-100H, Çekmeköy / İstanbul"}</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{"Telefon"}</td>
                    <td className="px-4 py-3">{"0850 303 31 93"}</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{"E-posta"}</td>
                    <td className="px-4 py-3">{"destek@yikat.tech"}</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{"Web Sitesi"}</td>
                    <td className="px-4 py-3">{"yikat.tech"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* C. Hizmetin Temel Nitelikleri */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"C. Hizmetin Temel Nitelikleri"}
            </h3>
            <p className="mt-3">
              {"Yıkat Laundry aşağıdaki hizmetleri uzaktan iletişim araçlarıyla (web sitesi, WhatsApp vb.) sipariş üzerine sunmaktadır:"}
            </p>
            <div className="mt-4 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-foreground">{"Hizmet Türü"}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-foreground">{"Kapsam / Limit"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">{"Küçük Paket"}</td>
                    <td className="px-4 py-3">{"4 kg'a kadar çamaşır yıkama-kurutma-katlama"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">{"Standart Paket"}</td>
                    <td className="px-4 py-3">{"10 kg'a kadar çamaşır yıkama-kurutma-katlama"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">{"Parça Başı Ütü"}</td>
                    <td className="px-4 py-3">{"Adet bazında ütüleme hizmeti"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">{"Ayakkabı Yıkama"}</td>
                    <td className="px-4 py-3">{"1 çift ayakkabı yıkama"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* D. Toplam Fiyat */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"D. Toplam Fiyat ve Ek Masraflar"}
            </h3>
            <p className="mt-3">{"Tüm fiyatlara KDV dahildir."}</p>
            <div className="mt-4 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-foreground">{"Hizmet Türü"}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-foreground">{"Birim Fiyat (KDV Dahil)"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">{"Küçük Paket"}</td>
                    <td className="px-4 py-3">{"459,00 TL"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">{"Standart Paket"}</td>
                    <td className="px-4 py-3">{"679,00 TL"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">{"Parça Başı Ütü"}</td>
                    <td className="px-4 py-3">{"30,00 TL / adet"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">{"Ayakkabı Yıkama"}</td>
                    <td className="px-4 py-3">{"499,00 TL / çift"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              {"İlan edilen fiyatlar güncelleme yapılana kadar geçerlidir. Kampanya fiyatları belirtilen süre sonuna kadar geçerlidir."}
            </p>
          </section>

          {/* E. Ödeme ve Faturalandırma */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"E. Ödeme ve Faturalandırma"}
            </h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li><strong className="text-foreground">{"Ödeme Yöntemi:"}</strong> {"Kredi Kartı / Havale / Nakit / Ödeme Linki"}</li>
              <li><strong className="text-foreground">{"Fatura Türü:"}</strong> {"E-Fatura"}</li>
              <li><strong className="text-foreground">{"Fatura İletimi:"}</strong> {"E-posta yoluyla"}</li>
            </ul>
          </section>

          {/* F. Teslimat Süresi */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"F. Teslimat Süresi"}
            </h3>
            <p className="mt-3">
              {"Ödeme alındıktan sonra 48 saat içerisinde teslimat yapılır. Hizmet süreci (yıkama-kurutma-katlama/ütü) 2 iş günü içerisinde tamamlanır."}
            </p>
          </section>

          {/* G. Cayma Hakkı */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"G. Cayma Hakkı Bilgilendirmesi (Hizmet)"}
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>{"Tüketici, sözleşmenin kurulduğu tarihten itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin cayma hakkına sahiptir."}</li>
              <li>{"Cayma süresi dolmadan önce, tüketicinin açık onayı ile hizmetin ifasına başlanması halinde cayma hakkı 6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında istisnaya tabi olabilir."}</li>
              <li>{"Cayma bildirimi destek@yikat.tech e-posta adresi veya 0850 303 31 93 telefon hattı üzerinden yazılı ya da kalıcı veri saklayıcısı ile yapılabilir."}</li>
              <li>{"Cayma hakkı konusunda usulüne uygun bilgilendirme yapılmamış olması halinde cayma süresi mevzuat hükümlerine göre uzayabilir."}</li>
            </ul>
          </section>

          {/* H. Şikayet */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"H. Şikâyet / Uyuşmazlık"}
            </h3>
            <p className="mt-3">
              {"Şikâyet Kanalları: destek@yikat.tech | 0850 303 31 93"}
            </p>
            <p className="mt-2">
              {"Uyuşmazlık halinde Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir."}
            </p>
          </section>

          {/* Divider */}
          <hr className="border-border" />

          {/* BÖLÜM 2 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {"Bölüm 2 – Mesafeli Satış Sözleşmesi (Hizmet)"}
            </h2>
          </section>

          {/* Madde 1 */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"Madde 1 – Taraflar"}
            </h3>
            <h4 className="mt-4 text-lg font-semibold text-foreground">{"1.1. Satıcı / Sağlayıcı"}</h4>
            <div className="mt-3 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left">
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{"Unvan"}</td>
                    <td className="px-4 py-3">{"Yıkat Laundry – Ahmet Kaan Evrensel"}</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{"Vergi Dairesi / VKN"}</td>
                    <td className="px-4 py-3">{"Sarıgazi V.D. / 3830369314"}</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{"Adres"}</td>
                    <td className="px-4 py-3">{"Çatalmeşe Mah. Saray Cad. No: 98-100H, Çekmeköy / İstanbul"}</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{"Telefon"}</td>
                    <td className="px-4 py-3">{"0850 303 31 93"}</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{"E-posta"}</td>
                    <td className="px-4 py-3">{"destek@yikat.tech"}</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{"Web Sitesi"}</td>
                    <td className="px-4 py-3">{"yikat.tech"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              {"(Bundan böyle Satıcı/Sağlayıcı \"SATICI\", Alıcı/Tüketici \"ALICI\" olarak anılacaktır.)"}
            </p>
          </section>

          {/* Madde 2 */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"Madde 2 – Tanımlar"}
            </h3>
            <p className="mt-3">
              {"İşbu sözleşmenin uygulanmasında ve yorumlanmasında aşağıdaki terimler karşılarındaki anlamları ifade eder:"}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">{"KANUN:"}</strong> {"6502 sayılı Tüketicinin Korunması Hakkında Kanun"}</li>
              <li><strong className="text-foreground">{"YÖNETMELİK:"}</strong> {"Mesafeli Sözleşmeler Yönetmeliği"}</li>
              <li><strong className="text-foreground">{"HİZMET:"}</strong> {"SATICI tarafından sunulan çamaşır yıkama, kurutma, katlama, ütü ve ayakkabı yıkama hizmetlerinin tamamı"}</li>
              <li><strong className="text-foreground">{"ALICI:"}</strong> {"Hizmeti ticari veya mesleki olmayan amaçlarla talep eden gerçek ya da tüzel kişi"}</li>
              <li><strong className="text-foreground">{"SATICI:"}</strong> {"Ticari veya mesleki faaliyetleri kapsamında hizmet sunan gerçek kişi/işletme"}</li>
              <li><strong className="text-foreground">{"SİTE:"}</strong> {"SATICI'ya ait yikat.tech internet sitesi ve/veya sipariş kanalları (WhatsApp vb.)"}</li>
              <li><strong className="text-foreground">{"TARAFLAR:"}</strong> {"SATICI ve ALICI birlikte"}</li>
              <li><strong className="text-foreground">{"SÖZLEŞME:"}</strong> {"İşbu mesafeli satış sözleşmesi"}</li>
            </ul>
          </section>

          {/* Madde 3 */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"Madde 3 – Sözleşmenin Konusu"}
            </h3>
            <p className="mt-3">
              {"3.1. İşbu sözleşmenin konusu, ALICI'nın uzaktan iletişim araçlarıyla (web sitesi, WhatsApp, telefon vb.) verdiği sipariş kapsamında SATICI'nın çamaşır yıkama, kurutma, katlama, ütü ve/veya ayakkabı yıkama hizmetlerini sunmasına ilişkin olarak 6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini düzenlemektir."}
            </p>
            <p className="mt-3">
              {"3.2. ALICI, işbu sözleşmeyi kabul etmekle, sipariş konusu hizmet bedelini ve varsa teslimat/servis ücreti ile vergi gibi ek ücretleri ödeme yükümlülüğü altına girdiğini ve bu konuda bilgilendirildiğini kabul, beyan ve taahhüt eder."}
            </p>
          </section>

          {/* Madde 4 */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"Madde 4 – Sipariş ve Hizmet Bilgileri"}
            </h3>
            <p className="mt-3">{"Hizmet türleri ve kapsamları:"}</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li><strong className="text-foreground">{"Küçük Paket:"}</strong> {"4 kg'a kadar çamaşır yıkama-kurutma-katlama"}</li>
              <li><strong className="text-foreground">{"Standart Paket:"}</strong> {"10 kg'a kadar çamaşır yıkama-kurutma-katlama"}</li>
              <li><strong className="text-foreground">{"Parça Başı Ütü:"}</strong> {"Adet bazında ütüleme"}</li>
              <li><strong className="text-foreground">{"Ayakkabı Yıkama:"}</strong> {"1 çift ayakkabı yıkama"}</li>
            </ul>
          </section>

          {/* Madde 5 */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"Madde 5 – Bedel, Vergiler ve Ek Masraflar"}
            </h3>
            <p className="mt-3">{"5.1. Hizmet fiyatları (tüm vergiler dahil):"}</p>
            <div className="mt-4 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-foreground">{"Hizmet Türü"}</th>
                    <th className="px-4 py-3 text-sm font-semibold text-foreground">{"Birim Fiyat (KDV Dahil)"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">{"Küçük Paket"}</td>
                    <td className="px-4 py-3">{"459,00 TL"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">{"Standart Paket"}</td>
                    <td className="px-4 py-3">{"679,00 TL"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">{"Parça Başı Ütü"}</td>
                    <td className="px-4 py-3">{"30,00 TL / adet"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-foreground">{"Ayakkabı Yıkama"}</td>
                    <td className="px-4 py-3">{"499,00 TL / çift"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              {"5.3. İlan edilen fiyatlar ve vaatler güncelleme yapılana ve değiştirilene kadar geçerlidir. Kampanya fiyatları belirtilen süre sonuna kadar geçerlidir."}
            </p>
          </section>

          {/* Madde 6 */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"Madde 6 – Ödeme ve Faturalandırma"}
            </h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li><strong className="text-foreground">{"6.1. Ödeme Yöntemi:"}</strong> {"Kredi Kartı / Havale / Nakit / Ödeme Linki"}</li>
              <li><strong className="text-foreground">{"6.2. Ödeme Zamanı:"}</strong> {"Hizmet öncesi (sipariş onayında)"}</li>
              <li><strong className="text-foreground">{"6.3. Fatura Türü:"}</strong> {"E-Fatura"}</li>
              <li><strong className="text-foreground">{"6.4. Fatura İletimi:"}</strong> {"ALICI'nın beyan ettiği e-posta adresine elektronik ortamda gönderilir."}</li>
            </ul>
          </section>

          {/* Madde 7 */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"Madde 7 – Hizmetin İfası, Süre ve Teslimat"}
            </h3>
            <p className="mt-3">
              {"7.1. SATICI, hizmeti ödemenin alındığı tarihten itibaren 2 (iki) iş günü içerisinde tamamlamayı hedefler."}
            </p>
            <p className="mt-3">
              {"7.2. Temiz çamaşırlar/ayakkabılar, ödeme alındıktan sonra 48 (kırk sekiz) saat içerisinde ALICI'nın belirttiği teslimat adresine teslim edilir."}
            </p>
            <p className="mt-3">
              {"7.3. Mücbir sebep, teknik arıza veya yoğunluk gibi hallerde gecikme olması durumunda ALICI derhal bilgilendirilir. Yasal azami süre olan 30 (otuz) günlük süre her halükarda aşılmaz."}
            </p>
            <p className="mt-3">
              {"7.4. ALICI, teslimat sırasında hazır bulunmadığı takdirde SATICI edimini tam ve eksiksiz olarak yerine getirmiş sayılır. Teslimatın gerçekleştirilememesinden kaynaklanan gecikmelerden SATICI sorumlu tutulamaz."}
            </p>
          </section>

          {/* Madde 8 */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"Madde 8 – Cayma Hakkı (Hizmet)"}
            </h3>
            <p className="mt-3">
              {"8.1. ALICI, 6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında sözleşmenin kurulduğu tarihten itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin sözleşmeden cayma hakkına sahiptir."}
            </p>
            <p className="mt-3">
              {"8.2. Cayma süresi dolmadan önce, ALICI'nın açık onayı ile hizmetin ifasına başlanması halinde (çamaşırların teslim alınması ve işleme başlanması) cayma hakkı mevzuat kapsamında istisnaya tabi olabilir."}
            </p>
            <p className="mt-3">{"8.3. Cayma bildirimi, aşağıdaki kanallardan yazılı veya kalıcı veri saklayıcısı ile yapılır:"}</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>{"E-posta: destek@yikat.tech"}</li>
              <li>{"Telefon: 0850 303 31 93"}</li>
            </ul>
            <p className="mt-3">{"8.4. Cayma hakkının usulüne uygun olarak kullanılması halinde:"}</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>{"a) SATICI, cayma bildiriminin kendisine ulaştığı tarihten itibaren 14 (on dört) gün içinde almış olduğu toplam bedeli ALICI'ya iade eder."}</li>
              <li>{"b) İade, ALICI'nın ödeme yaptığı araçla aynı yöntemle yapılır."}</li>
            </ul>
            <p className="mt-3">
              {"8.5. Cayma hakkı konusunda usulüne uygun bilgilendirme yapılmamış olması halinde cayma süresi mevzuat hükümlerine göre uzayabilir."}
            </p>
          </section>

          {/* Madde 9 */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"Madde 9 – İptal ve Randevu Değişikliği (Operasyonel Politikalar)"}
            </h3>
            <h4 className="mt-4 text-lg font-semibold text-foreground">{"9.1. Teslim Alma Öncesi İptal"}</h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>{"a) Kurye yola çıkmadan önce yapılan iptallerde hizmet bedeli tamamen iade edilir."}</li>
              <li>{"b) Kurye yola çıktıktan sonra yapılan iptallerde kısmi iade yapılır (kurye/servis bedeli düşülerek)."}</li>
            </ul>
            <p className="mt-2 text-sm italic">
              {"Not: Kurye, sipariş alındıktan yaklaşık 20 dakika sonra yola çıkmaktadır."}
            </p>

            <h4 className="mt-4 text-lg font-semibold text-foreground">{"9.2. Teslim Alma Sonrası İptal"}</h4>
            <p className="mt-2">
              {"Çamaşırlar/ayakkabılar teslim alındıktan sonra hizmetin ifasına başlanmış sayılır. Bu aşamadan sonra iade yapılmaz."}
            </p>

            <h4 className="mt-4 text-lg font-semibold text-foreground">{"9.3. Randevu Değişikliği"}</h4>
            <p className="mt-2">
              {"ALICI, kurye yola çıkmadan önce destek kanalları üzerinden randevu değişikliği talep edebilir."}
            </p>
          </section>

          {/* Madde 10 */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"Madde 10 – Hizmette Ayıp / Şikâyet / Çözüm"}
            </h3>
            <p className="mt-3">
              {"10.1. ALICI, hizmete ilişkin şikâyetlerini teslimattan itibaren 24 (yirmi dört) saat içinde SATICI'ya bildirmekle yükümlüdür."}
            </p>
            <p className="mt-3">{"10.2. Şikâyet Kanalları:"}</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>{"E-posta: destek@yikat.tech"}</li>
              <li>{"Telefon: 0850 303 31 93"}</li>
            </ul>
            <p className="mt-3">{"10.3. SATICI, şikâyeti inceleyerek sonucuna göre aşağıdaki seçeneklerden uygun olanını uygular:"}</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>{"a) Hizmetin yeniden ifası (tekrar yıkama/ütü)"}</li>
              <li>{"b) Hizmet bedelinden indirim"}</li>
              <li>{"c) Bedel iadesi"}</li>
            </ul>
            <p className="mt-3">
              {"10.4. Şikâyet süresinin geçirilmesi halinde SATICI, şikâyeti değerlendirme hakkını saklı tutar."}
            </p>
          </section>

          {/* Madde 11 */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"Madde 11 – Alıcı Yükümlülükleri ve Önemli Uyarılar"}
            </h3>
            <p className="mt-3">
              {"11.1. ALICI, teslim ettiği çamaşır/ayakkabıların ceplerini kontrol etmekle yükümlüdür (para, anahtar, kalem, elektronik cihaz vb.). Ceplerde kalan eşyalardan SATICI sorumlu tutulamaz."}
            </p>
            <p className="mt-3">
              {"11.2. Bakım etiketi bulunmayan veya yıkama talimatı belirsiz olan hassas ürünlerde oluşabilecek riskler ALICI'ya bildirilir. ALICI'nın bu ürünleri yine de yıkatma talebi halinde sorumluluk ALICI'ya aittir."}
            </p>
            <p className="mt-3">
              {"11.3. Tekstil kaynaklı riskler (renk atması, çekme, bozulma, kalıcı deformasyon vb.) ürünün yapısından kaynaklanabilir. SATICI, hizmeti makul mesleki özenle sunar; ancak tekstilin doğasından kaynaklanan sonuçları garanti etmez."}
            </p>
            <p className="mt-3">
              {"11.4. ALICI, sipariş sırasında verdiği iletişim bilgilerinin doğru ve güncel olduğunu taahhüt eder."}
            </p>
          </section>

          {/* Madde 12 */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"Madde 12 – Kişisel Verilerin Korunması"}
            </h3>
            <p className="mt-3">
              {"12.1. ALICI'nın kişisel verileri, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında işlenir."}
            </p>
            <p className="mt-3">
              {"12.2. Kişisel verilerin işlenme amaçları, saklanma süreleri ve ALICI'nın hakları hakkında detaylı bilgi SATICI'nın KVKK Aydınlatma Metni'nde yer almaktadır."}
            </p>
            <p className="mt-3">
              {"Erişim: "}
              <Link href="/kvkk" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                {"yikat.tech/kvkk"}
              </Link>
            </p>
          </section>

          {/* Madde 13 */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"Madde 13 – Temerrüt Hali ve Hukuki Sonuçları"}
            </h3>
            <p className="mt-3">
              {"13.1. ALICI, ödeme işlemlerini kredi kartı ile yaptığı durumda temerrüde düştüğü takdirde, kart sahibi banka ile arasındaki kredi kartı sözleşmesi çerçevesinde faiz ödeyeceğini ve bankaya karşı sorumlu olacağını kabul, beyan ve taahhüt eder."}
            </p>
            <p className="mt-3">
              {"13.2. Bu durumda ilgili banka hukuki yollara başvurabilir; doğacak masraflar ve vekâlet ücreti ALICI'dan talep edilebilir. ALICI, bu yükümlülükleri kabul eder."}
            </p>
          </section>

          {/* Madde 14 */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"Madde 14 – Uyuşmazlıkların Çözümü"}
            </h3>
            <p className="mt-3">{"14.1. İşbu sözleşmeden doğan uyuşmazlıklarda şikâyet ve itirazlar, aşağıdaki mercilere yapılır:"}</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>{"Tüketici Hakem Heyetleri (Ticaret Bakanlığı tarafından ilan edilen parasal sınırlar dahilinde)"}</li>
              <li>{"Tüketici Mahkemeleri"}</li>
            </ul>
            <p className="mt-3">
              {"14.2. Başvurular, tüketicinin yerleşim yerinin bulunduğu veya tüketici işleminin yapıldığı yerdeki yetkili mercilere yapılır."}
            </p>
          </section>

          {/* Madde 15 */}
          <section>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {"Madde 15 – Yürürlük ve Kabul"}
            </h3>
            <p className="mt-3">
              {"15.1. İşbu sözleşme, ALICI'nın siparişini onaylaması ve ödemeyi gerçekleştirmesi ile birlikte yürürlüğe girer."}
            </p>
            <p className="mt-3">
              {"15.2. ALICI, işbu sözleşmenin tüm maddelerini ve ön bilgilendirme formunu okuduğunu, anladığını ve kabul ettiğini beyan eder."}
            </p>
            <p className="mt-3">
              {"15.3. Onay yöntemi: Web sitesi onay kutusu / WhatsApp \"okudum, kabul ediyorum\" mesajı"}
            </p>
          </section>

          {/* Divider */}
          <hr className="border-border" />

          {/* BÖLÜM 3 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {"Bölüm 3 – Örnek Cayma Formu (İsteğe Bağlı)"}
            </h2>
            <p className="mt-4">
              {"Bu formun kullanılması zorunlu değildir; tüketici cayma bildirimini yazılı veya kalıcı veri saklayıcısı ile de yapabilir."}
            </p>

            <div className="mt-6 rounded-lg border border-border bg-muted/30 p-6">
              <div className="space-y-3">
                <p><strong className="text-foreground">{"Kime:"}</strong> {"Yıkat Laundry – Ahmet Kaan Evrensel"}</p>
                <p><strong className="text-foreground">{"Adres:"}</strong> {"Çatalmeşe Mah. Saray Cad. No: 98-100H Çekmeköy / İstanbul"}</p>
                <p><strong className="text-foreground">{"E-posta:"}</strong> {"destek@yikat.tech"}</p>
              </div>
              <p className="mt-6">
                {"İşbu form ile aşağıdaki hizmet sözleşmesinden caydığımı bildiririm."}
              </p>
              <div className="mt-4 space-y-2">
                <p>{"Sipariş Tarihi: [          ]"}</p>
                <p>{"Hizmet / Sipariş No: [          ]"}</p>
                <p>{"Tüketici Adı-Soyadı: [          ]"}</p>
                <p>{"Tüketici Adresi: [          ]"}</p>
                <p>{"Tarih: [          ]"}</p>
                <p>{"İmza: [          ] (kâğıt ortamında)"}</p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
