import { test, expect } from './fixtures';
import { openAccountTab } from './helpers/account';

test('create a price alert', async ({ page, authedPage }) => {
    await authedPage;
    await page.getByTestId('nav-stocks').click();
    await page.getByTestId('stock-row-AAPL').click();
    await page.getByTestId('stock-detail-alert').click();

    await page.getByTestId('alert-direction-above').click();
    await page.getByTestId('alert-threshold').fill('999999');
    await page.getByTestId('alert-confirm').click();

    await expect(page.getByTestId('info-snackbar')).toContainText(/alert/i);

    await openAccountTab(page, 'alerts');
    await expect(page.getByTestId('alert-row').first()).toBeVisible();
});
