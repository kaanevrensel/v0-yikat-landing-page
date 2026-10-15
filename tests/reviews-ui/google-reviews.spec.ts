import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const reviews = Array.from({ length: 5 }, (_, index) => ({ id: `fixture-${index}`, author: `Test author ${index + 1}`, rating: index + 1,
  comment: index === 1 ? "" : index === 0 ? "<img src=x onerror=alert(1)>\nSynthetic test text. " + "Longword".repeat(20) : "Synthetic test text.",
  createdAt: "2026-10-01T10:00:00Z", updatedAt: "2026-10-02T10:00:00Z" }));

for (const width of [320, 390, 1440]) {
  test(`all review ratings, pagination and safe text are readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    let requests = 0;
    await page.route("**/api/google-reviews", route => { requests++; return route.fulfill({ json: { status: "ready", reviews, syncedAt: "2026-10-15T12:00:00Z" } }); });
    await page.goto("/");
    expect(requests).toBe(0);
    const panel = page.locator(".google-reviews");
    await panel.locator("summary").click();
    await expect(panel.getByText("Test author 1", { exact: true })).toBeVisible();
    await expect(panel.locator(".google-review-rating").first()).toContainText("1/5");
    await expect(panel.getByText("Bu yorum yalnızca puan içeriyor.")).toBeVisible();
    await expect(panel.locator(".google-review-comment").first()).toContainText("<img src=x onerror=alert(1)>");
    await expect(panel.locator(".google-review-comment img")).toHaveCount(0);
    await expect(panel.locator(".google-reviews-synced")).toContainText("15 Ekim 2026");
    expect(await page.locator("script[type='application/ld+json']").allTextContents()).not.toContainEqual(expect.stringContaining("AggregateRating"));
    expect(await panel.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    const accessibility = await new AxeBuilder({ page }).include(".google-reviews").analyze();
    expect(accessibility.violations).toEqual([]);
    await panel.screenshot({ path: `output/reviews-review/reviews-${width}.png` });
    await panel.getByRole("button", { name: "Sonraki" }).click();
    await expect(panel.getByText("Test author 5", { exact: true })).toBeVisible();
    await expect(panel.getByRole("button", { name: "Sonraki" })).toBeDisabled();
    await expect(panel.getByRole("heading", { name: "Google’daki yorumlar" })).toBeFocused();
    await panel.locator("summary").click();
    await expect(panel.locator(".google-review-list li")).toHaveCount(0);
    await panel.locator("summary").click();
    await expect(panel.getByText("Test author 1", { exact: true })).toBeVisible();
    expect(requests).toBe(2);
  });
}

test("empty and failed sync show honest source-linked states without a stale success timestamp", async ({ page, request }) => {
  // Real route with feature flags but no credentials must fail without exposing settings.
  const missing = await request.get("/api/google-reviews");
  expect(missing.status()).toBe(503);
  expect(await missing.json()).toEqual({ status: "unavailable" });
  expect(missing.headers()["cache-control"]).toContain("no-store");
  for (const body of [{ status: "ready", reviews: [], syncedAt: "2026-10-15T12:00:00Z" }, { status: "unavailable" }]) {
    await page.route("**/api/google-reviews", route => route.fulfill({ json: body, status: body.status === "ready" ? 200 : 503 }));
    await page.goto("/");
    const panel = page.locator(".google-reviews");
    await panel.locator("summary").click();
    await expect(panel.getByRole("link", { name: "Google işletme profilinde aç" })).toHaveAttribute("href", "https://www.google.com/maps?cid=11452704591158275657");
    await expect(panel.getByRole("status")).toContainText(body.status === "ready" ? "Google şu an gösterilecek bir yorum döndürmedi." : "Yorumlar şu an yüklenemiyor.");
    if (body.status !== "ready") await expect(panel.locator(".google-reviews-synced")).toHaveCount(0);
    await page.unroute("**/api/google-reviews");
  }
});
