import { test, expect } from './fixtures';

test.describe('Auth-protected route guards', () => {
    test('unauthenticated /account redirects to /login', async ({ page }) => {
        await page.goto('/account');
        await expect(page).toHaveURL(/\/login/);
        await expect(page.getByTestId('login-page')).toBeVisible();
    });

    test('unauthenticated /compare redirects to /login', async ({ page }) => {
        await page.goto('/compare');
        await expect(page).toHaveURL(/\/login/);
    });

    test('public /stocks remains accessible without auth', async ({ page }) => {
        await page.goto('/stocks');
        await expect(page).toHaveURL(/\/stocks/);
    });
});
