## 1. Migration tooling setup

- [ ] 1.1 Create a `db/migrations/` directory and add a `001_create_products.sql` file, and verify the file exists and is empty/scaffolded
- [ ] 1.2 Add a migration runner script (e.g. `db/migrate.sh` or an npm script) that applies a given `.sql` file to a target SQLite file via the `sqlite3` CLI, and verify running it with `--help`/no args prints usage without error

## 2. Products table DDL

- [ ] 2.1 Write the `CREATE TABLE products` statement in `001_create_products.sql` with columns `id` (PK, autoincrement), `name`, `sku`, `category`, `unit_price`, `quantity`, `reorder_level`, `created_at`, `updated_at`, and verify the columns match specs/product-catalog/spec.md's "Product record fields" requirement
- [ ] 2.2 Add a `UNIQUE` constraint on `sku`, and verify a second `INSERT` reusing an existing `sku` raises a constraint error
- [ ] 2.3 Add `CHECK` constraints on `unit_price`, `quantity`, and `reorder_level` that reject negative values and non-numeric values (per design.md's SQLite type-affinity risk, e.g. `CHECK (typeof(unit_price) IN ('integer','real') AND unit_price >= 0)`), and verify inserting a negative value and a text value into each column both raise a constraint error, while `0` is accepted
- [ ] 2.4 Add `created_at` and `updated_at` columns with a default of the current timestamp, and add an `AFTER UPDATE` trigger that refreshes `updated_at`, and verify: inserting a row sets both timestamps, and updating that row changes `updated_at` while `created_at` stays the same

## 3. Migration execution and seed data

- [ ] 3.1 Run the migration script against a fresh, empty SQLite file, and verify the `products` table exists afterward (e.g. via `sqlite3 <db> ".schema products"`) with no manual intervention needed
- [ ] 3.2 Add a `002_seed_products.sql` (or equivalent seed script) inserting at least one sample product, and verify it runs cleanly against the migrated database with no constraint violations

## 4. Verification suite

- [ ] 4.1 Add an automated test script that runs the migration against a scratch SQLite file and asserts each spec scenario: all fields persist on insert, duplicate `sku` is rejected, negative/non-numeric `unit_price`/`quantity`/`reorder_level` are rejected, `0` is accepted, and `updated_at` changes on update while `created_at` does not — verify the test script exits 0
