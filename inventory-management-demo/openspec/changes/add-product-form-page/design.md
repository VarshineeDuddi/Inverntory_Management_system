## Context

`add-product-list-page` already chose the frontend stack (React + Vite, client-side router) that this form is built into as a second route. `add-product-crud-api` defines `POST /products` / `PUT`/`PATCH /products/:id` and their `{ "data": ... }` / `{ "error": { "message": ... } }` response envelope; `add-product-validation-rules` guarantees every validation failure's error message names the offending field (e.g. "sku already exists," "name is required").

## Goals / Non-Goals

**Goals:**
- Reuse the existing frontend stack rather than introducing a new one.
- Satisfy IMD-6's exact client-side validation scope: required-field checks only, before submit.
- Show backend errors, including duplicate-sku, using the field-identifying messages the backend already guarantees.

**Non-Goals:**
- Client-side numeric/non-negative validation for `unit_price`, `quantity`, `reorder_level` — IMD-6's AC only calls out client-side validation for the required fields (name, sku); numeric checks remain server-side (`add-product-validation-rules`) and surface through the generic backend-error path.
- Building the Product Details page (IMD-7) or changing the Products page (IMD-5) beyond it already linking here.
- Optimistic updates, draft-saving, or offline support.

## Decisions

**No form library; plain React controlled-component state.**
Rationale: six fields with one validation rule (required name/sku) doesn't justify a dependency like Formik or React Hook Form. Controlled inputs backed by local component state are enough and keep the bundle and learning curve minimal for a demo.
Alternatives considered:
- *A form library* — rejected as unnecessary complexity for this scope.

**Client-side required-field validation mirrors the server rule but does not call it.**
Rationale: specs/product-form-page/spec.md requires blocking a blank name/sku "without a round trip to the backend." The client re-implements the same two checks (`name` non-blank, `sku` non-blank) that `add-product-validation-rules`'s server-side validation already enforces. This is intentional, minimal duplication of a two-field rule, not a client reimplementation of the full validation rule set (numeric checks and sku-uniqueness stay server-only, since only the server can check uniqueness against the database).

**Backend error messages are displayed directly, not re-parsed or re-worded.**
Rationale: `add-product-validation-rules`'s design already commits to field-identifying, human-readable messages (e.g. "sku already exists"). Displaying `error.message` from the response envelope as-is satisfies "identifies that sku is the problem, not a raw or generic error" without building fragile string-matching or a second error-classification layer on the client. If the backend's message wording ever needs to change, only one place (the backend) needs updating.
Alternatives considered:
- *Client-side error-code-to-message mapping* — rejected: `add-product-crud-api`'s error envelope only carries a message string, no structured error code, so there is nothing more specific to key off; re-deriving one on the client would duplicate logic the backend already owns.

**Edit mode loads the existing product via the same `GET /products/:id` used by the (not-yet-built) Details page.**
Rationale: reuses an endpoint `product-api` already defines rather than inventing a new one; the edit route is entered with a product id and fetches that record to pre-fill the form.

## Risks / Trade-offs

- [Relying on the backend's message text for duplicate-sku detection couples the UI's correctness to that exact wording] → Mitigation: `add-product-validation-rules`'s spec already contractually guarantees the message names the field and reason, so this is a stable, spec-backed contract, not an incidental string.
- [Only required-field validation runs before the network round trip; a bad numeric value still requires a submit-and-fail cycle] → Accepted per Non-Goals; matches IMD-6's literal AC scope.

## Migration Plan

1. Requires `add-product-crud-api`'s create/update endpoints and `add-product-validation-rules`'s validation to exist.
2. Add the form as a new route in the existing React app (from `add-product-list-page`), reachable both from the Products page's "Add Product" action (create mode) and from a product row/details view (edit mode, once IMD-7 exists).
3. No backend or schema changes; no rollback beyond removing the new route.
