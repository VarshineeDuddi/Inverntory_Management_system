import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AddEditProductPage from './AddEditProductPage'
import ProductsPage from './ProductsPage'

const sampleProducts = [
  { id: 1, name: 'Widget Alpha', sku: 'WID-ALPHA', category: 'Widgets', unit_price: 9.99, quantity: 0, reorder_level: 5 },
  { id: 2, name: 'Widget Beta', sku: 'WID-BETA', category: 'Widgets', unit_price: 9.99, quantity: 5, reorder_level: 5 },
  { id: 3, name: 'Gadget Gamma', sku: 'GAD-GAMMA', category: 'Gadgets', unit_price: 14.5, quantity: 6, reorder_level: 5 },
]

function mockFetchOnce(data) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data }),
  })
}

function renderProductsPage() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/products/new" element={<AddEditProductPage mode="create" />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProductsPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows every product on page load', async () => {
    mockFetchOnce(sampleProducts)
    renderProductsPage()

    expect(await screen.findByText('Widget Alpha')).toBeInTheDocument()
    expect(screen.getByText('Widget Beta')).toBeInTheDocument()
    expect(screen.getByText('Gadget Gamma')).toBeInTheDocument()
  })

  it('shows an empty state when no products exist', async () => {
    mockFetchOnce([])
    renderProductsPage()

    expect(await screen.findByText('No products yet.')).toBeInTheDocument()
  })

  describe('search', () => {
    beforeEach(() => {
      mockFetchOnce(sampleProducts)
    })

    it('filters by partial name match', async () => {
      renderProductsPage()
      await screen.findByText('Widget Alpha')

      await userEvent.type(screen.getByRole('searchbox'), 'gamma')

      expect(screen.getByText('Gadget Gamma')).toBeInTheDocument()
      expect(screen.queryByText('Widget Alpha')).not.toBeInTheDocument()
      expect(screen.queryByText('Widget Beta')).not.toBeInTheDocument()
    })

    it('filters by partial sku match', async () => {
      renderProductsPage()
      await screen.findByText('Widget Alpha')

      await userEvent.type(screen.getByRole('searchbox'), 'wid-beta')

      expect(screen.getByText('Widget Beta')).toBeInTheDocument()
      expect(screen.queryByText('Widget Alpha')).not.toBeInTheDocument()
      expect(screen.queryByText('Gadget Gamma')).not.toBeInTheDocument()
    })

    it('shows a no-match indicator when nothing matches', async () => {
      renderProductsPage()
      await screen.findByText('Widget Alpha')

      await userEvent.type(screen.getByRole('searchbox'), 'zzz-nonexistent')

      expect(screen.getByText('No products match your search.')).toBeInTheDocument()
      expect(screen.queryByText('Widget Alpha')).not.toBeInTheDocument()
    })

    it('restores the full list when the search is cleared', async () => {
      renderProductsPage()
      await screen.findByText('Widget Alpha')

      const search = screen.getByRole('searchbox')
      await userEvent.type(search, 'gamma')
      expect(screen.queryByText('Widget Alpha')).not.toBeInTheDocument()

      await userEvent.clear(search)

      expect(screen.getByText('Widget Alpha')).toBeInTheDocument()
      expect(screen.getByText('Widget Beta')).toBeInTheDocument()
      expect(screen.getByText('Gadget Gamma')).toBeInTheDocument()
    })
  })

  describe('stock status per row', () => {
    it('shows the correct status for each boundary case', async () => {
      mockFetchOnce(sampleProducts)
      renderProductsPage()
      await screen.findByText('Widget Alpha')

      const alphaRow = screen.getByText('Widget Alpha').closest('tr')
      const betaRow = screen.getByText('Widget Beta').closest('tr')
      const gammaRow = screen.getByText('Gadget Gamma').closest('tr')

      expect(within(alphaRow).getByText('Out of Stock')).toBeInTheDocument()
      expect(within(betaRow).getByText('Low Stock')).toBeInTheDocument()
      expect(within(gammaRow).getByText('In Stock')).toBeInTheDocument()
    })
  })

  it('navigates to the Add/Edit form in create mode when Add Product is selected', async () => {
    mockFetchOnce(sampleProducts)
    renderProductsPage()
    await screen.findByText('Widget Alpha')

    await userEvent.click(screen.getByRole('link', { name: 'Add Product' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Add Product' })).toBeInTheDocument()
    })
  })
})
