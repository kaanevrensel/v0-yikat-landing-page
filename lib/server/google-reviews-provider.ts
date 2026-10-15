import type { GoogleReview, GoogleReviewsResult } from "../google-reviews";

// This transport accepts explicit credentials for isolated tests. Production imports
// it exclusively through the server-only module; it never reads browser/runtime env.
export type GoogleReviewsConfig = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  location: string;
  verifiedPlaceId: string;
};
type Fetcher = typeof fetch;
type RecordValue = Record<string, unknown>;
const ratings: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

export class GoogleReviewsError extends Error {
  constructor() { super("Google reviews are unavailable"); }
}

function record(value: unknown): RecordValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new GoogleReviewsError();
  return value as RecordValue;
}

function date(value: unknown): string {
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) throw new GoogleReviewsError();
  return value;
}

function photoUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !url.username && !url.password &&
      (url.hostname.endsWith(".googleusercontent.com") || url.hostname.endsWith(".gstatic.com"))) return value;
  } catch { /* Untrusted URL is omitted; original author text remains. */ }
}

function review(value: unknown): GoogleReview {
  const item = record(value);
  const author = record(item.reviewer);
  if (typeof item.reviewId !== "string" || !item.reviewId ||
      typeof item.starRating !== "string" || typeof ratings[item.starRating] !== "number" ||
      (item.comment !== undefined && typeof item.comment !== "string") ||
      (author.displayName !== undefined && typeof author.displayName !== "string")) throw new GoogleReviewsError();
  return {
    id: item.reviewId,
    author: typeof author.displayName === "string" && author.displayName ? author.displayName : "Google kullanıcısı",
    authorPhotoUrl: author.isAnonymous === true ? undefined : photoUrl(author.profilePhotoUrl),
    rating: ratings[item.starRating],
    comment: typeof item.comment === "string" ? item.comment : "",
    createdAt: date(item.createTime),
    updatedAt: date(item.updateTime),
  };
}

async function request(fetcher: Fetcher, url: string, options: RequestInit): Promise<RecordValue> {
  const response = await fetcher(url, { ...options, cache: "no-store", redirect: "error" });
  if (!response.ok) throw new GoogleReviewsError();
  // Never include provider responses, OAuth error bodies or tokens in errors/logs.
  return record(await response.json());
}

export async function fetchGoogleReviews(config: GoogleReviewsConfig, fetcher: Fetcher = fetch): Promise<Extract<GoogleReviewsResult, { status: "ready" }>> {
  if (!/^accounts\/\d+\/locations\/\d+$/.test(config.location) || !config.verifiedPlaceId ||
      !config.clientId || !config.clientSecret || !config.refreshToken) throw new GoogleReviewsError();
  const signal = AbortSignal.timeout(25_000);
  try {
    const token = await request(fetcher, "https://oauth2.googleapis.com/token", {
      method: "POST", signal,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret,
        refresh_token: config.refreshToken, grant_type: "refresh_token" }),
    });
    if (typeof token.access_token !== "string" || !token.access_token || token.token_type !== "Bearer") throw new GoogleReviewsError();
    const headers = { Authorization: `Bearer ${token.access_token}` };
    // Fail closed if the account/location is accidentally configured for the other Yikat.
    // The API Place ID must first be matched to our native Bakırköy profile by the operator.
    const locationName = config.location.split("/").slice(2).join("/");
    const identity = await request(fetcher, `https://mybusinessbusinessinformation.googleapis.com/v1/${locationName}?readMask=name,websiteUri,metadata`, { headers, signal });
    const metadata = record(identity.metadata);
    let website: URL;
    try { website = new URL(String(identity.websiteUri)); } catch { throw new GoogleReviewsError(); }
    if (identity.name !== locationName || metadata.placeId !== config.verifiedPlaceId ||
        website.protocol !== "https:" || !["www.yikat.tech", "yikat.tech"].includes(website.hostname)) throw new GoogleReviewsError();

    const reviews: GoogleReview[] = [];
    const ids = new Set<string>();
    const tokens = new Set<string>();
    let pageToken = "";
    for (let page = 0; page < 100; page++) {
      const params = new URLSearchParams({ pageSize: "50", orderBy: "updateTime desc" });
      if (pageToken) params.set("pageToken", pageToken);
      const result = await request(fetcher, `https://mybusiness.googleapis.com/v4/${config.location}/reviews?${params}`, { headers, signal });
      if (result.reviews !== undefined && !Array.isArray(result.reviews)) throw new GoogleReviewsError();
      for (const value of (result.reviews ?? []) as unknown[]) {
        const item = review(value);
        // Changes during pagination may create duplicates. Retry on the next load,
        // rather than silently presenting a partial or altered set as complete.
        if (ids.has(item.id)) throw new GoogleReviewsError();
        ids.add(item.id);
        reviews.push(item);
      }
      if (result.nextPageToken === undefined || result.nextPageToken === "") {
        if (result.totalReviewCount !== undefined &&
            (!Number.isInteger(result.totalReviewCount) || result.totalReviewCount !== reviews.length)) throw new GoogleReviewsError();
        return { status: "ready", reviews, syncedAt: new Date().toISOString() };
      }
      if (typeof result.nextPageToken !== "string" || tokens.has(result.nextPageToken)) throw new GoogleReviewsError();
      pageToken = result.nextPageToken;
      tokens.add(pageToken);
    }
    throw new GoogleReviewsError();
  } catch {
    throw new GoogleReviewsError();
  }
}
