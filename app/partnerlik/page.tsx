import type { Metadata } from "next"
import { ArrowRight, TrendingUp, LayoutDashboard, Gem, Percent, Handshake } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PartnerForm } from "@/components/partner-form"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { trustStats } from "@/lib/site"

export const metadata: Metadata = {
  title: "Partner Ol — Dükkanınıza İstikrarlı Sipariş Trafiği | YIKAT",
  description:
    "YIKAT ile çalışan kuru temizleme partnerleri, kendi mahallelerinde premium müşterilere ulaşır. Sıfır komisyon, kendi fiyatınız, partner sözleşmesi. Başvurun.",
  alternates: { canonical: "https://www.yikat.tech/partnerlik" },
}

const valueProps = [
  {
    icon: Handshake,
    title: "Sıfır komisyon ile başlayın",
    desc: "Biz size müşteri getiriyoruz, siz kendi fiyatınızla çalışıyorsunuz. Başlangıçta komisyon yok.",
  },
  {
    icon: TrendingUp,
    title: "Öngörülebilir sipariş hacmi",
    desc: "Aylık raporlar, hafta bazlı tahmin ve pik dönem hazırlığı ile planlı bir iş akışı.",
  },
  {
    icon: LayoutDashboard,
    title: "Tüm dijital altyapı YIKAT’tan",
    desc: "Sipariş yönetim paneli, kurye organizasyonu, müşteri iletişimi. Siz sadece temizlersiniz.",
  },
  {
    icon: Gem,
    title: "Premium müşteri kümesi",
    desc: "Üst gelir grubu, fiyat duyarlılığı düşük, kalite önceliği yüksek. Ortalama sepet 800–1.500 TL.",
  },
  {
    icon: Percent,
    title: "Aşamalı tedarikçi indirimi",
    desc: "6. ay sonrasında ölçek ve kalite kriterlerini karşılayan partnerlere otomatik toptan indirim. Sözleşmede şeffaf.",
  },
]

const steps = [
  { num: "01", title: "Bilgilendirme", desc: "Başvuru sonrası ekibimiz dükkanınıza gelir, modeli birlikte gözden geçiririz." },
  { num: "02", title: "Sözleşme", desc: "Partner sözleşmesini imzalar, liste fiyatlarınızı netleştiririz." },
  { num: "03", title: "Eğitim", desc: "Sipariş paneli kullanımı, kalite standartları ve kurye iletişimini öğrenirsiniz." },
  { num: "04", title: "İlk sipariş", desc: "Pilot kapsama dahil olursunuz, müşteri trafiği başlar." },
]

const partnerFaqs = [
  {
    q: "Komisyon ne zaman başlar?",
    a: "Başlangıçta sıfır komisyonla çalışırsınız. Komisyon ve aşamalı tedarikçi indirimi koşulları partner sözleşmesinde açıkça tanımlanır; sözlü mutabakatla değişmez.",
  },
  {
    q: "Müşteri benim adımı görür mü?",
    a: "Operasyon YIKAT markası altında yürür. Müşteriye dönük marka deneyimi YIKAT’tır; sizin işiniz temizlik kalitesine odaklanmaktır.",
  },
  {
    q: "Hasar olursa kim öder?",
    a: "Hasar süreci sözleşmede tanımlı açık bir prosedürle işletilir. YIKAT Garantisi müşteri tarafında geçerlidir; partner sorumlulukları sözleşmede netleşir.",
  },
  {
    q: "Sözleşme süresi ne kadar?",
    a: "Standart partner sözleşmesi makul bir başlangıç süresi içerir ve şartları başvuru görüşmesinde paylaşılır.",
  },
  {
    q: "İstediğim zaman çıkabilir miyim?",
    a: "Çıkış koşulları sözleşmede şeffaf biçimde yer alır. Sizi bağlayan gizli madde yoktur.",
  },
  {
    q: "Tedarikçi indirimi nasıl uygulanır?",
    a: "6. ay sonrasında ölçek ve kalite kriterlerini karşılayan partnerlere otomatik toptan indirim devreye girer. Hesaplama yöntemi sözleşmede açıkça yazılıdır.",
  },
  {
    q: "Hangi yazılım/teknolojiyi kullanacağım?",
    a: "Tüm dijital altyapı YIKAT tarafından sağlanır: sipariş yönetim paneli, kurye organizasyonu ve müşteri iletişimi. Ek bir yatırım gerekmez.",
  },
  {
    q: "Vergi/fatura işleyişi nasıl olacak?",
    a: "Faturalandırma ve vergi işleyişi sözleşme aşamasında, mevzuata uygun şekilde netleştirilir.",
  },
]

export default function PartnerlikPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-navy pt-32 pb-20 text-navy-foreground sm:pt-40 sm:pb-24">
          <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <span className="text-xs font-medium uppercase tracking-widest text-primary">
              YIKAT Partner Programı
            </span>
            <h1 className="mt-5 text-balance text-3xl leading-tight tracking-tight text-white sm:text-5xl">
              Dükkanınıza istikrarlı, öngörülebilir kuru temizleme trafiği.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
              YIKAT ile çalışan partnerler, kendi mahallelerinde tanımadıkları
              premium müşterilere ulaşır. Sıfır komisyon, kendi fiyatınız,
              partner sözleşmesi.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 rounded-full bg-white px-7 text-base font-medium text-navy hover:bg-white/90"
            >
              <a href="#basvuru">
                Başvuruyu Doldur
                <ArrowRight className="ml-1 size-4" />
              </a>
            </Button>
          </div>
        </section>

        {/* Value props */}
        <section className="bg-background py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl tracking-tight text-foreground sm:text-4xl">
              Neden YIKAT partneri olmalısınız
            </h2>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {valueProps.map((v) => (
                <div
                  key={v.title}
                  className="flex flex-col rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-md"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                    <v.icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works (partner) */}
        <section className="bg-muted py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl tracking-tight text-foreground sm:text-4xl">
              Başvurudan ilk siparişe
            </h2>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div key={s.num} className="flex flex-col">
                  <span className="text-5xl font-medium tracking-tight text-primary/20">{s.num}</span>
                  <h3 className="mt-3 text-lg font-medium text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="bg-background py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl tracking-tight text-foreground sm:text-3xl">
              Çekmeköy’de kanıtlanmış bir operasyon
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              1+ yıllık saha deneyimi ve binlerce tamamlanan sipariş. Anlaşmalı
              partner dükkanlarımızla büyüyoruz.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {trustStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-card p-6">
                  <div className="text-3xl tracking-tight text-foreground">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application form */}
        <section id="basvuru" className="bg-muted py-20 sm:py-28">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl tracking-tight text-foreground sm:text-4xl">
                Partner başvurusu
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Formu doldurun, 48 saat içinde ekibimiz size dönüş yapsın.
              </p>
            </div>
            <div className="mt-10">
              <PartnerForm />
            </div>
          </div>
        </section>

        {/* Partner FAQ */}
        <section className="bg-background py-20 sm:py-28">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-3xl tracking-tight text-foreground sm:text-4xl">
              Partner soruları
            </h2>
            <Accordion type="single" collapsible className="mt-12 space-y-3">
              {partnerFaqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`pf-${i}`}
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
        </section>
      </main>
      <Footer />
    </>
  )
}
