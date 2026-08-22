/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  async redirects() {
    // Pivot: agregatör dönemi rotaları ana sayfaya (kalıcı — Next 308 döner, SEO'da 301 ile eşdeğer)
    const pivot = ["/hizmetler", "/nasil-calisir", "/partnerlik", "/sss", "/iletisim"].map((source) => ({
      source,
      destination: "/",
      permanent: true,
    }))
    // Mobil uygulamanın gizlilik politikası TEK yerde yaşar (uygulamanın kendi
    // yasal metinleri; app.yikat.tech aynı kaynaktan render eder). Mağaza
    // kayıtlarında ve linklerde www altındaki bu adresler oraya gider — metin
    // burada kopyalanmaz ki iki sürüm birbirinden ayrışmasın. /kvkk web
    // sitesinin kendi aydınlatma metni olarak kalır.
    const appPolicy = ["/gizlilik", "/gizlilik-politikasi", "/privacy"].map((source) => ({
      source,
      destination: "https://app.yikat.tech/legal/gizlilik",
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
