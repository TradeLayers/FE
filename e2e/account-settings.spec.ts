import { test, expect } from './fixtures';

test.describe('Account settings', () => {
    test.fixme('user can update display name', async ({ page, authedPage }) => {
        await authedPage;
        await page.getByTestId('nav-account').click();
        await page.getByRole('tab', { name: /Account/i }).click();
        await page.getByTestId('settings-name').fill('Updated Name');
        await page.getByTestId('settings-save').click();
        await expect(page.getByTestId('info-snackbar')).toContainText(/saved|updated/i);
    });

    test.fixme('user can change password', async ({ page, authedPage }) => {
        await authedPage;
        await page.getByTestId('nav-account').click();
        await page.getByTestId('settings-current-password').fill('Password!23');
        await page.getByTestId('settings-new-password').fill('NewPassword!45');
        await page.getByTestId('settings-change-password').click();
        await expect(page.getByTestId('info-snackbar')).toContainText(/password/i);
    });
});
