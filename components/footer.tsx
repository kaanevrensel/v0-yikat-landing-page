import Image from "next/image"
import { Instagram, Linkedin, Twitter } from "lucide-react"
import { siteConfig } from "@/lib/site"

/*
  Brief §5.12 footer structure. Pages still on the roadmap (Basın, Kariyer,
  Blog, Kurumsal Hizmet — Brief §11 parked) route to the nearest live
  destination for now so no link 404s before those pages ship.
*/
const columns = [
  {
    title: "Yıkat",
    links: [
      { label: "Hakkımızda", href: "/#neden-yikat" },
      { label: "Basın", href: "/iletisim" },
      { label: "Kariyer", href: "/iletisim" },
      { label: "Blog", href: "/iletisim" },
    ],
  },
  {
    title: "Hizmetler",
    links: [
      { label: "Kuru Temizleme", href: "/hizmetler" },
      { label: "Çamaşır", href: "/hizmetler" },
      { label: "Ütü", href: "/hizmetler" },
      { label: "Ayakkabı", href: "/hizmetler" },
      { label: "Hacimli", href: "/hizmetler" },
    ],
  },
  {
    title: "Müşteri",
    links: [
      { label: "Nasıl Çalışır", href: "/nasil-calisir" },
      { label: "Garanti", href: "/#neden-yikat" },
      { label: "SSS", href: "/sss" },
      { label: "İletişim", href: "/iletisim" },
    ],
  },
  {
    title: "İş Ortakları",
    links: [
      { label: "Partner Ol", href: "/partnerlik" },
      { label: "Kurumsal Hizmet", href: "/partnerlik" },
      { label: "KVKK", href: "/kvkk" },
      { label: "Mesafeli Satış", href: "/mesafeli-satis-sozlesmesi" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <a href="/" aria-label="YIKAT ana sayfa">
              <Image
                src="/images/yikat-logo-white.png"
                alt="YIKAT"
                width={120}
                height={48}
                className="h-10 w-auto"
              />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Siz işinize bakın, kıyafet bize emanet. Kapıdan toplama,
              profesyonel temizlik, kapıya teslim.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-medium text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2.5" role="list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
          <p className="text-center text-xs text-white/50 sm:text-left">
            © 2026 YIKAT ·{" "}
            <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
              {siteConfig.email}
            </a>{" "}
            ·{" "}
            <a href={siteConfig.phoneHref} className="hover:text-white">
              {siteConfig.phone}
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="text-white/50 transition-colors hover:text-white">
              <Instagram className="size-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-white/50 transition-colors hover:text-white">
              <Linkedin className="size-5" />
            </a>
            <a href="#" aria-label="X" className="text-white/50 transition-colors hover:text-white">
              <Twitter className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
