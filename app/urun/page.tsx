import { SiteShell } from "@/components/website/shared";
import { ProductPage } from "@/components/website/product";
import { BUSINESS_ID, WEBSITE_ID, discoveryMetadata } from "@/lib/discovery";
import { siteConfig } from "@/lib/site";

const description = "Yıkat’ın resmi iPhone uygulamasını indir. Android yayın durumu, uygulama desteği ve Bakırköy ayakkabı temizleme dükkânı bilgileri.";
export const metadata = discoveryMetadata("Yıkat Uygulaması: iPhone ve Android", description, "/urun");

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteConfig.url}/urun#webpage`,
  url: `${siteConfig.url}/urun`,
  name: "Yıkat Uygulaması: iPhone ve Android",
  description,
  inLanguage: "tr-TR",
  isPartOf: { "@id": WEBSITE_ID },
  publisher: { "@id": BUSINESS_ID },
  about: { "@id": BUSINESS_ID },
  significantLink: siteConfig.iosApp.storeUrl,
  // An official link identifies the app without claiming a software rich result
  // (which would require a visible, rights-cleared app review or rating).
};
export default function Product() {
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd).replace(/</g, "\\u003c") }} />
      <ProductPage />
    </SiteShell>
  );
}
