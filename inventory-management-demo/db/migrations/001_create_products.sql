-- Migration 001: create products table

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  category TEXT,
  unit_price REAL NOT NULL
    CHECK (typeof(unit_price) IN ('integer', 'real') AND unit_price >= 0),
  quantity INTEGER NOT NULL
    CHECK (typeof(quantity) IN ('integer', 'real') AND quantity >= 0),
  reorder_level INTEGER NOT NULL
    CHECK (typeof(reorder_level) IN ('integer', 'real') AND reorder_level >= 0),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TRIGGER IF NOT EXISTS trg_products_set_updated_at
AFTER UPDATE ON products
BEGIN
  UPDATE products
  SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  WHERE id = NEW.id;
END;
