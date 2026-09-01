## Context

`inventory-management-demo/` has no existing application code, database, or migration tooling — this is the first story in the project (see proposal.md - Why). No backend language or framework has been chosen yet by any later story either, so the schema and migration approach must not lock in assumptions the CRUD API story (IMD-3) hasn't made.

## Goals / Non-Goals

**Goals:**
- Pick a concrete database engine and migration format for the `products` schema described in specs/product-catalog/spec.md.
- Keep the choice framework-agnostic so it doesn't constrain the tech stack of the CRUD API story that consumes it.

**Non-Goals:**
- Choosing the backend language/framework for the CRUD API (IMD-3) — out of scope for a schema-only story.
- Production-grade concerns (connection pooling, replication, backup strategy) — this is a demo.

## Decisions

**Database engine: SQLite.**
Rationale: this is a demo project with no deployment target specified anywhere in the BRD or Zoho Sprints. SQLite needs no server process or credentials, runs identically on any developer machine or CI runner, and is sufficient for the scale a demo requires.
Alternatives considered:
- *PostgreSQL* — more production-realistic, but requires provisioning a server/connection string with no stated deployment environment to configure it for; unnecessary overhead for a demo.
- *In-memory only* — rejected because the acceptance criteria require a migration/seed script that "runs cleanly," implying a durable, file-backed schema.

**Migration format: a plain `.sql` DDL script, no ORM.**
Rationale: no backend framework has been chosen yet (Non-Goals). A plain SQL migration file is runnable by any future backend without committing to an ORM's schema-definition syntax (e.g., Prisma, SQLAlchemy, Sequelize). The CRUD API story can layer whatever ORM/query builder it needs on top of the existing tables.
Alternatives considered:
- *ORM migration (e.g., Prisma/Knex)* — rejected for now because it would force a language/tooling choice this story shouldn't make.

**Constraint enforcement: database-level, not application-level.**
Rationale: the spec's unique-`sku` and non-negative-numeric requirements must hold regardless of which application code eventually writes to this schema. Enforcing them as `UNIQUE` and `CHECK` constraints in the DDL means every future write path (CRUD API, seed script, ad-hoc tooling) gets the guarantee for free, rather than depending on every caller to re-implement it.

## Risks / Trade-offs

- [SQLite's relaxed type affinity could let a non-numeric value slip past a naive `CHECK` constraint] → Mitigate by writing explicit `CHECK` expressions that validate both type and non-negativity (e.g., `CHECK (typeof(unit_price) IN ('integer','real') AND unit_price >= 0)`), and covering this in the migration's test/seed run.
- [Choosing SQLite now could require a migration to a server-based database later if the demo needs concurrent multi-user access] → Mitigation: the plain-SQL DDL approach (no ORM lock-in) keeps a future switch to PostgreSQL a schema-porting exercise rather than a full rewrite.

## Migration Plan

1. Add a single migration file that creates the `products` table with all columns, the unique constraint on `sku`, and non-negative `CHECK` constraints on `unit_price`, `quantity`, and `reorder_level`.
2. Add a script (e.g., `npm run migrate` equivalent or a plain shell/SQL runner — concrete command decided in tasks.md) that applies the migration to a fresh SQLite file.
3. No rollback is required for this change: it is the first schema in the project, so there is no prior state to roll back to. A rollback would simply delete the generated database file.
