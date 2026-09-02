import { describe, expect, it } from 'vitest'
import { deriveStockStatus } from './stockStatus'

describe('deriveStockStatus', () => {
  it('returns Out of Stock when quantity is zero', () => {
    expect(deriveStockStatus(0, 5)).toBe('Out of Stock')
  })

  it('returns Low Stock when quantity equals the reorder level', () => {
    expect(deriveStockStatus(5, 5)).toBe('Low Stock')
  })

  it('returns In Stock when quantity is one above the reorder level', () => {
    expect(deriveStockStatus(6, 5)).toBe('In Stock')
  })
})
