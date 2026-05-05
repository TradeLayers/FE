import type { Page } from '@playwright/test';

const TAB_NAMES = {
    holdings: 'Holdings',
    transactions: 'Transaction History',
    watchlist: 'Watchlist',
    alerts: 'Alerts',
    account: 'Account',
} as const;

export type AccountTab = keyof typeof TAB_NAMES;

export const openAccountTab = async (page: Page, tab: AccountTab): Promise<void> => {
    await page.getByTestId('nav-account').click();
    await page.waitForURL(/\/account/);
    // Wait for at least one tab to render (proves AccountPage mounted), then click.
    await page.getByRole('tab').first().waitFor({ state: 'visible' });
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await page.getByRole('tab', { name: TAB_NAMES[tab] }).click();
};
