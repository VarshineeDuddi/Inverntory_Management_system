'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const request = require('supertest');
const { createApp } = require('../src/app');

const DB_FILE = path.join(__dirname, '.scratch-api-test.db');
if (fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE);

const app = createApp(DB_FILE);

test.after(() => {
  app.locals.db.close();
  if (fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE);
});

test('GET /products returns an empty list when no products exist', async () => {
  const res = await request(app).get('/products');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { data: [] });
});

let createdId;

test('POST /products creates a valid product and returns it', async () => {
  const res = await request(app)
    .post('/products')
    .send({ name: 'Widget', sku: 'SKU-API-1', category: 'Widgets', unit_price: 9.99, quantity: 10, reorder_level: 2 });
  assert.equal(res.status, 201);
  assert.equal(res.body.data.name, 'Widget');
  assert.equal(res.body.data.sku, 'SKU-API-1');
  assert.ok(res.body.data.id);
  assert.ok(res.body.data.created_at);
  assert.ok(res.body.data.updated_at);
  createdId = res.body.data.id;
});

test('GET /products returns all products once populated', async () => {
  const res = await request(app).get('/products');
  assert.equal(res.status, 200);
  assert.equal(res.body.data.length, 1);
  assert.equal(res.body.data[0].id, createdId);
});

test('GET /products/:id returns the product for an existing id', async () => {
  const res = await request(app).get(`/products/${createdId}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.data.id, createdId);
});

test('GET /products/:id returns 404 for a nonexistent id', async () => {
  const res = await request(app).get('/products/999999');
  assert.equal(res.status, 404);
  assert.ok(res.body.error && res.body.error.message);
});

test('POST /products rejects a duplicate sku with 400', async () => {
  const res = await request(app)
    .post('/products')
    .send({ name: 'Other', sku: 'SKU-API-1', category: 'W', unit_price: 1, quantity: 1, reorder_level: 1 });
  assert.equal(res.status, 400);
  assert.ok(res.body.error && res.body.error.message);
});

test('POST /products rejects a negative unit_price with 400', async () => {
  const res = await request(app)
    .post('/products')
    .send({ name: 'Other', sku: 'SKU-API-2', category: 'W', unit_price: -1, quantity: 1, reorder_level: 1 });
  assert.equal(res.status, 400);
  assert.ok(res.body.error && res.body.error.message);
});

test('POST /products rejects a non-numeric quantity with 400', async () => {
  const res = await request(app)
    .post('/products')
    .send({ name: 'Other', sku: 'SKU-API-3', category: 'W', unit_price: 1, quantity: 'abc', reorder_level: 1 });
  assert.equal(res.status, 400);
  assert.ok(res.body.error && res.body.error.message);
});

test('PUT /products/:id updates an existing product and returns it', async () => {
  const res = await request(app).put(`/products/${createdId}`).send({ quantity: 42 });
  assert.equal(res.status, 200);
  assert.equal(res.body.data.quantity, 42);
});

test('PUT /products/:id returns 404 for a nonexistent id', async () => {
  const res = await request(app).put('/products/999999').send({ quantity: 1 });
  assert.equal(res.status, 404);
  assert.ok(res.body.error && res.body.error.message);
});

test('PUT /products/:id rejects an update that violates a constraint with 400', async () => {
  const res = await request(app).put(`/products/${createdId}`).send({ quantity: -5 });
  assert.equal(res.status, 400);
  assert.ok(res.body.error && res.body.error.message);
});

test('success responses across endpoints share the { data } envelope', async () => {
  const list = await request(app).get('/products');
  const single = await request(app).get(`/products/${createdId}`);
  assert.ok(Object.prototype.hasOwnProperty.call(list.body, 'data'));
  assert.ok(Object.prototype.hasOwnProperty.call(single.body, 'data'));
});

test('error responses across endpoints share the { error: { message } } envelope', async () => {
  const notFound = await request(app).get('/products/999999');
  const invalid = await request(app)
    .post('/products')
    .send({ name: 'X', sku: 'SKU-API-1', category: 'W', unit_price: 1, quantity: 1, reorder_level: 1 });
  for (const res of [notFound, invalid]) {
    assert.ok(res.body.error);
    assert.equal(typeof res.body.error.message, 'string');
  }
});
