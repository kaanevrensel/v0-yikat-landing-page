// Public addresses of the legal texts on www.yikat.tech. One list drives the
// in-text cross-references (components/legal/legal-blocks.tsx) and the "other
// legal texts" navigation, so a document named in a contract always resolves to
// a page on this site. Never point these at app.yikat.tech.

export type LegalRoute = {
  href: string
  /** Short label for navigation. */
  label: string
  /** Names the generated texts use when they refer to this document, longest first. */
  names: string[]
}

export const legalRoutes: LegalRoute[] = [
  { href: "/mesafeli-satis-sozlesmesi", label: "Mesafeli satış sözleşmesi", names: ["Mesafeli Satış Sözleşmesi", "Ön Bilgilendirme Formu"] },
  { href: "/teslimat-ve-iade", label: "Teslimat ve iade", names: ["İptal ve İade Koşulları"] },
  { href: "/kullanim-kosullari", label: "Kullanım koşulları", names: ["Üyelik ve Kullanım Koşulları", "Kullanım Koşulları"] },
  { href: "/odeme-ve-guvenli-alisveris", label: "Ödeme ve güvenli alışveriş", names: ["Ödeme ve Güvenli Alışveriş"] },
  { href: "/gizlilik-politikasi", label: "Gizlilik politikası", names: ["Gizlilik Politikası"] },
  { href: "/kvkk", label: "KVKK aydınlatma metni", names: ["KVKK Aydınlatma Metni"] },
  { href: "/kvkk-basvuru-formu", label: "KVKK başvuru formu", names: ["KVKK İlgili Kişi Başvuru Formu"] },
  { href: "/acik-riza-metni", label: "Açık rıza metni", names: ["Açık Rıza Metni"] },
  { href: "/kart-saklama-metni", label: "Kart saklama metni", names: ["Kart Saklama Metni"] },
]

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** Longest names first, so "Üyelik ve Kullanım Koşulları" wins over "Kullanım Koşulları". */
const references = legalRoutes
  .flatMap((route) => route.names.map((name) => ({ name, href: route.href })))
  .sort((a, b) => b.name.length - a.name.length)

const referencePattern = new RegExp(`(${references.map((reference) => escape(reference.name)).join("|")})`, "g")

export type LegalTextPart = { text: string; href?: string }

/**
 * Splits a legal sentence into plain text and references to other legal texts.
 * The wording is untouched; a reference to the page being read stays plain text.
 */
export function splitLegalReferences(text: string, currentHref?: string): LegalTextPart[] {
  return text
    .split(referencePattern)
    .filter(Boolean)
    .map((part) => {
      const href = references.find((reference) => reference.name === part)?.href
      return href && href !== currentHref ? { text: part, href } : { text: part }
    })
}
