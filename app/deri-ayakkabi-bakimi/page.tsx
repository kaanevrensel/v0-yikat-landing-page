import type { Metadata } from "next"
import { ServicePageView } from "@/components/service-page"
import { serviceBySlug } from "@/lib/services"
import { siteConfig } from "@/lib/site"

const service = serviceBySlug("deri-ayakkabi-bakimi")!

export const metadata: Metadata = {
  title: service.metaTitle,
  description: service.metaDescription,
  alternates: { canonical: `${siteConfig.url}/${service.slug}` },
  openGraph: {
    title: service.metaTitle,
    description: service.metaDescription,
    url: `${siteConfig.url}/${service.slug}`,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "YIKAT, Ayakkabı Yıkama Bakırköy" }],
  },
}

export default function Page() {
  return <ServicePageView service={service} />
}
