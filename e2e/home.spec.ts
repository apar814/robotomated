import { test, expect } from "@playwright/test";

test("homepage loads with brand title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Robotomated/);
});

test("navigation links are visible on desktop", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Explore" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Reviews" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Advisor" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Learn" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Marketplace" })).toBeVisible();
});
