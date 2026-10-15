import "server-only";
import { fetchGoogleReviews, type GoogleReviewsConfig } from "./google-reviews-provider";
import type { GoogleReviewsResult } from "../google-reviews";

export function isGoogleReviewsDisplayEnabled(): boolean {
  return process.env.YIKAT_GOOGLE_REVIEWS_ENABLED === "true" &&
    process.env.YIKAT_GOOGLE_REVIEWS_PUBLIC_DISPLAY_APPROVED === "true";
}

function configuration(): GoogleReviewsConfig | undefined {
  if (!isGoogleReviewsDisplayEnabled()) return;
  const clientId = process.env.YIKAT_GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.YIKAT_GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.YIKAT_GOOGLE_OAUTH_REFRESH_TOKEN;
  const location = process.env.YIKAT_GOOGLE_BUSINESS_LOCATION;
  const verifiedPlaceId = process.env.YIKAT_GOOGLE_BUSINESS_VERIFIED_PLACE_ID;
  if (!clientId || !clientSecret || !refreshToken || !location || !verifiedPlaceId) return;
  return { clientId, clientSecret, refreshToken, location, verifiedPlaceId };
}

// Share concurrent work only. No review content survives a completed request in
// server memory, Next's data cache, disk, a database or a CDN cache.
let pending: Promise<GoogleReviewsResult> | undefined;
let retryAfter = 0;

export async function getGoogleReviews(): Promise<GoogleReviewsResult> {
  if (!isGoogleReviewsDisplayEnabled()) return { status: "disabled" };
  const config = configuration();
  if (!config || Date.now() < retryAfter) return { status: "unavailable" };
  if (!pending) {
    pending = fetchGoogleReviews(config).catch(() => {
      retryAfter = Date.now() + 60_000;
      return { status: "unavailable" } as const;
    }).finally(() => { pending = undefined; });
  }
  return pending;
}
