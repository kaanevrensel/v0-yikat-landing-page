"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionReveal, revealItem } from "@/components/SectionReveal"
import { SECTIONS } from "@/lib/sections"
import { SectionEyebrow } from "@/components/SectionEyebrow"
import { SectionEmoji } from "@/components/SectionEmoji"

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
        {(() => {
          const idx = SECTIONS.findIndex(s => s.id === "sss")
          const meta = SECTIONS[idx]!
          const sectionIndex = idx - 1  // -1 to skip hero for phase-offset purposes
          return (
            <>
              <SectionEyebrow angle={meta.angle} number={meta.number!} label={meta.label} />

              <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[1fr_auto]">
                <motion.h2
                  variants={revealItem}
                  className="text-4xl font-semibold leading-[1.05] tracking-[-0.022em] text-[#0F172A] sm:text-5xl md:text-6xl"
                  style={{ fontVariationSettings: "'opsz' 32" }}
                >
                  Sorular
                </motion.h2>

                <SectionEmoji emoji={meta.emoji!} id={meta.id} index={sectionIndex} />
              </div>

              <motion.div variants={revealItem} className="mt-12">
                <Accordion type="single" collapsible className="divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border-b-0">
                      <AccordionTrigger className="py-5 text-left text-lg font-semibold text-[#0F172A] hover:no-underline hover:bg-[#F5F5F2] -mx-2 px-2 rounded-md transition-colors">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-base leading-relaxed text-[#64748B]">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </>
          )
        })()}
      </div>
    </SectionReveal>
  )
}
