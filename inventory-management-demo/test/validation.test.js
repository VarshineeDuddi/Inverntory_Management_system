'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const request = require('supertest');
const { createApp } = require('../src/app');

const DB_FILE = path.join(__dirname, '.scratch-validation-test.db');
if (fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE);

const app = createApp(DB_FILE);
const db = app.locals.db;

test.after(() => {
  db.close();
  if (fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE);
});

function countRows() {
  return db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
}

const validPayload = {
  name: 'Widget',
  sku: 'SKU-VAL-1',
  category: 'Widgets',
  unit_price: 9.99,
  quantity: 10,
  reorder_level: 2,
};

test('Creating without a name is rejected', async () => {
  const before = countRows();
  const res = await request(app)
    .post('/products')
    .send({ ...validPayload, sku: 'SKU-VAL-2', name: undefined });
  assert.equal(res.status, 400);
  assert.equal(res.body.error.message, 'name is required');
  assert.equal(countRows(), before);
});

test('Creating with a blank name is rejected', async () => {
  const before = countRows();
  const res = await request(app).post('/products').send({ ...validPayload, sku: 'SKU-VAL-3', name: '   ' });
  assert.equal(res.status, 400);
  assert.equal(res.body.error.message, 'name is required');
  assert.equal(countRows(), before);
});

test('Creating without a sku is rejected', async () => {
  const before = countRows();
  const res = await request(app).post('/products').send({ ...validPayload, sku: undefined });
  assert.equal(res.status, 400);
  assert.equal(res.body.error.message, 'sku is required');
  assert.equal(countRows(), before);
});

test('Creating with a blank sku is rejected', async () => {
  const before = countRows();
  const res = await request(app).post('/products').send({ ...validPayload, sku: '' });
  assert.equal(res.status, 400);
  assert.equal(res.body.error.message, 'sku is required');
  assert.equal(countRows(), before);
});

let createdId;

test('Creating a valid product succeeds (setup for update scenarios)', async () => {
  const res = await request(app).post('/products').send(validPayload);
  assert.equal(res.status, 201);
  createdId = res.body.data.id;
});

test('Updating a product to a blank name is rejected', async () => {
  const before = db.prepare('SELECT * FROM products WHERE id = ?').get(createdId);
  const res = await request(app).put(`/products/${createdId}`).send({ name: '' });
  assert.equal(res.status, 400);
  assert.equal(res.body.error.message, 'name is required');
  const after = db.prepare('SELECT * FROM products WHERE id = ?').get(createdId);
  assert.deepEqual(after, before);
});

test('Updating a product to a blank sku is rejected', async () => {
  const before = db.prepare('SELECT * FROM products WHERE id = ?').get(createdId);
  const res = await request(app).put(`/products/${createdId}`).send({ sku: '' });
  assert.equal(res.status, 400);
  assert.equal(res.body.error.message, 'sku is required');
  const after = db.prepare('SELECT * FROM products WHERE id = ?').get(createdId);
  assert.deepEqual(after, before);
});

test('A validation error names the field and reason: required field', async () => {
  const res = await request(app).post('/products').send({ ...validPayload, sku: 'SKU-VAL-4', name: '' });
  assert.equal(res.status, 400);
  assert.match(res.body.error.message, /name/);
});

test('A validation error names the field and reason: duplicate sku', async () => {
  const res = await request(app).post('/products').send({ ...validPayload, sku: validPayload.sku });
  assert.equal(res.status, 400);
  assert.match(res.body.error.message, /sku/);
});

test('A validation error names the field and reason: negative numeric field', async () => {
  const res = await request(app)
    .post('/products')
    .send({ ...validPayload, sku: 'SKU-VAL-5', unit_price: -1 });
  assert.equal(res.status, 400);
  assert.match(res.body.error.message, /unit_price/);
});

test('Regression: a valid create still succeeds end-to-end through validation', async () => {
  const res = await request(app).post('/products').send({ ...validPayload, sku: 'SKU-VAL-REGRESSION-1' });
  assert.equal(res.status, 201);
  assert.equal(res.body.data.sku, 'SKU-VAL-REGRESSION-1');
});

test('Regression: a valid partial update still succeeds end-to-end through validation', async () => {
  const res = await request(app).put(`/products/${createdId}`).send({ quantity: 55 });
  assert.equal(res.status, 200);
  assert.equal(res.body.data.quantity, 55);
});
