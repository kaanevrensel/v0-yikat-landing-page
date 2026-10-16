import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test("the dated per-pair base menu is readable without JavaScript and keeps exact verified categories", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  const page = await context.newPage()
  await page.goto("/ayakkabi-temizleme#fiyat")
  const menu = page.locator("#fiyat")
  await expect(menu.getByRole("heading", { name: "Ayakkabı temizleme fiyatları" })).toBeVisible()
  await expect(menu.locator("time")).toHaveAttribute("datetime", "2026-10-16")
  await expect(menu.locator("time")).toHaveText("16 Ekim 2026")
  await expect(menu).toContainText("bir çift")
  await expect(menu.locator("tbody tr")).toHaveCount(4)
  const rows = await menu.locator("tbody tr").evaluateAll(nodes => nodes.map(row => [...row.children].map(cell => cell.textContent?.trim())))
  expect(rows).toEqual([["Bez", "400 TL"], ["Deri", "650 TL"], ["Süet", "750 TL"], ["Bot", "900 TL"]])
  await expect(menu).toContainText("son tutarı kabulden önce")
  await expect(menu.getByRole("link", { name: "Fotoğrafla ücret sor" })).toHaveAttribute("href", /^https:\/\/wa\.me\/908503033193/)
  await expect(menu).not.toContainText(/Çocuk|Nubuk|Sneaker|300 TL|1\.000|1000/)
  await context.close()
})

test("workshop evidence is genuine drying footage with optional accessible playback", async ({ page }) => {
  await page.goto("/ayakkabi-temizleme")
  const proof = page.locator("#kurutma")
  await expect(proof.locator("figcaption")).toContainText("Kendi dükkân çekimimiz")
  const video = proof.locator("video")
  await expect(video).toHaveAttribute("controls", "")
  await expect(video).toHaveAttribute("preload", "none")
  await expect(video).not.toHaveAttribute("autoplay", "")
  await expect(video.locator("source")).toHaveAttribute("src", "/videos/care/drying-cabinet-20261015.mp4")
  await expect(video.locator("track")).toHaveAttribute("src", "/videos/care/drying-cabinet-20261015-tr.vtt")
  await expect(proof).not.toContainText(/dezenfekt|steriliz|yüzde|%|°C|garantili sonuç/i)
  await video.evaluate(async element => { await (element as HTMLVideoElement).play() })
  await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(0)
  await video.evaluate(element => (element as HTMLVideoElement).pause())
  expect(await video.evaluate(element => (element as HTMLVideoElement).paused)).toBe(true)
})

test("local evidence keeps its capture date, route identity and downloadable care card", async ({ page, request }) => {
  await page.goto("/bakirkoy-ayakkabi-temizleme")
  await expect(page.locator(".discovery-local-hero figcaption")).toContainText("Ağustos 2026")
  await expect(page.locator(".discovery-route-film figcaption")).toContainText("Kendi çekimimiz")
  await expect(page.locator(".discovery-route-film video")).toHaveAttribute("preload", "none")
  await expect(page.getByRole("link", { name: "Bir çift için baz fiyatlar ve değerlendirme" })).toHaveAttribute("href", "/ayakkabi-temizleme#fiyat")
  const card = page.getByRole("link", { name: "tek sayfalık ayakkabı bakım kartını indir (PDF)" })
  await expect(card).toHaveAttribute("download", "")
  const response = await request.get((await card.getAttribute("href"))!)
  expect(response.status()).toBe(200)
  expect(response.headers()["content-type"]).toContain("application/pdf")
})

for (const width of [320, 1280]) test(`prices and workshop content remain accessible at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  for (const path of ["/ayakkabi-temizleme", "/bakirkoy-ayakkabi-temizleme"]) {
    await page.goto(path)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1)
    const violations = (await new AxeBuilder({ page }).include("main").analyze()).violations
    expect(violations.map(item => `${item.id}: ${item.nodes.map(node => node.target)}`)).toEqual([])
    if (path === "/ayakkabi-temizleme") {
      const table = page.locator("#fiyat table")
      const size = await table.evaluate(element => ({ table: element.scrollWidth, container: element.parentElement!.clientWidth }))
      expect(size.table).toBeLessThanOrEqual(size.container + 1)
      await page.locator("#fiyat").screenshot({ path: test.info().outputPath(`price-${width}.png`) })
      await page.locator("#kurutma").screenshot({ path: test.info().outputPath(`workshop-${width}.png`) })
    } else {
      await page.locator(".discovery-route-film").screenshot({ path: test.info().outputPath(`route-${width}.png`) })
    }
  }
})
