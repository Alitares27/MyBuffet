'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import type { Product } from '@/types'

export default function AdminProductsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPrice, setEditingPrice] = useState<number | null>(null)
  const [editingStock, setEditingStock] = useState<number | null>(null)
  const [editPriceValue, setEditPriceValue] = useState('')
  const [editStockValue, setEditStockValue] = useState('')
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }
    loadProducts()
  }, [user, router])

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          image
        })
      })

      if (response.ok) {
        alert('✅ Producto creado exitosamente')
        setName('')
        setDescription('')
        setPrice('')
        setStock('')
        setImage('')
        setShowForm(false)
        loadProducts()
      } else {
        alert('❌ Error al crear producto')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error de conexión')
    }
  }

  const handleUpdatePrice = async (productId: number) => {
    if (!editPriceValue || parseFloat(editPriceValue) <= 0) {
      alert('❌ Ingresa un precio válido')
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseFloat(editPriceValue) })
      })

      if (response.ok) {
        alert('✅ Precio actualizado')
        setEditingPrice(null)
        setEditPriceValue('')
        loadProducts()
      } else {
        alert('❌ Error al actualizar precio')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error de conexión')
    }
  }

  const handleUpdateStock = async (productId: number) => {
    if (!editStockValue || parseInt(editStockValue) < 0) {
      alert('❌ Ingresa un stock válido')
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: parseInt(editStockValue) })
      })

      if (response.ok) {
        alert('✅ Inventario actualizado')
        setEditingStock(null)
        setEditStockValue('')
        loadProducts()
      } else {
        alert('❌ Error al actualizar inventario')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error de conexión')
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('✅ Producto eliminado')
        loadProducts()
      } else {
        alert('❌ Error al eliminar producto')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error de conexión')
    }
  }

  if (loading) {
    return <div className="text-center mt-20">Cargando productos...</div>
  }

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administrar Productos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded transition"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {/* Formulario de creación */}
      {showForm && (
        <form onSubmit={handleCreateProduct} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Crear Nuevo Producto</h2>
          
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Stock Inicial</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL de Imagen</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="https://ejemplo.com/imagen.jpg"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
            >
              Crear Producto
            </button>
          </div>
        </form>
      )}

      {/* Lista de productos */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4">Producto</th>
              <th className="text-left p-4">Descripción</th>
              <th className="text-left p-4">Precio</th>
              <th className="text-left p-4">Inventario</th>
              <th className="text-center p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600 max-w-xs">{product.description}</td>
                
                {/* Precio editable */}
                <td className="p-4">
                  {editingPrice === product.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={editPriceValue}
                        onChange={(e) => setEditPriceValue(e.target.value)}
                        className="w-24 border rounded px-2 py-1"
                      />
                      <button
                        onClick={() => handleUpdatePrice(product.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          setEditingPrice(null)
                          setEditPriceValue('')
                        }}
                        className="bg-gray-400 text-white px-2 py-1 rounded text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-pink-600">${product.price}</span>
                      <button
                        onClick={() => {
                          setEditingPrice(product.id)
                          setEditPriceValue(product.price.toString())
                        }}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </td>

                {/* Stock editable */}
                <td className="p-4">
                  {editingStock === product.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editStockValue}
                        onChange={(e) => setEditStockValue(e.target.value)}
                        className="w-20 border rounded px-2 py-1"
                      />
                      <button
                        onClick={() => handleUpdateStock(product.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          setEditingStock(null)
                          setEditStockValue('')
                        }}
                        className="bg-gray-400 text-white px-2 py-1 rounded text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${
                        product.stock === 0 ? 'text-red-600' :
                        product.stock < 10 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {product.stock} unidades
                      </span>
                      <button
                        onClick={() => {
                          setEditingStock(product.id)
                          setEditStockValue(product.stock.toString())
                        }}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
