import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular | YIKAT",
  description:
    "YIKAT hakkında merak edilenler: hizmet bölgeleri, fiyatlandırma, teslim süresi, hasar prosedürü, ödeme ve daha fazlası.",
  alternates: { canonical: "https://www.yikat.tech/sss" },
}

const faqs = [
  {
    q: "Hangi bölgelerde hizmet veriyorsunuz?",
    a: "İstanbul Anadolu Yakası’ndan başlıyoruz ve listemiz her hafta büyüyor. Mahalleniz kapsamda mı, uygulamada adresinizi girince anında görürsünüz.",
  },
  {
    q: "Kuru temizleme fiyatları nasıl belirleniyor?",
    a: "Fiyatlar hizmet ve parça bazında, uygulama içinde şeffaf biçimde gösterilir. Adresinizi girdiğinizde size uygun fiyatları net olarak görürsünüz.",
  },
  {
    q: "Hasar olursa ne oluyor?",
    a: "YIKAT Garantisi geçerlidir: memnun kalmazsanız ücretsiz yeniden temizleriz, hasar durumunda açık ve yazılı bir iade prosedürü işletiriz.",
  },
  {
    q: "Ödeme nasıl yapılıyor?",
    a: "Tüm sipariş ve ödeme akışı mobil uygulamada gerçekleşir. Kartınızı bir kez tanımlar, sonraki siparişlerde tek dokunuşla ödersiniz.",
  },
  {
    q: "Sipariş nasıl veriyorum?",
    a: "Uygulamayı indirin, adresinizi girin, hizmeti ve randevu pencerenizi seçin. Kurye kapınızdan alır, temizlenmiş kıyafetlerinizi kapınıza getirir.",
  },
  {
    q: "Teslim süresi ne kadar?",
    a: "Standart siparişlerde kıyafetleriniz 24–48 saat içinde kapınıza teslim edilir.",
  },
  {
    q: "Hassas kıyafetlerimi de temizliyor musunuz?",
    a: "Evet. Seçilmiş partner kuru temizlemecilerimiz, hassas kumaşlar için uygun programları uygular. Tüm parçalarınız fotoğraflı liste ile kayıt altına alınır.",
  },
  {
    q: "Çekmeköy’den de sipariş verebilir miyim?",
    a: "Evet. Çekmeköy operasyonumuz devam ediyor; uygulamadan adresinizi girerek tüm hizmetlerimize ulaşabilirsiniz.",
  },
]

export default function SssPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background pt-32 pb-24 sm:pt-40">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-3xl tracking-tight text-foreground sm:text-4xl">
            Sıkça sorulan sorular
          </h1>
          <p className="mt-3 text-center text-muted-foreground">
            Merak ettiğiniz her şeyi yanıtladık.
          </p>
          <Accordion type="single" collapsible className="mt-12 space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-border bg-card px-5"
              >
                <AccordionTrigger className="py-4 text-left text-sm font-medium text-foreground hover:no-underline sm:text-base">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </>
  )
}
