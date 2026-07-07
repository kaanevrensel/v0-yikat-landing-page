import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { faqs, siteConfig } from "../lib/site"

// Dükkânın iki dönüşüm yolu (tel + yol tarifi), eski rota yönlendirmeleri, JSON-LD ve
// temel a11y — bir motion refaktörü bunlardan birini bozarsa burada kırmızı yanar.

test("ana sayfa: h1 ve ana CTA'lar görünür", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ayakkabın ilk günkü gibi.")
  await expect(page.locator(`a[href='${siteConfig.phoneHref}']`).first()).toBeAttached()
})

test("tüm tel: linkleri siteConfig telefonuna gider", async ({ page }) => {
  await page.goto("/")
  const telHrefs = await page.$$eval("a[href^='tel:']", (as) => as.map((a) => a.getAttribute("href")))
  expect(telHrefs.length).toBeGreaterThanOrEqual(3)
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
  for (const path of ["/hizmetler", "/nasil-calisir", "/partnerlik", "/sss", "/iletisim"]) {
    const res = await request.get(path, { maxRedirects: 0 })
    expect(res.status(), path).toBe(308)
    expect(res.headers()["location"], path).toBe("/")
  }
})

test("legal sayfalar canlı", async ({ page }) => {
  for (const path of ["/kvkk", "/mesafeli-satis-sozlesmesi"]) {
    const res = await page.goto(path)
    expect(res?.status(), path).toBe(200)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  }
})

test("JSON-LD blokları geçerli: LocalBusiness + tüm SSS'li FAQPage", async ({ page }) => {
  await page.goto("/")
  const blocks = await page.$$eval("script[type='application/ld+json']", (s) => s.map((x) => x.textContent ?? ""))
  const parsed = blocks.map((b) => JSON.parse(b))
  const lb = parsed.find((p) => p["@type"] === "LocalBusiness")
  const faq = parsed.find((p) => p["@type"] === "FAQPage")
  expect(lb?.telephone).toBe(siteConfig.phoneE164)
  expect(lb?.hasOfferCatalog?.itemListElement?.length).toBeGreaterThan(0)
  // price:null kuralı: şemada fiyat alanı sızmamalı
  expect(JSON.stringify(lb)).not.toContain('"price"')
  expect(faq?.mainEntity?.length).toBe(faqs.length)
})

test("404 sayfası Türkçe ve dönüşüm çıkışlı", async ({ page }) => {
  const res = await page.goto("/olmayan-bir-sayfa")
  expect(res?.status()).toBe(404)
  await expect(page.getByRole("heading", { level: 1 })).toContainText("köpüklerin arasında")
  await expect(page.locator(`a[href='${siteConfig.phoneHref}']`)).toBeAttached()
})

test("axe: critical/serious ihlal yok (ana sayfa)", async ({ page }) => {
  await page.goto("/")
  await page.waitForTimeout(1500) // giriş animasyonları otursun
  const results = await new AxeBuilder({ page }).analyze()
  const bad = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious")
  expect(
    bad.map((v) => `${v.id}: ${v.nodes.length} node — ${v.help}`),
  ).toEqual([])
})
