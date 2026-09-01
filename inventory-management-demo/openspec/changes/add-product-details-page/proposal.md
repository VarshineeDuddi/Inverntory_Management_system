## Why

There is no way to view a single product's full information yet — the Products page (`add-product-list-page`) only shows list rows. Users need a details view that shows everything about one product and gives them a way into the (separately scheduled) stock-adjustment flow.

Source of truth: Zoho Sprints item **IMD-7** ("Build Product Details page", epic: Product Catalog Management).

## What Changes

- Add a Product Details page that fetches one product via `GET /products/:id`.
- Display all of that product's fields plus its computed stock status.
- Add visible "Stock In" and "Stock Out" actions that navigate into the stock-update flow.

## Capabilities

### New Capabilities
- `product-details-page`: The Product Details page's behavior — what it fetches and displays, how stock status is derived, and how the Stock In/Stock Out entry points navigate.

### Modified Capabilities
- None. This is a new client surface over the already-proposed `product-api`; it does not change that capability's contract.

## Impact

- **Affected code**: New frontend page/route, built on the React + Vite + client-side-router stack chosen in `add-product-list-page`'s design.md.
- **Dependency**: Depends on `add-product-crud-api` (IMD-3) for `GET /products/:id`.
- **Stock status reuse**: Like `add-product-list-page`, this page needs a computed stock status that no backend capability provides yet. This change reuses that page's exact derivation rule rather than re-deciding it, so the two pages never disagree about a product's status.
- **Stock In/Out scope boundary**: The BRD's "Implement Stock In and Stock Out APIs" (IMD-8) and "Build Stock In / Stock Out actions on Product Details" (IMD-11) are separate, not-yet-proposed backlog stories (Stock Operations epic, currently unassigned). IMD-7's own AC only asks that Stock In/Out actions be "visible and route into the stock update flow" — not that this change implement stock adjustment itself. Design.md defines the navigation target as a placeholder route that IMD-11 will later fill in, so this story doesn't block on or duplicate that unscheduled work.
