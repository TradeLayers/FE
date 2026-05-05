import { test, expect } from './fixtures';

test.describe('Registration validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByTestId('register-toggle').click();
    });

    test('rejects weak password', async ({ page }) => {
        await page.getByTestId('login-email').fill(`new-${Date.now()}@tradelayers.test`);
        await page.getByTestId('login-password').fill('123');
        await page.getByTestId('register-confirm-password').fill('123');
        await page.getByTestId('register-submit').click();
        await expect(page.getByTestId('auth-error')).toContainText(/weak/i);
    });

    test('rejects invalid email format', async ({ page }) => {
        await page.getByTestId('login-email').fill('not-an-email');
        await page.getByTestId('login-password').fill('Password!23');
        await page.getByTestId('register-confirm-password').fill('Password!23');
        await page.getByTestId('register-submit').click();
        await expect(page.getByTestId('auth-error')).toContainText(/invalid email/i);
    });

    test('rejects duplicate email', async ({ page, auth }) => {
        // The seed user already exists from globalSetup — registering with the same email should fail
        await page.getByTestId('login-email').fill(auth.email);
        await page.getByTestId('login-password').fill('Password!23');
        await page.getByTestId('register-confirm-password').fill('Password!23');
        await page.getByTestId('register-submit').click();
        await expect(page.getByTestId('auth-error')).toContainText(/already in use/i);
    });

    test('rejects mismatched confirm password', async ({ page }) => {
        await page.getByTestId('login-email').fill(`new-${Date.now()}@tradelayers.test`);
        await page.getByTestId('login-password').fill('Password!23');
        await page.getByTestId('register-confirm-password').fill('different');
        await page.getByTestId('register-submit').click();
        await expect(page.getByTestId('auth-error')).toContainText(/do not match/i);
    });
});
