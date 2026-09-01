## 1. Project setup

- [x] 1.1 Initialize a Node.js project (`package.json`) and add `express` and `better-sqlite3` as dependencies, and verify `npm install` completes without error
- [x] 1.2 Create an Express app entry point that opens the SQLite file produced by `add-product-database-schema`'s migration, and verify the server starts and listens without throwing

## 2. Data access layer

- [x] 2.1 Add a query function that selects all rows from `products`, and verify it returns an empty array against a freshly migrated, unseeded database
- [x] 2.2 Add a query function that selects one product by `id`, and verify it returns `undefined`/null for an id that doesn't exist and the row for one that does
- [x] 2.3 Add a query function that inserts a product and returns the created row (including generated `id`, `created_at`, `updated_at`), and verify a valid insert returns a fully populated record
- [x] 2.4 Add a query function that updates a product by `id` and returns the updated row, and verify `updated_at` changes while `created_at` does not
- [x] 2.5 Add a helper that inspects a thrown `better-sqlite3` constraint error and classifies it as "duplicate sku" or "invalid numeric field" vs. an unrecognized error, and verify it correctly classifies a forced unique-constraint violation and a forced check-constraint violation in isolation

## 3. Route handlers

- [x] 3.1 Implement `GET /products` returning the success envelope `{ "data": [...] }` with 200, and verify it against both an empty and a populated database
- [x] 3.2 Implement `GET /products/:id` returning `{ "data": {...} }` with 200 for an existing id, and `{ "error": { "message": ... } }` with 404 for a nonexistent id
- [x] 3.3 Implement `POST /products` returning `{ "data": {...} }` with 201 on success, and `{ "error": { "message": ... } }` with 400 when the insert violates a database constraint (duplicate sku, negative/non-numeric field)
- [x] 3.4 Implement `PUT`/`PATCH /products/:id` returning `{ "data": {...} }` with 200 on success, 404 when the id doesn't exist, and 400 with the error envelope when the update violates a database constraint

## 4. Verification suite

- [x] 4.1 Add an automated test suite (e.g. supertest against the Express app) covering every scenario in specs/product-api/spec.md: list (empty and populated), get-by-id (found and 404), create (valid and constraint-violating), update (valid, 404, and constraint-violating), and that success/error responses consistently follow the two envelope shapes — verify the test suite exits 0
