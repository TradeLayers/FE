import { test, expect } from './fixtures';

test.describe('Compare page', () => {
    test.fixme('user can add and remove tickers', async ({ page, authedPage }) => {
        // Requires data-testid="compare-add-symbol", "compare-symbol-input", "compare-remove-{SYMBOL}" in ComparePage.
        await authedPage;
        await page.getByTestId('nav-compare').click();
        await page.getByTestId('compare-symbol-input').fill('AAPL');
        await page.getByTestId('compare-add-symbol').click();
        await page.getByTestId('compare-symbol-input').fill('MSFT');
        await page.getByTestId('compare-add-symbol').click();
        await expect(page.getByTestId('compare-chip-AAPL')).toBeVisible();
        await expect(page.getByTestId('compare-chip-MSFT')).toBeVisible();
        await page.getByTestId('compare-remove-AAPL').click();
        await expect(page.getByTestId('compare-chip-AAPL')).toHaveCount(0);
    });
});
