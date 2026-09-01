## Purpose

Defines the HTTP contract for reading and writing product records, so UI and other clients have a stable, predictable API to build against regardless of how the underlying storage is implemented.

## ADDED Requirements

### Requirement: List products
The system SHALL provide an endpoint that returns all product records.

#### Scenario: Listing returns all products
- **WHEN** a client requests the product list
- **THEN** the response includes every existing product record with a success status code

#### Scenario: Listing with no products returns an empty list
- **WHEN** a client requests the product list and no products exist
- **THEN** the response is a success status code with an empty list, not an error

### Requirement: Retrieve a single product
The system SHALL provide an endpoint that returns one product record by id, or a not-found error if no product with that id exists.

#### Scenario: Retrieving an existing product
- **WHEN** a client requests a product by an id that exists
- **THEN** the response includes that product's full record with a success status code

#### Scenario: Retrieving a nonexistent product
- **WHEN** a client requests a product by an id that does not exist
- **THEN** the response is a 404 Not Found and includes no product data

### Requirement: Create a product
The system SHALL provide an endpoint that creates a new product record from client-supplied data and returns the created record.

#### Scenario: Creating a valid product
- **WHEN** a client submits product data that satisfies the product record's validity rules (required fields, unique sku, non-negative numeric fields)
- **THEN** the system persists the new record and returns it, including its assigned id and timestamps, with a success status code indicating creation

#### Scenario: Creating an invalid product is rejected
- **WHEN** a client submits product data that violates the product record's validity rules (e.g. a duplicate sku, or a negative or non-numeric price/quantity/reorder level)
- **THEN** the system rejects the request with a 4xx error, persists no record, and the response identifies the request as invalid

### Requirement: Update a product
The system SHALL provide an endpoint that updates an existing product record by id and returns the updated record.

#### Scenario: Updating an existing product
- **WHEN** a client submits new values for a product that exists
- **THEN** the system persists the changes and returns the updated record with a success status code

#### Scenario: Updating a nonexistent product
- **WHEN** a client submits an update for an id that does not exist
- **THEN** the response is a 404 Not Found and no record is created or modified

#### Scenario: Updating with invalid data is rejected
- **WHEN** a client submits an update that would violate the product record's validity rules (e.g. a duplicate sku, or a negative or non-numeric price/quantity/reorder level)
- **THEN** the system rejects the request with a 4xx error and the existing record is left unchanged

### Requirement: Consistent response format
The system SHALL use a consistent JSON response structure and appropriate HTTP status codes across all product endpoints.

#### Scenario: Successful responses share a structure
- **WHEN** any product endpoint completes successfully
- **THEN** the response body is JSON and follows the same success structure used by the other product endpoints, with a 2xx status code

#### Scenario: Error responses share a structure
- **WHEN** any product endpoint fails (validation error or not-found)
- **THEN** the response body is JSON and follows the same error structure used by the other product endpoints, with a status code matching the failure type (404 for not-found, 4xx for invalid input)
