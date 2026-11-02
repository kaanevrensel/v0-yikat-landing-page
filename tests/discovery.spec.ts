import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { careGuides } from "../lib/care-guides"
import { services } from "../lib/services"
import { siteConfig } from "../lib/site"
import { BUSINESS_ID, careSources } from "../lib/discovery"
import { guideTopics } from "../lib/guide-topics"

const routes = ["/bakirkoy-ayakkabi-temizleme", "/ayakkabi-temizleme", "/rehber", ...services.map(s => `/${s.slug}`), ...careGuides.map(g => `/rehber/${g.slug}`)]
// Route loops run in fixed chunks so each test stays well inside its timeout as the guide
// count grows (about 150 routes at the end of the content programme), and chunks spread
// across workers. Chunk boundaries depend only on the route order above.
const chunks = (size: number) => Array.from({ length: Math.ceil(routes.length / size) }, (_, i) => ({ label: `routes ${i * size + 1}–${Math.min(routes.length, (i + 1) * size)} of ${routes.length}`, paths: routes.slice(i * size, (i + 1) * size) }))

test("discovery photos have working responsive delivery while approved home artwork keeps its source", async ({ request }) => {
  const shop = await (await request.get("/bakirkoy-ayakkabi-temizleme")).text()
  expect(shop).toContain("/_next/image?url=%2Fimages%2Fshop%2Fbakirkoy-owner-202608.webp")
  const original = await request.get("/images/shop/bakirkoy-owner-202608.webp")
  const scaled = await request.get("/_next/image?url=%2Fimages%2Fshop%2Fbakirkoy-owner-202608.webp&w=640&q=75", { headers: { Accept: "image/webp" } })
  expect(scaled.status()).toBe(200)
  expect(scaled.headers()["content-type"]).toContain("image/")
  expect((await scaled.body()).byteLength).toBeLessThan((await original.body()).byteLength)
  const phone = await request.get("/_next/image?url=%2Fimages%2Fshop%2Fbakirkoy-owner-202608.webp&w=384&q=75", { headers: { Accept: "image/webp" } })
  expect(phone.status()).toBe(200)
  expect((await phone.body()).byteLength).toBeLessThan((await scaled.body()).byteLength)
  const home = await (await request.get("/")).text()
  expect(home).toContain('src="/images/services/hero-v2/')
  expect(home).not.toContain("/_next/image?url=%2Fimages%2Fservices%2Fhero-v2")
})

// Titles must be unique across all routes, not only within a chunk: one cheap request per route.
const expectedTitles = new Map<string, string>()
for (const guide of careGuides) expectedTitles.set(`${guide.title} | Yıkat`, `/rehber/${guide.slug}`)
const decodeHtml = (text: string) => text.replace(/&(?:#(\d+)|#x([0-9a-f]+)|(amp|lt|gt|quot|apos|nbsp));/gi, (_, dec, hex, name) =>
  dec ? String.fromCodePoint(Number(dec)) : hex ? String.fromCodePoint(parseInt(hex, 16)) : ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0" } as Record<string, string>)[name.toLowerCase()])

test("every discovery URL has its own <title>", async ({ request }) => {
  const owners = new Map<string, string>()
  for (const path of routes) {
    const title = decodeHtml((await (await request.get(path)).text()).match(/<title>(.*?)<\/title>/)?.[1] ?? "")
    expect(title, path).toBeTruthy()
    expect(owners.get(title), `${path}: same <title> as ${owners.get(title)}`).toBeUndefined()
    owners.set(title, path)
    const expected = expectedTitles.get(title)
    if (expected) expect(expected, `${path}: the title of ${expected}`).toBe(path)
  }
})

for (const { label, paths } of chunks(25)) test(`every discovery URL serves unique canonical HTML, correct shop facts and public crawl access (${label})`, async ({ request }) => {
  for (const path of paths) {
    const res = await request.get(path)
    expect(res.status(), path).toBe(200)
    expect(res.headers()["x-robots-tag"] ?? "").not.toContain("noindex")
    const html = await res.text()
    expect(html, path).toContain(`rel="canonical" href="${siteConfig.url}${path}"`)
    expect(html.match(/<title>(.*?)<\/title>/)?.[1], path).toBeTruthy()
    expect(html.match(/<h1(?:\s|>)/g)?.length, path).toBe(1)
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]))
    const business = blocks.find(b => b["@type"] === "DryCleaningOrLaundry")
    expect(business["@id"]).toBe(BUSINESS_ID)
    expect(business.address.streetAddress).toContain("15-B")
    expect(business.openingHoursSpecification).toMatchObject([
      { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:30", closes: "20:30" },
      { dayOfWeek: ["Sunday"], opens: "10:00", closes: "20:30" },
    ])
    expect(business.sameAs).toContain("https://www.google.com/maps?cid=11452704591158275657")
    expect(business).not.toHaveProperty("aggregateRating")
    expect(business).not.toHaveProperty("priceRange")
    const service = blocks.find(b => b["@type"] === "Service")
    if (service) { expect(service.provider["@id"]).toBe(BUSINESS_ID); expect(service).not.toHaveProperty("offers") }
    const breadcrumb = blocks.find(b => b["@type"] === "BreadcrumbList")
    expect(breadcrumb.itemListElement.at(-1).item).toBe(`${siteConfig.url}${path}`)
    if (path.startsWith("/rehber/")) {
      const guide = careGuides.find(g => path.endsWith(`/${g.slug}`))!
      const article = blocks.find(b => b["@type"] === "Article")
      expect(article.mainEntityOfPage).toBe(`${siteConfig.url}${path}`)
      expect(article.datePublished).toBe(guide.published ?? "2026-10-10")
      expect(article.citation).toEqual(guide.sourceIds.map(id => careSources[id].url))
      expect(html).toContain(guide.answer)
    }
  }
})

