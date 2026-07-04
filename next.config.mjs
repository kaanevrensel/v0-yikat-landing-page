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
}

export default nextConfig
