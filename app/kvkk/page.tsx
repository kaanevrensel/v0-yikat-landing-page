import type { Metadata } from "next"

import { LegalBlocks, type LegalBlock } from "@/components/legal/legal-blocks"
import { LegalPageShell } from "@/components/legal/legal-page-shell"
import legal from "@/lib/legal-content.json"

// KVKK Aydınlatma Metni. The notice itself is the app's canonical text
// (lib/legal-content.json, generated from yikat-app docs.ts) — the same document
// the privacy policy and consent texts cite by section number. It replaced the
// pre-pivot notice on 2026-10-12 (owner request: that text still described an
// own laundry, website ordering and the İkas storefront).
//
// `websiteNotice` is the only wording authored in this repository: the few
// processing activities that exist on www.yikat.tech and not in the app. Keep it
// factual and in step with the code (partner form, contact links, Vercel
// Analytics) and have counsel review any change.

const path = "/kvkk"
const WEBSITE_NOTICE_DATE = "15 Ekim 2026"

const websiteNotice: LegalBlock[] = [
  {
    type: "paragraph",
    text: "Yukarıdaki metin, Yıkat mobil uygulaması üzerinden yürütülen işlemeleri kapsar. www.yikat.tech web sitesini ziyaret ettiğinizde veya bize site üzerinden ulaştığınızda ayrıca yalnızca aşağıdaki sınırlı işlemeler yapılır. Web sitesinde üyelik oluşturulmaz, sipariş ve ödeme alınmaz.",
  },
  {
    type: "bullets",
    items: [
      "İş ortaklığı başvuru formu: formda paylaştığınız işletme adı, ad-soyad, telefon, e-posta ve verdiğiniz hizmetlere ilişkin bilgiler; başvurunuzu değerlendirmek ve sizinle iletişime geçmek amacıyla işlenir (KVKK md. 5/2-c). Başvuru kaydı, §6’da açıklanan veritabanı altyapısında saklanır.",
      "Telefon, WhatsApp ve e-posta: bize bu kanallardan ulaştığınızda iletişim bilgileriniz ve mesajınızın içeriği, talebinizi yanıtlamak ve destek kaydını tutmak amacıyla işlenir (KVKK md. 5/2-c ve 5/2-f).",
      "Site kullanım ölçümü: hangi sayfaların görüntülendiği ve hangi bağlantılara (örneğin WhatsApp veya yol tarifi) dokunulduğu, Vercel Web Analytics ile toplu istatistik olarak ölçülür. Bu ölçümde çerez kullanılmaz ve ölçüm sizi kimliklendirmek için kullanılmaz; siteyi iyileştirmeye yönelik meşru menfaatimize dayanır (KVKK md. 5/2-f).",
      "Barındırma: web sitesi Vercel altyapısında barındırılır; bu sağlayıcının sunucuları yurt dışındadır. Erişim sırasında oluşan teknik kayıtlar (IP adresi, tarayıcı ve cihaz bilgisi) sitenin güvenliği ve işleyişi için işlenir (KVKK md. 5/2-f).",
    ],
  },
  {
    type: "paragraph",
    text: "Web sitesine ilişkin talepleriniz için de §9’daki başvuru yolunu kullanabilirsiniz.",
  },
]

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni - Yıkat",
  description:
    "Yıkat Kişisel Verilerin İşlenmesine İlişkin Aydınlatma Metni. 6698 sayılı KVKK kapsamında haklarınız.",
  alternates: { canonical: `https://www.yikat.tech${path}` },
}

export default function KvkkPage() {
  const doc = legal.docs.kvkk
  return (
    <LegalPageShell title={doc.heading} subtitle={doc.subtitle} currentHref={path}>
      <LegalBlocks blocks={doc.blocks as LegalBlock[]} currentHref={path} />

      <h2 id="web-sitesi" className="mt-10 text-xl font-semibold text-foreground sm:text-2xl">
        {"Web Sitesi (www.yikat.tech)"}
      </h2>
      <p className="mt-4">{`Son güncelleme: ${WEBSITE_NOTICE_DATE}`}</p>
      <LegalBlocks blocks={websiteNotice} currentHref={path} />
    </LegalPageShell>
  )
}
