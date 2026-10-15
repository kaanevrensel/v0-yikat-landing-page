import type { Metadata } from "next";
import { SiteShell } from "@/components/website/shared";
import { ProductPage } from "@/components/website/product";

export const metadata: Metadata = {
  title: "Yıkat Uygulaması | Yıkat",
  description:
    "Yıkat uygulamasını keşfet. iPhone’da yayında; Android ve kapıdan alım hazırlanıyor. Ayakkabı temizliği için Bakırköy dükkânına ulaş.",
  alternates: { canonical: "/urun" },
};
export default function Product() {
  return (
    <SiteShell>
      <ProductPage />
    </SiteShell>
  );
}
