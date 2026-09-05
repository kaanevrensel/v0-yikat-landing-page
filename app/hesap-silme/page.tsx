import type { Metadata } from "next"
import Link from "next/link"
import { Mail } from "lucide-react"

import { LegalPageShell } from "@/components/legal/legal-page-shell"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Hesap Silme - Yıkat Gitsin",
  description:
    "Yıkat Gitsin (Yıkat) müşteri hesabınızı ve kişisel verilerinizi silmek için uygulamayı yüklemeden talep gönderin. Silinen veriler ve saklama süreleri.",
  alternates: { canonical: `${siteConfig.url}/hesap-silme` },
}

const supportEmail = "destek@yikat.tech"
const deletionSubject = "Yıkat Gitsin — hesap silme talebi"
const deletionBody =
  "Merhaba,\n\nYıkat Gitsin (Yıkat) müşteri hesabımın silinmesini talep ediyorum. Bu e-postayı hesabıma kayıtlı e-posta adresinden gönderiyorum.\n\nSilme talebimin alındığını ve işlem takvimini bildirmenizi rica ederim."
const deletionHref = `mailto:${supportEmail}?subject=${encodeURIComponent(deletionSubject)}&body=${encodeURIComponent(deletionBody)}`

/** Public support-request route. It does not schedule a deletion or collect credentials. */
export default function HesapSilmePage() {
  return (
    <LegalPageShell title="Hesap silme" subtitle="Yıkat Gitsin (Yıkat) müşteri hesabınız ve kişisel verileriniz">
      <p className="max-w-prose">
        Uygulamayı yüklemeden de hesabınızın silinmesini isteyebilirsiniz. Aşağıdaki adımlarla
        destek ekibimize ulaşın veya uygulamadaki hesap silme seçeneğini kullanın.
      </p>

      <section aria-labelledby="request-heading" className="mt-8 max-w-prose space-y-4">
        <h2 id="request-heading" className="text-xl font-semibold text-foreground sm:text-2xl">
          E-posta ile silme talebi
        </h2>
        <ol className="list-decimal space-y-3 pl-5">
          <li>
            Hesabınıza kayıtlı e-posta adresinden <strong className="text-foreground">{supportEmail}</strong>{" "}
            adresine, konusu <strong className="text-foreground">“Hesap silme talebi”</strong> olan bir e-posta gönderin.
          </li>
          <li>
            Mesajınızda Yıkat müşteri hesabınızı silmek istediğinizi belirtin. Kayıtlı e-posta
            adresinize erişemiyorsanız bunu yazın; destek ekibimiz hesap sahipliğini doğrulamak için yardımcı olur.
          </li>
          <li>
            Hesap sahipliği doğrulandıktan sonra talebiniz, uygulamadaki hesap silme seçeneğiyle
            aynı silme ve anonimleştirme sürecine alınır. Talebinizin durumu e-posta ile bildirilir.
          </li>
        </ol>
        <a
          href={deletionHref}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1f5eb8] px-5 py-3 font-medium text-white hover:bg-[#194d97] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f5eb8]"
        >
          <Mail className="size-5 shrink-0" aria-hidden />
          Silme talebi için e-posta yaz
        </a>
        <p>
          Bu bağlantı e-posta uygulamanızı açar. Talebin ulaşması için e-postayı göndermeniz gerekir;
          bağlantıya dokunmak hesabınızı silmez. E-posta uygulaması açılmazsa yukarıdaki adrese kendiniz yazabilirsiniz.
        </p>
        <p>Şifrenizi, doğrulama kodunuzu veya kart bilgilerinizi göndermeyin.</p>
      </section>

      <section aria-labelledby="in-app-heading" className="mt-10 max-w-prose space-y-3">
        <h2 id="in-app-heading" className="text-xl font-semibold text-foreground sm:text-2xl">
          Uygulamadan silme
        </h2>
        <p>
          Yıkat’a giriş yapın. <strong className="text-foreground">Profil → Hesap bilgilerim → Hesabımı sil</strong>{" "}
          yolunu izleyip onay ekranındaki bilgileri okuyarak talebinizi onaylayın.
          Bu işlem de aynı silme sürecini başlatır.
        </p>
      </section>

      <section aria-labelledby="data-heading" className="mt-10 max-w-prose space-y-3">
        <h2 id="data-heading" className="text-xl font-semibold text-foreground sm:text-2xl">
          Hangi veriler silinir, hangileri saklanır?
        </h2>
        <ul className="list-disc space-y-3 pl-5">
          <li>
            Müşteri profilinizdeki ad, soyad, telefon ve e-posta bilgileri anonimleştirilir.
            Kayıtlı açık adres, teslimat tarifi, alıcı iletişim bilgileri ve adres koordinatları kaldırılır.
          </li>
          <li>Bildirim kayıtları, bildirim tercihleri, müşteri hesabınıza bağlı cihaz bildirim kayıtları ve favori siparişleriniz silinir.</li>
          <li>
            Geçmiş siparişler ile yasal saklama zorunluluğu bulunan işlem kayıtları,
            mevzuatın gerektirdiği süre boyunca (10 yıla kadar) saklanır. Hesap silme, bu kayıtların hemen kaldırılması anlamına gelmez.
          </li>
        </ul>
      </section>

      <section aria-labelledby="timing-heading" className="mt-10 max-w-prose space-y-3">
        <h2 id="timing-heading" className="text-xl font-semibold text-foreground sm:text-2xl">Ne kadar sürer?</h2>
        <p>
          Silme talebi oluşturulduktan sonra yaklaşık 30 günlük bekleme süresinin sonunda
          anonimleştirme yapılır. Bu süre içinde tekrar giriş yaparak silme talebinizi iptal edebilirsiniz.
          E-posta yoluyla gönderilen taleplerde önce hesap sahipliğiniz doğrulanır.
        </p>
        <p>
          Verilerin işlenmesi ve saklanması hakkında ayrıntılar için{" "}
          <Link href="/gizlilik-politikasi" className="font-medium text-foreground underline underline-offset-4">
            Gizlilik Politikası
          </Link>{" "}
          ve{" "}
          <Link href="/kvkk" className="font-medium text-foreground underline underline-offset-4">
            KVKK Aydınlatma Metni
          </Link>{" "}
          sayfalarını inceleyebilirsiniz.
        </p>
      </section>
    </LegalPageShell>
  )
}
