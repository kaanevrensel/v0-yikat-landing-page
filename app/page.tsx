import { SiteShell } from "@/components/website/shared";
import { HomePage } from "@/components/website/home";
import { isGoogleReviewsDisplayEnabled } from "@/lib/server/google-reviews";
import { CaseProofLink } from "@/components/website/case-proof-link";

export default function Home() {
  return (
    <SiteShell>
      <HomePage googleReviewsEnabled={isGoogleReviewsDisplayEnabled()} caseLink={<CaseProofLink />} />
    </SiteShell>
  );
}
