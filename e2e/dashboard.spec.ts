import { test, expect } from './fixtures';

test('home page renders without errors', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('app-shell')).toBeVisible();
});

test.fixme('home dashboard shows market overview widgets', async ({ page }) => {
    // Requires data-testid="home-gainers", "home-losers" on HomePage widgets.
    await page.goto('/');
    await expect(page.getByTestId('home-gainers')).toBeVisible();
    await expect(page.getByTestId('home-losers')).toBeVisible();
});

test.fixme('portfolio overview reflects latest trade on dashboard', async ({
    page,
    authedPage,
}) => {
    // Requires data-testid="home-portfolio-overview" on HomePage.
    await authedPage;
    await page.getByTestId('nav-stocks').click();
    await page.getByTestId('stock-row-AAPL').click();
    await page.getByTestId('stock-detail-buy').click();
    await page.getByTestId('trade-quantity').fill('1');
    await page.getByTestId('trade-confirm').click();

    await page.goto('/');
    await expect(page.getByTestId('home-portfolio-overview')).toContainText(/AAPL/);
});
