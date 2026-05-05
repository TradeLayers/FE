import { test, expect } from './fixtures';

test.describe('Visual regression', () => {
    test('login page matches baseline', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByTestId('login-page')).toBeVisible();
        await expect(page).toHaveScreenshot('login.png', { fullPage: true });
    });

    test('stocks list matches baseline', async ({ page }) => {
        await page.goto('/stocks');
        await expect(page.getByTestId('stocks-search')).toBeVisible();
        await expect(page).toHaveScreenshot('stocks.png', { fullPage: true });
    });

    test('stock detail matches baseline', async ({ page }) => {
        await page.goto('/stocks');
        await page.getByTestId('stock-row-AAPL').click();
        await expect(page.getByTestId('stock-detail-symbol')).toBeVisible();
        await expect(page).toHaveScreenshot('stock-detail.png', { fullPage: true });
    });

    test('account/portfolio matches baseline', async ({ page, authedPage }) => {
        await authedPage;
        await page.getByTestId('nav-account').click();
        await expect(page).toHaveScreenshot('account.png', { fullPage: true });
    });
});
