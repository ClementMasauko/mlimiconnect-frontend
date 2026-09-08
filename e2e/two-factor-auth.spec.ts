import { expect, test } from "@playwright/test";

test("password login completes an authenticator challenge", async ({ page }) => {
  let authenticated = false;
  await page.addInitScript(() => {
    window.google = { accounts: { id: { initialize: () => undefined, renderButton: () => undefined, disableAutoSelect: () => undefined } } };
  });
  await page.route("**/api/**", async route => {
    const { pathname } = new URL(route.request().url());
    if (pathname === "/api/csrf/") return route.fulfill({ json: { csrfToken: "e2e-csrf" } });
    if (pathname === "/api/auth/profile/") return authenticated
      ? route.fulfill({ json: { id: 7, username: "secure_buyer", email: "secure@e2e.test", user_type: "buyer", requires_onboarding: false, twoFactorEnabled: true } })
      : route.fulfill({ status: 401, json: { detail: "Authentication credentials were not provided." } });
    if (pathname === "/api/auth/login/") return route.fulfill({ json: { two_factor_required: true, challenge_token: "11111111-1111-4111-8111-111111111111" } });
    if (pathname === "/api/auth/2fa/challenge/") {
      const body = route.request().postDataJSON();
      if (body.code !== "123456") return route.fulfill({ status: 400, json: { detail: "The authenticator or recovery code is incorrect." } });
      authenticated = true;
      return route.fulfill({ json: { user: { id: 7, username: "secure_buyer", email: "secure@e2e.test", user_type: "buyer", requires_onboarding: false, twoFactorEnabled: true } } });
    }
    return route.fulfill({ status: 404, json: { detail: "Not mocked" } });
  });

  await page.goto("/login");
  await page.locator("input").first().fill("secure@e2e.test");
  await page.locator('input[type="password"]').fill("SafePassword!234");
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await expect(page.getByText("Authenticator or recovery code")).toBeVisible();
  await page.getByPlaceholder("123456 or recovery code").fill("123456");
  await page.getByRole("button", { name: "Verify and sign in" }).click();
  await expect(page).toHaveURL(/\/app\/marketplace$/);
});
