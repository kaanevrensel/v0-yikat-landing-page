"use client"

import { MotionConfig } from "framer-motion"
import { DialNavigator } from "@/components/DialNavigator"
import { HeroSection } from "@/components/sections/HeroSection"
import { ServicesSection } from "@/components/sections/ServicesSection"
import { HowItWorksSection } from "@/components/sections/HowItWorksSection"
import { PricingSection } from "@/components/sections/PricingSection"
import { WhyUsSection } from "@/components/sections/WhyUsSection"
import { ReviewsSection } from "@/components/sections/ReviewsSection"
import { FAQSection } from "@/components/sections/FAQSection"
import { CTASection } from "@/components/sections/CTASection"
import { Footer } from "@/components/footer"

const WHATSAPP_URL =
  "https://wa.me/908503033193?text=Merhaba%2C%20sipari%C5%9F%20vermek%20istiyorum."

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <DialNavigator />
      <main>
        <HeroSection />
        <ServicesSection />
        <HowItWorksSection />
        <PricingSection />
        <WhyUsSection />
        <ReviewsSection />
        <FAQSection />
        <CTASection whatsappUrl={WHATSAPP_URL} />
      </main>
      <Footer />
    </MotionConfig>
  )
}
