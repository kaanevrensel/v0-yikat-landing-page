import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { androidTest } from "../lib/android-test"
import { siteConfig } from "../lib/site"

// /android is the closed-test join page behind the counter card. It must work
// without JavaScript, point at the exact constants, stay out of search and never
// promise more than the app does today.

test("android test page renders without JavaScript with the exact join links", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  const page = await context.newPage()
  const res = await page.goto("/android")
  expect(res?.status()).toBe(200)
  const main = page.locator("main")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Android’in varsa bir ricamız var.")
  const links: [string, string][] = [
    ["Test grubuna katıl", androidTest.groupUrl],
    ["Test sayfasını aç", androidTest.optInUrl],
    ["Google Play’de aç", androidTest.playUrl],
    ["App Store’da", androidTest.appStoreUrl],
    ["test sayfasını", androidTest.optInUrl],
    ["test grubundan", androidTest.groupUrl],
  ]
  for (const [name, href] of links) {
    const link = main.getByRole("link", { name, exact: true })
    await expect(link, name).toHaveAttribute("href", href)
    await expect(link, name).toHaveAttribute("rel", "noopener noreferrer")
    // New-tab links carry the shared screen-reader note.
    await expect(link, name).toHaveAttribute("target", "_blank")
    await expect(link, name).toHaveAccessibleDescription("Bağlantı yeni sekmede açılır.")
  }
  await expect(main.getByRole("link", { name: "Gizlilik Politikası", exact: true })).toHaveAttribute("href", "/gizlilik-politikasi")
  await expect(main.getByRole("link", { name: "KVKK Aydınlatma Metni", exact: true })).toHaveAttribute("href", "/kvkk")
  expect(await main.getByRole("link", { name: "E-postayla yaz", exact: true }).getAttribute("href")).toBe(`mailto:${androidTest.feedbackEmail}?subject=${encodeURIComponent("Android testi")}`)
  const whatsapp = main.getByRole("link", { name: "WhatsApp’tan yaz", exact: true })
  expect(await whatsapp.getAttribute("href")).toBe(`${siteConfig.whatsappHref}?text=${encodeURIComponent("Merhaba, Android testinden yazıyorum.")}`)
  await expect(main.getByRole("link", { name: "Tezgâh için test kartını indir (PDF)" })).toHaveAttribute("download", "")
  await expect(main.getByRole("link", { name: "Tezgâh için test kartını indir (PDF)" })).toHaveAttribute("href", androidTest.pdf)
  await expect(main.locator(`img[src="${androidTest.qr}"]`)).toBeVisible()

  // Three numbered steps, honest scope, staying until the app is public, the
  // right to leave at any time, and privacy.
  await expect(main.locator("ol.discovery-steps > li")).toHaveCount(3)
  await expect(main).toContainText("Kapıdan alım ve teslim henüz başlamadı")
  await expect(main).toContainText("uygulamadan sipariş veremezsin")
  await expect(main).toContainText("en az 14 gün")
  await expect(main).toContainText("herkese açılana kadar testte kalman")
  await expect(main).toContainText("İstediğin zaman")
  await expect(main).toContainText("Gruptan çıkmak da testten ayrılmak sayılır")
  await expect(main).toContainText("adın ve e-posta adresin")
  await expect(main).toContainText("yalnızca testi yürütmek için")
  await expect(main).toContainText("Gruptan istediğin zaman çıkabilirsin")
  // No claim that the policy pages describe the test, and no unverified button label quoted as exact.
  await expect(main).not.toContainText("Ayrıntılar")
  await expect(main).not.toContainText("Testçi ol")
  await expect(main).not.toContainText(/ilk sen|herkesten önce|Test bittikten sonra/)
  await expect(main).not.toContainText(/indirim|kupon|hediye|ödül|bedava|ücretsiz|aynı gün/i)
  // Every link to the group, opt-in or store is a real link in server HTML.
  const html = await (await page.request.get("/android")).text()
  for (const url of [androidTest.groupUrl, androidTest.optInUrl, androidTest.playUrl, androidTest.appStoreUrl]) {
    expect(html, url).toContain(`href="${url.replace(/&/g, "&amp;")}"`)
  }
  await context.close()
})

test("android test page is noindex, self-canonical and not in the sitemap", async ({ page, request }) => {
  await page.goto("/android")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", androidTest.pageUrl)
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain(androidTest.pageUrl)
})

test("android counter card PDF and QR SVG are served", async ({ request }) => {
  const pdf = await request.get(androidTest.pdf)
  expect(pdf.status()).toBe(200)
  expect(pdf.headers()["content-type"]).toContain("application/pdf")
  const bytes = await pdf.body()
  expect(bytes.subarray(0, 5).toString()).toBe("%PDF-")
  // The card's link annotation targets our page and no link or annotation points
  // to the group. This only sees uncompressed objects (annotations, metadata):
  // the printed text sits in Flate-compressed streams with subset-font glyph
  // codes, so the generator's own extract_text self-check covers printed text.
  expect(bytes.toString("latin1")).toContain(`(${androidTest.pageUrl})`)
  expect(bytes.toString("latin1")).not.toContain("groups.google.com")
  const svg = await request.get(androidTest.qr)
  expect(svg.status()).toBe(200)
  expect(svg.headers()["content-type"]).toContain("image/svg+xml")
  expect(await svg.text()).toContain("Yıkat Android test sayfası QR kodu")
})

for (const width of [320, 1280]) test(`android test page is accessible without overflow at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/android")
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1)
  const serious = (await new AxeBuilder({ page }).analyze()).violations.filter(v => v.impact === "serious" || v.impact === "critical")
  expect(serious.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(" ")).join(", ")}`)).toEqual([])
  const qr = page.locator(`main img[src="${androidTest.qr}"]`)
  await qr.scrollIntoViewIfNeeded()
  await expect.poll(() => qr.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
  await page.locator("main").screenshot({ path: test.info().outputPath(`android-${width}.png`) })
})
