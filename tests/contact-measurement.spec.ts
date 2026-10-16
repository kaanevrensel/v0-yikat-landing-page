import { test, expect, type Page } from "@playwright/test"
import { contactAction, contactPagePaths, contactProperties, referrerChannel } from "../lib/contact-measurement"
import { siteConfig } from "../lib/site"
import { careGuides } from "../lib/care-guides"
import sitemap from "../app/sitemap"

test("contact classification accepts only actual contact destinations", () => {
  expect(contactAction(`${siteConfig.whatsappHref}?text=synthetic-private-message`)).toBe("whatsapp")
  expect(contactAction(siteConfig.phoneHref)).toBe("call")
  expect(contactAction(siteConfig.directionsUrl)).toBe("directions")
  expect(contactAction(siteConfig.appleDirectionsUrl)).toBe("directions")
  for (const value of [siteConfig.mapsPlaceUrl, "/ayakkabi-temizleme", "https://wa.me/0000000000", "https://wa.me.evil.test/908503033193", "http://wa.me/908503033193", "https://user:password@wa.me/908503033193", "tel:+900000000000", "javascript:alert(1)", "https://www.google.com/maps/dir/?destination=another-place"]) {
    expect(contactAction(value)).toBeNull()
  }
})

test("event properties exclude messages, queries, arbitrary paths and referring URLs", () => {
  const paths = contactPagePaths(careGuides.map(guide => guide.slug))
  expect(new Set(paths)).toEqual(new Set(sitemap().map(entry => new URL(entry.url).pathname)))
  const event = contactProperties(`${siteConfig.whatsappHref}?text=synthetic-private-message`, "/private-person@example.test", "https://www.google.com/search?q=synthetic-private-query", paths)
  expect(event).toEqual({ schema: 1, action: "whatsapp", page: "other", referrer: "google" })
  expect(JSON.stringify(event)).not.toMatch(/synthetic|example|search\?|text=/)
  expect(contactProperties(siteConfig.phoneHref, "/rehber?private=value", "", paths)?.page).toBe("other")
  expect(contactProperties(siteConfig.phoneHref, "/rehber", "", paths)?.page).toBe("/rehber")
})

test("referrer is a bounded class and rejects lookalike hosts", () => {
  expect(referrerChannel("https://www.google.com.tr/search?q=private")).toBe("google")
  expect(referrerChannel("https://chatgpt.com/?q=private")).toBe("chatgpt")
  expect(referrerChannel("https://claude.ai/chat/private")).toBe("other_ai")
  expect(referrerChannel("https://www.bing.com/search?q=private")).toBe("bing")
  expect(referrerChannel("https://www.yikat.tech/")).toBe("internal")
  expect(referrerChannel("https://google.com.evil.test/")).toBe("other")
  expect(referrerChannel("javascript://google.com")).toBe("direct_or_unknown")
  expect(referrerChannel("")).toBe("direct_or_unknown")
})

async function captureLocally(page: Page) {
  // This only observes SDK calls inside the local browser. No provider request.
  await page.route("**/_vercel/insights/**", route => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }))
  await page.addInitScript(() => {
    const events: unknown[] = []
    Object.assign(window, { __contactEvents: events, va: (command: string, payload: unknown) => {
      if (command === "event") events.push(payload)
    } })
    // Cancel external navigation after the document's measurement listener runs.
    window.addEventListener("click", event => {
      const anchor = (event.target as Element)?.closest?.("a")
      if (anchor && (anchor.href.startsWith("tel:") || new URL(anchor.href).origin !== location.origin)) event.preventDefault()
    })
  })
}
async function ready(page: Page, path: string) {
  await page.goto(path)
  await page.waitForFunction(() => (window as unknown as { vam: string }).vam === "production")
}
async function events(page: Page) {
  // Existing WebVitalsReporter uses the same SDK. Keep it intact and exclude
  // its independent performance events from contact assertions.
  return page.evaluate(() => (window as unknown as { __contactEvents: { name: string; data: Record<string, unknown> }[] }).__contactEvents
    .filter(event => !event.name.startsWith("cwv_"))
    .map(({ name, data }) => ({ name, data })))
}

test("homepage pointer and keyboard contacts emit one event each without changing links", async ({ page }) => {
  await captureLocally(page)
  await ready(page, "/?synthetic-private=value")
  const whatsapp = page.locator(`a[href='${siteConfig.whatsappHref}']`).first()
  const originalHref = await whatsapp.getAttribute("href")
  await whatsapp.click()
  await expect.poll(() => events(page)).toEqual([{ name: "contact_intent", data: { schema: 1, action: "whatsapp", page: "/", referrer: "direct_or_unknown" } }])
  await whatsapp.focus()
  await whatsapp.press("Enter")
  expect(await events(page)).toHaveLength(2)
  expect(await whatsapp.getAttribute("href")).toBe(originalHref)
  expect(JSON.stringify(await events(page))).not.toContain("synthetic-private")
})

