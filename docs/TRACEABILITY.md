# Master Requirements Traceability Matrix (RTM)

**Project**: `automationexercise-bdd-playwright`  
**AUT**: [https://automationexercise.com/](https://automationexercise.com/)  
**Framework Coverage**: **38 / 38 Requirements (100%)** → **38 / 38 Test Cases (100%)** → **38 / 38 Automated BDD Scenarios (100%)** (`39` compiled Playwright tests including 2-row Scenario Outline)  
**Official Automation Exercise Test Cases Coverage**: **26 / 26 Official Test Cases (`@AE-TC-01` .. `@AE-TC-26`, 100%)**

## 1. Summary by Module & Suite

| Module | PRD File | Test Cases File | Feature File | REQs | TCs | BDD Scenarios | `@smoke` (P0) | `@regression` (P1/P2) | `@e2e` |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `home-navigation` | `docs/prd/home-navigation.md` | `docs/test-cases/home-navigation.md` | `features/home-navigation.feature` | 7 | 7 | 7 | 2 | 5 | 0 |
| `catalog-search` | `docs/prd/catalog-search.md` | `docs/test-cases/catalog-search.md` | `features/catalog-search.feature` | 6 | 6 | 6 | 2 | 4 | 0 |
| `shopping-cart` | `docs/prd/shopping-cart.md` | `docs/test-cases/shopping-cart.md` | `features/shopping-cart.feature` | 8 | 8 | 8 | 2 | 6 | 1 |
| `auth-account` | `docs/prd/auth-account.md` | `docs/test-cases/auth-account.md` | `features/auth-account.feature` | 5 | 5 | 5 | 2 | 3 | 2 |
| `checkout-order` | `docs/prd/checkout-order.md` | `docs/test-cases/checkout-order.md` | `features/checkout-order.feature` | 8 | 8 | 8 | 1 | 7 | 6 |
| `contact-support` | `docs/prd/contact-support.md` | `docs/test-cases/contact-support.md` | `features/contact-support.feature` | 4 | 4 | 4 | 1 | 3 | 0 |
| **TOTAL** | **6 Module PRDs** | **6 Test Matrices** | **6 Feature Files** | **38** | **38** | **38** | **10** | **28** | **9** |

## 2. Official Automation Exercise Test Cases 1–26 Cross-Reference (`https://automationexercise.com/test_cases`)

| Official AE Test Case | AE Tag | Mapped Framework TC | Requirement ID | Feature File |
| :--- | :--- | :--- | :--- | :--- |
| Test Case 1: Register User | `@AE-TC-01` | `TC-AUTH-01` | `REQ-AUTH-01` | `features/auth-account.feature` |
| Test Case 2: Login User with correct email and password | `@AE-TC-02` | `TC-AUTH-04` | `REQ-AUTH-04` | `features/auth-account.feature` |
| Test Case 3: Login User with incorrect email and password | `@AE-TC-03` | `TC-AUTH-02` | `REQ-AUTH-02` | `features/auth-account.feature` |
| Test Case 4: Logout User | `@AE-TC-04` | `TC-AUTH-04` | `REQ-AUTH-04` | `features/auth-account.feature` |
| Test Case 5: Register User with existing email | `@AE-TC-05` | `TC-AUTH-03` | `REQ-AUTH-03` | `features/auth-account.feature` |
| Test Case 6: Contact Us Form | `@AE-TC-06` | `TC-CNT-02`, `TC-CNT-03` | `REQ-CNT-02`, `REQ-CNT-03` | `features/contact-support.feature` |
| Test Case 7: Verify Test Cases Page | `@AE-TC-07` | `TC-NAV-05` | `REQ-NAV-05` | `features/home-navigation.feature` |
| Test Case 8: Verify All Products and product detail page | `@AE-TC-08` | `TC-CAT-01`, `TC-CAT-06` | `REQ-CAT-01`, `REQ-CAT-06` | `features/catalog-search.feature` |
| Test Case 9: Search Product | `@AE-TC-09` | `TC-CAT-02` | `REQ-CAT-02` | `features/catalog-search.feature` |
| Test Case 10: Verify Subscription in home page | `@AE-TC-10` | `TC-NAV-03` | `REQ-NAV-03` | `features/home-navigation.feature` |
| Test Case 11: Verify Subscription in Cart page | `@AE-TC-11` | `TC-CART-06` | `REQ-CART-06` | `features/shopping-cart.feature` |
| Test Case 12: Add Products in Cart | `@AE-TC-12` | `TC-CART-02` | `REQ-CART-02` | `features/shopping-cart.feature` |
| Test Case 13: Verify Product quantity in Cart | `@AE-TC-13` | `TC-CART-03` | `REQ-CART-03` | `features/shopping-cart.feature` |
| Test Case 14: Place Order: Register while Checkout | `@AE-TC-14` | `TC-CHK-06` | `REQ-CHK-06` | `features/checkout-order.feature` |
| Test Case 15: Place Order: Register before Checkout | `@AE-TC-15` | `TC-CHK-03` | `REQ-CHK-03` | `features/checkout-order.feature` |
| Test Case 16: Place Order: Login before Checkout | `@AE-TC-16` | `TC-CHK-07` | `REQ-CHK-07` | `features/checkout-order.feature` |
| Test Case 17: Remove Products From Cart | `@AE-TC-17` | `TC-CART-04` | `REQ-CART-04` | `features/shopping-cart.feature` |
| Test Case 18: View Category Products | `@AE-TC-18` | `TC-CAT-04` | `REQ-CAT-04` | `features/catalog-search.feature` |
| Test Case 19: View & Cart Brand Products | `@AE-TC-19` | `TC-CAT-05` | `REQ-CAT-05` | `features/catalog-search.feature` |
| Test Case 20: Search Products and Verify Cart After Login | `@AE-TC-20` | `TC-CART-07` | `REQ-CART-07` | `features/shopping-cart.feature` |
| Test Case 21: Add review on product | `@AE-TC-21` | `TC-CAT-06` | `REQ-CAT-06` | `features/catalog-search.feature` |
| Test Case 22: Add to cart from Recommended items | `@AE-TC-22` | `TC-CART-08` | `REQ-CART-08` | `features/shopping-cart.feature` |
| Test Case 23: Verify address details in checkout page | `@AE-TC-23` | `TC-CHK-01` | `REQ-CHK-01` | `features/checkout-order.feature` |
| Test Case 24: Download Invoice after purchase order | `@AE-TC-24` | `TC-CHK-08` | `REQ-CHK-08` | `features/checkout-order.feature` |
| Test Case 25: Verify Scroll Up using 'Arrow' button and Scroll Down | `@AE-TC-25` | `TC-NAV-06` | `REQ-NAV-06` | `features/home-navigation.feature` |
| Test Case 26: Verify Scroll Up without 'Arrow' button and Scroll Down | `@AE-TC-26` | `TC-NAV-07` | `REQ-NAV-07` | `features/home-navigation.feature` |

## 3. Complete Bidirectional Traceability Table (38 REQs → 38 TCs → 38 BDD Scenarios)

| Requirement ID | Test Case ID | BDD Tag | Official AE Ref | Module | Priority | Suite Tag(s) |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `REQ-NAV-01` | `TC-NAV-01` | `@TC-NAV-01` | — | `home-navigation` | P0 | `@smoke` |
| `REQ-NAV-02` | `TC-NAV-02` | `@TC-NAV-02` | — | `home-navigation` | P0 | `@smoke` |
| `REQ-NAV-03` | `TC-NAV-03` | `@TC-NAV-03` | `@AE-TC-10` | `home-navigation` | P1 | `@regression` |
| `REQ-NAV-04` | `TC-NAV-04` | `@TC-NAV-04` | — | `home-navigation` | P2 | `@regression` |
| `REQ-NAV-05` | `TC-NAV-05` | `@TC-NAV-05` | `@AE-TC-07` | `home-navigation` | P2 | `@regression` |
| `REQ-NAV-06` | `TC-NAV-06` | `@TC-NAV-06` | `@AE-TC-25` | `home-navigation` | P2 | `@regression` |
| `REQ-NAV-07` | `TC-NAV-07` | `@TC-NAV-07` | `@AE-TC-26` | `home-navigation` | P2 | `@regression` |
| `REQ-CAT-01` | `TC-CAT-01` | `@TC-CAT-01` | `@AE-TC-08` | `catalog-search` | P0 | `@smoke` |
| `REQ-CAT-02` | `TC-CAT-02` | `@TC-CAT-02` | `@AE-TC-09` | `catalog-search` | P0 | `@smoke` |
| `REQ-CAT-03` | `TC-CAT-03` | `@TC-CAT-03` | — | `catalog-search` | P1 | `@regression` |
| `REQ-CAT-04` | `TC-CAT-04` | `@TC-CAT-04` | `@AE-TC-18` | `catalog-search` | P1 | `@regression` |
| `REQ-CAT-05` | `TC-CAT-05` | `@TC-CAT-05` | `@AE-TC-19` | `catalog-search` | P1 | `@regression` |
| `REQ-CAT-06` | `TC-CAT-06` | `@TC-CAT-06` | `@AE-TC-08 @AE-TC-21` | `catalog-search` | P1 | `@regression` |
| `REQ-CART-01` | `TC-CART-01` | `@TC-CART-01` | — | `shopping-cart` | P0 | `@smoke` |
| `REQ-CART-02` | `TC-CART-02` | `@TC-CART-02` | `@AE-TC-12` | `shopping-cart` | P0 | `@smoke` |
| `REQ-CART-03` | `TC-CART-03` | `@TC-CART-03` | `@AE-TC-13` | `shopping-cart` | P1 | `@regression` |
| `REQ-CART-04` | `TC-CART-04` | `@TC-CART-04` | `@AE-TC-17` | `shopping-cart` | P1 | `@regression` |
| `REQ-CART-05` | `TC-CART-05` | `@TC-CART-05` | — | `shopping-cart` | P1 | `@regression` |
| `REQ-CART-06` | `TC-CART-06` | `@TC-CART-06` | `@AE-TC-11` | `shopping-cart` | P1 | `@regression` |
| `REQ-CART-07` | `TC-CART-07` | `@TC-CART-07` | `@AE-TC-20` | `shopping-cart` | P1 | `@regression @e2e @signup` |
| `REQ-CART-08` | `TC-CART-08` | `@TC-CART-08` | `@AE-TC-22` | `shopping-cart` | P1 | `@regression` |
| `REQ-AUTH-01` | `TC-AUTH-01` | `@TC-AUTH-01` | `@AE-TC-01` | `auth-account` | P0 | `@smoke @e2e @signup` |
| `REQ-AUTH-02` | `TC-AUTH-02` | `@TC-AUTH-02` | `@AE-TC-03` | `auth-account` | P1 | `@regression` |
| `REQ-AUTH-03` | `TC-AUTH-03` | `@TC-AUTH-03` | `@AE-TC-05` | `auth-account` | P1 | `@regression @signup` |
| `REQ-AUTH-04` | `TC-AUTH-04` | `@TC-AUTH-04` | `@AE-TC-02 @AE-TC-04` | `auth-account` | P0 | `@smoke @e2e @signup` |
| `REQ-AUTH-05` | `TC-AUTH-05` | `@TC-AUTH-05` | — | `auth-account` | P2 | `@regression` |
| `REQ-CHK-01` | `TC-CHK-01` | `@TC-CHK-01` | `@AE-TC-23` | `checkout-order` | P0 | `@smoke @e2e @signup` |
| `REQ-CHK-02` | `TC-CHK-02` | `@TC-CHK-02` | — | `checkout-order` | P1 | `@regression @e2e @signup` |
| `REQ-CHK-03` | `TC-CHK-03` | `@TC-CHK-03` | `@AE-TC-15` | `checkout-order` | P1 | `@regression @e2e @signup` |
| `REQ-CHK-04` | `TC-CHK-04` | `@TC-CHK-04` | — | `checkout-order` | P2 | `@regression @signup` |
| `REQ-CHK-05` | `TC-CHK-05` | `@TC-CHK-05` | — | `checkout-order` | P2 | `@regression @signup` |
| `REQ-CHK-06` | `TC-CHK-06` | `@TC-CHK-06` | `@AE-TC-14` | `checkout-order` | P1 | `@regression @e2e @signup` |
| `REQ-CHK-07` | `TC-CHK-07` | `@TC-CHK-07` | `@AE-TC-16` | `checkout-order` | P1 | `@regression @e2e @signup` |
| `REQ-CHK-08` | `TC-CHK-08` | `@TC-CHK-08` | `@AE-TC-24` | `checkout-order` | P1 | `@regression @e2e @signup` |
| `REQ-CNT-01` | `TC-CNT-01` | `@TC-CNT-01` | — | `contact-support` | P0 | `@smoke` |
| `REQ-CNT-02` | `TC-CNT-02` | `@TC-CNT-02` | `@AE-TC-06` | `contact-support` | P1 | `@regression` |
| `REQ-CNT-03` | `TC-CNT-03` | `@TC-CNT-03` | `@AE-TC-06` | `contact-support` | P1 | `@regression` |
| `REQ-CNT-04` | `TC-CNT-04` | `@TC-CNT-04` | — | `contact-support` | P2 | `@regression` |
