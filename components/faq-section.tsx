"use client"

import { motion, useReducedMotion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqs } from "@/lib/site"
import BlurText from "@/components/blur-text"

export function FaqSection() {
  const prefersReduced = useReducedMotion()
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
                <AccordionContent className="text-muted-foreground">
                  <motion.div
                    initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 6, filter: "blur(4px)" }}
                    animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: prefersReduced ? 0.15 : 0.25, ease: "easeOut" }}
                  >
                    {f.a}
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
