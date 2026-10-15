import type { Metadata } from "next"

import { LegalBlocks, type LegalBlock } from "@/components/legal/legal-blocks"
import { LegalPageShell } from "@/components/legal/legal-page-shell"
import legal from "@/lib/legal-content.json"

// Generated legal text (source of truth: yikat-app docs.ts via
// scripts/generate-legal-content.mjs). Published here so references from the
// contract, refund and privacy texts resolve on www.yikat.tech. No wording is
// written in this file.

const path = "/kullanim-kosullari"

export const metadata: Metadata = {
  title: "Üyelik ve Kullanım Koşulları - Yıkat",
  description: "Yıkat üyelik ve kullanım koşulları: hizmet kapsamı, teslim alma ve teslim, sorumluluk, hasar bildirimi ve yeniden yıkama.",
  alternates: { canonical: `https://www.yikat.tech${path}` },
}

export default function KullanimKosullariPage() {
  const doc = legal.docs.kullanim
  return (
    <LegalPageShell title={doc.heading} currentHref={path}>
      <LegalBlocks blocks={doc.blocks as LegalBlock[]} currentHref={path} />
    </LegalPageShell>
  )
}
