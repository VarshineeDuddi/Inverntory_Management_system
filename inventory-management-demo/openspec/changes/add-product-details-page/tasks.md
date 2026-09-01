## 1. Shared stock-status utility

- [ ] 1.1 Extract the stock-status derivation function built for `add-product-list-page` into a shared module, and update that page to import it from the shared location, and verify the Products page's existing tests still pass unchanged
- [ ] 1.2 Verify the extracted function still produces the same three outcomes (Out of Stock at 0, Low Stock at/below reorder level, In Stock above it) via a quick unit check

## 2. Product Details page

- [ ] 2.1 Add a Details route/component that fetches one product via `GET /products/:id` on load, and verify it renders name, sku, category, unit_price, quantity, and reorder_level for a seeded product
- [ ] 2.2 Render the derived stock status using the shared function from 1.1, and verify it matches the same product's status as shown on the Products page
- [ ] 2.3 Handle a 404 response by showing a not-found message instead of a blank page, and verify it against a nonexistent id

## 3. Stock In / Stock Out entry points

- [ ] 3.1 Add a visible "Stock In" action that navigates to `/products/:id/stock-in`, and verify the navigation occurs even though that route has no page yet
- [ ] 3.2 Add a visible "Stock Out" action that navigates to `/products/:id/stock-out`, and verify the navigation occurs even though that route has no page yet

## 4. Verification suite

- [ ] 4.1 Add automated tests covering every scenario in specs/product-details-page/spec.md: full field display, not-found handling, all three stock-status outcomes, and both Stock In/Stock Out navigations — verify the test suite exits 0
