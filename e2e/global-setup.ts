import { startMockServer } from './mock-server';

const EMULATOR_HOST = 'http://127.0.0.1:9099';
const EMULATOR_PROJECT = 'app-local-8bfd8';
const SEED_EMAIL = process.env.PLAYWRIGHT_TEST_EMAIL ?? 'e2e-user@tradelayers.test';
const SEED_PASSWORD = process.env.PLAYWRIGHT_TEST_PASSWORD ?? 'Password!23';

const waitFor = async (url: string, timeoutMs = 30_000): Promise<void> => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            const r = await fetch(url);
            if (r.ok) return;
        } catch {
            /* retry */
        }
        await new Promise((r) => setTimeout(r, 500));
    }
    throw new Error(`Timed out waiting for ${url}`);
};

const seedEmulatorUser = async (): Promise<void> => {
    // Wipe all users first so each run is deterministic
    await fetch(`${EMULATOR_HOST}/emulator/v1/projects/${EMULATOR_PROJECT}/accounts`, {
        method: 'DELETE',
    }).catch(() => undefined);

    await fetch(`${EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: SEED_EMAIL,
            password: SEED_PASSWORD,
            returnSecureToken: true,
        }),
    });
};

async function globalSetup(): Promise<() => Promise<void>> {
    await waitFor(`${EMULATOR_HOST}/emulator/v1/projects/${EMULATOR_PROJECT}/config`);
    await seedEmulatorUser();

    const port = parseInt(process.env.MOCK_API_PORT ?? '5174', 10);
    const server = await startMockServer(port);
    return async (): Promise<void> => {
        await new Promise<void>((resolve) => server.close(() => resolve()));
    };
}

export default globalSetup;
