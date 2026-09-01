# product-catalog Specification

## Purpose

Defines the data model and persistence guarantees for a Product record, so every other Inventory Management Demo capability (CRUD APIs, validation, catalog UI, stock operations) can rely on a single, consistent representation of a product.

## Requirements

### Requirement: Product record fields
The system SHALL persist a product record with the fields: `id` (unique identifier), `name`, `sku`, `category`, `unit_price`, `quantity`, `reorder_level`, `created_at`, and `updated_at`.

#### Scenario: Creating a product persists all fields
- **WHEN** a product is created with a name, sku, category, unit_price, quantity, and reorder_level
- **THEN** the stored record retains all of those field values plus a unique id, a created_at timestamp, and an updated_at timestamp

#### Scenario: Updating a product refreshes updated_at
- **WHEN** an existing product record is modified
- **THEN** the record's updated_at timestamp changes while created_at remains unchanged

### Requirement: Unique SKU
The system SHALL enforce that `sku` is unique across all product records.

#### Scenario: Duplicate sku is rejected
- **WHEN** a product is created or updated with a sku that already belongs to a different product record
- **THEN** the system rejects the write and no duplicate record is persisted

### Requirement: Non-negative numeric fields
The system SHALL require `unit_price`, `quantity`, and `reorder_level` to be numeric values greater than or equal to zero.

#### Scenario: Negative value is rejected
- **WHEN** a product is created or updated with a negative unit_price, quantity, or reorder_level
- **THEN** the system rejects the write and no record is persisted with that value

#### Scenario: Non-numeric value is rejected
- **WHEN** a product is created or updated with a non-numeric unit_price, quantity, or reorder_level
- **THEN** the system rejects the write and no record is persisted with that value

#### Scenario: Zero is accepted
- **WHEN** a product is created with unit_price, quantity, or reorder_level equal to zero
- **THEN** the system accepts the write and persists the zero value

### Requirement: Clean schema provisioning
The system SHALL provide a migration that creates the product schema, including the fields and constraints above, on an empty database without manual intervention.

#### Scenario: Fresh database migration succeeds
- **WHEN** the migration is run against a database with no existing product schema
- **THEN** the product schema is created successfully and is immediately ready to store product records