test("sitemap lists every discovery URL; robots allows crawling; unknown guides are 404", async ({ request }) => {
  expect(expectedTitles.size).toBe(careGuides.length)
  const sitemap = await (await request.get("/sitemap.xml")).text()
  for (const path of routes) expect(sitemap).toContain(`<loc>${siteConfig.url}${path}</loc>`)
  const robots = await (await request.get("/robots.txt")).text()
  expect(robots).toContain("Allow: /")
  expect(robots).not.toContain("Disallow: /")
  expect(robots).toContain(`${siteConfig.url}/sitemap.xml`)
  expect((await request.get("/rehber/olmayan-bir-yazi")).status()).toBe(404)
})

test("answers, citations, local facts and contact actions work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto("/rehber/ayakkabi-makinede-yikanir-mi")
  await expect(page.locator(".discovery-answer")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Makine ayakkabıya ne yapar?" })).toBeVisible()
  await expect(page.locator(".discovery-sources a[href^='https://www.nike.com']").first()).toBeAttached()
  const question = page.locator("details").first()
  await question.locator("summary").click()
  await expect(question.locator("p")).toBeVisible()
  await page.goto("/bakirkoy-ayakkabi-temizleme")
  await expect(page.locator("main")).toContainText("Pazartesi–Cumartesi 08:30 – 20:30, Pazar 10:00 – 20:30")
  await expect(page.locator("main")).toContainText("No:15-B")
  const photoLink = page.locator(`main a[href^='${siteConfig.whatsappHref}?']`).first()
  await expect(photoLink).toBeVisible()
  expect(new URL((await photoLink.getAttribute("href"))!).searchParams.get("text")).toContain(`${siteConfig.url}/bakirkoy-ayakkabi-temizleme`)
  await expect(page.locator("main video")).toHaveAttribute("preload", "none")
  await context.close()
})

for (const width of [320, 390, 768, 1280]) for (const { label, paths } of chunks(10)) {
  test(`discovery layouts and keyboard controls are usable at ${width}px (${label})`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    for (const path of paths) {
      await page.goto(path)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, viewport: innerWidth }))
      expect(widths.doc, path).toBeLessThanOrEqual(widths.viewport + 1)
      if (width <= 390) {
        const tables = await page.locator('table[data-columns="2"]').evaluateAll(nodes => nodes.map(table => ({ table: table.scrollWidth, region: table.parentElement!.clientWidth })))
        for (const table of tables) expect(table.table, `${path}: two-column table`).toBeLessThanOrEqual(table.region + 1)
      }
      const geometry = await page.evaluate(() => {
        const title = document.querySelector("main h1")!.getBoundingClientRect()
        const nav = document.querySelector("body header")!.getBoundingClientRect()
        const sections = [...document.querySelectorAll("main > .discovery-narrow, main > .discovery-related, main > .guide-collection, main > .guide-topic-index, main > .guide-category, .guide-category > .guide-collection, .discovery-local-end, .discovery-reading-layout > .discovery-prose")]
        return { titleTop: title.top, navBottom: nav.bottom, offsets: sections.map(s => Math.abs(s.getBoundingClientRect().left - title.left)) }
      })
      // Regressions: opening labels pushed the hero far below the nav, and
      // centered narrow sections jumped sideways between full-width sections.
      expect(geometry.titleTop, path).toBeGreaterThanOrEqual(geometry.navBottom + 16)
      expect(geometry.titleTop, path).toBeLessThanOrEqual(116)
      expect(geometry.offsets.every(offset => offset <= 1), `${path}: ${geometry.offsets}`).toBe(true)
      await expect(page.getByRole("navigation", { name: "İçerik yolu" })).toHaveCount(0)
      const violations = (await new AxeBuilder({ page }).include("main").options({ rules: { "label-content-name-mismatch": { enabled: true } } }).analyze()).violations.filter(v => ["serious", "critical"].includes(v.impact ?? ""))
      expect(violations.map(v => `${v.id}: ${v.nodes.map(n => n.target)}`), path).toEqual([])
    }
    const footer = page.locator("footer")
    await expect(footer.getByRole("link", { name: "Bakırköy dükkânı", exact: true })).toHaveAttribute("href", "/bakirkoy-ayakkabi-temizleme")
  })
}

test("guides are linked from their hub and cite resolvable source definitions", async ({ page }) => {
  await page.goto("/rehber")
  for (const guide of careGuides) {
    // Each guide sits in the section of its topic, whose anchor the in-page index links.
    const anchor = guideTopics[guide.topic].anchor
    await expect(page.locator(`main section#${anchor} a[href='/rehber/${guide.slug}']`), guide.slug).toBeAttached()
    await expect(page.locator(`main section#${anchor} > h2`)).toHaveText(guide.topic)
    await expect(page.getByRole("navigation", { name: "Rehber konuları" }).locator(`a[href='#${anchor}']`)).toHaveText(guide.topic)
    for (const id of guide.sourceIds) expect(careSources[id]?.url, `${guide.slug}: ${id}`).toMatch(/^https:\/\//)
    for (const slug of guide.related) expect(careGuides.some(g => g.slug === slug)).toBe(true)
  }
})
