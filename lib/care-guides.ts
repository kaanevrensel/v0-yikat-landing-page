import type { CareGuide } from "@/lib/discovery"
import { careGuides } from "./guides"

// Guide content lives in one generated module per guide (lib/guides/<slug>.ts), written by the
// content converter from reviewed JSON; lib/guides/index.ts holds the /rehber hub order.
// Deliberate, individually edited answers. No city/brand permutation generator.
export { careGuides, guideRelease } from "./guides"

const bySlug = new Map<string, CareGuide>(careGuides.map(guide => [guide.slug, guide]))
export const guideBySlug = (slug: string) => bySlug.get(slug)
