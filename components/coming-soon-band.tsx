import { Marquee } from "@/components/ui/marquee"

// Master plan (uygulama + kapıdan alım) sinyali — sessiz akan hizmet şeridi.
// Erişilebilirlik: tam cümle aria-label'da; akan kopya dekoratif (aria-hidden sarmalayıcıda).
const SERVICES = ["Kapıdan alım", "Kuru temizleme", "Çamaşır", "Ütü", "Hacimli tekstil"]

export function ComingSoonBand() {
  return (
    <section
      aria-label="Kapıdan alım ve tüm tekstil bakımı, YIKAT uygulamasıyla yakında."
      className="border-y bg-muted py-4"
    >
      <div aria-hidden className="relative mx-auto max-w-6xl overflow-hidden">
        <Marquee pauseOnHover className="[--duration:36s] motion-reduce:[&_*]:!animate-none">
          {SERVICES.map((s) => (
            <span key={s} className="mx-6 flex items-center gap-2 text-sm text-muted-foreground">
              {s}
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                yakında
              </span>
            </span>
          ))}
          <span className="mx-6 text-sm font-semibold text-foreground">YIKAT uygulamasıyla</span>
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-muted to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-muted to-transparent" />
      </div>
    </section>
  )
}
