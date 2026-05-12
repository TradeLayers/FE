import { test, expect } from './fixtures';
import { THEME_STORAGE_KEY } from './constants';

const readMode = (page: import('@playwright/test').Page): Promise<string | null> =>
    page.evaluate((key) => window.localStorage.getItem(key), THEME_STORAGE_KEY);

test.describe('Theme persistence', () => {
    test('toggling theme persists across reloads', async ({ page }) => {
        await page.goto('/');
        const initial = await readMode(page);
        await page.getByTestId('theme-toggle').click();
        await page.waitForFunction(({ key, prev }) => window.localStorage.getItem(key) !== prev, {
            key: THEME_STORAGE_KEY,
            prev: initial,
        });
        const after = await readMode(page);
        expect(after).not.toEqual(initial);

        await page.reload();
        expect(await readMode(page)).toEqual(after);
    });

    test('theme defaults to dark on first visit', async ({ page }) => {
        await page.goto('/');
        await page.evaluate((key) => window.localStorage.removeItem(key), THEME_STORAGE_KEY);
        await page.reload();
        expect(await readMode(page)).toEqual('dark');
    });
});
