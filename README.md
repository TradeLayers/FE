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

E2E tests live in `e2e/` and run hermetically — they do not require a running backend or
Postgres. Auth uses the **Firebase Auth Emulator** and the REST API is provided by an
in-process Node mock server (`e2e/mock-server.ts`). Both are started automatically by
Playwright as `webServer` entries.

## Local setup

```bash
npm install
npx playwright install --with-deps chromium
```

The Firebase emulator requires Java 17+ on PATH. On macOS:

```bash
brew install temurin
```

Optional env vars (defaults shown):

```env
PLAYWRIGHT_TEST_EMAIL=e2e-user@tradelayers.test
PLAYWRIGHT_TEST_PASSWORD=Password!23
PLAYWRIGHT_BASE_URL=http://localhost:5173
MOCK_API_PORT=5174
```

## Suites

| Suite | Command | Notes |
| ----- | ------- | ----- |
| All UI specs | `npm run test:e2e` | Default, runs on Chromium. |
| Headed | `npm run test:e2e:headed` | Watch the browser. |
| Debug | `npm run test:e2e:debug` | Step through with the Inspector. |
| Accessibility | `npm run test:e2e:a11y` | `@axe-core/playwright` against key pages. |
| Visual regression | `npm run test:e2e:visual` | Pixel-diff baselines (committed under `e2e/__screenshots__`). |
| Update baselines | `npm run test:e2e:visual:update` | Regenerate snapshots after intentional UI changes. |
| API contract | `npm run test:e2e:api` | Runs `api.spec.ts` directly against the mock REST server. |
| Responsive | `npm run test:e2e:responsive` | Runs `responsive.spec.ts` on mobile + tablet device profiles. |
| Open last report | `npm run test:e2e:report` | Opens the HTML report. |

The HTML report is uploaded as a CI artifact on every pull request via
`.github/workflows/e2e.yml`.

## Architecture

- **`e2e/firebase.json`** — Firebase emulator config (Auth only, port 9099).
- **`e2e/mock-server.ts`** — Stateful HTTP mock for `/api/**` plus `/__admin/**` test-only routes.
- **`e2e/global-setup.ts`** — Wipes the emulator, seeds the test user, starts the mock server.
- **`e2e/fixtures.ts`** — Adds `mockApi` (reset, behavior, seed, getState) and `authedPage` fixtures.
- **`src/configs/firebase.ts`** — When `VITE_USE_AUTH_EMULATOR=true`, points the SDK at `localhost:9099`.

The dev server in test mode is started with `VITE_API_URL=http://localhost:5174/api` and
`VITE_USE_AUTH_EMULATOR=true`, so all requests flow through the mock and all auth flows
through the emulator.

## Coverage map (STC-106)

| Area | Spec |
| ---- | ---- |
| Login / logout | `auth.spec.ts` |
| Registration validation | `register.spec.ts` |
| Password reset | `password-reset.spec.ts` |
| Auth-protected route guards | `route-guards.spec.ts` |
| 401 / session expiry | `session-expiry.spec.ts` |
| Account settings | `account-settings.spec.ts` |
| Stocks search + states | `stock-search.spec.ts`, `stock-states.spec.ts`, `search-debounce.spec.ts` |
| Chart timeframe switching | `chart.spec.ts` |
| Compare add/remove tickers | `compare.spec.ts` |
| Buy / sell happy path | `trade.spec.ts` |
| Trading rules (insufficient funds, sell > owned, averaging, P&L) | `trade-rules.spec.ts` |
| Transaction pagination / sorting | `transactions.spec.ts` |
| Watchlist | `watchlist.spec.ts` |
| Alerts (create) | `alerts.spec.ts` |
| Alerts (validation, delete, firing) | `alerts-extra.spec.ts` |
| Home dashboard widgets | `dashboard.spec.ts` |
| Responsive (mobile / tablet) | `responsive.spec.ts` |
| Theme persistence | `theme.spec.ts` |
| Accessibility | `a11y.spec.ts` |
| Visual regression | `visual.spec.ts` |
| API contract | `api.spec.ts` |
| CSV export | `csv-export.spec.ts` |

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
