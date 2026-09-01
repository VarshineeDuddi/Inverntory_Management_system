## 1. Shared validation function

- [ ] 1.1 Implement a validation function that checks `name` and `sku` are present and non-blank, and verify it returns a field-identifying error for each when missing/blank and no error when both are present
- [ ] 1.2 Add a non-negative/numeric check for `unit_price`, `quantity`, and `reorder_level` to the same function, and verify it returns a field-identifying error for a negative or non-numeric value on each field, and no error for zero or a positive number
- [ ] 1.3 Add a sku-uniqueness pre-check that queries the `products` table for an existing row with the same sku (excluding the current record's own id on update), and verify it returns a field-identifying error when a duplicate exists and no error when the sku is unused

## 2. Wire validation into the create/update handlers

- [ ] 2.1 Call the validation function at the start of the `POST /products` handler before the database insert, and verify an invalid payload never reaches the insert call (no row is created) and returns the validation's 4xx error
- [ ] 2.2 Call the validation function at the start of the `PUT`/`PATCH /products/:id` handler before the database update, treating a field as invalid only when the request includes it as blank (not when it's simply omitted from a partial update), and verify an invalid update never reaches the database call and leaves the existing record unchanged
- [ ] 2.3 Confirm `add-product-crud-api`'s existing DB-constraint-error mapping still runs as a fallback (unchanged), and verify a request crafted to bypass the pre-check (e.g. a forced race/duplicate) still returns a 4xx rather than a 500 or an unhandled exception

## 3. Verification suite

- [ ] 3.1 Add automated tests covering every scenario in specs/product-validation/spec.md: missing/blank name on create, missing/blank sku on create, blanking name on update, blanking sku on update, and that every validation failure's error message names the specific field and reason — verify the test suite exits 0
- [ ] 3.2 Add a regression test confirming valid creates/updates (all fields present, unique sku, non-negative numerics) still succeed end-to-end through the new validation step — verify it passes alongside the existing add-product-crud-api test suite
