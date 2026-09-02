import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../api/products'
import { deriveStockStatus } from '../lib/stockStatus'
import './ProductsPage.css'

function statusClassName(status) {
  return `status-badge status-badge--${status.toLowerCase().replace(/\s+/g, '-')}`
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchProducts()
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return products
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query),
    )
  }, [products, search])

  return (
    <div className="products-page">
      <header className="products-page__header">
        <h1>Products</h1>
        <Link to="/products/new" className="products-page__add-button">
          Add Product
        </Link>
      </header>

      <input
        type="search"
        aria-label="Search products"
        placeholder="Search by name or SKU"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="products-page__search"
      />

      {loading && <p>Loading products…</p>}
      {error && (
        <p role="alert" className="products-page__error">
          Failed to load products.
        </p>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <p className="products-page__empty">
          {products.length === 0 ? 'No products yet.' : 'No products match your search.'}
        </p>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <table className="products-page__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const status = deriveStockStatus(product.quantity, product.reorder_level)
              return (
                <tr key={product.id}>
                  <td data-label="Name">{product.name}</td>
                  <td data-label="SKU">{product.sku}</td>
                  <td data-label="Category">{product.category}</td>
                  <td data-label="Quantity">{product.quantity}</td>
                  <td data-label="Status">
                    <span className={statusClassName(status)}>{status}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
