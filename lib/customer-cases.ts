/** Reviewed website snapshots only. Source media remains private in the panel.
 * See docs/seo/2026-10-16-local-proof.md before adding or removing a case.
 * `publicationReviewId` is a non-personal editorial reference, never an order,
 * customer or private media ID. Permission evidence stays in the admin system.
 */
export type CustomerCase = {
  slug: string
  title: string
  material: string
  problem: string
  treatment: string
  result: string
  limitations: string
  completedOn: string
  before: { src: string; alt: string; width: number; height: number }
  after: { src: string; alt: string; width: number; height: number }
  publication: {
    publicationReviewId: string
    permissionVerifiedAt: string
    approvedAt: string
    revokedAt: string | null
  }
}

// Intentionally empty: panel photography is not publication permission.
export const customerCases: readonly CustomerCase[] = []

const datePattern = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)?$/
const publicImagePattern = /^\/images\/cases\/[a-z0-9-]+\/(before|after)-[a-f0-9]{12}\.webp$/
const validDate = (value: string) => {
  if (typeof value !== "string" || !datePattern.test(value) || !Number.isFinite(Date.parse(value))) return false
  return new Date(value).toISOString().slice(0, 10) === value.slice(0, 10)
}

export function publishableCases(cases: readonly CustomerCase[], now = Date.now()): CustomerCase[] {
  const seen = new Set<string>()
  return cases.filter(item => {
    const approval = item.publication
    if (!approval || approval.revokedAt !== null ||
      !/^[a-z0-9-]{3,100}$/.test(approval.publicationReviewId) ||
      !validDate(approval.permissionVerifiedAt) || !validDate(approval.approvedAt) ||
      Date.parse(approval.permissionVerifiedAt) > Date.parse(approval.approvedAt) ||
      Date.parse(approval.approvedAt) > now || !validDate(item.completedOn) ||
      Date.parse(item.completedOn) > Date.parse(approval.approvedAt) ||
      !/^[a-z0-9-]{3,100}$/.test(item.slug) || seen.has(item.slug)) return false
    if (![item.title, item.material, item.problem, item.treatment, item.result, item.limitations]
      .every(value => typeof value === "string" && value.trim().length > 0 && value.length <= 900)) return false
    if (![item.before, item.after].every(photo => photo && publicImagePattern.test(photo.src) &&
      photo.src.startsWith(`/images/cases/${item.slug}/`) && typeof photo.alt === "string" && photo.alt.trim().length > 0 &&
      Number.isInteger(photo.width) && Number.isInteger(photo.height) &&
      photo.width >= 320 && photo.width <= 2400 && photo.height >= 320 && photo.height <= 2400)) return false
    if (!item.before.src.includes("/before-") || !item.after.src.includes("/after-") || item.before.src === item.after.src) return false
    seen.add(item.slug)
    return true
  })
}
