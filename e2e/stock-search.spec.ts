import { test, expect } from './fixtures';

test('search and view stock detail with chart', async ({ page, authedPage }) => {
    await authedPage;
    await page.getByTestId('nav-stocks').click();
    const search = page.getByTestId('stocks-search');
    await search.fill('AAPL');
    await page.getByTestId('stock-row-AAPL').click();
    await expect(page.getByTestId('stock-detail-symbol')).toContainText('AAPL');
    await expect(page.getByTestId('stock-price-chart')).toBeVisible();
});
