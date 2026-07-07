import { defineConfig } from "@playwright/test"

// Sistem Chrome'u kullanılır (channel) — tarayıcı indirmesi gerekmez.
// Port 3210: yerelde 3000/3001 sık dolu (sahip dev sunucuları).
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  fullyParallel: true,
  use: {
    channel: "chrome",
    baseURL: "http://localhost:3210",
  },
  webServer: {
    // Production build'e karşı koşulur: dev sunucusunun rota-bazlı soğuk derlemeleri paralel
    // worker'larda ERR_ABORTED/timeout flakiness'i üretiyordu; prod deterministik ve hızlı.
    command: "pnpm build && pnpm start --port 3210",
    url: "http://localhost:3210",
    reuseExistingServer: true,
    timeout: 240_000,
  },
})
