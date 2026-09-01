## Why

The Inventory Management Demo has no persistence layer yet. Every downstream story — Product CRUD APIs, product validation, the Product List/Add-Edit/Details UI, and later Stock Operations — depends on a place to store product records. This is the foundation story (Zoho Sprints IMD-2, no dependencies) and must land first.

Source of truth: Zoho Sprints item **IMD-2** ("Design and create Product database schema", epic: Product Catalog Management).

## What Changes

- Add a `products` table/schema to persist product records for the demo, per the BRD's Product Information fields.
- Columns: `id` (PK), `name`, `sku`, `category`, `unit_price`, `quantity`, `reorder_level`, `created_at`, `updated_at`.
- Enforce a unique constraint on `sku` at the database level.
- Enforce that `unit_price`, `quantity`, and `reorder_level` are numeric and non-negative.
- Add a migration/seed script that creates the table cleanly from an empty database.

## Capabilities

### New Capabilities
- `product-catalog`: Data model and persistence contract for a Product record — required fields, the unique `sku` constraint, and non-negative numeric constraints on `unit_price`, `quantity`, and `reorder_level`.

### Modified Capabilities
- None — this repository currently has no application code or schema, so there is nothing existing to modify.

## Impact

- **Repository state**: `inventory-management-demo/` currently has no application code, database, or ORM/migration tooling — this change establishes the first persisted data model. The choice of database engine and migration tool is an open decision to resolve in `design.md`, since neither the BRD nor the current repo dictates one.
- **Affected systems**: New `products` table only. No existing APIs, UI, or other tables are touched.
- **Downstream stories unblocked**: Product CRUD REST APIs (IMD-3), product validation and business rules (IMD-4), and the Product List/Add-Edit/Details UI stories all read or write through this schema.
