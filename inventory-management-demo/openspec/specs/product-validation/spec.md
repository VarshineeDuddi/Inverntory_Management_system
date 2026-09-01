# product-validation Specification

## Purpose

Defines the business-rule validation contract applied to every product create/update request, so invalid data is rejected before it reaches the database rather than relying on a downstream storage error.

## Requirements

### Requirement: Required fields on create
The system SHALL require `name` and `sku` to be present and non-blank when creating a product.

#### Scenario: Creating without a name is rejected
- **WHEN** a client submits a create request with no `name` or a blank `name`
- **THEN** the system rejects the request with a 4xx error, persists no record, and the error message identifies `name` as the invalid field

#### Scenario: Creating without a sku is rejected
- **WHEN** a client submits a create request with no `sku` or a blank `sku`
- **THEN** the system rejects the request with a 4xx error, persists no record, and the error message identifies `sku` as the invalid field

### Requirement: Required fields cannot be blanked on update
The system SHALL reject an update that would set `name` or `sku` to blank on an existing product.

#### Scenario: Updating a product to a blank name is rejected
- **WHEN** a client submits an update setting `name` to blank for a product that exists
- **THEN** the system rejects the request with a 4xx error, leaves the existing record unchanged, and the error message identifies `name` as the invalid field

#### Scenario: Updating a product to a blank sku is rejected
- **WHEN** a client submits an update setting `sku` to blank for a product that exists
- **THEN** the system rejects the request with a 4xx error, leaves the existing record unchanged, and the error message identifies `sku` as the invalid field

### Requirement: Validation failures identify the offending field
The system SHALL ensure every business-rule validation failure on a create or update request — including a missing required field, a duplicate sku, or a negative or non-numeric `unit_price`, `quantity`, or `reorder_level` — returns a 4xx response whose error message names the specific field that failed and the reason.

#### Scenario: A validation error names the field and reason
- **WHEN** a create or update request fails any business rule (required field, unique sku, or non-negative numeric field)
- **THEN** the 4xx response's error message states which field was invalid and why (e.g. "sku already exists", "unit_price cannot be negative", "name is required"), not a generic failure message
