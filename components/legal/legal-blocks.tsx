import type { ReactNode } from "react"
import Link from "next/link"
import { splitLegalReferences } from "@/lib/legal-routes"

// Yasal metin blokları — lib/legal-content.json'daki (yikat-app docs.ts'ten
// üretilen) tipli blokları /kvkk sayfasının görsel diline çevirir. Metin
// İÇERİĞİ burada asla yazılmaz/değiştirilmez: tek kaynak uygulamadaki
// docs.ts'tir, bu bileşen yalnız render eder. Metinde adı geçen diğer yasal
// belgeler (ör. "Kullanım Koşulları §7") bu sitedeki sayfalarına bağlanır;
// kelimeler değişmez (lib/legal-routes.ts).

export type LegalBlock =
  | { type: "section"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "rows"; rows: { label: string; value: string }[] }
  | { type: "note"; text: string }
  | { type: "checklist"; items: string[] }

export function LegalBlocks({ blocks, currentHref }: { blocks: LegalBlock[]; currentHref?: string }) {
  return (
    <>
      {blocks.map((b, i) => (
        <LegalBlockView key={i} block={b} currentHref={currentHref} />
      ))}
    </>
  )
}

function LegalText({ text, currentHref }: { text: string; currentHref?: string }): ReactNode {
  return splitLegalReferences(text, currentHref).map((part, i) =>
    part.href ? (
      <Link key={i} href={part.href} className="font-medium text-foreground underline underline-offset-4">
        {part.text}
      </Link>
    ) : (
      part.text
    ),
  )
}

function LegalBlockView({ block, currentHref }: { block: LegalBlock; currentHref?: string }): ReactNode {
  const text = (value: string) => <LegalText text={value} currentHref={currentHref} />
  switch (block.type) {
    case "section":
      return <h2 className="mt-10 text-xl font-semibold text-foreground sm:text-2xl">{block.text}</h2>
    case "paragraph":
      return <p className="mt-4">{text(block.text)}</p>
    case "bullets":
      return (
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {block.items.map((item, i) => (
            <li key={i}>{text(item)}</li>
          ))}
        </ul>
      )
    case "rows":
      return (
        <div className="mt-4 space-y-1.5">
          {block.rows.map((row, i) => (
            <p key={i}>
              <strong className="text-foreground">{row.label}:</strong> {row.value}
            </p>
          ))}
        </div>
      )
    case "note":
      return (
        <div className="mt-4 rounded-xl border border-border bg-card p-4">
          <p>{text(block.text)}</p>
        </div>
      )
    case "checklist":
      return (
        <ul className="mt-4 space-y-2">
          {block.items.map((item, i) => (
            <li key={i}>{"☐ "}{text(item)}</li>
          ))}
        </ul>
      )
  }
}
