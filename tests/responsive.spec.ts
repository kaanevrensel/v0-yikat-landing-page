import { test, expect, devices, type Page, type Locator } from "@playwright/test"

// Preserve touch, DPR and mobile UA while varying the CSS width. The production
// suite uses the existing installed Chrome channel; this does not require WebKit.
test.use({ ...devices["iPhone 14"], browserName: "chromium", channel: "chrome" })
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
})

async function expectNoDocumentOverflow(page: Page) {
  const widths = await page.evaluate(() => {
    window.scrollTo(9999, window.scrollY)
    return {
      content: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
      horizontalOffset: window.scrollX,
    }
  })
  expect(widths.content).toBeLessThanOrEqual(widths.viewport + 1)
  expect(widths.horizontalOffset).toBeLessThanOrEqual(1)
}

async function expectTouchTargets(controls: Locator) {
  for (const control of await controls.all()) {
    if (!(await control.isVisible())) continue
    const box = await control.boundingBox()
    expect(box, await control.textContent() ?? "control").not.toBeNull()
    expect(box!.width, await control.getAttribute("aria-label") ?? await control.textContent() ?? "control").toBeGreaterThanOrEqual(44)
    expect(box!.height, await control.textContent() ?? "control").toBeGreaterThanOrEqual(44)
  }
}

for (const width of [320, 390, 430, 768]) {
  test(`navigation and deletion help reflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/")
    await expectNoDocumentOverflow(page)
    const toggle = page.getByRole("button", { name: "Menü", exact: true })
    if (await toggle.isVisible()) {
      await toggle.click()
      await expect(page.getByRole("navigation", { name: "Mobil menü", exact: true })).toBeVisible()
    }
    await expectTouchTargets(page.locator("header a, header button"))
    await expectNoDocumentOverflow(page)

    await page.locator("footer").scrollIntoViewIfNeeded()
    await expectTouchTargets(page.locator("footer a"))
    await expectNoDocumentOverflow(page)

    await page.goto("/hesap-silme")
    await expectTouchTargets(page.locator("header a, main a[href^='mailto:']"))
    await expectNoDocumentOverflow(page)
    await page.getByRole("link", { name: "Geri Dön" }).click()
    await expect(page).toHaveURL(/\/$/)
  })
}

test("deletion request remains readable at 200 percent text size", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/hesap-silme")
  // Text enlargement, not a claim of exercising the browser toolbar zoom.
  await page.addStyleTag({ content: "html { font-size: 200%; }" })
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await expectTouchTargets(page.locator("header a, main a[href^='mailto:']"))
  await expectNoDocumentOverflow(page)
  await page.getByRole("heading", { name: "Ne kadar sürer?" }).scrollIntoViewIfNeeded()
  await expectNoDocumentOverflow(page)
})
