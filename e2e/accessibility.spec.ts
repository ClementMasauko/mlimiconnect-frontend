import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.use({ serviceWorkers: "block" });

const publicRoutes = ["/", "/login", "/register", "/marketplace", "/about", "/contact"];

for (const route of publicRoutes) {
  test(`${route} has no serious automated accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await page.locator("body").waitFor({ state: "visible" });
    await page.waitForTimeout(1500);
    await page.waitForLoadState("domcontentloaded");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const serious = results.violations.filter(item => item.impact === "critical" || item.impact === "serious");
    expect(serious, serious.map(item => `${item.id}: ${item.help} (${item.nodes.length})`).join("\n")).toEqual([]);
  });
}
