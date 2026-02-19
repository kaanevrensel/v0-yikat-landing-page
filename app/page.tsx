"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { PricingSection } from "@/components/pricing-section"
import { WhyYikat } from "@/components/why-yikat"
import { FaqSection } from "@/components/faq-section"
import { CtaBand } from "@/components/cta-band"
import { Footer } from "@/components/footer"
import { OrderDialog } from "@/components/order-dialog"

export default function Home() {
  const [orderOpen, setOrderOpen] = useState(false)

  const handleOrderClick = () => setOrderOpen(true)

  return (
    <>
      <Navbar onOrderClick={handleOrderClick} />
      <main>
        <HeroSection onOrderClick={handleOrderClick} />
        <HowItWorks />
        <PricingSection onOrderClick={handleOrderClick} />
        <WhyYikat />
        <FaqSection />
        <CtaBand onOrderClick={handleOrderClick} />
      </main>
      <Footer />
      <OrderDialog open={orderOpen} onOpenChange={setOrderOpen} />
    </>
  )
}
