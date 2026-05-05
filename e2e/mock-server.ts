import { createServer, type IncomingMessage, type ServerResponse, type Server } from 'http';

export type MockTransaction = {
    id: string;
    type: 'BUY' | 'SELL';
    symbol: string;
    quantity: number;
    price: number;
    total: number;
    createdAt: string;
};

export type MockHolding = {
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    marketValue: number;
    unrealizedPnl: number;
    realizedPnl: number;
};

export type MockAlert = {
    id: string;
    symbol: string;
    direction: 'above' | 'below';
    threshold: number;
    triggeredAt: string | null;
    createdAt: string;
};

export type MockWatchlist = { symbol: string; threshold: number | null };

export type MockStock = {
    symbol: string;
    name: string;
    exchange: string;
    industry: string;
    country: string;
    marketCap: number;
    logo: string;
    price: number;
};

export type MockState = {
    user: { id: string; firebaseId: string; name: string; email: string; balance: number };
    stocks: MockStock[];
    holdings: MockHolding[];
    transactions: MockTransaction[];
    alerts: MockAlert[];
    watchlist: MockWatchlist[];
    notifications: { id: string; message: string; readAt: string | null }[];
    failNext: Record<string, number>;
    behavior: {
        rejectBuy?: 'INSUFFICIENT_FUNDS' | null;
        rejectSell?: 'INSUFFICIENT_QUANTITY' | null;
        stocksError?: boolean;
        emptyStocks?: boolean;
    };
};

export const defaultState = (): MockState => ({
    user: {
        id: 'mock-user',
        firebaseId: 'e2e-uid',
        name: 'E2E User',
        email: 'e2e-user@tradelayers.test',
        balance: 10_000,
    },
    stocks: [
        {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            exchange: 'NASDAQ',
            industry: 'Technology',
            country: 'US',
            marketCap: 3_000_000_000_000,
            logo: 'https://logo.clearbit.com/apple.com',
            price: 200,
        },
        {
            symbol: 'MSFT',
            name: 'Microsoft Corporation',
            exchange: 'NASDAQ',
            industry: 'Technology',
            country: 'US',
            marketCap: 3_100_000_000_000,
            logo: 'https://logo.clearbit.com/microsoft.com',
            price: 420,
        },
        {
            symbol: 'GOOGL',
            name: 'Alphabet Inc.',
            exchange: 'NASDAQ',
            industry: 'Technology',
            country: 'US',
            marketCap: 2_100_000_000_000,
            logo: 'https://logo.clearbit.com/google.com',
            price: 175,
        },
    ],
    holdings: [],
    transactions: [],
    alerts: [],
    watchlist: [],
    notifications: [],
    failNext: {},
    behavior: {},
});

let state: MockState = defaultState();

export const getState = (): MockState => state;
export const resetState = (overrides?: Partial<MockState>): void => {
    state = { ...defaultState(), ...overrides };
};

const json = (res: ServerResponse, status: number, body: unknown): void => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.end(JSON.stringify(body));
};

const text = (
    res: ServerResponse,
    status: number,
    body: string,
    contentType = 'text/plain',
): void => {
    res.statusCode = status;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(body);
};

const readBody = (req: IncomingMessage): Promise<string> =>
    new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (c) => (data += c));
        req.on('end', () => resolve(data));
        req.on('error', reject);
    });

const recomputeHolding = (symbol: string): void => {
    const buys = state.transactions.filter((t) => t.symbol === symbol && t.type === 'BUY');
    const sells = state.transactions.filter((t) => t.symbol === symbol && t.type === 'SELL');
    const buyQty = buys.reduce((a, t) => a + t.quantity, 0);
    const sellQty = sells.reduce((a, t) => a + t.quantity, 0);
    const remaining = buyQty - sellQty;
    const buyTotal = buys.reduce((a, t) => a + t.quantity * t.price, 0);
    const avg = buyQty === 0 ? 0 : buyTotal / buyQty;

    let realized = 0;
    for (const sell of sells) {
        realized += (sell.price - avg) * sell.quantity;
    }

    const stock = state.stocks.find((s) => s.symbol === symbol);
    const currentPrice = stock?.price ?? 0;
    const marketValue = remaining * currentPrice;
    const unrealizedPnl = remaining * (currentPrice - avg);

    const idx = state.holdings.findIndex((h) => h.symbol === symbol);
    if (remaining <= 0) {
        if (idx >= 0) state.holdings.splice(idx, 1);
        return;
    }
    const updated: MockHolding = {
        symbol,
        quantity: remaining,
        averagePrice: avg,
        currentPrice,
        marketValue,
        unrealizedPnl,
        realizedPnl: realized,
    };
    if (idx >= 0) state.holdings[idx] = updated;
    else state.holdings.push(updated);
};

