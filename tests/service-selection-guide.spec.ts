import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { siteConfig } from "../lib/site"

const path = "/rehber/ayakkabi-kuru-temizlemeye-verilir-mi"

test("service selection guide stays useful without JavaScript and explains the actual shop scope", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } })
  const page = await context.newPage()
  await page.goto(`${baseURL}${path}`)
  await expect(page.getByRole("heading", { level: 1, name: "Ayakkabı kuru temizlemeye verilir mi?" })).toBeVisible()
  await expect(page.locator(".discovery-answer")).toBeVisible()
  await expect(page.getByRole("table", { name: "Hizmet adını yapılacak işle eşleştir" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Bırakmadan önce beş soruyu netleştir" })).toBeVisible()
  await expect(page.locator("#bakirkoy")).toContainText("giysi kuru temizleme hizmetimiz henüz başlamadı")
  await expect(page.locator("#bakirkoy")).toContainText("Kapıdan alım henüz başlamadı")
  const faq = page.locator("details").filter({ hasText: "Süeti kuru fırçalamak" })
  await faq.locator("summary").focus()
  await page.keyboard.press("Enter")
  await expect(faq).toHaveAttribute("open", "")
  await expect(faq.locator("p")).toBeVisible()
  await expect(page.locator("#kaynak-ginetexCurrent a")).toHaveAttribute("href", "https://www.ginetex.net/gb/labelling/care-symbols.asp")
  await expect(page.locator("#kaynak-clarksCare a")).toHaveAttribute("href", "https://clarks.com.au/pages/shoe-care-guide")
  const photoLink = page.locator(`main a[href^='${siteConfig.whatsappHref}?']`).first()
  expect(new URL((await photoLink.getAttribute("href"))!).searchParams.get("text")).toContain(`${siteConfig.url}${path}`)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
  await context.close()
})

test("service selection guide is discoverable from the guide hub, price guide and sitemap", async ({ page, request }) => {
  for (const entry of ["/rehber", "/rehber/ayakkabi-temizleme-fiyati-neye-gore-belirlenir"]) {
    await page.goto(entry)
    await expect(page.locator(`main a[href='${path}']`)).toBeVisible()
  }
  await expect(page.getByRole("link", { name: "Bir çift için baz fiyatları incele" })).toHaveAttribute("href", "/ayakkabi-temizleme#fiyat")
  await expect(page.locator("main")).not.toContainText("Güncel ve doğrulanmış bir menü olmadan")
  const sitemap = await (await request.get("/sitemap.xml")).text()
  expect(sitemap.match(new RegExp(`<loc>${siteConfig.url}${path}</loc>`, "g"))).toHaveLength(1)
  const entry = sitemap.match(/<url>[\s\S]*?<\/url>/g)?.find(block => block.includes(`<loc>${siteConfig.url}${path}</loc>`))
  expect(entry).toContain("<lastmod>2026-10-16T00:00:00.000Z</lastmod>")
  for (const changedPath of ["/ayakkabi-temizleme", "/bakirkoy-ayakkabi-temizleme", "/rehber", "/rehber/ayakkabi-temizleme-fiyati-neye-gore-belirlenir"]) {
    const changedEntry = sitemap.match(/<url>[\s\S]*?<\/url>/g)?.find(block => block.includes(`<loc>${siteConfig.url}${changedPath}</loc>`))
    expect(changedEntry, changedPath).toContain("<lastmod>2026-10-16T00:00:00.000Z</lastmod>")
  }
  await page.goto(path)
  const targets = await page.locator("main a[href^='/']").evaluateAll(links => [...new Set(links.map(link => link.getAttribute("href")!))])
  for (const target of targets) expect((await request.get(target)).status(), target).toBe(200)
})

for (const width of [320, 1280]) {
  test(`service selection guide has accessible tables and no overflow at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(path)
    const violations = (await new AxeBuilder({ page }).include("main").analyze()).violations
    expect(violations).toEqual([])
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    await page.screenshot({ path: testInfo.outputPath(`service-selection-${width}.png`), fullPage: true })
  })
}
