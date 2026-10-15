import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { siteConfig } from "../lib/site"
import { services } from "../lib/services"
import { legalRoutes } from "../lib/legal-routes"

// Preserve contact destinations, legacy routes, business schema and accessibility
// while the three-page website replaces the previous single-page shop layout.

test("ana sayfa: h1 ve ana CTA'lar görünür", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Bakırköy’de ayakkabını yıkat.")
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await expect(page.locator(`a[href='${siteConfig.phoneHref}']`).first()).toBeAttached()
})

test("tüm tel: linkleri siteConfig telefonuna gider", async ({ page }) => {
  await page.goto("/")
  const telHrefs = await page.$$eval("a[href^='tel:']", (as) => as.map((a) => a.getAttribute("href")))
  expect(telHrefs.length).toBeGreaterThanOrEqual(1)
  for (const href of telHrefs) expect(href).toBe(siteConfig.phoneHref)
})

test("yol tarifi CTA'ları Google Maps directions hedefine gider (masaüstü Chrome)", async ({ page }) => {
  await page.goto("/")
  const dirHrefs = await page.$$eval("a[target='_blank'][href*='maps']", (as) => as.map((a) => a.getAttribute("href")))
  const directions = dirHrefs.filter((h) => h === siteConfig.directionsUrl)
  expect(directions.length).toBeGreaterThanOrEqual(3)
  for (const href of dirHrefs) expect(href).not.toContain("undefined")
})

test("eski aggregator rotaları ana sayfaya 308 döner", async ({ request }) => {
  // /iletisim listede DEĞİL (2026-08-27): iyzico incelemesi için yeniden gerçek sayfa.
  for (const path of ["/hizmetler", "/nasil-calisir", "/sss"]) {
    const res = await request.get(path, { maxRedirects: 0 })
    expect(res.status(), path).toBe(308)
    expect(res.headers()["location"], path).toBe("/")
  }
})

test("gizlilik yönlendirmeleri yerel sayfaya gider", async ({ request }) => {
  for (const path of ["/gizlilik", "/privacy"]) {
    const res = await request.get(path, { maxRedirects: 0 })
    expect(res.status(), path).toBe(307)
    expect(res.headers()["location"], path).toBe("/gizlilik-politikasi")
  }
})

test("legal + iletişim sayfaları canlı (iyzico eksik-belge listesi)", async ({ page }) => {
  for (const path of [
    "/kvkk",
    "/mesafeli-satis-sozlesmesi",
    "/gizlilik-politikasi",
    "/teslimat-ve-iade",
    "/iletisim",
    ...legalRoutes.map((route) => route.href),
  ]) {
    const res = await page.goto(path)
    expect(res?.status(), path).toBe(200)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  }
})

// Every legal text another one cites by name must be reachable on this site.
test("yasal metinlerdeki atıflar sitedeki sayfalara bağlanır", async ({ page }) => {
  await page.goto("/teslimat-ve-iade")
  await expect(page.locator("main a[href='/kullanim-kosullari']").first()).toContainText("Kullanım Koşulları")
  await page.goto("/mesafeli-satis-sozlesmesi")
  await expect(page.locator("main a[href='/odeme-ve-guvenli-alisveris']").first()).toContainText("Ödeme ve Güvenli Alışveriş")
  await page.goto("/gizlilik-politikasi")
  await expect(page.locator("main a[href='/kvkk']").first()).toContainText("KVKK Aydınlatma Metni")
  await expect(page.locator("main a[href='/kvkk-basvuru-formu']").first()).toBeVisible()
  // The KVKK notice is the canonical app text plus the website section, not the pre-pivot copy.
  await page.goto("/kvkk")
  const main = page.locator("main")
  await expect(main).toContainText("6. Kişisel Verilerin Aktarılması")
  await expect(main).toContainText("Web Sitesi (www.yikat.tech)")
  await expect(main).not.toContainText("çamaşırhanesinde")
  await expect(main).not.toContainText("İkas")
  await expect(main).not.toContainText("T.C. Kimlik No")
  for (const route of legalRoutes) {
    const res = await page.goto(route.href)
    expect(res?.status(), route.href).toBe(200)
    const hrefs = await page.$$eval("main a[href^='/']", (links) => links.map((link) => link.getAttribute("href")!.split("#")[0]))
    for (const href of new Set(hrefs)) expect((await page.request.get(href)).status(), `${route.href} → ${href}`).toBe(200)
  }
})

// Owner rule (2026-10-12): no page of the website links or redirects to app.yikat.tech.
test("hiçbir sayfa app.yikat.tech'e yönlendirmez", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text()
  const paths = [...sitemap.matchAll(/<loc>https:\/\/www\.yikat\.tech([^<]*)<\/loc>/g)].map((m) => m[1] || "/")
  expect(paths.length).toBeGreaterThan(20)
  for (const path of paths) {
    const res = await request.get(path)
    expect(res.status(), path).toBe(200)
    const html = await res.text()
    expect(html, path).not.toMatch(/href="https?:\/\/app\.yikat\.tech/)
    expect(html, path).not.toContain("Yıkat Gitsin")
  }
})

test("iyzico ile Öde + Visa + Mastercard markaları footer'da", async ({ page }) => {
  await page.goto("/")
  const footer = page.locator("footer")
  await expect(footer.getByText("iyzico ile Öde")).toBeVisible()
  for (const alt of ["iyzico", "Visa", "Mastercard"]) {
    await expect(footer.locator(`img[alt='${alt}']`), alt).toBeAttached()
  }
})

