import type { Metadata } from "next"
import Link from "next/link"

import { LegalBlocks, type LegalBlock } from "@/components/legal/legal-blocks"
import { LegalPageShell } from "@/components/legal/legal-page-shell"
import legal from "@/lib/legal-content.json"

// Teslimat ve İade — iyzico üye işyeri incelemesinin istediği başlık
// (eksik-belge e-postası 2026-08-27). İçerik: Mesafeli Satış Sözleşmesi'nin
// "İfa / Teslimat" bölümü + İptal ve İade Koşulları belgesinin tamamı, ikisi de
// lib/legal-content.json'dan (tek kaynak: yikat-app docs.ts).

export const metadata: Metadata = {
  title: "Teslimat ve İade - YIKAT",
  description:
    "YIKAT teslimat koşulları ile sipariş iptali ve iade (cayma hakkı, online kart iadeleri) koşulları.",
  alternates: { canonical: "https://www.yikat.tech/teslimat-ve-iade" },
}

export default function TeslimatVeIadePage() {
  const teslimat = legal.docs.teslimat
  const iade = legal.docs.iptalIade
  return (
    <LegalPageShell title="Teslimat ve İade">
      <h2 className="mt-6 text-xl font-semibold text-foreground sm:text-2xl">{"Teslimat"}</h2>
      <LegalBlocks blocks={teslimat.blocks as LegalBlock[]} />

      <h2 className="mt-12 text-xl font-semibold text-foreground sm:text-2xl">{iade.heading}</h2>
      <LegalBlocks blocks={iade.blocks as LegalBlock[]} />

      <div className="mt-10 rounded-xl border border-border bg-card p-4">
        <p>
          {"Sözleşmenin tamamı için: "}
          <Link
            href="/mesafeli-satis-sozlesmesi"
            className="font-medium text-foreground underline underline-offset-4"
          >
            {"Mesafeli Satış Sözleşmesi"}
          </Link>
        </p>
      </div>
    </LegalPageShell>
  )
}
