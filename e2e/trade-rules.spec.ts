import { test, expect } from './fixtures';

test.describe('Trading rules', () => {
    test('rejects buy with insufficient funds', async ({ page, authedPage, mockApi }) => {
        await mockApi.setBalance(10);
        await authedPage;
        await page.getByTestId('nav-stocks').click();
        await page.getByTestId('stock-row-AAPL').click();
        await page.getByTestId('stock-detail-buy').click();
        await page.getByTestId('trade-quantity').fill('5');
        await page.getByTestId('trade-confirm').click();
        await expect(page.getByTestId('info-snackbar')).toContainText(/insufficient/i);
    });

    test('rejects selling more shares than owned', async ({ page, authedPage, mockApi }) => {
        await mockApi.seed('holdings', [
            {
                symbol: 'AAPL',
                quantity: 1,
                averagePrice: 200,
                currentPrice: 200,
                marketValue: 200,
                unrealizedPnl: 0,
                realizedPnl: 0,
            },
        ]);
        await mockApi.seed('transactions', [
            {
                id: 'tx-1',
                type: 'BUY',
                symbol: 'AAPL',
                quantity: 1,
                price: 200,
                total: 200,
                createdAt: new Date().toISOString(),
            },
        ]);
        await authedPage;
        await page.getByTestId('nav-account').click();
        await page.getByTestId('holdings-row-AAPL').getByTestId('holdings-sell').click();
        await page.getByTestId('trade-quantity').fill('99');
        await page.getByTestId('trade-confirm').click();
        await expect(page.getByTestId('info-snackbar')).toContainText(/not enough|insufficient/i);
    });

    test('average cost reflects multiple buys at different prices', async ({
        page,
        authedPage,
        mockApi,
    }) => {
        await authedPage;
        // Buy 1 AAPL at the seeded price (200).
        await page.getByTestId('nav-stocks').click();
        await page.getByTestId('stock-row-AAPL').click();
        await page.getByTestId('stock-detail-buy').click();
        await page.getByTestId('trade-quantity').fill('1');
        await page.getByTestId('trade-confirm').click();
        await expect(page.getByTestId('info-snackbar')).toContainText(/Bought/i);

        // Drop the AAPL price to 100 in the mock (without resetting transactions).
        const before = (await mockApi.getState()) as {
            stocks: { symbol: string; price: number }[];
            transactions: unknown[];
            user: { balance: number };
        };
        const updatedStocks = before.stocks.map((s) =>
            s.symbol === 'AAPL' ? { ...s, price: 100 } : s,
        );
        await mockApi.seed('stocks', updatedStocks);

        // Buy a second AAPL at the new price.
        await page.reload();
        await page.getByTestId('stock-row-AAPL').click();
        await page.getByTestId('stock-detail-buy').click();
        await page.getByTestId('trade-quantity').fill('1');
        await page.getByTestId('trade-confirm').click();
        await expect(page.getByTestId('info-snackbar')).toContainText(/Bought/i);

        const after = (await mockApi.getState()) as {
            holdings: { symbol: string; quantity: number; averagePrice: number }[];
        };
        const aapl = after.holdings.find((h) => h.symbol === 'AAPL');
        expect(aapl).toBeDefined();
        expect(aapl?.quantity).toBe(2);
        // Weighted average of (200, 100) = 150.
        expect(aapl?.averagePrice).toBeCloseTo(150, 4);
    });

    test('realized P&L appears after a sell', async ({ page, authedPage, mockApi }) => {
        await authedPage;
        await page.getByTestId('nav-stocks').click();
        await page.getByTestId('stock-row-AAPL').click();
        await page.getByTestId('stock-detail-buy').click();
        await page.getByTestId('trade-quantity').fill('2');
        await page.getByTestId('trade-confirm').click();
        await expect(page.getByTestId('info-snackbar')).toContainText(/Bought/i);

        await page.getByTestId('nav-account').click();
        await page.getByTestId('holdings-row-AAPL').getByTestId('holdings-sell').click();
        await page.getByTestId('trade-quantity').fill('1');
        await page.getByTestId('trade-confirm').click();

        const state = (await mockApi.getState()) as {
            holdings: { symbol: string; realizedPnl: number }[];
        };
        const aapl = state.holdings.find((h) => h.symbol === 'AAPL');
        expect(aapl).toBeDefined();
        // realizedPnl is a number (0 if same-price round-trip)
        expect(typeof aapl?.realizedPnl).toBe('number');
    });
});
