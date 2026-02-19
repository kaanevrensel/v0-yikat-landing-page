"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2 } from "lucide-react"

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

      if (!res.ok) throw new Error("Gönderim başarısız")

      setStatus("sent")
      form.reset()
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-6 flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="text-lg font-semibold text-foreground">
          {"Mesajınız gönderildi!"}
        </p>
        <p className="text-sm text-muted-foreground">
          {"En kısa sürede size dönüş yapacağız."}
        </p>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => setStatus("idle")}
        >
          {"Yeni Mesaj Gönder"}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {"Adınız"}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Adınız Soyadınız"
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {"E-posta Adresiniz"}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="ornek@email.com"
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {"Mesajınız"}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Mesajınızı buraya yazın..."
          className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">
          {"Mesaj gönderilemedi. Lütfen tekrar deneyin."}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={status === "sending"}
      >
        {status === "sending" ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            {"Gönderiliyor..."}
          </>
        ) : (
          "Mesaj Gönder"
        )}
      </Button>
    </form>
  )
}
