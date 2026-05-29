import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { TrustBand } from "@/components/trust-band"
import { ServicesSection } from "@/components/services-section"
import { HowItWorks } from "@/components/how-it-works"
import { WhyYikat } from "@/components/why-yikat"
import { AreaTeaser } from "@/components/area-teaser"
import { Testimonials } from "@/components/testimonials"
import { AppBand } from "@/components/app-band"
import { PartnerCta } from "@/components/partner-cta"
import { FaqSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBand />
        <ServicesSection />
        <HowItWorks />
        <WhyYikat />
        <AreaTeaser />
        <Testimonials />
        <AppBand />
        <PartnerCta />
        <FaqSection />
      </main>
      <Footer />
    </>
  )
}
