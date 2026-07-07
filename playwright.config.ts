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
    command: "pnpm dev --port 3210",
    url: "http://localhost:3210",
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
