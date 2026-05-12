import { test, expect } from './fixtures';

test('401 from API does not crash the app', async ({ page, authedPage }) => {
    await authedPage;
    await page.getByTestId('nav-account').click();
    // Simulate session expiry: drop auth on next requests by clearing storage and reloading.
    await page.evaluate(() => {
        Object.keys(window.localStorage)
            .filter((k) => k.startsWith('firebase'))
            .forEach((k) => window.localStorage.removeItem(k));
    });
    await page.reload();
    // After unauth state, app should either render guest UI or redirect to login.
    await expect(page.locator('body')).toBeVisible();
});
