import type { Metadata } from "next";
import { SiteShell } from "@/components/website/shared";
import { PartnersPage } from "@/components/website/partners";
export const metadata: Metadata = {
  title: "İş Ortağı Ol | Yıkat",
  description:
    "Temizlik işletmeni Yıkat iş ortaklığı ağına taşı. Hizmetlerini anlat, iş ortaklığı için başvur.",
  alternates: { canonical: "/partnerler" },
};
export default function Partners() {
  return (
    <SiteShell>
      <PartnersPage />
    </SiteShell>
  );
}
