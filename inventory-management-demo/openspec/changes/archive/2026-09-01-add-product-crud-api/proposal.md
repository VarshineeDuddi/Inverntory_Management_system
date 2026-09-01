## Why

The Product Catalog Management epic has no way to read or write product data over HTTP yet. The Product List/Add-Edit/Details UI stories, and any other client, need CRUD endpoints to operate against the `products` schema before they can be built.

Source of truth: Zoho Sprints item **IMD-3** ("Implement Product CRUD REST APIs", epic: Product Catalog Management).

## What Changes

- Add `GET /products` to list all products.
- Add `GET /products/:id` to fetch a single product, returning 404 when it doesn't exist.
- Add `POST /products` to create a product and return the created record.
- Add `PUT`/`PATCH /products/:id` to update an existing product and return the updated record.
- Standardize response shape and HTTP status codes across all four endpoints.

## Capabilities

### New Capabilities
- `product-api`: HTTP contract for reading and writing product records — request/response shapes, status codes, and error behavior for list, get-by-id, create, and update.

### Modified Capabilities
- None. `product-catalog` (proposed in `add-product-database-schema`, not yet archived into main specs) defines the underlying data model these endpoints read and write, but this change does not alter its requirements.

## Impact

- **Affected code**: New backend API surface; no existing API code today (the repository has no application code yet, per the `add-product-database-schema` change's design.md).
- **Dependency**: Depends on `add-product-database-schema` (Zoho IMD-2) for the `products` schema. That change is proposed but not yet applied/archived — this proposal assumes its schema and design decisions (SQLite, `products` table with `id`, `name`, `sku`, `category`, `unit_price`, `quantity`, `reorder_level`, `created_at`, `updated_at`) will land first, and does not re-litigate them.
- **New tooling decision**: No backend language/framework has been chosen anywhere in the repo or prior change (that was explicitly deferred as a Non-Goal in `add-product-database-schema`'s design.md). This change must make that call; see design.md.
- **Downstream stories unblocked**: Product List/Add-Edit/Details UI stories consume these endpoints.
