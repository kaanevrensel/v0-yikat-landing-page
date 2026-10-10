// Notify only after a production deployment is verified. Dry run is the default.
// Google does not use IndexNow. Acceptance is neither indexing nor ranking.
import { readFile } from "node:fs/promises"
const origin = "https://www.yikat.tech"
const key = (await readFile(new URL("../public/yikat-indexnow-key.txt", import.meta.url), "utf8")).trim()
const keyLocation = `${origin}/yikat-indexnow-key.txt`
const args = process.argv.slice(2)
const submit = args.includes("--submit")
const paths = args.filter(a => a !== "--submit")
if (!paths.length || !/^[a-f0-9]{32}$/.test(key)) throw new Error("Provide changed paths and a valid local key; use --submit only after live verification.")
const urls = [...new Set(paths)].map(path => {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("?") || path.includes("#")) throw new Error(`Not a canonical path: ${path}`)
  const url = new URL(path, origin)
  if (url.origin !== origin) throw new Error(`Unexpected host: ${path}`)
  return url.href
})
if (urls.length > 10000) throw new Error("Too many URLs")
for (const url of urls) {
  const res = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(30000) })
  if (res.status !== 200) throw new Error(`${url}: HTTP ${res.status}, not submitted`)
  const html = await res.text()
  if (!html.includes(`rel="canonical" href="${url === origin + "/" ? origin : url}"`) || /<meta[^>]*content="[^"]*noindex/.test(html) || (res.headers.get("x-robots-tag") ?? "").includes("noindex")) throw new Error(`Canonical or indexing mismatch: ${url}`)
}
const liveKey = await fetch(keyLocation, { redirect: "error", signal: AbortSignal.timeout(30000) })
if (!liveKey.ok || (await liveKey.text()).trim() !== key) throw new Error("Public key is not deployed")
if (!submit) {
  console.log(JSON.stringify({ mode: "dry-run", checked: urls, notice: "No URLs submitted. Add --submit after deployment approval and verification." }, null, 2))
} else {
  const res = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify({ host: "www.yikat.tech", key, keyLocation, urlList: urls }), signal: AbortSignal.timeout(30000) })
  const body = await res.text()
  console.log(JSON.stringify({ date: new Date().toISOString(), http: res.status, urls, response: body, indexed: "unknown" }, null, 2))
  if (![200, 202].includes(res.status)) process.exitCode = 1
}
