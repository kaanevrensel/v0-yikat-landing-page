import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { CASE_GALLERY_PATH, showcaseCases } from "@/lib/customer-cases"

/** The home page's way into the before/after gallery: the clearest published pair, small, and the count.
 * A server component handed to the client home page, so the case data stays out of the browser bundle.
 * Renders nothing while no pair is published. */
export function CaseProofLink() {
  const { shown: [item], total } = showcaseCases(undefined, 1)
  if (!item) return null
  return <Link className="washing-case-link" href={CASE_GALLERY_PATH}>
    <span className="washing-case-pair" aria-hidden="true">
      {[item.before, item.after].map(photo => <Image key={photo.src} src={photo.src} alt="" width={photo.width} height={photo.height} sizes="72px"/>)}
    </span>
    <span className="washing-case-text"><strong>Önce ve sonra</strong>{" "}<span>Dükkândan {total} çift</span></span>
    <ChevronRight aria-hidden="true" size={19}/>
  </Link>
}
