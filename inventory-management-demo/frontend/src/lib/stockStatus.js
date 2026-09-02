export function deriveStockStatus(quantity, reorderLevel) {
  if (quantity === 0) return 'Out of Stock'
  if (quantity <= reorderLevel) return 'Low Stock'
  return 'In Stock'
}
