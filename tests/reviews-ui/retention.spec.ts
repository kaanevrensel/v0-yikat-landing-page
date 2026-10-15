import { test, expect } from "@playwright/test";

test("an open review panel releases content after five minutes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.route("**/api/google-reviews", route => route.fulfill({ json: {
    status: "ready", syncedAt: "2026-10-15T12:00:00Z", reviews: [{
      id: "retention-fixture", author: "Synthetic test author", rating: 3,
      comment: "Synthetic retention test content.", createdAt: "2026-10-01T10:00:00Z", updatedAt: "2026-10-02T10:00:00Z",
    }],
  } }));
  await page.goto("/");
  const panel = page.locator(".google-reviews");
  await panel.locator("summary").click();
  await expect(panel.getByText("Synthetic test author", { exact: true })).toBeVisible();
  await page.clock.fastForward(5 * 60_000 + 1);
  await expect(panel).not.toHaveAttribute("open", "");
  await expect(panel.locator(".google-review-list li")).toHaveCount(0);
});
