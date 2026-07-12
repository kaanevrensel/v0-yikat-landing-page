import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { MotionProvider } from "@/components/motion-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroCtas } from "@/components/hero-scroll-story"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { siteConfig } from "@/lib/site"
import type { Service } from "@/lib/services"

// Hizmet sayfası şablonu (Faz 6 — sahip onayı 2026-07-12): her sayfa TEK sorgu ailesini hedefler,
// içerik yalnız doğrulanmış beyanlar + dürüst genel bilgiler (uydurma iddia yasak). Adım numaraları
// gerçek bir sıralamayı anlattığı için meşru (impeccable kuralı).
export function serviceJsonLd(service: Service) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `${service.nav} — YIKAT`,
      serviceType: service.nav,
      url: `${siteConfig.url}/${service.slug}`,
      provider: { "@type": "DryCleaningOrLaundry", "@id": siteConfig.url, name: "YIKAT" },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Bakırköy" },
        { "@type": "City", name: "İstanbul" },
      ],
      offers: {
        "@type": "Offer",
        priceSpecification: { "@type": "PriceSpecification", minPrice: 400, maxPrice: 1000, priceCurrency: "TRY" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: service.nav, item: `${siteConfig.url}/${service.slug}` },
      ],
    },
  ]
}

export function ServicePageView({ service }: { service: Service }) {
  return (
    <>
      {serviceJsonLd(service).map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block).replace(/</g, "\\u003c") }}
        />
      ))}
      <MotionProvider>
        <Navbar />
        <main>
          {/* Giriş bandı */}
          <section className="relative flex min-h-[64vh] items-end overflow-hidden pb-14 pt-32">
            <img
              src={service.heroImg}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              fetchPriority="high"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0b2a66]/85 via-[#0b2a66]/35 to-transparent" />
            <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-6">
              {/* Görsel üstündeki metinler clear-glass çerçevede (sahip isteği 2026-07-12);
                  kemer globals.css'te (.hero-glass-card) */}
              <div className="hero-glass-card inline-block max-w-3xl rounded-3xl border border-white/35 bg-white/10 px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_30px_rgba(4,44,83,0.18)] backdrop-blur-[3px] backdrop-saturate-150">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90 underline-offset-4 hover:underline"
                >
                  <ArrowLeft className="size-4" /> Ana sayfa
                </Link>
                {/* h1 verideki \n ile satır kırar (whitespace-pre-line) — deri sayfasında \n yok, tek satır kalır */}
                <h1 className="mt-4 whitespace-pre-line text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  {service.h1}
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-lg text-white">{service.intro}</p>
              </div>
              <div className="mt-8 flex justify-start [&>div]:justify-start">
                <HeroCtas eventPrefix={`svc_${service.slug.replaceAll("-", "_")}`} />
              </div>
            </div>
          </section>

          {/* Evde denemenin riskleri */}
          <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Evde denemek neden riskli?</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {service.risks.map((r) => (
                <div key={r.title} className="rounded-2xl border bg-card p-5">
                  <h3 className="font-semibold">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Süreç — gerçek sıralama, numara meşru */}
          <section className="bg-muted py-16 sm:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Dükkânda nasıl ilerliyor?</h2>
              <ol className="mt-8 space-y-4">
                {service.steps.map((s, i) => (
                  <li key={s.title} className="flex items-start gap-4 rounded-2xl border bg-card px-5 py-4">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              {/* Dürüst sınırlar — güven, abartıyla değil netlikle kurulur */}
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="font-semibold text-amber-900">Dürüst notlar</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-amber-900/90">
                  {service.notes.map((n) => (
                    <li key={n}>• {n}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* SSS */}
          <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Sıkça sorulanlar</h2>
            <div className="mt-6">
              <Accordion type="single" collapsible>
                {service.faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`sfaq-${i}`}>
                    <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          {/* Kapanış CTA bandı */}
          <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
            <div className="rounded-3xl bg-navy px-6 py-10 text-center text-white sm:px-12">
              <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
                Eskitme, yıkat.
              </h2>
              <p className="mt-2 text-white">
                {siteConfig.hours.label} · {siteConfig.address.district} çarşı içi
              </p>
              <div className="mt-6 flex justify-center">
                <HeroCtas eventPrefix={`svc_${service.slug.replaceAll("-", "_")}_alt`} />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </MotionProvider>
    </>
  )
}
