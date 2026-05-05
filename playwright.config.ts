import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173';
const MOCK_API_PORT = process.env.MOCK_API_PORT ?? '5174';
const VITE_API_URL = `http://localhost:${MOCK_API_PORT}/api`;

export default defineConfig({
    testDir: './e2e',
    timeout: 30_000,
    expect: { timeout: 5_000, toHaveScreenshot: { maxDiffPixelRatio: 0.02 } },
    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],
    globalSetup: path.join(__dirname, 'e2e', 'global-setup.ts'),
    use: {
        baseURL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        {
            name: 'mobile',
            testMatch: /responsive\.spec\.ts/,
            use: { ...devices['iPhone 13'] },
        },
        {
            name: 'tablet',
            testMatch: /responsive\.spec\.ts/,
            use: { ...devices['iPad (gen 7)'] },
        },
        {
            name: 'api',
            testMatch: /api\.spec\.ts/,
            use: { baseURL: VITE_API_URL },
        },
    ],
    webServer: process.env.PLAYWRIGHT_NO_SERVER
        ? undefined
        : [
              {
                  command:
                      'npx --yes firebase-tools@13 emulators:start --only auth --project app-local-8bfd8',
                  cwd: './e2e',
                  url: 'http://localhost:9099/emulator/v1/projects/app-local-8bfd8/config',
                  reuseExistingServer: !process.env.CI,
                  timeout: 120_000,
                  stdout: 'pipe',
                  stderr: 'pipe',
              },
              {
                  command: 'npm run dev',
                  url: baseURL,
                  reuseExistingServer: !process.env.CI,
                  timeout: 120_000,
                  env: {
                      VITE_API_URL,
                      VITE_USE_AUTH_EMULATOR: 'true',
                      VITE_AUTH_EMULATOR_HOST: 'http://localhost:9099',
                  },
              },
          ],
});
