## Why

There is no client-facing view of the product catalog yet — `add-product-crud-api` exposes the data over HTTP, but nothing renders it. Users need a single page that lists every product, lets them search it, and shows enough at a glance (quantity, stock status) to act on, with a way to start adding a new one.

Source of truth: Zoho Sprints item **IMD-5** ("Build Product List page with search", epic: Product Catalog Management).

## What Changes

- Add a Products page that fetches and lists all products from `GET /products`.
- Add a search box that filters the visible list by product name or SKU.
- Show each product's current quantity and a derived stock status (In Stock / Low Stock / Out of Stock) per row.
- Add an "Add Product" action that navigates to the Add/Edit Product form (built separately in IMD-6).
- Make the page responsive on desktop and mobile.

## Capabilities

### New Capabilities
- `product-list-page`: The Products page's behavior — what it fetches and displays, how search filters it, how stock status is derived and shown, and how it navigates to product creation.

### Modified Capabilities
- None. This change is a new client surface over the already-proposed `product-api`; it does not change that capability's HTTP contract.

## Impact

- **Affected code**: New frontend page/route; no backend changes. Reads `product-api` (`add-product-crud-api`, IMD-3) exclusively — no new endpoints are needed.
- **New tooling decision**: No frontend framework or build tooling exists anywhere in the repo yet (only the backend stack was chosen, in `add-product-crud-api`'s design.md). This change must make that call; see design.md.
- **Stock status gap**: The BRD calls for showing "stock status (In Stock / Low Stock / Out of Stock)" per product, but neither `product-catalog` nor `product-api` expose a computed stock-status field — they only expose the raw `quantity` and `reorder_level`. A separate backlog story (IMD-9, "Implement automatic stock status calculation," Stock Operations epic, not yet proposed or assigned) suggests this may eventually become a backend-computed field. IMD-5 does not list IMD-9 as a dependency, so this proposal derives stock status on the client from the existing fields; design.md documents the exact rule and the risk of it later diverging from a backend implementation.
- **Downstream**: The "Add Product" action links to the Add/Edit Product form built in IMD-6 (not yet proposed).
