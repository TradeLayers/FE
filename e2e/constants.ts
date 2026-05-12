export const EMULATOR_HOST = process.env.AUTH_EMULATOR_HOST ?? 'http://127.0.0.1:9099';
export const EMULATOR_PROJECT = 'app-local-8bfd8';
export const MOCK_API_PORT = parseInt(process.env.MOCK_API_PORT ?? '5174', 10);
export const MOCK_BASE = process.env.MOCK_API_BASE_URL ?? `http://localhost:${MOCK_API_PORT}`;
export const SEED_EMAIL = process.env.PLAYWRIGHT_TEST_EMAIL ?? 'e2e-user@tradelayers.test';
export const SEED_PASSWORD = process.env.PLAYWRIGHT_TEST_PASSWORD ?? 'Password!23';

export const THEME_STORAGE_KEY = 'tradeLayersThemeMode';
