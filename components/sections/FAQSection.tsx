"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionReveal, revealItem } from "@/components/SectionReveal"

// 6 FAQs: the 4 in layout.tsx FAQPage schema (verbatim) + 2 more.
// DO NOT change these question texts without also updating app/layout.tsx's
// FAQPage structured data to match — Google penalises schema/content drift.
const faqs = [
  {
    q: "YIKAT nedir?",
    a: "YIKAT, çamaşır ve ayakkabı temizliğini kapıdan alıp kapıya teslim eden bir hizmet servisidir. Kilo bazlı fiyatlandırma ile çalışır.",
  },
  {
    q: "Hangi bölgelerde hizmet veriyorsunuz?",
    a: "Şu an Çekmeköy'de hizmet vermekteyiz. Hizmet bölgemizi sürekli genişletiyoruz.",
  },
  {
    q: "Çamaşırlarım ne kadar sürede teslim edilir?",
    a: "Standart siparişlerde teslim süresi 24–48 saattir.",
  },
  {
    q: "Ödeme nasıl yapılıyor?",
    a: "Nakit, kredi kartı veya havale ile ödeme yapabilirsiniz.",
  },
  {
    q: "Hassas kıyafetlerimi de yıkayabilir misiniz?",
    a: "Evet, hassas kıyafetleriniz için özel yıkama programları uyguluyoruz. İpek, yün ve benzeri hassas kumaşlar için uygun deterjan ve sıcaklık ayarları kullanılmaktadır.",
  },
  {
    q: "WhatsApp ile nasıl sipariş verebilirim?",
    a: "WhatsApp hattımıza mesaj atmanız yeterli. Adresinizi ve uygun zamanı belirtirseniz ekibimiz kapınıza gelir.",
  },
]

export function FAQSection() {
  return (
    <SectionReveal
      id="sss"
      ariaLabel="Sıkça sorulan sorular"
      className="py-24 pl-6 pr-6 md:py-32 lg:pl-[480px] lg:pr-[10vw]"
    >
      <div className="mx-auto max-w-3xl">
        <motion.h2
          variants={revealItem}
          className="font-serif text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl md:text-6xl"
        >
          Sorular
        </motion.h2>

        <motion.div variants={revealItem} className="mt-12">
          <Accordion type="single" collapsible className="divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b-0">
                <AccordionTrigger className="py-5 text-left font-serif text-lg font-medium text-[#0F172A] hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-[#64748B]">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </SectionReveal>
  )
}
