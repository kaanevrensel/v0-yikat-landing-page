#!/usr/bin/env node
// Regenerates lib/legal-content.json from the canonical legal texts in the app
// repository (yikat-app: mobile/src/features/legal/docs.ts). The website never
// edits legal wording; it renders this generated file.
//
//   node scripts/generate-legal-content.mjs ../yikat-app            # write
//   node scripts/generate-legal-content.mjs ../yikat-app --check    # exit 1 on drift
//
// The first argument is the yikat-app checkout (or docs.ts itself).

import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import ts from "typescript"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const output = join(root, "lib", "legal-content.json")
const args = process.argv.slice(2)
const check = args.includes("--check")
const source = args.find((arg) => !arg.startsWith("--"))
if (!source) {
  console.error("Usage: node scripts/generate-legal-content.mjs <yikat-app checkout | docs.ts> [--check]")
  process.exit(2)
}
const docsPath = statSync(source).isDirectory()
  ? join(source, "mobile", "src", "features", "legal", "docs.ts")
  : resolve(source)

// docs.ts has no imports: transpile it on its own and load the result.
const compiled = ts.transpileModule(readFileSync(docsPath, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText
const workDir = mkdtempSync(join(tmpdir(), "yikat-legal-"))
let app
try {
  const modulePath = join(workDir, "docs.mjs")
  writeFileSync(modulePath, compiled)
  app = await import(pathToFileURL(modulePath).href)
} finally {
  rmSync(workDir, { recursive: true, force: true })
}
const { COMPANY, LEGAL_DOCS, LEGAL_EFFECTIVE_DATE } = app

function doc(slug) {
  const found = LEGAL_DOCS[slug]
  if (!found) throw new Error(`docs.ts no longer has the "${slug}" document`)
  return found
}

/** Blocks that follow a section heading, up to the next section heading. */
function sectionBody(slug, matches) {
  const blocks = doc(slug).blocks
  const start = blocks.findIndex((block) => block.type === "section" && matches(block.text))
  if (start < 0) throw new Error(`"${slug}" lost the section this picker needs`)
  const rest = blocks.slice(start + 1)
  const end = rest.findIndex((block) => block.type === "section")
  return end < 0 ? rest : rest.slice(0, end)
}

/**
 * A document without the named identity rows. The website's KVKK notice names the
 * controller by title and address only; the tax number stays on /iletisim and in
 * the distance contract, where commerce rules ask for it (owner decision 2026-10-12:
 * do not repeat the sole proprietor's personal ID number on further pages).
 */
function withoutRows(slug, labels) {
  const source = doc(slug)
  return {
    ...source,
    blocks: source.blocks.map((block) =>
      block.type === "rows" ? { ...block, rows: block.rows.filter((row) => !labels.includes(row.label)) } : block,
    ),
  }
}

const content = {
  _generated:
    "GENERATED FILE — do not edit. Source of truth: yikat-app mobile/src/features/legal/docs.ts. Regenerate with `node scripts/generate-legal-content.mjs <yikat-app checkout>`; CI-style drift check: add --check.",
  company: COMPANY,
  effectiveDate: LEGAL_EFFECTIVE_DATE,
  docs: {
    gizlilik: doc("gizlilik"),
    mesafeli: doc("mesafeli"),
    onBilgilendirme: doc("on-bilgilendirme"),
    iptalIade: doc("iptal-iade"),
    // Website-only framing of the contract's delivery section (iyzico review heading).
    teslimat: {
      navTitle: "Teslimat",
      heading: "Teslimat",
      blocks: [
        {
          type: "paragraph",
          text: "Yıkat hizmetlerinde teslimat; ürünlerin belirttiğiniz adresten teslim alınması ve işlem sonrası aynı adrese teslim edilmesi şeklinde gerçekleşir. Aşağıdaki koşullar, Mesafeli Satış Sözleşmesi’nin “İfa / Teslimat” bölümünün aynısıdır.",
        },
        ...sectionBody("mesafeli", (text) => text.includes("İfa / Teslimat")),
      ],
    },
    // Documents the texts above refer to by name. Published on the website so
    // every reference resolves without leaving www.yikat.tech (2026-10-12).
    kvkk: withoutRows("kvkk", ["Vergi Dairesi / No"]),
    kullanim: doc("kullanim"),
    odeme: doc("odeme"),
    kartSaklama: doc("kart-saklama"),
    acikRiza: doc("acik-riza"),
    kvkkBasvuru: doc("kvkk-basvuru"),
  },
}

const next = `${JSON.stringify(content, null, 1)}\n`
if (check) {
  const current = readFileSync(output, "utf8")
  if (current !== next) {
    console.error("lib/legal-content.json is out of date with docs.ts — regenerate without --check.")
    process.exit(1)
  }
  console.log("lib/legal-content.json matches docs.ts")
} else {
  writeFileSync(output, next)
  console.log(`Wrote ${output} from ${docsPath}`)
}
