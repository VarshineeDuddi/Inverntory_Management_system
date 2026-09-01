'use strict';

const express = require('express');
const { openDatabase } = require('./db');
const { listProducts, getProductById, createProduct, updateProduct } = require('./queries');
const { classifyConstraintError } = require('./errors');

function sendError(res, status, message) {
  res.status(status).json({ error: { message } });
}

function createApp(dbFile) {
  const db = openDatabase(dbFile);
  const app = express();
  app.use(express.json());

  app.get('/products', (req, res) => {
    res.status(200).json({ data: listProducts(db) });
  });

  app.get('/products/:id', (req, res) => {
    const product = getProductById(db, req.params.id);
    if (!product) {
      return sendError(res, 404, 'Product not found.');
    }
    res.status(200).json({ data: product });
  });

  app.post('/products', (req, res) => {
    try {
      const product = createProduct(db, req.body || {});
      res.status(201).json({ data: product });
    } catch (err) {
      const classified = classifyConstraintError(err);
      if (classified) {
        return sendError(res, 400, classified.message);
      }
      throw err;
    }
  });

  app.put('/products/:id', handleUpdate);
  app.patch('/products/:id', handleUpdate);

  function handleUpdate(req, res) {
    try {
      const updated = updateProduct(db, req.params.id, req.body || {});
      if (!updated) {
        return sendError(res, 404, 'Product not found.');
      }
      res.status(200).json({ data: updated });
    } catch (err) {
      const classified = classifyConstraintError(err);
      if (classified) {
        return sendError(res, 400, classified.message);
      }
      throw err;
    }
  }

  app.locals.db = db;
  return app;
}

module.exports = { createApp };