test("discovery contacts do not also emit legacy events and SPA navigation updates the page", async ({ page }) => {
  await captureLocally(page)
  await ready(page, "/ayakkabi-temizleme")
  const whatsapp = page.locator(".discovery-actions a[href*='wa.me']").first()
  await whatsapp.locator("svg").click()
  expect(await events(page)).toEqual([{ name: "contact_intent", data: { schema: 1, action: "whatsapp", page: "/ayakkabi-temizleme", referrer: "direct_or_unknown" } }])
  await page.locator("header a[href='/']").first().click()
  await expect(page).toHaveURL(/\/$/)
  await page.locator(`a[href='${siteConfig.whatsappHref}']`).first().click()
  expect((await events(page)).map(event => event.data.page)).toEqual(["/ayakkabi-temizleme", "/"])
})

test("prevented clicks, maps reviews, service navigation and care choices are not contact events", async ({ page }) => {
  await captureLocally(page)
  await ready(page, "/ayakkabi-temizleme")
  const whatsapp = page.locator(".discovery-actions a[href*='wa.me']").first()
  await whatsapp.evaluate(anchor => anchor.addEventListener("click", event => event.preventDefault(), { once: true }))
  await whatsapp.click()
  await page.locator(`a[href='${siteConfig.mapsPlaceUrl}']`).first().click()
  await page.getByLabel("Malzemesi", { exact: true }).selectOption({ index: 1 })
  await page.getByLabel("Gördüğün durum", { exact: true }).selectOption({ index: 1 })
  expect(await events(page)).toEqual([])
  await page.locator("a[href='/rehber']").first().click()
  await expect(page).toHaveURL(/\/rehber$/)
  expect(await events(page)).toEqual([])
})

test("phone and both platform directions use the same event schema", async ({ page }) => {
  await captureLocally(page)
  await ready(page, "/bakirkoy-ayakkabi-temizleme")
  await page.locator(`a[href='${siteConfig.phoneHref}']`).first().click()
  const directions = page.locator(".discovery-actions a[href*='maps']").first()
  await directions.click()
  // Exercise the actual post-hydration Apple destination without changing UA.
  await directions.evaluate((anchor, href) => anchor.setAttribute("href", href), siteConfig.appleDirectionsUrl)
  await directions.click()
  expect((await events(page)).map(event => event.data.action)).toEqual(["call", "directions", "directions"])
})

test("first-party counter excludes known browser automation and disabled local storage", async ({ page, request }) => {
  await captureLocally(page)
  const calls: unknown[] = []
  await page.route("**/api/contact-counts", route => { calls.push(route.request().postDataJSON()); return route.fulfill({ status: 204 }) })
  await ready(page, "/")
  await page.locator(`a[href='${siteConfig.whatsappHref}']`).first().click()
  expect(await page.evaluate(() => navigator.webdriver)).toBe(true)
  expect(calls).toEqual([])
  const disabled = await request.post("/api/contact-counts", { data: { schema: 2, action: "call", page: "/", referrer: "google" } })
  expect(disabled.status()).toBe(503)
})

test("first-party local transport test groups guides and suppresses duplicate and synthetic activations", async ({ page }) => {
  await captureLocally(page)
  // Only this isolated test removes the automation flag. The route is intercepted,
  // so no native database/provider receives a synthetic event.
  await page.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => false }))
  const calls: unknown[] = []
  await page.route("**/api/contact-counts", route => { calls.push(route.request().postDataJSON()); return route.fulfill({ status: 204 }) })
  await ready(page, "/rehber/ayakkabi-nasil-kurutulur?private=synthetic")
  const contact = page.locator(".discovery-actions a[href*='wa.me']").first()
  const original = await contact.getAttribute("href")
  await contact.click()
  await contact.click()
  await expect.poll(() => calls.length).toBe(1)
  expect(calls[0]).toEqual({ schema: 2, action: "whatsapp", page: "/rehber/*", referrer: "direct_or_unknown" })
  await contact.evaluate(anchor => anchor.dispatchEvent(new MouseEvent("click", { bubbles: true })))
  expect(calls).toHaveLength(1)
  expect(await contact.getAttribute("href")).toBe(original)
})
