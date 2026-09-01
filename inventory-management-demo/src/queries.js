'use strict';

const UPDATABLE_FIELDS = ['name', 'sku', 'category', 'unit_price', 'quantity', 'reorder_level'];

function listProducts(db) {
  return db.prepare('SELECT * FROM products ORDER BY id').all();
}

function getProductById(db, id) {
  return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
}

function createProduct(db, { name, sku, category, unit_price, quantity, reorder_level }) {
  const result = db
    .prepare(
      'INSERT INTO products (name, sku, category, unit_price, quantity, reorder_level) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(name, sku, category, unit_price, quantity, reorder_level);
  return getProductById(db, result.lastInsertRowid);
}

function updateProduct(db, id, fields) {
  const keys = UPDATABLE_FIELDS.filter((key) => Object.prototype.hasOwnProperty.call(fields, key));
  if (keys.length === 0) {
    return getProductById(db, id);
  }

  const setClause = keys.map((key) => `${key} = ?`).join(', ');
  const values = keys.map((key) => fields[key]);
  const result = db.prepare(`UPDATE products SET ${setClause} WHERE id = ?`).run(...values, id);

  if (result.changes === 0) {
    return undefined;
  }
  return getProductById(db, id);
}

module.exports = { listProducts, getProductById, createProduct, updateProduct };