const requireAuth = (req: IncomingMessage, res: ServerResponse): boolean => {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
        json(res, 401, { error: 'unauthorized' });
        return false;
    }
    return true;
};

const route = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        return res.end();
    }

    const url = new URL(req.url ?? '/', 'http://localhost');
    const rawPath = url.pathname;
    const path = rawPath.replace(/^\/api/, '');
    const method = req.method ?? 'GET';

    // Admin (test-only) endpoints used by Playwright fixtures
    if (rawPath.startsWith('/__admin')) {
        const subpath = rawPath.replace('/__admin', '');
        if (subpath === '/reset' && method === 'POST') {
            const body = JSON.parse((await readBody(req)) || '{}') as Partial<MockState>;
            resetState(body);
            return json(res, 200, { ok: true });
        }
        if (subpath === '/state' && method === 'GET') return json(res, 200, state);
        if (subpath === '/behavior' && method === 'POST') {
            const body = JSON.parse((await readBody(req)) || '{}') as MockState['behavior'];
            state.behavior = { ...state.behavior, ...body };
            return json(res, 200, state.behavior);
        }
        if (subpath === '/balance' && method === 'POST') {
            const body = JSON.parse((await readBody(req)) || '{}') as { balance: number };
            state.user.balance = body.balance;
            return json(res, 200, state.user);
        }
        if (subpath.startsWith('/seed/') && method === 'POST') {
            const kind = subpath.split('/')[2] as keyof MockState;
            const body = JSON.parse((await readBody(req)) || '[]') as unknown[];
            (state as unknown as Record<string, unknown>)[kind] = body;
            return json(res, 200, { ok: true });
        }
        return json(res, 404, { error: 'unknown admin route' });
    }

    // Public endpoints
    if (path === '/stocks' && method === 'GET') {
        if (state.behavior.stocksError) return json(res, 500, { error: 'upstream unavailable' });
        if (state.behavior.emptyStocks) return json(res, 200, []);
        return json(res, 200, state.stocks);
    }

    if (path.startsWith('/stocks/profile/') && method === 'GET') {
        const symbol = path.split('/').pop() ?? '';
        const stock = state.stocks.find((s) => s.symbol === symbol);
        if (!stock) return json(res, 404, { error: 'not found' });
        return json(res, 200, stock);
    }

    if (path === '/stocks/search' && method === 'GET') {
        const q = (url.searchParams.get('q') ?? '').toUpperCase();
        const matches = state.stocks
            .filter((s) => s.symbol.includes(q) || s.name.toUpperCase().includes(q))
            .map((s) => ({ symbol: s.symbol, name: s.name, exchange: s.exchange }));
        return json(res, 200, matches);
    }

    if (path === '/stocks/quotes' && method === 'POST') {
        const body = JSON.parse((await readBody(req)) || '{}') as { symbols?: string[] };
        const out = (body.symbols ?? []).map((s) => {
            const stock = state.stocks.find((x) => x.symbol === s);
            return { symbol: s, price: stock?.price ?? 0 };
        });
        return json(res, 200, out);
    }

    if (path === '/stocks/candles' && method === 'GET') {
        const symbol = url.searchParams.get('symbol') ?? 'AAPL';
        const resolution = url.searchParams.get('resolution') ?? 'D';
        const stock = state.stocks.find((s) => s.symbol === symbol);
        const base = stock?.price ?? 100;
        const points =
            resolution === '60' ? 24 : resolution === 'D' ? 30 : resolution === 'W' ? 52 : 60;
        const now = Math.floor(Date.now() / 1000);
        const step =
            resolution === '60'
                ? 3600
                : resolution === 'D'
                  ? 86400
                  : resolution === 'W'
                    ? 604800
                    : 2592000;
        const c = Array.from({ length: points }, (_, i) => base + Math.sin(i / 3) * 5 + i * 0.1);
        const t = Array.from({ length: points }, (_, i) => now - (points - i) * step);
        return json(res, 200, { c, t, h: c, l: c, o: c, s: 'ok', v: c.map(() => 1000) });
    }

    // Authed endpoints
    if (!requireAuth(req, res)) return;

    if (path === '/user' && method === 'POST') return json(res, 200, state.user);
    if (path === '/user' && method === 'PATCH') {
        const body = JSON.parse((await readBody(req)) || '{}') as { name?: string; email?: string };
        if (body.name !== undefined) state.user.name = body.name;
        if (body.email !== undefined) state.user.email = body.email;
        return json(res, 200, state.user);
    }
    if (path === '/user' && method === 'DELETE') {
        resetState();
        return json(res, 204, {});
    }

    if (path === '/portfolio/holdings' && method === 'GET') return json(res, 200, state.holdings);

    if (path === '/portfolio/transactions' && method === 'GET') {
        const page = parseInt(url.searchParams.get('page') ?? '0', 10);
        const size = parseInt(url.searchParams.get('size') ?? '20', 10);
        const sort = url.searchParams.get('sort') ?? 'createdAt:desc';
        const all = [...state.transactions];
        all.sort((a, b) => {
            const [field, dir] = sort.split(':');
            const av = (a as unknown as Record<string, unknown>)[field];
            const bv = (b as unknown as Record<string, unknown>)[field];
            const cmp = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0;
            return dir === 'asc' ? cmp : -cmp;
        });
        const start = page * size;
        return json(res, 200, {
            items: all.slice(start, start + size),
            total: all.length,
            page,
            size,
        });
    }

    if (path === '/portfolio/transactions.csv' && method === 'GET') {
        const header = 'date,type,symbol,quantity,price,total';
        const rows = state.transactions.map(
            (t) => `${t.createdAt},${t.type},${t.symbol},${t.quantity},${t.price},${t.total}`,
        );
        const body = [header, ...rows].join('\n');
        res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
        return text(res, 200, body, 'text/csv');
    }

    if (path === '/portfolio/history' && method === 'GET') {
        const interval = url.searchParams.get('interval') ?? '1M';
        const points =
            interval === '1D' ? 24 : interval === '1W' ? 7 : interval === '1M' ? 30 : 365;
        const now = Date.now();
        const data = Array.from({ length: points }, (_, i) => ({
            timestamp: new Date(now - (points - i) * 86400000).toISOString(),
            value: 10000 + Math.sin(i / 4) * 500,
        }));
        return json(res, 200, data);
    }

    if (path === '/portfolio/buy' && method === 'POST') {
        const body = JSON.parse((await readBody(req)) || '{}') as {
            symbol: string;
            quantity: number;
        };
        if (state.behavior.rejectBuy === 'INSUFFICIENT_FUNDS') {
            return json(res, 400, { error: 'Insufficient funds' });
        }
        const stock = state.stocks.find((s) => s.symbol === body.symbol);
        if (!stock) return json(res, 404, { error: 'Symbol not found' });
        const total = stock.price * body.quantity;
        if (total > state.user.balance) return json(res, 400, { error: 'Insufficient funds' });
        state.user.balance -= total;
        const tx: MockTransaction = {
            id: `tx-${state.transactions.length + 1}`,
            type: 'BUY',
            symbol: body.symbol,
            quantity: body.quantity,
            price: stock.price,
            total,
            createdAt: new Date().toISOString(),
        };
        state.transactions.push(tx);
        recomputeHolding(body.symbol);
        return json(res, 200, tx);
    }

    if (path === '/portfolio/sell' && method === 'POST') {
        const body = JSON.parse((await readBody(req)) || '{}') as {
            symbol: string;
            quantity: number;
        };
        if (state.behavior.rejectSell === 'INSUFFICIENT_QUANTITY') {
            return json(res, 400, { error: 'Not enough shares to sell' });
        }
        const holding = state.holdings.find((h) => h.symbol === body.symbol);
        if (!holding || holding.quantity < body.quantity) {
            return json(res, 400, { error: 'Not enough shares to sell' });
        }
        const stock = state.stocks.find((s) => s.symbol === body.symbol);
        if (!stock) return json(res, 404, { error: 'Symbol not found' });
        const total = stock.price * body.quantity;
        state.user.balance += total;
        const tx: MockTransaction = {
            id: `tx-${state.transactions.length + 1}`,
            type: 'SELL',
            symbol: body.symbol,
            quantity: body.quantity,
            price: stock.price,
            total,
            createdAt: new Date().toISOString(),
        };
        state.transactions.push(tx);
        recomputeHolding(body.symbol);
        return json(res, 200, tx);
    }

    if (path === '/alerts' && method === 'GET') return json(res, 200, state.alerts);
    if (path === '/alerts' && method === 'POST') {
        const body = JSON.parse((await readBody(req)) || '{}') as Partial<MockAlert>;
        if (!body.symbol || !body.direction || !body.threshold || body.threshold <= 0) {
            return json(res, 400, { error: 'Invalid alert' });
        }
        const alert: MockAlert = {
            id: `alert-${state.alerts.length + 1}`,
            symbol: body.symbol,
            direction: body.direction,
            threshold: body.threshold,
            triggeredAt: null,
            createdAt: new Date().toISOString(),
        };
        state.alerts.push(alert);
        return json(res, 201, alert);
    }
    if (path.startsWith('/alerts/') && method === 'DELETE') {
        const id = path.split('/').pop();
        state.alerts = state.alerts.filter((a) => a.id !== id);
        return json(res, 204, {});
    }
    if (path.startsWith('/alerts/') && method === 'PATCH') {
        const id = path.split('/').pop();
        const body = JSON.parse((await readBody(req)) || '{}') as Partial<MockAlert>;
        const idx = state.alerts.findIndex((a) => a.id === id);
        if (idx < 0) return json(res, 404, { error: 'not found' });
        state.alerts[idx] = { ...state.alerts[idx], ...body };
        return json(res, 200, state.alerts[idx]);
    }

    if (path === '/watchlist' && method === 'GET') return json(res, 200, state.watchlist);
    if (path === '/watchlist' && method === 'POST') {
        const body = JSON.parse((await readBody(req)) || '{}') as { symbol: string };
        if (!state.watchlist.find((w) => w.symbol === body.symbol)) {
            state.watchlist.push({ symbol: body.symbol, threshold: null });
        }
        return json(res, 201, { symbol: body.symbol });
    }
    if (path.startsWith('/watchlist/') && path.endsWith('/threshold') && method === 'PATCH') {
        const symbol = path.split('/')[2];
        const body = JSON.parse((await readBody(req)) || '{}') as { threshold: number | null };
        const item = state.watchlist.find((w) => w.symbol === symbol);
        if (item) item.threshold = body.threshold;
        return json(res, 200, item ?? null);
    }
    if (path.startsWith('/watchlist/') && method === 'DELETE') {
        const symbol = path.split('/').pop();
        state.watchlist = state.watchlist.filter((w) => w.symbol !== symbol);
        return json(res, 204, {});
    }

    if (path === '/notifications/unread' && method === 'GET') {
        return json(
            res,
            200,
            state.notifications.filter((n) => n.readAt === null),
        );
    }
    if (path.startsWith('/notifications/') && path.endsWith('/read') && method === 'PATCH') {
        const id = path.split('/')[2];
        const n = state.notifications.find((x) => x.id === id);
        if (n) n.readAt = new Date().toISOString();
        return json(res, 200, n ?? null);
    }

    json(res, 404, { error: `not mocked: ${method} ${path}` });
};

export const startMockServer = async (port = 5174): Promise<Server> => {
    const server = createServer((req, res) => {
        route(req, res).catch((err) => {
            console.error('mock server error', err);
            json(res, 500, { error: String(err) });
        });
    });
    await new Promise<void>((resolve) => server.listen(port, resolve));
    return server;
};
