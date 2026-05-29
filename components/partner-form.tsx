"use client"

import { useState } from "react"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"

/** Turkish mobile/landline: optional +90/0 prefix, 10 digits. */
const TR_PHONE = /^(\+90|0)?\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/

function track(event: string) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    ;(window as any).gtag("event", event)
  }
}

export function PartnerForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>

    const nextErrors: Record<string, string> = {}
    if (!TR_PHONE.test(data.phone?.trim() ?? "")) {
      nextErrors.phone = "Geçerli bir Türkiye telefon numarası girin."
    }
    if (data.whatsapp && !TR_PHONE.test(data.whatsapp.trim())) {
      nextErrors.whatsapp = "Geçerli bir WhatsApp numarası girin."
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus("sending")
    track("partner_form_submit")
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("failed")
      setStatus("sent")
      form.reset()
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-12 text-center">
        <CheckCircle2 className="size-12 text-primary" />
        <p className="text-lg font-medium text-foreground">Başvurunuz alındı</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          48 saat içinde ekibimiz size dönüş yapacak. İlginiz için teşekkürler.
        </p>
        <Button variant="outline" className="mt-2 rounded-full" onClick={() => setStatus("idle")}>
          Yeni başvuru
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
            Ad Soyad
          </label>
          <input id="name" name="name" required placeholder="Adınız Soyadınız" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="shop" className="mb-1.5 block text-sm font-medium text-foreground">
            Dükkan İsmi
          </label>
          <input id="shop" name="shop" required placeholder="Dükkanınızın adı" className={fieldClass} />
        </div>
      </div>

      <div>
        <label htmlFor="area" className="mb-1.5 block text-sm font-medium text-foreground">
          Mahalle / Adres
        </label>
        <input id="area" name="area" required placeholder="Mahalle, ilçe" className={fieldClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
            Telefon
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="05XX XXX XX XX"
            className={fieldClass}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="whatsapp" className="mb-1.5 block text-sm font-medium text-foreground">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            placeholder="05XX XXX XX XX"
            className={fieldClass}
            aria-invalid={!!errors.whatsapp}
          />
          {errors.whatsapp && <p className="mt-1 text-xs text-destructive">{errors.whatsapp}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="volume" className="mb-1.5 block text-sm font-medium text-foreground">
          Aylık yaklaşık sipariş sayısı
        </label>
        <input id="volume" name="volume" placeholder="Örn. 200" className={fieldClass} />
      </div>

      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-foreground">
          Notlar
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Eklemek istediğiniz bir şey var mı?"
          className={`${fieldClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">
          Başvuru gönderilemedi. Lütfen tekrar deneyin.
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "sending"}
        className="mt-1 w-full rounded-full bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Gönderiliyor…
          </>
        ) : (
          "Başvuruyu Gönder"
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Başvurunuz YIKAT ekibine iletilir. 48 saat içinde dönüş yapılır.
      </p>
    </form>
  )
}
