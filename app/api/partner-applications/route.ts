import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
const services = new Set([
  "Ayakkabı",
  "Kuru temizleme",
  "Çamaşır",
  "Ütü",
  "Yorgan & battaniye",
]);
const fail = (error: string, status = 400) =>
  NextResponse.json(
    { ok: false, error },
    { status, headers: { "Cache-Control": "no-store" } },
  );

// Local development retains isolated receipts. Published environments use only
// the existing, anon-callable intake RPC; no privileged database key is needed.
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const loopback = ["localhost", "127.0.0.1", "[::1]"];
  const local = process.env.NODE_ENV === "development";
  if (local && !loopback.includes(url.hostname))
    return fail("Bu önizleme yalnızca bu bilgisayarda kullanılabilir.", 403);
  let origin: URL;
  try {
    origin = new URL(request.headers.get("origin") || "");
  } catch {
    return fail("Başvuru sayfasını yenileyip tekrar dene.", 403);
  }
  const productionHosts = new Set(["yikat.tech", "www.yikat.tech", process.env.VERCEL_URL]);
  if (origin.host !== request.headers.get("host") || (local
    ? !loopback.includes(origin.hostname) || origin.protocol !== "http:"
    : !productionHosts.has(origin.hostname) || origin.protocol !== "https:"))
    return fail("Başvuru sayfasını yenileyip tekrar dene.", 403);
  if (Number(request.headers.get("content-length") || 0) > 16000)
    return fail("Başvuru çok uzun.", 413);
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 16000) return fail("Başvuru çok uzun.", 413);
    body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body))
      return fail("Başvuru bilgilerini kontrol et.");
  } catch {
    return fail("Başvuru bilgileri okunamadı.");
  }
  const field = (name: string) =>
    typeof body[name] === "string" ? (body[name] as string).trim() : "";
  const requestId = field("requestId");
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      requestId,
    )
  )
    return fail("Sayfayı yenileyip tekrar dene.");
  if (field("website")) return fail("Başvuru bilgilerini kontrol et.");
  const businessName = field("businessName"),
    contactName = field("contactName"),
    contactEmail = field("contactEmail").toLowerCase(),
    contactPhone = field("contactPhone");
  if (businessName.length < 2 || businessName.length > 120)
    return fail("İşletme adını 2–120 karakter arasında gir.");
  if (contactName.length < 2 || contactName.length > 100)
    return fail("Adını ve soyadını kontrol et.");
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) ||
    contactEmail.length > 160
  )
    return fail("Geçerli bir e-posta adresi gir.");
  if (
    !/^[+0-9() .-]+$/.test(contactPhone) ||
    contactPhone.replace(/\D/g, "").length < 10 ||
    contactPhone.replace(/\D/g, "").length > 15 ||
    contactPhone.length > 22
  )
    return fail("Telefon numaranı alan koduyla birlikte kontrol et.");
  if (body.kvkkConsent !== true)
    return fail("Devam etmek için KVKK onayı gerekli.");
  if (
    !Array.isArray(body.proposedServices) ||
    body.proposedServices.length > 5 ||
    body.proposedServices.some((s) => typeof s !== "string" || !services.has(s))
  )
    return fail("Hizmet seçimlerini kontrol et.");
  const payload = {
    businessName,
    contactName,
    contactEmail,
    contactPhone,
    proposedServices: [...new Set(body.proposedServices)].sort(),
    kvkkConsent: true,
  };
  if (!local) {
    const endpoint = process.env.YIKAT_PARTNER_SUPABASE_URL;
    const anonKey = process.env.YIKAT_PARTNER_ANON_KEY;
    if (!endpoint || !anonKey)
      return fail("Başvuru şu anda gönderilemiyor. Lütfen WhatsApp’tan bize ulaş.", 503);
    const serviceCodes: Record<string, string> = {
      "Ayakkabı": "SHOES", "Kuru temizleme": "KURU_TEMIZLEME",
      "Çamaşır": "LAUNDRY", "Ütü": "IRONING", "Yorgan & battaniye": "BULKY",
    };
    try {
      const response = await fetch(`${endpoint}/rest/v1/rpc/submit_partner_application`, {
        method: "POST",
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          p_business_name: businessName, p_contact_name: contactName,
          p_contact_email: contactEmail, p_contact_phone: contactPhone,
          p_proposed_services: payload.proposedServices.map(service => serviceCodes[service]),
          p_proposed_zone_ids: [], p_kvkk_consent: true,
        }),
        signal: AbortSignal.timeout(10000), cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) return fail("Başvuru gönderilemedi. Lütfen tekrar dene.", 502);
      if (!result.ok) return fail(typeof result.error === "string" ? result.error : "Başvuru gönderilemedi.", 409);
      if (typeof result.applicationId !== "string" || !result.applicationId)
        return fail("Başvuru sonucu doğrulanamadı. Lütfen bizimle iletişime geç.", 502);
      return NextResponse.json({ ok: true, applicationId: result.applicationId, mode: "submitted" },
        { headers: { "Cache-Control": "no-store" } });
    } catch {
      return fail("Başvuru sonucu alınamadı. Bilgilerin burada duruyor; tekrar deneyebilir veya WhatsApp’tan bize ulaşabilirsin.", 502);
    }
  }
  const digest = createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
  const dir = path.join(process.cwd(), ".local-data", "partner-applications");
  const file = path.join(dir, `${requestId}.json`);
  try {
    await mkdir(dir, { recursive: true, mode: 0o700 });
    try {
      await writeFile(
        file,
        JSON.stringify(
          {
            ...payload,
            applicationId: requestId,
            digest,
            createdAt: new Date().toISOString(),
            mode: "local-preview",
          },
          null,
          2,
        ),
        { flag: "wx", mode: 0o600 },
      );
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "EEXIST") throw err;
      const previous = JSON.parse(await readFile(file, "utf8"));
      if (previous.digest !== digest)
        return fail(
          "Bu başvuru daha önce farklı bilgilerle kaydedildi. Sayfayı yenile.",
          409,
        );
    }
    return NextResponse.json(
      { ok: true, applicationId: requestId, mode: "local-preview" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return fail(
      "Başvuru kaydedilemedi. Bilgilerini koruduk; lütfen tekrar dene.",
      500,
    );
  }
}
