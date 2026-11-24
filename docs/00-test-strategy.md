# Risk-Based Test Strategy — Automation Exercise

## 1. Document Control & Objective
- **Application Under Test (AUT)**: [https://automationexercise.com/](https://automationexercise.com/)
- **Framework Stack**: Playwright (`@playwright/test`), `playwright-bdd` (Gherkin/Cucumber), Page Object Model (JavaScript), Jenkins Declarative CI/CD.
- **Objective**: Establish a risk-based, ISTQB-compliant, zero-flakiness end-to-end UI test strategy that guarantees release confidence across critical e-commerce journeys while maintaining strict live-site safety and 100% requirement-to-automation traceability.

---

## 2. Scope Definition

### In-Scope
- **Home & Global Navigation (`home-navigation`)**: Hero carousel, global header navigation across all primary routes, footer newsletter subscription (positive & negative validation), Test Cases (`/test_cases`) and API Testing (`/api_list`) reference pages, page titles, and heading hierarchy.
- **Catalog, Search & Product Details (`catalog-search`)**: All Products catalog listing (34 products), keyword search (valid, partial, zero-results), Category accordion filtering (Women, Men, Kids), Brand sidebar filtering, Product Details metadata, and Write Your Review form.
- **Shopping Cart (`shopping-cart`)**: Add to Cart modal (`Added!`, `Continue Shopping`, `View Cart`), single/multi-product cart totals, custom product quantity from Product Details, line-item deletion, empty-cart state transition, and Guest Checkout Login Modal (`#checkoutModal`).
- **Authentication & Account Lifecycle (`auth-account`)**: New user signup (`/login` → `/signup` → `/account_created`), duplicate email validation, valid login & logout, invalid credential handling, HTML5 native validation, and permanent self-cleaning account deletion (`/delete_account`).
- **Checkout & Order Confirmation (`checkout-order`)**: Authenticated `/checkout` delivery/billing address verification, order review table & total calculation, order comment submission, `/payment` form validation, and practice sandbox confirmation (`/payment_done`).
- **Contact Us & Support (`contact-support`)**: Contact form submission, local fixture file attachment (`upload_file`), browser `confirm()` dialog handling, success alert verification, return-home navigation, and required email validation.

### Out-of-Scope
- Third-party Google AdSense / DoubleClick ad rendering and external YouTube video playback (`Video Tutorials` external redirect).
- Load, stress, and penetration security testing against the public practice host.
- Real payment gateway settlement (the AUT provides a synthetic practice payment form only; real credit cards are strictly prohibited).
- Backend database direct queries (black-box UI verification + UI-driven account teardown).

---

## 3. Risk Assessment Matrix

| Module | Business Impact | Failure Likelihood | Risk Level | Mitigation & Test Depth |
| :--- | :--- | :--- | :--- | :--- |
| `auth-account` | High (blocks all authenticated flows) | Medium (form state, session cookies, duplicate email edge cases) | **Critical** | P0 `@smoke` + `@e2e` signup/login/logout/delete + negative & HTML5 validation; mandatory `After` hook cleanup. |
| `checkout-order` | High (revenue & order integrity) | High (address parity, cart session reset on signup, payment validation) | **Critical** | P0 `@smoke` + `@e2e` address parity & order review + sandbox confirmation + negative card validation. |
| `shopping-cart` | High (conversion funnel) | Medium (modal overlay timing, quantity math, guest redirect modal) | **High** | P0 `@smoke` multi-item add & empty state + P1 custom quantity, removal, and guest checkout gate. |
| `catalog-search` | High (product discovery) | Medium (non-breaking spaces in headings, zero-result state, ad overlays) | **High** | P0 `@smoke` catalog & valid search + P1 zero-result, category/brand filters, details & review submission. |
| `home-navigation` | Medium (entry point & routing) | Low (static nav, newsletter AJAX) | **Medium** | P0 `@smoke` landing & navigation routing + P1/P2 newsletter positive/negative & reference pages. |
| `contact-support` | Low-Medium (customer support) | Medium (native JS `confirm` dialog + file upload input) | **Medium** | P0 `@smoke` page availability + P1 file upload + dialog accept + P2 email validation. |

---

## 4. Test Pyramid & Tagging Strategy

- **Automation Layer**: End-to-End & Functional UI acceptance specs written in Gherkin (`features/*.feature`), compiled by `bddgen`, executed via Playwright with strict POM separation.
- **Tagging Taxonomy**:
  - `@smoke`: Fast P0 critical-path gate (9 scenarios across all 6 modules) — target runtime < 2 minutes; suitable for PR/commit gating.
  - `@regression`: Comprehensive P1 & P2 functional, negative, boundary, state-transition, and accessibility/SEO scenarios (21 scenarios).
  - `@e2e`: Multi-module journeys spanning signup, catalog, cart, checkout, and teardown (5 scenarios).
  - `@signup`: Marks scenarios creating ephemeral accounts that require self-cleaning teardown.
  - `@P0` / `@P1` / `@P2`: ISTQB execution priority tags.
  - `@<module-slug>`: Targeted module execution (`@home-navigation`, `@catalog-search`, `@shopping-cart`, `@auth-account`, `@checkout-order`, `@contact-support`).
  - `@TC-<MOD>-XX`: 1:1 traceability tag enforced by `qa-traceability` MCP.

---

## 5. Environment & Browser Matrix

| Environment | Base URL | Primary Browser | Cross-Browser Coverage | Workers / Retries |
| :--- | :--- | :--- | :--- | :--- |
| Local Dev (Windows) | `https://automationexercise.com` | `bdd-chrome` (Chromium) | `bdd-firefox`, `bdd-edge` | `workers: 1`, `retries: 0` |
| Jenkins CI (`automationexercise-playwright-ci`) | `https://automationexercise.com` | `bdd-chrome` (Chromium) | Parameterizable (`bdd-firefox`, `bdd-edge`) | `workers: 1`, `retries: 1` |

*Note on `workers: 1`*: Running serially against the public shared host avoids rate-limiting, session cross-talk, and transient third-party CDN throttling while keeping deterministic JUnit/HTML traces.

---

## 6. Entry & Exit Criteria

### Entry Criteria
- Live AUT (`https://automationexercise.com/`) responds with HTTP 200 on `/`.
- `npm run bdd:gen` completes with 0 syntax errors, 0 missing step definitions, and 0 duplicate patterns.
- QA Reviewer audit confirms: 0 `waitForTimeout` calls, 0 `expect()` calls in `pages/`, and 100% traceability coverage (`qa-traceability` MCP).

### Exit Criteria
- **Smoke Gate**: 100% pass rate on all `@smoke` (`@P0`) scenarios.
- **Full Release Gate**: 100% pass rate across all 30 scenarios on `bdd-chrome` in Jenkins CI (`SUCCESS` build status) with archived Playwright HTML report, JSON report, and JUnit XML.
- **Zero Orphaned Test Data**: All ephemeral user accounts created during test runs are deleted via `/delete_account` (verified in test steps and `After` hook).

---

## 7. Test Data Isolation & Live-Site Safety Strategy
- Every user registration payload is dynamically generated via `utils/testDataFactory.js` using high-entropy timestamps and random suffixes (`qa.ae.<timestamp>.<rand>@example.com`), preventing cross-run email collisions.
- `fixtures/bddFixtures.js` tracks `testContext.createdUser` and executes a defensive `After` hook that logs in (if needed) and navigates to `/delete_account` so even failed tests clean up their ephemeral accounts.
- Third-party ad networks (`googlesyndication.com`, `doubleclick.net`, `googleadservices.com`, `adservice.google.com`) are aborted at the browser context layer to prevent `#google_vignette` interstitial flakes without altering AUT functionality.
- Payment tests exclusively use synthetic non-routable dummy card strings (`QA Test Card`, `0000000000000000`, `123`, `12`, `2030`) on the AUT practice form.
