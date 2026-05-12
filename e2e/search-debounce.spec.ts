import { test, expect } from './fixtures';

test('search filters rows as the user types', async ({ page }) => {
    await page.goto('/stocks');
    const search = page.getByTestId('stocks-search');
    await search.fill('AAPL');
    await expect(page.getByTestId('stock-row-AAPL')).toBeVisible();
    await expect(page.getByTestId('stock-row-MSFT')).toHaveCount(0);

    await search.fill('');
    await expect(page.getByTestId('stock-row-MSFT')).toBeVisible();
});

test.fixme('keyboard arrow navigation moves selection in results', async ({ page }) => {
    // Requires keyboard nav support in StocksPage results list.
    await page.goto('/stocks');
    await page.getByTestId('stocks-search').fill('A');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('stock-detail-symbol')).toBeVisible();
});
