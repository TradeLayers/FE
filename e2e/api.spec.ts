import { test, expect } from '@playwright/test';

const MOCK_BASE = process.env.MOCK_API_BASE_URL ?? 'http://localhost:5174';
const SEED_EMAIL = process.env.PLAYWRIGHT_TEST_EMAIL ?? 'e2e-user@tradelayers.test';
const SEED_PASSWORD = process.env.PLAYWRIGHT_TEST_PASSWORD ?? 'Password!23';
const EMULATOR_HOST = 'http://127.0.0.1:9099';

const getEmulatorIdToken = async (): Promise<string> => {
    const r = await fetch(
        `${EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-key`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: SEED_EMAIL,
                password: SEED_PASSWORD,
                returnSecureToken: true,
            }),
        },
    );
    const body = (await r.json()) as { idToken: string };
    return body.idToken;
};

test.describe('Backend API contract', () => {
    test.beforeEach(async ({ request }) => {
        await request.post(`${MOCK_BASE}/__admin/reset`, { data: {} });
    });

    test('GET /api/stocks returns the seeded list', async ({ request }) => {
        const r = await request.get(`${MOCK_BASE}/api/stocks`);
        expect(r.status()).toBe(200);
        const body = (await r.json()) as { symbol: string }[];
        expect(body.map((s) => s.symbol)).toEqual(expect.arrayContaining(['AAPL', 'MSFT']));
    });

    test('GET /api/portfolio/holdings without auth returns 401', async ({ request }) => {
        const r = await request.get(`${MOCK_BASE}/api/portfolio/holdings`);
        expect(r.status()).toBe(401);
    });

    test('GET /api/portfolio/holdings with auth returns array', async ({ request }) => {
        const token = await getEmulatorIdToken();
        const r = await request.get(`${MOCK_BASE}/api/portfolio/holdings`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        expect(r.status()).toBe(200);
        expect(Array.isArray(await r.json())).toBe(true);
    });

    test('POST /api/portfolio/buy rejects when insufficient funds', async ({ request }) => {
        const token = await getEmulatorIdToken();
        await request.post(`${MOCK_BASE}/__admin/balance`, { data: { balance: 1 } });
        const r = await request.post(`${MOCK_BASE}/api/portfolio/buy`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { symbol: 'AAPL', quantity: 100 },
        });
        expect(r.status()).toBe(400);
        expect(await r.json()).toEqual({ error: expect.stringMatching(/insufficient/i) });
    });

    test('POST /api/alerts validates threshold', async ({ request }) => {
        const token = await getEmulatorIdToken();
        const r = await request.post(`${MOCK_BASE}/api/alerts`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { symbol: 'AAPL', direction: 'above', threshold: 0 },
        });
        expect(r.status()).toBe(400);
    });

    test('POST then DELETE /api/alerts/:id round-trips', async ({ request }) => {
        const token = await getEmulatorIdToken();
        const created = await request.post(`${MOCK_BASE}/api/alerts`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { symbol: 'AAPL', direction: 'above', threshold: 999 },
        });
        const alert = (await created.json()) as { id: string };
        const del = await request.delete(`${MOCK_BASE}/api/alerts/${alert.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        expect(del.status()).toBe(204);
    });
});
