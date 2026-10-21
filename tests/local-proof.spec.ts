import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { createHash } from "node:crypto"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { customerCases, publishableCases, type CustomerCase } from "../lib/customer-cases"
import { reviewRequest } from "../lib/review-request"

const approvedFixture: CustomerCase = {
  slug: "test-pair", title: "Test çifti", material: "Bez", problem: "Test kiri",
  treatment: "Test işlemi", result: "Test sonucu", limitations: "Test sınırı",
  completedOn: "2026-10-15",
  before: { src: "/images/cases/test-pair/before-abcdef123456.webp", alt: "Test öncesi", width: 800, height: 1000 },
  after: { src: "/images/cases/test-pair/after-fedcba123456.webp", alt: "Test sonrası", width: 800, height: 1000 },
  publication: { publicationReviewId: "test-publication", permissionVerifiedAt: "2026-10-15T12:00:00Z", approvedAt: "2026-10-16T12:00:00Z", revokedAt: null },
}
const now = Date.parse("2026-10-17T00:00:00Z")

test("case publishing fails closed for missing, withdrawn or future permission review", () => {
  expect(publishableCases([approvedFixture], now)).toHaveLength(1)
  for (const publication of [
    { ...approvedFixture.publication, publicationReviewId: "" },
    { ...approvedFixture.publication, permissionVerifiedAt: "" },
    { ...approvedFixture.publication, permissionVerifiedAt: "2026-10-17T12:00:00Z" },
    { ...approvedFixture.publication, approvedAt: "2026-10-18T12:00:00Z" },
    { ...approvedFixture.publication, revokedAt: "2026-10-16T13:00:00Z" },
  ]) expect(publishableCases([{ ...approvedFixture, publication }], now)).toEqual([])
})

test("case publishing rejects private media, mixed pairs, incomplete facts and duplicate cases", () => {
  for (const src of ["https://example.supabase.co/storage/v1/object/sign/private/file", "/images/cases/other-pair/before-abcdef123456.webp", "/images/cases/test-pair/../before-abcdef123456.webp", "/images/cases/test-pair/after-abcdef123456.webp"]) {
    expect(publishableCases([{ ...approvedFixture, before: { ...approvedFixture.before, src } }], now)).toEqual([])
  }
  expect(publishableCases([{ ...approvedFixture, limitations: " " }], now)).toEqual([])
  expect(publishableCases([{ ...approvedFixture, completedOn: "2026-02-30" }], now)).toEqual([])
  expect(publishableCases([approvedFixture, approvedFixture], now)).toHaveLength(1)
})

test("every shipped case has valid local content-addressed public images and complete review", () => {
  expect(publishableCases(customerCases)).toHaveLength(customerCases.length)
  const referenced = customerCases.flatMap(item => [item.before.src, item.after.src]).sort()
  const shipped = existsSync("public/images/cases")
    ? readdirSync("public/images/cases", { recursive: true }).filter(path => String(path).endsWith(".webp")).map(path => `/images/cases/${path}`).sort()
    : []
  expect(shipped).toEqual(referenced) // Removing a case must also remove its public image bytes.
  for (const item of customerCases) for (const photo of [item.before, item.after]) {
    const bytes = readFileSync(`public${photo.src}`)
    expect(photo.src).toContain(createHash("sha256").update(bytes).digest("hex").slice(0, 12))
    expect(bytes.subarray(0, 4).toString()).toBe("RIFF")
    expect(bytes.subarray(8, 12).toString()).toBe("WEBP")
  }
})

test("service scope and collection expectations are visible without JavaScript without invented cases", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  const page = await context.newPage()
  await page.goto("/ayakkabi-temizleme#hizmet-bilgisi")
  const section = page.locator("#hizmet-bilgisi")
  await expect(section).toContainText("Lostra, boyama, renk yenileme, taban değişimi veya onarım hizmeti vermiyoruz")
  await expect(section).not.toContainText(/ücretinin içinde|fiyata dahil|tamir/i)
  await expect(section).toContainText("kabulde konuşuyoruz")
  await expect(section).toContainText("fotoğrafla bize ulaş")
  await expect(section).not.toContainText(/24 saat|48 saat|iki gün|garantili|%100/i)
  if (!customerCases.length) await expect(page.locator("#sonuclar")).toHaveCount(0)
  await context.close()
})

test("review utility has neutral direct review links and a downloadable PDF without being an SEO landing page", async ({ page, request }) => {
  await page.goto("/yorum")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Deneyimini paylaş.")
  await expect(page.getByRole("link", { name: "Google’da yorum yaz", exact: true })).toHaveAttribute("href", reviewRequest.url)
  await expect(page.locator("main")).toContainText("Olumlu ya da olumsuz")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.yikat.tech/yorum")
  await expect(page.getByRole("link", { name: "Tezgâh için yorum kartını indir (PDF)" })).toHaveAttribute("download", "")
  const pdf = await request.get(reviewRequest.pdf)
  expect(pdf.status()).toBe(200)
  expect(pdf.headers()["content-type"]).toContain("application/pdf")
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-")
  const svg = await request.get(reviewRequest.qr)
  expect(svg.status()).toBe(200)
  expect(await svg.text()).toContain("Yıkat Bakırköy Google yorum QR kodu")
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("https://www.yikat.tech/yorum")
  await page.goto("/bakirkoy-ayakkabi-temizleme")
  await expect(page.getByRole("link", { name: "gerçek deneyimini Google’da paylaşabilirsin" })).toHaveAttribute("href", "/yorum")
})

for (const width of [320, 1280]) test(`service expectations and review page remain accessible at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  for (const path of ["/ayakkabi-temizleme#hizmet-bilgisi", "/yorum"]) {
    await page.goto(path)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1)
    expect((await new AxeBuilder({ page }).include("main").analyze()).violations).toEqual([])
    await page.locator(path === "/yorum" ? "main" : "#hizmet-bilgisi").screenshot({ path: test.info().outputPath(`${path === "/yorum" ? "review" : "expectations"}-${width}.png`) })
  }
})
