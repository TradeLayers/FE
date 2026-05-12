# 🚀 Frontend Project

This is the frontend application for the **TradeLayers** project.

It is built using:

- React
- TypeScript
- Vite
- MUI (Material UI) for styling
- TanStack Query for data fetching

---

# 🛠 Prerequisites

Before running this project, make sure you have:

- **Node.js** – Version 24.x or higher
- **npm** – Version 10.x or higher

You can check your versions:

```bash
node -v
npm -v
```

---

# 🏁 Getting Started

Follow these steps to set up your local development environment.

---

## 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

---

## 2️⃣ Install Dependencies

This will install all required packages including:

- MUI
- Axios
- Redux
- TanStack Query
- Husky
- ESLint
- Prettier

```bash
npm install
```

---

## 3️⃣ Environment Variables

Create a `.env` file in the root directory and add:

```env
VITE_API_URL=http://localhost:5000/api
```

Adjust the URL if your backend runs on a different port or host.

---

## 4️⃣ Run the Development Server

```bash
npm run dev
```

After starting, open:

http://localhost:5173

---

# 🏗 Available Scripts

| Script                    | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| `npm run dev`             | Starts the Vite dev server with Hot Module Replacement (HMR). |
| `npm run build`           | Compiles TypeScript and bundles the app for production.       |
| `npm run lint`            | Runs ESLint and checks formatting.                            |
| `npm run preview`         | Previews the production build locally.                        |
| `npm run format`          | Formats the entire project using Prettier.                    |
| `npm run test:e2e`        | Runs Playwright end-to-end tests against the dev server.      |
| `npm run test:e2e:headed` | Runs E2E tests in a headed browser.                           |
| `npm run test:e2e:debug`  | Runs E2E tests with the Playwright Inspector.                 |
| `npm run test:e2e:report` | Opens the most recent HTML report.                            |

---

# 🧪 End-to-End Tests (Playwright)

Tests live in `e2e/` and run **hermetically** — no backend, no Postgres. Playwright boots
three things automatically as `webServer` entries:

1. **Firebase Auth Emulator** (port 9099) for login/register/reset.
2. **In-process mock REST server** (`e2e/mock-server.ts`, port 5174) for all `/api/**` calls.
3. **Vite dev server** (port 5179) wired to both via env vars.

`e2e/global-setup.ts` wipes the emulator and seeds a test user before any spec runs.

## First-time setup

```bash
npm install
npx playwright install         # downloads chromium + webkit (for mobile/tablet specs)
```

The emulator needs Java 17+. On macOS: `brew install temurin`.

## Run

```bash
npm run test:e2e               # full suite on chromium (default)
npm run test:e2e:headed        # watch the browser
npm run test:e2e:debug         # step through with Playwright Inspector
npm run test:e2e:a11y          # axe-core scans on key pages
npm run test:e2e:visual        # pixel-diff baselines
npm run test:e2e:visual:update # regenerate baselines
npm run test:e2e:api           # API contract suite (no browser)
npm run test:e2e:responsive    # iPhone 13 + iPad gen 7 viewports
npm run test:e2e:report        # open last HTML report
```

To skip visual regression locally (recommended unless you've generated baselines):

```bash
npx playwright test --grep-invert "Visual regression"
```

## Test credentials & env

Defaults work out of the box. Override only if you need to:

```env
PLAYWRIGHT_TEST_EMAIL=e2e-user@tradelayers.test
PLAYWRIGHT_TEST_PASSWORD=Password!23
PLAYWRIGHT_BASE_URL=http://127.0.0.1:5179
MOCK_API_PORT=5174
```

## Writing a new spec

```ts
import { test, expect } from './fixtures';

test('my flow', async ({ page, authedPage, mockApi }) => {
    await mockApi.seed('holdings', [{ symbol: 'AAPL', quantity: 5, ... }]);
    await authedPage; // logs in as the seeded user
    await page.getByTestId('nav-account').click();
    await expect(page.getByTestId('holdings-row-AAPL')).toBeVisible();
});
```

The `mockApi` fixture exposes `reset`, `setBehavior`, `setBalance`, `seed(kind, items)`,
and `getState()` — see `e2e/fixtures.ts`. Mutations made by the UI (buy, sell, watchlist,
alerts) flow through the mock and update its state, so subsequent assertions can read
the resulting state via `getState()`.

## Troubleshooting

- **Port 5179 in use** — set `PLAYWRIGHT_BASE_URL=http://127.0.0.1:<free-port>` and update
  `playwright.config.ts` `webServer` command to match.
- **Emulator won't start** — confirm Java 17+ is on PATH (`java -version`).
- **Stale emulator from a previous run** — `pkill -f "firebase emulators"`.
- **CI runs** — `.github/workflows/e2e.yml` installs Java 17, runs everything except the
  visual regression suite (no committed baselines yet), and uploads the HTML report.

---

# 🛡 Code Quality (Git Hooks)

This project uses **Husky** for Git hooks.

### Pre-commit Hook

Every time you run:

```bash
git commit
```

The project will automatically:

- Runs `npm run lint`
- Runs `npm run format`
- Block the commit if there are errors

You must fix all linting or formatting issues before committing.

---

# 📦 Production Build

To build for production:

```bash
npm run build
```

The output will be generated inside the `dist/` folder.
