import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { siteConfig } from "../lib/site"

const guides = [
  { slug: "ayakkabi-makinede-yikanir-mi", section: "dukkan", destination: "/ayakkabi-temizleme", published: "2026-10-10" },
  { slug: "ayakkabi-kuru-temizlemeye-verilir-mi", section: "bakirkoy", destination: "/ayakkabi-temizleme#fiyat", published: "2026-10-16" },
]

test("home and local preparation lead to useful guides without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 850 } })
  const page = await context.newPage()
  for (const entry of ["/", "/bakirkoy-ayakkabi-temizleme"]) {
    for (const guide of guides) {
      await page.goto(`${baseURL}${entry}`)
      const link = page.locator(`main a[href='/rehber/${guide.slug}']`)
      await link.focus()
      await expect(link).toBeFocused()
      await page.keyboard.press("Enter")
      await expect(page).toHaveURL(`${baseURL}/rehber/${guide.slug}`)
      await expect(page.locator(".discovery-answer")).toBeVisible()
    }
  }
  await context.close()
})

test("guide assessment links preserve page context and final physical evaluation", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  for (const guide of guides) {
    const path = `/rehber/${guide.slug}`
    await page.goto(`${baseURL}${path}?utm_source=test`)
    const section = page.locator(`#${guide.section}`)
    await expect(section).toContainText(/dükkânda gördükten sonra|fiziksel kabulde/)
    const photo = section.getByRole("link", { name: "Ön değerlendirme için fotoğraf gönder" })
    await expect(photo).toHaveAttribute("target", "_blank")
    const href = new URL((await photo.getAttribute("href"))!)
    expect(href.origin + href.pathname).toBe(siteConfig.whatsappHref)
    expect(href.searchParams.get("text")).toContain(`${siteConfig.url}${path}`)
    expect(href.searchParams.get("text")).not.toContain("utm_source")
    const service = section.locator(`a[href='${guide.destination}']`)
    await service.focus()
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(`${baseURL}${guide.destination}`)
  }
  await context.close()
})

test("guide revision dates agree across visible byline, Article, Open Graph and sitemap", async ({ page, request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text()
  for (const guide of guides) {
    await page.goto(`/rehber/${guide.slug}`)
    const article = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(node => JSON.parse(node.textContent!)).find(node => node["@type"] === "Article"))
    expect(article.datePublished).toBe(guide.published)
    expect(article.dateModified).toBe("2026-10-25")
    await expect(page.locator('.discovery-byline time[datetime="2026-10-25"]')).toBeVisible()
    await expect(page.locator('meta[property="article:modified_time"]')).toHaveAttribute("content", article.dateModified)
    const entry = sitemap.match(/<url>[\s\S]*?<\/url>/g)?.find(block => block.includes(`<loc>${siteConfig.url}/rehber/${guide.slug}</loc>`))
    expect(entry).toContain(`<lastmod>${article.dateModified}T00:00:00.000Z</lastmod>`)
  }
  // A targeted repair must not make unchanged articles or publication dates look new.
  await page.goto("/rehber/yorgan-nasil-yikanir")
  const article = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(node => JSON.parse(node.textContent!)).find(node => node["@type"] === "Article"))
  expect(article.datePublished).toBe("2026-10-10")
  expect(article.dateModified).toBe("2026-10-10")
})

for (const width of [320, 1280]) {
  test(`contextual links remain accessible at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    for (const path of ["/", "/bakirkoy-ayakkabi-temizleme", ...guides.map(guide => `/rehber/${guide.slug}`)]) {
      await page.goto(path)
      const scope = path === "/" ? ".washing-process" : "main"
      expect((await new AxeBuilder({ page }).include(scope).analyze()).violations).toEqual([])
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
      const element = page.locator(path === "/" ? ".washing-process" : path.startsWith("/rehber/") ? ".discovery-section-links" : ".discovery-prose").first()
      await element.screenshot({ path: testInfo.outputPath(`${path.replaceAll("/", "-") || "home"}-${width}.png`) })
    }
    await page.goto("/")
    await page.getByRole("tab", { name: "Kuru temizleme", exact: true }).click()
    await expect(page.locator(".washing-guide-links")).toHaveCount(0)
    await page.getByRole("tab", { name: "Ayakkabı", exact: true }).click()
    await expect(page.locator(".washing-guide-links a")).toHaveCount(2)
  })
}
