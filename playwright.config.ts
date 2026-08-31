import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  expect: { timeout: 30_000 },
  fullyParallel: false,
  workers: process.env.CI ? 2 : 1,
  timeout: 120_000,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: { baseURL: "http://127.0.0.1:4173", trace: "on-first-retry" },
  webServer: [
    { command: "node scripts/e2e-backend.mjs", url: "http://127.0.0.1:8000/health/", reuseExistingServer: false, timeout: 120_000 },
    { command: "npm run dev -- --host 127.0.0.1 --port 4173", url: "http://127.0.0.1:4173", reuseExistingServer: false },
  ],
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], channel: process.env.CI ? undefined : "chrome" } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"], channel: process.env.CI ? undefined : "chrome" } },
  ],
});
