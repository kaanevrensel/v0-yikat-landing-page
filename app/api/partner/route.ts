import { NextResponse } from "next/server"
import { Resend } from "resend"

const FROM = "yikat yazılım <yikat@yikat.tech>"
const TO = ["zefek10@gmail.com"]

function row(label: string, value?: string) {
  if (!value) return ""
  const safe = String(value).replace(/</g, "&lt;").replace(/>/g, "&gt;")
  return `<tr>
    <td style="padding:8px 12px;background:#f3f4f6;font-weight:500;color:#1f2937;white-space:nowrap;vertical-align:top">${label}</td>
    <td style="padding:8px 12px;color:#1f2937">${safe.replace(/\n/g, "<br>")}</td>
  </tr>`
}

/**
 * Partner application intake (Brief §6.5).
 * Validates required fields, then emails the details to YIKAT via Resend.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, shop, area, phone, whatsapp, volume, notes } = body ?? {}

    if (!name || !shop || !area || !phone) {
      return NextResponse.json(
        { error: "Ad Soyad, Dükkan İsmi, Mahalle/Adres ve Telefon zorunludur." },
        { status: 400 },
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error("[YIKAT] RESEND_API_KEY tanımlı değil — mail gönderilemedi.")
      return NextResponse.json({ error: "Mail servisi yapılandırılmamış." }, { status: 500 })
    }
    const resend = new Resend(apiKey)

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto">
        <h2 style="color:#042c53;font-weight:500">Yeni partner başvurusu</h2>
        <p style="color:#6b7280;font-size:14px">YIKAT /partnerlik formundan yeni bir başvuru geldi.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
          ${row("Ad Soyad", name)}
          ${row("Dükkan İsmi", shop)}
          ${row("Mahalle / Adres", area)}
          ${row("Telefon", phone)}
          ${row("WhatsApp", whatsapp)}
          ${row("Aylık sipariş", volume)}
          ${row("Notlar", notes)}
        </table>
        <p style="color:#9ca3af;font-size:12px;margin-top:16px">yikat.tech · partner başvuru bildirimi</p>
      </div>`

    const text = [
      "Yeni partner başvurusu",
      `Ad Soyad: ${name}`,
      `Dükkan İsmi: ${shop}`,
      `Mahalle / Adres: ${area}`,
      `Telefon: ${phone}`,
      whatsapp ? `WhatsApp: ${whatsapp}` : null,
      volume ? `Aylık sipariş: ${volume}` : null,
      notes ? `Notlar: ${notes}` : null,
    ]
      .filter(Boolean)
      .join("\n")

    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `Yeni partner başvurusu — ${shop} (${name})`,
      html,
      text,
    })

    if (error) {
      console.error("[YIKAT] Resend hatası:", error)
      return NextResponse.json({ error: "Mail gönderilemedi." }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[YIKAT] Partner başvuru hatası:", err)
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 })
  }
}