test("JSON-LD: business data is preserved without invisible FAQ content", async ({ page }) => {
  await page.goto("/")
  const blocks = await page.$$eval("script[type='application/ld+json']", (s) => s.map((x) => x.textContent ?? ""))
  const parsed = blocks.map((b) => JSON.parse(b))
  const lb = parsed.find((p) => p["@type"] === "DryCleaningOrLaundry")
  const faq = parsed.find((p) => p["@type"] === "FAQPage")
  expect(lb?.telephone).toBe(siteConfig.phoneE164)
  expect(lb?.priceRange).toBeUndefined()
  expect(lb?.openingHoursSpecification).toEqual(
    siteConfig.hours.schedule.map((slot) => expect.objectContaining({ dayOfWeek: [...slot.days], opens: slot.opens, closes: slot.closes })),
  )
  expect(lb?.openingHoursSpecification?.[0]).toMatchObject({ opens: "08:30", closes: "20:30" })
  expect(lb?.openingHoursSpecification?.[1]).toMatchObject({ dayOfWeek: ["Sunday"], opens: "10:00", closes: "20:30" })
  expect(lb?.hasOfferCatalog?.itemListElement?.length).toBeGreaterThan(0)
  // Kesin menü gelene dek Offer'larda fiyat alanı sızmamalı; kendi siteye yıldız şeması ASLA
  // (Google: kendi yorumunu kontrol eden varlığa review/aggregateRating uygunsuz).
  expect(JSON.stringify(lb)).not.toContain('"price"')
  expect(JSON.stringify(lb)).not.toContain("aggregateRating")
  expect(JSON.stringify(lb)).not.toContain('"review"')
  expect(faq).toBeUndefined()
  expect(lb?.sameAs).toContain("https://www.instagram.com/yikat.app/")
  expect(parsed.find((p) => p["@type"] === "WebSite")).toMatchObject({ name: "Yıkat" })
})

test("tax identity and the real drying cabinet are consistent", async ({ request }) => {
  for (const path of ["/iletisim", "/mesafeli-satis-sozlesmesi"]) {
    expect(await (await request.get(path)).text(), path).toContain("3830369314")
  }
  for (const path of ["/", "/ayakkabi-temizleme"]) {
    const html = await (await request.get(path)).text()
    expect(html, path).toContain("/videos/care/drying-cabinet-20261015.mp4")
    expect(html, path).not.toContain("/videos/care/drying-20261010.mp4")
  }
})

test("hizmet sayfaları canlı: 200 + doğru h1 + tel CTA", async ({ page }) => {
  for (const s of services) {
    const res = await page.goto(`/${s.slug}`)
    expect(res?.status(), s.slug).toBe(200)
    await expect(page.getByRole("heading", { level: 1 })).toContainText(s.h1.slice(0, 20))
    await expect(page.locator(`a[href='${siteConfig.phoneHref}']`).first()).toBeAttached()
  }
})

test("404 sayfası Türkçe ve dönüşüm çıkışlı", async ({ page }) => {
  const res = await page.goto("/olmayan-bir-sayfa")
  expect(res?.status()).toBe(404)
  await expect(page.getByRole("heading", { level: 1 })).toContainText("köpüklerin arasında")
  await expect(page.locator(`a[href='${siteConfig.phoneHref}']`)).toBeAttached()
})

async function expectNoSeriousAxe(page: import("@playwright/test").Page, label: string) {
  // Paralel worker yükü altında analiz, framer-motion girişleri otururken araya girebiliyor;
  // yarı saydam animasyon anları sahte color-contrast düğümleri üretir. Gerçek ihlal kalıcıdır:
  // ihlal görürsek animasyonlar bitsin diye bekleyip yeniden ölçüyoruz (en fazla 3 deneme).
  let bad: string[] = []
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await page.waitForTimeout(1500)
    const results = await new AxeBuilder({ page }).analyze()
    bad = results.violations
      .filter((v) => v.impact === "critical" || v.impact === "serious")
      .map((v) => `${label} → ${v.id}: ${v.nodes.length} node — ${v.help}; ${v.nodes.map(node => node.target.join(" ")).join(", ")}`)
    if (bad.length === 0) break
  }
  expect(bad).toEqual([])
}

// whileInView blokları scroll 0'da opacity:0 kalır ve axe görsel kuralları (color-contrast)
// görünmez düğümde atlar — taramadan önce sayfayı sonuna dek kaydırıp girişleri tetikliyoruz.
async function scrollThrough(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
  })
  await page.waitForTimeout(800) // son girişler otursun
}

test("axe: critical/serious ihlal yok (ana sayfa, tam scroll)", async ({ page }) => {
  await page.goto("/")
  await scrollThrough(page)
  await expectNoSeriousAxe(page, "/")
})

test("axe: mobil viewport + menü açıkken ihlal yok", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  await scrollThrough(page)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.click("header button[aria-controls='mobile-menu']")
  await page.waitForTimeout(500)
  await expectNoSeriousAxe(page, "mobil+menü")
})

test("axe: 404 ve legal sayfalar", async ({ page }) => {
  // Canonical legal pages are longer and the route set includes the new references.
  test.setTimeout(120_000)
  for (const path of [
    "/olmayan-bir-sayfa",
    "/kvkk",
    "/mesafeli-satis-sozlesmesi",
    "/gizlilik-politikasi",
    "/teslimat-ve-iade",
    "/iletisim",
    "/kullanim-kosullari",
    "/kvkk-basvuru-formu",
    ...services.map((s) => `/${s.slug}`),
  ]) {
    await page.goto(path)
    await page.waitForTimeout(800)
    await expectNoSeriousAxe(page, path)
  }
})
