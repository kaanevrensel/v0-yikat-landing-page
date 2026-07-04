import { MotionProvider } from "@/components/motion-provider"
import { Navbar } from "@/components/navbar"
import { HeroScrollStory } from "@/components/hero-scroll-story"
import { ValueBand } from "@/components/value-band"
import { HowItWorks } from "@/components/how-it-works"
import { BeforeAfter } from "@/components/before-after"
import { PriceMenu } from "@/components/price-menu"
import { VisitSection } from "@/components/visit-section"
import { FaqSection } from "@/components/faq-section"
import { ComingSoonBand } from "@/components/coming-soon-band"
import { Footer } from "@/components/footer"
import { faqs } from "@/lib/site"

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.slice(0, 4).map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <MotionProvider>
        <Navbar />
        <main>
          <HeroScrollStory />
          <ValueBand />
          <HowItWorks />
          <BeforeAfter />
          <PriceMenu />
          <VisitSection />
          <FaqSection />
          <ComingSoonBand />
        </main>
        <Footer />
      </MotionProvider>
    </>
  )
}
