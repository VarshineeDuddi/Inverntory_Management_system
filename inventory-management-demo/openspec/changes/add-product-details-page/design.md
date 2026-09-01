## Context

Builds on the React + Vite + client-side-router stack from `add-product-list-page`, and on `product-api`'s `GET /products/:id` (`add-product-crud-api`). `add-product-list-page` already solved the "no backend stock-status field" gap for its own rows (see that change's design.md); this page needs the identical status for one product.

## Goals / Non-Goals

**Goals:**
- Fetch and render one product's full field set and derived stock status.
- Provide Stock In/Stock Out navigation entry points without building the flow they lead to.
- Reuse, not re-derive, the stock-status rule already established by `add-product-list-page`.

**Non-Goals:**
- Implementing the stock-update flow itself, or the Stock In/Out backend APIs — both belong to IMD-11 and IMD-8 respectively (Stock Operations epic, not yet proposed or assigned).
- Editing the product from this page — editing is `add-product-form-page`'s edit mode, reached separately.

## Decisions

**Stock status derivation is extracted into a shared function reused by both the Products page and this page.**
Rationale: `add-product-list-page`'s design.md already defines the exact rule (`quantity === 0` → Out of Stock; `0 < quantity <= reorder_level` → Low Stock; `quantity > reorder_level` → In Stock). Reimplementing it here risks the two pages silently drifting apart. Since that page's task list already builds this function, this change's task list moves it to a shared module instead of duplicating it.
Alternatives considered:
- *Reimplement the same rule locally* — rejected: two independent copies of one business rule is exactly the drift risk `add-product-list-page`'s own design.md flagged.

**Stock In and Stock Out navigate to placeholder routes, `/products/:id/stock-in` and `/products/:id/stock-out`.**
Rationale: IMD-7's AC only requires the actions be "visible" and "route into the stock update flow" — it doesn't require that flow to exist yet, and IMD-11 (which builds it) isn't proposed or assigned. Two distinct, product-scoped routes give IMD-11 an unambiguous place to attach its UI later, mirroring how `add-product-list-page` linked to an Add Product route before `add-product-form-page` existed.
Alternatives considered:
- *A single `/products/:id/stock?direction=in|out` route* — also viable; two explicit routes were chosen only for readability, and either satisfies the spec identically.
- *Disable/hide the actions until IMD-11 exists* — rejected: contradicts the AC's explicit requirement that they be visible now.

**Not-found handling matches `product-api`'s existing 404 contract.**
Rationale: `product-api`'s "Retrieve a single product" requirement already specifies a 404 for an unknown id; this page just needs to render that outcome as a not-found message rather than inventing new error semantics.

## Risks / Trade-offs

- [The placeholder stock-in/out routes have no destination page yet] → Acceptable: navigating there currently shows the app's default not-found/blank route until IMD-11 is built; the spec only requires the actions be visible and navigate, not that a destination page exists yet.
- [Sharing the stock-status function across two changes means this change has a real code dependency on `add-product-list-page`'s implementation, not just its spec] → Mitigation: tasks.md sequences extracting/importing that function as an explicit step, so it's done deliberately rather than assumed.

## Migration Plan

1. Requires `add-product-crud-api`'s `GET /products/:id` and `add-product-list-page`'s stock-status function to exist.
2. Add the Details page as a new route in the existing React app, and extract the stock-status function to a shared location both pages import from.
3. No backend or schema changes; no rollback beyond removing the new route.
