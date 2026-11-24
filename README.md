# Automation Exercise — Playwright BDD Enterprise QA Framework

End-to-end, risk-based, ISTQB-traceable UI test automation framework for [https://automationexercise.com/](https://automationexercise.com/) built with **Playwright**, **playwright-bdd**, and the **Page Object Model (POM)** pattern in JavaScript.

## Architecture Overview

- **BDD Layer (`features/`)**: Business-readable Gherkin specifications tagged by module (`@home-navigation`, `@catalog-search`, `@shopping-cart`, `@auth-account`, `@checkout-order`, `@contact-support`), suite (`@smoke`, `@regression`, `@e2e`), priority (`@P0`, `@P1`, `@P2`), and 1:1 test case ID (`@TC-<MOD>-XX`).
- **Step Definitions (`steps/`)**: Clean, reusable `Given` / `When` / `Then` steps containing all web-first `expect(...)` assertions.
- **Fixtures & Lifecycle Hooks (`fixtures/bddFixtures.js`)**: Dependency injection for all Page Objects, automatic third-party ad network blocking to eliminate `#google_vignette` flakiness, and self-cleaning `After` hooks that delete ephemeral test accounts via `/delete_account`.
- **Page Objects (`pages/`)**: Strictly action- and locator-only classes extending `BasePage.js` (zero `expect()` calls).
- **Dynamic Test Data (`utils/testDataFactory.js`)**: Generates collision-free registration profiles, dummy checkout card data, and review/contact payloads per scenario.
- **QA Documentation (`docs/`)**: Risk-based Test Strategy, per-module PRDs (`REQ-<MOD>-XX`), ISTQB Test Case Matrices (`TC-<MOD>-XX`), and master Requirements Traceability Matrix (`docs/TRACEABILITY.md`).

## Project Layout

```text
automationexercise-bdd-playwright/
├── docs/
│   ├── 00-test-strategy.md
│   ├── TRACEABILITY.md
│   ├── prd/
│   │   ├── 00-system-overview.md
│   │   ├── home-navigation.md
│   │   ├── catalog-search.md
│   │   ├── shopping-cart.md
│   │   ├── auth-account.md
│   │   ├── checkout-order.md
│   │   └── contact-support.md
│   └── test-cases/
│       ├── home-navigation.md
│       ├── catalog-search.md
│       ├── shopping-cart.md
│       ├── auth-account.md
│       ├── checkout-order.md
│       └── contact-support.md
├── features/
│   ├── home-navigation.feature
│   ├── catalog-search.feature
│   ├── shopping-cart.feature
│   ├── auth-account.feature
│   ├── checkout-order.feature
│   └── contact-support.feature
├── fixtures/
│   └── bddFixtures.js
├── pages/
│   ├── BasePage.js
│   ├── HomePage.js
│   ├── ProductsPage.js
│   ├── ProductDetailsPage.js
│   ├── CartPage.js
│   ├── AuthPage.js
│   ├── SignupFormPage.js
│   ├── CheckoutPage.js
│   ├── PaymentPage.js
│   └── ContactUsPage.js
├── steps/
│   ├── home-navigation.steps.js
│   ├── catalog-search.steps.js
│   ├── shopping-cart.steps.js
│   ├── auth-account.steps.js
│   ├── checkout-order.steps.js
│   └── contact-support.steps.js
├── test-data/
│   └── sample-contact-upload.txt
├── utils/
│   └── testDataFactory.js
├── GEMINI.md
├── Jenkinsfile
├── package.json
└── playwright.config.js
```

## Prerequisites

- Node.js 18+ (LTS / current) and npm
- Git

## Setup

```bash
npm install
npx playwright install chromium
```

## Local Execution Commands

```bash
# Generate Playwright test specs from Gherkin feature files
npm run bdd:gen

# Run P0 Smoke suite on Chromium
npx bddgen && npx playwright test --project=bdd-chrome --grep @smoke

# Run P0 Smoke suite across all configured projects
npm run test:smoke

# Run full Regression suite
npm run test:regression

# Run full suite on a specific browser project
npm run test:chrome
npm run test:firefox
npm run test:edge

# Open interactive HTML report
npm run report
```

## CI/CD Pipeline Design (`Jenkinsfile`)

The declarative `Jenkinsfile` automates:
1. **Checkout**: Pulls `*/main` from GitHub.
2. **Install Dependencies**: Runs `npm ci` (with fallback to `npm install`).
3. **Ensure Playwright Browsers**: Verifies/installs Chromium binaries (`npx playwright install chromium`).
4. **Generate BDD Specs**: Executes `npx bddgen` to validate Gherkin-to-step bindings.
5. **Run Playwright BDD Suite**: Executes `npx playwright test --project=bdd-chrome` (parameterizable via `SUITE_TAG` and `BROWSER_PROJECT`).
6. **Post Actions (Always)**: Archives `test-results/**` and `playwright-report/**` artifacts and publishes `test-results/junit.xml` via the JUnit plugin when available.
