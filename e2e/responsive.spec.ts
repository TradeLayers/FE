import { test, expect } from './fixtures';

test.describe('Responsive smoke', () => {
    test('home renders on configured viewport', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByTestId('app-shell')).toBeVisible();
    });

    test('stocks list renders on configured viewport', async ({ page }) => {
        await page.goto('/stocks');
        await expect(page.getByTestId('stocks-search')).toBeVisible();
    });

    test('login renders on configured viewport', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByTestId('login-page')).toBeVisible();
    });
});
