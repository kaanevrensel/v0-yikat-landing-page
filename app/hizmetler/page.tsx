import type { Metadata } from "next"
import { Shirt, WashingMachine, Footprints, BedDouble } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AppDownloadButton } from "@/components/app-download-button"

export const metadata: Metadata = {
  title: "Hizmetler — Kuru Temizleme, Çamaşır, Ütü ve Daha Fazlası | YIKAT",
  description:
    "Kuru temizleme, çamaşır, ütü, ayakkabı ve hacimli tekstil temizliği. Kapıdan toplama, profesyonel temizlik, kapıya teslim. Detaylar ve fiyatlar uygulamada.",
  alternates: { canonical: "https://www.yikat.tech/hizmetler" },
}

function IronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 16a8 8 0 0 1 8-8h7a3 3 0 0 1 3 3v5z" />
      <path d="M3 16v2a1 1 0 0 0 1 1h16" />
      <path d="M16 8V6a2 2 0 0 0-2-2H9" />
    </svg>
  )
}

const services = [
  { name: "Kuru Temizleme", Icon: Shirt, desc: "Takım elbise, ceket, palto ve hassas kumaşlar için profesyonel kuru temizleme." },
  { name: "Çamaşır", Icon: WashingMachine, desc: "Günlük çamaşırlarınız yıkanır, kurutulur ve özenle katlanır." },
  { name: "Ütü", Icon: IronIcon, desc: "Gömlek, pantolon ve takımlarınız kullanıma hazır biçimde ütülenir." },
  { name: "Ayakkabı", Icon: Footprints, desc: "Spor, klasik ve deri ayakkabılar için özel temizlik ve bakım." },
  { name: "Hacimli", Icon: BedDouble, desc: "Yorgan, battaniye, nevresim ve perde gibi hacimli tekstiller." },
]

export default function HizmetlerPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background pt-32 pb-24 sm:pt-40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-3xl tracking-tight text-foreground sm:text-4xl">
            Tek uygulamadan tüm tekstil bakımı
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Kuru temizlemeden hacimli tekstile, ihtiyacınız olan her şey tek
            yerde. Detaylar ve güncel fiyatlar uygulamada.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ name, Icon, desc }) => (
              <div key={name} className="rounded-2xl border border-border bg-card p-7">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Icon className="size-7" />
                </div>
                <h2 className="mt-5 text-lg font-medium text-foreground">{name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-muted-foreground">
              Adresini gir, sana uygun hizmet ve fiyatları uygulamada keşfet.
            </p>
            <AppDownloadButton label="App’i İndir" event="hizmetler_app_download_click" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
