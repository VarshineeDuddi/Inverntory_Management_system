## Why

The product endpoints proposed in `add-product-crud-api` reject a duplicate sku or a negative numeric field, but only by catching the database's constraint errors after attempting a write — nothing yet enforces that `name` and `sku` are present, and nothing guarantees invalid data is rejected *before* it reaches the database. The BRD's business rules need a definitive, pre-persistence validation contract so bad data never gets as far as a write attempt.

Source of truth: Zoho Sprints item **IMD-4** ("Implement product validation and business rules", epic: Product Catalog Management).

## What Changes

- Require `name` and `sku` to be present and non-blank when creating a product, and when a request updates either field.
- Validate every business rule (required fields, unique sku, non-negative numeric fields) before attempting to persist a create or update, rather than relying solely on a database constraint failure.
- Return a 4xx response whose error message identifies which field failed validation and why, for every rule violation.

## Capabilities

### New Capabilities
- `product-validation`: The business-rule validation contract for product create/update requests — which fields are required, and the requirement that every validation failure produces a clear, field-identifying 4xx error.

### Modified Capabilities
- None as a formal delta. This change complements two capabilities proposed by earlier, not-yet-archived changes rather than modifying them: `product-catalog` (`add-product-database-schema`) already constrains sku uniqueness and non-negative numerics at the database level, and `product-api` (`add-product-crud-api`) already specifies that violating those rules returns a 4xx. This change adds the previously-unspecified required-field rule and tightens error-message clarity; it does not change either existing capability's stated behavior, so no delta is filed against them.

## Impact

- **Affected code**: The create/update request handling added by `add-product-crud-api` gains a validation step that runs before the database call.
- **Dependency**: Depends on `add-product-crud-api` (Zoho IMD-3), which itself depends on `add-product-database-schema` (Zoho IMD-2). Neither prior change has been applied/archived yet; this proposal builds on their design decisions (Node.js + Express, `better-sqlite3`, no ORM) without re-litigating them.
- **Architectural note for design.md**: `add-product-crud-api`'s design chose to catch database constraint errors rather than revalidate in application code. This story's "invalid data never reaches the database" framing calls for an application-level validation layer in front of the database call. Design.md resolves how these two decisions coexist.
