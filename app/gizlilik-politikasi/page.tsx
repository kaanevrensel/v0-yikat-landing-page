import type { Metadata } from "next"
import Link from "next/link"

import { LegalBlocks, type LegalBlock } from "@/components/legal/legal-blocks"
import { LegalPageShell } from "@/components/legal/legal-page-shell"
import legal from "@/lib/legal-content.json"

// Gizlilik Politikası — iyzico üye işyeri incelemesi web sitesinde İÇERİK
// olarak arıyor (yalnız app.yikat.tech'e yönlendirme yetmedi, eksik-belge
// e-postası 2026-08-27). Metin lib/legal-content.json'dan gelir (tek kaynak:
// yikat-app docs.ts) — burada içerik yazılmaz.

export const metadata: Metadata = {
  title: "Gizlilik Politikası - YIKAT",
  description:
    "YIKAT gizlilik politikası: hangi verileri topladığımız, nasıl kullandığımız ve KVKK kapsamındaki haklarınız.",
  alternates: { canonical: "https://www.yikat.tech/gizlilik-politikasi" },
}

export default function GizlilikPolitikasiPage() {
  const doc = legal.docs.gizlilik
  return (
    <LegalPageShell title={doc.heading}>
      <LegalBlocks blocks={doc.blocks as LegalBlock[]} />
      <div className="mt-10 rounded-xl border border-border bg-card p-4">
        <p>
          {"Web sitesine (www.yikat.tech) ilişkin ayrıntılı aydınlatma metni için: "}
          <Link href="/kvkk" className="font-medium text-foreground underline underline-offset-4">
            {"KVKK Aydınlatma Metni"}
          </Link>
        </p>
      </div>
    </LegalPageShell>
  )
}
