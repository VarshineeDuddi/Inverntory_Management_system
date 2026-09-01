## Context

`add-product-crud-api`'s design chose to let `better-sqlite3` enforce uniqueness and non-negativity via the schema's `UNIQUE`/`CHECK` constraints, and to map the resulting driver error to a 4xx response after the write attempt fails (see that change's design.md - "Constraint violations become 4xx responses, not application-level revalidation"). This story's premise — "so invalid data never reaches the database" — asks for validation before the write is attempted, and adds a rule (`name`/`sku` required) that the database schema doesn't enforce at all today (see specs/product-validation/spec.md).

## Goals / Non-Goals

**Goals:**
- Add an application-level validation step that runs before any create/update reaches the database, covering required fields, sku uniqueness, and non-negative numerics.
- Reconcile this with `add-product-crud-api`'s existing DB-error-mapping decision rather than discarding it.
- Produce error messages that name the specific invalid field, per specs/product-validation/spec.md.

**Non-Goals:**
- Changing the `products` table schema — required-field enforcement is added in application code, not as a new `NOT NULL` migration, since that would reopen the already-proposed `add-product-database-schema` change.
- Rate limiting, sanitization against injection, or other security-hardening validation — not requested by the BRD or IMD-4's acceptance criteria.

## Decisions

**Validation runs as a pre-write step, with the database constraints kept as a safety net, not removed.**
Rationale: running the same checks (required fields, sku uniqueness, non-negative numerics) in application code before the `INSERT`/`UPDATE` satisfies "invalid data never reaches the database" for the normal request path. The database's `UNIQUE`/`CHECK` constraints and `add-product-crud-api`'s existing error-mapping code are kept in place rather than removed: a uniqueness check followed immediately by an insert has a narrow race window (two concurrent requests with the same sku), and the database remains the final authority that closes it. Nothing in `add-product-crud-api`'s design is invalidated — its error-mapping path simply becomes a fallback that should rarely trigger once pre-write validation is in place.
Alternatives considered:
- *Remove the DB constraints and rely solely on application validation* — rejected: reopens `add-product-database-schema`, and drops the concurrency safety net.
- *Rely solely on DB-error mapping (no pre-write validation), as `add-product-crud-api` originally did* — rejected: cannot express "required fields," since there's no `NOT NULL` constraint on `name`/`sku` today (Non-Goals), and doesn't satisfy this story's explicit "never reaches the database" framing.

**Required-field and non-blank checks happen in application code only (no schema change).**
Rationale: per Non-Goals, adding a `NOT NULL` constraint would mean amending `add-product-database-schema`'s migration after the fact. A simple presence/non-blank check on `name` and `sku` in the validation step achieves the same externally observable behavior (specs/product-validation/spec.md) without touching that schema.

**Validation is a single shared function called by both the create and update handlers.**
Rationale: `add-product-crud-api`'s create and update routes are separate handlers; sharing one validation function (rather than duplicating checks in each) keeps the required-field, sku-uniqueness pre-check, and numeric-range rules consistent between create and update, and keeps the field-naming error format (specs/product-validation/spec.md) in one place.
Alternatives considered:
- *Separate validation logic per route* — rejected: duplicates the same rules twice and risks the two routes drifting out of sync.

**Sku-uniqueness pre-check queries the database for an existing row with the same sku before writing.**
Rationale: this is the only one of the four business rules that inherently requires a database read (required fields and numeric ranges can be checked against the payload alone). Accepting one extra read per create/update is a reasonable cost for a demo-scale SQLite table.

## Risks / Trade-offs

- [A race between the sku pre-check and the write could still let two concurrent requests both pass validation for the same sku] → Mitigation: the existing `UNIQUE` constraint and `add-product-crud-api`'s error-mapping path remain in place as the final backstop; the rare race case still surfaces as a correct 4xx, just via the fallback path instead of the pre-check.
- [Two places now express "what makes a product valid" — application-level checks and DB constraints] → Mitigation: the application checks are written to mirror the DB constraints exactly (same fields, same non-negative rule), and the DB constraints are treated as the definitive backstop, not a second, independently-evolving source of truth.

## Migration Plan

1. Requires `add-product-crud-api`'s create/update handlers to exist first, since the validation step is inserted in front of them.
2. Add the shared validation function and call it from both handlers before their existing database call.
3. No schema or rollback changes — this only adds an application-code check in front of an existing write path.
