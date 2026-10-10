import { test, expect } from "@playwright/test"
import { NextRequest } from "next/server"
import { POST } from "../app/api/partner-applications/route"

// Exercise the published API boundary without creating real business records.
const valid = {
  requestId: "5dcb9317-9260-41c2-8e83-b3bc6065c49e",
  businessName: "Başvuru denemesi", contactName: "Test Kullanıcısı",
  contactEmail: "QA@EXAMPLE.COM", contactPhone: "+90 555 000 00 00",
  proposedServices: ["Ayakkabı", "Kuru temizleme", "Çamaşır", "Ütü", "Yorgan & battaniye"],
  kvkkConsent: true, website: "",
}
function request(body: unknown = valid, origin = "https://www.yikat.tech") {
  return new NextRequest("https://www.yikat.tech/api/partner-applications", {
    method: "POST", headers: { origin, host: "www.yikat.tech", "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}
const originalFetch = globalThis.fetch
let originalEnv: NodeJS.ProcessEnv
test.beforeEach(() => {
  originalEnv = { ...process.env }
  Object.assign(process.env, {
    NODE_ENV: "production", YIKAT_PARTNER_SUPABASE_URL: "https://intake.example.com",
    YIKAT_PARTNER_ANON_KEY: "test-anonymous-key",
  })
})
test.afterEach(() => { globalThis.fetch = originalFetch; process.env = originalEnv })

test("published intake maps the five services and acknowledges only a saved application", async () => {
  let outgoing: Record<string, unknown> | undefined
  globalThis.fetch = async (input, init) => {
    expect(input).toBe("https://intake.example.com/rest/v1/rpc/submit_partner_application")
    expect(new Headers(init?.headers).get("apikey")).toBe("test-anonymous-key")
    outgoing = JSON.parse(String(init?.body))
    return Response.json({ ok: true, applicationId: "saved-application" })
  }
  const response = await POST(request())
  expect(response.status).toBe(200)
  expect(response.headers.get("cache-control")).toBe("no-store")
  expect(await response.json()).toEqual({ ok: true, applicationId: "saved-application", mode: "submitted" })
  expect(outgoing).toEqual({
    p_business_name: valid.businessName, p_contact_name: valid.contactName,
    p_contact_email: "qa@example.com", p_contact_phone: valid.contactPhone,
    p_proposed_services: expect.arrayContaining(["SHOES", "KURU_TEMIZLEME", "LAUNDRY", "IRONING", "BULKY"]),
    p_proposed_zone_ids: [], p_kvkk_consent: true,
  })
})

test("intake rejects foreign origins, missing consent, unknown services and honeypots before the database", async () => {
  let called = false
  globalThis.fetch = async () => { called = true; throw new Error("unexpected database call") }
  expect((await POST(request(valid, "https://other.example"))).status).toBe(403)
  expect((await POST(request({ ...valid, kvkkConsent: false }))).status).toBe(400)
  expect((await POST(request({ ...valid, proposedServices: ["unknown"] }))).status).toBe(400)
  expect((await POST(request({ ...valid, website: "spam.example" }))).status).toBe(400)
  expect(called).toBe(false)
})

test("intake fails honestly for missing configuration, duplicates and ambiguous upstream results", async () => {
  delete process.env.YIKAT_PARTNER_ANON_KEY
  expect((await POST(request())).status).toBe(503)
  process.env.YIKAT_PARTNER_ANON_KEY = "test-anonymous-key"
  for (const [reply, status] of [
    [{ ok: false, error: "Bu e-posta adresi için bekleyen bir başvuru var." }, 409],
    [{ ok: true }, 502],
  ] as const) {
    globalThis.fetch = async () => Response.json(reply)
    const response = await POST(request())
    expect(response.status).toBe(status)
    expect((await response.json()).ok).toBe(false)
  }
  globalThis.fetch = async () => { throw new Error("network timeout") }
  const timeout = await POST(request())
  expect(timeout.status).toBe(502)
  expect((await timeout.json()).error).toContain("Başvuru sonucu alınamadı")
})
