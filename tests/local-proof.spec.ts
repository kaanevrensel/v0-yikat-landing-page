import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { createHash } from "node:crypto"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { CASE_GALLERY_PATH, caseGroups, caseReel, caseShare, customerCases, publishableCases, publishableReel, publishableShare, showcaseCases, type CaseReel, type CaseShare, type CustomerCase } from "../lib/customer-cases"
import { services } from "../lib/services"
import { reviewRequest } from "../lib/review-request"

const approvedFixture: CustomerCase = {
  slug: "test-pair", group: "sneaker", title: "Test çifti", material: "Bez", problem: "Test kiri",
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
  expect(publishableCases([{ ...approvedFixture, group: "terlik" as CustomerCase["group"] }], now)).toEqual([])
})

const reelFixture: CaseReel = {
  slugs: ["test-pair"], title: "Test filmi", description: "Test çiftinin önce ve sonrası.",
  video: { src: "/videos/cases/once-sonra-abcdef123456.mp4", width: 960, height: 720, durationSeconds: 21.6 },
  poster: { src: "/videos/cases/once-sonra-poster-abcdef123456.webp", width: 960, height: 720 },
  captions: { src: "/videos/cases/once-sonra-abcdef123456.vtt" }, publishedOn: "2026-10-16",
}

