import type { Metadata } from "next";
import { SiteShell } from "@/components/website/shared";
import { ProductPage } from "@/components/website/product";

export const metadata: Metadata = {
  title: "Yıkat Gitsin Uygulaması | Yıkat",
  description:
    "Hizmetini seç, alım ve teslim zamanını planla, siparişini takip et. Yıkat Gitsin iPhone’da yayında, Android çok yakında.",
  alternates: { canonical: "/urun" },
};
export default function Product() {
  return (
    <SiteShell>
      <ProductPage />
    </SiteShell>
  );
}
