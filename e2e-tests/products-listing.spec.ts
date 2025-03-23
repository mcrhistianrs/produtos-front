import { expect, test } from '@playwright/test';

test.describe('Product Listing', () => {
  test('should display products on the home page', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('h1:has-text("Produtos")');
    
    const productCards = await page.locator('.grid div[class*="bg-white"]').all();
    expect(productCards.length).toBeGreaterThan(0);
    
    const firstProduct = productCards[0];
    await expect(firstProduct.locator('h3')).toBeVisible(); // Product name
    await expect(firstProduct.locator('p >> nth=1')).toBeVisible(); // Category
    await expect(firstProduct.locator('button:has-text("Adicionar")')).toBeVisible(); // Add to cart button
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('select');
    
    const initialProductCount = await page.locator('.grid div[class*="bg-white"]').count();
    
    await page.selectOption('select', { value: 'food' });
    
    await page.waitForTimeout(500); // Small wait for the filter to apply
    
    const filteredProductCount = await page.locator('.grid div[class*="bg-white"]').count();
    
    expect(filteredProductCount).toBeLessThanOrEqual(initialProductCount);
    
    const categoryTexts = await page.locator('.grid div[class*="bg-white"] p >> nth=1').allTextContents();
    for (const categoryText of categoryTexts) {
      expect(categoryText.toLowerCase()).toBe('food');
    }
  });

  test('should search for products by name', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('input#search');
    
    await page.fill('input#search', 'cola');
    
    await page.waitForTimeout(500);
    
    const productNames = await page.locator('.grid div[class*="bg-white"] h3').allTextContents();
    const hasMatchingProduct = productNames.some(name => 
      name.toLowerCase().includes('cola')
    );
    
    expect(hasMatchingProduct).toBeTruthy();
  });

  test('should filter products by price range', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('input#min-price');
    await page.waitForSelector('input#max-price');
    
    await page.fill('input#min-price', '5');
    await page.fill('input#max-price', '15');
    
    await page.waitForTimeout(500);
    
    const filteredProducts = await page.locator('.grid div[class*="bg-white"]').all();
    expect(filteredProducts.length).toBeGreaterThan(0);
    
  });

  test('should navigate through pagination', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('h1:has-text("Produtos")');
    
    const hasPagination = await page.locator('nav[aria-label="Pagination"]').isVisible();
    
    if (hasPagination) {
      const firstPageProducts = await page.locator('.grid div[class*="bg-white"] h3').allTextContents();
      
      await page.click('button:has-text("Próximo")');
      
      await page.waitForTimeout(500);
      
      const secondPageProducts = await page.locator('.grid div[class*="bg-white"] h3').allTextContents();
      
      expect(firstPageProducts).not.toEqual(secondPageProducts);
    } else {
      test.skip();
    }
  });
}); 