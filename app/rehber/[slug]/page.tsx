import { notFound } from "next/navigation"
import { careGuides, guideBySlug } from "@/lib/care-guides"
import { discoveryMetadata } from "@/lib/discovery"
import { GuideView } from "@/components/discovery/guide"

export const dynamicParams = false
export function generateStaticParams() { return careGuides.map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const guide = guideBySlug((await params).slug)
  if (!guide) notFound()
  return discoveryMetadata(guide.title, guide.description, `/rehber/${guide.slug}`, true, guide.updated)
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const guide = guideBySlug((await params).slug)
  if (!guide) notFound()
  return <GuideView guide={guide}/>
}
