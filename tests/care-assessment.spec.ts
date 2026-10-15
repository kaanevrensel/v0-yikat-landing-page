import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { assessCare, careMaterials, careConditions } from "../lib/care-assessment"
import { careGuides } from "../lib/care-guides"
import { services } from "../lib/services"
import { careSources } from "../lib/discovery"
import { siteConfig } from "../lib/site"

test("all material and condition paths lead to existing relevant content without a fabricated quote", () => {
  const validPaths = new Set(["/bakirkoy-ayakkabi-temizleme", ...services.map(service => `/${service.slug}`), ...careGuides.map(guide => `/rehber/${guide.slug}`)])
  for (const material of careMaterials) for (const condition of careConditions) {
    const advice = assessCare(material.value, condition.value)!
    for (const link of [advice.guide, advice.materialGuide, advice.service]) expect(validPaths.has(link.href), link.href).toBe(true)
    expect(careSources[advice.sourceId]?.url).toMatch(/^https:\/\//)
    expect(JSON.stringify(advice)).not.toMatch(/₺|\d+\s*(TL|günde|saatte)|kesin çıkar|garantili/i)
  }
  expect(assessCare("suede", "wet")!.service.href).toBe("/suet-nubuk-temizleme")
  expect(assessCare("leather", "color")!.guide.href).toBe("/rehber/beyaz-ayakkabi-nasil-temizlenir")
})

test("damage takes priority over material cleaning steps and unknown material does not invite trial cleaning", () => {
  for (const material of careMaterials) {
    const advice = assessCare(material.value, "damage")!
    expect(advice.next).toContain("ovalama ya da sökmeye çalışma")
    expect(advice.materialNote).toBe("")
  }
  expect(assessCare("mixed", "dirt")!.next).toContain("bilmeden ürün veya fırça seçme")
  for (const bad of ["", "unknown", "__proto__", "constructor"]) {
    expect(assessCare(bad, "dirt")).toBeNull()
    expect(assessCare("textile", bad)).toBeNull()
  }
})

test("native selects keep keyboard focus while advice updates and clearing removes stale advice", async ({ page }) => {
  await page.goto("/ayakkabi-temizleme")
  const tool = page.locator("#bakim-secimi")
  const material = tool.getByLabel("Malzemesi", { exact: true })
  const condition = tool.getByLabel("Gördüğün durum", { exact: true })
  await expect(material).toBeVisible()
  await material.focus()
  await expect(material).toBeFocused()
  // Exercise the native selection through Playwright's select API. macOS Chrome's
  // OS popup does not commit synthetic arrow keys consistently in headless mode.
  await material.selectOption("textile")
  await expect(material).toHaveValue("textile")
  await page.keyboard.press("Tab")
  await expect(condition).toBeFocused()
  await condition.selectOption("damage")
  await expect(tool.getByRole("heading", { name: "Temizlikten önce mevcut hasarı göster." })).toBeVisible()
  await expect(tool.getByRole("status")).toContainText("Rehber güncellendi")
  await expect(condition).toBeFocused()
  await material.selectOption("suede")
  await condition.selectOption("wet")
  await expect(tool.getByRole("link", { name: "Süet ve nubuk temizliğinin kapsamı" })).toHaveAttribute("href", "/suet-nubuk-temizleme")
  await expect(tool.getByRole("heading", { name: "Önce kuruma durumunu değerlendir." })).toBeVisible()
  await condition.selectOption("")
  await expect(tool.locator(".care-assessment-result")).toHaveCount(0)
  await expect(page).toHaveURL(/\/ayakkabi-temizleme$/)
})

test("selection stays local and photo enquiry carries only the public page context", async ({ page }) => {
  await page.goto("/ayakkabi-temizleme?private=not-for-sharing")
  const tool = page.locator("#bakim-secimi")
  const storageBefore = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }))
  const writes: string[] = []
  page.on("request", request => { if (["POST", "PUT", "PATCH"].includes(request.method())) writes.push(request.url()) })
  await tool.getByLabel("Malzemesi", { exact: true }).selectOption("suede")
  await tool.getByLabel("Gördüğün durum", { exact: true }).selectOption("stain")
  const link = tool.getByRole("link", { name: "Fotoğrafla birlikte sor" })
  const message = new URL((await link.getAttribute("href"))!).searchParams.get("text")!
  expect(message).toContain(`${siteConfig.url}/ayakkabi-temizleme`)
  expect(message).not.toMatch(/private|not-for-sharing|suede|stain/)
  expect(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }))).toEqual(storageBefore)
  expect(writes).toEqual([])
  await page.reload()
  await expect(tool.getByLabel("Malzemesi", { exact: true })).toHaveValue("")
  await expect(tool.getByLabel("Gördüğün durum", { exact: true })).toHaveValue("")
})

test("no-JavaScript readers get usable guidance and ordinary guide and contact links", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
  const page = await context.newPage()
  await page.goto("/ayakkabi-temizleme")
  const tool = page.locator("#bakim-secimi")
  await expect(tool.getByRole("heading", { name: "Önce malzemeyi ve sorunu ayır." })).toBeVisible()
  await expect(tool).toContainText("çatlak veya taban açılmasını kir gibi ovalama")
  await expect(tool.getByRole("combobox")).toHaveCount(0)
  await tool.getByRole("link", { name: "Düz deri", exact: true }).click()
  await expect(page).toHaveURL(/\/rehber\/deri-ayakkabi-nasil-temizlenir$/)
  await page.goBack()
  await expect(tool.getByRole("link", { name: "Fotoğrafla birlikte sor" })).toHaveAttribute("href", new RegExp(`^${siteConfig.whatsappHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`))
  await context.close()
})

for (const width of [320, 1280]) test(`selected care guidance is accessible and fits at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/ayakkabi-temizleme")
  const tool = page.locator("#bakim-secimi")
  await tool.getByLabel("Malzemesi", { exact: true }).selectOption("mixed")
  await tool.getByLabel("Gördüğün durum", { exact: true }).selectOption("damage")
  const violations = (await new AxeBuilder({ page }).include("#bakim-secimi").analyze()).violations
  expect(violations.map(v => `${v.id}: ${v.nodes.map(n => n.target)}`)).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1)
  for (const select of await tool.getByRole("combobox").all()) {
    const bounds = await select.boundingBox()
    expect(bounds!.height).toBeGreaterThanOrEqual(44)
  }
  await tool.screenshot({ path: test.info().outputPath(`care-guidance-${width}.png`) })
})
