import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { careGuides } from "../lib/care-guides"
import { services } from "../lib/services"
import { siteConfig } from "../lib/site"
import { BUSINESS_ID, careSources } from "../lib/discovery"

const routes = ["/bakirkoy-ayakkabi-temizleme", "/ayakkabi-temizleme", "/rehber", ...services.map(s => `/${s.slug}`), ...careGuides.map(g => `/rehber/${g.slug}`)]

test("discovery photos have working responsive delivery while approved home artwork keeps its source", async ({ request }) => {
  const shop = await (await request.get("/bakirkoy-ayakkabi-temizleme")).text()
  expect(shop).toContain("/_next/image?url=%2Fimages%2Fshop%2Fbakirkoy-owner-202608.webp")
  const original = await request.get("/images/shop/bakirkoy-owner-202608.webp")
  const scaled = await request.get("/_next/image?url=%2Fimages%2Fshop%2Fbakirkoy-owner-202608.webp&w=640&q=75", { headers: { Accept: "image/webp" } })
  expect(scaled.status()).toBe(200)
  expect(scaled.headers()["content-type"]).toContain("image/")
  expect((await scaled.body()).byteLength).toBeLessThan((await original.body()).byteLength)
  const home = await (await request.get("/")).text()
  expect(home).toContain('src="/images/services/hero-v2/')
  expect(home).not.toContain("/_next/image?url=%2Fimages%2Fservices%2Fhero-v2")
})

test("every discovery URL serves unique canonical HTML, correct shop facts and public crawl access", async ({ request }) => {
  const titles = new Set<string>()
  for (const path of routes) {
    const res = await request.get(path)
    expect(res.status(), path).toBe(200)
    expect(res.headers()["x-robots-tag"] ?? "").not.toContain("noindex")
    const html = await res.text()
    expect(html, path).toContain(`rel="canonical" href="${siteConfig.url}${path}"`)
    const title = html.match(/<title>(.*?)<\/title>/)?.[1]
    expect(title, path).toBeTruthy()
    expect(titles.has(title!), path).toBe(false)
    titles.add(title!)
    expect(html.match(/<h1(?:\s|>)/g)?.length, path).toBe(1)
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]))
    const business = blocks.find(b => b["@type"] === "DryCleaningOrLaundry")
    expect(business["@id"]).toBe(BUSINESS_ID)
    expect(business.address.streetAddress).toContain("15-B")
    expect(business.openingHoursSpecification).toMatchObject({ opens: "10:00", closes: "22:00" })
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
      expect(article.citation).toEqual(guide.sourceIds.map(id => careSources[id].url))
      expect(html).toContain(guide.answer)
    }
  }
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
  await expect(page.getByRole("heading", { name: "Üreticiler neden farklı şeyler söylüyor?" })).toBeVisible()
  await expect(page.locator(".discovery-sources a[href^='https://www.nike.com']").first()).toBeAttached()
  const question = page.locator("details").first()
  await question.locator("summary").click()
  await expect(question.locator("p")).toBeVisible()
  await page.goto("/bakirkoy-ayakkabi-temizleme")
  await expect(page.locator("main")).toContainText("Her gün 10:00 – 22:00")
  await expect(page.locator("main")).toContainText("No:15-B")
  await expect(page.locator(`main a[href='${siteConfig.whatsappHref}']`).first()).toBeVisible()
  await expect(page.locator("main video")).toHaveAttribute("preload", "none")
  await context.close()
})

for (const width of [320, 390, 1280]) {
  test(`discovery layouts and keyboard controls are usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    for (const path of ["/bakirkoy-ayakkabi-temizleme", "/ayakkabi-temizleme", "/sneaker-yikama", "/rehber/ayakkabi-makinede-yikanir-mi", "/rehber"]) {
      await page.goto(path)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, viewport: innerWidth }))
      expect(widths.doc, path).toBeLessThanOrEqual(widths.viewport + 1)
      const violations = (await new AxeBuilder({ page }).include("main").analyze()).violations.filter(v => ["serious", "critical"].includes(v.impact ?? ""))
      expect(violations.map(v => `${v.id}: ${v.nodes.map(n => n.target)}`), path).toEqual([])
    }
    const footer = page.locator("footer")
    await expect(footer.getByRole("link", { name: "Bakırköy dükkânı", exact: true })).toHaveAttribute("href", "/bakirkoy-ayakkabi-temizleme")
  })
}

test("guides are linked from their hub and cite resolvable source definitions", async ({ page }) => {
  await page.goto("/rehber")
  for (const guide of careGuides) {
    await expect(page.locator(`main a[href='/rehber/${guide.slug}']`)).toBeAttached()
    for (const id of guide.sourceIds) expect(careSources[id]?.url, `${guide.slug}: ${id}`).toMatch(/^https:\/\//)
    for (const slug of guide.related) expect(careGuides.some(g => g.slug === slug)).toBe(true)
  }
})
