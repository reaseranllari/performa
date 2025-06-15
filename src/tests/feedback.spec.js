
const { test, expect } = require('@playwright/test');

test('manager submits feedback successfully', async ({ page }) => {

  await page.goto('http://localhost:61137/login');

  await page.getByPlaceholder('Email').fill('testmanager@gmail.com');
  await page.getByPlaceholder('Password').fill('test123');
  await page.click('button[type="submit"]');


  await expect(page).toHaveURL('http://localhost:61137/dashboard/manager');
  await page.click('text=Feedback');
  await expect(page.locator('form')).toBeVisible();

  await page.selectOption('#employeeSelect', '32');
  await page.locator('label:has-text("Communication")').locator('..').locator('i').nth(3).click();
  await page.locator('label:has-text("Teamwork")').locator('..').locator('i').nth(4).click();

  await page.fill('#evaluateMore', 'Clear communicator');
  await page.fill('#evaluateLess', 'Could improve responsiveness');
  await page.fill('#comment', 'Shows great potential');


  await page.click('button[type="submit"]');
  await expect(page.locator('text=Feedback submitted successfully')).toBeVisible();
});