import { test, expect } from './fixtures';

test.describe('Authentication', () => {
    test('user can log in and log out', async ({ page, auth, authedPage }) => {
        await authedPage;
        await expect(page.getByTestId('app-shell')).toBeVisible();
        await page.getByTestId('logout-button').click();
        // After logout the app navigates home; head to /login to re-auth.
        await page.goto('/login');
        await expect(page.getByTestId('login-email')).toBeVisible();
        await page.getByTestId('login-email').fill(auth.email);
        await page.getByTestId('login-password').fill(auth.password);
        await page.getByTestId('login-submit').click();
        await expect(page.getByTestId('app-shell')).toBeVisible();
    });
});
