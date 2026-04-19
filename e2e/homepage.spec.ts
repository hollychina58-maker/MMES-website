import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveTitle(/MMES-MCTI/);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should display products section', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByText('Our Products')).toBeVisible();
  });

  test('should display navigation', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByRole('link', { name: 'MMES-MCTI' }).first()).toBeVisible();
  });
});

test.describe('Language Switching', () => {
  test('should switch to Chinese', async ({ page }) => {
    await page.goto('/en');
    // Open language dropdown first
    await page.locator('button').filter({ hasText: /English/ }).click();
    await page.waitForTimeout(300);
    // Click Chinese option (first one - dropdown has it before footer)
    await page.locator('a[href="/zh"]').first().click();
    await page.waitForURL(/\/zh/);
  });

  test('should switch to Arabic with RTL', async ({ page }) => {
    await page.goto('/en');
    // Open language dropdown first
    await page.locator('button').filter({ hasText: /English/ }).click();
    await page.waitForTimeout(300);
    // Click Arabic option (first one - dropdown has it before footer)
    await page.locator('a[href="/ar"]').first().click();
    await page.waitForURL(/\/ar/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});

test.describe('Products Page', () => {
  test('should display products', async ({ page }) => {
    await page.goto('/en/products');
    await page.waitForSelector('text=PA-3ARG');
    await expect(page.getByText('PA-3ARG')).toBeVisible();
  });
});

test.describe('Contact Form', () => {
  test('should display form fields', async ({ page }) => {
    await page.goto('/en/contact');
    await page.waitForSelector('form');
    await expect(page.locator('input[name="name"], input#name')).toBeVisible();
    await expect(page.locator('input[name="email"], input#email')).toBeVisible();
  });
});

test.describe('Blog Page', () => {
  test('should display blog', async ({ page }) => {
    await page.goto('/en/blog');
    await page.waitForSelector('article, a[href*="/blog/"]');
    await expect(page.getByText('Precision Navigation')).toBeVisible();
  });
});

test.describe('About Page', () => {
  test('should display about content', async ({ page }) => {
    await page.goto('/en/about');
    await page.waitForSelector('text=About MMES-MCTI');
    await expect(page.getByText('About MMES-MCTI')).toBeVisible();
  });
});
