import type { Metadata } from "next"

import { LegalBlocks, type LegalBlock } from "@/components/legal/legal-blocks"
import { LegalPageShell } from "@/components/legal/legal-page-shell"
import legal from "@/lib/legal-content.json"

// Generated legal text (source of truth: yikat-app docs.ts via
// scripts/generate-legal-content.mjs). Published here so references from the
// contract, refund and privacy texts resolve on www.yikat.tech. No wording is
// written in this file.

const path = "/kvkk-basvuru-formu"

export const metadata: Metadata = {
  title: "KVKK Başvuru Formu - Yıkat",
  description: "KVKK md. 11 kapsamındaki haklarınız için Yıkat ilgili kişi başvuru formu.",
  alternates: { canonical: `https://www.yikat.tech${path}` },
}

export default function KvkkBasvuruFormuPage() {
  const doc = legal.docs.kvkkBasvuru
  return (
    <LegalPageShell title={doc.heading} subtitle={doc.subtitle} currentHref={path}>
      <LegalBlocks blocks={doc.blocks as LegalBlock[]} currentHref={path} />
    </LegalPageShell>
  )
}