test("the before/after film is withheld unless every case it shows is publishable", () => {
  const live = publishableCases([approvedFixture], now)
  expect(publishableReel(reelFixture, live, now)).toEqual(reelFixture)
  expect(publishableReel(null, live)).toBeNull()
  expect(publishableReel(reelFixture, [])).toBeNull()
  expect(publishableReel({ ...reelFixture, slugs: ["test-pair", "unpublished-pair"] }, live)).toBeNull()
  expect(publishableReel({ ...reelFixture, slugs: [] }, live)).toBeNull()
  for (const src of ["/videos/once-sonra-abcdef123456.mp4", "https://example.supabase.co/storage/v1/object/public/x.mp4", "/videos/cases/once-sonra.mp4"])
    expect(publishableReel({ ...reelFixture, video: { ...reelFixture.video, src } }, live)).toBeNull()
  expect(publishableReel({ ...reelFixture, poster: { ...reelFixture.poster, src: "/images/cases/once-sonra-poster-abcdef123456.webp" } }, live)).toBeNull()
  expect(publishableReel({ ...reelFixture, description: " " }, live)).toBeNull()
  expect(publishableReel({ ...reelFixture, publishedOn: "2026-10-18" }, live, now)).toBeNull()
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

test("the shipped film files are exactly the published film, content-addressed", () => {
  const reel = publishableReel(caseReel, publishableCases(customerCases))
  expect(reel).toEqual(caseReel) // A film that fails its gate must not be left in the data.
  const referenced = reel ? [reel.video.src, reel.poster.src, reel.captions.src].sort() : []
  const shipped = existsSync("public/videos/cases")
    ? readdirSync("public/videos/cases", { recursive: true }).filter(path => /\.(mp4|webp|vtt)$/.test(String(path))).map(path => `/videos/cases/${path}`).sort()
    : []
  expect(shipped).toEqual(referenced) // Withdrawing the film must also remove its bytes.
  for (const src of referenced) {
    const bytes = readFileSync(`public${src}`)
    expect(src).toContain(createHash("sha256").update(bytes).digest("hex").slice(0, 12))
  }
  if (reel) expect(readFileSync(`public${reel.captions.src}`, "utf8").startsWith("WEBVTT")).toBe(true)
})

test("the before/after gallery is not listed or served without reviewed cases", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text()
  if (publishableCases(customerCases).length) {
    expect(sitemap).toContain(`https://www.yikat.tech${CASE_GALLERY_PATH}`)
    expect((await request.get(CASE_GALLERY_PATH)).status()).toBe(200)
    const reel = publishableReel(caseReel, publishableCases(customerCases))
    if (reel) { // A withdrawn film must not live on in shared caches for a year.
      const cache = (await request.head(reel.video.src)).headers()["cache-control"] ?? ""
      expect(cache).toContain("max-age=86400")
      expect(cache).not.toContain("immutable")
    }
  } else {
    expect(sitemap).not.toContain(CASE_GALLERY_PATH)
    expect((await request.get(CASE_GALLERY_PATH)).status()).toBe(404)
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

for (const width of [320, 1280]) test(`published before/after gallery stays accessible and inside the viewport at ${width}px`, async ({ page }) => {
  const cases = publishableCases(customerCases)
  test.skip(!cases.length, "No reviewed case is published yet.")
  await page.setViewportSize({ width, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto(CASE_GALLERY_PATH)
  await expect(page.getByRole("heading", { level: 1 })).toContainText("önce ve sonra")
  await expect(page.locator("article.case")).toHaveCount(cases.length)
  for (const item of cases) await expect(page.locator(`#case-${item.slug} img`)).toHaveCount(2)
  const reel = publishableReel(caseReel, cases)
  if (reel) {
    const video = page.locator(".case-reel video")
    await expect(video).toHaveAttribute("preload", "none")
    await expect(video).not.toHaveAttribute("autoplay", /.*/)
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1)
  expect((await new AxeBuilder({ page }).include("main").analyze()).violations).toEqual([])
  await page.goto("/ayakkabi-temizleme#sonuclar")
  await expect(page.locator("#sonuclar article.case")).toHaveCount(Math.min(3, cases.length))
  if (cases.length > 3) {
    // Beside the heading and again after the cases.
    const links = page.locator("#sonuclar").getByRole("link", { name: `${cases.length} çiftin hepsine bak` })
    await expect(links).toHaveCount(2)
    for (const link of await links.all()) await expect(link).toHaveAttribute("href", CASE_GALLERY_PATH)
  }
})

const shareFixture: CaseShare = { slug: "test-pair", src: "/images/cases/once-sonra-paylasim-abcdef123456.jpg", width: 1200, height: 630, alt: "Test çifti, önce ve sonra" }

test("the link preview picture is withheld unless its pair is publishable", () => {
  const live = publishableCases([approvedFixture], now)
  expect(publishableShare(shareFixture, live)).toEqual(shareFixture)
  expect(publishableShare(null, live)).toBeNull()
  expect(publishableShare(shareFixture, [])).toBeNull()
  expect(publishableShare({ ...shareFixture, slug: "unpublished-pair" }, live)).toBeNull()
  for (const src of ["/images/og.jpg", "https://example.supabase.co/storage/v1/object/public/x.jpg", "/images/cases/test-pair/before-abcdef123456.webp", "/images/cases/once-sonra-paylasim.jpg"])
    expect(publishableShare({ ...shareFixture, src }, live)).toBeNull()
  expect(publishableShare({ ...shareFixture, alt: " " }, live)).toBeNull()
  expect(publishableShare({ ...shareFixture, width: 900, height: 900 }, live)).toBeNull()
})

// Width and height from the first baseline/progressive frame header of a JPEG.
function jpegSize(bytes: Buffer) {
  for (let i = 2; i < bytes.length - 9;) {
    if (bytes[i] !== 0xff) return null
    const marker = bytes[i + 1]
    if (marker === 0xc0 || marker === 0xc2) return { height: bytes.readUInt16BE(i + 5), width: bytes.readUInt16BE(i + 7) }
    i += 2 + bytes.readUInt16BE(i + 2)
  }
  return null
}

test("the shipped link preview picture is exactly the published one: content-addressed, metadata-free and small enough for WhatsApp", () => {
  const share = publishableShare(caseShare, publishableCases(customerCases))
  expect(share).toEqual(caseShare) // A picture that fails its gate must not be left in the data.
  const shipped = existsSync("public/images/cases")
    ? readdirSync("public/images/cases", { recursive: true }).filter(path => /\.(jpe?g|png)$/.test(String(path))).map(path => `/images/cases/${path}`)
    : []
  expect(shipped).toEqual(share ? [share.src] : []) // Withdrawing its pair must also remove its bytes.
  if (!share) return
  const bytes = readFileSync(`public${share.src}`)
  expect(share.src).toContain(createHash("sha256").update(bytes).digest("hex").slice(0, 12))
  expect([...bytes.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff])
  expect(bytes.length).toBeLessThan(300_000)
  expect(bytes.includes(Buffer.from("Exif"))).toBe(false)
  expect(jpegSize(bytes)).toEqual({ width: share.width, height: share.height })
})

test("the gallery's link preview shows its pair, and pages without one keep the site picture", async ({ page }) => {
  const share = publishableShare(caseShare, publishableCases(customerCases))
  test.skip(!share, "No published pair to show.")
  await page.goto(CASE_GALLERY_PATH)
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `https://www.yikat.tech${share!.src}`)
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", String(share!.width))
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", String(share!.height))
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", share!.alt)
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", `https://www.yikat.tech${share!.src}`)
  const ld = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(node => JSON.parse(node.textContent!)))
  expect(ld.find(item => item["@type"] === "CollectionPage")?.primaryImageOfPage?.contentUrl).toBe(`https://www.yikat.tech${share!.src}`)
  await page.goto("/ayakkabi-temizleme")
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://www.yikat.tech/images/og.jpg")
})

test("strips outside the gallery show the clearest pairs: one group, or one pair per group first", () => {
  const fixtures = (["sneaker", "sneaker", "suet", "deri"] as const).map((group, index) => ({ ...approvedFixture, slug: `test-pair-${index}`, group,
    before: { ...approvedFixture.before, src: `/images/cases/test-pair-${index}/before-abcdef12345${index}.webp` },
    after: { ...approvedFixture.after, src: `/images/cases/test-pair-${index}/after-fedcba12345${index}.webp` } }))
  expect(showcaseCases("sneaker", 3, fixtures)).toEqual({ shown: fixtures.slice(0, 2), total: 2 })
  expect(showcaseCases(undefined, 3, fixtures).shown.map(item => item.group)).toEqual(["sneaker", "suet", "deri"])
  expect(showcaseCases(undefined, 3, [])).toEqual({ shown: [], total: 0 })
})

test("home, Bakırköy and every material page lead into the gallery only while pairs are published", async ({ page, request }) => {
  const cases = publishableCases(customerCases)
  const gallery = cases.length ? await (await request.get(CASE_GALLERY_PATH)).text() : ""
  const pages: [string, string][] = [["/", CASE_GALLERY_PATH], ["/bakirkoy-ayakkabi-temizleme", CASE_GALLERY_PATH],
    ...services.map(service => [`/${service.slug}`, `${CASE_GALLERY_PATH}#${caseGroups.find(group => group.id === service.caseGroup)!.anchor}`] as [string, string])]
  for (const [path, more] of pages) {
    await page.goto(path)
    const links = page.locator(`main a[href^="${CASE_GALLERY_PATH}"]`)
    if (!cases.length) { await expect(links, path).toHaveCount(0); continue }
    await expect(page.locator(`main a[href="${more}"]`), path).toHaveCount(1)
    for (const href of await links.evaluateAll(nodes => nodes.map(node => node.getAttribute("href")!))) {
      const anchor = href.split("#")[1] // Every card and group link lands on a real place in the gallery.
      if (anchor) expect(gallery, `${path} → ${href}`).toContain(`id="${anchor}"`)
    }
    if (path !== "/") {
      const service = services.find(item => `/${item.slug}` === path)
      const shown = showcaseCases(service?.caseGroup, 3).shown
      await expect(page.locator(".case-teaser-item"), path).toHaveCount(shown.length)
      for (const item of shown) await expect(page.locator(`.case-teaser a[href="${CASE_GALLERY_PATH}#case-${item.slug}"]`), path).toHaveText(item.title)
    }
  }
  if (cases.length) {
    await page.goto("/")
    await expect(page.getByRole("link", { name: `Önce ve sonra Dükkândan ${cases.length} çift` })).toHaveAttribute("href", CASE_GALLERY_PATH)
  }
})

for (const width of [320, 1280]) test(`before/after strips stay accessible and inside the viewport at ${width}px`, async ({ page }) => {
  test.skip(!publishableCases(customerCases).length, "No reviewed case is published yet.")
  await page.setViewportSize({ width, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  for (const [path, target] of [["/", ".washing-case-link"], ["/bakirkoy-ayakkabi-temizleme", ".case-teaser"], ["/suet-nubuk-temizleme", ".case-teaser"]]) {
    await page.goto(path)
    const strip = page.locator(target)
    await strip.scrollIntoViewIfNeeded()
    await expect(strip.locator("img").first()).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth), path).toBeLessThanOrEqual(width + 1)
    expect((await new AxeBuilder({ page }).include(target).analyze()).violations, path).toEqual([])
    await (path === "/" ? page.locator(".washing-copy") : strip).screenshot({ path: test.info().outputPath(`strip${path.replace(/\//g, "-") || "-home"}-${width}.png`) })
  }
})
