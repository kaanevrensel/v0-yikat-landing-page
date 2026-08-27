import type { Metadata } from "next"

import { LegalBlocks, type LegalBlock } from "@/components/legal/legal-blocks"
import { LegalPageShell } from "@/components/legal/legal-page-shell"
import legal from "@/lib/legal-content.json"

// Mesafeli Satış Sözleşmesi + Ön Bilgilendirme Formu.
//
// 2026-08-27: pivot öncesi elle yazılmış eski metin, uygulamanın güncel
// (iyzico'lu, 2026-08-24 yürürlüklü) sözleşmesiyle DEĞİŞTİRİLDİ — iyzico
// üye işyeri incelemesi taraflar/mevzuat/teslimat-iade içeren güncel sözleşme
// istiyor ve iki ayrı sözleşme sürümü yaşatılamaz. İçerik
// lib/legal-content.json'dan gelir (tek kaynak: yikat-app docs.ts); eski metin
// git geçmişinde durur.

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi - YIKAT",
  description:
    "YIKAT Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu. 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında.",
  alternates: { canonical: "https://www.yikat.tech/mesafeli-satis-sozlesmesi" },
}

export default function MesafeliSatisSozlesmesiPage() {
  const onBilgi = legal.docs.onBilgilendirme
  const mesafeli = legal.docs.mesafeli
  return (
    <LegalPageShell title="Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu">
      <h2 className="mt-6 text-2xl font-bold text-foreground sm:text-3xl">
        {"Bölüm 1 – " + onBilgi.heading}
      </h2>
      {onBilgi.subtitle ? <p className="mt-2 text-sm">{onBilgi.subtitle}</p> : null}
      <LegalBlocks blocks={onBilgi.blocks as LegalBlock[]} />

      <h2 className="mt-14 text-2xl font-bold text-foreground sm:text-3xl">
        {"Bölüm 2 – " + mesafeli.heading}
      </h2>
      {mesafeli.subtitle ? <p className="mt-2 text-sm">{mesafeli.subtitle}</p> : null}
      <LegalBlocks blocks={mesafeli.blocks as LegalBlock[]} />
    </LegalPageShell>
  )
}
