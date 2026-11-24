# PRD: Catalog, Search & Product Details (`catalog-search`)

## 1. Module Overview, Business Objective & Risk Priority
- **Module Slug**: `catalog-search`
- **Business Objective**: Enable users to discover all 34 catalog products, filter accurately by keyword, category hierarchy, or brand, inspect complete product details, and submit product reviews.
- **Risk Priority**: **High** (core product discovery funnel).

## 2. Entry Points, Routes & Preconditions
- **Routes**: `/products`, `/products?search=<query>`, `/category_products/<id>`, `/brand_products/<brand>`, `/product_details/<id>`.
- **Preconditions**: Accessible by both Guest and Authenticated users.

## 3. Atomic Functional Requirements
- **REQ-CAT-01**: `/products` MUST display title `Automation Exercise - All Products`, heading `All Products`, the search bar (`Search Product`), Category/Brand sidebars, and all 34 catalog product cards.
- **REQ-CAT-02**: Submitting a matching keyword (e.g., `Top`) in the product search bar MUST update the catalog heading to `Searched Products` and display matching product cards (14 matches for `Top`, including `Blue Top`).
- **REQ-CAT-03**: Submitting a non-matching search keyword (e.g., `NonExistentZebraItem999`) MUST render heading `Searched Products` and `0` product cards without crashing or displaying stale items.
- **REQ-CAT-04**: Expanding a sidebar category accordion (`Women`, `Men`, `Kids`) and selecting a subcategory (e.g., `Women` → `Dress` at `/category_products/1`) MUST display the category heading matching `/Women\s*-\s*Dress Products/i` and filtered product cards (3 items).
- **REQ-CAT-05**: Selecting a sidebar brand (e.g., `Polo` at `/brand_products/Polo`) MUST display the brand heading matching `/Brand\s*-\s*Polo Products/i` and the brand's exact product set (6 items).
- **REQ-CAT-06**: Opening `/product_details/1` via `View Product` MUST render product name (`Blue Top`), category (`Category: Women > Tops`), price (`Rs. 500`), availability (`Availability: In Stock`), condition (`Condition: New`), brand (`Brand: Polo`), and a `Write Your Review` form that accepts valid name/email/review and displays `"Thank you for your review."`.

## 4. Verified UI Inventory & Resilient Locators (Live-Inspected)

| UI Element | Verified DOM Details | Resilient Locator Strategy |
| :--- | :--- | :--- |
| Catalog / Search Heading | `.features_items h2.title` (`All Products`, `Searched Products`, `Women - Dress Products`, `Brand - Polo Products`) | `page.locator('.features_items h2.title')` |
| Search Input | `input#search_product[placeholder="Search Product"]` | `page.getByPlaceholder('Search Product')` |
| Search Submit Button | `button#submit_search` | `page.locator('#submit_search')` |
| Product Cards | `.features_items .product-image-wrapper` | `page.locator('.features_items .product-image-wrapper')` |
| View Product Link | `.choose a[href="/product_details/1"]` (`View Product`) | `page.locator('.product-image-wrapper').first().getByRole('link', { name: /View Product/i })` |
| Category Accordions | `#accordian a[href="#Women"]`, `#Women a` (`Dress`, `Tops`, `Saree`) | `page.locator('#accordian').getByRole('link', { name: /Women/i })` |
| Brand Filter Links | `.brands_products a[href="/brand_products/Polo"]` | `page.locator('.brands_products').getByRole('link', { name: /Polo/i })` |
| Product Detail Container | `.product-information` (`h2`, `p`, `span > span`) | `page.locator('.product-information')` |
| Review Form Inputs | `#name` (`Your Name`), `#email` (`Email Address`), `#review` (`Add Review Here!`), `#button-review` (`Submit`) | `page.getByPlaceholder('Your Name')`, `page.getByPlaceholder('Email Address', { exact: true })`, `page.getByPlaceholder('Add Review Here!')`, `page.getByRole('button', { name: 'Submit' })` |
| Review Success Alert | `#review-section .alert-success` `"Thank you for your review."` | `page.locator('#review-section .alert-success')` |

## 5. Validation Rules, Boundary Conditions, Ad/Modal Handling & Negative Scenarios
- Category and brand headings include non-breaking spaces (`\u00a0`); assertions MUST normalize whitespace via regex.
- Zero-result search returns empty `.features_items .product-image-wrapper` list (`count === 0`).
- Review fields (`#name`, `#email`, `#review`) are all HTML5 `required`.

## 6. Testable Acceptance Criteria
- **Given** a user opens `/products`, **Then** `All Products` heading and 34 product cards are displayed (`REQ-CAT-01`).
- **Given** a user searches for `Top`, **Then** `Searched Products` heading is visible and all returned items are rendered (`REQ-CAT-02`).
- **Given** a user searches for a non-existent keyword, **Then** `Searched Products` heading is visible with 0 product cards (`REQ-CAT-03`).
- **Given** a user filters by `Women` → `Dress`, **Then** the heading matches `Women - Dress Products` and 3 products are listed (`REQ-CAT-04`).
- **Given** a user filters by brand `Polo`, **Then** the heading matches `Brand - Polo Products` and 6 products are listed (`REQ-CAT-05`).
- **Given** a user opens Product Details for `Blue Top`, **When** they verify metadata and submit a review, **Then** `"Thank you for your review."` is displayed (`REQ-CAT-06`).
