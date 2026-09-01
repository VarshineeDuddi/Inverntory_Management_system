## Purpose

Defines the Add/Edit Product form's behavior: which fields it captures, what it validates before submit, how it submits to the backend in each mode, and how success and error outcomes (including a duplicate sku) are shown to the user.

## ADDED Requirements

### Requirement: Form fields
The system SHALL provide fields for `name`, `sku`, `category`, `unit_price`, `quantity`, and `reorder_level`.

#### Scenario: All fields are presented
- **WHEN** a user opens the form in either create or edit mode
- **THEN** inputs for name, sku, category, unit_price, quantity, and reorder_level are all present

### Requirement: Create and edit modes
The system SHALL support both a create mode, which starts with empty fields, and an edit mode, which starts pre-filled with an existing product's current values.

#### Scenario: Create mode starts empty
- **WHEN** a user opens the form to add a new product
- **THEN** every field starts empty (or at a neutral default) rather than showing another product's data

#### Scenario: Edit mode starts pre-filled
- **WHEN** a user opens the form to edit an existing product
- **THEN** every field is pre-filled with that product's current values

### Requirement: Client-side required-field validation
The system SHALL prevent a submit that leaves `name` or `sku` blank, and tell the user which field needs a value, without a round trip to the backend.

#### Scenario: Submitting with a blank name is blocked client-side
- **WHEN** a user attempts to submit with `name` blank
- **THEN** the submit is prevented, no request is sent to the backend, and the user is shown that `name` is required

#### Scenario: Submitting with a blank sku is blocked client-side
- **WHEN** a user attempts to submit with `sku` blank
- **THEN** the submit is prevented, no request is sent to the backend, and the user is shown that `sku` is required

### Requirement: Submit calls the backend and reports the outcome
The system SHALL submit a create request via the create endpoint in create mode, or an update request via the update endpoint in edit mode, and SHALL show the user a clear success or error message based on the response.

#### Scenario: Successful create shows a success message
- **WHEN** a create submission is accepted by the backend
- **THEN** the user sees a clear confirmation that the product was created

#### Scenario: Successful edit shows a success message
- **WHEN** an edit submission is accepted by the backend
- **THEN** the user sees a clear confirmation that the product was updated

#### Scenario: A backend rejection shows an error message
- **WHEN** the backend rejects a submission
- **THEN** the user sees an error message rather than a silent failure or an unhandled exception

### Requirement: Duplicate-sku errors are surfaced clearly
The system SHALL detect a duplicate-sku rejection from the backend and present it to the user in a way that identifies the sku as the problem, not as a raw or generic error.

#### Scenario: Duplicate sku on submit
- **WHEN** the backend rejects a submission because the sku already exists on another product
- **THEN** the user sees a message identifying that the sku is already in use, not a raw HTTP error or a generic "request failed" message
