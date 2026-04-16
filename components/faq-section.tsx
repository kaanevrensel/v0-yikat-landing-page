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
    q: "Çamaşırlarımı nasıl teslim ediyorsunuz?",
    a: "Siparişinizi oluşturduktan sonra belirlediğiniz zaman aralığında adresinize geliyoruz. Çamaşırlarınızı özel torbalarda teslim alıp, yıkama işlemi tamamlandıktan sonra aynı şekilde kapınıza getiriyoruz.",
  },
  {
    q: "Hangi bölgelerde hizmet veriyorsunuz?",
    a: "Şu anda Çekmeköy'de hizmet vermekteyiz. Hizmet bölgemizi sürekli genişletiyoruz. Detaylı bilgi için destek hattımızla iletişime geçebilirsiniz.",  
  }, 
  {
    q: "Hassas kıyafetlerimi de yıkayabilir misiniz?",
    a: "Evet, hassas kıyafetleriniz için özel yıkama programları uyguluyoruz. İpek, yün ve benzeri hassas kumaşlar için uygun deterjan ve sıcaklık ayarları kullanılmaktadır.",
  },
  {
    q: "Çamaşırlarım ne kadar sürede teslim edilir?",
    a: "Standart siparişlerde çamaşırlarınız 24–48 saat içinde teslim edilir. Yoğun dönemlerde bu süre en fazla 48 saate uzayabilir.", 
  },
  {
    q: "Ödeme nasıl yapılıyor?",
    a: "Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Ödeme, sipariş oluşturma aşamasında veya teslimat sırasında gerçekleştirilebilir.",
  },
  {
    q: "Kıyafetlerime zarar gelirse ne olur?",
    a: "Profesyonel ekibimiz her kıyafeti titizlikle inceleyerek uygun yıkama programını uygular. Herhangi bir sorun yaşanması durumunda müşterimizle iletişime geçerek çözüm sunuyoruz.",
  },
  {
    q: "Çamaşır yıkama fiyatları nasıl hesaplanıyor?",
    a: "Kilo bazlı fiyatlandırma uyguluyoruz. 4 kg ve üzeri siparişlerde ücretsiz servis sunuyoruz. Güncel fiyatlar için WhatsApp hattımızdan bilgi alabilirsiniz.",
  },
  {
    q: "Ayakkabı temizleme servisi nasıl işliyor?",
    a: "Ayakkabılarınızı kapınızdan teslim alıyor, profesyonel ekibimizle temizleyip 24–48 saat içinde kapınıza teslim ediyoruz.",
  },
  {
    q: "WhatsApp ile nasıl sipariş verebilirim?",
    a: "WhatsApp hattımıza mesaj atmanız yeterli. Adresinizi ve uygun zamanı belirtirseniz ekibimiz kapınıza gelir.",
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
            {"Sıkça Sorulan Sorular"}
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            {"Merak ettiğiniz her şeyi yanıtladık"}
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
