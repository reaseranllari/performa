const { test, expect } = require('@playwright/test');

test('login form works for testmanager (manager role)', async ({ page }) => {
  await page.goto('http://localhost:61137/login');

  await page.getByPlaceholder('Email').fill('testmanager@gmail.com');
  await page.getByPlaceholder('Password').fill('test123');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('http://localhost:61137/dashboard/manager');
});
