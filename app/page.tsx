import { MotionProvider } from "@/components/motion-provider"
import { BubbleCursor } from "@/components/bubble-cursor"
import { Navbar } from "@/components/navbar"
import { HeroScrollStory } from "@/components/hero-scroll-story"
import { ValueBand } from "@/components/value-band"
import { HowItWorks } from "@/components/how-it-works"
import { PriceMenu } from "@/components/price-menu"
import { FoamDivider } from "@/components/foam-divider"
import { VisitSection } from "@/components/visit-section"
import { FaqSection } from "@/components/faq-section"
import { ComingSoonBand } from "@/components/coming-soon-band"
import { Footer } from "@/components/footer"
import { faqs } from "@/lib/site"

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  // Tüm SSS şemada: fiyat/saat/ödeme/konum soruları tam da yerel arama sorgularıyla eşleşenler.
  mainEntity: faqs.map((f) => ({
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
        <BubbleCursor />
        <Navbar />
        <main>
          <HeroScrollStory />
          <FoamDivider className="text-muted" />
          <ValueBand />
          <HowItWorks />
          <FoamDivider flip className="text-muted" />
          <PriceMenu />
          {/* Açık→navy sert kesimlere köpük ritmi (su kimliği) */}
          <FoamDivider className="text-navy" />
          <VisitSection />
          <FaqSection />
          <ComingSoonBand />
          <FoamDivider className="text-navy" />
        </main>
        <Footer />
      </MotionProvider>
    </>
  )
}
