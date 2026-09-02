export async function fetchProducts() {
  const res = await fetch('/products')
  if (!res.ok) {
    throw new Error(`Failed to fetch products (status ${res.status})`)
  }
  const body = await res.json()
  return body.data
}
