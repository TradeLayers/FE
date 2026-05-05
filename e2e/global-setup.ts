import { startMockServer } from './mock-server';
import {
    EMULATOR_HOST,
    EMULATOR_PROJECT,
    MOCK_API_PORT,
    SEED_EMAIL,
    SEED_PASSWORD,
} from './constants';

const waitFor = async (url: string, timeoutMs = 30_000): Promise<void> => {
    const start = Date.now();
    let lastError: unknown;
    let delay = 250;
    while (Date.now() - start < timeoutMs) {
        try {
            const r = await fetch(url);
            if (r.ok) return;
            lastError = new Error(`HTTP ${r.status}`);
        } catch (e) {
            lastError = e;
        }
        await new Promise((r) => setTimeout(r, delay));
        delay = Math.min(delay * 2, 2000);
    }
    throw new Error(`Timed out waiting for ${url}: ${String(lastError)}`);
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

    const server = await startMockServer(MOCK_API_PORT);
    return async (): Promise<void> => {
        await new Promise<void>((resolve) => server.close(() => resolve()));
    };
}

export default globalSetup;
