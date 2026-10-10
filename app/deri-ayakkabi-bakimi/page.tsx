import { ServicePageView } from "@/components/service-page"
import { serviceBySlug } from "@/lib/services"
import { discoveryMetadata } from "@/lib/discovery"

const service = serviceBySlug("deri-ayakkabi-bakimi")!
export const metadata = discoveryMetadata(service.metaTitle.replace(/ \| Yıkat$/, ""), service.metaDescription, `/${service.slug}`)
export default function Page() { return <ServicePageView service={service}/> }
