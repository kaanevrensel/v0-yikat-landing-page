/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  async redirects() {
    // Pivot: agregatör dönemi rotaları ana sayfaya (kalıcı — Next 308 döner, SEO'da 301 ile eşdeğer).
    // /iletisim listeden ÇIKTI (2026-08-27): iyzico üye işyeri incelemesi sitede iletişim
    // sayfası istiyor — artık gerçek bir sayfa (app/iletisim).
    const pivot = ["/hizmetler", "/nasil-calisir", "/partnerlik", "/sss"].map((source) => ({
      source,
      destination: "/",
      permanent: true,
    }))
    // 2026-08-27: iyzico incelemesi gizlilik politikası İÇERİĞİNİ bu sitede istiyor —
    // /gizlilik-politikasi artık yerel bir sayfa (içerik yine tek kaynaktan, yikat-app
    // docs.ts'ten ÜRETİLİR; bkz. lib/legal-content.json). Eski app.yikat.tech
    // yönlendirmeleri yerel sayfaya çevrildi ki mağaza kayıtlarındaki www linkleri
    // kırılmasın; app.yikat.tech/legal/gizlilik aynı metni render etmeye devam eder.
    const appPolicy = ["/gizlilik", "/privacy"].map((source) => ({
      source,
      destination: "/gizlilik-politikasi",
      permanent: false,
    }))
    return [...pivot, ...appPolicy]
  },
  async headers() {
    // Hero videosu yenilemede yeniden inmesin: immutable + 1 yıl (sahip şikayeti 2026-07-12:
    // refresh sonrası görsel döngü). public/ dosyaları hash'siz — video İÇERİĞİ değişirse
    // dosya ADI da değişmeli (örn. hero-scrub-v2.mp4), yoksa istemciler 1 yıl eskisini oynatır.
    return [
      {
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ]
  },
}

export default nextConfig
