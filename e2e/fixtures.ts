import { test as base, expect } from '@playwright/test';

type AuthFixture = {
    email: string;
    password: string;
};

type Fixtures = {
    auth: AuthFixture;
    authedPage: void;
};

const defaultEmail = process.env.PLAYWRIGHT_TEST_EMAIL ?? 'e2e-user@tradelayers.test';
const defaultPassword = process.env.PLAYWRIGHT_TEST_PASSWORD ?? 'Password!23';

export const test = base.extend<Fixtures>({
    auth: async ({}, use) => {
        await use({ email: defaultEmail, password: defaultPassword });
    },
    authedPage: [
        async ({ page, auth }, use) => {
            await page.goto('/login');
            await page.getByTestId('login-email').fill(auth.email);
            await page.getByTestId('login-password').fill(auth.password);
            await page.getByTestId('login-submit').click();
            await expect(page.getByTestId('app-shell')).toBeVisible({ timeout: 15_000 });
            await use();
        },
        { auto: false },
    ],
});

export { expect };
