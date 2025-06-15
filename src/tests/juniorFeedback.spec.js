
const { test, expect } = require('@playwright/test');

test('junior submits feedback to manager successfully', async ({ page }) => {

  await page.goto('http://localhost:61137/login');
  await page.getByPlaceholder('Email').fill('testemployee@gmail.com');
  await page.getByPlaceholder('Password').fill('test123');
  await page.click('button[type="submit"]');

 
  await expect(page).toHaveURL('http://localhost:61137/dashboard/junioremployee/home');


  await page.click('text=Feedback');

  
  await expect(page.locator('form')).toBeVisible();

  const managerOptions = await page.$$eval('#managerSelect option', options =>
    options.filter(opt => opt.value !== '').map(opt => opt.value)
  );
  
  expect(managerOptions.length).toBeGreaterThan(0); 
  
  await page.selectOption('#managerSelect', managerOptions[0]);

  await page.locator('label:has-text("Clarity")')
  .locator('..')
  .locator('i')
  .nth(3)
  .click();

  await page.locator('label:has-text("Accountability")')
  .locator('..')
  .locator('i')
  .nth(4)
  .click();


  await page.locator('label:has-text("Delegation")')
  .locator('..')
  .locator('i')
  .nth(4)
  .click();


await page.fill('#comment', 'Very approachable and gives clear guidance.');

page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('Feedback submitted successfully');
    await dialog.accept(); 
  });
  
  await page.click('button[type="submit"]');

await expect(page.locator('.alert-success')).toContainText('Feedback submitted');
});