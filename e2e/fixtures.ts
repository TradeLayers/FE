import { test as base, expect, type APIRequestContext, type Page } from '@playwright/test';
import { MOCK_BASE } from './constants';

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

const signInWithGoogleEmulator = async (page: Page): Promise<void> => {
    const oauthEmail = `e2e-oauth-${Date.now()}-${Math.random().toString(16).slice(2)}@tradelayers.test`;
    const popupPromise = page.waitForEvent('popup');

    await page.goto('/login');
    await page.getByTestId('auth-provider-google').click();

    const popup = await popupPromise;
    await popup.locator('#add-account-button button').click();
    await popup.locator('#email-input').fill(oauthEmail);
    await popup.locator('#display-name-input').fill('E2E User');
    const popupClosed = popup.waitForEvent('close', { timeout: 10_000 }).catch(() => undefined);
    await popup.locator('#sign-in').click();
    await popupClosed;
};

export const test = base.extend<Fixtures>({
    mockApi: [
        async ({ request }, use) => {
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
        // auto: every spec gets a fresh mock state, even ones that don't
        // destructure mockApi — otherwise state leaks between tests.
        { auto: true },
    ],
    authedPage: [
        async ({ page }, use) => {
            await signInWithGoogleEmulator(page);
            await expect(page.getByTestId('app-shell')).toBeVisible({ timeout: 20_000 });
            await use();
        },
        { auto: false },
    ],
});

export { expect };
