# PRD: Home & Global Navigation (`home-navigation`)

## 1. Module Overview, Business Objective & Risk Priority
- **Module Slug**: `home-navigation`
- **Business Objective**: Provide a reliable entry point for shoppers and QA engineers with clear brand identity, primary route navigation, featured catalog discovery, newsletter subscription capture, smooth scroll-up navigation, and quick access to Test Cases and API Testing reference documentation.
- **Risk Priority**: **Medium** (P0 for landing & routing; P1/P2 for newsletter, scroll controls, and reference pages).

## 2. Entry Points, Routes & Preconditions
- **Routes**: `/`, `/test_cases`, `/api_list` (plus global `#header` and `#footer` shared across all routes).
- **Preconditions**: Accessible in both Guest and Authenticated states without prior login.

## 3. Atomic Functional Requirements
- **REQ-NAV-01**: Landing on `/` MUST render page title `Automation Exercise`, the hero carousel (`#slider-carousel` with 3 slides), `Features Items` heading with 34 product cards, sidebar `Category` and `Brands` headings, and `Recommended Items` section.
- **REQ-NAV-02**: Primary header navigation MUST route accurately to Products (`/products`), Cart (`/view_cart`), Signup / Login (`/login`), Test Cases (`/test_cases`), API Testing (`/api_list`), and Contact us (`/contact_us`) without 4xx/5xx failures.
- **REQ-NAV-03**: Submitting a valid email address in the footer `Subscription` form MUST display the confirmation message `"You have been successfully subscribed!"` (`#success-subscribe`).
- **REQ-NAV-04**: Submitting an empty or syntactically invalid email in the footer `Subscription` input (`type="email" required`) MUST be blocked by native HTML5 constraint validation without displaying the success banner.
- **REQ-NAV-05**: Navigating to `/test_cases` and `/api_list` MUST render their verified `<title>` values (`Automation Practice Website for UI Testing - Test Cases` and `Automation Practice for API Testing`), primary headings (`Test Cases` and `APIs List for practice`), and interactive accordion lists (27 test case panels; 15 API endpoint panels).
- **REQ-NAV-06**: Scrolling to the bottom of `/` (`Subscription` visible) and clicking the floating scroll-up arrow button (`#scrollUp`) MUST scroll the viewport back to the top and reveal `"Full-Fledged practice website for Automation Engineers"` in the viewport (`AE-TC-25`).
- **REQ-NAV-07**: Scrolling to the bottom of `/` (`Subscription` visible) and scrolling back to the top manually (without clicking `#scrollUp`) MUST return the viewport to the top and reveal `"Full-Fledged practice website for Automation Engineers"` in the viewport (`AE-TC-26`).

## 4. Verified UI Inventory & Resilient Locators (Live-Inspected)

| UI Element | Verified DOM Details | Resilient Locator Strategy |
| :--- | :--- | :--- |
| Header Nav Links | `#header a` (`Home`, `Products`, `Cart`, `Signup / Login`, `Test Cases`, `API Testing`, `Contact us`) | `page.getByRole('link', { name: /Products/i })`, etc. |
| Hero Carousel & Subtitle | `#slider-carousel` (`3` `.item` slides, active `h2`: `"Full-Fledged practice website for Automation Engineers"`) | `page.locator('#slider-carousel .item.active h2')` |
| Features Items Heading | `h2` `"Features Items"` | `page.getByRole('heading', { name: /Features Items/i })` |
| Featured Product Cards | `.features_items .product-image-wrapper` (`34` items) | `page.locator('.features_items .product-image-wrapper')` |
| Floating Scroll-Up Arrow | `a#scrollUp[href="#top"]` | `page.locator('#scrollUp')` |
| Footer Subscription Heading | `#footer h2` `"Subscription"` | `page.getByRole('heading', { name: /Subscription/i })` |
| Subscription Email Input | `input#susbscribe_email[type="email"][required]`, `placeholder="Your email address"` | `page.getByPlaceholder('Your email address')` |
| Subscription Submit Button | `button#subscribe[type="submit"]` | `page.locator('#subscribe')` |
| Subscription Success Alert | `#success-subscribe` `"You have been successfully subscribed!"` | `page.locator('#success-subscribe')` |
| Test Cases Heading & Panels | `h2.title` `"Test Cases"`, `.panel-group .panel-title a` (`27`) | `page.getByRole('heading', { name: /^Test Cases$/i })` |
| API Testing Heading & Panels | `h2.title` `"APIs List for practice"`, `.panel-group .panel-title a` (`15`) | `page.getByRole('heading', { name: /APIs List for practice/i })` |

## 5. Validation Rules, Boundary Conditions, Ad/Modal Handling & Negative Scenarios
- Email field enforces HTML5 `required` and `type="email"` (`checkValidity() === false` for empty string `""` or `"not-an-email"`).
- `#scrollUp` only becomes visible after vertical scroll exceeds the page threshold; assertions verify `toBeInViewport()` on the hero subtitle after scroll-up without hardcoded sleeps.
- Cookie consent overlay (`button.fc-cta-consent`), `#google_vignette` hash redirects, and transient server heavy-load pages are recovered transparently in `BasePage.js`.

## 6. Testable Acceptance Criteria
- **Given** a guest user opens `/`, **When** the page finishes loading, **Then** the title is `Automation Exercise`, `Features Items` displays 34 products, and the `Category` / `Brands` sidebars are visible (`REQ-NAV-01`).
- **Given** a user is on `/`, **When** they click each primary header link, **Then** each destination route loads with its expected URL and heading (`REQ-NAV-02`).
- **Given** a user scrolls to the footer, **When** they subscribe with a valid email, **Then** `#success-subscribe` becomes visible with `"You have been successfully subscribed!"` (`REQ-NAV-03`).
- **Given** a user enters an invalid email in the footer subscription input, **When** they click subscribe, **Then** native HTML5 validation fails and `#success-subscribe` remains hidden (`REQ-NAV-04`).
- **Given** a user visits `/test_cases` and `/api_list`, **When** each page renders, **Then** the page titles, headings, and documentation panels (27 and 15 respectively) are visible (`REQ-NAV-05`).
- **Given** a user scrolls down to the footer on `/`, **When** they click `#scrollUp`, **Then** the page scrolls back to the top and `"Full-Fledged practice website for Automation Engineers"` is visible in viewport (`REQ-NAV-06`).
- **Given** a user scrolls down to the footer on `/`, **When** they scroll up manually without clicking `#scrollUp`, **Then** the page returns to the top and `"Full-Fledged practice website for Automation Engineers"` is visible in viewport (`REQ-NAV-07`).
