/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  async redirects() {
    // Pivot: agregatör dönemi rotaları ana sayfaya (kalıcı — Next 308 döner, SEO'da 301 ile eşdeğer)
    return ["/hizmetler", "/nasil-calisir", "/partnerlik", "/sss", "/iletisim"].map((source) => ({
      source,
      destination: "/",
      permanent: true,
    }))
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
