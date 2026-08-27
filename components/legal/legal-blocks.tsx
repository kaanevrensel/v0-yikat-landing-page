import type { ReactNode } from "react"

// Yasal metin blokları — lib/legal-content.json'daki (yikat-app docs.ts'ten
// üretilen) tipli blokları /kvkk sayfasının görsel diline çevirir. Metin
// İÇERİĞİ burada asla yazılmaz/değiştirilmez: tek kaynak uygulamadaki
// docs.ts'tir, bu bileşen yalnız render eder.

export type LegalBlock =
  | { type: "section"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "rows"; rows: { label: string; value: string }[] }
  | { type: "note"; text: string }
  | { type: "checklist"; items: string[] }

export function LegalBlocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <LegalBlockView key={i} block={b} />
      ))}
    </>
  )
}

function LegalBlockView({ block }: { block: LegalBlock }): ReactNode {
  switch (block.type) {
    case "section":
      return <h2 className="mt-10 text-xl font-semibold text-foreground sm:text-2xl">{block.text}</h2>
    case "paragraph":
      return <p className="mt-4">{block.text}</p>
    case "bullets":
      return (
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
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
          <p>{block.text}</p>
        </div>
      )
    case "checklist":
      return (
        <ul className="mt-4 space-y-2">
          {block.items.map((item, i) => (
            <li key={i}>{"☐ "}{item}</li>
          ))}
        </ul>
      )
  }
}
