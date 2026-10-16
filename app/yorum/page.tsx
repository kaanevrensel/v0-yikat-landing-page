import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { DiscoveryShell } from "@/components/discovery/shared"
import { reviewRequest } from "@/lib/review-request"
import "@/app/local-growth.css"

export const metadata: Metadata = {
  title: "Deneyimini paylaş | Yıkat",
  description: "Bakırköy dükkânındaki gerçek deneyimini Google’da paylaşabilir, yorum bağlantısının QR kartını indirebilirsin.",
  alternates: { canonical: "/yorum" },
  robots: { index: false, follow: true },
}

export default function ReviewPage() {
  return <DiscoveryShell crumbs={[{ name: "Deneyimini paylaş", path: "/yorum" }]}>
    <header className="discovery-heading review-request-heading">
      <h1>Deneyimini paylaş.</h1>
      <p className="discovery-answer">Ayakkabını Bakırköy dükkânımızda temizlettin mi? Nasıl geçtiğini Google’da kendi sözlerinle anlatabilirsin.</p>
    </header>
    <section className="review-request" aria-label="Google yorum bağlantısı">
      <a href={reviewRequest.url} target="_blank" rel="noopener noreferrer" aria-label="Yıkat Bakırköy için Google’da yorum yaz">
        <Image src={reviewRequest.qr} alt="Google yorum sayfasını açan QR kod" width={240} height={240} unoptimized/>
      </a>
      <div>
        <a href={reviewRequest.url} className="button button-primary" target="_blank" rel="noopener noreferrer">Google’da yorum yaz</a>
        <p>Yorum bırakmak isteğe bağlıdır. Olumlu ya da olumsuz, gerçek deneyimin değerlidir. Google hesabında oturum açman gerekebilir.</p>
        <a className="discovery-inline-link" href={reviewRequest.pdf} download>Tezgâh için yorum kartını indir (PDF)</a>
      </div>
    </section>
    <p><Link href="/bakirkoy-ayakkabi-temizleme">Dükkân ve iletişim bilgilerine dön</Link></p>
  </DiscoveryShell>
}
