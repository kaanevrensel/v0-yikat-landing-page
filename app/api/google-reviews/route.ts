import { getGoogleReviews } from "@/lib/server/google-reviews";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET() {
  const result = await getGoogleReviews();
  return Response.json(result, {
    status: result.status === "unavailable" ? 503 : 200,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      ...(result.status === "unavailable" ? { "Retry-After": "60" } : {}),
    },
  });
}
