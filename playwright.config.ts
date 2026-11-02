import { defineConfig } from "@playwright/test"

const port = Number(process.env.YIKAT_TEST_PORT ?? 3211)
const baseURL = `http://127.0.0.1:${port}`

// Sistem Chrome'u kullanılır (channel) — tarayıcı indirmesi gerekmez.
// Port 3211: yerelde 3000/3001/3210 sık dolu (sahip dev sunucuları).
export default defineConfig({
  testDir: "./tests",
  testIgnore: ["**/reviews-ui/**", "**/*.test.mjs"],
  timeout: 60_000,
  fullyParallel: true,
  // CI (GitHub ubuntu, 4 vCPU) keeps two workers next to the production server. Measured on
  // 2 November 2026 with 150 discovery routes (synthetic guide copies): 160 tests, 367 s of test
  // time in total, longest test 13 s; the route loops run in chunks (tests/discovery.spec.ts),
  // so the quality job stays well inside its 20-minute limit. Locally Playwright's default applies.
  workers: process.env.CI ? 2 : undefined,
  use: {
    channel: "chrome",
    baseURL,
  },
  webServer: {
    env: { YIKAT_GOOGLE_REVIEWS_ENABLED: "false", YIKAT_GOOGLE_REVIEWS_PUBLIC_DISPLAY_APPROVED: "false", YIKAT_CONTACT_COUNTER_ENABLED: "false" },
    // Production build'e karşı koşulur: dev sunucusunun rota-bazlı soğuk derlemeleri paralel
    // worker'larda ERR_ABORTED/timeout flakiness'i üretiyordu; prod deterministik ve hızlı.
    command: `YIKAT_BUILD_DIR=.next-test pnpm build --webpack && YIKAT_BUILD_DIR=.next-test pnpm start --hostname 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 240_000,
  },
})
