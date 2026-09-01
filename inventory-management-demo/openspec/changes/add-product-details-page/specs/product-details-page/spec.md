## Purpose

Defines the Product Details page's behavior: what it fetches and displays for a single product, including its computed stock status, and how the Stock In/Stock Out entry points behave.

## ADDED Requirements

### Requirement: Fetch and display a single product
The system SHALL fetch one product by id via the product API and display all of its fields.

#### Scenario: Existing product shows all fields
- **WHEN** a user opens the Details page for a product that exists
- **THEN** the page displays that product's name, sku, category, unit_price, quantity, and reorder_level

#### Scenario: Nonexistent product shows an error, not a blank page
- **WHEN** a user opens the Details page for an id that does not exist
- **THEN** the page shows a not-found message rather than a blank or broken page

### Requirement: Display computed stock status
The system SHALL display the product's stock status as "In Stock," "Low Stock," or "Out of Stock," derived from its quantity and reorder level.

#### Scenario: Quantity at zero shows Out of Stock
- **WHEN** the displayed product's quantity is zero
- **THEN** the page shows "Out of Stock"

#### Scenario: Quantity at or below the reorder level shows Low Stock
- **WHEN** the displayed product's quantity is greater than zero and less than or equal to its reorder level
- **THEN** the page shows "Low Stock"

#### Scenario: Quantity above the reorder level shows In Stock
- **WHEN** the displayed product's quantity is greater than its reorder level
- **THEN** the page shows "In Stock"

### Requirement: Stock In / Stock Out entry points
The system SHALL display visible "Stock In" and "Stock Out" actions for the product that navigate into the stock-update flow.

#### Scenario: Stock In is visible and navigable
- **WHEN** a user views the Details page for a product
- **THEN** a "Stock In" action is visible and, when selected, navigates the user into the stock-update flow for that product

#### Scenario: Stock Out is visible and navigable
- **WHEN** a user views the Details page for a product
- **THEN** a "Stock Out" action is visible and, when selected, navigates the user into the stock-update flow for that product
