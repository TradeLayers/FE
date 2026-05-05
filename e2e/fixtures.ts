import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { MOCK_BASE, SEED_EMAIL, SEED_PASSWORD } from './constants';

type AuthFixture = { email: string; password: string };

export type MockApi = {
    reset: (overrides?: Record<string, unknown>) => Promise<void>;
    setBehavior: (behavior: Record<string, unknown>) => Promise<void>;
    seed: (
        kind: 'holdings' | 'alerts' | 'watchlist' | 'transactions' | 'notifications' | 'stocks',
        items: unknown[],
    ) => Promise<void>;
    setBalance: (balance: number) => Promise<void>;
    getState: () => Promise<Record<string, unknown>>;
};

type Fixtures = {
    auth: AuthFixture;
    mockApi: MockApi;
    authedPage: void;
};

const adminPost = async (
    request: APIRequestContext,
    path: string,
    body?: unknown,
): Promise<void> => {
    await request.post(`${MOCK_BASE}/__admin${path}`, { data: body ?? {} });
};

export const test = base.extend<Fixtures>({
    auth: async ({}, use) => {
        await use({ email: SEED_EMAIL, password: SEED_PASSWORD });
    },
    mockApi: async ({ request }, use) => {
        const api: MockApi = {
            reset: (overrides) => adminPost(request, '/reset', overrides ?? {}),
            setBehavior: (behavior) => adminPost(request, '/behavior', behavior),
            seed: (kind, items) => adminPost(request, `/seed/${kind}`, items),
            setBalance: (balance) => adminPost(request, '/balance', { balance }),
            getState: async () => {
                const r = await request.get(`${MOCK_BASE}/__admin/state`);
                return r.ok() ? ((await r.json()) as Record<string, unknown>) : {};
            },
        };
        await api.reset();
        await use(api);
    },
    authedPage: [
        async ({ page, auth }, use) => {
            await page.goto('/login');
            await page.getByTestId('login-email').fill(auth.email);
            await page.getByTestId('login-password').fill(auth.password);
            await page.getByTestId('login-submit').click();
            await expect(page.getByTestId('app-shell')).toBeVisible({ timeout: 20_000 });
            await use();
        },
        { auto: false },
    ],
});

export { expect };
