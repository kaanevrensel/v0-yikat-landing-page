import type { Metadata } from "next"
import { Smartphone, Truck, Sparkles, Home } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AppDownloadButton } from "@/components/app-download-button"

export const metadata: Metadata = {
  title: "Nasıl Çalışır — Dört Adımda Kapıdan Kapıya | YIKAT",
  description:
    "YIKAT nasıl çalışır? Uygulamadan sipariş verin, kurye kapınızdan alsın, partner profesyonel temizlesin, 24–48 saat içinde kapınıza gelsin.",
  alternates: { canonical: "https://www.yikat.tech/nasil-calisir" },
}

const steps = [
  {
    num: "01",
    icon: Smartphone,
    title: "Uygulamadan sipariş ver",
    desc: "Adresinizi, hizmeti, parçaları ve size uygun randevu penceresini uygulamadan seçin. Tüm akış telefonunuzda.",
  },
  {
    num: "02",
    icon: Truck,
    title: "Kurye kapından alır",
    desc: "Seçtiğiniz saatte kuryemiz kapınıza gelir ve kıyafetlerinizi paketli bir şekilde teslim alır.",
  },
  {
    num: "03",
    icon: Sparkles,
    title: "Partner profesyonel temizler",
    desc: "Seçilmiş partner kuru temizlemecimiz parça başı kalite kontrolü yapar; tüm parçalarınızın fotoğraflı listesi kayda geçer.",
  },
  {
    num: "04",
    icon: Home,
    title: "24–48 saat içinde kapına",
    desc: "Kıyafetleriniz paketli, ütülü ve kullanıma hazır biçimde kapınıza geri gelir.",
  },
]

export default function NasilCalisirPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background pt-32 pb-24 sm:pt-40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-3xl tracking-tight text-foreground sm:text-4xl">
            Dört adımda, kapıdan kapıya
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Sipariş, takip ve teslim — hepsi telefonunuzdan. Sürecin tamamı
            basit ve şeffaf.
          </p>

          <div className="mt-14 space-y-6">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-6 rounded-2xl border border-border bg-card p-6 sm:p-7">
                <span className="text-4xl font-medium tracking-tight text-primary/20">{s.num}</span>
                <div>
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-accent text-primary">
                    <s.icon className="size-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-medium text-foreground">{s.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <AppDownloadButton label="App’i İndir" event="nasil_calisir_app_download_click" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
