# GEMINI.md — QA Automation Architecture & Governance Rules

This document codifies mandatory engineering, architectural, and quality standards for `automationexercise-bdd-playwright`. Every human engineer and AI agent session MUST adhere to these rules.

## 1. Strict Page Object Model (POM) Boundaries
- All Page Objects live in `pages/` and extend `pages/BasePage.js`.
- Page Objects encapsulate **locators and user actions ONLY**.
- **NEVER** import or call `expect()` inside `pages/**/*.js`. All assertions MUST reside exclusively in `steps/**/*.steps.js`.
- Expose clean read/locator helper methods from Page Objects so Step Definitions can apply web-first Playwright assertions (`await expect(pageObj.someLocator).toBeVisible()`).

## 2. Semantic Locator Hierarchy & Live DOM Verification
- Prefer user-facing resilient semantic locators in this strict priority order:
  1. `page.getByRole(...)`
  2. `page.getByLabel(...)`
  3. `page.getByPlaceholder(...)`
  4. `page.getByText(...)`
  5. `page.getByTestId(...)` / verified `[data-qa="..."]` attributes when semantic labels are absent in the AUT DOM (e.g., `#zipcode` on `/signup` has no `<label for="zipcode">`).
- Never guess selectors — verify every locator against the live DOM (`https://automationexercise.com/`).
- Avoid brittle deep CSS chains and positional XPath selectors.

## 3. Zero-Flakiness Standard
- **STRICTLY FORBIDDEN**: `page.waitForTimeout(...)`, `setTimeout(...)`, or any hardcoded sleep.
- Use Playwright's web-first auto-retrying assertions (`await expect(locator).toBeVisible()`, `toHaveText()`, `toHaveURL()`, `toHaveCount()`, `toHaveTitle()`).
- Ad & Overlay Resilience:
  - `fixtures/bddFixtures.js` proactively aborts third-party ad network requests (`googlesyndication.com`, `doubleclick.net`, `googleadservices.com`, `adservice.google.com`) to prevent Google Vignette (`#google_vignette`) flakiness.
  - `BasePage.js` provides defensive `dismissConsentIfPresent()` and `recoverFromVignette(targetPath)` helpers for any cookie-consent banner or hash-based ad interstitial.

## 4. playwright-bdd Wiring & Fixtures
- `playwright.config.js` configures `defineBddConfig({ features: 'features/**/*.feature', steps: ['steps/**/*.steps.js', 'fixtures/bddFixtures.js'], outputDir: '.features-gen' })`.
- `fixtures/bddFixtures.js` extends `playwright-bdd`'s `test` to inject all Page Objects and per-scenario `testContext` (tracking ephemeral user accounts) and exports `{ test, Given, When, Then, Before, After }`.
- Every step definition file under `steps/**/*.steps.js` imports `{ Given, When, Then }` from `../fixtures/bddFixtures`.
- Run `npm run bdd:gen` (`npx bddgen`) after modifying `.feature` or `.steps.js` files and confirm zero syntax, missing step, or duplicate pattern errors.

## 5. Live-Site Safety & Self-Cleaning Test Data
- Generate unique, collision-free user registration payloads per scenario using `utils/testDataFactory.js`.
- Never execute real financial transactions, irreversible destructive actions on shared data, or spam submissions.
- Any ephemeral account created during `@signup`, `@auth-account`, `@checkout-order`, or `@e2e` scenarios MUST be registered in `testContext` and cleaned up automatically via `/delete_account` in the `After` hook in `fixtures/bddFixtures.js` (or explicitly deleted inside the test).

## 6. Mandatory Bidirectional Traceability (REQ -> TC -> @TC)
- Every functional requirement in `docs/prd/<module-slug>.md` uses an atomic ID (`REQ-<MOD>-XX`).
- Every test case in `docs/test-cases/<module-slug>.md` uses an ISTQB-structured ID (`TC-<MOD>-XX`) mapped 1:1 to `REQ-<MOD>-XX`.
- Every executable Gherkin scenario in `features/<module-slug>.feature` MUST carry:
  - Module tag: `@<module-slug>`
  - Suite tag: `@smoke` or `@regression` (and `@e2e` for cross-module journeys)
  - Priority tag: `@P0`, `@P1`, or `@P2`
  - Traceability tag: `@TC-<MOD>-XX`
- Keep `docs/TRACEABILITY.md` synchronized and maintain 100% coverage (`0` uncovered test cases).

## 7. Security & Hygiene
- Never commit secrets, API tokens, credentials, `.env` files, `node_modules/`, `.features-gen/`, `test-results/`, or `playwright-report/`.
