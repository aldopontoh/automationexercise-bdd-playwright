# System Overview PRD — Automation Exercise

## 1. Application Summary
**Automation Exercise** (`https://automationexercise.com/`) is a full-featured e-commerce web application built on Django/Bootstrap providing catalog browsing, category/brand filtering, keyword search, shopping cart management, account registration/authentication, checkout/order confirmation, product reviews, newsletter subscription, and customer contact workflows.

## 2. Live-Verified Route Map

| Route | Live Page `<title>` | Access Level | Primary Module |
| :--- | :--- | :--- | :--- |
| `/` | `Automation Exercise` | Guest & Authenticated | `home-navigation` |
| `/products` | `Automation Exercise - All Products` | Guest & Authenticated | `catalog-search` |
| `/products?search=<term>` | `Automation Exercise - All Products` | Guest & Authenticated | `catalog-search` |
| `/category_products/<id>` | `Automation Exercise - <Subcat> Products` | Guest & Authenticated | `catalog-search` |
| `/brand_products/<brand>` | `Automation Exercise - <Brand> Products` | Guest & Authenticated | `catalog-search` |
| `/product_details/<id>` | `Automation Exercise - Product Details` | Guest & Authenticated | `catalog-search` |
| `/view_cart` | `Automation Exercise - Checkout` | Guest & Authenticated | `shopping-cart` |
| `/login` | `Automation Exercise - Signup / Login` | Guest | `auth-account` |
| `/signup` | `Automation Exercise - Signup` | Guest (POST from `/login`) | `auth-account` |
| `/account_created` | `Automation Exercise - Account Created` | Post-Signup | `auth-account` |
| `/delete_account` | `Automation Exercise - Account Created` *(AUT quirk)* | Authenticated | `auth-account` |
| `/logout` | Redirects to `/login` | Authenticated | `auth-account` |
| `/checkout` | `Automation Exercise - Checkout` | Authenticated | `checkout-order` |
| `/payment` | `Automation Exercise - Payment` | Authenticated | `checkout-order` |
| `/payment_done/<amount>` | `Automation Exercise - Order Placed` | Authenticated | `checkout-order` |
| `/contact_us` | `Automation Exercise - Contact Us` | Guest & Authenticated | `contact-support` |
| `/test_cases` | `Automation Practice Website for UI Testing - Test Cases` | Guest & Authenticated | `home-navigation` |
| `/api_list` | `Automation Practice for API Testing` | Guest & Authenticated | `home-navigation` |

## 3. Global Architectural & DOM Quirks (Live-Verified)
1. **Google Vignette Ad Interstitials (`#google_vignette`)**: Navigation clicks can be hijacked by Google AdSense vignettes appending `#google_vignette` to the URL. Mitigation: abort ad domains via `page.route` in fixtures and provide defensive hash recovery in `BasePage.js`.
2. **Cookie Consent Overlay**: EU/regional visitors may see Google Funding Choices consent (`button.fc-cta-consent` / `Consent`). Handled non-destructively in `BasePage.dismissConsentIfPresent()`.
3. **Non-Breaking Spaces (`\u00a0`)**: Category headings (`Women - \u00a0Dress Products`), brand headings (`Brand - \u00a0Polo Products`), and some product titles (`Men \u00a0Tshirt`) include `\u00a0`. Assertions must use whitespace-tolerant regex matching.
4. **Header State Switch**:
   - **Guest Header Links**: `Home`, `Products`, `Cart`, `Signup / Login`, `Test Cases`, `API Testing`, `Video Tutorials`, `Contact us`.
   - **Authenticated Header Links**: Replaces `Signup / Login` with `Logout` (`/logout`), `Delete Account` (`/delete_account`), and displays `Logged in as <UserName>`.
5. **Footer Subscription ID Typo**: Input element uses `id="susbscribe_email"` (double `s`) with `placeholder="Your email address"` and submit button `#subscribe`.
6. **Cart Session Boundary on Registration**: Creating a new user account starts an authenticated user session whose checkout order table only reflects items added while logged in; E2E checkout flows add products after authentication (or re-verify cart contents).

## 4. Module PRD Index
- [home-navigation.md](./home-navigation.md) (`NAV`)
- [catalog-search.md](./catalog-search.md) (`CAT`)
- [shopping-cart.md](./shopping-cart.md) (`CART`)
- [auth-account.md](./auth-account.md) (`AUTH`)
- [checkout-order.md](./checkout-order.md) (`CHK`)
- [contact-support.md](./contact-support.md) (`CNT`)
