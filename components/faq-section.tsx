"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

/** Homepage preview — first 4 required questions (Brief §5.11). Full list at /sss. */
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
]

export function FaqSection() {
  return (
    <section id="sss" className="bg-muted py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl tracking-tight text-foreground sm:text-4xl"
        >
          Sıkça sorulan sorular
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="space-y-3">
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

          <div className="mt-8 text-center">
            <a
              href="/sss"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Tüm soruları gör
              <ArrowRight className="size-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
