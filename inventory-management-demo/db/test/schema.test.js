#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { run: migrate } = require('../migrate.js');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');
const SCRATCH_DB = path.join(__dirname, '.scratch-schema-test.db');

let failures = 0;

function check(label, condition) {
  if (condition) {
    console.log(`  OK   ${label}`);
  } else {
    console.log(`  FAIL ${label}`);
    failures += 1;
  }
}

function expectThrows(label, fn) {
  try {
    fn();
    console.log(`  FAIL ${label} (expected an error, none was thrown)`);
    failures += 1;
  } catch (e) {
    console.log(`  OK   ${label}`);
  }
}

function sleepMs(ms) {
  const wait = new Int32Array(new SharedArrayBuffer(4));
  Atomics.wait(wait, 0, 0, ms);
}

if (fs.existsSync(SCRATCH_DB)) fs.unlinkSync(SCRATCH_DB);

migrate([SCRATCH_DB, path.join(MIGRATIONS_DIR, '001_create_products.sql')]);

const db = new DatabaseSync(SCRATCH_DB);
const insert = db.prepare(
  'INSERT INTO products (name, sku, category, unit_price, quantity, reorder_level) VALUES (?, ?, ?, ?, ?, ?)'
);

console.log('Scenario: Creating a product persists all fields');
const created = insert.run('Widget A', 'SKU-100', 'Widgets', 12.5, 20, 5);
const id = created.lastInsertRowid;
const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
check('id assigned', row.id === id);
check('name persisted', row.name === 'Widget A');
check('sku persisted', row.sku === 'SKU-100');
check('category persisted', row.category === 'Widgets');
check('unit_price persisted', row.unit_price === 12.5);
check('quantity persisted', row.quantity === 20);
check('reorder_level persisted', row.reorder_level === 5);
check('created_at set', typeof row.created_at === 'string' && row.created_at.length > 0);
check('updated_at set', typeof row.updated_at === 'string' && row.updated_at.length > 0);

console.log('Scenario: Updating a product refreshes updated_at');
sleepMs(50);
db.prepare('UPDATE products SET quantity = 21 WHERE id = ?').run(id);
const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
check('created_at unchanged after update', updated.created_at === row.created_at);
check('updated_at changed after update', updated.updated_at !== row.updated_at);

console.log('Scenario: Duplicate sku is rejected');
expectThrows('duplicate sku on insert', () =>
  insert.run('Widget B', 'SKU-100', 'Widgets', 5, 5, 1)
);

console.log('Scenario: Negative value is rejected');
expectThrows('negative unit_price rejected', () =>
  insert.run('X', 'SKU-101', 'W', -1, 5, 1)
);
expectThrows('negative quantity rejected', () =>
  insert.run('X', 'SKU-102', 'W', 5, -1, 1)
);
expectThrows('negative reorder_level rejected', () =>
  insert.run('X', 'SKU-103', 'W', 5, 5, -1)
);

console.log('Scenario: Non-numeric value is rejected');
expectThrows('non-numeric unit_price rejected', () =>
  insert.run('X', 'SKU-104', 'W', 'abc', 5, 1)
);
expectThrows('non-numeric quantity rejected', () =>
  insert.run('X', 'SKU-105', 'W', 5, 'abc', 1)
);
expectThrows('non-numeric reorder_level rejected', () =>
  insert.run('X', 'SKU-106', 'W', 5, 5, 'abc')
);

console.log('Scenario: Zero is accepted');
const zeroResult = insert.run('X', 'SKU-107', 'W', 0, 0, 0);
const zeroRow = db.prepare('SELECT * FROM products WHERE id = ?').get(zeroResult.lastInsertRowid);
check('zero unit_price accepted', zeroRow.unit_price === 0);
check('zero quantity accepted', zeroRow.quantity === 0);
check('zero reorder_level accepted', zeroRow.reorder_level === 0);

console.log('Scenario: Fresh database migration succeeds');
const freshDb = path.join(__dirname, '.scratch-fresh-migration.db');
if (fs.existsSync(freshDb)) fs.unlinkSync(freshDb);
migrate([freshDb, path.join(MIGRATIONS_DIR, '001_create_products.sql')]);
const freshConn = new DatabaseSync(freshDb);
const table = freshConn
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='products'")
  .get();
check('fresh migration creates products table', Boolean(table));
freshConn.close();
fs.unlinkSync(freshDb);

db.close();
fs.unlinkSync(SCRATCH_DB);

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('\nAll schema scenarios passed.');
  process.exitCode = 0;
}
