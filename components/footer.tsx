import { Mail, Phone, Clock } from "lucide-react"

const footerColumns = [
  {
    title: "HİZMETLER",
    links: [
      { label: "Çamaşır Yıkama", href: "#paketler" },
      { label: "Ayakkabı Yıkama", href: "#paketler" },
      { label: "Ütüleme", href: "#paketler" },
      { label: "Kurumsal Hizmetler", href: "#" },
    ],
  },
  {
    title: "DESTEK",
    links: [
      { label: "Yardım Merkezi", href: "#" },
      { label: "İletişim", href: "#" },
      { label: "Hizmet Bölgeleri", href: "#" },
      { label: "SSS", href: "#sss" },
    ],
  },
  {
    title: "YASAL",
    links: [
      { label: "Gizlilik Politikası", href: "#" },
      { label: "Kullanım Şartları", href: "#" },
      { label: "KVKK", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-card">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <a href="#" className="text-2xl font-bold tracking-tight">
              {"yıkat"}
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-card/70">
              {"Çamaşır yükünü biz alalım. Premium çamaşır toplama ve teslimat servisi."}
            </p>

            <div className="mt-5 space-y-2">
              <a
                href="mailto:destek@yikat.tech"
                className="flex items-center gap-2 text-sm text-card/70 transition-colors hover:text-card"
              >
                <Mail className="size-4" />
                {"destek@yikat.tech"}
              </a>
              <a
                href="tel:08503033193"
                className="flex items-center gap-2 text-sm text-card/70 transition-colors hover:text-card"
              >
                <Phone className="size-4" />
                {"0850 303 31 93"}
              </a>
            </div>

            <div className="mt-5 border-t border-card/10 pt-5">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-card/50">
                <Clock className="size-3.5" />
                {"ÇALIŞMA SAATLERİ"}
              </div>
              <p className="mt-1 text-sm text-card/70">
                {"Haftanın her günü: 08:00 - 22:00"}
              </p>
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-card/90">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5" role="list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-card/60 transition-colors hover:text-card"
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
        <div className="mt-12 border-t border-card/10 pt-6 text-center">
          <p className="text-xs text-card/50">
            {"\u00A9 2026 Yıkat. Tüm hakları saklıdır."}
          </p>
        </div>
      </div>
    </footer>
  )
}
