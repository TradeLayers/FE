import { test, expect } from './fixtures';

test('user can request a password reset email', async ({ page, auth }) => {
    await page.goto('/login');
    await page.getByTestId('forgot-password-link').click();
    await page.getByTestId('reset-email').fill(auth.email);
    await page.getByTestId('reset-submit').click();
    await expect(page.getByTestId('auth-success')).toContainText(/reset email sent/i);
});
