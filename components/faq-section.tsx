"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqs } from "@/lib/site"
import BlurText from "@/components/blur-text"

export function FaqSection() {
  return (
    <section id="sss" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <BlurText
          as="h2"
          text="Sıkça sorulan sorular"
          animateBy="words"
          delay={60}
          className="text-center text-3xl font-semibold tracking-tight md:text-4xl"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10"
        >
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                {/* İç mikro-reveal kaldırıldı: forceMount ile içerik hep DOM'da olduğundan
                    mount-animasyonu yalnız ilk yüklemede (görünmezken) çalışırdı; açılışın
                    anlatıcısı accordion-down yükseklik animasyonu. */}
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
