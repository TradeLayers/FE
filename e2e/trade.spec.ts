import { test, expect } from './fixtures';

test('buy and sell flow updates portfolio', async ({ page, authedPage }) => {
    await authedPage;
    await page.getByTestId('nav-stocks').click();
    await page.getByTestId('stock-row-AAPL').click();
    await page.getByTestId('stock-detail-buy').click();

    await page.getByTestId('trade-quantity').fill('1');
    await page.getByTestId('trade-confirm').click();
    await expect(page.getByTestId('info-snackbar')).toContainText(/Bought/i);

    await page.getByTestId('nav-account').click();
    await expect(page.getByTestId('holdings-row-AAPL')).toBeVisible();
    await page.getByTestId('holdings-row-AAPL').getByTestId('holdings-sell').click();
    await page.getByTestId('trade-quantity').fill('1');
    await page.getByTestId('trade-confirm').click();
    await expect(page.getByTestId('info-snackbar')).toContainText(/Sold/i);
});
