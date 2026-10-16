import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const origin = "https://www.yikat.tech"
const store = "https://apps.apple.com/tr/app/id6806875753"

test("search metadata connects the official app and contact page to one shop identity", async ({ request }) => {
  for (const path of ["/", "/urun", "/iletisim"]) {
    const res = await request.get(path)
    expect(res.status()).toBe(200)
    const html = await res.text()
    const url = path === "/" ? origin : origin + path
    expect(html).toContain(`rel="canonical" href="${url}"`)
    expect(html).toContain(`property="og:url" content="${url}"`)
    const title = html.match(/<title>(.*?)<\/title>/)![1]
    expect(html).toContain(`property="og:title" content="${title}"`)
    expect(html).toContain(`name="twitter:title" content="${title}"`)
    const graph = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]))
    const business = graph.filter(item => item["@type"] === "DryCleaningOrLaundry")
    expect(business).toHaveLength(1)
    expect(business[0].legalName).toBe("Ahmet Kaan Evrensel (şahıs işletmesi)")
    const website = graph.filter(item => item["@type"] === "WebSite")
    expect(website).toHaveLength(1)
    expect(website[0].alternateName).toContain("yikat.tech")
    expect(website[0].publisher["@id"]).toBe(business[0]["@id"])
    if (path === "/urun") {
      const product = graph.find(item => item["@type"] === "WebPage")
      expect(product).toMatchObject({ significantLink: store, publisher: { "@id": business[0]["@id"] }, about: { "@id": business[0]["@id"] } })
      expect(graph.some(item => ["MobileApplication", "SoftwareApplication"].includes(item["@type"]))).toBe(false)
    }
    if (path === "/iletisim") expect(graph.find(item => item["@type"] === "ContactPage").mainEntity["@id"]).toBe(business[0]["@id"])
    expect(html).not.toContain("yikatapp.com")
    expect(html).not.toContain("play.google.com/store")
  }
})

test("official app links and honest availability work on a small screen without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } })
  const page = await context.newPage()
  await page.goto("/urun")
  await expect(page.locator("main")).toContainText("Uygulamadan yeni sipariş alımı ve kapıdan alım henüz açık değil")
  await page.locator("summary").filter({ hasText: "Yıkat uygulamasını nereden indirebilirim?" }).click()
  await expect(page.locator("main").getByRole("link", { name: "Yıkat’ı App Store’dan indir" })).toHaveAttribute("href", store)
  await expect(page.locator(".faq-list")).toContainText("AHMET KAAN EVRENSEL")
  await page.getByRole("link", { name: "iletişim sayfamıza" }).click()
  await expect(page).toHaveURL(/\/iletisim$/)
  await expect(page.locator("main")).toContainText("Android uygulaması henüz genel kullanıma açılmadı")
  await expect(page.locator("main").getByRole("link", { name: "Yıkat’ı App Store’dan indir" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Instagram: @yikat.app" })).toHaveAttribute("href", "https://www.instagram.com/yikat.app/")
  const width = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }))
  expect(width.document).toBeLessThanOrEqual(width.viewport + 1)
  await page.screenshot({ path: "test-results/brand-contact-320.png", fullPage: true })
  await context.close()
})

test("updated app and contact content remains accessible on desktop and mobile", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ["/urun", "/iletisim"]) {
      await page.goto(path)
      if (path === "/urun") await page.locator("summary").filter({ hasText: "Yıkat uygulamasını nereden indirebilirim?" }).click()
      const violations = (await new AxeBuilder({ page }).include("main").analyze()).violations.filter(v => ["serious", "critical"].includes(v.impact ?? ""))
      expect(violations.map(v => v.id), `${path} at ${width}`).toEqual([])
      if (path === "/urun") await page.locator(".faq-section").screenshot({ path: `test-results/brand-app-faq-${width}.png` })
    }
  }
})
