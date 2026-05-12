import { test, expect } from './fixtures';
import { openAccountTab } from './helpers/account';

test.describe('Transaction history', () => {
    test('shows transactions in the table', async ({ page, authedPage, mockApi }) => {
        const txs = Array.from({ length: 5 }, (_, i) => ({
            id: `tx-${i + 1}`,
            type: i % 2 === 0 ? 'BUY' : 'SELL',
            symbol: 'AAPL',
            quantity: i + 1,
            price: 100 + i,
            total: (i + 1) * (100 + i),
            createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        }));
        await mockApi.seed('transactions', txs);
        await authedPage;
        await openAccountTab(page, 'transactions');
        await expect(page.getByText('AAPL').first()).toBeVisible();
    });

    test.fixme('table supports pagination', async ({ page, authedPage, mockApi }) => {
        // Requires data-testid on pagination controls in TransactionsTable.
        const txs = Array.from({ length: 30 }, (_, i) => ({
            id: `tx-${i + 1}`,
            type: 'BUY',
            symbol: 'AAPL',
            quantity: 1,
            price: 100,
            total: 100,
            createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        }));
        await mockApi.seed('transactions', txs);
        await authedPage;
        await openAccountTab(page, 'transactions');
        await page.getByTestId('transactions-next-page').click();
        await expect(page.getByTestId('transactions-page-indicator')).toContainText(/2/);
    });

    test.fixme('table supports sorting by column', async ({ page, authedPage, mockApi }) => {
        // Requires data-testid="tx-sort-{column}" on column headers.
        await mockApi.seed('transactions', [
            {
                id: 'a',
                type: 'BUY',
                symbol: 'AAPL',
                quantity: 1,
                price: 200,
                total: 200,
                createdAt: '2026-01-01T00:00:00Z',
            },
            {
                id: 'b',
                type: 'BUY',
                symbol: 'MSFT',
                quantity: 1,
                price: 100,
                total: 100,
                createdAt: '2026-02-01T00:00:00Z',
            },
        ]);
        await authedPage;
        await openAccountTab(page, 'transactions');
        await page.getByTestId('tx-sort-symbol').click();
        // Assert order
    });
});
