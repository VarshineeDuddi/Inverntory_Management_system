'use strict';

function classifyConstraintError(err) {
  if (!err || err.code === undefined) return null;

  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return {
      type: 'duplicate_sku',
      message: 'A product with this sku already exists.',
    };
  }

  if (err.code === 'SQLITE_CONSTRAINT_CHECK') {
    return {
      type: 'invalid_numeric_field',
      message: 'unit_price, quantity, and reorder_level must be non-negative numbers.',
    };
  }

  if (typeof err.code === 'string' && err.code.startsWith('SQLITE_CONSTRAINT')) {
    return {
      type: 'invalid_product_data',
      message: 'The product data violates a database constraint.',
    };
  }

  return null;
}

module.exports = { classifyConstraintError };
