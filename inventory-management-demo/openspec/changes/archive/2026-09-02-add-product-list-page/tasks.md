## 1. Frontend project setup

- [x] 1.1 Scaffold a React app with Vite and add a client-side router, and verify `npm run dev` serves a blank app without errors
- [x] 1.2 Add an API client function that calls `GET /products` against the Express backend and returns the parsed `data` array, and verify it resolves with the seeded products in a manual/dev-server check

## 2. Products page

- [x] 2.1 Implement the Products page route that fetches and renders all products on load, and verify it against both an empty and a populated backend (empty state vs. full list)
- [x] 2.2 Add a search input that filters the rendered list by case-insensitive partial match on name or SKU, and verify: partial name match, partial SKU match, no-match state, and clearing the input restores the full list
- [x] 2.3 Add a stock-status derivation function implementing the rule from design.md (quantity 0 → Out of Stock; 0 < quantity <= reorder_level → Low Stock; quantity > reorder_level → In Stock), and verify it against boundary cases (0, exactly at reorder_level, one above reorder_level)
- [x] 2.4 Render each row with quantity and its derived stock status, and verify the displayed status matches 2.3's function for each seeded product
- [x] 2.5 Add an "Add Product" control that navigates to the Add/Edit Product form route in create mode, and verify the navigation occurs (route change) even though the form itself isn't built yet

## 3. Responsive layout

- [x] 3.1 Style the page with responsive CSS (flexbox/grid + media queries) so the list, search box, and Add Product action remain usable without horizontal scrolling, and verify by checking the page at a mobile viewport width and a desktop viewport width

## 4. Verification suite

- [x] 4.1 Add automated tests (e.g. React Testing Library) covering every scenario in specs/product-list-page/spec.md: full list on load, empty state, name search, SKU search, no-match search, cleared search, all three stock-status boundaries, and the Add Product navigation — verify the test suite exits 0
