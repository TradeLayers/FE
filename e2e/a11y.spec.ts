import { test } from './fixtures';
import { expectNoSeriousA11yViolations } from './helpers/axe';

test('login page has no serious a11y violations', async ({ page }) => {
    await page.goto('/login');
    await expectNoSeriousA11yViolations(page, 'login');
});

test('stocks list page has no serious a11y violations', async ({ page }) => {
    await page.goto('/stocks');
    await expectNoSeriousA11yViolations(page, 'stocks');
});

test('stock detail page has no serious a11y violations', async ({ page }) => {
    await page.goto('/stocks');
    await page.getByTestId('stock-row-AAPL').click();
    await expectNoSeriousA11yViolations(page, 'stock-detail');
});

test('account/portfolio page has no serious a11y violations', async ({ page, authedPage }) => {
    await authedPage;
    await page.getByTestId('nav-account').click();
    await expectNoSeriousA11yViolations(page, 'account');
});
