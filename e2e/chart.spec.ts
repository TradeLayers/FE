import { test, expect } from './fixtures';

test.describe('Stock price chart', () => {
    test('chart renders for the selected stock', async ({ page, authedPage }) => {
        await authedPage;
        await page.getByTestId('nav-stocks').click();
        await page.getByTestId('stock-row-AAPL').click();
        await expect(page.getByTestId('stock-price-chart')).toBeVisible();
    });

    test.fixme('switching timeframe re-renders chart with new resolution', async ({
        page,
        authedPage,
    }) => {
        // Requires data-testid="chart-tf-1D|1W|1M|1Y" on toggle buttons in StockPriceChart.
        await authedPage;
        await page.getByTestId('nav-stocks').click();
        await page.getByTestId('stock-row-AAPL').click();
        await page.getByTestId('chart-tf-1W').click();
        await expect(page.getByTestId('stock-price-chart')).toBeVisible();
        await page.getByTestId('chart-tf-1M').click();
        await expect(page.getByTestId('stock-price-chart')).toBeVisible();
    });
});
