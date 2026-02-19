import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Phone, Mail, Clock } from "lucide-react"
import { ContactForm } from "@/components/contact-form"

export const metadata = {
  title: "İletişim - YIKAT",
  description:
    "YIKAT ile iletişime geçin. Sorularınız ve talepleriniz için bize ulaşın.",
}

export default function IletisimPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {"Geri Dön"}
          </Link>
          <div className="mx-auto">
            <Link href="/">
              <Image
                src="/images/yikat-logo-blue.png"
                alt="YIKAT"
                width={120}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          {/* Spacer for centering */}
          <div className="w-[72px]" />
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {"İletişim"}
        </h1>
        <p className="mt-3 text-center text-muted-foreground">
          {"Sorularınız ve talepleriniz için bize ulaşın."}
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {"İletişim Bilgileri"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {"Size yardımcı olmaktan mutluluk duyarız."}
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {"Telefon"}
                  </p>
                  <a
                    href="tel:08503033193"
                    className="mt-0.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {"0850 303 31 93"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {"E-posta"}
                  </p>
                  <a
                    href="mailto:destek@yikat.tech"
                    className="mt-0.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {"destek@yikat.tech"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {"Çalışma Saatleri"}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {"Haftanın her günü: 08:00 - 22:00"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-semibold text-foreground">
              {"Bize Mesaj Gönderin"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {"En kısa sürede size dönüş yapacağız."}
            </p>
            <ContactForm />
          </div>
        </div>

        {/* Back link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {"Ana Sayfaya Dön"}
          </Link>
        </div>
      </div>
    </main>
  )
}
