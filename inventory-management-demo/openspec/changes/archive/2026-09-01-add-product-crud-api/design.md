## Context

No backend language or framework exists in the repository yet — `add-product-database-schema`'s design.md deliberately left that choice open (Non-Goal) so the schema wouldn't presume one. This change is the first to need a running server, so it has to make that call. It builds directly on that change's `products` SQLite table (columns `id`, `name`, `sku`, `category`, `unit_price`, `quantity`, `reorder_level`, `created_at`, `updated_at`; unique `sku`; non-negative `CHECK` constraints), which is proposed but not yet applied — see proposal.md - Impact.

## Goals / Non-Goals

**Goals:**
- Pick a concrete backend language/framework and data-access approach for the four CRUD endpoints.
- Surface the schema's existing database-level constraints (unique sku, non-negative numerics) as client-facing 4xx errors, without re-implementing that validation logic in application code.
- Define one concrete success/error response shape that satisfies the spec's "consistent JSON structure" requirement.

**Non-Goals:**
- Authentication/authorization — not requested by the BRD or IMD-3's acceptance criteria.
- Pagination, filtering, or sorting on `GET /products` — not requested; the AC only asks for "the list of all products."
- Production concerns (rate limiting, connection pooling, horizontal scaling) — this is a demo.

## Decisions

**Backend: Node.js + Express.**
Rationale: nothing in the repo, BRD, or prior change constrains the backend language, so the choice is free. Express is minimal-boilerplate for four straightforward REST routes and has no learning-curve cost for maintaining this demo.
Alternatives considered:
- *Python + Flask* — equally valid, no technical reason to prefer it; not chosen only to avoid introducing a second language ecosystem alongside the Node.js-based OpenSpec tooling already present in this workspace.
- *Fastify* — a reasonable Express alternative, but Express's ubiquity makes it the lower-friction default for a demo nobody has to onboard onto.

**Data access: `better-sqlite3`, direct parameterized SQL, no ORM.**
Rationale: `add-product-database-schema`'s design already rejected an ORM so the schema migration wouldn't lock in a framework. Introducing an ORM here would contradict that decision after the fact. `better-sqlite3`'s synchronous API matches SQLite's local-file model and keeps queries as plain, auditable SQL.
Alternatives considered:
- *`sqlite3` (async/callback-based driver)* — more ceremony (callbacks/promise-wrapping) for no benefit at this scale.
- *An ORM (Prisma/Sequelize/Knex)* — rejected for consistency with the schema change's own decision.

**Constraint violations become 4xx responses, not application-level revalidation.**
Rationale: the schema already enforces uniqueness and non-negativity via `UNIQUE`/`CHECK` constraints. Rather than duplicating those rules in JavaScript, the API catches the SQLite constraint-violation error, inspects its constraint-specific error code (e.g. `SQLITE_CONSTRAINT_UNIQUE` vs `SQLITE_CONSTRAINT_CHECK`), and maps it to a 4xx response. This keeps a single source of truth for what makes a product record valid.

**Response envelope.**
- Success: `{ "data": <record or array of records> }` with a 2xx status (200 for read/update, 201 for create).
- Error: `{ "error": { "message": <human-readable string> } }` with 404 for not-found and 400 for validation failures.
This is a design-level choice satisfying the spec's "consistent JSON structure" requirement; the spec itself intentionally didn't dictate one exact shape.

## Risks / Trade-offs

- [`better-sqlite3` is synchronous and blocks the event loop per query] → Acceptable at demo scale (single local SQLite file, no concurrent load); would need reconsideration if this ever became a real multi-user deployment.
- [Mapping a raw SQLite error to the right 4xx requires reading its constraint-specific code, not just its message text] → Mitigation: branch on the driver's structured error code, and fall back to a generic 400 "invalid product data" for any constraint violation the code doesn't explicitly recognize, rather than leaking a raw database error or crashing.
- [This change assumes `add-product-database-schema` is applied first] → If that change's schema isn't in place, every endpoint fails at the database layer; tasks.md sequences the migration as a prerequisite step.

## Migration Plan

1. Apply `add-product-database-schema`'s migration first so the `products` table exists.
2. Stand up the Express server and wire the four routes to the existing SQLite file — no new schema changes are introduced by this change.
3. No rollback beyond stopping the server and/or reverting the code change is needed; no data migration occurs here.
