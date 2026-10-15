import { SiteShell } from "@/components/website/shared";
import { HomePage } from "@/components/website/home";
import { isGoogleReviewsDisplayEnabled } from "@/lib/server/google-reviews";

export default function Home() {
  return (
    <SiteShell>
      <HomePage googleReviewsEnabled={isGoogleReviewsDisplayEnabled()} />
    </SiteShell>
  );
}
