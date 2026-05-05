import { test, expect } from './fixtures';

test.describe('Stocks page states', () => {
    test('shows all stocks when search is empty', async ({ page }) => {
        await page.goto('/stocks');
        await expect(page.getByTestId('stock-row-AAPL')).toBeVisible();
        await expect(page.getByTestId('stock-row-MSFT')).toBeVisible();
    });

    test('shows empty state when no stocks match the search', async ({ page }) => {
        await page.goto('/stocks');
        await page.getByTestId('stocks-search').fill('ZZZNONEXISTENT');
        await expect(page.getByTestId('stock-row-AAPL')).toHaveCount(0);
    });

    test('handles backend error on stocks endpoint', async ({ page, mockApi }) => {
        await mockApi.setBehavior({ stocksError: true });
        await page.goto('/stocks');
        // App should still render — at minimum the search field, no rows
        await expect(page.getByTestId('stocks-search')).toBeVisible();
        await expect(page.getByTestId('stock-row-AAPL')).toHaveCount(0);
    });

    test('handles empty stocks list from backend', async ({ page, mockApi }) => {
        await mockApi.setBehavior({ emptyStocks: true });
        await page.goto('/stocks');
        await expect(page.getByTestId('stocks-search')).toBeVisible();
        await expect(page.getByTestId('stock-row-AAPL')).toHaveCount(0);
    });
});
