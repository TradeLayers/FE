import { test, expect } from './fixtures';

test('add and remove a watchlist symbol', async ({ page, authedPage }) => {
    await authedPage;
    await page.getByTestId('nav-stocks').click();
    await page.getByTestId('stock-row-MSFT').click();

    const watchButton = page.getByTestId('stock-detail-watch');
    await watchButton.click();
    await expect(watchButton).toContainText(/Watching/i);

    await page.getByTestId('nav-account').click();
    await page.getByRole('tab', { name: 'Watchlist' }).click();
    await expect(page.getByTestId('watchlist-row-MSFT')).toBeVisible();

    await page.getByTestId('watchlist-row-MSFT').getByTestId('watchlist-remove').click();
    await expect(page.getByTestId('watchlist-row-MSFT')).toHaveCount(0);
});
