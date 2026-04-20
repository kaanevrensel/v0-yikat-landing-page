import { DialNavigator } from "@/components/DialNavigator"
import { SECTIONS } from "@/lib/sections"

export default function Home() {
  return (
    <>
      <DialNavigator />
      <main>
        {SECTIONS.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className={`flex min-h-screen items-center justify-center pt-[calc(50vw+1.25rem)] lg:pt-0 ${i === 0 ? "" : "lg:pl-[480px]"}`}
          >
            <h1 className="font-mono text-6xl">{s.label}</h1>
          </section>
        ))}
      </main>
    </>
  )
}
