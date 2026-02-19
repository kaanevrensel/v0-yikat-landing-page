import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Tüm alanlar zorunludur." },
        { status: 400 }
      )
    }

    // Send email via mailto-style redirect is not possible from API.
    // Using a simple Resend / SMTP integration placeholder.
    // For now, we log the contact and return success.
    // In production, integrate with Resend, SendGrid, or similar.

    const contactData = {
      to: "destek@yikat.tech",
      from: email,
      name,
      message,
      timestamp: new Date().toISOString(),
    }

    // Log for server-side visibility
    console.log("[YIKAT] Yeni iletişim mesajı:", contactData)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Bir hata oluştu." },
      { status: 500 }
    )
  }
}
