import { defineConfig } from "@playwright/test";
import base from "./playwright.config";
const server = Array.isArray(base.webServer) ? base.webServer[0] : base.webServer;
if (!server) throw new Error("Reviews UI tests require the isolated local web server");

// Only this local test server enables the UI. It has no OAuth credentials;
// browser tests intercept our endpoint with explicitly synthetic data.
export default defineConfig({
  ...base,
  testDir: "./tests/reviews-ui",
  testIgnore: [],
  webServer: {
    ...server,
    env: {
      YIKAT_GOOGLE_REVIEWS_ENABLED: "true",
      YIKAT_GOOGLE_REVIEWS_PUBLIC_DISPLAY_APPROVED: "true",
      YIKAT_GOOGLE_OAUTH_CLIENT_ID: "",
      YIKAT_GOOGLE_OAUTH_CLIENT_SECRET: "",
      YIKAT_GOOGLE_OAUTH_REFRESH_TOKEN: "",
      YIKAT_GOOGLE_BUSINESS_LOCATION: "",
      YIKAT_GOOGLE_BUSINESS_VERIFIED_PLACE_ID: "",
    },
  },
});
