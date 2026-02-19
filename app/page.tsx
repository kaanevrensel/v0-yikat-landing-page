import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { PricingSection } from "@/components/pricing-section"
import { WhyYikat } from "@/components/why-yikat"
import { FaqSection } from "@/components/faq-section"
import { CtaBand } from "@/components/cta-band"
import { Footer } from "@/components/footer"

const WHATSAPP_URL =
  "https://wa.me/908503033193?text=Merhaba%2C%20sipari%C5%9F%20vermek%20istiyorum."

export default function Home() {
  return (
    <>
      <Navbar whatsappUrl={WHATSAPP_URL} />
      <main>
        <HeroSection whatsappUrl={WHATSAPP_URL} />
        <HowItWorks />
        <PricingSection whatsappUrl={WHATSAPP_URL} />
        <WhyYikat />
        <FaqSection />
        <CtaBand whatsappUrl={WHATSAPP_URL} />
      </main>
      <Footer />
    </>
  )
}
