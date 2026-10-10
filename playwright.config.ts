import { defineConfig } from "@playwright/test"

// Sistem Chrome'u kullanılır (channel) — tarayıcı indirmesi gerekmez.
// Port 3211: yerelde 3000/3001/3210 sık dolu (sahip dev sunucuları).
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  fullyParallel: true,
  use: {
    channel: "chrome",
    baseURL: "http://127.0.0.1:3211",
  },
  webServer: {
    // Production build'e karşı koşulur: dev sunucusunun rota-bazlı soğuk derlemeleri paralel
    // worker'larda ERR_ABORTED/timeout flakiness'i üretiyordu; prod deterministik ve hızlı.
    command: "YIKAT_BUILD_DIR=.next-test pnpm build --webpack && YIKAT_BUILD_DIR=.next-test pnpm start --hostname 127.0.0.1 --port 3211",
    url: "http://127.0.0.1:3211",
    reuseExistingServer: true,
    timeout: 240_000,
  },
})
