'use strict';

const NUMERIC_FIELDS = ['unit_price', 'quantity', 'reorder_level'];

function isBlank(value) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

function isValidNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function hasField(fields, key) {
  return Object.prototype.hasOwnProperty.call(fields, key);
}

function validateRequiredField(fields, key, { partial }) {
  const applies = !partial || hasField(fields, key);
  if (!applies) return null;
  if (isBlank(fields[key])) {
    return { field: key, message: `${key} is required` };
  }
  return null;
}

function validateNumericField(fields, key) {
  if (!hasField(fields, key) || fields[key] === undefined) return null;
  const value = fields[key];
  if (!isValidNumber(value)) {
    return { field: key, message: `${key} must be a number` };
  }
  if (value < 0) {
    return { field: key, message: `${key} cannot be negative` };
  }
  return null;
}

function validateSkuUniqueness(db, fields, { partial, excludeId }) {
  if (partial && !hasField(fields, 'sku')) return null;
  if (isBlank(fields.sku)) return null; // presence check already reports this

  const row = excludeId === undefined
    ? db.prepare('SELECT id FROM products WHERE sku = ?').get(fields.sku)
    : db.prepare('SELECT id FROM products WHERE sku = ? AND id != ?').get(fields.sku, excludeId);

  if (row) {
    return { field: 'sku', message: 'sku already exists' };
  }
  return null;
}

function validateProduct(db, fields, { partial = false, excludeId } = {}) {
  const errors = [];

  const nameError = validateRequiredField(fields, 'name', { partial });
  if (nameError) errors.push(nameError);

  const skuError = validateRequiredField(fields, 'sku', { partial });
  if (skuError) errors.push(skuError);

  for (const key of NUMERIC_FIELDS) {
    const err = validateNumericField(fields, key);
    if (err) errors.push(err);
  }

  if (!skuError) {
    const uniquenessError = validateSkuUniqueness(db, fields, { partial, excludeId });
    if (uniquenessError) errors.push(uniquenessError);
  }

  return errors;
}

module.exports = { validateProduct };
