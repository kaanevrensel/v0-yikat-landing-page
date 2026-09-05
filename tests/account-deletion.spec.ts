import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test("deletion request is public and explains the actual email action", async ({ page }) => {
  const response = await page.goto("/hesap-silme")
  expect(response?.status()).toBe(200)
  await expect(page.getByRole("heading", { level: 1, name: "Hesap silme" })).toBeVisible()
  await expect(page.getByText("Yıkat Gitsin (Yıkat) müşteri hesabınız ve kişisel verileriniz")).toBeVisible()
  await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", "https://www.yikat.tech/hesap-silme")

  const request = page.getByRole("link", { name: "Silme talebi için e-posta yaz" })
  const href = await request.getAttribute("href")
  expect(href).not.toBeNull()
  const mail = new URL(href!)
  expect(mail.protocol).toBe("mailto:")
  expect(mail.pathname).toBe("destek@yikat.tech")
  expect(mail.searchParams.get("subject")).toContain("hesap silme talebi")
  expect(mail.searchParams.get("body")).toContain("hesabıma kayıtlı e-posta adresinden")

  // Requesting erasure must not introduce another form that collects credentials.
  await expect(page.locator("input, textarea, form")).toHaveCount(0)
  await expect(page.getByText(/bağlantıya dokunmak hesabınızı silmez/)).toBeVisible()
  await expect(page.getByText("Şifrenizi, doğrulama kodunuzu veya kart bilgilerinizi göndermeyin.")).toBeVisible()
  await expect(page.getByRole("main")).toContainText("yaklaşık 30 günlük bekleme")
  await expect(page.getByRole("main")).toContainText("10 yıla kadar")
  await expect(page.getByRole("main")).toContainText("Profil → Hesap bilgilerim → Hesabımı sil")
  await expect(page.getByRole("link", { name: "Gizlilik Politikası", exact: true })).toHaveAttribute("href", "/gizlilik-politikasi")
})

test("deletion help is discoverable from the footer and sitemap", async ({ page, request }) => {
  await page.goto("/")
  const link = page.locator("footer").getByRole("link", { name: "Hesap Silme", exact: true })
  await expect(link).toHaveAttribute("href", "/hesap-silme")
  await link.click()
  await expect(page).toHaveURL(/\/hesap-silme$/)
  const sitemap = await request.get("/sitemap.xml")
  expect(sitemap.ok()).toBe(true)
  expect(await sitemap.text()).toContain("https://www.yikat.tech/hesap-silme")
})

test("deletion help has no serious accessibility violations", async ({ page }) => {
  await page.goto("/hesap-silme")
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([])
})

test("deletion help and section headings remain usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  try {
    await page.goto("/hesap-silme")
    await expect(page.getByRole("link", { name: "Silme talebi için e-posta yaz" })).toBeVisible()
    await page.goto("/")
    const heading = page.locator("#nasil-calisir h2")
    await heading.scrollIntoViewIfNeeded()
    await expect(heading).toBeVisible()
    const words = heading.locator("span[aria-hidden] > span")
    expect(await words.count()).toBeGreaterThan(0)
    for (const word of await words.all()) {
      await expect(word).toBeVisible()
      await expect(word).toHaveCSS("opacity", "1")
      await expect(word).toHaveCSS("filter", "none")
    }
  } finally {
    await context.close()
  }
})
