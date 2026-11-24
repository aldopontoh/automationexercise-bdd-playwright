# PRD: Shopping Cart (`shopping-cart`)

## 1. Module Overview, Business Objective & Risk Priority
- **Module Slug**: `shopping-cart`
- **Business Objective**: Allow shoppers to add single or multiple products (including from Recommended Items and Search results) with accurate prices and custom quantities, subscribe from the Cart footer, retain cart contents across login, remove line items, recover cleanly from empty-cart state, and guide unauthenticated shoppers to login/signup at checkout.
- **Risk Priority**: **High** (direct conversion funnel).

## 2. Entry Points, Routes & Preconditions
- **Routes**: `/` (Recommended Items add-to-cart), `/products` (add-to-cart trigger), `/product_details/<id>` (quantity + add-to-cart trigger), `/view_cart` (cart review & footer subscription).
- **Preconditions**: Starts with an empty browser session cart unless items are added during the scenario.

## 3. Atomic Functional Requirements
- **REQ-CART-01**: Opening `/view_cart` with no added items MUST display `#empty_cart` containing `"Cart is empty!"` and a working `here` link pointing to `/products`.
- **REQ-CART-02**: Adding multiple distinct products from `/products` (using the `#cartModal` `"Added!"` dialog with `Continue Shopping` and `View Cart`) MUST persist all added rows in `#cart_info_table` with accurate product names, unit prices (`Rs. 500`, `Rs. 400`), quantities (`1`), and row totals (`Rs. 500`, `Rs. 400`).
- **REQ-CART-03**: Setting a custom numeric quantity (e.g., `4`) in `#quantity` on `/product_details/1` and clicking `Add to cart` MUST store quantity `4` and computed total `Rs. 2000` for `Blue Top` in `/view_cart`.
- **REQ-CART-04**: Clicking the delete control (`.cart_delete a`) for an item in `/view_cart` MUST remove that product row from `#cart_info_table`, and removing the last remaining item MUST transition cleanly to the `"Cart is empty!"` state.
- **REQ-CART-05**: Clicking `Proceed To Checkout` on `/view_cart` while unauthenticated (Guest) MUST open `#checkoutModal` containing `"Register / Login account to proceed on checkout."`, a `Register / Login` link (`/login`), and a `Continue On Cart` dismissal button without navigating directly to `/checkout`.
- **REQ-CART-06**: Scrolling to the footer on `/view_cart` (`Subscription` heading) and submitting a valid email address MUST display `"You have been successfully subscribed!"` (`AE-TC-11`).
- **REQ-CART-07**: Searching products on `/products`, adding a matching product to cart, verifying it in `/view_cart`, logging in with valid credentials, and revisiting `/view_cart` MUST retain the added product inside the cart (`AE-TC-20`).
- **REQ-CART-08**: Scrolling to `RECOMMENDED ITEMS` on `/`, clicking `Add to cart` on an active recommended carousel product, and clicking `View Cart` MUST display that exact recommended product in `/view_cart` (`AE-TC-22`).

## 4. Verified UI Inventory & Resilient Locators (Live-Inspected)

| UI Element | Verified DOM Details | Resilient Locator Strategy |
| :--- | :--- | :--- |
| Add to Cart (Catalog Card) | `.features_items .productinfo a.add-to-cart[data-product-id="<id>"]` | `page.locator('.features_items .productinfo a.add-to-cart[data-product-id="1"]')` |
| Recommended Items Section | `.recommended_items h2.title` (`recommended items`), `#recommended-item-carousel .item.active .product-image-wrapper` | `page.locator('.recommended_items')`, `page.locator('#recommended-item-carousel .item.active .product-image-wrapper').first()` |
| Added! Cart Modal | `#cartModal` (`Added!`, `Your product has been added to cart.`) | `page.locator('#cartModal')` |
| Continue Shopping Button | `#cartModal button` `"Continue Shopping"` | `page.getByRole('button', { name: 'Continue Shopping' })` |
| View Cart Modal Link | `#cartModal a[href="/view_cart"]` `"View Cart"` | `page.locator('#cartModal').getByRole('link', { name: 'View Cart' })` |
| Quantity Input (Details) | `input#quantity[type="number"][min="1"]` | `page.locator('#quantity')` |
| Add to Cart Button (Details) | `button.cart` `"Add to cart"` | `page.getByRole('button', { name: /Add to cart/i })` |
| Cart Line-Item Rows | `#cart_info_table tbody tr` (`#product-1`, `#product-2`) | `page.locator('#cart_info_table tbody tr')` |
| Delete Line Item Control | `#product-<id> .cart_delete a` | `page.locator('#product-1 .cart_delete a')` |
| Empty Cart Banner | `#empty_cart` (`Cart is empty! Click here to buy products.`) | `page.locator('#empty_cart')` |
| Proceed To Checkout CTA | `a.check_out` `"Proceed To Checkout"` | `page.locator('a.check_out')` |
| Guest Checkout Modal | `#checkoutModal` (`Register / Login`, `Continue On Cart`) | `page.locator('#checkoutModal')` |

## 5. Validation Rules, Boundary Conditions, Ad/Modal Handling & Negative Scenarios
- Quantity input enforces `type="number"` and `min="1"`.
- Recommended carousel slides rotate automatically; capturing the active slide's product name and `data-product-id` dynamically right before clicking `Add to cart` avoids slide-rotation flakiness.
- Cart page `<title>` is `Automation Exercise - Checkout` with breadcrumb `Shopping Cart`.

## 6. Testable Acceptance Criteria
- **Given** a guest visits `/view_cart` with an empty session, **Then** `"Cart is empty!"` and the `/products` link are visible (`REQ-CART-01`).
- **Given** a shopper adds product 1 (`Blue Top`, `Rs. 500`), clicks `Continue Shopping`, adds product 2 (`Men Tshirt`, `Rs. 400`), and clicks `View Cart`, **Then** both rows render with exact prices, quantities, and totals (`REQ-CART-02`).
- **Given** a shopper sets quantity `4` on `/product_details/1` and adds to cart, **Then** `/view_cart` shows quantity `4` and total `Rs. 2000` (`REQ-CART-03`).
- **Given** a shopper has 1 item in cart, **When** they click its remove button, **Then** the row disappears and `"Cart is empty!"` becomes visible (`REQ-CART-04`).
- **Given** a guest has an item in cart and clicks `Proceed To Checkout`, **Then** `#checkoutModal` appears with the `Register / Login` link (`REQ-CART-05`).
- **Given** a shopper is on `/view_cart`, **When** they subscribe in the footer with a valid email, **Then** `"You have been successfully subscribed!"` is displayed (`REQ-CART-06`).
- **Given** a shopper searches products, adds a matching product to cart, logs in, and returns to `/view_cart`, **Then** the searched product remains in the cart (`REQ-CART-07`).
- **Given** a shopper scrolls to `RECOMMENDED ITEMS` on `/` and adds an active recommended product, **Then** that product appears in `/view_cart` (`REQ-CART-08`).
