// Paylaşılan analytics yardımcısı. Sitede gtag/GA yükleyici YOK — eski koddaki
// window.gtag kalıbı hiçbir event göndermiyordu. Vercel Analytics layout'ta zaten
// kurulu; custom event'ler onun track() API'siyle gider (yalnız client bileşenlerde çağrılır).
export { track } from "@vercel/analytics"
