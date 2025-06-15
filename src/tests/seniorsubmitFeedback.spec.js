const { test, expect } = require('@playwright/test');

test('senior submits feedback to junior successfully', async ({ page }) => {

  await page.goto('http://localhost:61137/login');
  await page.getByPlaceholder('Email').fill('senioremployee@gmail.com');
  await page.getByPlaceholder('Password').fill('test123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/.*dashboard\/senioremployee/);
  await page.click('text=Feedback');
  await expect(page.locator('form')).toBeVisible();
  await page.selectOption('#employeeSelect', '28'); 
  await page.locator('label:has-text("Communication")')
    .locator('..').locator('i').nth(3).click(); 

  await page.locator('label:has-text("Teamwork")')
    .locator('..').locator('i').nth(4).click(); 


  await page.fill('#evaluateMore', 'Great collaboration');
  await page.fill('#evaluateLess', 'Could improve focus');
  await page.fill('#comment', 'Consistently supports the team');


  await page.click('button[type="submit"]');

 
  await expect(page.locator('.alert-success')).toContainText('Feedback submitted');
});
