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

| Script            | Description                                                   |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Starts the Vite dev server with Hot Module Replacement (HMR). |
| `npm run build`   | Compiles TypeScript and bundles the app for production.       |
| `npm run lint`    | Runs ESLint and checks formatting.                            |
| `npm run preview` | Previews the production build locally.                        |
| `npm run format`  | Formats the entire project using Prettier.                    |
| `npm run test:e2e` | Runs Playwright end-to-end tests against the dev server.    |
| `npm run test:e2e:headed` | Runs E2E tests in a headed browser.                  |
| `npm run test:e2e:debug` | Runs E2E tests with the Playwright Inspector.         |
| `npm run test:e2e:report` | Opens the most recent HTML report.                    |

---

# 🧪 End-to-End Tests (Playwright)

E2E tests live in `e2e/` and are executed with Playwright.

## Local setup

```bash
npm install
npx playwright install --with-deps chromium
```

Provide a seeded test account via env vars (or rely on the defaults):

```env
PLAYWRIGHT_TEST_EMAIL=e2e-user@tradelayers.test
PLAYWRIGHT_TEST_PASSWORD=Password!23
PLAYWRIGHT_BASE_URL=http://localhost:5173
```

## Run

```bash
npm run test:e2e            # headless against the auto-started dev server
npm run test:e2e:headed     # watch the browser
npm run test:e2e:debug      # step through with the Inspector
npm run test:e2e:report     # open the last HTML report
```

The HTML report is generated in `playwright-report/` and uploaded as a CI
artifact on every pull request via `.github/workflows/e2e.yml`.

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
