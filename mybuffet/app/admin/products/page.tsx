'use client'
import { useState, useEffect } from 'react'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error cargando productos:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          image
        })
      })

      if (res.ok) {
        setMessage('✅ Producto creado exitosamente')
        setName('')
        setDescription('')
        setPrice('')
        setImage('')
        loadProducts() 
      } else {
        setMessage('❌ Error al crear producto')
      }
    } catch (error) {
      setMessage('❌ Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <h1 className="text-2xl font-semibold mb-6">Administración de Productos</h1>
      
      {/* Formulario de creación */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Crear Nuevo Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre del producto</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Precio ($)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL de la imagen</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="https://ejemplo.com/imagen.jpg"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Puedes usar imágenes de Unsplash o Pexels
            </p>
          </div>

          {image && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
              <img 
                src={image} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded border"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/128?text=Error'
                }}
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded w-full disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear Producto'}
          </button>

          {message && (
            <div className={`p-3 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Lista de productos existentes */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          Productos Existentes ({products.length})
        </h2>
        
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay productos aún. Crea el primero arriba 👆
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p: any) => (
              <div key={p.id} className="border rounded p-4 hover:shadow-md transition">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-40 object-cover rounded mb-3"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen'
                  }}
                />
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description}</p>
                <p className="text-pink-600 font-bold text-xl mt-2">${p.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
