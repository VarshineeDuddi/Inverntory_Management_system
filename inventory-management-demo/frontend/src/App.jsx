import { Route, Routes } from 'react-router-dom'
import AddEditProductPage from './pages/AddEditProductPage'
import ProductsPage from './pages/ProductsPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductsPage />} />
      <Route path="/products/new" element={<AddEditProductPage mode="create" />} />
    </Routes>
  )
}

export default App
