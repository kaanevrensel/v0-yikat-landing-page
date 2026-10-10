"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, CheckCircle2, LoaderCircle } from "lucide-react";

const serviceOptions = [
  "Ayakkabı",
  "Kuru temizleme",
  "Çamaşır",
  "Ütü",
  "Yorgan & battaniye",
];
export function PartnerForm() {
  const [status, setStatus] = useState<"idle" | "busy" | "saved">("idle");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState("");
  const [localReceipt, setLocalReceipt] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const lock = useRef(false);
  const requestId = useRef<string>("");
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (status !== "saved") return;
    successRef.current?.focus({ preventScroll: true });
    successRef.current?.scrollIntoView({ block: "center", behavior: "instant" });
  }, [status]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true;
    setStatus("busy");
    setError("");
    const form = new FormData(event.currentTarget);
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch("/api/partner-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: requestId.current,
          businessName: form.get("businessName"),
          contactName: form.get("contactName"),
          contactEmail: form.get("contactEmail"),
          contactPhone: form.get("contactPhone"),
          proposedServices: selected,
          kvkkConsent: form.get("kvkkConsent") === "on",
          website: form.get("website"),
        }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || !result.ok)
        throw new Error(
          result.error || "Başvuru kaydedilemedi. Lütfen tekrar dene.",
        );
      setReceipt(result.applicationId);
      setLocalReceipt(result.mode === "local-preview");
      setStatus("saved");
    } catch (err) {
      setError(
        err instanceof Error && err.name !== "TimeoutError"
          ? err.message
          : "Bağlantı kurulamadı. Bilgilerin burada duruyor; lütfen tekrar dene.",
      );
      setStatus("idle");
      lock.current = false;
    }
  }
  if (status === "saved")
    return (
      <div
        className="application-success"
        ref={successRef}
        tabIndex={-1}
        role="status"
      >
        <span>
          <CheckCircle2 size={36} />
        </span>
        <h3>{localReceipt ? "Deneme başvurun kaydedildi." : "Başvurun alındı."}</h3>
        <p>
          {localReceipt ? "Bu bir yerel önizleme. Bilgilerin bu bilgisayarda saklandı; ekibe başvuru veya e-posta gönderilmedi."
            : "Ekibimiz başvurunu inceleyip seninle iletişime geçecek."}
        </p>
        <small>Başvuru no: {receipt}</small>
        <button
          className="button secondary"
          type="button"
          onClick={() => {
            setStatus("idle");
            lock.current = false;
            requestId.current = "";
            setSelected([]);
          }}
        >
          {localReceipt ? "Yeni deneme başvurusu" : "Yeni başvuru"}
        </button>
      </div>
    );
  return (
    <form
      className="partner-form"
      method="post"
      action="/api/partner-applications"
      onSubmit={submit}
    >
      <div className="form-heading">
        <h2>Başvur</h2>
      </div>
      <div className="form-grid">
        <label className="full">
          İşletme adı{" "}
          <input
            name="businessName"
            autoComplete="organization"
            placeholder="İşletmenin adı"
            required
            minLength={2}
            maxLength={120}
          />
        </label>
        <label>
          Ad soyad{" "}
          <input
            name="contactName"
            autoComplete="name"
            placeholder="Adın ve soyadın"
            required
            minLength={2}
            maxLength={100}
          />
        </label>
        <label>
          Telefon{" "}
          <input
            name="contactPhone"
            type="tel"
            autoComplete="tel"
            placeholder="05XX XXX XX XX"
            required
            minLength={10}
            inputMode="tel"
            maxLength={22}
            title="Telefon numaranı alan koduyla birlikte gir."
          />
        </label>
        <label className="full">
          E-posta{" "}
          <input
            name="contactEmail"
            type="email"
            autoComplete="email"
            placeholder="ornek@isletmen.com"
            required
            maxLength={160}
          />
        </label>
      </div>
      <fieldset className="service-checkboxes">
        <legend>
          Hangi hizmetleri veriyorsun? <span>(İsteğe bağlı)</span>
        </legend>
        <div>
          {serviceOptions.map((service) => (
            <label key={service}>
              <input
                type="checkbox"
                checked={selected.includes(service)}
                onChange={() =>
                  setSelected((prev) =>
                    prev.includes(service)
                      ? prev.filter((s) => s !== service)
                      : [...prev, service],
                  )
                }
              />
              <span>
                <Check size={14} />
                {service}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="honeypot" aria-hidden="true">
        <label>
          Web sitesi
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent-label">
        <input type="checkbox" name="kvkkConsent" required />
        <span>
          <Link href="/kvkk" target="_blank">
            KVKK Aydınlatma Metni
          </Link>
          ’ni okudum. Başvurum için paylaştığım bilgilerin işlenmesini kabul
          ediyorum.
        </span>
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="button primary form-submit"
        disabled={status === "busy"}
      >
        {status === "busy" ? (
          <>
            <LoaderCircle size={18} className="loading-icon" />
            Gönderiliyor…
          </>
        ) : (
          <>Başvuruyu gönder</>
        )}
      </button>
      <p className="form-footnote">
        Başvuru, iş ortaklığı sözleşmesi veya kabul garantisi değildir.
      </p>
    </form>
  );
}
