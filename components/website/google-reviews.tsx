"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/lib/site";
import type { GoogleReviewsResult } from "@/lib/google-reviews";

const PAGE_SIZE = 4;
const date = (value: string) => new Intl.DateTimeFormat("tr-TR", {
  day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul",
}).format(new Date(value));

export function GoogleReviews({ enabled }: { enabled: boolean }) {
  const [result, setResult] = useState<GoogleReviewsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const details = useRef<HTMLDetailsElement>(null);
  const controller = useRef<AbortController | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  // The browser keeps content only while this panel is open. Closing it, hiding
  // the tab or leaving the page releases it. There is no local/session storage.
  function clear() {
    controller.current?.abort();
    controller.current = null;
    setLoading(false);
    setResult(null);
    setPage(0);
  }
  useEffect(() => {
    function hide() {
      if (document.hidden && details.current) details.current.open = false;
    }
    document.addEventListener("visibilitychange", hide);
    return () => { controller.current?.abort(); document.removeEventListener("visibilitychange", hide); };
  }, []);
  useEffect(() => {
    if (result?.status !== "ready") return;
    const expires = window.setTimeout(() => { if (details.current) details.current.open = false; }, 5 * 60_000);
    return () => window.clearTimeout(expires);
  }, [result]);

  async function load() {
    if (controller.current) return;
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/google-reviews", { cache: "no-store", signal: request.signal });
      const data: GoogleReviewsResult = await response.json();
      if (!request.signal.aborted) setResult(response.ok ? data : { status: "unavailable" });
    } catch {
      if (!request.signal.aborted) setResult({ status: "unavailable" });
    } finally {
      if (controller.current === request) { controller.current = null; setLoading(false); }
    }
  }

  if (!enabled) return <a className="shop-detail-link" href={siteConfig.mapsPlaceUrl} target="_blank" rel="noopener noreferrer">Google’da yorumları oku ↗</a>;
  const reviews = result?.status === "ready" ? result.reviews : [];
  const pageCount = Math.ceil(reviews.length / PAGE_SIZE);
  function move(next: number) { setPage(next); heading.current?.focus({ preventScroll: true }); }

  return (
    <details ref={details} className="google-reviews" onToggle={(event) => { if (event.currentTarget.open) void load(); else clear(); }}>
      <summary>Google yorumları <ChevronDown size={17} aria-hidden="true" /></summary>
      <div className="google-reviews-body">
        <h3 ref={heading} tabIndex={-1}>Google’daki yorumlar</h3>
        <p className="google-reviews-source"><a href={siteConfig.mapsPlaceUrl} target="_blank" rel="noopener noreferrer">Google işletme profilinde aç ↗</a></p>
        <div role="status" aria-live="polite">
          {loading && <p>Yorumlar yükleniyor…</p>}
          {result?.status === "unavailable" && <p>Yorumlar şu an yüklenemiyor. Google işletme profilinden okuyabilirsin.</p>}
          {result?.status === "disabled" && <p>Yorumları Google işletme profilinden okuyabilirsin.</p>}
          {result?.status === "ready" && reviews.length === 0 && <p>Google şu an gösterilecek bir yorum döndürmedi.</p>}
        </div>
        {result?.status === "ready" && <>
          <p className="google-reviews-synced">Son güncelleme: <time dateTime={result.syncedAt}>{date(result.syncedAt)}, {new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" }).format(new Date(result.syncedAt))}</time></p>
          <ol className="google-review-list" start={page * PAGE_SIZE + 1}>
            {reviews.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(review => <li key={review.id}>
              <article>
                <header>
                  {review.authorPhotoUrl && /* Preserve Google's original attribution URL; do not proxy/cache the image. */
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={review.authorPhotoUrl} width={32} height={32} alt="" loading="lazy" referrerPolicy="no-referrer" />}
                  <div><p className="google-review-author">{review.author}</p><p className="google-review-rating">{review.rating}/5 <span aria-hidden="true">★</span> · <time dateTime={review.createdAt}>{date(review.createdAt)}</time></p></div>
                </header>
                {review.comment ? <p className="google-review-comment">{review.comment}</p> : <p className="google-review-textless">Bu yorum yalnızca puan içeriyor.</p>}
                <a className="google-review-origin" href={siteConfig.mapsPlaceUrl} target="_blank" rel="noopener noreferrer">Kaynak: Google</a>
              </article>
            </li>)}
          </ol>
          {pageCount > 1 && <nav className="google-review-pages" aria-label="Yorum sayfaları">
            <button type="button" disabled={page === 0} onClick={() => move(page - 1)}>Önceki</button>
            <span aria-live="polite">{page + 1} / {pageCount}</span>
            <button type="button" disabled={page + 1 >= pageCount} onClick={() => move(page + 1)}>Sonraki</button>
          </nav>}
        </>}
      </div>
    </details>
  );
}
