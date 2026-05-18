import { test, expect } from './fixtures';

test.describe('Authentication', () => {
    test('login page offers OAuth providers only', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByTestId('auth-provider-google')).toBeVisible();
        await expect(page.getByTestId('auth-provider-github')).toBeVisible();
        await expect(page.getByTestId('auth-provider-facebook')).toBeVisible();
        await expect(page.getByTestId('auth-provider-microsoft')).toBeVisible();
        await expect(page.getByTestId('auth-provider-apple')).toBeVisible();
        await expect(page.getByTestId('email-password-form')).toHaveCount(0);
    });

    test('user can log out', async ({ page, authedPage }) => {
        await authedPage;
        await expect(page.getByTestId('app-shell')).toBeVisible();
        await page.getByTestId('logout-button').click();
        await page.goto('/login');
        await expect(page.getByTestId('login-page')).toBeVisible();
    });
});
