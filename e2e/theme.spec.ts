import { test, expect } from './fixtures';

test.describe('Theme persistence', () => {
    test('toggling theme persists across reloads', async ({ page }) => {
        await page.goto('/');
        const initial = await page.evaluate(() =>
            window.localStorage.getItem('tradeLayersThemeMode'),
        );
        await page.getByTestId('theme-toggle').click();
        await page.waitForFunction(
            (prev) => window.localStorage.getItem('tradeLayersThemeMode') !== prev,
            initial,
        );
        const after = await page.evaluate(() =>
            window.localStorage.getItem('tradeLayersThemeMode'),
        );
        expect(after).not.toEqual(initial);

        await page.reload();
        const reloaded = await page.evaluate(() =>
            window.localStorage.getItem('tradeLayersThemeMode'),
        );
        expect(reloaded).toEqual(after);
    });

    test('theme defaults to dark on first visit', async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => window.localStorage.removeItem('tradeLayersThemeMode'));
        await page.reload();
        const mode = await page.evaluate(() => window.localStorage.getItem('tradeLayersThemeMode'));
        // First visit writes 'dark' on mount via effect
        expect(mode).toEqual('dark');
    });
});
