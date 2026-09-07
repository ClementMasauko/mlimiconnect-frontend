import { expect, test } from "@playwright/test";

const googleUser = {
  id: 91,
  username: "google_farmer",
  email: "google.farmer@e2e.test",
  user_type: "buyer",
  account_type: "individual",
  can_buy: true,
  can_sell: false,
  google_connected: true,
  has_usable_password: false,
  requires_onboarding: true,
};

test("a first-time Google user completes onboarding", async ({ page }) => {
  let authenticated = false;
  let onboardingComplete = false;

  await page.addInitScript(() => {
    let credentialCallback: ((response: { credential: string }) => void) | undefined;
    window.google = {
      accounts: {
        id: {
          initialize: options => { credentialCallback = options.callback; },
          renderButton: element => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = "Continue with Google";
            button.setAttribute("aria-label", "Continue with Google");
            button.onclick = () => credentialCallback?.({ credential: "e2e-google-credential" });
            element.appendChild(button);
          },
          disableAutoSelect: () => undefined,
        },
      },
    };
  });

  await page.route("**/api/**", async route => {
    const { pathname } = new URL(route.request().url());
    if (pathname === "/api/csrf/") return route.fulfill({ json: { csrfToken: "e2e-csrf" } });
    if (pathname === "/api/auth/google/" && route.request().method() === "POST") {
      authenticated = true;
      return route.fulfill({ json: { user: googleUser } });
    }
    if (pathname === "/api/auth/google/onboarding/" && route.request().method() === "POST") {
      onboardingComplete = true;
      return route.fulfill({ json: { detail: "Profile setup complete." } });
    }
    if (pathname === "/api/auth/profile/") {
      if (!authenticated) return route.fulfill({ status: 401, json: { detail: "Authentication credentials were not provided." } });
      return route.fulfill({ json: { ...googleUser, requires_onboarding: !onboardingComplete, location: onboardingComplete ? "Lilongwe" : "" } });
    }
    return route.fulfill({ status: 404, json: { detail: "Not mocked" } });
  });

  await page.goto("/login");
  await page.getByRole("button", { name: "Continue with Google" }).click();
  await expect(page).toHaveURL(/\/google-onboarding$/);
  await expect(page.getByRole("heading", { name: "Complete your MlimiConnect profile" })).toBeVisible();
  await page.getByPlaceholder("District or location").fill("Lilongwe");
  await page.getByRole("button", { name: "Complete setup" }).click();
  await expect(page).toHaveURL(/\/app\/marketplace$/);
});
