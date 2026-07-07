import coreWebVitals from "eslint-config-next/core-web-vitals"
import jsxA11y from "eslint-plugin-jsx-a11y"

// pnpm lint artık gerçek bir kapı: next/core-web-vitals (flat-native, Next 16) + jsx-a11y recommended.
// components/ui/** vendored shadcn/Magic UI iskelesi — bilinçle lint dışı (churn üretmemek için).
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "components/ui/**",
      "public/**",
      "docs/**",
      "next-env.d.ts",
      "playwright-report/**",
      "test-results/**",
      ".lighthouseci/**",
    ],
  },
  ...coreWebVitals,
  // eslint-config-next jsx-a11y plugin'ini zaten kaydediyor; yeniden tanımlamak çakışma verdiğinden
  // yalnız recommended KURAL seti eklenir (plugin instance'ı Next'inki kalır).
  { rules: jsxA11y.flatConfigs.recommended.rules },
  {
    rules: {
      // Kod tabanının bilinçli hydration-gate deseni: SSR ile ilk istemci render'ı eşitlemek için
      // browser-only durum (matchMedia, UA, readyState) mount'ta BİR KEZ state'e yazılır
      // (blur-text/spotlight-card/liquid-lens/use-directions-url). Kaskad render yok; toplu
      // useSyncExternalStore refactor'u doğrulanmış bileşenlerde gereksiz churn olur.
      "react-hooks/set-state-in-effect": "off",
      // Türkçe metin JSX içinde meşru kesme işaretleri taşır ("20:00'ye", "Haritalar'da");
      // &apos;'a kaçırmak kaynak okunabilirliğini bozar, kullanıcıya değer katmaz.
      "react/no-unescaped-entities": "off",
    },
  },
]

export default config
