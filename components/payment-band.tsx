import Image from "next/image"

// "iyzico ile Öde" + Visa + Mastercard markaları (iyzico üye işyeri inceleme
// şartı, 2026-08-27). Kaynaklar: iyzico resmi logo paketi (BeyazZemindeKullanim,
// iyzico.com/assets) ve uygulamada da kullanılan orijinal Visa/Mastercard vektör
// markaları — markalar asla yeniden çizilmez/renklendirilmez, bu yüzden her biri
// kart markası tasarım kurallarına uygun açık zeminli çip içinde durur.
const MARKS = [
  { src: "/images/odeme/iyzico.svg", alt: "iyzico", width: 108, height: 38 },
  { src: "/images/odeme/visa.svg", alt: "Visa", width: 1000, height: 324 },
  { src: "/images/odeme/mastercard.svg", alt: "Mastercard", width: 999, height: 776 },
] as const

export function PaymentBand({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <div>
      <p className={`text-sm font-semibold ${tone === "dark" ? "text-white" : "text-foreground"}`}>
        {"iyzico ile Öde"}
      </p>
      {/* 12px metin: tam opak beyaz — /80 servis sayfalarındaki mavi zemin üstünde
          axe color-contrast'ı 3.89'a düşürüyordu (4.5 gerekir). */}
      <p className={`mt-1 text-xs ${tone === "dark" ? "text-white" : "text-muted-foreground"}`}>
        {"Online kart ödemeleri iyzico güvenli ödeme altyapısı üzerinden alınır; Visa ve Mastercard kabul edilir."}
      </p>
      <div className="mt-3 flex items-center gap-2">
        {MARKS.map((m) => (
          <span
            key={m.alt}
            className="inline-flex h-8 items-center rounded-md border border-black/10 bg-white px-2.5"
          >
            <Image src={m.src} alt={m.alt} width={m.width} height={m.height} className="h-4 w-auto" />
          </span>
        ))}
      </div>
    </div>
  )
}
