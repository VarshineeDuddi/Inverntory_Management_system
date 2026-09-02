## Purpose

Defines the behavior of the Products page: what it displays, how search filters it, how each row's stock status is derived, and how a user starts adding a new product.

## ADDED Requirements

### Requirement: List all products
The system SHALL display every product returned by the product API when the page loads.

#### Scenario: Page load shows all products
- **WHEN** a user opens the Products page
- **THEN** every product currently in the catalog is listed

#### Scenario: Empty catalog shows an empty state
- **WHEN** a user opens the Products page and no products exist
- **THEN** the page shows an empty state rather than an error or a blank screen

### Requirement: Search by name or SKU
The system SHALL filter the displayed product list to only those whose name or SKU matches the user's search input.

#### Scenario: Searching by partial name
- **WHEN** a user types text that partially matches one or more products' names
- **THEN** only the matching products remain visible

#### Scenario: Searching by partial SKU
- **WHEN** a user types text that partially matches one or more products' SKUs
- **THEN** only the matching products remain visible

#### Scenario: Search with no matches
- **WHEN** a user's search text matches no product's name or SKU
- **THEN** the list shows no rows and indicates that no products matched, rather than showing every product

#### Scenario: Clearing the search restores the full list
- **WHEN** a user clears the search input
- **THEN** every product is shown again

### Requirement: Row shows quantity and stock status
The system SHALL display each product's current quantity and a stock status of "In Stock," "Low Stock," or "Out of Stock."

#### Scenario: Quantity at or below zero shows Out of Stock
- **WHEN** a product's quantity is zero
- **THEN** its row shows "Out of Stock"

#### Scenario: Quantity at or below the reorder level shows Low Stock
- **WHEN** a product's quantity is greater than zero and less than or equal to its reorder level
- **THEN** its row shows "Low Stock"

#### Scenario: Quantity above the reorder level shows In Stock
- **WHEN** a product's quantity is greater than its reorder level
- **THEN** its row shows "In Stock"

### Requirement: Navigate to add a product
The system SHALL provide an "Add Product" action that takes the user to the Add/Edit Product form.

#### Scenario: Add Product navigates to the form
- **WHEN** a user selects "Add Product"
- **THEN** the user is taken to the Add/Edit Product form in create mode

### Requirement: Responsive layout
The system SHALL render the Products page usably on both desktop and mobile viewport widths.

#### Scenario: Mobile viewport remains usable
- **WHEN** the Products page is viewed on a mobile-width screen
- **THEN** the product list, search box, and Add Product action are all visible and usable without horizontal scrolling
