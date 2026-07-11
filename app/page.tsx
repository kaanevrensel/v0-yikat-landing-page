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
        {/* WCAG 2.4.1: sticky nav + 300vh hero'yu klavyeyle atlama yolu. */}
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#2563eb] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          İçeriğe atla
        </a>
        <BubbleCursor />
        <Navbar />
        <main id="icerik" tabIndex={-1}>
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
