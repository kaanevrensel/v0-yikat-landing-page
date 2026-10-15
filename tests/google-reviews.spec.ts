import { test, expect } from "@playwright/test";
import { fetchGoogleReviews, type GoogleReviewsConfig } from "../lib/server/google-reviews-provider";

// Invented transport fixtures, used only in tests. They are never bundled into the website.
const config: GoogleReviewsConfig = { clientId: "test-client", clientSecret: "test-secret", refreshToken: "test-refresh", location: "accounts/123/locations/456", verifiedPlaceId: "test-place" };
const identity = { name: "locations/456", websiteUri: "https://www.yikat.tech", metadata: { placeId: "test-place" } };
const token = { access_token: "test-access", token_type: "Bearer" };
const item = (id: string, starRating = "FIVE", comment?: string) => ({ reviewId: id, reviewer: { displayName: `Test author ${id}` }, starRating, comment, createTime: "2026-10-01T10:00:00Z", updateTime: "2026-10-02T10:00:00Z" });
function transport(responses: unknown[]) {
  const calls: { url: string; options?: RequestInit }[] = [];
  const fetcher: typeof fetch = async (input, options) => {
    calls.push({ url: String(input), options });
    const value = responses.shift();
    if (value instanceof Error) throw value;
    if (value instanceof Response) return value;
    return Response.json(value);
  };
  return { fetcher, calls };
}

test("reviews fetch every page in provider order, including low ratings and textless reviews", async () => {
  const { fetcher, calls } = transport([token, identity,
    { reviews: [item("a", "ONE", "<script>unsafe()</script>\nUnchanged text")], nextPageToken: "page + /2" },
    { reviews: [item("b", "THREE")], totalReviewCount: 2, averageRating: 2 },
  ]);
  const result = await fetchGoogleReviews(config, fetcher);
  expect(result.reviews.map(review => review.id)).toEqual(["a", "b"]);
  expect(result.reviews[0]).toMatchObject({ rating: 1, comment: "<script>unsafe()</script>\nUnchanged text" });
  expect(result.reviews[1]).toMatchObject({ rating: 3, comment: "" });
  expect(result).not.toHaveProperty("averageRating");
  expect(Date.parse(result.syncedAt)).toBeGreaterThan(0);
  expect(calls).toHaveLength(4);
  const page = new URL(calls[3].url);
  expect(page.searchParams.get("pageToken")).toBe("page + /2");
  expect(page.searchParams.get("orderBy")).toBe("updateTime desc");
  expect(page.searchParams.get("pageSize")).toBe("50");
  for (const call of calls) {
    expect(call.options?.cache).toBe("no-store");
    expect(call.options?.redirect).toBe("error");
    expect(call.url).not.toContain("test-secret");
    expect(call.url).not.toContain("test-refresh");
  }
  expect(String(calls[0].options?.body)).toContain("grant_type=refresh_token");
  expect(calls[2].options?.headers).toEqual({ Authorization: "Bearer test-access" });
});

test("reviews refuse invalid location and wrong business identity before reading reviews", async () => {
  const invalid = transport([]);
  await expect(fetchGoogleReviews({ ...config, location: "https://evil.invalid/" }, invalid.fetcher)).rejects.toThrow("unavailable");
  expect(invalid.calls).toHaveLength(0);
  for (const wrong of [
    { ...identity, websiteUri: "https://yikatapp.com" },
    { ...identity, metadata: { placeId: "other-place" } },
    { ...identity, name: "locations/999" },
  ]) {
    const setup = transport([token, wrong]);
    await expect(fetchGoogleReviews(config, setup.fetcher)).rejects.toThrow("unavailable");
    expect(setup.calls).toHaveLength(2);
  }
});

test("reviews fail closed on an incomplete page, duplicates and pagination loops", async () => {
  const cases = [
    [{ reviews: [item("a")], nextPageToken: "next" }, new Response("private provider diagnostic", { status: 403 })],
    [{ reviews: [item("a")], nextPageToken: "next" }, { reviews: [item("a")] }],
    [{ reviews: [item("a")], nextPageToken: "next" }, { reviews: [item("b")], nextPageToken: "next" }],
    [{ reviews: [item("a", "UNKNOWN")] }],
    [{ reviews: [item("a", "constructor")] }],
    [{ reviews: [item("a")], totalReviewCount: 5 }],
  ];
  for (const pages of cases) {
    const setup = transport([token, identity, ...pages]);
    await expect(fetchGoogleReviews(config, setup.fetcher)).rejects.toThrow(/^Google reviews are unavailable$/);
  }
});

test("reviews distinguish an empty provider result and omit hostile or anonymous photo URLs", async () => {
  expect((await fetchGoogleReviews(config, transport([token, identity, {}]).fetcher)).reviews).toEqual([]);
  const malicious = { ...item("a"), reviewer: { displayName: "Original name", profilePhotoUrl: "javascript:alert(1)" } };
  const anonymous = { ...item("b"), reviewer: { displayName: "Anonymous", isAnonymous: true, profilePhotoUrl: "https://lh3.googleusercontent.com/test" } };
  const result = await fetchGoogleReviews(config, transport([token, identity, { reviews: [malicious, anonymous] }]).fetcher);
  expect(result.reviews.map(review => review.author)).toEqual(["Original name", "Anonymous"]);
  expect(result.reviews.every(review => review.authorPhotoUrl === undefined)).toBe(true);
});

test("OAuth and network failures never disclose credential or provider diagnostics", async () => {
  for (const response of [new Response("test-refresh private", { status: 400 }), new Error("test-secret"), { access_token: "test-access" }]) {
    await expect(fetchGoogleReviews(config, transport([response]).fetcher)).rejects.toThrow(/^Google reviews are unavailable$/);
  }
});

test("unconfigured reviews endpoint is disabled, uncached and never returns customer data", async ({ request, page }) => {
  const response = await request.get("/api/google-reviews?location=accounts/999/locations/999");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  expect(await response.json()).toEqual({ status: "disabled" });
  await page.goto("/");
  await expect(page.locator(".shop-welcome").getByRole("link", { name: "Google’da yorumları oku" })).toHaveAttribute("href", "https://www.google.com/maps?cid=11452704591158275657");
  await expect(page.locator(".google-reviews")).toHaveCount(0);
});
