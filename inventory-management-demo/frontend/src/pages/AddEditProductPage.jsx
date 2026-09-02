export default function AddEditProductPage({ mode }) {
  return (
    <div className="add-edit-product-page">
      <h1>{mode === 'create' ? 'Add Product' : 'Edit Product'}</h1>
      <p>The product form will be implemented separately.</p>
    </div>
  )
}
