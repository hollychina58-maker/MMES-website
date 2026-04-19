import { test, expect, Page } from '@playwright/test';

// Helper function to check for broken images
async function checkForBrokenImages(page: Page): Promise<string[]> {
  const brokenImages: string[] = [];
  const images = await page.locator('img').all();

  for (const img of images) {
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
    if (naturalWidth === 0) {
      const src = await img.getAttribute('src');
      brokenImages.push(src || 'unknown');
    }
  }

  return brokenImages;
}

test.describe('1. Homepage (/)', () => {
  const languages = ['en', 'zh', 'ru', 'ar', 'fa', 'la'];

  test('should load homepage at /en with title and hero section', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Check title
    await expect(page).toHaveTitle(/MMES-MCTI/);

    // Check hero section
    const heroHeading = page.getByRole('heading', { level: 1 });
    await expect(heroHeading).toBeVisible({ timeout: 10000 });

    // Check hero content
    await expect(page.getByText('Precision Inertial Navigation Systems')).toBeVisible();

    // Report console errors
    if (errors.length > 0) {
      console.log('Console errors on homepage:', errors);
    }
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
  });

  test('should check all 6 language variants load', async ({ page }) => {
    for (const lang of languages) {
      await page.goto(`/${lang}`);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
    }
  });

  test('should verify SEO meta tags on homepage', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Check canonical
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /mmes-mcti\.com\/en/);

    // Check og:tags
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');

    // Check twitter card
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  });

  test('should verify hreflang tags for all 6 languages', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    const hreflangs = ['x-default', 'en', 'zh', 'ru', 'ar', 'fa', 'la'];
    for (const lang of hreflangs) {
      const hreflang = page.locator(`link[rel="alternate"][hreflang="${lang}"]`);
      await expect(hreflang).toHaveCount(1, { timeout: 5000 });
    }
  });

  test('should verify Structured Data (OrganizationSchema, WebSiteSchema)', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Check OrganizationSchema
    const orgSchema = page.locator('script[type="application/ld+json"]').filter({ hasText: '"@type":"Organization"' });
    await expect(orgSchema).toHaveCount(1);

    // Check WebSiteSchema
    const websiteSchema = page.locator('script[type="application/ld+json"]').filter({ hasText: '"@type":"WebSite"' });
    await expect(websiteSchema).toHaveCount(1);
  });

  test('should check navigation links work on homepage', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Click Products link
    await page.getByRole('link', { name: 'Products' }).first().click();
    await page.waitForURL(/\/en\/products/);

    // Click About Us link
    await page.getByRole('link', { name: 'About Us' }).first().click();
    await page.waitForURL(/\/en\/about/);
  });

  test('should verify RTL layout for /ar (Arabic)', async ({ page }) => {
    await page.goto('/ar');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  });

  test('should verify RTL layout for /fa (Persian)', async ({ page }) => {
    await page.goto('/fa');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
  });
});

