"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "Camasirlarimi nasil teslim ediyorsunuz?",
    a: "Siparisinizi olusturduktan sonra belirlediginiz zaman araliginda adresinize geliyoruz. Camasirlarinizi ozel torbalarda teslim alip, yikama islemi tamamlandiktan sonra ayni sekilde kapiniza getiriyoruz.",
  },
  {
    q: "Hangi bolgelerde hizmet veriyorsunuz?",
    a: "Su anda Istanbul'un Anadolu ve Avrupa yakasinda secili bolgelerde hizmet vermekteyiz. Hizmet bolgemizi surekli genisletiyoruz. Detayli bilgi icin destek hattimizi arayabilirsiniz.",
  },
  {
    q: "Hassas kiyafetlerimi de yikayabilir misiniz?",
    a: "Evet, hassas kiyafetleriniz icin ozel yikama programlari uyguluyoruz. Ipek, yun ve benzeri hassas kumaslar icin uygun deterjan ve sicaklik ayarlari kullanilmaktadir.",
  },
  {
    q: "Camasirlarim ne kadar surede teslim edilir?",
    a: "Standart siparislerde camasirlariniz 24 saat icinde teslim edilir. Yogun donemlerde bu sure en fazla 36 saate uzayabilir.",
  },
  {
    q: "Odeme nasil yapiliyor?",
    a: "Kredi karti, banka karti ve havale/EFT ile odeme yapabilirsiniz. Odeme, siparis olusturma asamasinda veya teslimat sirasinda gerceklestirilebilir.",
  },
  {
    q: "Kiyafetlerime zarar gelirse ne olur?",
    a: "Profesyonel ekibimiz her kiyafeti titizlikle inceleyerek uygun yikama programini uygular. Herhangi bir sorun yasanmasi durumunda musterimizle iletisime gecerek cozum sunuyoruz.",
  },
]

export function FaqSection() {
  return (
    <section id="sss" className="bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {"Sikca Sorulan Sorular"}
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            {"Merak ettiginiz her seyi yanitladik"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-border bg-background px-5 last:border-b"
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
        </motion.div>
      </div>
    </section>
  )
}
