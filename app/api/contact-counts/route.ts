import { handleContactCounter } from "@/lib/contact-counter-server.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 5

export async function POST(request: Request) {
  return handleContactCounter(request, process.env)
}