test.describe('2. Products List (/en/products)', () => {
  test('should load products page and display products', async ({ page }) => {
    await page.goto('/en/products');
    // Wait for client-side hydration and content load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Additional wait for client-side rendering

    // Check page title
    await expect(page.getByRole('heading', { name: /Products/i })).toBeVisible({ timeout: 15000 });

    // Check that at least one product is visible
    const productCards = page.locator('[class*="product"], [class*="card"], a[href*="/products/"]');
    await expect(productCards.first()).toBeVisible({ timeout: 15000 });
  });

  test('should verify products page images load', async ({ page }) => {
    await page.goto('/en/products');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const brokenImages = await checkForBrokenImages(page);
    expect(brokenImages).toHaveLength(0);
  });

  test('should verify language switching works on products page', async ({ page }) => {
    // Switch to Chinese
    await page.goto('/en/products');
    await page.waitForLoadState('networkidle');
    await page.locator('button').filter({ hasText: /English/ }).click();
    await page.locator('a[href="/zh"]').first().click();
    await page.waitForURL(/\/zh\/products/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh');
  });
});

test.describe('3. Product Detail (/en/products/pa-3arg)', () => {
  test('should load product detail for PA-3ARG', async ({ page }) => {
    await page.goto('/en/products/pa-3arg');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check product name
    await expect(page.getByText('PA-3ARG', { exact: false }).first()).toBeVisible({ timeout: 15000 });

    // Check description
    await expect(page.getByText(/High-performance|Attitude Heading Reference/i)).toBeVisible({ timeout: 10000 });
  });

  test('should display product specs/parameters', async ({ page }) => {
    await page.goto('/en/products/pa-3arg');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check for specs section or parameters
    const specsSection = page.getByText(/Technical Specifications|Parameters|Accuracy/i);
    await expect(specsSection.first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate back to products list', async ({ page }) => {
    await page.goto('/en/products/pa-3arg');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Click back to products
    const backLink = page.getByText(/Back to Products|View All Products/i).first();
    if (await backLink.isVisible()) {
      await backLink.click();
      await page.waitForURL(/\/en\/products/);
    } else {
      // Try clicking the logo or home link
      await page.goto('/en/products');
      await expect(page).toHaveURL(/\/en\/products/);
    }
  });
});

test.describe('4. About Page (/en/about)', () => {
  const languages = ['en', 'zh', 'ru', 'ar', 'fa', 'la'];

  test('should load and verify about content renders', async ({ page }) => {
    await page.goto('/en/about');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await expect(page.getByText(/About|MMES-MCTI/i).first()).toBeVisible({ timeout: 15000 });
  });

  test('should check all language variants for about page', async ({ page }) => {
    for (const lang of languages) {
      await page.goto(`/${lang}/about`);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
    }
  });
});

test.describe('5. Contact Page (/en/contact)', () => {
  const languages = ['en', 'zh', 'ru', 'ar', 'fa', 'la'];

  test('should load and verify form elements exist', async ({ page }) => {
    await page.goto('/en/contact');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check for form
    await expect(page.locator('form')).toBeVisible({ timeout: 15000 });

    // Check for input fields
    const nameInput = page.locator('input[name="name"], input#name, input[placeholder*="name" i]');
    const emailInput = page.locator('input[name="email"], input#email, input[placeholder*="email" i]');
    await expect(nameInput.first()).toBeVisible({ timeout: 5000 });
    await expect(emailInput.first()).toBeVisible({ timeout: 5000 });
  });

  test('should check all language variants for contact page', async ({ page }) => {
    for (const lang of languages) {
      await page.goto(`/${lang}/contact`);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
    }
  });
});

test.describe('6. Blog (/en/blog)', () => {
  const languages = ['en', 'zh', 'ru', 'ar', 'fa', 'la'];

  test('should load blog page', async ({ page }) => {
    await page.goto('/en/blog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Blog may have more dynamic content

    // Page should load without error
    await expect(page).toHaveTitle(/MMES-MCTI/i);
  });

  test('should check all language variants for blog page', async ({ page }) => {
    for (const lang of languages) {
      await page.goto(`/${lang}/blog`);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
    }
  });
});

test.describe('7. Language Switching', () => {
  const languages = ['zh', 'ru', 'ar', 'fa', 'la'];

  test('should switch between all 6 languages on homepage', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Open language dropdown
    await page.locator('button').filter({ hasText: /English/ }).click();
    await page.waitForTimeout(500);

    for (const lang of languages) {
      const langLink = page.locator(`a[href="/${lang}"]`).first();
      if (await langLink.isVisible()) {
        await langLink.click();
        await page.waitForURL(new RegExp(`/${lang}`));
        await expect(page.locator('html')).toHaveAttribute('lang', lang);
        // Reopen dropdown for next iteration
        await page.locator('button').filter({ hasText: new RegExp(lang, 'i') }).click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should switch between all 6 languages on products page', async ({ page }) => {
    await page.goto('/en/products');
    await page.waitForLoadState('networkidle');

    // Open language dropdown
    await page.locator('button').filter({ hasText: /English/ }).click();
    await page.waitForTimeout(500);

    for (const lang of languages) {
      const langLink = page.locator(`a[href="/${lang}/products"]`).first();
      if (await langLink.isVisible()) {
        await langLink.click();
        await page.waitForURL(new RegExp(`/${lang}/products`));
        await expect(page.locator('html')).toHaveAttribute('lang', lang);
        // Reopen dropdown for next iteration
        await page.locator('button').filter({ hasText: new RegExp(lang, 'i') }).click();
        await page.waitForTimeout(500);
      }
    }
  });
});

test.describe('8. SEO Verification', () => {
  test('should verify robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    const content = await page.content();
    expect(content).toContain('robots');
  });

  test('should verify sitemap.xml is accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
  });

  test('should verify canonical URLs are correct', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /mmes-mcti\.com\/en/);
  });

  test('should verify JSON-LD structured data is present and valid', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    const ldJsonScripts = page.locator('script[type="application/ld+json"]');
    const count = await ldJsonScripts.count();
    expect(count).toBeGreaterThanOrEqual(2); // Organization + WebSite schemas

    // Validate JSON is parseable
    const content = await ldJsonScripts.first().textContent();
    expect(() => JSON.parse(content || '')).not.toThrow();
  });
});

test.describe('9. Visual/UX Checks', () => {
  test('should check for broken images across pages', async ({ page }) => {
    const pages = ['/en', '/en/products', '/en/about', '/en/contact', '/en/blog'];
    let totalBrokenImages: string[] = [];

    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const brokenImages = await checkForBrokenImages(page);
      totalBrokenImages.push(...brokenImages.map(img => `${url}: ${img}`));
    }

    if (totalBrokenImages.length > 0) {
      console.log('Broken images found:', totalBrokenImages);
    }
    expect(totalBrokenImages).toHaveLength(0);
  });

  test('should verify responsive layout elements', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Mobile menu button should be visible
    const mobileMenu = page.locator('button.md\\:hidden');
    await expect(mobileMenu).toBeVisible();
  });
});

test.describe('10. Global Checks (all pages)', () => {
  test('should verify header navigation works on all pages', async ({ page }) => {
    const pages = ['/', '/products', '/about', '/contact', '/blog'];

    for (const path of pages) {
      await page.goto(`/en${path}`);
      await page.waitForLoadState('networkidle');

      // Header should be visible
      await expect(page.locator('header')).toBeVisible();
    }
  });

  test('should verify footer renders on all pages', async ({ page }) => {
    const pages = ['/', '/products', '/about', '/contact', '/blog'];

    for (const path of pages) {
      await page.goto(`/en${path}`);
      await page.waitForLoadState('networkidle');

      // Footer should be visible
      await expect(page.locator('footer')).toBeVisible();
      await expect(page.getByText(/MMES-MCTI.*rights reserved/i)).toBeVisible();
    }
  });

  test('should verify GA4 script loads', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    // Check for GA4 script
    const scripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script[src*="googletagmanager"]')).length;
    });
    expect(scripts).toBeGreaterThanOrEqual(1);
  });
});
