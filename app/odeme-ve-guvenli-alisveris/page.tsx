import type { Metadata } from "next"

import { LegalBlocks, type LegalBlock } from "@/components/legal/legal-blocks"
import { LegalPageShell } from "@/components/legal/legal-page-shell"
import legal from "@/lib/legal-content.json"

// Generated legal text (source of truth: yikat-app docs.ts via
// scripts/generate-legal-content.mjs). Published here so references from the
// contract, refund and privacy texts resolve on www.yikat.tech. No wording is
// written in this file.

const path = "/odeme-ve-guvenli-alisveris"

export const metadata: Metadata = {
  title: "Ödeme ve Güvenli Alışveriş - Yıkat",
  description: "Yıkat ödeme yöntemleri, online kart ödemesi, ön provizyon ve ödeme güvenliği.",
  alternates: { canonical: `https://www.yikat.tech${path}` },
}

export default function OdemeVeGuvenliAlisverisPage() {
  const doc = legal.docs.odeme
  return (
    <LegalPageShell title={doc.heading} currentHref={path}>
      <LegalBlocks blocks={doc.blocks as LegalBlock[]} currentHref={path} />
    </LegalPageShell>
  )
}
