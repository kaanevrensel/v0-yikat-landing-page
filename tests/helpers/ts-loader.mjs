// Minimal ESM loader so Node tests can import the site's TypeScript data modules
// (lib/*.ts) without a bundler: resolves the "@/" alias and extensionless paths,
// and transpiles .ts with the repo's own TypeScript compiler. Data modules only;
// React/Next modules are not meant to be loaded this way.
import { existsSync, readFileSync, statSync } from "node:fs"
import { fileURLToPath, pathToFileURL } from "node:url"
import path from "node:path"
import ts from "typescript"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const candidates = base => [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]

export async function resolve(specifier, context, next) {
  let base = null
  if (specifier.startsWith("@/")) base = path.join(root, specifier.slice(2))
  else if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.endsWith(".ts")) base = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier)
  if (base) {
    const file = candidates(base).find(f => existsSync(f) && statSync(f).isFile())
    if (file) return { url: pathToFileURL(file).href, format: file.endsWith(".ts") ? "module" : undefined, shortCircuit: true }
  }
  return next(specifier, context)
}

export async function load(url, context, next) {
  if (url.startsWith("file:") && url.endsWith(".ts")) {
    const source = readFileSync(fileURLToPath(url), "utf8")
    const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, verbatimModuleSyntax: false }, fileName: fileURLToPath(url) })
    return { format: "module", source: outputText, shortCircuit: true }
  }
  return next(url, context)
}
