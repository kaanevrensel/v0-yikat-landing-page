import Link from "next/link"
import { CASE_GALLERY_PATH, caseReel, customerCases, publishableCases, publishableReel } from "@/lib/customer-cases"
import { CaseArticle, CaseReelFigure } from "@/components/discovery/case-parts"

/** Short section on /ayakkabi-temizleme: the film, up to three featured cases and the way to the rest.
 * Renders nothing while no case has a reviewed publication permission. */
export function CustomerCases() {
  const cases = publishableCases(customerCases)
  if (!cases.length) return null
  const reel = publishableReel(caseReel, cases)
  const marked = cases.filter(item => item.featured)
  const shown = (marked.length ? marked : cases).slice(0, 3)
  // The way to the full gallery sits beside the heading and again after the cases.
  const more = cases.length > shown.length
    ? <p className="customer-cases-more"><Link className="discovery-inline-link" href={CASE_GALLERY_PATH}>{cases.length} çiftin hepsine bak</Link></p>
    : null
  return <section className="customer-cases" id="sonuclar" aria-labelledby="cases-title">
    <div className={`customer-cases-head${reel ? "" : " customer-cases-head-solo"}`}>
      <div className="customer-cases-intro">
        <h2 id="cases-title">Dükkândan önce ve sonra.</h2>
        <p>Her çift farklı; burada gördüğün sonuçlar yalnızca bu ayakkabılara ait.</p>
        {more}
      </div>
      {reel && <CaseReelFigure reel={reel}/>}
    </div>
    {shown.map(item => <CaseArticle key={item.slug} item={item}/>)}
    {more}
  </section>
}
