## Context

No frontend framework or build tooling exists in the repository yet — only the backend (Node.js + Express + `better-sqlite3`, from `add-product-crud-api`'s design.md) has been chosen. This is the first story that needs a client, and it needs to coexist with two more pages already on the backlog (IMD-6 Add/Edit form, IMD-7 Product Details), so the choice should hold up across all three rather than being re-decided per page.

## Goals / Non-Goals

**Goals:**
- Pick a concrete frontend stack that this page, and the two UI stories after it, can share.
- Decide how stock status is computed given neither `product-catalog` nor `product-api` expose it today (see proposal.md - Impact).
- Satisfy the search, quantity/stock-status display, navigation, and responsiveness requirements in specs/product-list-page/spec.md.

**Non-Goals:**
- Server-side rendering, SEO, or any deployment/hosting concerns — this is a demo.
- Implementing the Add/Edit form or Details page themselves — only the navigation target from this page.
- Changing `product-api` to add a stock-status field — see Decisions.

## Decisions

**Frontend: React (via Vite), with a client-side router.**
Rationale: three related pages (List, Add/Edit, Details) sharing navigation and re-fetching the same product data is a natural fit for a component-based framework with client-side routing, rather than several hand-wired static HTML pages. React is the most widely known choice, minimizing onboarding cost for a demo, and Vite needs no backend integration (it talks to the existing Express API purely over HTTP).
Alternatives considered:
- *Plain HTML/CSS/vanilla JS* — would work for a single page, but three pages sharing a nav bar, routing, and API-calling logic would mean hand-rolling what a framework already provides.
- *A meta-framework (Next.js, Remix)* — brings server-rendering/routing conventions this demo doesn't need since the API is already a separate Express service.

**Stock status is computed client-side from `quantity` and `reorder_level`.**
Rationale: per proposal.md's Impact, no backend field exists for this yet, and IMD-5 doesn't declare a dependency on the (unplanned) IMD-9 stock-status story. Computing it in the UI from fields `product-api` already returns unblocks this story without waiting on or duplicating a backend change that isn't scheduled.
Rule (matches specs/product-list-page/spec.md exactly): `quantity === 0` → "Out of Stock"; `0 < quantity <= reorder_level` → "Low Stock"; `quantity > reorder_level` → "In Stock".
Alternatives considered:
- *Block this story until IMD-9 exists* — rejected: IMD-9 isn't proposed, assigned, or declared as a dependency by the BRD; blocking here would stall a story that has everything else it needs.

**Search filters client-side over the already-fetched list, not a new API query parameter.**
Rationale: `product-api`'s `GET /products` has no search/filter parameters (out of scope for IMD-3), and adding one would modify that already-proposed capability. For a demo-scale catalog, filtering the fetched array in the browser is sufficient and keeps this story's impact confined to the frontend.
Alternatives considered:
- *Add a `?q=` query param to `GET /products`* — rejected for now: would modify `product-api`'s contract, which this change's proposal explicitly avoided.

**Responsive layout via CSS (flexbox/grid + media queries), no separate mobile app or component library.**
Rationale: the AC only asks the page to work on desktop and mobile widths, not for native mobile support. Plain responsive CSS is enough and avoids a new dependency.

## Risks / Trade-offs

- [Client-computed stock status could diverge from a future backend calculation if IMD-9 is later built with different thresholds] → Mitigation: the rule is written to mirror the BRD's own three named states exactly (In Stock / Low Stock / Out of Stock) using the fields already in the schema, so it's the most literal reading of the BRD available; if IMD-9 changes the rule, this page's derivation would need updating too — noted here so that story's author sees this dependency.
- [Client-side search doesn't scale to a very large catalog] → Acceptable for a demo; not a concern at this data volume.

## Migration Plan

1. Requires `add-product-crud-api`'s `GET /products` endpoint to exist and be running.
2. Scaffold the React app and add the Products page as its initial route.
3. No backend or schema changes; no rollback beyond removing the frontend code.
