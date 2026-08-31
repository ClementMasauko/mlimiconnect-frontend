import { expect, test } from "@playwright/test";

test("landing page exposes its brand and theme control", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/MlimiConnect/i);
  await expect(page.getByRole("link", { name: /MlimiConnect home/i }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /switch to (light|dark) theme/i })).toBeVisible();
});

test("public traceability verification route is reachable", async ({ page }) => {
  await page.goto("/verify");
  await expect(page.getByRole("heading", { name: /verify/i }).first()).toBeVisible();
  await expect(page.locator("input").first()).toBeVisible();
});
