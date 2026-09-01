## Why

There is no way to create or edit a product yet — `add-product-crud-api` exposes the write endpoints and `add-product-validation-rules` defines what makes a submission valid, but nothing in the client lets a user fill in and submit that data. The Products page (`add-product-list-page`) already links to an "Add Product" destination that doesn't exist yet.

Source of truth: Zoho Sprints item **IMD-6** ("Build Add/Edit Product form UI", epic: Product Catalog Management).

## What Changes

- Add a product form covering `name`, `sku`, `category`, `unit_price`, `quantity`, and `reorder_level`, usable in both create (Add) and edit modes.
- Validate `name` and `sku` as required on the client before allowing submit.
- On submit, call `POST /products` (create mode) or `PUT`/`PATCH /products/:id` (edit mode), and show a clear success or error message.
- Surface a backend duplicate-sku rejection to the user in an understandable way (not a raw error dump).

## Capabilities

### New Capabilities
- `product-form-page`: The Add/Edit Product form's behavior — which fields it captures, client-side required-field validation, how it calls create/update, and how success and backend errors (including duplicate sku) are shown to the user.

### Modified Capabilities
- None. This is a new client surface over the already-proposed `product-api` and `product-validation` capabilities; it does not change either capability's contract.

## Impact

- **Affected code**: New frontend page/route, built on the React + Vite + client-side-router stack chosen in `add-product-list-page`'s design.md.
- **Dependency**: Depends on `add-product-crud-api` (IMD-3, create/update endpoints) and `add-product-validation-rules` (IMD-4, the required-field and duplicate-sku rules the form must anticipate and surface). Neither has been applied/archived yet.
- **Upstream**: Fulfills the "Add Product" navigation target already referenced by `add-product-list-page` (IMD-5).
- **Client vs. server validation duplication**: `add-product-validation-rules` already enforces required fields and sku uniqueness server-side. This change adds client-side required-field checks for responsiveness (per IMD-6's own AC) without replacing the server-side checks; design.md addresses how the two stay consistent.
